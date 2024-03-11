import { ICON_PATH } from '../../assets/path';

export const LIST_PRIVATE = [
  {
    iconLeft: ICON_PATH.settingAccount,
    label: 'Thiết lập hiển thị tài khoản',
    desc: 'Cho phép bạn quản lý nơi mọi người có thể tìm thấy bạn',
    action: 'AccountPrivateVisibleScreen',
  },
  {
    iconLeft: ICON_PATH.iconBell,
    tintColor: '#00b886',
    label: 'Thiết lập thông báo',
    desc: 'Cho phép bật / tắt các loại thông báo của MFast được phép gửi về tài khoản của bạn',
    action: 'NotificationSetting',
  },
  {
    iconLeft: ICON_PATH.lock,
    label: 'Danh sách đã chặn',
    desc: 'Chặn và không cho phép những người này tìm thấy thông tin của bạn',
    action: 'BlockedUsers',
  },
];
