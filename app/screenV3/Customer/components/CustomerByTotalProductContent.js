import { Image, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { formatNumber, formatCurrency } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import PieChart from '../../../componentV3/PieChart/PieChart';
import AnimateNumber from '../../../componentV3/AnimateNumber/AnimateNumber';
import { DATA_PIE_EMPTY } from '../../Collaborator/Collaborator.constants';
import HeaderSection from '../../Collaborator/common/HeaderSection';
import IconUpDown from '../../Collaborator/common/IconUpDown';
import ListDetailChart from '../../Collaborator/common/ListDetailChart';
import { getStatisticCustomerByTotalProduct } from '../../../redux/actions/actionsV3/customerAction';
import { STATUS_ITEM } from '../Customer.constants';

const ARRAY_COLOR = ['#005fff', '#dc41d7', '#ff499c', '#ff8469', '#ffc252'];
const CustomerByTotalProductContent = memo((props) => {
  const { onChangeFilterFromStatistic } = props;

  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const dataList = useMemo(() => {
    const dbData = data?.data?.map((item, index) => ({
      ...item,
      title: `title-${index}`,
      color: ARRAY_COLOR[index],
      background: ARRAY_COLOR[index],
      value: item?.count,
      key: `pie-${index}`,
      name: `${item?.title} >>`,
      currentGrowth: `${Math.abs(item?.percent)}`,
    }));

    return dbData;
  }, [data?.data]);

  const pieData = useMemo(() => {
    const dbData = dataList?.filter((item) => item?.value > 0);

    return dbData?.length ? dbData : DATA_PIE_EMPTY;
  }, [dataList]);

  const onPressItem = useCallback(
    ({ key }) => {
      const index = pieData?.findIndex((item) => item?.key === key);
      pieRef?.current?.focus(index);
    },
    [pieData],
  );

  const onPressName = useCallback(
    ({ filters }) => {
      const filterParse = {};
      for (let key in filters) {
        const item = filters[key];
        filterParse[item?.key] = [...(filterParse[item?.key] || []), `${item?.value}`];
      }
      onChangeFilterFromStatistic?.(filterParse);
    },
    [onChangeFilterFromStatistic],
  );

  const onOpenLink = useCallback((item) => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${item?.url}&title=${item?.title}`,
    );
  }, []);

  const onGetData = useCallback(() => {
    setIsLoading(true);
    dispatch(
      getStatisticCustomerByTotalProduct((isSuccess, result) => {
        if (isSuccess) {
          setData(result);
        }
        setIsLoading(false);
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    if (!props?.isRefreshing) return;
    onGetData();
  }, [onGetData, props?.isRefreshing]);

  const pieRef = useRef();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (isLoading) {
        pieRef?.current?.startLoading?.();
      } else {
        pieRef?.current?.stopLoading?.();
        pieRef?.current?.animate?.();
      }
    });
  }, [isLoading]);

  return (
    <>
      <HeaderSection title={`Đa dạng sản phẩm`} />
      <View style={styles.cardContainer}>
        <View style={styles.chartInfoContainer}>
          <View style={styles?.chartContainer}>
            <PieChart
              ref={pieRef}
              pieStyle={styles.chart}
              outerRadius={55}
              innerRadius={40}
              data={pieData}
              animate={!isLoading}
              padAngle={0.02}
            />
            {isLoading ? null : (
              <AppText style={styles.totalValueChart} semiBold>
                <AnimateNumber
                  style={styles.totalValueChart}
                  semiBold
                  value={data?.total || 0}
                  time={1500}
                  formatter={(value) => {
                    return formatCurrency(value.toFixed(0))?.split(' ')?.[0];
                  }}
                />
                <AppText style={styles.totalUnitChart} regular>
                  {`\n`}
                  {formatCurrency(data?.total || 0)?.split(' ')?.[1] || 'người'}
                </AppText>
              </AppText>
            )}
          </View>
          <View style={styles.infoContainer}>
            <AppText
              style={styles.infoTitle}
            >{`Tổng khách hàng từng\ntham gia thành công`}</AppText>
            <View style={styles.infoValueContainer}>
              <AppText semiBold style={styles.infoValue}>
                {formatNumber(data?.total)} người
              </AppText>
            </View>
          </View>
        </View>
        {data?.data?.length ? (
          <AppText style={[styles.infoTitle, { marginTop: 16 }]}>
            Mức độ đa dạng theo sản phẩm
          </AppText>
        ) : null}
        <ListDetailChart
          data={dataList}
          unit={'người'}
          onPressItem={onPressItem}
          onPressName={onPressName}
        />
        {data?.url_post && data?.url_post?.length ? (
          <View
            style={{
              backgroundColor: Colors.blue6,
              borderRadius: 8,
              marginTop: 18,
              paddingHorizontal: 12,
              marginBottom: 8,
            }}
          >
            {data?.url_post?.map((item, index) => {
              return (
                <TouchableOpacity
                  index={index}
                  onPress={() => onOpenLink(item)}
                  style={[
                    styles.tipsContainer,
                    index && { borderTopWidth: 1, borderTopColor: Colors.primary5 },
                  ]}
                >
                  <AppText style={styles.tipsTitle} medium>
                    {item?.title}
                  </AppText>
                  <Image source={ICON_PATH.arrow_right} style={styles.tipsIcon2} />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    </>
  );
});

export default CustomerByTotalProductContent;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.primary5,
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  chart: { width: 120, height: 120 },
  totalValueChart: {
    position: 'absolute',
    fontSize: 18,
    color: Colors.gray1,
    textAlign: 'center',
  },
  totalUnitChart: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  chartInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 18,
    color: Colors.gray1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    fontSize: 18,
    color: Colors.blue5,
    lineHeight: 24,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.blue5,
    marginLeft: 6,
    marginRight: 6,
  },
  star: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.blue5,
    top: -2,
    marginLeft: 4,
  },
  loadingContainer: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  boxContainer: {
    flex: 1,
    backgroundColor: Colors.purple2,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipsIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  tipsInfoContainer: {
    flex: 1,
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 13,
    color: Colors.gray9,
    lineHeight: 18,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tipsTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.action,
    flex: 1,
    marginRight: 16,
  },
  tipsIcon2: {
    width: 16,
    height: 16,
    tintColor: Colors.action,
    resizeMode: 'contain',
    position: 'absolute',
    top: 16,
    right: 0,
  },
  elementContainer: {
    flexDirection: 'row',
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});
