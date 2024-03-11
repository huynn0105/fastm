import { FlatList, Image, Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import SearchInput from '../../componentV3/SearchInput/SearchInput';
import MonthSelectView from '../MTradeOrder/components/MonthSelectView';
import moment from 'moment';
import AppText from '../../componentV3/AppText';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SH } from '../../constants/styles';
import { formatNumber, isDeepLink } from '../../utils/Utils';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import { ICON_PATH } from '../../assets/path';
import { ORDER_STATUS } from '../MTradeOrder/common/OrderDirect';
import { useDispatch } from 'react-redux';
import { getListMTradeOrder } from '../../redux/actions/actionsV3/mtradeAction';
import ListLoading from '../../componentV3/ListComponents/ListLoading';
import ListEmpty from '../../componentV3/ListComponents/ListEmpty';
import { dateToFromNowDaily } from '../../utils/dateHelper';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';
import NavigationServices from '../../utils/NavigationService';

const MTradeListOrder = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const processState = useMemo(
    () => navigation?.state?.params?.processState,
    [navigation?.state?.params?.processState],
  );
  const collaboratorID = useMemo(
    () => navigation?.state?.params?.collaboratorID,
    [navigation?.state?.params?.collaboratorID],
  );
  const monthInit = useMemo(
    () => navigation?.state?.params?.month,
    [navigation?.state?.params?.month],
  );
  const title = useMemo(
    () => navigation?.state?.params?.title || 'đơn hàng',
    [navigation?.state?.params?.title],
  );

  const timeout = useRef(null);

  const [month, setMonth] = useState(monthInit || moment());
  const [data, setData] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [outOfData, setOutOfData] = useState(false);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <ListLoading title={'Đang tải...'} />;
    }

    return (
      <ListEmpty isMascot style={{ marginTop: 24 }} title={`Không có ${title?.toLowerCase()}`} />
    );
  }, [isLoading]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <ListLoading title={'Đang tải thêm...'} />;
    }

    return null;
  }, [isLoadingMore]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return <Item item={item} index={index} processState={processState} />;
    },
    [processState],
  );

  const onGetData = useCallback(
    (_page, _month, callback) => {
      if (!processState) {
        callback?.();
        return;
      }
      setPage(_page);
      const payload = {
        month: moment(_month).format('MM'),
        year: moment(_month).format('YYYY'),
        page: _page,
        process_state: processState,
        filter_text: textSearch,
      };
      if (collaboratorID) {
        payload.collaboratorID = collaboratorID;
      }
      dispatch(
        getListMTradeOrder(payload, (isSuccess, results) => {
          if (isSuccess) {
            setData((prev) => (_page === 1 ? [...results] : [...prev, ...results]));
          }
          if (!isSuccess || !results?.length) {
            setOutOfData(true);
          }
          callback?.();
        }),
      );
    },
    [collaboratorID, dispatch, processState, textSearch],
  );

  const onLoadMore = useCallback(() => {
    if (isLoadingMore || outOfData) return;
    setIsLoadingMore(true);
    const newPage = page + 1;
    onGetData(newPage, month, () => {
      setIsLoadingMore(false);
    });
  }, [isLoadingMore, month, onGetData, outOfData, page]);

  const onChangeText = useCallback((_text) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeout.current = setTimeout(() => {
      setData([]);
      setTextSearch(_text);
      timeout.current = null;
    }, 500);
  }, []);

  const onMonthChange = useCallback(
    (_month) => {
      setMonth(_month);
      setData([]);
      setIsLoading(true);
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      timeout.current = setTimeout(() => {
        onGetData(1, _month, () => {
          setIsLoading(false);
        });
        timeout.current = null;
      }, 500);
    },
    [onGetData],
  );

  useEffect(() => {
    setIsLoading(true);
    setOutOfData(false);
    onGetData(1, month, () => {
      setIsLoading(false);
    });
  }, [onGetData]);

  return (
    <View style={styles.container}>
      <MonthSelectView month={month} setMonth={onMonthChange} />
      <SearchInput
        containerStyle={styles.inputContainer}
        placeholder={'Tìm theo tên hoặc SĐT người nhận'}
        onChangeText={onChangeText}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
      />
    </View>
  );
});

export default MTradeListOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    paddingTop: 12,
  },
  inputContainer: {
    height: 36,
    flex: 0,
    marginTop: 12,
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(6),
    paddingHorizontal: 16,
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  itemBox: {
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemValue: {
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  statusOrderContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  statusOrderIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
});

const Item = memo((props) => {
  const { item, index, processState } = props;
  const renderItem = useCallback((it, idx, data) => {
    const firstItem = idx === 0;
    const lastItem = idx === data?.length - 1;

    return (
      <View style={{ flexDirection: 'row', paddingTop: firstItem ? 0 : 8, paddingBottom: 8 }}>
        <Image source={{ uri: it?.image }} style={{ width: 40, height: 40, marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: Colors.gray1,
            }}
          >
            {it?.productName}
          </AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
            <AppText style={styles.itemText}>{formatNumber(it?.amount)} đ</AppText>
            <AppText style={styles.itemText}>
              Số lượng:{'   '}
              <AppText style={[styles.itemText, { color: Colors.gray1 }]}>{it?.quantity}</AppText>
            </AppText>
          </View>
        </View>

        <DashedHorizontal
          style={{
            left: lastItem ? 0 : 52,
            right: 0,
            width: 'auto',
          }}
          size={2}
        />
      </View>
    );
  }, []);

  const renderContent = useCallback(
    ({
      title,
      content,
      containerStyle,
      contentColor = Colors.gray5,
      contentStyle,
      renderMoreContent,
      ...rest
    }) => {
      return (
        <View style={[styles.itemValue].concat(containerStyle)}>
          <AppText style={[styles.itemText, { flex: 1 }]}>{title}</AppText>
          <AppText
            {...rest}
            style={[styles.itemText, { flex: 3, color: contentColor }].concat(contentStyle)}
          >
            {content}
          </AppText>
          {renderMoreContent ? renderMoreContent : null}
        </View>
      );
    },
    [],
  );

  const renderStatusOrder = useCallback(() => {
    switch (processState) {
      case ORDER_STATUS.WAITING:
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              if (isDeepLink(item?.urlDetail)) {
                Linking.openURL(item?.urlDetail);
              } else {
                NavigationServices.navigate('WebView', {
                  url: item?.urlDetail,
                  mode: 0,
                  title: 'Thanh toán đơn hàng',
                });
              }
            }}
          >
            <View style={styles.statusOrderContainer}>
              <Image source={{ uri: item?.icon }} style={styles.statusOrderIcon} />
              <View
                style={[
                  styles.itemValue,
                  { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
                ]}
              >
                <View>
                  <AppText
                    style={{
                      color: Colors.sixOrange,
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                    semiBold
                  >
                    {item?.processText}
                  </AppText>
                  <AppText style={styles.itemText}>
                    {dateToFromNowDaily(moment(item?.updatedDate))}
                  </AppText>
                </View>
                <Image source={ICON_PATH.arrow_right} style={{ width: 20, height: 20 }} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      case ORDER_STATUS.DELIVERY:
        return (
          <View style={styles.statusOrderContainer}>
            <Image source={{ uri: item?.icon }} style={styles.statusOrderIcon} />
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
                >
                  <AppText
                    style={{
                      color: Colors.action,
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                    semiBold
                  >
                    {item?.processText}
                  </AppText>
                  <AppText style={styles.itemText}>
                    {dateToFromNowDaily(moment(item?.updatedDate))}
                  </AppText>
                </View>
                {renderContent({
                  title: 'Mã vận đơn:',
                  content: item?.trackingPartner?.trackingCode,
                  contentColor: Colors.gray1,
                  contentStyle: { flex: 1.5 },
                  containerStyle: { marginTop: 5 },
                  renderMoreContent: (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        Linking.openURL(
                          `${DEEP_LINK_BASE_URL}://copy/?text=${item?.trackingPartner?.trackingCode}`,
                        );
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <AppText
                          style={[styles.itemText, { color: Colors.primary2, marginRight: 28 }]}
                        >
                          Copy
                        </AppText>
                        <Image
                          source={ICON_PATH.copy2}
                          style={{
                            width: 24,
                            height: 24,
                            position: 'absolute',
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  ),
                })}
              </View>
              {renderContent({
                title: 'Đơn vị:',
                content: item?.trackingPartner?.partner,
                containerStyle: { marginTop: 2 },
                contentStyle: { flex: 2.5 },
              })}
              {renderContent({
                title: 'Địa chỉ nhận:',
                content: item?.trackingPartner?.addressFull,
                containerStyle: { marginTop: 2 },
                contentStyle: { flex: 2.5 },
              })}
            </View>
          </View>
        );
      case ORDER_STATUS.SUCCESS:
        return (
          <View style={styles.statusOrderContainer}>
            <Image source={{ uri: item?.icon }} style={styles.statusOrderIcon} />
            <View style={{ flex: 1 }}>
              <View
                style={[
                  styles.itemValue,
                  { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
                ]}
              >
                <AppText
                  style={{
                    color: Colors.green6,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                  semiBold
                >
                  {item?.processText}
                </AppText>
                <AppText style={styles.itemText}>
                  {dateToFromNowDaily(moment(item?.updatedDate))}
                </AppText>
              </View>
              {renderContent({
                title: 'Thu nhập:',
                content: `${formatNumber(item?.sum_bonus)} đ`,
                containerStyle: { marginTop: 2 },
                contentStyle: { fontSize: 14, lineHeight: 20 },
                contentColor: Colors.green6,
                semiBold: true,
              })}
            </View>
          </View>
        );
      case ORDER_STATUS.CANCEL:
        return (
          <View style={styles.statusOrderContainer}>
            <Image source={{ uri: item?.icon }} style={styles.statusOrderIcon} />
            <View style={{ flex: 1 }}>
              <View
                style={[
                  styles.itemValue,
                  { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
                ]}
              >
                <AppText
                  style={{
                    color: Colors.sixRed,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                  semiBold
                >
                  {item?.processText}
                </AppText>
                <AppText style={styles.itemText}>
                  {dateToFromNowDaily(moment(item?.updatedDate))}
                </AppText>
              </View>
              {renderContent({
                title: 'Ghi chú:',
                content: item?.note,
                containerStyle: { marginTop: 2 },
                contentStyle: {
                  flex: 3.5,
                },
              })}
            </View>
          </View>
        );
    }
  }, [
    item?.icon,
    item?.note,
    item?.processText,
    item?.sum_bonus,
    item?.trackingPartner?.addressFull,
    item?.trackingPartner?.partner,
    item?.trackingPartner?.trackingCode,
    item?.updatedDate,
    item?.urlDetail,
    processState,
    renderContent,
  ]);

  return (
    <>
      <AppText semiBold style={[styles.itemTitle, { marginTop: index === 0 ? 16 : 20 }]}>
        Đơn hàng: #{item?.orderID}
      </AppText>
      <View style={[styles.itemBox, { marginTop: 8 }]}>
        {item?.items?.map(renderItem)}
        {renderContent({
          title: 'Giá trị đơn:',
          content: `${formatNumber(item?.amountAfterTax)} đ`,
          contentColor: Colors.sixRed,
          containerStyle: { paddingTop: 8 },
          semiBold: true,
        })}
        {renderContent({
          title: 'Khách hàng:',
          content: `${item?.fullName} - ${item?.mobilePhone}`,
          contentColor: Colors.gray1,
          containerStyle: { paddingTop: 2 },
        })}
        {renderContent({
          title: 'Ngày tạo:',
          content: `${moment(item?.createdDate).format('DD/MM/YYYY')} - ${moment(
            item?.createdDate,
          ).format('hh:mm')}`,
          contentColor: Colors.gray5,
          containerStyle: { marginTop: 2, paddingBottom: 8 },
          renderMoreContent: <DashedHorizontal size={2} />,
        })}
        {renderStatusOrder()}
      </View>
    </>
  );
});
