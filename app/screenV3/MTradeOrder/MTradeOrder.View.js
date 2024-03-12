import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { defaultNavOptions } from '../../screens2/Root/MainScreen';
import { ICON_PATH } from '../../assets/path';
import KJButton from '../../components/common/KJButton';
import Colors from '../../theme/Color';
import moment from 'moment';
import MonthSelectView from './components/MonthSelectView';
import InfoCommission from './components/InfoCommission';
import { CollapsibleHeaderTabView } from '../../componentV3/TabViewCollapsibleHeader';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { SceneMap } from 'react-native-tab-view';
import OrderDirect from './common/OrderDirect';
import OrderIndirect from './common/OrderIndirect';
import CustomTabBar from '../Collaborator/components/CustomTabBar';
import { useDispatch, useSelector } from 'react-redux';
import { getMTradeBonus } from '../../redux/actions/actionsV3/mtradeAction';

const TAB_BAR_HEIGHT = 48;

const MTradeOrder = memo((props) => {
  const { navigation } = props;
  const orderDirectRef = useRef();
  const orderIndirectRef = useRef();
  const timeout = useRef(null);

  const dispatch = useDispatch();

  const mtradeDirectBonus = useSelector(
    (state) => state?.mtradeReducer?.mtradeBonus?.direct_bonus_sum,
  );
  const mtradeIndirectBonus = useSelector(
    (state) => state?.mtradeReducer?.mtradeBonus?.indirect_bonus_sum,
  );

  const [month, setMonth] = useState(moment());
  const [isLoading, setIsLoading] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Trực tiếp' },
    { key: 'second', title: 'Gián tiếp' },
  ]);

  const onGetData = useCallback(
    (_month) => {
      if (!_month) {
        setIsLoading(false);
        return;
      }
      requestAnimationFrame(() => {
        orderDirectRef?.current?.setMonth(_month);
        orderIndirectRef?.current?.setMonth(_month);
      });
      const payload = {
        month: moment(_month).format('MM'),
        year: moment(_month).format('YYYY'),
      };

      dispatch(
        getMTradeBonus(payload, () => {
          setIsLoading(false);
        }),
      );
    },
    [dispatch],
  );

  const onMonthChange = useCallback(
    (_month) => {
      setMonth(_month);
      setIsLoading(true);
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

  const renderHeader = useCallback(() => {
    return (
      <View
        style={styles.headerContainer}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <MonthSelectView month={month} setMonth={onMonthChange} />
        <InfoCommission
          isLoading={isLoading}
          direct={mtradeDirectBonus}
          indirect={mtradeIndirectBonus}
        />
      </View>
    );
  }, [isLoading, month, mtradeDirectBonus, mtradeIndirectBonus, onMonthChange]);

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => <OrderDirect ref={orderDirectRef} index={0} navigation={navigation} />,
        second: () => <OrderIndirect ref={orderIndirectRef} index={1} navigation={navigation} />,
      }),
    [],
  );

  const renderTabBar = useCallback(
    (tabBarProps) => {
      return (
        <CustomTabBar
          {...tabBarProps}
          index={index}
          containerStyle={{
            marginVertical: 0,
            paddingVertical: 4,
            backgroundColor: Colors.neutral5,
            height: TAB_BAR_HEIGHT,
          }}
        />
      );
    },
    [index],
  );

  const makeHeaderHeight = useCallback(() => headerHeight + 1, [headerHeight]);

  useEffect(() => {
    setMonth((prevState) => {
      onGetData(prevState);
      return prevState;
    });
    const sub = navigation.addListener('willFocus', () => {
      setMonth((prevState) => {
        onGetData(prevState);
        return prevState;
      });
    });

    return () => {
      sub?.remove();
    };
  }, [navigation, onGetData]);

  return (
    <View style={styles.container}>
      <CollapsibleHeaderTabView
        makeHeaderHeight={makeHeaderHeight}
        renderScrollHeader={renderHeader}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        tabbarHeight={TAB_BAR_HEIGHT}
        renderTabBar={renderTabBar}
      />
    </View>
  );
});

export default MTradeOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  headerContainer: {
    paddingVertical: 12,
  },
});

MTradeOrder.navigationOptions = ({ navigation }) => {
  const title = navigation?.state?.params?.title || 'MTrade';
  const options = {
    ...defaultNavOptions,
    title,
    headerLeft: (headerLeftProps) => {
      return (
        <KJButton
          testID="header-back"
          leftIconSource={ICON_PATH.back}
          leftIconStyle={{
            width: 22,
            height: 22,
            resizeMode: 'contain',
          }}
          containerStyle={{
            paddingHorizontal: 16,
            height: '100%',
          }}
          onPress={() => navigation.pop()}
        />
      );
    },
  };

  return options;
};
