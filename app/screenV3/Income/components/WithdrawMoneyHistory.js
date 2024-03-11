import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { fonts } from '../../../constants/configs';
import { prettyNumberString } from '../../../utils/Utils';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { useDispatch } from 'react-redux';
import ButtonText from '../../../common/ButtonText';
import { getTimeBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import { SW } from '../../../constants/styles';
import { getWithdrawMoneyHistory } from '../../../redux/actions/actionsV3/banking';
import Indicator from '../../../componentV3/Indicator/Indicator';
import EmptyList from '../../BankAccount/comp/EmptyList';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HFlatList = HPageViewHoc(FlatList);

const LIST_FILTER_HISTORY = [
  {
    id: '',
    title: 'Tất cả',
  },
  {
    id: 'income',
    title: 'Thu nhập',
  },
  {
    id: 'bank_withdrawal',
    title: 'Đã rút',
  },
  {
    id: 'payment',
    title: 'Mua sắm',
  },
  {
    id: 'tax_deduct',
    title: 'Thuế TNCN',
  },
  {
    id: 'collection',
    title: 'Thu hồi',
  },
];

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const WithdrawMoneyHistory = memo(
  forwardRef((props, ref) => {
    const { index } = props;
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [month, setMonth] = useState(moment());
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [outOfData, setOutOfData] = useState(false);

    const containerStyle = useMemo(
      () => [styles.container, { marginBottom: insets.bottom }],
      [insets.bottom],
    );

    const [idFilterSelected, setIdFilterSelected] = useState(LIST_FILTER_HISTORY[0].id);

    useImperativeHandle(ref, () => ({
      setIdFilterSelected: (_idFilterSelected) => {
        setPage(1);
        setIdFilterSelected(_idFilterSelected);
      },
      setMonth: (_month) => {
        setPage(1);
        setMonth(_month);
      },
    }));

    const renderItem = useCallback(({ item, index: idx }) => {
      return <ItemHistory item={item} index={idx} />;
    }, []);
    const renderItemFilter = useCallback(
      ({ item }) => {
        const isActive = idFilterSelected === item?.id;
        return (
          <ButtonText
            onPress={() => {
              setIdFilterSelected((prev) => {
                if (prev === item?.id) return prev;
                LayoutAnimation.configureNext(
                  LayoutAnimation.create(
                    100,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity,
                  ),
                );
                setPage(1);
                setOutOfData(false);
                return item?.id;
              });
            }}
            title={item?.title}
            height={32}
            medium={isActive}
            buttonColor={isActive ? Colors.primary2 : Colors.primary5}
            titleColor={isActive ? Colors.primary5 : Colors.gray5}
            style={{ paddingHorizontal: 12, paddingTop: 2, marginRight: 12 }}
          />
        );
      },
      [idFilterSelected],
    );

    const onGetData = useCallback(() => {
      setIsLoading(true);
      dispatch(
        getWithdrawMoneyHistory(
          idFilterSelected,
          page,
          moment(month).format('MM'),
          moment(month).format('YYYY'),
          (isSuccess, result, isLoadMore, headerResult) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.create(
                100,
                LayoutAnimation.Types.easeInEaseOut,
                LayoutAnimation.Properties.opacity,
              ),
            );
            if (isSuccess) {
              setData((prevState) => {
                if (page === 1) {
                  return result;
                }

                return [...prevState, ...result];
              });
              setHeaderData(headerResult);
            }
            setOutOfData(!isLoadMore);
            setIsLoading(false);
          },
        ),
      );
    }, [dispatch, idFilterSelected, month, page]);

    const onEndReached = useCallback(() => {
      if (outOfData) return;
      setPage((prev) => prev + 1);
    }, [outOfData]);

    useEffect(() => {
      onGetData();
    }, [onGetData]);

    return (
      <>
        <HFlatList
          index={index}
          data={data}
          renderItem={renderItem}
          style={containerStyle}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          ListHeaderComponent={
            <>
              <AppText semiBold style={styles.itemDefaultText}>
                Lịch sử giao dịch
              </AppText>
              <FlatList
                horizontal
                data={LIST_FILTER_HISTORY}
                renderItem={renderItemFilter}
                style={{ marginTop: 8, marginBottom: 16 }}
                showsHorizontalScrollIndicator={false}
              />
              {headerData?.title ? <ItemTaxHolding item={headerData} /> : null}
              {isLoading && page === 1 ? (
                <Indicator style={{ marginTop: 32, marginBottom: 32 }} />
              ) : null}
            </>
          }
          ListFooterComponent={<></>}
          ListEmptyComponent={
            isLoading && page > 1 ? (
              <Indicator style={{ marginTop: 12 }} />
            ) : !headerData?.title && !isLoading ? (
              <View style={styles.listEmptyContainer}>
                <>
                  <Image
                    source={IMAGE_PATH.mascotSleep}
                    style={{ width: 120, height: 120, alignSelf: 'center' }}
                  />
                  <AppText
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      color: Colors.gray5,
                      marginTop: 16,
                      textAlign: 'center',
                    }}
                  >
                    Chưa phát sinh giao dịch trong tháng
                  </AppText>
                </>
              </View>
            ) : null
          }
        />
      </>
    );
  }),
);

export default WithdrawMoneyHistory;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  moneyContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorContainer: {
    marginLeft: 20,
    marginTop: 8,
    flexDirection: 'row',
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.sixRed,
    marginLeft: 4,
    flex: 1,
  },
  inputContainer: {
    marginLeft: 20,
    marginTop: 8,
    height: 48,
    backgroundColor: Colors.primary5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.neutral5,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.gray1,
  },
  noteInput: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray8,
    marginLeft: 12,
  },
  listDefaultContainer: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  itemDefaultContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemDefaultText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  itemBankContainer: {
    position: 'relative',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.primary5,
  },
  itemBankImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderWidth: 1,
    borderColor: Colors.gray4,
    zIndex: 1,
  },
  itemBankImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  itemBankInfoContainer: {
    backgroundColor: Colors.primary5,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary5,
    paddingLeft: 33,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemBankName: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
  },
  itemBankNameActive: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemBankNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  indicator: {
    marginVertical: 12,
  },
  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 11,
  },
  iconEmpty: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
  listEmptyContainer: {
    backgroundColor: Colors.primary5,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
});

const ItemHistory = memo((props) => {
  const { item, index, onPress } = props;
  return (
    <TouchableWithoutFeedback
      disabled={item?.disabled}
      onPress={() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            100,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity,
          ),
        );
        onPress?.(item?.banking_id);
      }}
    >
      <View
        style={[
          styles.itemBankContainer,
          !index && { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
        ]}
      >
        <AppText style={[styles.itemDefaultText, { color: Colors.gray1 }]}>
          #{item?.ID}: {item?.transTitle}
        </AppText>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5, width: SW(80) }}>
            Giao dịch:
          </AppText>
          <AppText
            style={[
              styles.itemDefaultText,
              { color: item?.creditAmount > 0 ? '#00bd8a' : '#ea4848', flex: 1 },
            ]}
            semiBold
          >
            {item?.creditAmount > 0 ? '+' : ''}
            {prettyNumberString(item?.creditAmount)} đ
          </AppText>
          <View
            style={{
              height: 20,
              borderRadius: 12,
              backgroundColor:
                item?.status === '1' ? '#fdecd8' : item?.status === '2' ? '#d6fff4' : '#fbdada',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              flexDirection: 'row',
            }}
          >
            <AppText
              medium
              style={[
                styles.itemDefaultText,
                {
                  color:
                    item?.status === '1' ? '#f58b14' : item?.status === '2' ? '#00c28e' : '#e93535',
                },
              ]}
            >
              {item?.status === '1' ? 'Chờ xử lý ' : item?.status === '2' ? '' : 'Thất bại '}
            </AppText>
            <Image
              style={{
                width: 16,
                height: 16,
                tintColor:
                  item?.status === '1' ? '#f58b14' : item?.status === '2' ? '#00c28e' : '#e93535',
              }}
              source={
                item?.status === '1'
                  ? ICON_PATH.pending2
                  : item?.status === '2'
                  ? ICON_PATH.tick2
                  : ICON_PATH.close6
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5, width: SW(80) }}>
            Số dư MFast:
          </AppText>
          <AppText style={[styles.itemDefaultText, { color: '#231eaf', flex: 1 }]} semiBold>
            {prettyNumberString(item?.newBalance)} đ
          </AppText>
          <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5 }}>
            {getTimeBetween(moment(item?.transDate)?.valueOf())}
          </AppText>
        </View>
        {index ? (
          <View
            style={{
              position: 'absolute',
              width: SW(320),
              height: 1,
              backgroundColor: Colors.gray4,
              top: 0,
              alignSelf: 'center',
            }}
          />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
});
const ItemTaxHolding = memo((props) => {
  const { item } = props;
  return (
    <View style={[styles.itemBankContainer, { borderRadius: 8, marginBottom: 12 }]}>
      <AppText style={[styles.itemDefaultText, { color: Colors.gray1 }]}>{item?.title}</AppText>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5, width: SW(95) }}>
          Tạm giữ:
        </AppText>
        <AppText style={[styles.itemDefaultText, { color: '#ea4848', flex: 1 }]} semiBold>
          {prettyNumberString(item?.total_tax_holding || 0)} đ
        </AppText>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5, width: SW(95) }}>
          Tổng thu nhập:
        </AppText>
        <AppText style={[styles.itemDefaultText, { color: '#231eaf', flex: 1 }]} semiBold>
          {prettyNumberString(item?.total_amount || 0)} đ
        </AppText>
        <AppText style={{ fontSize: 12, lineHeight: 16, color: Colors.gray5 }}>
          {item?.lastUpdate}
        </AppText>
      </View>
    </View>
  );
});
