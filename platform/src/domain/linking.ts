import { checkAccountNumber } from './account-number.ts';
import { proveOwnership, type OwnershipClaim } from './ownership.ts';
import type { Broker, BrokerClientRecord, LinkStatus, OwnershipProof } from './types.ts';

/**
 * The decision half of "link my trading account". Pure: it takes the broker's
 * answer and the user's claim, and says what the account's status should
 * become. The caller does the I/O and the writing.
 */

export interface LinkAttempt {
  broker: Broker;
  rawAccountNumber: string;
  claim: OwnershipClaim;
  /** The matching row from our partner client list, or null if there is none. */
  record: BrokerClientRecord | null;
}

export type LinkOutcomeCode =
  | 'linked'
  /** The number is malformed — we did not even look it up. */
  | 'invalid_number'
  /** Real, but under someone else's partner code. The recoverable case. */
  | 'not_under_us'
  /** Under us, but the person could not show they own it. */
  | 'ownership_unproven'
  /** Already linked to a different platform user. */
  | 'claimed_by_another_user';

export interface LinkOutcome {
  code: LinkOutcomeCode;
  status: LinkStatus;
  normalizedAccountNumber: string;
  proof: OwnershipProof | null;
  /**
   * Stable key for the message shown to the user. The Vietnamese copy lives in
   * the translation files, not here — this module must stay language-free.
   */
  messageKey: string;
}

export interface DecideLinkOptions {
  /**
   * Platform user id that already owns this account number, if any. Callers
   * pass the result of their own uniqueness lookup.
   */
  existingOwnerUserId?: string | null;
  /** The user attempting the link. */
  userId: string;
}

export function decideLink(attempt: LinkAttempt, options: DecideLinkOptions): LinkOutcome {
  const check = checkAccountNumber(attempt.broker, attempt.rawAccountNumber);

  if (!check.ok) {
    return {
      code: 'invalid_number',
      status: 'rejected',
      normalizedAccountNumber: check.normalized,
      proof: null,
      messageKey: `link.error.${check.problem}`,
    };
  }

  const { existingOwnerUserId, userId } = options;
  if (existingOwnerUserId && existingOwnerUserId !== userId) {
    return {
      code: 'claimed_by_another_user',
      status: 'rejected',
      normalizedAccountNumber: check.normalized,
      proof: null,
      messageKey: 'link.error.claimed_by_another_user',
    };
  }

  if (!attempt.record) {
    // Not in our client list. Almost always a real account under a different
    // partner rather than a fake number, so this is a step in the funnel, not
    // a dead end: the user is sent to the partner-change instructions.
    return {
      code: 'not_under_us',
      status: 'not_under_us',
      normalizedAccountNumber: check.normalized,
      proof: null,
      messageKey: 'link.notUnderUs',
    };
  }

  const proof = proveOwnership(attempt.record, attempt.claim);
  if (!proof) {
    return {
      code: 'ownership_unproven',
      status: 'pending',
      normalizedAccountNumber: check.normalized,
      proof: null,
      messageKey: 'link.pendingReview',
    };
  }

  return {
    code: 'linked',
    status: 'linked',
    normalizedAccountNumber: check.normalized,
    proof,
    messageKey: 'link.success',
  };
}
