import { AppState, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelDeleteAccountV2,
  checkDeleteAccountV2,
} from '../../redux/actions/actionsV3/userConfigs';
import moment from 'moment';
import Colors from '../../theme/Color';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import AppText from '../AppText';
import styles from '../../screenV3/AccountPrivate/AccountPrivate.styles';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ViewStatus, { STATUS_ENUM } from '../../common/ViewStatus';
import { isEmpty } from 'lodash';
import ButtonText from '../../common/ButtonText';
import { getMyuserSelector } from '../../redux/selectors/userSelector';

let countdownTimer;

const DeleteAccountCountDown = memo((props) => {
  const { type, onPressDelete } = props;
  const isSettingPage = useMemo(() => type === 'SETTING_PAGE', [type]); //SETTING_PAGE, USER_PAGE

  const deleteAccount = useSelector((state) => state?.userConfigs?.deleteAccount);
  const dispatch = useDispatch();

  const bottomSheetRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountDown] = useState(0);

  const getDayString = () => {
    var days = Math.floor(countdown / 24 / 60 / 60);
    var hoursLeft = Math.floor(countdown - days * 86400);
    var hours = Math.floor(hoursLeft / 3600);
    var minutesLeft = Math.floor(hoursLeft - hours * 3600);
    var minutes = Math.floor(minutesLeft / 60);
    var remainingSeconds = countdown % 60;
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    return (
      pad(days) + ' ngày, ' + pad(hours) + ' giờ ' + pad(minutes) + ' phút' // + pad(remainingSeconds)
    );
  };

  const onCancelDeleteAccount = useCallback(() => {
    bottomSheetRef?.current?.open('Bỏ yêu cầu xóa tài khoản MFast');
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      checkDeleteAccountV2(() => {
        setIsLoading(false);
      }),
    );
    return () => {
      clearInterval(countdownTimer);
    };
  }, [dispatch]);

  const startCountDown = useCallback(() => {
    if (deleteAccount?.status && deleteAccount?.requestDelete && deleteAccount?.requestDeleteDate) {
      setCountDown(moment(deleteAccount?.requestDeleteDate).diff(moment(), 'second'));
      const oneMinute = 1 * 60;
      countdownTimer = setInterval(() => {
        setCountDown((prevState) => {
          const newState = prevState - 1 * oneMinute;
          if (newState === 0) {
            clearInterval(countdownTimer);
          }
          return newState;
        });
      }, 1000 * oneMinute);
    }
  }, [deleteAccount?.requestDelete, deleteAccount?.requestDeleteDate, deleteAccount?.status]);

  useEffect(() => {
    startCountDown();
    AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        startCountDown();
      } else {
        clearInterval(countdownTimer);
      }
    });
    return () => {
      clearInterval(countdownTimer);
    };
  }, [startCountDown]);

  return (
    <>
      {!deleteAccount?.requestDelete || countdown <= 0 ? (
        isSettingPage ? (
          <TouchableOpacity disabled={isLoading} style={{ width: '100%' }} onPress={onPressDelete}>
            <View style={styles.wrapperItem}>
              <Image source={ICON_PATH.trash3} style={styles.icLeft} />
              <View style={styles.content}>
                <AppText style={styles.label}>Hủy tài khoản</AppText>
                <AppText style={styles.desc}>
                  Tài khoản sẽ được hủy sau 30 ngày kể từ lúc yêu cầu. Sau thời gian này, thông tin
                  giao dịch, thông tin cá nhân, số dư MFast đều sẽ bị xóa và không thể khôi phục
                </AppText>
              </View>
              <View style={styles.icRightContainer}>
                <Image source={ICON_PATH.arrow_right} style={styles.icRight} />
              </View>
            </View>
          </TouchableOpacity>
        ) : null
      ) : (
        <View
          style={{
            marginTop: isSettingPage ? 0 : 20,
            marginHorizontal: 16,
            backgroundColor: isSettingPage ? Colors.primary5 : Colors.lightRed,
            borderColor: Colors.sixRed,
            borderWidth: isSettingPage ? 0 : 1,
            borderRadius: isSettingPage ? 0 : 8,
            padding: 12,
            paddingBottom: 0,
            width: '100%',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={ICON_PATH.hourglass}
              style={{ width: isSettingPage ? 24 : 32, height: isSettingPage ? 24 : 32 }}
            />
            <View style={{ marginLeft: 8 }}>
              <AppText
                medium={isSettingPage}
                style={{ fontSize: isSettingPage ? 16 : 14, lineHeight: 20, color: Colors.gray1 }}
              >
                Tài khoản của bạn sẽ được hủy sau:
              </AppText>
              <AppText medium style={{ fontSize: 16, lineHeight: 24, color: Colors.sixRed }}>
                {getDayString()}
              </AppText>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: isSettingPage ? Colors.neutral5 : Colors.primary5,
              marginTop: 8,
            }}
          />
          <TouchableOpacity
            onPress={onCancelDeleteAccount}
            style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}
          >
            <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.primary2 }}>
              Bỏ yêu cầu xóa tài khoản MFast
            </AppText>
            <Image
              source={ICON_PATH.arrow_right}
              style={{ width: 16, height: 16, tintColor: Colors.primary2 }}
            />
          </TouchableOpacity>
        </View>
      )}
      <BottomActionSheet
        haveCloseButton
        ref={bottomSheetRef}
        render={() => {
          return (
            <CancelDeleteAccount
              onFinish={() => {
                bottomSheetRef?.current?.close();
              }}
            />
          );
        }}
      />
    </>
  );
});

export default DeleteAccountCountDown;

const CancelDeleteAccount = memo((props) => {
  const { onFinish } = props;

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    status: false,
  });

  const myUser = useSelector(getMyuserSelector);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      cancelDeleteAccountV2((_result) => {
        setIsLoading(false);
        setData(_result);
      }),
    );
  }, [dispatch]);

  return (
    <View style={{ backgroundColor: Colors.neutral5, padding: 16 }}>
      {isLoading ? (
        <ViewStatus status={STATUS_ENUM.LOADING} content={'Đang bỏ yêu cầu xoá tài khoản'} />
      ) : isEmpty(data) ? null : (
        <>
          <View
            style={{
              backgroundColor: Colors.primary5,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              marginTop: 56,
            }}
          >
            <Image
              source={data?.status ? IMAGE_PATH.mascotSuccess : IMAGE_PATH.mascotError}
              style={{ position: 'absolute', width: 140, height: 140, top: -56 }}
            />
            <AppText
              semiBold
              style={{
                marginTop: 80,
                fontSize: 18,
                lineHeight: 26,
                color: data?.status ? Colors.green6 : Colors.sixRed,
              }}
            >
              {data?.status
                ? `Mừng bạn trở lại - ${myUser?.fullName}!!!`
                : `Bỏ yêu cầu xoá tài khoản bị lỗi!`}
            </AppText>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.gray4,
                width: '100%',
                borderStyle: 'dashed',
                marginVertical: 12,
              }}
            />
            <AppText medium style={{ fontSize: 16, lineHeight: 24, color: Colors.gray1 }}>
              {data?.message ||
                'Xác nhận bỏ yêu cầu xóa tài khoản, tiếp tục đồng hành và tạo ra thật nhiều thu nhập cùng MFast'}
            </AppText>
          </View>
          <ButtonText
            onPress={onFinish}
            medium
            title={'Xác nhận'}
            fontSize={16}
            lineHeight={24}
            top={24}
            height={48}
            bottom={100}
          />
        </>
      )}
    </View>
  );
});
