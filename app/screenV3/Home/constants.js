import { Alert } from 'react-native';
import { SH, SW } from '../../constants/styles';

export const SLIDE_USER_GUILD = [
  {
    id: 'SLIDE_USER_GUILD_vayvon',
    title: 'Đây là nơi để bạn giới thiệu khách hàng có nhu cầu vay vốn',
    childComponent: null,
    yPos: 0,
  },
  {
    id: 'SLIDE_USER_GUILD_nganhang',
    title: 'Hoặc giới thiệu khách hàng mở ví điện tử, tài khoản ngân hàng trực tuyến tại đây',
    childComponent: null,
    yPos: 0,
  },
  {
    id: 'SLIDE_USER_GUILD_baohiem',
    title: 'Và ở đây, bạn có thể bán các sản phẩm bảo hiểm phi nhân thọ',
    childComponent: null,
    yPos: 0,
  },
];

export const SEARCH_HEIGHT = SH(36);
export const USER_INFO_HEIGHT = SH(70);
export const MONEY_INFO_HEIGHT = SW(328) * (181 / 328) + SH(20);
export const PADDING_SPACE = SH(12);
export const MAIN_CATEGORY_HEIGHT = SH(100) + PADDING_SPACE;
