import { ScrollView, StyleSheet, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import CustomerByTimeContent from './CustomerByTimeContent';
import CustomerByStatusContent from './CustomerByStatusContent';
import CustomerByTotalProductContent from './CustomerByTotalProductContent';
import { BOTTOM_BAR_HEIGHT } from '../../../screens2/Root/Tabbar';
import { SH } from '../../../constants/styles';
import CustomerByHandlerContent from './CustomerByHandlerContent';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';
const HScrollView = HPageViewHoc(ScrollView);

const StatisticsCustomer = memo(
  forwardRef((props, ref) => {
    const { index, onChangeFilterFromStatistic } = props;
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }, []);

    useImperativeHandle(ref, () => ({
      onRefresh,
    }));

    return (
      <HScrollView
        index={index}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <CustomerByTimeContent isRefreshing={isRefreshing} />
        <CustomerByStatusContent
          isRefreshing={isRefreshing}
          onChangeFilterFromStatistic={onChangeFilterFromStatistic}
        />
        <CustomerByTotalProductContent
          isRefreshing={isRefreshing}
          onChangeFilterFromStatistic={onChangeFilterFromStatistic}
        />
        <CustomerByHandlerContent
          isRefreshing={isRefreshing}
          onChangeFilterFromStatistic={onChangeFilterFromStatistic}
        />
      </HScrollView>
    );
  }),
);

export default StatisticsCustomer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(24),
    width: SCREEN_WIDTH,
  },
});
