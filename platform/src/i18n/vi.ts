/**
 * Vietnamese copy, keyed by the stable message keys the domain returns.
 *
 * The domain and the services never contain a word of Vietnamese: they hand
 * back a key, and this file is the only place a human sentence lives. That
 * keeps the linking rules readable to someone who does not speak Vietnamese
 * and lets a translator work without touching logic.
 *
 * Tone: second person, plain, no exclamation marks. The people reading these
 * strings have just typed their trading account number into a website they
 * have known for five minutes.
 */

export const vi = {
  'link.success':
    'Đã liên kết tài khoản thành công. Hoàn phí bắt đầu được tính từ các lệnh đóng kể từ hôm nay.',

  'link.pendingReview':
    'Tài khoản này nằm dưới đối tác của chúng tôi, nhưng chúng tôi chưa xác minh được bạn là chủ tài khoản. Yêu cầu đã được chuyển sang duyệt thủ công, thường trong vòng 24 giờ. Bạn có thể nhập thêm ngày mở tài khoản để được duyệt nhanh hơn.',

  'link.notUnderUs':
    'Tài khoản có thật nhưng hiện đang thuộc một đối tác khác, nên chúng tôi không nhận được hoa hồng và không thể hoàn phí cho bạn. Bạn cần đổi đối tác (partner change) rồi liên kết lại — hướng dẫn ở ngay bên dưới.',

  'link.error.empty': 'Bạn chưa nhập số tài khoản.',
  'link.error.not_numeric': 'Số tài khoản chỉ gồm chữ số. Hãy kiểm tra lại phần bạn vừa dán.',
  'link.error.too_short': 'Số tài khoản ngắn hơn mức hợp lệ. Hãy kiểm tra lại.',
  'link.error.too_long': 'Số tài khoản dài hơn mức hợp lệ. Hãy kiểm tra lại.',

  'link.error.claimed_by_another_user':
    'Số tài khoản này đã được một người dùng khác liên kết. Nếu đây đúng là tài khoản của bạn, hãy liên hệ hỗ trợ.',

  'link.error.unknown_user': 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',

  'link.error.rate_limited':
    'Bạn đã thử liên kết quá nhiều lần trong một giờ. Vui lòng thử lại sau.',

  'link.error.broker_unavailable':
    'Hiện chưa kết nối được tới sàn để kiểm tra số tài khoản. Vui lòng thử lại sau ít phút.',

  'link.error.bad_request': 'Dữ liệu gửi lên không hợp lệ.',
} as const;

export type MessageKey = keyof typeof vi;

/**
 * Unknown keys return the key itself rather than an empty string: a missing
 * translation should be visible in testing, not invisible in production.
 */
export function t(key: string): string {
  return (vi as Record<string, string>)[key] ?? key;
}
