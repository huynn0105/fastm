import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import UserRank from './UserRank';
import InfoView from './InfoView';
import Colors from '../../../theme/Color';
import HeaderCollaborator from './HeaderCollaborator';
import { getInfoCollaborator } from '../../../redux/actions/actionsV3/collaboratorAction';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { formatNumber, SCREEN_WIDTH } from '../../../utils/Utils';
import { DeviceEventEmitter } from 'react-native';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';
import AppText from '../../../componentV3/AppText';
import moment from 'moment';

const UserInfo = memo((props) => {
  const {
    myUser,
    userId,
    onGetInfo,
    navigation,
    onPressContent,
    initUser,
    isVerify,
    collaboratorLeave,
  } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState(initUser);
  const [isLoading, setIsLoading] = useState(false);

  const myRank = useMemo(() => {
    const titleSplit = data?.rank?.level?.title?.split(' ');
    let gender = '';
    switch (data?.user?.sex) {
      case 'female':
      case 'NỮ':
      case 'nữ':
        gender = 'female';
        break;
      default:
        gender = 'male';
        break;
    }

    let titleLevel = '';
    switch (data?.rank?.level?.level) {
      case 'head':
        titleLevel = 'Diamond';
        break;
      case 'FIX_RSM':
      case 'KPI_RSM':
      case 'VAR_RSM':
        titleLevel = 'Gold';
        break;
      case 'FIX_RSA':
      case 'KPI_RSA':
      case 'VAR_RSA':
        titleLevel = 'Silver';
        break;
      default:
        titleLevel = 'Stone';
        break;
    }

    const logo = IMAGE_PATH[`${gender}${titleLevel}`];
    const maxIndex = titleSplit?.length - 1;
    const star = !isNaN(titleSplit?.[maxIndex]) ? titleSplit?.[maxIndex] : 0;
    const level = star ? titleSplit?.splice(0, maxIndex)?.join(' ') : data?.rank?.level?.title;

    return {
      logo,
      star,
      level,
    };
  }, [data]);

  const onGetData = useCallback(
    (isHideLoading) => {
      setIsLoading(true);

      const id = userId || myUser?.uid;

      dispatch(
        getInfoCollaborator(id, id !== myUser?.uid, myUser?.uid, (isSuccess, result) => {
          setIsLoading(false);
          if (isSuccess) {
            setData(result);
            onGetInfo?.(result);
          }
        }),
      );
    },
    [dispatch, myUser?.uid, onGetInfo, userId],
  );

  const getDayString = () => {
    const countdown = moment(data?.requestDeleteDate).diff(moment(), 'second');

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

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    if (!userId) {
      setIsLoading(!Object?.keys(initUser)?.length);
      setData(initUser);
    }
  }, [initUser, userId]);

  useEffect(() => {
    DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);

    return () => {
      DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
    };
  }, [onGetData]);

  return (
    <>
      <HeaderCollaborator
        userId={userId}
        fullName={data?.user?.fullName || myUser?.fullName}
        avatar={hardFixUrlAvatar(data?.user?.avatarImage)}
        navigation={navigation}
        myUser={myUser}
        isVerify={isVerify}
        collaboratorLeave={collaboratorLeave}
      />

      <View>
        <UserRank
          {...myRank}
          userInfo={userId && data}
          isLoading={isLoading}
          navigation={navigation}
          userId={userId}
        />
        {userId && data?.requestDelete ? (
          <View style={{ alignItems: 'center', marginHorizontal: 16 }}>
            <View
              style={{
                marginTop: 20,
                backgroundColor: Colors.lightRed,
                borderColor: Colors.sixRed,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                width: '100%',
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={ICON_PATH.hourglass} style={{ width: 32, height: 32 }} />
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
                    Tài khoản của người này sẽ được hủy sau:
                  </AppText>
                  <AppText medium style={{ fontSize: 16, lineHeight: 24, color: Colors.sixRed }}>
                    {getDayString()}
                  </AppText>
                  <AppText
                    style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1, marginTop: 4 }}
                  >
                    Lý do:{`  ${data?.requestReason}`}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        ) : null}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.infoContainer}>
            <InfoView
              onPress={onPressContent}
              keyContent={'ExperienceContent'}
              title={'Kinh nghiệm'}
              content={`${formatNumber(Math.round(data?.point) || 0)} điểm`}
              style={{ marginRight: 8 }}
              backgroundColor={Colors.purple2}
              hideArrow={!isVerify}
            />
            <InfoView
              onPress={onPressContent}
              keyContent={'IncomeContent'}
              title={'Tổng thu nhập'}
              content={`${formatNumber(data?.commission || 0)} đ`}
              backgroundColor={Colors.green4}
              hideArrow={!isVerify}
            />
          </View>
          <InfoView
            onPress={onPressContent}
            keyContent={'CollaboratorContent'}
            title={'Cộng tác viên trong 6 tầng'}
            content={`${formatNumber(data?.collaborator || 0)} người`}
            direction={'row'}
            style={{ marginTop: 8 }}
            hideArrow={!isVerify}
          />
        </View>
      </View>
    </>
  );
});

export default UserInfo;

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
    top: -4,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
});
