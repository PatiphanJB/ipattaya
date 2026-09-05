/**
 * The rebate ladder.
 *
 * The public promise is "hoàn phí tới 100%" — up to 100% of the IB commission
 * the broker pays us. Every account starts at the standard rung and climbs on
 * its own from last month's volume, with the whole table shown on the same
 * page as the promise. Competitors advertise 100% and quietly pay less on the
 * account types people actually trade; the point of a visible ladder is that
 * our own account statement can never contradict our own landing page.
 *
 * Percentages and thresholds are configuration, not code: they will be tuned
 * against real partner rates and must be changeable without a deploy.
 */

export interface TierRule {
  id: string;
  /** Volume in standard lots during the previous calendar month. */
  minLotsPrevMonth: number;
  /** Share of the broker's IB commission passed to the trader. 0..1 */
  traderShare: number;
}

/**
 * Ordered low to high. `resolveTier` walks it backwards, so adding a rung is a
 * one-line change as long as the array stays sorted.
 */
export const DEFAULT_TIERS: readonly TierRule[] = [
  { id: 'standard', minLotsPrevMonth: 0, traderShare: 0.85 },
  { id: 'advanced', minLotsPrevMonth: 20, traderShare: 0.92 },
  { id: 'max', minLotsPrevMonth: 50, traderShare: 1.0 },
];

export interface TierPosition {
  current: TierRule;
  /** The next rung up, or null at the top. */
  next: TierRule | null;
  /** Lots still needed this month to reach `next`. 0 at the top. */
  lotsToNext: number;
}

export function resolveTier(
  lotsPrevMonth: number,
  tiers: readonly TierRule[] = DEFAULT_TIERS,
): TierPosition {
  if (tiers.length === 0) {
    throw new Error('resolveTier needs at least one tier');
  }

  const sorted = [...tiers].sort((a, b) => a.minLotsPrevMonth - b.minLotsPrevMonth);
  const volume = Number.isFinite(lotsPrevMonth) && lotsPrevMonth > 0 ? lotsPrevMonth : 0;

  let currentIndex = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (volume >= sorted[i].minLotsPrevMonth) {
      currentIndex = i;
      break;
    }
  }

  const next = sorted[currentIndex + 1] ?? null;

  return {
    current: sorted[currentIndex],
    next,
    lotsToNext: next ? round2(Math.max(0, next.minLotsPrevMonth - volume)) : 0,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
