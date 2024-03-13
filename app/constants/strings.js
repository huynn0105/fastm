// all strings used in the app
/* eslint-disable */

const APP_NAME = 'MFast';

export default {
  app_name: `${APP_NAME}`,
  app_info:
    'Công ty Cổ phần Giải pháp Thanh Toán Số\nToà nhà Athena, 146-148 Cộng Hoà, P12,\nQ. Tân Bình, Tp. HCM\n\nCopyright © 2015',
  app_force_update: 'Bạn hãy cài đặt phiên bản mới nhất để có thể tiếp tục sử dụng',
  alert_title: 'MFast',
  alert_title_error: 'Lỗi',
  agreements_1: 'Bằng việc đăng nhập, bạn đã đồng ý với\n',
  agreements_2: 'chính sách Bảo mật & Điều khoản dịch vụ',
  camera_access_error: `Opps! ${APP_NAME} không thể truy cập ảnh. Bạn vui lòng vào Cài đặt và mở cho phép truy cập Photos, Camera`,
  camera_access_error_android: `Opps! ${APP_NAME} không thể truy cập ảnh. Bạn vui lòng vào Cài đặt và mở cho phép truy cập Photos, Camera, Lưu trữ`,
  micro_access_error_android: `Opps! ${APP_NAME} không thể truy cập Micro. Bạn vui lòng vào Cài đặt và mở cho phép truy cập Micro`,
  create_message_error:
    'Oops! Không thể gửi tin nhắn! Vui lòng kiểm tra lại kết nối internet của bạn',
  create_thread_error: 'Oops! Không thể tạo chat! Vui lòng kiểm tra lại kết nối internet của bạn',
  chat_typing_hint: 'Gửi tin nhắn',
  chat_earlier_messages: 'Tải tiếp tin nhắn',
  confirm_send_location: 'Bạn có muốn gửi vị trí hiện tại của bạn?',
  contacts_access_guide: `${APP_NAME} cần truy cập vào Danh Bạ. Bạn hãy vui lòng mở Settings -> Privacy -> Contacts và cho phép ${APP_NAME} truy cập`,
  contacts_empty: 'Không tìm thấy liên hệ MFast nào trong danh bạ',
  contacts_empty_because_access:
    'Không thể đồng bộ danh bạ!\nBạn hãy chọn đồng bộ danh bạ để cập nhật',
  copy_message_text: 'Sao chép',
  digipay_info_1:
    'Công ty cổ phần Giải Pháp Thanh Toán Số (DigiPay JSC.) là startup hoạt động trong lĩnh vực công nghệ tài chính (fintech) tại Việt Nam với thương hiệu MFast. ',
  digipay_info_2:
    'Sứ mệnh của DigiPay JSC. là giúp đỡ mọi người tiếp cận dễ dàng hơn sản phẩm và dịch vụ của các tổ chức tài chính, ngân hàng, bảo hiểm thông qua nền tảng công nghệ. Chúng tôi mong muốn tạo ra các đại lý tất-cả-trong-một với quy trình tư vấn chuyên nghiệp của đội ngũ bán hàng tận tâm, rộng khắp.',
  leave_thread_confirm: 'Bạn có muốn rời khỏi nhóm?',
  leave_thread_error: 'Oops! Không thể rời khỏi chat lúc này. Bạn hãy vui lòng thử lại sau!',
  leave_thread_success: 'Đã rời khỏi chat',
  login_missing_fields: 'Vui lòng nhập\nusername và password',
  login_wrong_password: 'Sai mật khẩu, vui lòng thử lại',
  logout_confirm: 'Bạn có muốn đăng xuất?',
  logout_of_all_devices_confirm: 'Bạn có muốn đăng xuất trên tất cả các thiết bị?',
  logout_error: 'Oops! Không thể đăng xuất! Vui lòng kiểm tra lại kết nối internet của bạn',
  location_access_error:
    'Oops! Không thể tìm ra vị trí hiện tại của bạn. Bạn vui lòng mở cho phép truy cập Vị trí, và mở Dịch vụ định vị',
  missing_field: 'Vui lòng nhập {field_name}',
  missing_bank_account_name: 'Vui lòng nhập tên tài khoản',
  missing_bank_account: 'Vui lòng nhập số tài khoản',
  missing_bank_name: 'Vui lòng nhập tên ngân hàng',
  missing_bank_branch: 'Vui lòng nhập tên chi nhánh',
  navigation_back_title: ' ',
  otp_call_message1: 'MFAST sẽ gọi đến số',
  otp_call_message2: 'và thông báo mã xác thực tài khoản trong vòng',
  otp_hint: 'Nhập mã xác thực tài khoản vào khung trên để cập nhật sự thay đổi',
  otp_request_error: 'Oops! Không thể gửi mã xác thực. Bạn vui lòng thử lại sau',
  password_too_short: 'Oops! Mật khẩu quá ngắn. Mật khẩu phải chứa ít nhất 6 ký tự!',
  quote_message_text: 'Trích dẫn',
  request_action_error: 'Oops! Không thể {action_name} vào lúc này. Bạn hãy vui lòng thử lại sau!',
  request_action_success: 'Chúc mừng bạn đã {action_name} thành công!',
  redeem_not_enough_points: 'Số điểm của bạn hiện tại chưa đủ\nđể đổi quà tặng này!',
  redeem_success: 'chúc mừng bạn đã nhận được quà tặng',
  register_missing_fields: 'Vui lòng nhập các thông tin còn thiếu để tiếp tục đăng ký',
  register_cmnd_duplicated:
    'Oops! Số chứng minh nhân dân này đã được sử dụng! Bạn hãy liên hệ DigiPay để được hỗ trợ',
  register_email_invalid: 'Oops! Email không hợp lệ! Bạn hãy kiểm tra lại',
  register_success_title: 'Mật khẩu đăng nhập đã được gửi đến số điện thoại {phone_number}',
  register_success_details:
    'Vui lòng đổi mật khẩu này sau khi đăng nhập thành công\n(Nếu chưa nhận được mật khẩu hãy bấm gửi lại)',
  reset_passwd_step1_success:
    'Mã OTP đã được gửi đến số điện thoại {phone_number}, dùng mã OTP này để tạo mật khẩu mới',
  reset_passwd_step1_details: '( Nếu chưa nhận được mã OTP hãy bấm gửi lại )',
  reset_passwd_step2_success: 'Đổi mật khẩu thành công',
  reset_passwd_step2_details: '( Vui lòng nhấn tiếp tục để quay về màn hình đăng nhập )',
  threads_empty: 'Bạn chưa nhận được tin nhắn nào',
  update_avatar_error: 'Opps! Không thể cập nhật hình đại diện. Bạn hãy vui lòng thử lại sau!',
  update_bank_info_success: 'Chúc mừng bạn đã cập nhật thành công tài khoàn ngân hàng',
  update_wall_error: 'Opps! Không thể cập nhật hình nền. Bạn hãy vui lòng thử lại sau!',
  update_thread_error: 'Oops! Không thể cập nhật chat lúc này. Bạn hãy vui lòng thử lại sau!',
  update_thread_success: 'Cập nhật thành công',
  upload_image_error: 'Oops! Không thể tải hình. Vui lòng kiểm tra lại kết nối internet của bạn',
  unknown_error: 'Oops! Có lỗi xảy ra. Bạn hãy vui lòng thử lại sau!',
  view_message_details: 'Chi tiết',
  wrong_otp: 'Oops! Mã xác thực không khớp. Bạn vui lòng kiểm tra lại',
  wrong_old_password: 'Mật khẩu cũ không khớp. Bạn vui lòng kiểm tra lại',
  wrong_new_password: 'Mật khẩu mới không khớp. Bạn vui lòng kiểm tra lại',

  remove_member_chat_title: 'Xoá thành viên',
  save_image_photo: 'Lưu vào thư viện',
  saving_image: 'Đang tải...',
  saving_image_fail: 'Tải thất bại',
  saving_image_success: 'Đã tải thành công',

  missing_field_value: 'Vui lòng nhập thông tin',

  delete: 'Xoá tin nhắn',
  recall: 'Thu hồi tin nhắn',
  edit: 'Chỉnh sửa',

  app_support: 'Tổng đài MFast',
};

/* eslint-enable */

// METHODS
// --------------------------------------------------

export function formatString(string, params) {
  let formattedString = string;
  for (const key in params) {
    // eslint-disable-line
    formattedString = string.replace(`{${key}}`, params[key]);
  }
  return formattedString;
}
