import { BrokerAuthError, BrokerResponseError, type BrokerAdapter } from './adapter.ts';
import type { AccountType, BrokerClientRecord, DailyAccountActivity } from '../domain/types.ts';

/**
 * Exness Partnership API.
 *
 * Confirmed from Exness' own partner documentation:
 *   - the schema is served at {baseUrl}/api/schema/
 *   - POST /api/auth with the Partner Area login returns a token
 *   - that token goes on every later call as `Authorization: JWT <token>`
 *   - /api/partner/summary/ is the cheap call that confirms the token works
 *   - rewards are computed daily and paid by the end of the next day, so a
 *     job that asks for yesterday will get a complete answer
 *
 * NOT yet confirmed: the path and field names of the client list and the
 * per-client reward report. Every assumption about those lives in ENDPOINTS
 * and in the two `map*` functions below, so checking them against the live
 * schema is a single small diff rather than a hunt through the file. Until
 * that is done, the factory should keep handing out MockBrokerAdapter.
 */

const DEFAULT_BASE_URL = 'https://my.exnessaffiliates.com';

/** Assumed. Verify against {baseUrl}/api/schema/ before enabling in production. */
const ENDPOINTS = {
  auth: '/api/auth/',
  summary: '/api/partner/summary/',
  clients: '/api/reports/clients/',
  dailyRewards: '/api/reports/rewards/',
} as const;

export interface ExnessCredentials {
  login: string;
  password: string;
}

export interface ExnessAdapterOptions {
  credentials: ExnessCredentials;
  baseUrl?: string;
  /** Injected in tests. Defaults to global fetch. */
  fetchImpl?: typeof fetch;
  now?: () => Date;
}

/**
 * Exness account names map onto our shared vocabulary. Anything unrecognised
 * becomes 'unknown' rather than being guessed at, because account type drives
 * the rebate rate and a wrong guess pays the wrong amount.
 */
function mapAccountType(raw: string | null | undefined): AccountType {
  const name = (raw ?? '').toLowerCase();
  if (name.includes('cent')) return 'standard_cent';
  if (name.includes('zero')) return 'zero';
  if (name.includes('raw')) return 'raw';
  if (name.includes('pro')) return 'pro';
  if (name.includes('standard')) return 'standard';
  return 'unknown';
}

function parseDay(raw: unknown): Date | null {
  if (typeof raw !== 'string' || raw === '') return null;
  const parsed = new Date(raw.length <= 10 ? `${raw}T00:00:00Z` : raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(
    Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()),
  );
}

function toNumber(raw: unknown): number {
  const n = typeof raw === 'string' ? Number(raw) : typeof raw === 'number' ? raw : NaN;
  return Number.isFinite(n) ? n : 0;
}

function utcDayString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** One place to change when the schema names something differently. */
interface RawClient {
  client_account?: string | number;
  account_type?: string;
  currency?: string;
  email?: string;
  reg_date?: string;
  client_uid?: string;
}

interface RawReward {
  client_account?: string | number;
  volume_lots?: string | number;
  reward?: string | number;
  reward_usd?: string | number;
  date?: string;
}

export class ExnessBrokerAdapter implements BrokerAdapter {
  broker = 'exness' as const;

  #baseUrl: string;
  #credentials: ExnessCredentials;
  #fetch: typeof fetch;
  #token: string | null = null;

  constructor(options: ExnessAdapterOptions) {
    this.#baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.#credentials = options.credentials;
    this.#fetch = options.fetchImpl ?? globalThis.fetch;
  }

  async #authenticate(): Promise<string> {
    const response = await this.#fetch(`${this.#baseUrl}${ENDPOINTS.auth}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        login: this.#credentials.login,
        password: this.#credentials.password,
      }),
    });

    if (!response.ok) {
      throw new BrokerAuthError(`Exness auth failed with status ${response.status}`);
    }

    const body = (await response.json()) as { token?: string };
    if (!body.token) {
      throw new BrokerAuthError('Exness auth returned no token');
    }

    this.#token = body.token;
    return body.token;
  }

  /**
   * The token is short-lived and the docs do not promise how short, so rather
   * than tracking an expiry we hold it until a call comes back 401 and then
   * authenticate once and retry. One wasted request per expiry, no clock to
   * get wrong.
   */
  async #get(path: string, params: Record<string, string> = {}): Promise<unknown> {
    const url = new URL(`${this.#baseUrl}${path}`);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const send = async (token: string) =>
      this.#fetch(url, { headers: { Authorization: `JWT ${token}` } });

    let response = await send(this.#token ?? (await this.#authenticate()));

    if (response.status === 401) {
      response = await send(await this.#authenticate());
    }

    if (!response.ok) {
      throw new BrokerResponseError(
        `Exness ${path} failed with status ${response.status}`,
        response.status,
      );
    }

    return response.json();
  }

  /** Both list shapes seen in partner APIs: a bare array, or `{ data: [...] }`. */
  #rows<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === 'object') {
      const data = (payload as { data?: unknown; results?: unknown }).data ??
        (payload as { results?: unknown }).results;
      if (Array.isArray(data)) return data as T[];
    }
    throw new BrokerResponseError(
      'Exness returned a shape this adapter does not recognise; check /api/schema/',
    );
  }

  #toClientRecord(raw: RawClient): BrokerClientRecord {
    return {
      broker: 'exness',
      accountNumber: String(raw.client_account ?? '').trim(),
      accountType: mapAccountType(raw.account_type),
      currency: raw.currency ?? 'USD',
      maskedEmail: raw.email ?? null,
      registeredOn: parseDay(raw.reg_date),
      brokerClientId: raw.client_uid ?? null,
    };
  }

  async listClients(): Promise<BrokerClientRecord[]> {
    const payload = await this.#get(ENDPOINTS.clients);
    return this.#rows<RawClient>(payload)
      .map((raw) => this.#toClientRecord(raw))
      .filter((record) => record.accountNumber !== '');
  }

  async findClient(accountNumber: string): Promise<BrokerClientRecord | null> {
    // Prefer a server-side filter so a large partner tree is not pulled down
    // on every link attempt; fall back to scanning if the parameter is not
    // supported, which the schema check will settle.
    const payload = await this.#get(ENDPOINTS.clients, { client_account: accountNumber });
    const match = this.#rows<RawClient>(payload)
      .map((raw) => this.#toClientRecord(raw))
      .find((record) => record.accountNumber === accountNumber);

    return match ?? null;
  }

  async getDailyActivity(date: Date): Promise<DailyAccountActivity[]> {
    const day = utcDayString(date);
    const payload = await this.#get(ENDPOINTS.dailyRewards, { date_from: day, date_to: day });

    return this.#rows<RawReward>(payload)
      .map((raw) => {
        const accountNumber = String(raw.client_account ?? '').trim();
        return {
          broker: 'exness' as const,
          accountNumber,
          date: parseDay(raw.date) ?? parseDay(day)!,
          volumeLots: toNumber(raw.volume_lots),
          partnerCommissionUsd: toNumber(raw.reward_usd ?? raw.reward),
        };
      })
      .filter((row) => row.accountNumber !== '');
  }
}
