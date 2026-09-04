import type { Broker } from './types.ts';

/**
 * Length bounds per broker, used only to catch obvious typos before we spend a
 * broker lookup on them. They are deliberately loose: a wrong reject is worse
 * than a wasted lookup, because the user is standing at the first step of the
 * funnel. Tighten these once we have seen a few thousand real account numbers.
 */
const LENGTH_BOUNDS: Record<Broker, { min: number; max: number }> = {
  exness: { min: 6, max: 12 },
  xm: { min: 6, max: 12 },
  icmarkets: { min: 5, max: 12 },
  vantage: { min: 5, max: 12 },
};

export type AccountNumberProblem = 'empty' | 'not_numeric' | 'too_short' | 'too_long';

export interface AccountNumberCheck {
  ok: boolean;
  /** Digits only. Present whenever the input contained at least one digit. */
  normalized: string;
  problem: AccountNumberProblem | null;
}

/**
 * People paste account numbers out of MT5, out of Zalo messages, and out of
 * screenshots read aloud. Strip everything that is not a digit rather than
 * rejecting decorated input.
 */
export function normalizeAccountNumber(raw: string): string {
  return raw.replace(/\D+/g, '');
}

export function checkAccountNumber(broker: Broker, raw: string): AccountNumberCheck {
  const normalized = normalizeAccountNumber(raw);

  if (raw.trim() === '') {
    return { ok: false, normalized, problem: 'empty' };
  }
  if (normalized === '') {
    return { ok: false, normalized, problem: 'not_numeric' };
  }

  const { min, max } = LENGTH_BOUNDS[broker];
  if (normalized.length < min) {
    return { ok: false, normalized, problem: 'too_short' };
  }
  if (normalized.length > max) {
    return { ok: false, normalized, problem: 'too_long' };
  }

  return { ok: true, normalized, problem: null };
}
