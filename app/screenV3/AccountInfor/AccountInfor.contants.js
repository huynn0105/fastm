export const KEY_ACTION = {
  basic: 'BASIC',
  advanced: 'ADVANCED',
};

export const SECTION_DATA = [
  {
    label: 'Thông tin cơ bản',
    id: KEY_ACTION.basic,
    data: [
      [
        {
          label: 'Giới tính',
          keyObj: 'gender',
        },
        {
          label: 'Email',
          keyObj: 'email',
        },
        {
          label: 'Huyện/tỉnh',
          keyObj: 'district',
        },
        {
          label: 'Địa chỉ liên hệ',
          keyObj: 'address',
        },
      ],
    ],
  },
  {
    label: 'Thông tin định danh',
    id: KEY_ACTION.advanced,
    data: [
      [
        {
          label: 'Họ tên',
          keyObj: 'countryIdName',
        },
        {
          label: 'Số điện thoại',
          keyObj: 'mobilePhone',
        },
        // {
        //     label: 'Ngày sinh',
        //     keyObj: 'countryIdDateOfBirth'
        // },
        {
          label: 'Số CMND/ CCCD',
          keyObj: 'countryIdNumber',
        },
        {
          label: 'Số CMND cũ',
          keyObj: 'countryOldIdNumber',
        },
        {
          label: 'Ngày cấp',
          keyObj: 'countryIdIssuedDate',
        },
        {
          label: 'Nơi cấp',
          keyObj: 'countryIdIssuedBy',
        },
        // {
        //     label: 'Địa chỉ thường trú',
        //     keyObj: 'countryIdAddress'
        // },
      ],
    ],
  },
];
