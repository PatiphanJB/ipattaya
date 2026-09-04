import type { Broker, BrokerClientRecord, DailyAccountActivity } from '../domain/types.ts';

/**
 * Everything the platform needs from a broker's partner API, and nothing more.
 *
 * Only two questions matter for account linking:
 *   1. Is this account number in the client list under our partner code?
 *   2. What did it trade, and what were we paid for it?
 *
 * Keeping the surface this small means a second broker is one file, and means
 * the whole product can be built and tested against `MockBrokerAdapter`
 * before any real credentials exist.
 */
export interface BrokerAdapter {
  readonly broker: Broker;

  /**
   * Look up one account in our client list. Returns null when the account is
   * not under our partner code — which includes both "belongs to another
   * partner" and "does not exist", because partner APIs do not distinguish
   * the two and we must not leak whether an arbitrary number is real.
   */
  findClient(accountNumber: string): Promise<BrokerClientRecord | null>;

  /**
   * Full client list, for the daily reconciliation job that spots accounts
   * which have left our partner tree since the last run.
   */
  listClients(): Promise<BrokerClientRecord[]>;

  /**
   * Per-account activity for one UTC day. The adapter normalises cent-lots to
   * standard lots and converts commission to USD, so callers never branch on
   * account currency.
   */
  getDailyActivity(date: Date): Promise<DailyAccountActivity[]>;
}

export class BrokerAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrokerAuthError';
  }
}

/** The broker answered, but not with something we can use. */
export class BrokerResponseError extends Error {
  status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'BrokerResponseError';
    this.status = status;
  }
}
