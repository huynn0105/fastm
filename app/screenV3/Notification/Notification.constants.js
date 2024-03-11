import { ITEM_TYPE } from '../Customer/Customer.constants';

export const TAB_TYPE = {
  ALL: 'all',
  FLAG: 'flags',
  FINANCIAL: 'pl',
  AFFILIATE: 'affiliate',
  INSURANCE: 'insurance',
  COMPETE: 'compete',
  OTHER: 'other',
};

export const LIST_TYPE_NOTIFICATION = {
  key: 'tab',
  type: ITEM_TYPE.LIST_SELECT,
  data: [
    { id: TAB_TYPE.ALL, title: '', isHidden: true },
    { id: TAB_TYPE.FLAG, title: 'Đánh dấu' },
    {
      id: TAB_TYPE.FINANCIAL,
      title: 'Tài chính',
    },
    {
      id: TAB_TYPE.AFFILIATE,
      title: 'Tiếp thị liên kết',
    },
    {
      id: TAB_TYPE.INSURANCE,
      title: 'Bảo hiểm',
    },
    {
      id: TAB_TYPE.COMPETE,
      title: 'Thi đua',
    },
    {
      id: TAB_TYPE.OTHER,
      title: 'MFast',
    },
  ],
};
