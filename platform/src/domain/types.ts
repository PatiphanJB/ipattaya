/**
 * Core types for the rebate platform.
 *
 * Money is always stored in minor-unit-free decimal numbers of a stated
 * currency (USD unless said otherwise). Volume is always in standard lots.
 * Cent accounts are reported by the broker in cent-lots; the adapter is
 * responsible for normalising them to standard lots before anything here
 * sees them.
 */

export type Broker = 'exness' | 'xm' | 'icmarkets' | 'vantage';

export const BROKERS: readonly Broker[] = ['exness', 'xm', 'icmarkets', 'vantage'];

/**
 * Account types differ per broker. We keep a shared vocabulary because the
 * rebate table is expressed per account type, and map broker-specific names
 * onto it inside each adapter.
 */
export type AccountType = 'standard' | 'standard_cent' | 'pro' | 'zero' | 'raw' | 'unknown';

export type LinkStatus =
  /** Submitted, waiting for the broker lookup or for an admin. */
  | 'pending'
  /** Found under our partner account and ownership proven. Earning rebate. */
  | 'linked'
  /** Real account, but it sits under a different partner. Needs a partner change. */
  | 'not_under_us'
  /** Lookup found nothing, or ownership proof failed. */
  | 'rejected'
  /** Was linked, then detached (user request, or it left our partner tree). */
  | 'unlinked';

/** How we satisfied ourselves that the person linking owns the account. */
export type OwnershipProof =
  | 'email_match'
  | 'registration_date_match'
  | 'admin_review'
  /** Only valid in development against the mock adapter. */
  | 'mock';

export interface TradingAccount {
  id: string;
  userId: string;
  broker: Broker;
  /** Digits only, as the broker prints it. Never re-formatted for display. */
  accountNumber: string;
  accountType: AccountType;
  /** Account currency as reported by the broker, e.g. 'USD', 'USC'. */
  currency: string;
  status: LinkStatus;
  proof: OwnershipProof | null;
  /** Set once the account first reaches 'linked'. */
  linkedAt: Date | null;
  /** Last time a broker report confirmed this account is still ours. */
  lastSeenInReportAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  /** Free-text reason shown to the user for 'rejected' / 'not_under_us'. */
  statusReason: string | null;
}

/**
 * One row of the broker's client list, normalised. This is the only shape the
 * linking logic is allowed to see, so a new broker only means a new adapter.
 */
export interface BrokerClientRecord {
  broker: Broker;
  accountNumber: string;
  accountType: AccountType;
  currency: string;
  /**
   * Client email as the broker reports it. Brokers usually mask it
   * (`ng****@gmail.com`), so treat this as a comparison token, not an address.
   */
  maskedEmail: string | null;
  /** Account registration date, day precision, UTC. */
  registeredOn: Date | null;
  /**
   * The broker's own client identifier, when it exposes one. Stable across
   * report runs; useful for detecting an account that moved away from us.
   */
  brokerClientId: string | null;
}

/** One day of activity for one account, as reported by the broker. */
export interface DailyAccountActivity {
  broker: Broker;
  accountNumber: string;
  /** UTC date, day precision. */
  date: Date;
  /** Normalised to standard lots by the adapter. */
  volumeLots: number;
  /** What the broker paid *us* for this account on this day, in USD. */
  partnerCommissionUsd: number;
}

export interface User {
  id: string;
  /** E.164, the primary identity in Vietnam. */
  phone: string | null;
  email: string | null;
  /** Short code this user hands out to bring in others. */
  referralCode: string;
  /** The user whose referral code was used at sign-up. Null for direct sign-ups. */
  referredByUserId: string | null;
  createdAt: Date;
}
