import { STATUS } from '../../../components2/ListProductItem/ProductItem';
import Colors from '../../../theme/Color';

export const PRODUCT_KEY = {
  digitalWallet: 'digital_wallet',
  insurance: 'insurance',
  financial: 'financial',
  mobileCard: 'mobile_card',
  topUp: 'topup',
  solar: 'solar',
  statistic: 'statistic',
  makeMoney: 'makeMoney',
  mobileCardAndTopup: 'mobileCardAndTopup',
};

export const PRODUCT_ITEM_DATA = {
  [PRODUCT_KEY.digitalWallet]: {
    key: PRODUCT_KEY.digitalWallet,
    label: 'Ví điện tử',
    labelStyle: { color: '#bd0072' },
    iconSource: require('./img/ic_wallet.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.insurance]: {
    key: PRODUCT_KEY.insurance,
    label: 'Bảo hiểm',
    labelStyle: { color: Colors.accent2 },
    iconSource: require('./img/ic_insurance.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.financial]: {
    key: PRODUCT_KEY.financial,
    label: 'Tài chính',
    labelStyle: { color: Colors.accent4 },
    iconSource: require('./img/ic_finance.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.mobileCard]: {
    key: PRODUCT_KEY.mobileCard,
    label: 'Mã thẻ ĐT',
    labelStyle: { color: '#0082e0' },
    iconSource: require('./img/ic_phone_card.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.topUp]: {
    key: PRODUCT_KEY.topUp,
    label: 'Nạp tiền ĐT',
    labelStyle: { color: Colors.accent1 },
    iconSource: require('./img/ic_top_up.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.solar]: {
    key: PRODUCT_KEY.solar,
    label: 'Solar',
    labelStyle: { color: '#bd0072' },
    iconSource: require('./img/ic_solar.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.makeMoney]: {
    key: PRODUCT_KEY.makeMoney,
    label: 'Kiếm tiền ngay',
    labelStyle: { color: '#0082e0' },
    iconSource: require('./img/ic_makemoney.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.mobileCardAndTopup]: {
    key: PRODUCT_KEY.mobileCardAndTopup,
    label: 'Nạp tiền ĐT',
    labelStyle: { color: Colors.accent1 },
    iconSource: require('./img/ic_top_up.png'),
    status: STATUS.none,
  },
  [PRODUCT_KEY.statistic]: {
    key: PRODUCT_KEY.statistic,
    label: 'Thống kê',
    labelStyle: { color: '#bd0072' },
    iconSource: require('./img/ic_statistic.png'),
    status: STATUS.none,
  },
};

export const TEXT_INPUT_ID = {
  fullName: 'full_name_text_input',
  phoneNumber: 'phone_number_text_input',
  citizenId: 'citizen_id_text_input',
  chooseCity: 'choose_city_text_input',
};

export const SAVE_SELECTED_PRODUCT_ITEM_KEY = 'SAVE_SELECTED_PRODUCT_ITEM_KEY';
export const SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM =
  'SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM';
