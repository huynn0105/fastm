import React from 'react';
import { View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';
import Colors from '../../theme/Color';
import InfoView from '../Collaborator/common/InfoView';
import { ITEM_IDS } from '../Home/HomeActionSheet';

export const INIT_SECTION = [
  {
    title: '',
    id: 'USER_INFOR',
    note: '',
    data: [],
  },
];

export const DEFAULT_ANONYMOUS = [
  {
    title: 'Trung tâm hỗ trợ',
    id: 'TRUNGTAMHOTRO',
    note: '',
    data: [
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/E18DE6B6-A91C-4F7A-8F0B-6B3E1856C568.png',
        label: 'Email',
        action: 'mailto:hotro@appay.vn?subject=MFast: Yêu cầu hỗ trợ',
        hideNextIcon: true,
        rightLabel: 'hotro@mfast.vn',
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/FE9DD9DE-1C20-48DC-BA44-76EE4D1FF181.png',
        label: 'Gửi yêu cầu hỗ trợ',
        action: `${DEEP_LINK_BASE_URL}://open?view=OSTicket&screenMode=Welcome`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/AD06A5AA-6F6B-4EAE-BDA8-6123C7C54DE3.png',
        label: 'Thông tin ứng dụng',
        action: `${DEEP_LINK_BASE_URL}://open?view=AboutAppay`,
      },
    ],
  },
];

export const DEFAULT_AUTH = [
  {
    title: 'Thiết lập chung',
    id: 'THIETLAPCHUNG',
    note: '',
    data: [
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/175E0E84-6697-42C8-8318-1278090F97C0.png',
        label: 'Thiết lập thông báo',
        action: `${DEEP_LINK_BASE_URL}://open?view=NotificationSetting`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/26C9EF48-50BB-4A0A-BBBD-9C73650659FE.png',
        label: 'Lịch sử đăng nhập',
        action: `${DEEP_LINK_BASE_URL}://open?view=LoginActivities`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/43BEDCC0-5266-4EFF-B45F-0C7EA2D07EB9.png',
        label: 'Danh sách người bị chặn',
        action: `${DEEP_LINK_BASE_URL}://open?view=BlockedUsers`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/03908234-28FA-4FE7-A1F4-6A98ED1405C6.png',
        label: 'Đăng xuất',
        action: 'MFAST_LOGOUT',
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/16EA6BED-2CD8-43EE-98D8-C04AC7EBE37D.png',
        label: 'Đăng xuất tất cả thiết bị',
        action: 'MFAST_LOGOUT_ALL_DEVICES',
      },
    ],
  },
  {
    title: 'Trung tâm hỗ trợ',
    id: 'TRUNGTAMHOTRO',
    note: '',
    data: [
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/E18DE6B6-A91C-4F7A-8F0B-6B3E1856C568.png',
        label: 'Email',
        action: 'mailto:hotro@appay.vn?subject=MFast: Yêu cầu hỗ trợ',
        hideNextIcon: true,
        rightLabel: 'hotro@mfast.vn',
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/FE9DD9DE-1C20-48DC-BA44-76EE4D1FF181.png',
        label: 'Gửi yêu cầu hỗ trợ',
        action: `${DEEP_LINK_BASE_URL}://open?view=OSTicket&screenMode=Welcome`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/AD06A5AA-6F6B-4EAE-BDA8-6123C7C54DE3.png',
        label: 'Thông tin ứng dụng',
        action: `${DEEP_LINK_BASE_URL}://open?view=AboutAppay`,
      },
    ],
  },
];

export const SECTION_MENU_ACCOUNT = [
  {
    title: 'Hồ sơ',
    id: 'HOSO',
    note: 'Cung cấp hồ sơ cơ bản để bảo vệ tài khoản, rút tiền và sử dụng các nghiệp vụ bán hàng nâng cao',
    data: [
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/27FC9198-AE49-406B-B367-AF6781F7803E.png',
        label: 'Định danh tài khoản',
        action: `${DEEP_LINK_BASE_URL}://open?view=AccountIdentificationScreen`,
        disabled: false,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/DC47989F-2FD6-4E66-827B-0B2794C89AF7.png',
        label: 'Tài khoản NH & CKT',
        action: `${DEEP_LINK_BASE_URL}://open?view=BankAccountScreen`,
        disabled: false,
        rightLabelObject: {
          type: 'TEXT',
          content: '0',
          color: Colors.accent2,
        },
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/9A0F17E1-8C19-4320-A3AC-E8BC0B424081.png',
        label: 'Hợp đồng dịch vụ',
        action: `${DEEP_LINK_BASE_URL}://open?view=ContractCollaboratorsScreen`,
        disabled: true,
        rightLabelObject: {
          type: 'IMAGE',
          content:
            'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/73169603-A870-487F-817F-2DCC79E204A2.png',
        },
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/4ADB0169-87D5-4F6C-BE35-195B713FB490.png',
        label: 'Ứng tuyển nv tài chính',
        action: '',
        disabled: true,
        rightLabelObject: {
          type: 'TEXT',
          content: '3',
          color: Colors.primary1,
        },
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/5C5A4DE8-D607-46D3-B0EB-978E8E9C6480.png',
        label: 'Thẻ nhân viên',
        action: `${DEEP_LINK_BASE_URL}://open?view=EmployeeCard`,
        disabled: true,
        rightLabelObject: {
          type: 'TEXT',
          content: '4',
          color: Colors.primary1,
        },
      },
    ],
  },
  {
    title: 'Thiết lập chung',
    id: 'THIETLAPCHUNG',
    note: '',
    data: [
      // {
      //     iconUrl: 'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/175E0E84-6697-42C8-8318-1278090F97C0.png',
      //     label: 'Thiết lập thông báo',
      //     action: `${DEEP_LINK_BASE_URL}://open?view=NotificationSettin`'
      // },
      // {
      //     iconUrl: 'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/26C9EF48-50BB-4A0A-BBBD-9C73650659FE.png',
      //     label: 'Lịch sử đăng nhập',
      //     action: `${DEEP_LINK_BASE_URL}://open?view=LoginActivitie`'
      // },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/03908234-28FA-4FE7-A1F4-6A98ED1405C6.png',
        label: 'Mật khẩu và bảo mật',
        action: `${DEEP_LINK_BASE_URL}://open?view=PasswordAndSecurity`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/43BEDCC0-5266-4EFF-B45F-0C7EA2D07EB9.png',
        label: 'Thiết lập quyền riêng tư',
        action: `${DEEP_LINK_BASE_URL}://open?view=PrivateAccountScreen`,
      },

      // {
      //     iconUrl: 'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/16EA6BED-2CD8-43EE-98D8-C04AC7EBE37D.png',
      //     label: 'Đăng xuất tất cả thiết bị',
      //     action: 'MFAST_LOGOUT_ALL_DEVICES'
      // },
    ],
  },
  {
    title: 'Trung tâm hỗ trợ',
    id: 'TRUNGTAMHOTRO',
    note: '',
    data: [
      // {
      //   iconUrl:
      //     'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/E18DE6B6-A91C-4F7A-8F0B-6B3E1856C568.png',
      //   label: 'Hotline hỗ trợ miễn phí',
      //   action: 'tel:08999.09789',
      //   hideNextIcon: true,
      //   rightLabel: '08999.09789',
      // },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/E18DE6B6-A91C-4F7A-8F0B-6B3E1856C568.png',
        label: 'Email',
        action: 'mailto:hotro@appay.vn?subject=MFast: Yêu cầu hỗ trợ',
        hideNextIcon: true,
        rightLabel: 'hotro@mfast.vn',
      },
      // {
      //   iconUrl:
      //     'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/E18DE6B6-A91C-4F7A-8F0B-6B3E1856C568.png',
      //   label: 'Zalo',
      //   action: `${DEEP_LINK_BASE_URL}://browser?url=https://zalo.me/10875104935904931`,
      //   hideNextIcon: true,
      //   rightLabel: 'MFast Fanpage',
      // },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/7ACEC990-1CE1-44F3-9091-3A6B98230EBA.png',
        label: 'Facebook',
        action: `${DEEP_LINK_BASE_URL}://browser?url=https://www.facebook.com/appayvn/`,
        hideNextIcon: true,
        rightLabel: 'MFast Fanpage',
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/FE9DD9DE-1C20-48DC-BA44-76EE4D1FF181.png',
        label: 'Gửi yêu cầu hỗ trợ',
        action: `${DEEP_LINK_BASE_URL}://open?view=OSTicket&screenMode=Welcome`,
      },
      {
        iconUrl:
          'https://cdn.zeplin.io/5ccbe514ece43c3484787679/assets/AD06A5AA-6F6B-4EAE-BDA8-6123C7C54DE3.png',
        label: 'Thông tin ứng dụng',
        action: `${DEEP_LINK_BASE_URL}://open?view=AboutAppay`,
      },
    ],
  },
];

export const LIST_CTV_FUNCTION = [
  {
    uid: ITEM_IDS.COLLABORATOR_LEAVE,
    title: 'Cộng tác viên cần chăm sóc',
    icon: ICON_PATH.sentCommunication,
    detailComponent: (collaboratorLeave) => (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.primary5,
          borderRadius: 8,
          flexWrap: 'wrap',
          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
        pointerEvents="none"
      >
        <InfoView
          style={{ width: '33%', flex: 0, paddingVertical: 8 }}
          titleColor={Colors.gray5}
          arrowColor={Colors.transparent}
          contentColor={Colors.purple}
          title={'Có hoạt động'}
          content={collaboratorLeave?.working || 0}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
        />
        <InfoView
          style={{ width: '33%', flex: 0, paddingVertical: 8 }}
          title={'Cần chú ý '}
          backgroundColor={Colors.primary5}
          titleColor={Colors.gray5}
          arrowColor={Colors.transparent}
          contentColor={Colors.sixRed}
          content={collaboratorLeave?.follow || 0}
          isBetweenContent={false}
        />
        <InfoView
          style={{ width: '33%', flex: 0, paddingVertical: 8 }}
          title={'Có thể rời đi'}
          backgroundColor={Colors.primary5}
          titleColor={Colors.gray5}
          arrowColor={Colors.transparent}
          contentColor={Colors.sixOrange}
          content={collaboratorLeave?.can_leave || 0}
          isBetweenContent={false}
        />
        <InfoView
          style={{ width: '33%', flex: 0, paddingVertical: 8 }}
          title={'Có thể xóa'}
          backgroundColor={Colors.primary5}
          titleColor={Colors.gray5}
          arrowColor={Colors.transparent}
          contentColor={Colors.blue3}
          content={collaboratorLeave?.can_remove || 0}
          isBetweenContent={false}
        />
        <InfoView
          style={{ width: '33%', flex: 0, paddingVertical: 8 }}
          title={'Vừa rời đi'}
          backgroundColor={Colors.primary5}
          titleColor={Colors.gray5}
          arrowColor={Colors.transparent}
          contentColor={Colors.gray1}
          content={collaboratorLeave?.departed || 0}
          isBetweenContent={false}
        />
      </View>
    ),
  },
  {
    uid: ITEM_IDS.INVITE_USER,
    title: 'Mời người khác tham gia cộng đồng',
    icon: ICON_PATH.sentMessage,
  },
  {
    uid: ITEM_IDS.RSM_PUSH_MESSAGE,
    title: 'Tương tác hàng loạt với cộng đồng',
    icon: ICON_PATH.pushMessage,
  },
  {
    uid: ITEM_IDS.POLICY_COLLABORATOR,
    title: 'Quy định về duy trì cộng đồng',
    icon: ICON_PATH.sentMessage2,
  },
];

export const LIST_CTV_FUNCTION_WITHOUT_RSM = LIST_CTV_FUNCTION.slice(0, 2).concat(
  LIST_CTV_FUNCTION.slice(3),
);

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
        action: `${DEEP_LINK_BASE_URL}://open?view=BankAccountScreen`,
        disabled: false,
        rightLabelObject: { type: 'TEXT', content: 0, color: '' },
        isPending: true,
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-contract.png',
        label: 'Hợp đồng dịch vụ',
        action: `${DEEP_LINK_BASE_URL}://open?view=ContractCollaboratorsScreen`,
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
        action: `${DEEP_LINK_BASE_URL}://open?view=webview&title=Ứng tuyển nv tài chính&url=https://appay-rc.cloudcms.vn/mfast/channel`,
        disabled: false,
        rightLabelObject: { type: 'TEXT', content: 10, color: '' },
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-create-channel.png',
        label: 'Chứng từ thuế',
        action: `${DEEP_LINK_BASE_URL}://open?view=webview&title=Ứng tuyển nv tài chính&url=https://appay-rc.cloudcms.vn/mfast/channel`,
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
        action: `${DEEP_LINK_BASE_URL}://open?view=PasswordAndSecurity`,
      },
      {
        icon: 'https://appay-rc.cloudcms.vn/mfast_assets/img/personal/icon-block.png',
        label: 'Thiết lập quyền riêng tư',
        action: `${DEEP_LINK_BASE_URL}://open?view=PrivateAccountScreen`,
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
        action: `${DEEP_LINK_BASE_URL}://open?view=AboutAppay`,
      },
    ],
  },
];
