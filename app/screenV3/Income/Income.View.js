import {
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import PieChart from '../../componentV3/PieChart/PieChart';
import { DATA_PIE_EMPTY } from '../Collaborator/Collaborator.constants';
import StatisticsIncome from './components/StatisticsIncome';
import WithdrawMoney from './components/WithdrawMoney';
import Loading from '../../componentV3/LoadingModal';
import WithdrawMoneyHistory from './components/WithdrawMoneyHistory';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getStatisticMoney } from '../../redux/actions/actionsV3/banking';
import { formatCurrency, SCREEN_WIDTH } from '../../utils/Utils';
import { debounce } from 'lodash';
import { SceneMap } from 'react-native-tab-view';
import { CollapsibleHeaderTabView } from '../../componentV3/TabViewCollapsibleHeader';
import BottomActionSheet from '../../components2/BottomActionSheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ButtonText from '../../common/ButtonText';
import DigitelClient from '../../network/DigitelClient';

const HEADER_HEIGHT = 192;
const TAB_BAR_MARGIN = 20;
const TAB_BAR_HEIGHT = 40;

const LIST_DATA_SAMPLE = [
  {
    id: 'available_balance',
    color: '#005fff',
    background: '#005fff',
    name: 'Số dư khả dụng >>',
    key: 'all',
  },

  {
    id: 'tax_holding',
    color: '#dc41d7',
    background: '#dc41d7',
    name: 'Thuế TNCN tạm tính >>',
    key: 'tax_deduct',
  },
  {
    id: 'withdraw',
    color: '#ff499c',
    background: '#ff499c',
    name: 'Tiền đã rút >>',
    key: 'bank_withdrawal',
  },
  {
    id: 'payment',
    color: '#ff8469',
    background: '#ff8469',
    name: 'Mua sắm >>',
    key: 'payment',
  },
  {
    id: 'collection',
    color: '#ffc252',
    background: '#ffc252',
    name: 'Thu hồi >>',
    key: 'collection',
  },
];

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Income = memo((props) => {
  const { navigation } = props;

  const myEmail = useSelector((state) => state?.userMetaData?.data?.email);
  const disabledStatisticMoney = useSelector((state) => state?.appInfo?.disabledStatisticMoney);

  const initIndex = useMemo(
    () => Number(navigation?.state?.params?.params?.initIndex || 0),
    [navigation?.state?.params?.params?.initIndex],
  );

  const pieRef = useRef();
  const headerTabRef = useRef();
  const statisticsIncomeRef = useRef();
  const withdrawMoneyRef = useRef();
  const withdrawMoneyHistoryRef = useRef();
  const bottomActionSheetRef = useRef();

  const dispatch = useDispatch();

  const [index, setIndex] = useState(initIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(moment());
  const [data, setData] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);

  const [routes] = useState(
    disabledStatisticMoney
      ? [
          { key: 'second', title: 'Rút tiền' },
          { key: 'third', title: 'Lịch sử' },
        ]
      : [
          { key: 'first', title: 'Thống kê' },
          { key: 'second', title: 'Rút tiền' },
          { key: 'third', title: 'Lịch sử' },
        ],
  );

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => (
          <StatisticsIncome index={0} ref={statisticsIncomeRef} onPressItem={onPressItem} />
        ),
        second: () => (
          <WithdrawMoney
            index={1}
            ref={withdrawMoneyRef}
            navigation={navigation}
            showLoading={showLoading}
            hideLoading={hideLoading}
          />
        ),
        third: () => (
          <WithdrawMoneyHistory
            index={2}
            ref={withdrawMoneyHistoryRef}
            navigation={navigation}
            showLoading={showLoading}
            hideLoading={hideLoading}
          />
        ),
      }),
    [],
  );

  const pieData = useMemo(() => {
    return data?.filter((item) => item?.value && !isNaN(Number(item?.value)))?.length
      ? data?.filter((item) => item?.value && !isNaN(Number(item?.value)))
      : DATA_PIE_EMPTY;
  }, [data]);

  const headerHeight = useCallback(() => {
    return HEADER_HEIGHT;
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.moneyContainer}>
        <View style={styles.headerMoneyContainer}>
          <View style={styles.monthContainer}>
            <ButtonArrow
              isLeft
              onPress={() => {
                setMonth((prev) => {
                  const newMonth = moment(prev)?.subtract(1, 'month');
                  withdrawMoneyHistoryRef?.current?.setMonth(newMonth);
                  return newMonth;
                });
              }}
            />
            <AppText medium style={styles.month}>
              {moment(month).format('MM / YYYY')}
            </AppText>
            <ButtonArrow
              disabled={moment().isSame(moment(month), 'month')}
              onPress={() => {
                setMonth((prev) => {
                  const newMonth = moment(prev)?.add(1, 'month');
                  withdrawMoneyHistoryRef?.current?.setMonth(newMonth);
                  return newMonth;
                });
              }}
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => bottomActionSheetRef?.current?.open('Xuất sao kê')}
          >
            <View style={styles.rowCenter}>
              <AppText style={styles.text}>Xuất sao kê</AppText>
              <Image source={ICON_PATH.downloadFile} style={styles.icon} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.chartContainer}>
          <Image source={ICON_PATH.mfast_logo1} style={styles.logo} />
          <View style={styles.center}>
            <PieChart
              ref={pieRef}
              pieStyle={styles.chart}
              outerRadius={132 / 2}
              innerRadius={132 / 2 - 15}
              data={pieData}
              animate
              padAngle={0.02}
            />
            <View style={{ position: 'absolute' }}>
              <AppText
                semiBold
                style={{ fontSize: 24, lineHeight: 32, color: Colors.gray1, textAlign: 'center' }}
              >
                {formatCurrency(totalMoney)?.split(' ')[0] || 0}
                {formatCurrency(totalMoney)?.split(' ')[1]?.slice(0, 2) || 'tr'}
              </AppText>
              <AppText
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  color: Colors.gray5,
                }}
              >{`Tổng thu nhập`}</AppText>
            </View>
          </View>
          <Image source={ICON_PATH.mfast_logo1} style={styles.logo} />
        </View>
      </View>
    );
  }, [month, pieData, totalMoney]);

  const renderTabBar = useCallback((tabBarProps) => {
    return (
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBarContainer}>
          {tabBarProps?.navigationState?.routes?.map((tab, idx) => {
            const isActive = idx === tabBarProps?.navigationState?.index;
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!isActive) {
                    setIndex(idx);
                  }
                }}
              >
                <View style={[styles.tabBar, isActive && { backgroundColor: Colors.primary2 }]}>
                  <AppText
                    semiBold={isActive}
                    style={[styles.tabBarText, isActive && { color: Colors.primary5 }]}
                  >
                    {tab?.title}
                  </AppText>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  }, []);

  const renderExportStatement = useCallback(() => {
    return (
      <ExportStatement
        email={myEmail}
        onChangeEmail={() => {
          bottomActionSheetRef?.current?.close();
          navigation?.navigate('AccountBasicUpdateScreen');
        }}
        onPress={onExportStatement}
      />
    );
  }, [myEmail, navigation, onExportStatement]);

  const onExportStatement = useCallback(
    (id, from, to) => {
      bottomActionSheetRef?.current?.close();
      setTimeout(async () => {
        try {
          showLoading();
          const res = await DigitelClient.exportStatement(myEmail, id, from, to);
          console.log('aaa-29:', res);
          Alert.alert('Thông báo', res?.data?.message);
        } catch (error) {
          Alert.alert('Lỗi', error?.message);
          console.log('\u001B[36m -> file: Income.View.js:259 -> error', error);
        } finally {
          hideLoading();
        }
      }, 500);
    },

    [hideLoading, myEmail, showLoading],
  );

  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const onPressItem = useCallback((item) => {
    setIndex(2);
    withdrawMoneyHistoryRef?.current?.setIdFilterSelected(item?.key === 'all' ? '' : item?.key);
  }, []);

  const setDataChart = useCallback((formatData) => {
    setData(formatData);
    statisticsIncomeRef?.current?.setData(formatData);
  }, []);

  const onGetData = useCallback(() => {
    pieRef?.current?.startLoading?.();
    dispatch(
      getStatisticMoney(
        moment(month).format('MM'),
        moment(month).format('YYYY'),
        (isSuccess, result) => {
          const formatData = [];
          LIST_DATA_SAMPLE.forEach((item, idx) => {
            let name = item?.name;
            if (item?.id === 'tax_holding' && !moment().isSame(moment(month), 'month')) {
              name = 'Thuế TNCN đã thu';
            }
            if (item?.id === 'collection' && !result[item?.id]) {
              return;
            }
            formatData.push({
              ...item,
              value: result[item?.id],
              currentGrowth: result[`${item?.id}_percent`] || 0,
              title: `title-${idx}`,
              name,
            });
          });
          setTotalMoney(result?.total);
          statisticsIncomeRef?.current?.setIsEmpty(!result?.total);
          setDataChart(formatData);
          pieRef?.current?.stopLoading?.();
          pieRef?.current?.animate?.();
        },
      ),
    );
  }, [dispatch, month, setDataChart]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  return (
    <View style={styles.container}>
      <CollapsibleHeaderTabView
        ref={headerTabRef}
        makeHeaderHeight={headerHeight}
        renderScrollHeader={renderHeader}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        tabbarHeight={TAB_BAR_HEIGHT + TAB_BAR_MARGIN * 2}
        initialLayout={{ width: SCREEN_WIDTH }}
      />

      <Loading visible={isLoading} />
      <BottomActionSheet
        ref={bottomActionSheetRef}
        haveCloseButton
        render={renderExportStatement}
      />
    </View>
  );
});

export default Income;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  moneyContainer: {
    backgroundColor: Colors.primary5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: HEADER_HEIGHT,
  },
  headerMoneyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  month: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    marginHorizontal: 12,
  },

  buttonArrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    borderColor: Colors.gray5,
  },
  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 4,
    resizeMode: 'contain',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: { width: 132, height: 132 },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  tabBarWrapper: {
    height: TAB_BAR_HEIGHT + TAB_BAR_MARGIN * 2,
    paddingVertical: TAB_BAR_MARGIN,
    backgroundColor: Colors.neutral5,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary5,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: TAB_BAR_HEIGHT / 2,
    flex: 1,
  },
  tabBar: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: TAB_BAR_HEIGHT / 2,
  },
  tabBarText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});

const ButtonArrow = memo((props) => {
  const { isLeft, disabled, onPress, ...rest } = props;
  const onPressDebounce = debounce(onPress, 1000, { leading: true, trailing: false });
  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={onPressDebounce} {...rest}>
      <View
        style={[
          styles.buttonArrowContainer,
          isLeft && { transform: [{ scaleX: -1 }], paddingLeft: 1 },
          disabled && { borderColor: Colors.neutral3 },
        ]}
      >
        <Image
          source={ICON_PATH.arrow_right}
          style={[styles.arrow, disabled && { tintColor: Colors.neutral3 }]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});

const LIST_CHECKBOX = [
  {
    id: '1',
    label: '1 năm gần nhất',
  },
  {
    id: '2',
    label: '2 năm gần nhất',
  },
  {
    id: '3',
    label: '3 năm gần nhất',
  },
  {
    id: 'about',
    label: 'Tự chọn mốc thời gian',
  },
];

const ExportStatement = memo(({ email, onChangeEmail, onPress }) => {
  const [idSelected, setIdSelected] = useState();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [type, setType] = useState('');

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);
  const showDatePicker = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const handleConfirmDatePicker = useCallback(
    (date) => {
      date = moment(date).format('DD/MM/YYYY');
      if (type === 'from') {
        setFrom(date);
      }
      if (type === 'to') {
        setTo(date);
      }
      setType('');
      hideDatePicker();
    },
    [hideDatePicker, type],
  );

  const disabled = useMemo(() => {
    return (
      !idSelected ||
      (idSelected === 'about' && (!from || !to)) ||
      (idSelected === 'about' &&
        moment(from, 'DD/MM/YYYY')?.valueOf() >= moment(to, 'DD/MM/YYYY')?.valueOf())
    );
  }, [from, idSelected, to]);

  return (
    <View style={{ backgroundColor: Colors.neutral5, paddingBottom: 50, paddingTop: 16 }}>
      {LIST_CHECKBOX?.map((item) => {
        const isSelected = item?.id === idSelected;
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (!isSelected) {
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(
                    100,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity,
                  ),
                );
                setIdSelected(item?.id);
              }
            }}
          >
            <View
              key={item?.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 24 / 2,
                  borderWidth: 1.5,
                  borderColor: isSelected ? Colors.primary2 : Colors.neutral3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                {isSelected ? (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 12 / 2,
                      backgroundColor: Colors.primary2,
                    }}
                  />
                ) : null}
              </View>
              <AppText style={[styles.text, isSelected && { color: Colors.gray1 }]}>
                {item?.label}
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
      {idSelected === 'about' ? (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <AppText
              onPress={() => {
                setType('from');
                showDatePicker();
              }}
              style={{
                flex: 1,
                paddingHorizontal: 12,
                marginHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: Colors.primary5,
                borderWidth: 1,
                color: Colors.gray5,
                borderColor: type === 'from' ? Colors.primary2 : Colors.gray4,
              }}
            >
              Từ:{' '}
              <AppText style={{ color: from ? Colors.gray1 : Colors.gray5 }}>
                {from || 'dd/mm/yyyy'}
              </AppText>
            </AppText>
            <AppText
              onPress={() => {
                setType('to');
                showDatePicker();
              }}
              style={{
                flex: 1,
                paddingHorizontal: 12,
                marginHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: Colors.primary5,
                borderWidth: 1,
                color: Colors.gray5,
                borderColor: type === 'to' ? Colors.primary2 : Colors.gray4,
              }}
            >
              Đến:{' '}
              <AppText style={{ color: to ? Colors.gray1 : Colors.gray5 }}>
                {to || 'dd/mm/yyyy'}
              </AppText>
            </AppText>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            cancelTextIOS={'Hủy'}
            confirmTextIOS={'Xác nhận'}
            locale={'vi-VN'}
            onConfirm={handleConfirmDatePicker}
            onCancel={hideDatePicker}
            customHeaderIOS={() => null}
            maximumDate={new Date()}
            date={
              type === 'from' && from
                ? new Date(moment(from, 'DD/MM/YYYY').valueOf())
                : type === 'to' && to
                ? new Date(moment(to, 'DD/MM/YYYY').valueOf())
                : new Date()
            }
          />
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={[styles.text, { marginTop: 16, marginHorizontal: 16 }]}>
          Email nhận sao kê
        </AppText>
        <AppText
          onPress={onChangeEmail}
          style={[styles.text, { marginTop: 16, marginHorizontal: 16, color: Colors.primary2 }]}
        >
          Thay đổi
        </AppText>
      </View>
      <AppText
        style={{
          flex: 1,
          paddingHorizontal: 12,
          marginHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: Colors.primary5,
          borderWidth: 1,
          borderColor: Colors.gray4,
          marginTop: 4,
          color: Colors.gray1,
        }}
      >
        {email || 'abc@email.com'}
      </AppText>
      <ButtonText
        onPress={() => {
          onPress(idSelected, from, to);
        }}
        disabled={disabled}
        medium
        style={{ alignSelf: 'center' }}
        title={'Xuất sao kê ngay'}
        top={16}
        buttonColor={disabled ? Colors.neutral3 : Colors.primary2}
      />
    </View>
  );
});
