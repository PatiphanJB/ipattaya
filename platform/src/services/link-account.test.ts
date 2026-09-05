import test from 'node:test';
import assert from 'node:assert/strict';

import { linkAccount, type LinkAccountDeps } from './link-account.ts';
import { reconcileAccounts, ingestDailyActivity, type SyncDeps } from '../jobs/sync.ts';
import { MockBrokerAdapter } from '../broker/mock.ts';
import {
  MemoryAccountRepository,
  MemoryActivityRepository,
  MemoryAuditRepository,
  MemoryUserRepository,
} from '../storage/memory.ts';
import type { User } from '../domain/types.ts';

const NOW = new Date(Date.UTC(2026, 8, 4, 9, 0));

function user(over: Partial<User> = {}): User {
  return {
    id: 'user-1',
    phone: '+84901234567',
    email: 'hoang@gmail.com',
    referralCode: 'HOANG1',
    referredByUserId: null,
    createdAt: new Date(Date.UTC(2026, 7, 1)),
    ...over,
  };
}

function harness(now: Date = NOW) {
  const users = new MemoryUserRepository();
  const accounts = new MemoryAccountRepository();
  const audit = new MemoryAuditRepository();
  const activity = new MemoryActivityRepository();
  const broker = new MockBrokerAdapter('exness');

  let seq = 0;
  const deps: LinkAccountDeps = {
    brokerFor: () => broker,
    accounts,
    users,
    audit,
    now: () => now,
    newId: () => `id-${++seq}`,
  };

  const syncDeps: SyncDeps = { broker, accounts, users, activity, now: () => now };

  return { users, accounts, audit, activity, broker, deps, syncDeps };
}

test('linking a real account under us stores it as linked and writes an audit row', async () => {
  const h = harness();
  h.users.add(user());

  const result = await linkAccount(
    { userId: 'user-1', broker: 'exness', rawAccountNumber: '80001111' },
    h.deps,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.outcome.code, 'linked');
  assert.equal(result.account.status, 'linked');
  assert.equal(result.account.accountType, 'standard');
  assert.equal(result.account.linkedAt?.getTime(), NOW.getTime());

  const stored = await h.accounts.findByBrokerAndNumber('exness', '80001111');
  assert.equal(stored?.status, 'linked');

  const trail = h.audit.all();
  assert.equal(trail.length, 1);
  assert.equal(trail[0].outcome, 'linked');
  assert.equal(trail[0].proof, 'email_match');
});

test('an account under another partner is stored so the partner change can be tracked', async () => {
  const h = harness();
  h.users.add(user());

  const result = await linkAccount(
    { userId: 'user-1', broker: 'exness', rawAccountNumber: '80009999' },
    h.deps,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.outcome.code, 'not_under_us');

  const stored = await h.accounts.findByBrokerAndNumber('exness', '80009999');
  assert.equal(stored?.status, 'not_under_us');
  assert.equal(stored?.statusReason, 'link.notUnderUs');
});

test('a malformed number is audited but never written as an account row', async () => {
  const h = harness();
  h.users.add(user());

  const result = await linkAccount(
    { userId: 'user-1', broker: 'exness', rawAccountNumber: 'abc' },
    h.deps,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.outcome.code, 'invalid_number');

  assert.equal(await h.accounts.findByBrokerAndNumber('exness', ''), null);
  assert.equal(h.audit.all().length, 1);
});

test('one user cannot take over an account another user already holds', async () => {
  const h = harness();
  h.users.add(user());
  h.users.add(user({ id: 'user-2', email: 'other@gmail.com', referralCode: 'OTHER1' }));

  await linkAccount({ userId: 'user-1', broker: 'exness', rawAccountNumber: '80001111' }, h.deps);
  const second = await linkAccount(
    { userId: 'user-2', broker: 'exness', rawAccountNumber: '80001111' },
    h.deps,
  );

  assert.equal(second.ok, true);
  if (!second.ok) return;
  assert.equal(second.outcome.code, 'claimed_by_another_user');

  const stored = await h.accounts.findByBrokerAndNumber('exness', '80001111');
  assert.equal(stored?.userId, 'user-1', 'the original owner must be untouched');
});

test('the link form is rate limited, because account numbers are guessable', async () => {
  const h = harness();
  h.users.add(user());
  h.deps.maxAttemptsPerHour = 3;

  for (let i = 0; i < 3; i++) {
    const r = await linkAccount(
      { userId: 'user-1', broker: 'exness', rawAccountNumber: `8000000${i}` },
      h.deps,
    );
    assert.equal(r.ok, true);
  }

  const blocked = await linkAccount(
    { userId: 'user-1', broker: 'exness', rawAccountNumber: '80001111' },
    h.deps,
  );

  assert.equal(blocked.ok, false);
  if (blocked.ok) return;
  assert.equal(blocked.reason, 'rate_limited');
});

test('an unknown user cannot link anything', async () => {
  const h = harness();

  const result = await linkAccount(
    { userId: 'ghost', broker: 'exness', rawAccountNumber: '80001111' },
    h.deps,
  );

  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.reason, 'unknown_user');
});

test('a hard-masked email links on the registration date the user supplied', async () => {
  const h = harness();
  h.users.add(user());

  const registeredOn = (await h.broker.findClient('80002222'))!.registeredOn!;

  const result = await linkAccount(
    {
      userId: 'user-1',
      broker: 'exness',
      rawAccountNumber: '80002222',
      claimedRegisteredOn: registeredOn,
    },
    h.deps,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.outcome.proof, 'registration_date_match');
  assert.equal(result.account.status, 'linked');
});

test('reconciliation links an account the day its partner change lands', async () => {
  const h = harness();
  h.users.add(user());

  // The user linked before changing partner, so we recorded it as theirs but
  // not ours. Store it against a number the broker does list, standing in for
  // the account having moved under us overnight.
  await h.accounts.save({
    id: 'acc-1',
    userId: 'user-1',
    broker: 'exness',
    accountNumber: '80001111',
    accountType: 'unknown',
    currency: 'USD',
    status: 'not_under_us',
    proof: null,
    claimedRegisteredOn: null,
    linkedAt: null,
    lastSeenInReportAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    statusReason: 'link.notUnderUs',
  });

  const report = await reconcileAccounts(h.syncDeps);

  assert.equal(report.newlyLinked.length, 1);
  assert.equal(report.newlyLinked[0].accountNumber, '80001111');
  assert.equal(report.newlyLinked[0].proof, 'email_match');
  assert.equal(report.newlyLinked[0].accountType, 'standard', 'details come from the broker record');

  const stored = await h.accounts.findByBrokerAndNumber('exness', '80001111');
  assert.equal(stored?.status, 'linked');
});

test('reconciliation unlinks an account that has left our partner tree', async () => {
  const h = harness();
  h.users.add(user());

  await h.accounts.save({
    id: 'acc-2',
    userId: 'user-1',
    broker: 'exness',
    accountNumber: '80007777',
    accountType: 'standard',
    currency: 'USD',
    status: 'linked',
    proof: 'email_match',
    claimedRegisteredOn: null,
    linkedAt: NOW,
    lastSeenInReportAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
    statusReason: null,
  });

  const report = await reconcileAccounts(h.syncDeps);

  assert.equal(report.departed.length, 1);
  assert.equal(report.departed[0].status, 'unlinked');
  assert.equal(report.departed[0].statusReason, 'sync.leftPartner');
});

test('ingest keeps activity for linked accounts and counts the unclaimed ones', async () => {
  const h = harness();
  h.users.add(user());

  await linkAccount({ userId: 'user-1', broker: 'exness', rawAccountNumber: '80001111' }, h.deps);

  const day = new Date(Date.UTC(2026, 8, 3));
  const report = await ingestDailyActivity(day, h.syncDeps);

  assert.equal(report.rowsFromBroker, 4);
  assert.equal(report.rowsStored, 1);
  assert.ok(!report.unclaimedAccounts.includes('80001111'));

  const rows = await h.activity.listForAccount('exness', '80001111', day, day);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date.getTime(), day.getTime());
});

test('re-running a day of ingest does not double-count', async () => {
  const h = harness();
  h.users.add(user());
  await linkAccount({ userId: 'user-1', broker: 'exness', rawAccountNumber: '80001111' }, h.deps);

  const day = new Date(Date.UTC(2026, 8, 3));
  await ingestDailyActivity(day, h.syncDeps);
  await ingestDailyActivity(day, h.syncDeps);

  assert.equal(h.activity.all().length, 1);
});
