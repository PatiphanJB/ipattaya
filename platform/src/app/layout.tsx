import type { Metadata } from 'next';

import './globals.css';

/**
 * The title and description carry no broker name on purpose: the partnership
 * agreement forbids a broker trademark in the domain, in keywords and in the
 * meta title and description. Broker names appear only inside the page body,
 * where the user is choosing between them.
 */
export const metadata: Metadata = {
  title: 'Hoàn phí giao dịch — nhận lại phí spread và hoa hồng',
  description:
    'Liên kết tài khoản giao dịch của bạn và nhận hoàn phí tự động theo từng lệnh đã đóng. Bảng tỷ lệ công khai, không giữ tiền của khách.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
