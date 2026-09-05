import { MockBrokerAdapter } from '../broker/mock.ts';
import { ExnessBrokerAdapter } from '../broker/exness.ts';
import type { BrokerAdapter } from '../broker/adapter.ts';
import {
  MemoryAccountRepository,
  MemoryActivityRepository,
  MemoryAuditRepository,
  MemoryUserRepository,
} from '../storage/memory.ts';
import type { Broker } from '../domain/types.ts';
import type { LinkAccountDeps } from '../services/link-account.ts';

/**
 * Wiring. The one place that decides which broker adapter and which storage
 * the request path gets, so nothing above it has to care.
 *
 * Storage is in-memory today, which means it resets on every server restart.
 * That is fine for building screens against and useless for anything else;
 * Firestore implementations of the same ports replace it without touching a
 * caller. The tests never come through here — they build their own.
 */

const memory = {
  users: new MemoryUserRepository(),
  accounts: new MemoryAccountRepository(),
  audit: new MemoryAuditRepository(),
  activity: new MemoryActivityRepository(),
};

/**
 * One seeded user outside production, so `npm run dev` gives a working form
 * instead of "unknown user" on the first submit. Its email is the one the
 * mock broker's masked addresses were written to match.
 */
export const DEV_USER_ID = 'dev-user';

if (process.env.NODE_ENV !== 'production') {
  memory.users.add({
    id: DEV_USER_ID,
    phone: '+84901234567',
    email: 'hoang@gmail.com',
    referralCode: 'DEV001',
    referredByUserId: null,
    createdAt: new Date(),
  });
}

let seq = 0;

/**
 * Real credentials switch the adapter on. Until the field names in
 * `exness.ts` have been checked against the live schema, leaving these unset
 * is the correct configuration — the mock answers the same questions and
 * cannot pay anyone the wrong amount.
 */
function buildBroker(broker: Broker): BrokerAdapter {
  const login = process.env.EXNESS_PARTNER_LOGIN;
  const password = process.env.EXNESS_PARTNER_PASSWORD;

  if (broker === 'exness' && login && password) {
    return new ExnessBrokerAdapter({
      credentials: { login, password },
      baseUrl: process.env.EXNESS_PARTNER_BASE_URL,
    });
  }

  return new MockBrokerAdapter(broker);
}

const brokerCache = new Map<Broker, BrokerAdapter>();

export function brokerFor(broker: Broker): BrokerAdapter {
  const cached = brokerCache.get(broker);
  if (cached) return cached;

  const adapter = buildBroker(broker);
  brokerCache.set(broker, adapter);
  return adapter;
}

export function usingMockBroker(): boolean {
  return !(process.env.EXNESS_PARTNER_LOGIN && process.env.EXNESS_PARTNER_PASSWORD);
}

export function linkAccountDeps(): LinkAccountDeps {
  return {
    brokerFor,
    accounts: memory.accounts,
    users: memory.users,
    audit: memory.audit,
    now: () => new Date(),
    newId: () => `${Date.now().toString(36)}-${(++seq).toString(36)}`,
  };
}

export const repositories = memory;
