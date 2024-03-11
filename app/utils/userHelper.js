import { ICON_PATH } from '../assets/path';
import createStoreFunc from '../redux/store/store';

export const getDefaultAvatar = (gender) => {
  if (!gender) {
    gender = createStoreFunc.getState().myUser.gender;
  }

  return gender === 'female' || gender === 'NỮ' || gender === 'nữ'
    ? ICON_PATH.avatarDefaultFemale
    : ICON_PATH.avatarDefaultMale;
};
