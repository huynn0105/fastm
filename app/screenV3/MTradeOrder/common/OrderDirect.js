import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import ButtonOrderStatus from '../components/ButtonOrderStatus';
import ItemContact from '../components/ItemContact';
import { BOTTOM_BAR_HEIGHT } from '../../../screens2/Root/Tabbar';
import { SH } from '../../../constants/styles';
import { useSelector } from 'react-redux';
import { isDeepLink } from '../../../utils/Utils';
import NavigationServices from '../../../utils/NavigationService';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

export const ORDER_STATUS = {
  WAITING: 'waiting',
  DELIVERY: 'delivery',
  SUCCESS: 'success',
  CANCEL: 'failed',
};

const HScrollView = HPageViewHoc(ScrollView);

const OrderDirect = memo(
  forwardRef((props, ref) => {
    const { index, navigation } = props;

    const mtradeListOrderStatus = useSelector(
      (state) => state?.mtradeReducer?.mtradeBonus?.list_process,
    );

    const mtradeIndirectBonus = useSelector((state) => state?.mtradeReducer?.mtradeBonus?.support);

    const [month, setMonth] = useState(null);

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
        });
      },
      [month, navigation],
    );

    const renderOrderStatus = useCallback(
      (item) => {
        return <ButtonOrderStatus item={item} key={item?.id} onPress={onPressOrderStatus} />;
      },
      [onPressOrderStatus],
    );

    const onPressContact = useCallback((item) => {
      if (item?.action) {
        if (isDeepLink(item?.action)) {
          Linking.openURL(item?.action);
        } else {
          NavigationServices.navigate('WebView', {
            url: item?.action,
            mode: 0,
            title: item?.label,
          });
        }
      }
    }, []);

    const renderContact = useCallback(
      (item, _index) => {
        return <ItemContact item={item} index={_index} key={_index} onPress={onPressContact} />;
      },
      [onPressContact],
    );

    useImperativeHandle(ref, () => ({
      setMonth,
    }));

    return (
      <HScrollView
        index={index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <AppText semiBold style={[styles.title, { marginTop: 16 }]}>
          Đơn hàng của bạn
        </AppText>
        <View
          style={[styles.boxContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}
        >
          {mtradeListOrderStatus?.map(renderOrderStatus)}
        </View>
        <AppText semiBold style={[styles.title, { marginTop: 24 }]}>
          Trung tâm hỗ trợ
        </AppText>
        <View style={[styles.boxContainer, { paddingHorizontal: 12, paddingVertical: 12 }]}>
          {mtradeIndirectBonus?.map(renderContact)}
        </View>
      </HScrollView>
    );
  }),
);

export default OrderDirect;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(6),
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
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
});
