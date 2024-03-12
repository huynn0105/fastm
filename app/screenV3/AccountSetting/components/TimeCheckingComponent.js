import { Image, StyleSheet, View, TouchableOpacity, AppState } from 'react-native';
import React, { memo, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { useSelector } from 'react-redux';

import ButtonText from '../../../common/ButtonText';
import { getTimeChecking } from '../../../redux/actions/actionsV3/userConfigs';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import { PERMISSION_CHECK, checkAndRequestPermission } from '../../../utils/permissionV3';
import FlutterService from '../../Home/FlutterService';
import { getCountDownString, getRemainSeconds, isValidBetween } from '../../../utils/DateTimeUtil';

const TimeCheckingComponent = memo((props) => {
  /// Init
  const dispatch = useDispatch();

  const data = useSelector((state) => state?.userConfigs?.timeChecking);
  const appLifeCycleState = useRef('');

  const [countdown, setCountDown] = useState(0);

  const checkConfig = data?.checkConfig;
  const totalReport = data?.totalReport;
  const startTime = checkConfig?.startTime;
  const endTime = checkConfig?.endTime;
  const duration = checkConfig?.duration || 0;
  const type = checkConfig?.type;
  const isShowComponent = !isEmpty(data);
  const isShowTotalReport = (totalReport || 0) > 0;

  const startCountDownTimer = useCallback(() => {
    clearCountDownTimer();
    const deviceRemainSeconds = getRemainSeconds(endTime);
    const diff = deviceRemainSeconds < duration ? deviceRemainSeconds : duration;
    console.log('aaa-1', deviceRemainSeconds, duration);
    if (diff > 0) {
      setCountDown(diff);
      checkConfigCountDownTimer = setInterval(() => {
        setCountDown((preState) => {
          const newState = preState - 1;
          if (newState === 0 || newState < 0) {
            clearCountDownTimer();
            return 0;
          }
          return newState;
        });
      }, 1000);
    } else {
      setCountDown(0);
    }
  }, [clearCountDownTimer, data]);

  const clearCountDownTimer = useCallback(() => {
    clearInterval(checkConfigCountDownTimer);
    checkConfigCountDownTimer = null;
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && nextState !== appLifeCycleState.current) {
        if (!checkConfig && !revertTimeCheckingConfig) {
          revertTimeCheckingConfig = true;
          dispatch(getTimeChecking());
        }
        appLifeCycleState.current = nextState;
        startCountDownTimer();
      } else {
        appLifeCycleState.current = '';
        clearCountDownTimer();
      }
    });
    startCountDownTimer();
    return () => {
      clearCountDownTimer();
    };
  }, [startCountDownTimer, clearCountDownTimer]);

  /// Fetch Data
  useEffect(() => {
    revertTimeCheckingConfig = false;
    dispatch(getTimeChecking());
  }, [dispatch]);

  /// Callback
  const onChecking = useCallback(() => {
    requestTimeCheckingPermission(() => {
      FlutterService.openMFast({
        path: `${TimeCheckingRoute.checking}?time_checking_action=${type}&is_from_mfast=true`,
      });
    });
  }, [type]);
  const onHistory = useCallback(() => {
    FlutterService.openMFast({
      path: `${TimeCheckingRoute.history}`,
    });
  }, []);

  /// View
  if (!isShowComponent) {
    return null;
  }
  return (
    <View>
      {/* Title */}
      <View style={styles.row}>
        <AppText style={styles.titleTextStyle} medium>
          Báo cáo, điểm danh hôm nay
        </AppText>
      </View>
      {/* Content */}
      <View style={styles.container}>
        {!(countdown > 0) ? null : (
          <View style={{ ...styles.column, flex: 1, alignItems: 'flex-start' }}>
            {/* Check in */}
            <View style={styles.row}>
              <View
                style={{
                  ...styles.column,
                  flex: 1,
                  alignItems: 'flex-start',
                }}
              >
                <AppText style={styles.subtitleTextStyle} regular>
                  {checkConfig?.title}
                </AppText>
                <AppText style={styles.time} semiBold>
                  {checkConfig?.desc}
                </AppText>
              </View>
              <ButtonText
                onPress={onChecking}
                disabled={false}
                title={'Điểm danh'}
                height={40}
                fontSize={14}
                lineHeight={20}
                semiBold
              />
            </View>

            {/* CountDown */}
            <View style={{ height: 4 }}></View>
            <View
              style={{
                ...styles.row,
                flex: 1,
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={ICON_PATH.hourlass}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              <View style={{ width: 2 }}></View>
              <AppText
                style={{ ...styles.subtitleTextStyle, fontSize: 13, color: Colors.accentOrange }}
                semiBold
              >
                Hết hạn sau {getCountDownString(countdown)}
              </AppText>
            </View>
          </View>
        )}

        {!(countdown > 0) ? null : <View style={styles.horizontalDivider}></View>}

        {/* Daily Report */}
        <TouchableOpacity style={styles.touch} activeOpacity={0.2} onPress={onHistory}>
          <View style={{ ...styles.row, height: 30 }}>
            <View
              style={{
                ...styles.row,
                flex: 1,
                justifyContent: 'flex-start',
              }}
            >
              <Image
                source={ICON_PATH.targetMoneyOutline}
                style={{ width: 24, height: 24, resizeMode: 'contain' }}
              />
              <View style={{ width: 12 }}></View>
              <AppText style={{ ...styles.subtitleTextStyle, color: Colors.primary2 }} semiBold>
                Báo cáo hằng ngày
              </AppText>
              <View style={{ width: 12 }}></View>
            </View>
            {!isShowTotalReport ? null : (
              <AppText style={{ ...styles.subtitleTextStyle, color: Colors.primary2 }} semiBold>
                {totalReport}
              </AppText>
            )}
            <View style={{ width: 4 }}></View>
            <Image
              source={ICON_PATH.arrow_right}
              style={{ width: 16, height: 16, resizeMode: 'contain', tintColor: Colors.primary2 }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.gap}></View>
    </View>
  );
});

export default TimeCheckingComponent;

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticleDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
    backgroundColor: Colors.neutral5,
  },
  horizontalDivider: {
    width: '100%',
    height: 1,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.neutral5,
  },
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  requiredContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.accentOrangeLight,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  gap: {
    width: 20,
    height: 20,
  },
  titleTextStyle: { fontSize: 14, lineHeight: 20, color: Colors.primary, flex: 1 },
  subtitleTextStyle: { fontSize: 14, lineHeight: 20, color: Colors.gray5, marginRight: 4 },
  touch: { flex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f000' },
  time: { fontSize: 16, lineHeight: 30, color: Colors.primary, flex: 1 },
});

const TimeCheckingRoute = {
  checking: '/take_picture',
  history: '/time_checking_history',
};

let checkConfigCountDownTimer;
let revertTimeCheckingConfig = false;

async function requestTimeCheckingPermission(callback) {
  const cameraGranted = await requestCameraPermission();

  if (!cameraGranted) {
    return;
  }

  const locationGranted = await requestLocationPermission();

  if (!locationGranted) {
    return;
  }

  return callback();
}

async function requestCameraPermission() {
  const result = await checkAndRequestPermission(
    PERMISSION_CHECK.CAMERA,
    'Vui lòng cấp quyền máy ảnh để sử dụng tiếp tục chấm công',
  );
  return result;
}

async function requestLocationPermission() {
  const result = await checkAndRequestPermission(
    PERMISSION_CHECK.LOCATION,
    'Vui lòng cấp quyền vị trí để sử dụng tiếp tục chấm công',
  );
  return result;
}
