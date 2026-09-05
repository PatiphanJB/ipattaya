import type {
  Broker,
  DailyAccountActivity,
  LinkStatus,
  OwnershipProof,
  TradingAccount,
  User,
} from '../domain/types.ts';
import type { LinkOutcomeCode } from '../domain/linking.ts';

/**
 * Storage seen from the domain's side. Firestore lives behind these; so does
 * the in-memory version the tests run against. Nothing above this file knows
 * which one it is talking to.
 */

export interface UserRepository {
  findById(id: string): Promise<User | null>;
}

export interface AccountRepository {
  /** Uniqueness key: one platform user may hold an account number, one may not hold another's. */
  findByBrokerAndNumber(broker: Broker, accountNumber: string): Promise<TradingAccount | null>;
  listByUser(userId: string): Promise<TradingAccount[]>;
  /** Used by the daily sync to walk everything we believe is ours. */
  listByBrokerAndStatus(broker: Broker, statuses: LinkStatus[]): Promise<TradingAccount[]>;
  save(account: TradingAccount): Promise<void>;
}

export interface ActivityRepository {
  /** Idempotent: re-running a day's ingest must not double-count. */
  upsertDaily(rows: DailyAccountActivity[]): Promise<void>;
  listForAccount(
    broker: Broker,
    accountNumber: string,
    fromInclusive: Date,
    toInclusive: Date,
  ): Promise<DailyAccountActivity[]>;
}

/**
 * Every link attempt is written down, successful or not. The first time a user
 * disputes whose account it is, this is the only thing that can answer it.
 */
export interface LinkAttemptRecord {
  id: string;
  userId: string;
  broker: Broker;
  /** Normalised, or the raw input when it could not be normalised. */
  accountNumber: string;
  outcome: LinkOutcomeCode;
  proof: OwnershipProof | null;
  at: Date;
}

export interface AuditRepository {
  recordLinkAttempt(entry: LinkAttemptRecord): Promise<void>;
  countRecentAttempts(userId: string, since: Date): Promise<number>;
}
