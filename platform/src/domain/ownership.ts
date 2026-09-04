import type { BrokerClientRecord, OwnershipProof } from './types.ts';

/**
 * Knowing an account number proves nothing — they are sequential and get
 * pasted into public Zalo groups all day. Before an account starts earning on
 * someone's dashboard we need a second fact that only its owner has.
 *
 * Everything here compares against the broker's own client record, so a wrong
 * guess costs the attacker a failed attempt and tells them nothing.
 */

/**
 * Brokers mask client emails in partner reports, e.g. `ng****@gmail.com` or
 * `n***h@gmail.com`. Compare the parts they do reveal, and require the domain
 * and the length of the local part to line up.
 *
 * Returns false whenever the mask is too aggressive to carry information
 * (a fully hidden local part), so the caller falls back to another proof.
 */
export function maskedEmailMatches(masked: string | null, actual: string | null): boolean {
  if (!masked || !actual) return false;

  const maskedLower = masked.trim().toLowerCase();
  const actualLower = actual.trim().toLowerCase();

  const maskedAt = maskedLower.lastIndexOf('@');
  const actualAt = actualLower.lastIndexOf('@');
  if (maskedAt <= 0 || actualAt <= 0) return false;

  const maskedLocal = maskedLower.slice(0, maskedAt);
  const maskedDomain = maskedLower.slice(maskedAt + 1);
  const actualLocal = actualLower.slice(0, actualAt);
  const actualDomain = actualLower.slice(actualAt + 1);

  if (maskedDomain !== actualDomain) return false;

  // Some brokers collapse the hidden run to a fixed number of stars rather
  // than one star per character, so the local parts can differ in length.
  // Compare the visible prefix and suffix around the first and last star.
  const firstStar = maskedLocal.indexOf('*');
  if (firstStar === -1) {
    return maskedLocal === actualLocal;
  }

  const lastStar = maskedLocal.lastIndexOf('*');
  const prefix = maskedLocal.slice(0, firstStar);
  const suffix = maskedLocal.slice(lastStar + 1);

  // A mask that reveals nothing is not evidence.
  if (prefix.length + suffix.length === 0) return false;

  if (!actualLocal.startsWith(prefix)) return false;
  if (suffix.length > 0 && !actualLocal.endsWith(suffix)) return false;

  // The revealed characters must not overlap in the real address, otherwise
  // `a****a` would match the two-letter local part `aa`.
  return actualLocal.length >= prefix.length + suffix.length;
}

/** Compare two dates at day precision in UTC. */
export function sameUtcDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export interface OwnershipClaim {
  /** The email on the platform account doing the linking. */
  userEmail: string | null;
  /** Registration date the user typed in, if they were asked for one. */
  claimedRegisteredOn: Date | null;
}

/**
 * Try each proof in turn and report the first that holds. Returning the proof
 * that succeeded (rather than a bare boolean) means the audit trail records
 * *why* an account was trusted, which is what we will want the first time a
 * link is disputed.
 */
export function proveOwnership(
  record: BrokerClientRecord,
  claim: OwnershipClaim,
): OwnershipProof | null {
  if (maskedEmailMatches(record.maskedEmail, claim.userEmail)) {
    return 'email_match';
  }
  if (sameUtcDay(record.registeredOn, claim.claimedRegisteredOn)) {
    return 'registration_date_match';
  }
  return null;
}
