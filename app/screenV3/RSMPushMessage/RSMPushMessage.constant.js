export const LIST_TYPE_RSM = [
  // {
  //   id: 'all',
  //   label: 'Tất cả',
  //   labelUnfocus: 'Tất cả',
  //   value: 'all',
  // },
  {
    id: '1',
    label: 'CTV Cấp 1',
    labelUnfocus: 'Cấp 1',
    value: 1,
  },
  {
    id: '2',
    label: 'CTV Cấp 2',
    labelUnfocus: 'Cấp 2',
    value: 2,
  },
  {
    id: '3',
    label: 'CTV Cấp 3',
    labelUnfocus: 'Cấp 3',
    value: 3,
  },
  {
    id: '4',
    label: 'CTV Cấp 4',
    labelUnfocus: 'Cấp 4',
    value: 4,
  },
  {
    id: '5',
    label: 'CTV Cấp 5',
    labelUnfocus: 'Cấp 5',
    value: 5,
  },
  {
    id: '6',
    label: 'CTV Cấp 6',
    labelUnfocus: 'Cấp 6',
    value: 6,
  },
  {
    id: '7',
    label: 'CTV > Cấp 6',
    labelUnfocus: '> Cấp 6',
    value: 7,
  },
];

export const STATUS_RSM = {
  // ALL: 'ALL',
  ONLINE: 'ONLINE',
  GMV_EXIST: 'GVM_EXIST',
  PL_GVM_EXIST: 'PL_GVM_EXIST',
  INS_GVM_EXIST: 'INS_GVM_EXIST',
  DAA_GVM_EXIST: 'DAA_GVM_EXIST',
  // CAN_LEFT: 'CAN_LEFT',
};
export const LIST_STATUS_RSM = [
  // {
  //   id: 'all',
  //   label: 'Tất cả',
  //   value: STATUS_RSM.ALL,
  // },
  {
    id: '1',
    label: 'Đang hoạt động',
    value: STATUS_RSM.ONLINE,
  },
  {
    id: '2',
    label: 'Có phát sinh doanh số',
    value: STATUS_RSM.GMV_EXIST,
  },
  {
    id: '3',
    label: 'Có doanh số Tài chính',
    value: STATUS_RSM.PL_GVM_EXIST,
  },
  {
    id: '4',
    label: 'Có doanh số Bảo hiểm',
    value: STATUS_RSM.INS_GVM_EXIST,
  },
  {
    id: '5',
    label: 'Có doanh số Mở tài khoản',
    value: STATUS_RSM.DAA_GVM_EXIST,
  },
  // {
  //   id: '5',
  //   label: 'Có thể rời đi',
  //   value: STATUS_RSM.CAN_LEFT,
  // },
];

export const TOP_GVM = [
  {
    id: '10',
    label: 'TOP 10',
    value: 10,
  },
  {
    id: '20',
    label: 'TOP 20',
    value: 20,
  },
  {
    id: '50',
    label: 'TOP 50',
    value: 50,
  },
  {
    id: '100',
    label: 'TOP 100',
    value: 100,
  },
];
