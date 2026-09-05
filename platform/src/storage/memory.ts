import type {
  AccountRepository,
  ActivityRepository,
  AuditRepository,
  LinkAttemptRecord,
  UserRepository,
} from './ports.ts';
import type {
  Broker,
  DailyAccountActivity,
  LinkStatus,
  TradingAccount,
  User,
} from '../domain/types.ts';

/**
 * In-memory storage. Backs the tests, and lets the whole flow be exercised
 * locally before a Firestore project exists.
 */

function accountKey(broker: Broker, accountNumber: string): string {
  return `${broker}:${accountNumber}`;
}

function activityKey(row: Pick<DailyAccountActivity, 'broker' | 'accountNumber' | 'date'>): string {
  return `${row.broker}:${row.accountNumber}:${row.date.toISOString().slice(0, 10)}`;
}

export class MemoryUserRepository implements UserRepository {
  #users = new Map<string, User>();

  add(user: User): void {
    this.#users.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.#users.get(id) ?? null;
  }
}

export class MemoryAccountRepository implements AccountRepository {
  #byKey = new Map<string, TradingAccount>();

  async findByBrokerAndNumber(
    broker: Broker,
    accountNumber: string,
  ): Promise<TradingAccount | null> {
    return this.#byKey.get(accountKey(broker, accountNumber)) ?? null;
  }

  async listByUser(userId: string): Promise<TradingAccount[]> {
    return [...this.#byKey.values()].filter((a) => a.userId === userId);
  }

  async listByBrokerAndStatus(broker: Broker, statuses: LinkStatus[]): Promise<TradingAccount[]> {
    const wanted = new Set(statuses);
    return [...this.#byKey.values()].filter((a) => a.broker === broker && wanted.has(a.status));
  }

  async save(account: TradingAccount): Promise<void> {
    this.#byKey.set(accountKey(account.broker, account.accountNumber), { ...account });
  }
}

export class MemoryActivityRepository implements ActivityRepository {
  #rows = new Map<string, DailyAccountActivity>();

  async upsertDaily(rows: DailyAccountActivity[]): Promise<void> {
    for (const row of rows) {
      this.#rows.set(activityKey(row), { ...row });
    }
  }

  async listForAccount(
    broker: Broker,
    accountNumber: string,
    fromInclusive: Date,
    toInclusive: Date,
  ): Promise<DailyAccountActivity[]> {
    return [...this.#rows.values()]
      .filter(
        (r) =>
          r.broker === broker &&
          r.accountNumber === accountNumber &&
          r.date.getTime() >= fromInclusive.getTime() &&
          r.date.getTime() <= toInclusive.getTime(),
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /** Test helper: everything stored, in insertion order. */
  all(): DailyAccountActivity[] {
    return [...this.#rows.values()];
  }
}

export class MemoryAuditRepository implements AuditRepository {
  #entries: LinkAttemptRecord[] = [];

  async recordLinkAttempt(entry: LinkAttemptRecord): Promise<void> {
    this.#entries.push({ ...entry });
  }

  async countRecentAttempts(userId: string, since: Date): Promise<number> {
    return this.#entries.filter((e) => e.userId === userId && e.at.getTime() >= since.getTime())
      .length;
  }

  all(): LinkAttemptRecord[] {
    return [...this.#entries];
  }
}
