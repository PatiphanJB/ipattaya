'use client';

import { useState } from 'react';

import { BROKERS, type Broker } from '../../domain/types.ts';

/**
 * The link form.
 *
 * It shows the same three-way answer the domain produces — linked, waiting for
 * review, sitting under another partner — and treats the third as the ordinary
 * case it is. Most Vietnamese traders already have an account under someone
 * else; a form that calls that an error loses them at the first step, so the
 * partner-change instructions are part of the response, not a support article.
 */

const BROKER_LABELS: Record<Broker, string> = {
  exness: 'Exness',
  xm: 'XM',
  icmarkets: 'IC Markets',
  vantage: 'Vantage',
};

/** Only brokers we actually have a partner account with can be chosen. */
const AVAILABLE: readonly Broker[] = BROKERS.filter((b) => b === 'exness');

interface LinkResponse {
  ok: boolean;
  code: string;
  message: string;
  account?: { accountNumber: string; accountType: string; status: string };
}

type Tone = 'ok' | 'pending' | 'bad';

const TONE_BY_CODE: Record<string, Tone> = {
  linked: 'ok',
  ownership_unproven: 'pending',
  not_under_us: 'pending',
};

const HEADING_BY_CODE: Record<string, string> = {
  linked: 'Đã liên kết',
  ownership_unproven: 'Đang chờ duyệt',
  not_under_us: 'Tài khoản đang thuộc đối tác khác',
};

const PARTNER_CHANGE_STEPS = [
  'Đăng nhập Personal Area của sàn, mở mục hỗ trợ trực tuyến (live chat).',
  'Yêu cầu đổi đối tác (partner change) sang mã đối tác của chúng tôi và gửi kèm mã bên dưới.',
  'Sàn yêu cầu tài khoản không có lệnh đang mở và thường không có giao dịch trong 30 ngày gần nhất.',
  'Sau khi sàn xác nhận, quay lại đây và bấm liên kết một lần nữa — hoặc để nguyên, hệ thống sẽ tự liên kết trong lần đồng bộ kế tiếp.',
];

export function LinkForm({ partnerCode }: { partnerCode: string }) {
  const [broker, setBroker] = useState<Broker>('exness');
  const [accountNumber, setAccountNumber] = useState('');
  const [registeredOn, setRegisteredOn] = useState('');
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<LinkResponse | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setResponse(null);

    try {
      const res = await fetch('/api/accounts/link', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ broker, accountNumber, registeredOn: registeredOn || null }),
      });
      setResponse((await res.json()) as LinkResponse);
    } catch {
      setResponse({
        ok: false,
        code: 'network',
        message: 'Không gửi được yêu cầu. Kiểm tra kết nối mạng và thử lại.',
      });
    } finally {
      setBusy(false);
    }
  }

  const tone: Tone = response ? (TONE_BY_CODE[response.code] ?? 'bad') : 'bad';
  const heading = response ? (HEADING_BY_CODE[response.code] ?? 'Chưa liên kết được') : '';

  return (
    <>
      <form className="panel" onSubmit={submit}>
        <label className="field">
          <span>Sàn giao dịch</span>
          <select value={broker} onChange={(e) => setBroker(e.target.value as Broker)}>
            {AVAILABLE.map((b) => (
              <option key={b} value={b}>
                {BROKER_LABELS[b]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Số tài khoản giao dịch</span>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ví dụ: 80001111"
            required
          />
        </label>
        <p className="hint">
          Là số tài khoản MT4/MT5, không phải email hay số điện thoại đăng nhập.
        </p>

        <label className="field">
          <span>Ngày mở tài khoản (không bắt buộc)</span>
          <input
            type="date"
            value={registeredOn}
            onChange={(e) => setRegisteredOn(e.target.value)}
          />
        </label>
        <p className="hint">
          Chỉ cần khi email của bạn bị sàn che gần hết. Điền vào sẽ được duyệt tự động thay vì chờ
          duyệt tay.
        </p>

        <button type="submit" disabled={busy}>
          {busy ? 'Đang kiểm tra…' : 'Liên kết tài khoản'}
        </button>
      </form>

      {response && (
        <div className={`result ${tone}`} role="status">
          <h3>{heading}</h3>
          <p>{response.message}</p>

          {response.code === 'not_under_us' && (
            <>
              <p>
                Mã đối tác của chúng tôi: <strong>{partnerCode}</strong>
              </p>
              <ol>
                {PARTNER_CHANGE_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </>
  );
}
