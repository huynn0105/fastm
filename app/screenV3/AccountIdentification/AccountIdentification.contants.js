import Colors from '.././../theme/Color';

export const LABEL_STEP_ACCOUNT_IDENTIFY = [
  'Xác thực danh tính',
  'Thông tin cá nhân',
  'Ngân hàng liên kết',
  'Hợp đồng dịch vụ',
];

export const KEY_PAGE = {
  identityCard: 'IdentityCard',
  personalInformation: 'PersonalInformation',
  bankingAccount: 'BankingAccount',
  contractCollaborators: 'ContractCollaborators',
};

export const PAGE_ACCOUNT_IDENTIFY = [
  {
    key: KEY_PAGE.identityCard,
  },
  {
    key: KEY_PAGE.personalInformation,
  },
  {
    key: KEY_PAGE.bankingAccount,
  },
  {
    key: KEY_PAGE.contractCollaborators,
  },
];

export const INDICATOR_STYLES = {
  labelSize: 11,
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 2,
  separatorFinishedColor: 'rgb(0, 91, 243)',
  separatorUnFinishedColor: Colors.neutral4,
  stepIndicatorFinishedColor: 'rgb(0, 91, 243)',
  stepIndicatorUnFinishedColor: Colors.neutral4,
  stepIndicatorCurrentColor: 'rgb(0, 91, 243)',
  stepIndicatorLabelFontSize: 11,
  currentStepIndicatorLabelFontSize: 12,
  stepIndicatorLabelCurrentColor: '#fff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: Colors.primary3,
  labelColor: Colors.neutral3,
  currentStepLabelColor: Colors.primary4,
  stepStrokeCurrentColor: '#fff',
};

export const STEP_STATUS = {
  current: 'current',
  unfinished: 'unfinished',
  finished: 'finished',
};

export const LIST_GENDER = [
  {
    id: 'male',
    label: 'Nam',
  },
  {
    id: 'female',
    label: 'Nữ',
  },
];
