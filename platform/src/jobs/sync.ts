import { proveOwnership } from '../domain/ownership.ts';
import type { Broker, TradingAccount } from '../domain/types.ts';
import type { BrokerAdapter } from '../broker/adapter.ts';
import type { AccountRepository, ActivityRepository, UserRepository } from '../storage/ports.ts';

/**
 * The daily jobs. Two of them, run in this order:
 *
 *   reconcileAccounts  — who is still ours, and who just became ours
 *   ingestDailyActivity — what they traded and what we were paid
 *
 * Reconciliation runs first because an account that arrived overnight should
 * be earning from the same day's activity.
 */

export interface SyncDeps {
  broker: BrokerAdapter;
  accounts: AccountRepository;
  users: UserRepository;
  activity: ActivityRepository;
  now(): Date;
}

export interface ReconcileReport {
  broker: Broker;
  checked: number;
  /**
   * Accounts that appeared in the client list for the first time and proved
   * ownership on their own — the partner change went through. These are worth
   * a notification: the user asked for something days ago and it just landed.
   */
  newlyLinked: TradingAccount[];
  /** Appeared, but ownership still unproven. Needs a human. */
  awaitingReview: TradingAccount[];
  /** Were linked, are no longer in the client list. They left our tree. */
  departed: TradingAccount[];
}

/** Statuses worth re-checking each day. Rejected accounts are left alone. */
const WATCHED = ['linked', 'not_under_us', 'pending'] as const;

export async function reconcileAccounts(deps: SyncDeps): Promise<ReconcileReport> {
  const now = deps.now();
  const broker = deps.broker.broker;

  const clients = await deps.broker.listClients();
  const byNumber = new Map(clients.map((c) => [c.accountNumber, c]));

  const watched = await deps.accounts.listByBrokerAndStatus(broker, [...WATCHED]);

  const report: ReconcileReport = {
    broker,
    checked: watched.length,
    newlyLinked: [],
    awaitingReview: [],
    departed: [],
  };

  for (const account of watched) {
    const record = byNumber.get(account.accountNumber);

    if (!record) {
      // Only a previously linked account is news. One that was already
      // 'not_under_us' simply has not changed partner yet.
      if (account.status === 'linked') {
        const updated: TradingAccount = {
          ...account,
          status: 'unlinked',
          statusReason: 'sync.leftPartner',
          updatedAt: now,
        };
        await deps.accounts.save(updated);
        report.departed.push(updated);
      }
      continue;
    }

    if (account.status === 'linked') {
      await deps.accounts.save({ ...account, lastSeenInReportAt: now, updatedAt: now });
      continue;
    }

    // It is in our list but was not linked: this is the partner change landing.
    // Re-run the same ownership test the link form ran, using what the user
    // told us then, so nobody has to come back and re-enter anything.
    const user = await deps.users.findById(account.userId);
    const proof = proveOwnership(record, {
      userEmail: user?.email ?? null,
      claimedRegisteredOn: account.claimedRegisteredOn,
    });

    const updated: TradingAccount = {
      ...account,
      accountType: record.accountType,
      currency: record.currency,
      status: proof ? 'linked' : 'pending',
      proof: proof ?? account.proof,
      linkedAt: proof ? (account.linkedAt ?? now) : account.linkedAt,
      lastSeenInReportAt: now,
      statusReason: proof ? null : 'link.pendingReview',
      updatedAt: now,
    };

    await deps.accounts.save(updated);
    if (proof) {
      report.newlyLinked.push(updated);
    } else {
      report.awaitingReview.push(updated);
    }
  }

  return report;
}

export interface IngestReport {
  broker: Broker;
  date: Date;
  rowsFromBroker: number;
  /** Rows kept: activity for accounts we actually have linked. */
  rowsStored: number;
  /**
   * Accounts that traded but that no platform user has linked. Not an error —
   * these are our clients at the broker who have not signed up yet, and the
   * size of this number is the size of the sign-up opportunity.
   */
  unclaimedAccounts: string[];
}

export async function ingestDailyActivity(date: Date, deps: SyncDeps): Promise<IngestReport> {
  const broker = deps.broker.broker;
  const rows = await deps.broker.getDailyActivity(date);

  const linked = await deps.accounts.listByBrokerAndStatus(broker, ['linked']);
  const linkedNumbers = new Set(linked.map((a) => a.accountNumber));

  const keep = rows.filter((r) => linkedNumbers.has(r.accountNumber));
  const unclaimed = rows
    .filter((r) => !linkedNumbers.has(r.accountNumber) && r.volumeLots > 0)
    .map((r) => r.accountNumber);

  // Idempotent by (broker, account, day), so re-running a day is safe and a
  // late broker correction overwrites rather than doubles.
  await deps.activity.upsertDaily(keep);

  return {
    broker,
    date,
    rowsFromBroker: rows.length,
    rowsStored: keep.length,
    unclaimedAccounts: unclaimed,
  };
}
