import type { BrokerAdapter } from './adapter.ts';
import type { Broker, BrokerClientRecord, DailyAccountActivity } from '../domain/types.ts';

/**
 * A broker that behaves like the real one but needs no credentials.
 *
 * Every screen and every job in the platform is built against this first, so
 * the day the Exness partner token arrives the only thing that changes is
 * which adapter the factory returns. The fixtures below deliberately cover the
 * cases the linking flow has to get right:
 *
 *   80001111  gold trader, email visible in the mask   -> links on email
 *   80002222  mask hides the local part entirely       -> falls back to date
 *   80003333  cent account, reports in cent-lots       -> normalisation
 *   80004444  in our list but never traded             -> zero activity
 *   (anything else)                                    -> not under us
 */

const DAY_MS = 86_400_000;

function utcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

interface Fixture {
  record: BrokerClientRecord;
  /** Standard lots traded per day, cycled through so charts have shape. */
  dailyLots: number[];
  /** USD the broker pays us per standard lot on this account type. */
  commissionPerLotUsd: number;
}

function buildFixtures(broker: Broker): Fixture[] {
  const registered = (daysAgo: number) => utcDay(new Date(Date.now() - daysAgo * DAY_MS));

  return [
    {
      record: {
        broker,
        accountNumber: '80001111',
        accountType: 'standard',
        currency: 'USD',
        maskedEmail: 'ho***ng@gmail.com',
        registeredOn: registered(120),
        brokerClientId: 'mock-client-1',
      },
      dailyLots: [3.2, 0, 5.1, 8.4, 1.05, 0, 12.6],
      commissionPerLotUsd: 14.4,
    },
    {
      record: {
        broker,
        accountNumber: '80002222',
        accountType: 'pro',
        currency: 'USD',
        maskedEmail: '****@gmail.com',
        registeredOn: registered(45),
        brokerClientId: 'mock-client-2',
      },
      dailyLots: [0.5, 1.2, 0, 0, 2.4, 3.1, 0],
      commissionPerLotUsd: 7.2,
    },
    {
      record: {
        broker,
        accountNumber: '80003333',
        accountType: 'standard_cent',
        currency: 'USC',
        maskedEmail: 'ng***t@yahoo.com',
        registeredOn: registered(9),
        brokerClientId: 'mock-client-3',
      },
      // Already normalised to standard lots, the way a real adapter would
      // hand them over after dividing the broker's cent-lots by 100.
      dailyLots: [0.04, 0.11, 0.02, 0, 0.31, 0.07, 0.15],
      commissionPerLotUsd: 14.4,
    },
    {
      record: {
        broker,
        accountNumber: '80004444',
        accountType: 'standard',
        currency: 'USD',
        maskedEmail: 'tr***n@gmail.com',
        registeredOn: registered(2),
        brokerClientId: 'mock-client-4',
      },
      dailyLots: [0, 0, 0, 0, 0, 0, 0],
      commissionPerLotUsd: 14.4,
    },
  ];
}

export class MockBrokerAdapter implements BrokerAdapter {
  broker: Broker;
  #fixtures: Fixture[];

  constructor(broker: Broker = 'exness') {
    this.broker = broker;
    this.#fixtures = buildFixtures(broker);
  }

  async findClient(accountNumber: string): Promise<BrokerClientRecord | null> {
    return this.#fixtures.find((f) => f.record.accountNumber === accountNumber)?.record ?? null;
  }

  async listClients(): Promise<BrokerClientRecord[]> {
    return this.#fixtures.map((f) => f.record);
  }

  async getDailyActivity(date: Date): Promise<DailyAccountActivity[]> {
    const day = utcDay(date);
    // Index by day-of-epoch so the same date always yields the same numbers.
    const slot = Math.floor(day.getTime() / DAY_MS);

    return this.#fixtures.map((f) => {
      const lots = f.dailyLots[slot % f.dailyLots.length];
      return {
        broker: this.broker,
        accountNumber: f.record.accountNumber,
        date: day,
        volumeLots: lots,
        partnerCommissionUsd: round2(lots * f.commissionPerLotUsd),
      };
    });
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
