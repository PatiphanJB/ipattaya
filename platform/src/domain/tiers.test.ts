import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_TIERS, resolveTier, type TierRule } from './tiers.ts';

test('a new account starts on the standard rung, not on nothing', () => {
  const position = resolveTier(0);
  assert.equal(position.current.id, 'standard');
  assert.equal(position.current.traderShare, 0.85);
});

test('the advertised 100% is reachable, not decorative', () => {
  assert.equal(resolveTier(50).current.traderShare, 1);
  assert.equal(resolveTier(10_000).current.traderShare, 1);
});

test('a threshold is inclusive — 20 lots is the advanced rung, not one lot short', () => {
  assert.equal(resolveTier(19.99).current.id, 'standard');
  assert.equal(resolveTier(20).current.id, 'advanced');
});

test('the distance to the next rung is what the progress bar shows', () => {
  const position = resolveTier(12.5);
  assert.equal(position.next?.id, 'advanced');
  assert.equal(position.lotsToNext, 7.5);
});

test('at the top there is no next rung and nothing left to trade for', () => {
  const position = resolveTier(80);
  assert.equal(position.next, null);
  assert.equal(position.lotsToNext, 0);
});

test('rounding keeps the remaining volume displayable', () => {
  // 20 - 0.1 - 0.2 in binary floating point is 19.699999999999996.
  assert.equal(resolveTier(0.1 + 0.2).lotsToNext, 19.7);
});

test('nonsense volume is treated as zero rather than throwing at the user', () => {
  for (const volume of [-5, Number.NaN, Number.POSITIVE_INFINITY * 0]) {
    assert.equal(resolveTier(volume).current.id, 'standard');
  }
});

test('an unsorted tier table still resolves correctly', () => {
  const scrambled: TierRule[] = [
    { id: 'max', minLotsPrevMonth: 50, traderShare: 1 },
    { id: 'standard', minLotsPrevMonth: 0, traderShare: 0.85 },
    { id: 'advanced', minLotsPrevMonth: 20, traderShare: 0.92 },
  ];
  const position = resolveTier(25, scrambled);
  assert.equal(position.current.id, 'advanced');
  assert.equal(position.next?.id, 'max');
});

test('an empty tier table is a configuration bug and says so', () => {
  assert.throws(() => resolveTier(10, []), /at least one tier/);
});

test('the shipped ladder is sorted and never pays out more than we are paid', () => {
  for (const [i, tier] of DEFAULT_TIERS.entries()) {
    assert.ok(tier.traderShare > 0 && tier.traderShare <= 1, `${tier.id} share out of range`);
    if (i > 0) {
      assert.ok(tier.minLotsPrevMonth > DEFAULT_TIERS[i - 1].minLotsPrevMonth);
      assert.ok(tier.traderShare > DEFAULT_TIERS[i - 1].traderShare);
    }
  }
});
