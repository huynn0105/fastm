import { ICON_PATH } from '../../assets/path';

export const STEP_ENUM = {
  default: '',
  insurance: 'insurance',
  finance: 'finance',
  mpl: 'mpl',
  affiliate: 'affiliate',
};

export const LIST_DEFAULT = [
  {
    id: STEP_ENUM.mpl,
    title: 'Khởi tạo hồ sơ mua hàng trả chậm',
    webviewTitle: 'Mua hàng trả chậm MPL',
    icon: ICON_PATH.mplNameLogo,
    iconSize: 36,
    isHighlight: false,
  },
  {
    id: STEP_ENUM.finance,
    title: 'Khởi tạo hồ sơ vay',
    icon: ICON_PATH.money,
    iconSize: 30,
    isHighlight: false,
  },
  {
    id: STEP_ENUM.insurance,
    title: 'Khởi tạo hợp đồng bảo hiểm',
    icon: ICON_PATH.heartUser,
    iconSize: 32,
    isHighlight: false,
  },
  {
    id: STEP_ENUM.affiliate,
    title: 'Mở ngân hàng số/ví điện tử',
    icon: ICON_PATH.bank,
    iconSize: 32,
    isHighlight: false,
  },
];
export const LIST_DEFAULT_WITHOUT_MPL = [
  {
    id: STEP_ENUM.finance,
    title: 'Khởi tạo hồ sơ vay',
    icon: ICON_PATH.money,
    iconSize: 30,
    isHighlight: false,
  },
  {
    id: STEP_ENUM.insurance,
    title: 'Khởi tạo hợp đồng bảo hiểm',
    icon: ICON_PATH.heartUser,
    iconSize: 32,
    isHighlight: false,
  },
  {
    id: STEP_ENUM.affiliate,
    title: 'Mở ngân hàng số/ví điện tử',
    icon: ICON_PATH.bank,
    iconSize: 32,
    isHighlight: false,
  },
];
