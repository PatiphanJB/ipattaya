import { BrokerAuthError, BrokerResponseError } from '../../../../broker/adapter.ts';
import { BROKERS, type Broker } from '../../../../domain/types.ts';
import type { LinkOutcomeCode } from '../../../../domain/linking.ts';
import { linkAccount } from '../../../../services/link-account.ts';
import { linkAccountDeps } from '../../../../server/container.ts';
import { currentUserId } from '../../../../server/session.ts';
import { t } from '../../../../i18n/vi.ts';

/**
 * POST /api/accounts/link
 *
 * The one HTTP entry point for "link my trading account". It parses, checks
 * the session, delegates, and translates — no linking rules live here. The
 * status codes matter because the form branches on them, so they are stated
 * once in `STATUS_BY_CODE` rather than scattered through the handler.
 */

interface LinkRequestBody {
  broker?: unknown;
  accountNumber?: unknown;
  registeredOn?: unknown;
}

/**
 * `not_under_us` and `ownership_unproven` are 200: the request was valid and
 * we answered it. They are steps in the funnel, and a 4xx would push the form
 * down an error path when what the user needs is instructions.
 */
const STATUS_BY_CODE: Record<LinkOutcomeCode, number> = {
  linked: 200,
  not_under_us: 200,
  ownership_unproven: 200,
  invalid_number: 400,
  claimed_by_another_user: 409,
};

export async function POST(request: Request): Promise<Response> {
  const userId = await currentUserId();
  if (!userId) {
    return fail(401, 'unauthenticated', 'link.error.unknown_user');
  }

  let body: LinkRequestBody;
  try {
    body = (await request.json()) as LinkRequestBody;
  } catch {
    return fail(400, 'bad_request', 'link.error.bad_request');
  }

  const broker = parseBroker(body.broker);
  if (!broker) {
    return fail(400, 'bad_request', 'link.error.bad_request');
  }

  const rawAccountNumber = typeof body.accountNumber === 'string' ? body.accountNumber : '';

  const registeredOn = parseUtcDay(body.registeredOn);
  if (registeredOn === undefined) {
    return fail(400, 'bad_request', 'link.error.bad_request');
  }

  let result;
  try {
    result = await linkAccount(
      { userId, broker, rawAccountNumber, claimedRegisteredOn: registeredOn },
      linkAccountDeps(),
    );
  } catch (error) {
    // The broker being unreachable is our problem, not the user's, and must
    // not read as "your account number is wrong".
    if (error instanceof BrokerAuthError || error instanceof BrokerResponseError) {
      return fail(502, 'broker_unavailable', 'link.error.broker_unavailable');
    }
    throw error;
  }

  if (!result.ok) {
    const status = result.reason === 'rate_limited' ? 429 : 401;
    return fail(status, result.reason, result.messageKey);
  }

  const { outcome, account } = result;

  // An `account` in the response means a row exists. The two codes the service
  // deliberately does not persist must not carry one, or the client would show
  // a stored account that is not there.
  const persisted =
    outcome.code !== 'invalid_number' && outcome.code !== 'claimed_by_another_user';

  return Response.json(
    {
      ok: outcome.code === 'linked',
      code: outcome.code,
      message: t(outcome.messageKey),
      account: persisted
        ? {
            broker: account.broker,
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            status: account.status,
          }
        : null,
    },
    { status: STATUS_BY_CODE[outcome.code] },
  );
}

function fail(status: number, code: string, messageKey: string): Response {
  return Response.json({ ok: false, code, message: t(messageKey) }, { status });
}

function parseBroker(value: unknown): Broker | null {
  return typeof value === 'string' && (BROKERS as readonly string[]).includes(value)
    ? (value as Broker)
    : null;
}

/**
 * Returns null for "not supplied" and undefined for "supplied but unusable",
 * so the caller can reject a typo instead of silently dropping the second
 * ownership proof and sending the user to manual review for nothing.
 */
function parseUtcDay(value: unknown): Date | null | undefined {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return undefined;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  // Round-trips only if the components were a real calendar date; this is what
  // rejects 2026-02-31, which Date.UTC would happily roll into March.
  return date.toISOString().slice(0, 10) === value.trim() ? date : undefined;
}
