import { View } from 'react-native';

export const SECTION_DATA = [
  {
    title: '',
    id: 'USER_INFO',
    data: [],
  },
  {
    title: 'Hồ sơ',
    id: 'HOSO',
    note: 'Cung cấp hồ sơ cơ bản để bảo vệ tài khoản, rút tiền và sử dụng các nghiệp vụ bán hàng nâng cao',
    horizontal: true,
    data: [
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-banking.png',
        label: 'Thông tin cá nhân',
        action: 'mfastmobiledev://open?view=BankAccountScreen',
        disabled: false,
        rightLabelObject: { type: 'TEXT', content: 0, color: '' },
        isPending: true,
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-contract.png',
        label: 'Hợp đồng dịch vụ',
        action: 'mfastmobiledev://open?view=ContractCollaboratorsScreen',
        disabled: false,
        rightLabelObject: {
          type: 'IMAGE',
          content:
            'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/iconlyLightOutlineShieldDone.png',
          color: '',
        },
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-create-channel.png',
        label: 'Liên kết ngân hàng',
        action:
          'mfastmobiledev://open?view=webview&title=Ứng tuyển nv tài chính&url=https://appay-rc.cloudcms.vn/mfast/channel',
        disabled: false,
        rightLabelObject: { type: 'TEXT', content: 10, color: '' },
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-create-channel.png',
        label: 'Chứng từ thuế',
        action:
          'mfastmobiledev://open?view=webview&title=Ứng tuyển nv tài chính&url=https://appay-rc.cloudcms.vn/mfast/channel',
        disabled: false,
        rightLabelObject: { type: 'TEXT', content: 10, color: '' },
      },
    ],
  },
  {
    title: '',
    id: 'MY_SUPPORTER',
    data: [],
  },
  {
    title: 'Thiết lập chung',
    id: 'THIETLAPCHUNG',
    note: '',
    data: [
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-logout.png',
        label: 'Mật khẩu và bảo mật',
        action: 'mfastmobiledev://open?view=PasswordAndSecurity',
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-block.png',
        label: 'Thiết lập quyền riêng tư',
        action: 'mfastmobiledev://open?view=PrivateAccountScreen',
      },
    ],
  },
  {
    title: 'Trung tâm hỗ trợ',
    id: 'TRUNGTAMHOTRO',
    note: '',
    data: [
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-email.png',
        label: 'Email',
        action: 'mailto:hotro@MFast.vn?subject=MFast: Yêu cầu hỗ trợ',
        hideNextIcon: true,
        rightLabel: 'hotro@mfast.vn',
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-facebook.png',
        label: 'Facebook',
        action: 'fb://profile/100904784888246',
        hideNextIcon: true,
        rightLabel: 'MFast Fanpage',
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-zalo.png',
        label: 'Zalo',
        action: 'https://zalo.me/2722690151086352410',
        hideNextIcon: true,
        rightLabel: 'Zalo Fanpage',
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-info-app.png',
        label: 'Thông tin ứng dụng',
        action: 'mfastmobiledev://open?view=AboutAppay',
      },
    ],
  },
];
