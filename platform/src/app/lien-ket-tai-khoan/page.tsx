import { LinkForm } from './link-form.tsx';
import { usingMockBroker } from '../../server/container.ts';

export const metadata = {
  title: 'Liên kết tài khoản giao dịch',
};

/**
 * The partner code is read from the environment rather than hard-coded: it is
 * the one value that must never end up wrong in a deploy, and it changes
 * independently of the code.
 */
const PARTNER_CODE = process.env.NEXT_PUBLIC_PARTNER_CODE ?? 'chưa cấu hình';

export default function LinkAccountPage() {
  return (
    <main>
      <h1>Liên kết tài khoản giao dịch</h1>
      <p className="lead">
        Sau khi liên kết, mỗi lệnh bạn đóng sẽ được tính hoàn phí tự động. Chúng tôi không giữ tiền
        của bạn: sàn trả hoàn phí thẳng vào tài khoản giao dịch.
      </p>

      {usingMockBroker() && (
        <div className="result pending">
          <h3>Chế độ thử nghiệm</h3>
          <p>
            Hệ thống đang chạy với dữ liệu giả lập, chưa kết nối sàn thật. Thử các số:{' '}
            <strong>80001111</strong> (liên kết được ngay), <strong>80002222</strong> (cần ngày mở
            tài khoản), <strong>80009999</strong> (thuộc đối tác khác).
          </p>
        </div>
      )}

      <LinkForm partnerCode={PARTNER_CODE} />

      <h2>Vì sao cần số tài khoản?</h2>
      <p>
        Sàn chỉ trả hoa hồng cho những tài khoản nằm dưới mã đối tác của chúng tôi. Số tài khoản là
        cách duy nhất để đối chiếu khối lượng bạn giao dịch với khoản hoa hồng sàn trả, rồi hoàn lại
        cho bạn. Chúng tôi không cần và không bao giờ hỏi mật khẩu tài khoản giao dịch của bạn.
      </p>

      <p className="disclaimer">
        Giao dịch ký quỹ có mức rủi ro cao và có thể khiến bạn mất toàn bộ số vốn. Nội dung trên
        trang này không phải là tư vấn đầu tư. Chúng tôi là đối tác giới thiệu, không phải sàn giao
        dịch, và không nhận hay giữ tiền của khách hàng.
      </p>
    </main>
  );
}
