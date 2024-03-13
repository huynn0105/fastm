import { Image, Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import MonthSelectView from '../MTradeOrder/components/MonthSelectView';
import moment from 'moment';
import InfoCommission from '../MTradeOrder/components/InfoCommission';
import AppText from '../../componentV3/AppText';
import ButtonOrderStatus from '../MTradeOrder/components/ButtonOrderStatus';
import { ICON_PATH } from '../../assets/path';
import { debounce } from 'lodash';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';
import CharAvatar from '../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../redux/actions/user';
import { getDefaultAvatar } from '../../utils/userHelper';
import { formatNumber } from '../../utils/Utils';
import { useDispatch } from 'react-redux';
import { getMTradeBonusByCollaborator } from '../../redux/actions/actionsV3/mtradeAction';
import Loading from '../../componentV3/LoadingModal';
import { ORDER_STATUS } from '../MTradeOrder/common/OrderDirect';

const MTradeDetailCollaborator = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const timeout = useRef(null);

  const collaborator = useMemo(
    () => navigation?.state?.params?.collaborator,
    [navigation?.state?.params?.collaborator],
  );

  const [data, setData] = useState({ collaborator });
  const [month, setMonth] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);

  const openChat = useCallback(
    debounce(
      () => {
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${data?.collaborator?.ID}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [collaborator?.userID],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${data?.collaborator?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [collaborator?.mobilePhone],
  );

  const onPressOrderStatus = useCallback(
    (item) => {
      let title;
      switch (item?.processState) {
        case ORDER_STATUS.WAITING:
          title = 'Đơn hàng đang duyệt';
          break;
        case ORDER_STATUS.DELIVERY:
          title = 'Đơn hàng đang giao';
          break;
        case ORDER_STATUS.SUCCESS:
          title = 'Đơn hàng thành công';
          break;
        case ORDER_STATUS.CANCEL:
          title = 'Đơn hàng thất bại';
          break;
      }

      navigation.navigate('MTradeListOrder', {
        title,
        processState: item?.processState,
        month,
        collaboratorID: collaborator?.ID,
      });
    },
    [collaborator?.ID, month, navigation],
  );

  const renderOrderStatus = useCallback((item) => {
    return <ButtonOrderStatus item={item} key={item?.id} onPress={onPressOrderStatus} />;
  }, []);

  const onGetData = useCallback(
    (_month) => {
      setIsLoading(true);
      const payload = {
        month: moment(_month).format('MM'),
        year: moment(_month).format('YYYY'),
        collaboratorID: collaborator?.ID,
      };

      dispatch(
        getMTradeBonusByCollaborator(payload, (isSuccess, result) => {
          if (isSuccess) {
            setData(result);
          }
          setIsLoading(false);
        }),
      );
    },
    [collaborator?.ID, dispatch],
  );

  const onMonthChange = useCallback(
    (_month) => {
      setMonth(_month);
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      timeout.current = setTimeout(() => {
        onGetData(_month);
        timeout.current = null;
      }, 500);
    },
    [onGetData],
  );

  useEffect(() => {
    onGetData(month);
  }, []);

  return (
    <View style={styles.container}>
      <MonthSelectView month={month} setMonth={onMonthChange} />
      <View style={[styles.boxContainer, { marginTop: 40 }]}>
        <CharAvatar
          source={hardFixUrlAvatar(data?.collaborator?.avatarImage)}
          style={styles.imageAvatar}
          defaultImage={getDefaultAvatar()}
        />
        <View style={styles.contactContainer}>
          <TouchableWithoutFeedback onPress={openChat}>
            <Image source={ICON_PATH.message} style={styles.icon} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={openCall}>
            <Image source={ICON_PATH.calling} style={styles.icon} />
          </TouchableWithoutFeedback>
        </View>
        <AppText style={[styles.text, { marginTop: 32 }]}>
          Thu nhập gián tiếp từ{' '}
          <AppText style={[styles.text, { color: Colors.gray1 }]} semiBold>
            {data?.collaborator?.fullName}
          </AppText>
        </AppText>
        <View style={styles.contentContainer}>
          <Image source={ICON_PATH.commissionUser} style={styles.iconCommission} />
          <AppText style={styles.content} semiBold>
            {formatNumber(data?.bonus)} đ
          </AppText>
        </View>
      </View>
      <AppText semiBold style={[styles.title, { marginTop: 20 }]}>
        Đơn hàng của {data?.collaborator?.fullName}
      </AppText>
      <View
        style={[styles.boxContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}
      >
        {data?.list_process?.map(renderOrderStatus)}
      </View>
      <Loading visible={isLoading} />
    </View>
  );
});

export default MTradeDetailCollaborator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  boxContainer: {
    marginHorizontal: 0,
    backgroundColor: Colors.primary5,
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    textAlign: 'center',
  },
  contactContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  imageAvatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    position: 'absolute',
    top: -24,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.primary5,
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    alignSelf: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 6,
    color: Colors.blue3,
  },
  iconCommission: {
    width: 28,
    height: 28,
  },
});
