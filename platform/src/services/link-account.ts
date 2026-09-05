import { checkAccountNumber } from '../domain/account-number.ts';
import { decideLink, type LinkOutcome } from '../domain/linking.ts';
import type { Broker, TradingAccount } from '../domain/types.ts';
import type { BrokerAdapter } from '../broker/adapter.ts';
import type { AccountRepository, AuditRepository, UserRepository } from '../storage/ports.ts';

/**
 * "Link my trading account", end to end.
 *
 * The decision itself lives in the domain and is pure; this is the part that
 * talks to the broker and the database, in the order that spends the least on
 * a request that was never going to succeed.
 */

export interface LinkAccountInput {
  userId: string;
  broker: Broker;
  rawAccountNumber: string;
  /** Optional second proof, asked for only when the broker masks emails hard. */
  claimedRegisteredOn?: Date | null;
}

export interface LinkAccountDeps {
  brokerFor(broker: Broker): BrokerAdapter;
  accounts: AccountRepository;
  users: UserRepository;
  audit: AuditRepository;
  now(): Date;
  newId(): string;
  /**
   * Account numbers are sequential, so an unlimited link form is an oracle for
   * "which accounts sit under this partner". Attempts per user per window.
   */
  maxAttemptsPerHour?: number;
}

export type LinkAccountResult =
  | { ok: true; outcome: LinkOutcome; account: TradingAccount }
  | { ok: false; reason: 'unknown_user' | 'rate_limited'; messageKey: string };

const DEFAULT_MAX_ATTEMPTS_PER_HOUR = 10;
const HOUR_MS = 3_600_000;

export async function linkAccount(
  input: LinkAccountInput,
  deps: LinkAccountDeps,
): Promise<LinkAccountResult> {
  const now = deps.now();

  const user = await deps.users.findById(input.userId);
  if (!user) {
    return { ok: false, reason: 'unknown_user', messageKey: 'link.error.unknown_user' };
  }

  const limit = deps.maxAttemptsPerHour ?? DEFAULT_MAX_ATTEMPTS_PER_HOUR;
  const recent = await deps.audit.countRecentAttempts(
    input.userId,
    new Date(now.getTime() - HOUR_MS),
  );
  if (recent >= limit) {
    return { ok: false, reason: 'rate_limited', messageKey: 'link.error.rate_limited' };
  }

  const claim = {
    userEmail: user.email,
    claimedRegisteredOn: input.claimedRegisteredOn ?? null,
  };

  // Gather the two facts the decision needs, skipping work that cannot change
  // the answer: a malformed number never reaches the broker, and neither does
  // a number we already know belongs to somebody else.
  const check = checkAccountNumber(input.broker, input.rawAccountNumber);
  let existingOwnerUserId: string | null = null;
  let existing: TradingAccount | null = null;
  let record = null;

  if (check.ok) {
    existing = await deps.accounts.findByBrokerAndNumber(input.broker, check.normalized);
    existingOwnerUserId = existing?.userId ?? null;

    if (!existingOwnerUserId || existingOwnerUserId === input.userId) {
      record = await deps.brokerFor(input.broker).findClient(check.normalized);
    }
  }

  const outcome = decideLink(
    {
      broker: input.broker,
      rawAccountNumber: input.rawAccountNumber,
      claim,
      record,
    },
    { userId: input.userId, existingOwnerUserId },
  );

  await deps.audit.recordLinkAttempt({
    id: deps.newId(),
    userId: input.userId,
    broker: input.broker,
    accountNumber: outcome.normalizedAccountNumber || input.rawAccountNumber,
    outcome: outcome.code,
    proof: outcome.proof,
    at: now,
  });

  const account: TradingAccount = {
    id: existing?.id ?? deps.newId(),
    userId: input.userId,
    broker: input.broker,
    accountNumber: outcome.normalizedAccountNumber,
    accountType: record?.accountType ?? existing?.accountType ?? 'unknown',
    currency: record?.currency ?? existing?.currency ?? 'USD',
    status: outcome.status,
    proof: outcome.proof ?? existing?.proof ?? null,
    claimedRegisteredOn: claim.claimedRegisteredOn ?? existing?.claimedRegisteredOn ?? null,
    linkedAt: outcome.status === 'linked' ? (existing?.linkedAt ?? now) : (existing?.linkedAt ?? null),
    lastSeenInReportAt: record ? now : (existing?.lastSeenInReportAt ?? null),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    statusReason: outcome.status === 'linked' ? null : outcome.messageKey,
  };

  // A number we could not even normalise is not a row worth keeping: it would
  // collide with every other bad attempt at the empty-string key.
  if (outcome.code !== 'invalid_number' && outcome.code !== 'claimed_by_another_user') {
    await deps.accounts.save(account);
  }

  return { ok: true, outcome, account };
}
