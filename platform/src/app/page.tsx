import Link from 'next/link';

import { DEFAULT_TIERS } from '../domain/tiers.ts';

/**
 * The landing page states the ladder in full on the same screen as the "up to
 * 100%" promise. Competitors advertise 100% and pay less on the account types
 * people actually trade; the whole differentiator here is that our own
 * statement can never contradict our own landing page.
 */

const TIER_LABELS: Record<string, string> = {
  standard: 'Tiêu chuẩn',
  advanced: 'Nâng cao',
  max: 'Tối đa',
};

export default function HomePage() {
  return (
    <main>
      <h1>Hoàn phí tới 100% — bảng tỷ lệ công khai</h1>
      <p className="lead">
        Nhận lại phần hoa hồng sàn trả cho chúng tôi trên từng lệnh bạn đóng. Không giới hạn số
        lệnh, không cần yêu cầu rút, không giữ tiền của bạn.
      </p>

      <h2>Bảng tỷ lệ</h2>
      <table>
        <thead>
          <tr>
            <th>Bậc</th>
            <th>Khối lượng tháng trước</th>
            <th>Tỷ lệ hoàn phí</th>
          </tr>
        </thead>
        <tbody>
          {DEFAULT_TIERS.map((tier) => (
            <tr key={tier.id}>
              <td>{TIER_LABELS[tier.id] ?? tier.id}</td>
              <td>từ {tier.minLotsPrevMonth} lot</td>
              <td>{Math.round(tier.traderShare * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">
        Tỷ lệ tính trên phần hoa hồng sàn trả cho chúng tôi. Bậc được nâng tự động vào đầu mỗi
        tháng theo khối lượng tháng liền trước — bạn không cần yêu cầu.
      </p>

      <h2>Bắt đầu</h2>
      <p>
        <Link href="/lien-ket-tai-khoan">Liên kết tài khoản giao dịch của bạn →</Link>
      </p>

      <p className="disclaimer">
        Giao dịch ký quỹ có mức rủi ro cao và có thể khiến bạn mất toàn bộ số vốn. Nội dung trên
        trang này không phải là tư vấn đầu tư. Chúng tôi là đối tác giới thiệu, không phải sàn giao
        dịch, và không nhận hay giữ tiền của khách hàng.
      </p>
    </main>
  );
}
