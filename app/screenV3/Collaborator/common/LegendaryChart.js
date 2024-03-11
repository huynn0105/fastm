import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { formatNumber } from '../../../utils/Utils';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import moment from 'moment';

const HEIGHT_ITEM = 50;
const WIDTH_ITEM = 90;

const LegendaryChart = memo((props) => {
  const [data, setData] = useState(props?.data || {});

  const scrollViewRef = useRef();
  const scrollViewHorizontalRef = useRef();

  const widthScrollView = useRef(0);

  const offsetItemActive = useRef(0);

  const listYAxis = useMemo(() => {
    if (!data?.amountCollaborator?.length) return [];
    let newList = [...data?.amountCollaborator];
    newList.unshift(null);
    const maxIndex = newList?.length - 1;
    newList = newList.map((item, index) => {
      return {
        id: index,
        label: index === maxIndex ? null : index,
        value: index === 0 ? 'Bạn' : formatNumber(item),
        isLast: index === maxIndex,
        isFirst: index === 0,
      };
    });
    return newList?.reverse();
  }, [data?.amountCollaborator]);

  const listBar = useMemo(() => {
    const ids = Object.keys(data?.detail || {});
    if (!ids?.length) return [];
    const values = Object.values(data?.detail || {});
    const newList = [];

    for (let i = 0; i < ids?.length; i++) {
      const id = ids[i];
      const item = values[i];
      const nextItem = values[i + 1];
      if (item?.amount?.length > 0) {
        item.isActive = !!item?.amount?.length;
        item.imageRank = data?.rank?.level?.image;
        offsetItemActive.current = WIDTH_ITEM * i + WIDTH_ITEM / 2;
      }
      if (!nextItem || nextItem?.ratioLine?.length > item?.ratioLine?.length) {
        item.isUp = data?.rank?.level?.image;
      }
      newList.push({
        id,
        ...item,
      });
    }

    return newList;
  }, [data?.detail, data?.rank?.level?.image]);

  const renderYAxis = useCallback((item) => {
    return (
      <View
        key={item?.id}
        style={[styles.itemYAxisContainer, item?.isFirst && { height: HEIGHT_ITEM / 1.5 }]}
      >
        <AppText style={styles.itemYAxisValue} semiBold>
          {item?.value}
        </AppText>
        <View
          style={[
            styles.itemYAxisLabelContainer,
            item?.isFirst && {
              borderBottomRightRadius: 4,
              borderBottomLeftRadius: 4,
            },
            item?.isLast && {
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4,
            },
          ]}
        >
          {item?.label !== null ? (
            <AppText style={styles.itemYAxisLabel} bold>
              {item?.label}
            </AppText>
          ) : (
            <Image source={ICON_PATH.arrowUpThin} style={{ width: 16, height: 16 }} />
          )}
          {!item?.isFirst ? <View style={styles.lineHorizontal} /> : null}
        </View>
      </View>
    );
  }, []);
  const renderXAxis = useCallback(
    (item) => {
      return (
        <View style={styles.itemXAxisContainer}>
          {item?.isActive ? (
            <AppText style={styles.total} semiBold>
              {formatNumber(data?.commissionInit)} đ
            </AppText>
          ) : null}
        </View>
      );
    },
    [data?.commissionInit],
  );

  const renderBar = useCallback(
    (parentItem) => (item, index) => {
      return (
        <View
          style={[
            styles.itemBarContainer,
            {
              backgroundColor: parentItem?.isActive ? parentItem?.active : parentItem?.background,
            },
          ]}
        >
          <AppText
            semiBold
            style={[styles.chartValue, parentItem?.isActive && { color: Colors.primary5 }]}
          >
            {parentItem?.isActive && item === 0
              ? formatNumber(parentItem.ratioLine[index])
              : formatNumber(item)}
            {parentItem?.isActive && item !== 0 ? '' : '%'}
          </AppText>
          <View style={styles.lineHorizontalChart} />
        </View>
      );
    },
    [],
  );

  const mascotImage = useMemo(() => {
    let gender = '';
    switch (props?.gender) {
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

    return {
      src: IMAGE_PATH[`${gender}${titleLevel}`],
      size: titleLevel === 'Diamond' || titleLevel === 'Silver' ? 84 : 82,
    };
  }, [data?.rank?.level?.level, props?.gender]);

  const renderBarContainer = useCallback(
    (item, index) => {
      const titleSplit = item?.title?.split(' ');
      const maxIndex = titleSplit?.length - 1;
      const star = !isNaN(titleSplit?.[maxIndex]) ? titleSplit?.[maxIndex] : 0;
      const level = star ? titleSplit?.splice(0, maxIndex)?.join(' ') : item?.title;

      const maxRow = listYAxis?.length - 1;

      const isLastCol = maxRow === item?.ratioLine?.length;

      return (
        <View style={styles.itemBarContainerContainer}>
          {item?.isActive ? (
            <View style={styles.chartRank}>
              <View style={styles.chartRankImage}>
                <Image
                  source={mascotImage.src}
                  style={{ width: mascotImage.size, height: mascotImage.size }}
                />
              </View>
              {!isLastCol ? (
                <AppText semiBold style={styles.date}>
                  {props?.userId ? 'CTV' : 'Bạn'} của tháng {moment().format('M')}
                </AppText>
              ) : null}
            </View>
          ) : null}
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9 }}
            colors={[
              item?.isActive && !isLastCol ? `${item?.active}60` : `${item?.active}00`,
              `${item?.active}00`,
            ]}
            style={[
              styles.itemBarContainerHeader,
              {
                height: isLastCol ? HEIGHT_ITEM : HEIGHT_ITEM * (maxRow - item?.ratioLine?.length),
              },
            ]}
          >
            <View style={styles.itemBarContainer}>
              <Image
                source={
                  isLastCol
                    ? ICON_PATH.borderChart3
                    : item?.isUp
                    ? ICON_PATH.borderChart
                    : ICON_PATH.borderChart2
                }
                style={[styles.imageBorderChart, { tintColor: item?.active }]}
              />

              <AppText bold style={[styles.barTitle, { color: item?.active, textAlign: 'center' }]}>
                {level}
              </AppText>
              {star ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <AppText bold style={[styles.barTitle, { color: item?.active }]}>
                    {star}
                  </AppText>
                  <Image
                    source={ICON_PATH.boldStar}
                    style={[styles.star, { tintColor: item?.active }]}
                  />
                </View>
              ) : null}
            </View>
          </LinearGradient>
          <View>
            {item?.isActive
              ? item?.amount?.map(renderBar(item))
              : item?.ratioLine?.map(renderBar(item))}
            {index > 0 ? <View style={styles.lineVerticalChart} /> : null}
          </View>
        </View>
      );
    },
    [listYAxis?.length, mascotImage.size, mascotImage.src, props?.userId, renderBar],
  );

  const onLayoutScrollView = useCallback((event) => {
    widthScrollView.current = event?.nativeEvent?.layout?.width;
    setTimeout(() => {
      scrollViewHorizontalRef?.current?.scrollTo({
        x: offsetItemActive.current - widthScrollView.current / 2 || 0,
      });
    });
  }, []);

  useEffect(() => {
    setData(props?.data);
  }, [props?.data]);

  useEffect(() => {
    if (props?.horizontal) {
      setTimeout(() => {
        scrollViewRef?.current?.scrollToEnd();
      }, 500);
    }
  }, [props?.horizontal]);

  return (
    <ScrollView
      ref={scrollViewRef}
      scrollEnabled={props?.horizontal}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.yAxisContainer}>
          <AppText style={styles.yAxisTitle}>{'Phân tầng\nvà số CTV'}</AppText>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
            style={styles.linearGradientYAaxis}
          />
          {listYAxis?.map(renderYAxis)}
        </View>
        <View style={styles.wrapperChartBar}>
          <ScrollView
            ref={scrollViewHorizontalRef}
            contentContainerStyle={styles.listBarContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            onLayout={onLayoutScrollView}
          >
            {listBar?.map(renderBarContainer)}
            <View style={styles.xAxisContainer}>{listBar?.map(renderXAxis)}</View>
          </ScrollView>
          {props?.isLoading ? (
            <ActivityIndicator style={styles.loading} color={Colors.gray5} />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
});

export default LegendaryChart;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  yAxisContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
    zIndex: 9,
    justifyContent: 'flex-end',
  },
  itemYAxisContainer: {
    flexDirection: 'row',
    height: HEIGHT_ITEM,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemYAxisValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue5,
  },
  itemYAxisLabelContainer: {
    marginLeft: 10,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue5,
    height: '100%',
  },
  itemYAxisLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary5,
  },
  lineHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255, 0.4)',
    bottom: 0,
  },
  yAxisTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginBottom: 18,
  },
  linearGradientYAaxis: {
    position: 'absolute',
    height: '100%',
    width: 20,
    right: -20,
  },
  listBarContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: HEIGHT_ITEM / 1.5,
  },
  xAxisContainer: {
    position: 'absolute',
    flexDirection: 'row',
  },
  itemXAxisContainer: {
    width: WIDTH_ITEM,
    height: HEIGHT_ITEM / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue5,
  },
  total: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary5,
  },
  itemBarContainerContainer: {
    width: WIDTH_ITEM,
    height: '100%',
  },
  itemBarContainerHeader: { flex: 1, justifyContent: 'flex-end', borderRadius: 4 },
  itemBarContainer: {
    width: '100%',
    height: HEIGHT_ITEM,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  imageBorderChart: {
    width: WIDTH_ITEM,
    height: HEIGHT_ITEM,
    position: 'absolute',
    resizeMode: 'stretch',
  },
  barTitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  star: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 3,
    top: -1,
  },
  lineVerticalChart: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.primary5,
    position: 'absolute',
    left: 0,
  },
  lineHorizontalChart: {
    width: 91,
    height: 1,
    backgroundColor: Colors.primary5,
    position: 'absolute',
    top: 0,
  },
  chartValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  chartRank: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    color: Colors.gray1,
  },
  chartRankImage: {
    width: 46,
    height: 46,
    alignItems: 'center',
    overflow: 'hidden',
  },
  loading: {
    position: 'absolute',
    zIndex: 999,
    alignSelf: 'center',
    marginLeft: 10,
  },
  wrapperChartBar: { flex: 1, justifyContent: 'center' },
});
