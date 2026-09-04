import test from 'node:test';
import assert from 'node:assert/strict';

import { checkAccountNumber, normalizeAccountNumber } from './account-number.ts';
import { maskedEmailMatches, proveOwnership, sameUtcDay } from './ownership.ts';
import { decideLink } from './linking.ts';
import type { BrokerClientRecord } from './types.ts';
import { MockBrokerAdapter } from '../broker/mock.ts';

const USER = 'user-1';

function record(over: Partial<BrokerClientRecord> = {}): BrokerClientRecord {
  return {
    broker: 'exness',
    accountNumber: '80001111',
    accountType: 'standard',
    currency: 'USD',
    maskedEmail: 'ho***ng@gmail.com',
    registeredOn: new Date(Date.UTC(2026, 3, 20)),
    brokerClientId: 'c1',
    ...over,
  };
}

test('account numbers are stripped of the decoration people paste in', () => {
  assert.equal(normalizeAccountNumber(' 8000-1111 '), '80001111');
  assert.equal(normalizeAccountNumber('MT5 #80001111'), '580001111'); // digits only, in order
  assert.equal(normalizeAccountNumber('no digits here'), '');
});

test('account number checks catch typos without being precious about format', () => {
  assert.equal(checkAccountNumber('exness', '80001111').ok, true);
  assert.equal(checkAccountNumber('exness', '  ').problem, 'empty');
  assert.equal(checkAccountNumber('exness', 'abcdefgh').problem, 'not_numeric');
  assert.equal(checkAccountNumber('exness', '123').problem, 'too_short');
  assert.equal(checkAccountNumber('exness', '1234567890123').problem, 'too_long');
});

test('masked email matching uses only the characters the broker reveals', () => {
  // The mask says: starts 'ho', ends 'ng', unknown in between.
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', 'hoangnhung@gmail.com'), true);
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', 'hoang@gmail.com'), true);
  // Wrong domain is a hard no even when the local part fits.
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', 'hoang@yahoo.com'), false);
  // Wrong visible prefix.
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', 'tuang@gmail.com'), false);
  // Wrong visible suffix.
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', 'hoanh@gmail.com'), false);
  // A mask that reveals nothing must never count as evidence.
  assert.equal(maskedEmailMatches('****@gmail.com', 'anyone@gmail.com'), false);
  assert.equal(maskedEmailMatches(null, 'hoang@gmail.com'), false);
  assert.equal(maskedEmailMatches('ho***ng@gmail.com', null), false);
});

test('masked email matching does not let revealed characters overlap', () => {
  // 'ab' + 'cd' needs at least four characters; 'abd' must not pass.
  assert.equal(maskedEmailMatches('ab**cd@gmail.com', 'abd@gmail.com'), false);
  assert.equal(maskedEmailMatches('ab**cd@gmail.com', 'abxcd@gmail.com'), true);
});

test('registration dates compare at day precision in UTC', () => {
  const a = new Date(Date.UTC(2026, 3, 20, 23, 59));
  const b = new Date(Date.UTC(2026, 3, 20, 0, 1));
  assert.equal(sameUtcDay(a, b), true);
  assert.equal(sameUtcDay(a, new Date(Date.UTC(2026, 3, 21))), false);
  assert.equal(sameUtcDay(a, null), false);
});

test('ownership falls back from email to registration date', () => {
  const r = record({ maskedEmail: '****@gmail.com' });

  assert.equal(proveOwnership(r, { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null }), null);

  assert.equal(
    proveOwnership(r, {
      userEmail: 'hoang@gmail.com',
      claimedRegisteredOn: new Date(Date.UTC(2026, 3, 20)),
    }),
    'registration_date_match',
  );
});

test('a valid account under us with a proven owner links', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '8000 1111',
      claim: { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null },
      record: record(),
    },
    { userId: USER, existingOwnerUserId: null },
  );

  assert.equal(outcome.code, 'linked');
  assert.equal(outcome.status, 'linked');
  assert.equal(outcome.proof, 'email_match');
  assert.equal(outcome.normalizedAccountNumber, '80001111');
});

test('an account we cannot see is treated as recoverable, not as a dead end', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '80009999',
      claim: { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null },
      record: null,
    },
    { userId: USER, existingOwnerUserId: null },
  );

  assert.equal(outcome.code, 'not_under_us');
  assert.equal(outcome.status, 'not_under_us');
  assert.equal(outcome.messageKey, 'link.notUnderUs');
});

test('an unproven owner waits for review instead of being rejected outright', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '80001111',
      claim: { userEmail: 'someoneelse@gmail.com', claimedRegisteredOn: null },
      record: record(),
    },
    { userId: USER, existingOwnerUserId: null },
  );

  assert.equal(outcome.code, 'ownership_unproven');
  assert.equal(outcome.status, 'pending');
  assert.equal(outcome.proof, null);
});

test('an account already held by another user is refused', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '80001111',
      claim: { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null },
      record: record(),
    },
    { userId: USER, existingOwnerUserId: 'user-2' },
  );

  assert.equal(outcome.code, 'claimed_by_another_user');
  assert.equal(outcome.status, 'rejected');
});

test('re-linking an account this same user already holds is allowed', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '80001111',
      claim: { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null },
      record: record(),
    },
    { userId: USER, existingOwnerUserId: USER },
  );

  assert.equal(outcome.code, 'linked');
});

test('a malformed number never reaches the broker', () => {
  const outcome = decideLink(
    {
      broker: 'exness',
      rawAccountNumber: '12',
      claim: { userEmail: 'hoang@gmail.com', claimedRegisteredOn: null },
      record: null,
    },
    { userId: USER, existingOwnerUserId: null },
  );

  assert.equal(outcome.code, 'invalid_number');
  assert.equal(outcome.messageKey, 'link.error.too_short');
});

test('the mock broker answers the questions the adapter promises', async () => {
  const broker = new MockBrokerAdapter('exness');

  assert.equal((await broker.findClient('80001111'))?.accountNumber, '80001111');
  assert.equal(await broker.findClient('99999999'), null);
  assert.equal((await broker.listClients()).length, 4);

  const day = new Date(Date.UTC(2026, 8, 3));
  const first = await broker.getDailyActivity(day);
  const again = await broker.getDailyActivity(new Date(Date.UTC(2026, 8, 3, 18, 30)));

  assert.deepEqual(first, again, 'same UTC day must yield the same numbers');
  assert.equal(first.length, 4);

  for (const row of first) {
    assert.ok(row.volumeLots >= 0);
    assert.ok(row.partnerCommissionUsd >= 0);
    assert.equal(row.date.getTime(), day.getTime());
  }

  const idle = first.find((r) => r.accountNumber === '80004444');
  assert.equal(idle?.volumeLots, 0);
  assert.equal(idle?.partnerCommissionUsd, 0);
});
