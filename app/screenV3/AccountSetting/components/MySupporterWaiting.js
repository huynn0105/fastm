import {
  DeviceEventEmitter,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import SectionHeader from './SectionHeader';
import CharAvatar from '../../../componentV3/CharAvatar';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { getTimeBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import DigitelClient from '../../../network/DigitelClient';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { useSelector } from 'react-redux';

const MySupporterWaiting = memo((props) => {
  const { navigation, onShowSupporter } = props;

  const [data, setData] = useState({});

  const filterRating = useSelector((state) => state?.collaboratorReducer?.filterRating);

  const isHaveSupporter = useMemo(
    () => filterRating?.infoUserSp?.detail?.toUserID,
    [filterRating?.infoUserSp?.detail?.toUserID],
  );

  const onGetData = useCallback(async () => {
    try {
      const res = await DigitelClient.getSupporterWaiting();

      if (res?.data?.status) {
        onShowSupporter(!res?.data?.data?.toUserID);
        setData(res?.data?.data);
      }
    } catch (err) {
      console.log(
        '\u001B[33m ai log ne \u001B[36m -> file: MySupporterWaiting.js -> line 25 -> err',
        err,
      );
    }
  }, []);

  const onPress = useCallback(() => {
    navigation?.navigate('RegisterReferral', {
      itemRequest: data,
    });
  }, [data, navigation]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('GET_SUPPORTER_WAITING', onGetData);
    onGetData();
    return () => {
      listener.remove();
    };
  }, [onGetData]);

  if (!data?.toUserID || isHaveSupporter) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <SectionHeader title={'Người dẫn dắt'} />
        <View style={styles.bodyContainer}>
          <CharAvatar
            style={styles.avatar}
            defaultName={data?.fullName}
            source={hardFixUrlAvatar(data?.avatarImage)}
            // textStyle={{ fontSize: 22 }}
          />
          <View style={{ marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText medium style={{ fontSize: 16, lineHeight: 24, color: Colors.gray1 }}>
                {data?.fullName}
              </AppText>
              <Image
                source={ICON_PATH.arrow_right}
                style={{ width: 15, height: 15, tintColor: Colors.gray1, marginLeft: 2 }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.sixOrange }}>
                Chờ chấp nhận
              </AppText>
              <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray5 }}>
                {' '}
                - {getTimeBetween(moment(data?.time))}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default MySupporterWaiting;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    marginTop: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
});
