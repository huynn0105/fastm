import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import HeaderSection from '../../Home/HeaderSection';
import PieChart from '../../../componentV3/PieChart/PieChart';
import { DATA_PIE_EMPTY } from '../../Collaborator/Collaborator.constants';
import AnimateNumber from '../../../componentV3/AnimateNumber/AnimateNumber';
import { formatCurrency, formatNumber } from '../../../utils/Utils';
import ListDetailChart from '../../Collaborator/common/ListDetailChart';
import { useDispatch } from 'react-redux';
import { getStatisticCustomerByLink } from '../../../redux/actions/actionsV3/customerAction';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import ListCheckBox from '../../Customer/common/ListCheckBox';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HScrollView = HPageViewHoc(ScrollView);
const ARRAY_COLOR = ['#005fff', '#dc41d7', '#ff499c', '#ff8469', '#ffc252'];

const StatisticsLink = memo((props) => {
  const { index, onUserGuideChange } = props;
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [idsLink, setIdsLink] = useState();

  const isCheckBoxAll = useMemo(
    () => (idsLink?.length || 0) === (data?.links?.length || 0),
    [data?.links?.length, idsLink?.length],
  );

  const pieRef = useRef();
  const bottomSheetRef = useRef();
  const itemCheckboxModal = useRef({});
  const idsCheckboxModal = useRef([]);

  const dataList = useMemo(() => {
    const dbData = data?.data?.map((item, idx) => ({
      ...item,
      title: `title-${idx}`,
      color: ARRAY_COLOR[idx],
      background: ARRAY_COLOR[idx],
      value: item?.count,
      key: `pie-${idx}`,
      name: `${item?.title || ''}`,
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
      const idx = pieData?.findIndex((item) => item?.key === key);
      pieRef?.current?.focus(idx);
    },
    [pieData],
  );

  const onCheckboxSelected = useCallback(
    (ids) => {
      if (ids?.length === 0) {
        ids = data?.links?.map((it) => it?.ID);
      }
      idsCheckboxModal.current = ids;
    },
    [data?.links],
  );

  const onConfirmCheckbox = useCallback(() => {
    bottomSheetRef.current.close();
    requestAnimationFrame(() => {
      setIdsLink(idsCheckboxModal.current);
    });
  }, []);

  const onFilter = useCallback(() => {
    itemCheckboxModal.current.data = data?.links?.map((item) => ({
      id: item?.ID,
      isSelected: idsLink?.includes(item?.ID),
      title: item?.customer_label,
    }));
    bottomSheetRef.current.open(`Lọc liên kết`);
  }, [data?.links, idsLink]);

  const onGetData = useCallback(() => {
    setIsLoading(true);
    const payload = isCheckBoxAll
      ? {}
      : {
          potentialIDs: idsLink,
        };
    dispatch(
      getStatisticCustomerByLink(payload, (isSuccess, results) => {
        if (isSuccess) {
          setData(results);
          setIdsLink((prevState) => {
            if (!prevState) return results?.links?.map((it) => it?.ID);
            return prevState;
          });
          onUserGuideChange?.(results?.user_guide);
        }
        setIsLoading(false);
      }),
    );
  }, [dispatch, idsLink, isCheckBoxAll, onUserGuideChange]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

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
    <HScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      index={index}
    >
      <HeaderSection title={'Thống kê hiệu quả'} style={styles.title} />
      <TouchableWithoutFeedback disabled={isLoading} onPress={onFilter}>
        <View style={styles.filterContainer}>
          <Image source={ICON_PATH.iconFilter} style={styles.filterIcon} />
          <AppText semiBold style={styles.filterText}>
            {isCheckBoxAll ? 'Tất cả liên kết' : `Đã chọn ${idsLink?.length} liên kết`}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
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
            <AppText style={styles.infoTitle}>{'Tổng lượt tương tác'}</AppText>
            <View style={styles.infoValueContainer}>
              <AppText semiBold style={styles.infoValue}>
                {formatNumber(data?.total || 0)} người
              </AppText>
            </View>
          </View>
        </View>
        {data?.data?.length ? (
          <AppText style={[styles.infoTitle, { marginTop: 16 }]}>
            Phân loại khách hàng theo trạng thái tham gia
          </AppText>
        ) : null}
        <ListDetailChart data={dataList} unit={'người'} onPressItem={onPressItem} />
        <View
          style={{
            backgroundColor: Colors.blue6,
            borderRadius: 8,
            marginTop: 18,
            paddingHorizontal: 12,
          }}
        >
          {data?.url_post && data?.url_post?.length
            ? data?.url_post?.map((item, idx) => {
                return (
                  <TouchableOpacity
                    index={idx}
                    // onPress={() => onOpenLink(item)}
                    style={[
                      styles.tipsContainer,
                      idx && { borderTopWidth: 1, borderTopColor: Colors.primary5 },
                    ]}
                  >
                    <AppText style={styles.tipsTitle} medium>
                      {item?.title}
                    </AppText>
                    <Image source={ICON_PATH.arrow_right} style={styles.tipsIcon2} />
                  </TouchableOpacity>
                );
              })
            : null}
        </View>
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ListCheckBox
            data={itemCheckboxModal.current.data || []}
            onCheckboxSelected={onCheckboxSelected}
          />
        )}
        canClose
        haveCloseButton
        onPressDone={onConfirmCheckbox}
      />
    </HScrollView>
  );
});

export default StatisticsLink;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary5,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  filterIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 12,
  },
  filterText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  title: {
    marginTop: 12,
  },
  cardContainer: {
    backgroundColor: Colors.primary5,
    marginTop: 12,
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
});
