import { serverURL } from '../../constants/configs';
import Colors from '../../theme/Color';

export const TAB_TYPE = {
  // FINANCIAL: 'pl',
  INSURANCE: 'insurance',
  PRIORITY: 'priority',
  PAGE: 'page_qc',
  ALL: 'all',
  CREDIT_CARD: 'credit',
  LOAN: 'pl',
  MPL: 'mpl',
  DDA: 'daa',
  TRASH: 'trash',
};

export const FINANCIAL_PROJECTS = TAB_TYPE.FINANCIAL;
export const INSURANCE_PROJECTS = TAB_TYPE.INSURANCE;
export const LIST_PAGE = TAB_TYPE.PAGE;
export const TAB_ITEM = 'TAB_ITEM';
export const STATUS_ITEM = 'status';
export const TRANSACTION_STATE_ITEM = 'TRANSACTION_STATE_ITEM';

export const TRANSACTION_STATE = {
  WAIT: 'WAIT',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  CANCELLED: 'CANCELLED',
};

export const ITEM_TYPE = {
  LIST_SELECT: 'LIST_SELECT',
  MODAL_SELECT: 'MODAL_SELECT',
};

export const LIST_TYPE_CUSTOMER = {
  key: TAB_ITEM,
  type: ITEM_TYPE.LIST_SELECT,
  data: [
    {
      id: TAB_TYPE.ALL,
      title: 'Tất cả',
      colorActive: Colors.primary2,
      colorInActive: Colors.blue6,
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.PRIORITY,
      title: 'Tiềm năng',
      colorActive: '#976bb3',
      colorInActive: '#e9d7f4',
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.LOAN,
      title: 'Vay tín chấp',
      colorActive: '#221db0',
      colorInActive: '#d6deff',
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.CREDIT_CARD,
      title: 'Thẻ tín dụng',
      colorActive: '#00c28e',
      colorInActive: '#d6fff4',
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.MPL,
      title: 'Bán hàng trả chậm',
      colorActive: Colors.primary2,
      colorInActive: Colors.blue6,
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.DDA,
      title: 'TK ngân hàng / Ví điện tử',
      colorActive: '#e93535',
      colorInActive: '#fbdada',
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
    {
      id: TAB_TYPE.INSURANCE,
      title: 'Bảo hiểm',
      colorActive: '#f58b14',
      colorInActive: '#fdecd8',
      textActive: Colors.primary5,
      textInActive: Colors.gray5,
    },
  ],
};

export const LIST_FINANCIAL = [
  {
    id: 'm_credit',
    value: 'Mcredit',
  },
  {
    id: 'ptf',
    value: 'PTF',
  },
  {
    id: 'easy_credit',
    value: 'Easycredit',
  },
  {
    id: 'mirae_asset',
    value: 'MiraeAsset',
  },
  {
    id: 'home_credit',
    value: 'Homecredit',
  },
  {
    id: 'cimb',
    value: 'CIMB',
  },
];

export const LIST_TRANSACTION_STATE = [
  {
    id: TRANSACTION_STATE.PROCESSING,
    value: 'Đang xử lý',
  },
  {
    id: TRANSACTION_STATE.PROCESSED,
    value: 'Hoàn thành',
  },
  {
    id: TRANSACTION_STATE.CANCELLED,
    value: 'Thất bại',
  },
];

export const LIST_CHECKBOX_TYPE_INSURANCE = [
  {
    id: 'hot',
    value: 'Hot',
  },
  {
    id: 'pandemic',
    value: 'Dịch bệnh',
  },
  {
    value: 'Tai nạn',
    id: 'accident',
  },
  {
    value: 'Khoản vay',
    id: 'loan',
  },
  {
    value: 'Thai sản',
    id: 'pregnant',
  },

  {
    value: 'Du lịch',
    id: 'travel',
  },
  {
    value: 'Trẻ em',
    id: 'child',
  },
  {
    value: 'Ô tô',
    id: 'car',
  },
  {
    value: 'Nội - ngoại trú',
    id: 'domestic',
  },
  {
    value: 'Xe máy',
    id: 'motorcycle',
  },
  {
    value: 'Nha khoa',
    id: 'hospital',
  },
  {
    value: 'Tài sản khác',
    id: 'other',
  },
  {
    value: 'Bệnh nặng',
    id: 'heavy',
  },
  {
    value: 'Tất cả các dự án bảo hiểm',
    id: 'all',
  },
];

export const getTabId = (index = 0) => {
  return LIST_TYPE_CUSTOMER?.data?.[index]?.id;
};

export const getImage = (item) => {
  const { image, icon, iconURL } = item;
  const img = image || icon || iconURL;
  if (img?.includes('{{base_url}}')) {
    return img?.replace('{{base_url}}', `${serverURL}/`);
  }
  return img;
};

export const TAB_TITLE = [
  {
    id: '1',
    title: 'Thống kê',
  },
  {
    id: '2',
    title: 'Danh sách',
  },
];
