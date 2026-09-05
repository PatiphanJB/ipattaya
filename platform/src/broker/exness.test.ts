import test from 'node:test';
import assert from 'node:assert/strict';

import { ExnessBrokerAdapter } from './exness.ts';
import { BrokerAuthError, BrokerResponseError } from './adapter.ts';

/**
 * These exercise the parts that do not depend on the exact schema: auth, the
 * 401 retry, shape tolerance and field mapping. The field names themselves are
 * assumptions until someone checks /api/schema/ — see the note in exness.ts.
 */

interface Call {
  url: string;
  init: RequestInit | undefined;
}

function stubFetch(handler: (call: Call) => Response | Promise<Response>) {
  const calls: Call[] = [];
  const impl = (async (input: string | URL | Request, init?: RequestInit) => {
    const call = { url: String(input), init };
    calls.push(call);
    return handler(call);
  }) as unknown as typeof fetch;
  return { impl, calls };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

const CREDENTIALS = { login: 'partner@example.com', password: 'secret' };

test('the first call authenticates and then carries the JWT header', async () => {
  const { impl, calls } = stubFetch(({ url }) => {
    if (url.includes('/api/auth/')) return json({ token: 'tok-1' });
    return json([{ client_account: '80001111', account_type: 'Standard', currency: 'USD' }]);
  });

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  const clients = await adapter.listClients();

  assert.equal(clients.length, 1);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].init?.method, 'POST');

  const auth = new Headers(calls[1].init?.headers).get('authorization');
  assert.equal(auth, 'JWT tok-1');
});

test('an expired token is replaced once and the call retried', async () => {
  let tokens = 0;
  let listCalls = 0;

  const { impl } = stubFetch(({ url }) => {
    if (url.includes('/api/auth/')) return json({ token: `tok-${++tokens}` });
    listCalls++;
    return listCalls === 1 ? json({ detail: 'expired' }, 401) : json([]);
  });

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  await adapter.listClients();

  assert.equal(tokens, 2, 'authenticated again after the 401');
  assert.equal(listCalls, 2, 'and retried the original call exactly once');
});

test('a failed login is reported as an auth error, not a data error', async () => {
  const { impl } = stubFetch(() => json({ detail: 'bad credentials' }, 403));
  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });

  await assert.rejects(() => adapter.listClients(), BrokerAuthError);
});

test('both list shapes partner APIs use are accepted', async () => {
  for (const payload of [
    [{ client_account: '80001111' }],
    { data: [{ client_account: '80001111' }] },
    { results: [{ client_account: '80001111' }] },
  ]) {
    const { impl } = stubFetch(({ url }) =>
      url.includes('/api/auth/') ? json({ token: 't' }) : json(payload),
    );
    const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
    const clients = await adapter.listClients();
    assert.equal(clients.length, 1);
  }
});

test('an unrecognised shape says so instead of silently returning nothing', async () => {
  const { impl } = stubFetch(({ url }) =>
    url.includes('/api/auth/') ? json({ token: 't' }) : json({ unexpected: true }),
  );
  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });

  await assert.rejects(() => adapter.listClients(), BrokerResponseError);
});

test('account types map onto the shared vocabulary, and unknown stays unknown', async () => {
  const { impl } = stubFetch(({ url }) =>
    url.includes('/api/auth/')
      ? json({ token: 't' })
      : json([
          { client_account: '1', account_type: 'Standard Cent' },
          { client_account: '2', account_type: 'Pro' },
          { client_account: '3', account_type: 'Raw Spread' },
          { client_account: '4', account_type: 'Zero' },
          { client_account: '5', account_type: 'Standard' },
          { client_account: '6', account_type: 'Something New' },
        ]),
  );

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  const types = (await adapter.listClients()).map((c) => c.accountType);

  assert.deepEqual(types, ['standard_cent', 'pro', 'raw', 'zero', 'standard', 'unknown']);
});

test('registration dates are read at day precision in UTC', async () => {
  const { impl } = stubFetch(({ url }) =>
    url.includes('/api/auth/')
      ? json({ token: 't' })
      : json([{ client_account: '80001111', reg_date: '2026-04-20' }]),
  );

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  const [client] = await adapter.listClients();

  assert.equal(client.registeredOn?.toISOString(), '2026-04-20T00:00:00.000Z');
});

test('rewards arrive as numbers even when the API sends them as strings', async () => {
  const { impl } = stubFetch(({ url }) =>
    url.includes('/api/auth/')
      ? json({ token: 't' })
      : json([
          { client_account: '80001111', volume_lots: '3.20', reward_usd: '46.08', date: '2026-09-03' },
        ]),
  );

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  const [row] = await adapter.getDailyActivity(new Date(Date.UTC(2026, 8, 3)));

  assert.equal(row.volumeLots, 3.2);
  assert.equal(row.partnerCommissionUsd, 46.08);
  assert.equal(row.date.toISOString(), '2026-09-03T00:00:00.000Z');
});

test('findClient asks the server to filter and returns null when there is no match', async () => {
  const { impl, calls } = stubFetch(({ url }) =>
    url.includes('/api/auth/') ? json({ token: 't' }) : json([]),
  );

  const adapter = new ExnessBrokerAdapter({ credentials: CREDENTIALS, fetchImpl: impl });
  const found = await adapter.findClient('80009999');

  assert.equal(found, null);
  assert.ok(calls[1].url.includes('client_account=80009999'));
});
