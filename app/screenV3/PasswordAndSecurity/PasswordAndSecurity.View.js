import React, { useCallback } from 'react';
import { Text, View, Image, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import RowItemView from './components/rowItemView';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';

import BottomActionSheet from '../../components2/BottomActionSheet';
import AddPassCodeView from './components/addPassCodeView';
import { useActions } from '../../hooks/useActions';
import { logout } from '../../redux/actions/user';
import Strings from '../../constants/strings';
import md5 from 'md5';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';
import { checkBiometric, touchIdAuthenticate } from '../../utils/biometrics';

import { icons } from '../../img';
import {
  setPassCode,
  toggleUsePasscode,
  checkUsingPasscode,
  deleteAccount,
} from '../../redux/actions/actionsV3/userConfigs';
import useOnPress from '../../hooks/useOnPress';
import { getUserUsePasscodeSelector } from '../../redux/selectors/userConfigsSelectors';
import { logEvent } from '../../tracking/Firebase';
import { getDeviceTrackingInfo } from '../../utils/Utils';
import { MY_USER } from '../../redux/actions/types';
import { useDispatch } from 'react-redux';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';
import ModalDeleteAccount from '../../componentV3/ModalDeleteAccount/ModalDeleteAccount';
import { ICON_PATH } from '../../assets/path';
import Loading from '../../componentV3/LoadingModal';

const PasswordAndSecurity = ({ params, navigation }) => {
  const myUser = useSelectorShallow(getMyuserSelector);

  const dispatch = useDispatch();

  const [isOnFaceId, setIsOnFaceId] = useState(myUser?.useQuickLogin);
  const [haveFaceID, setHaveFaceID] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hideQuickLogin, setHideQuickLogin] = useState(false);

  // const []

  const usePasscode = useSelectorShallow(getUserUsePasscodeSelector);

  const actionSheetRef = React.useRef(null);
  const actions = useActions({
    logout,
    setPassCode,
    toggleUsePasscode,
    checkUsingPasscode,
  });

  const checkFaceID = async () => {
    try {
      // let _haveFaceID = await isSupportedFaceId();
      const checkBio = await checkBiometric();

      if (!checkBio) {
        setHideQuickLogin(true);
      } else {
        if (checkBio === 'FaceID') {
          setHideQuickLogin(false);
          setHaveFaceID(true);
        } else {
          setHideQuickLogin(false);
        }
      }
    } catch (error) {}
  };

  const _checkUsePasscode = () => {
    actions.checkUsingPasscode(myUser?.mPhoneNumber);
  };

  useEffect(() => {
    checkFaceID();
    setTimeout(() => {
      _checkUsePasscode();
    }, 1);
  }, []);

  const onFinish = async (passCode) => {
    actionSheetRef?.current?.close();
    actions.setPassCode(
      myUser.mPhoneNumber,
      md5(passCode),
      passCode,
      async (payload) => {
        actions.toggleUsePasscode(1);

        const _user = {
          ...payload,
          usePasscode: true,
          useQuickLogin: isOnFaceId,
        };
        logEvent('CompleteSetPasscode', { ...getDeviceTrackingInfo(), user_id: myUser?.uid });
        await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_user));
      },
      (message) => {
        Alert.alert(
          'Lỗi',
          message,
          [
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      },
    );
  };

  const toggleBiometric = (value) => {
    return touchIdAuthenticate()
      .then(async (success) => {
        const _user = {
          ...myUser,
          usePasscode: usePasscode,
          useQuickLogin: value,
        };

        logEvent('CompleteSetTouch/FaceID', { ...getDeviceTrackingInfo(), user_id: myUser?.uid });

        await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_user));

        dispatch({ type: MY_USER, myUser: _user });

        setIsOnFaceId(value);
      })
      .catch(async (error) => {
        setIsOnFaceId(!value);
      });
  };

  // useEffect(() => {
  //   if (!isOn) {
  //     const _myUser = {
  //       ...myUser,
  //       usePassCode: false,
  //       passCode: null,
  //     };
  //     AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_myUser));
  //   }
  // }, [isOn]);

  const turnOnPasscode = async (value) => {
    if (!myUser.passcode || !myUser?.passcode?.length) {
      actionSheetRef.current.open();
    } else {
      const _user = {
        ...myUser,
        usePasscode: true,
        useQuickLogin: isOnFaceId,
      };

      actions.toggleUsePasscode(1);

      await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_user));
    }
  };

  const turnOffPasscode = async (value) => {
    const _user = {
      ...myUser,
      usePasscode: false,
      useQuickLogin: false,
    };

    actions.toggleUsePasscode(0);

    await AsyncStorage.setItem(AsyncStorageKeys.LAST_USER_INFO, JSON.stringify(_user));
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral5, paddingTop: 20 }}>
      <RowItemView
        icon={icons.iconClock}
        iconStyle={{
          width: SW(20),
          height: SW(20),
        }}
        title={'Lịch sử đăng nhập'}
        description={'Danh sách lịch sử các phiên đăng nhập'}
        onPress={() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useOnPress({ action: `${DEEP_LINK_BASE_URL}://open?view=LoginActivities` });
        }}
        containerStyle={{ marginBottom: SH(16) }}
      />
      <RowItemView
        icon={icons.lock}
        title={'Đăng nhập bằng mật khẩu'}
        description={'Cho phép sử dụng mật khẩu để đăng nhập'}
        // onPress={() => {}}
        haveSwitch
        isOn={usePasscode}
        childComponent={
          <RowItemView
            title={usePasscode ? 'Đổi mật khẩu' : 'Đặt mật khẩu'}
            onPress={() => {
              actionSheetRef.current.open();
            }}
          />
        }
        onChangeValueSwitch={(value) => {
          if (value) {
            turnOnPasscode(value);
          } else {
            turnOffPasscode(value);
          }
        }}
      />
      {!hideQuickLogin ? (
        <RowItemView
          isDisable={!usePasscode}
          icon={haveFaceID ? icons.faceID : icons.touchID}
          title={'Đăng nhập bằng sinh trắc học'}
          description={
            !usePasscode
              ? 'Vui lòng đặt và kích hoạt mật khẩu MFast trước khi sử dụng chức năng này'
              : `Cho phép sử dụng ${haveFaceID ? `FaceID` : `Touch ID`} hoặc vân tay để đăng nhập `
          }
          onPress={() => {
            toggleBiometric(!isOnFaceId);
          }}
          haveSwitch
          isOn={isOnFaceId}
          containerStyle={{ marginTop: SH(16) }}
          onChangeValueSwitch={(value) => toggleBiometric(value)}
        />
      ) : null}
      <BottomActionSheet
        ref={(ref) => {
          actionSheetRef.current = ref;
        }}
        render={() => (
          <AddPassCodeView
            onFinish={(passCode) => {
              onFinish(passCode);
            }}
            onCloseModal={() => actionSheetRef.current.close()}
          />
        )}
        canClose={true}
      />
      <Loading visible={isLoading} />
    </View>
  );
};

export default PasswordAndSecurity;
