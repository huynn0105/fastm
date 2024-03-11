import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { useSelector } from 'react-redux';

import { getStatisticWorking } from '../../../redux/actions/actionsV3/userConfigs';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';
import FlutterService from '../../Home/FlutterService';

const StatisticWorkingComponent = (props) => {
  /// Init
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.userConfigs?.statisticWorking);
  const isShowComponent = !isEmpty(data);

  /// Fetch Data
  useEffect(() => {
    dispatch(getStatisticWorking());
  }, [dispatch]);

  /// Callback
  const onCheckingStatistic = () => {
    FlutterService.openMFast({
      path: `/statistic_working?index_tab=0`,
    });
  };
  const onReportStatistic = () => {
    FlutterService.openMFast({
      path: `/statistic_working?index_tab=1`,
    });
  };

  /// View
  if (!isShowComponent) {
    return null;
  }
  return (
    <View>
      {/* Title */}
      <View style={styles.row}>
        <AppText style={styles.titleTextStyle} medium>
          Kết quả làm việc của cấp dưới
        </AppText>
      </View>
      {/* Content */}
      <View style={styles.container}>
        <View style={{ ...styles.row }}>
          <TouchableOpacity style={styles.touch} activeOpacity={0.2} onPress={onCheckingStatistic}>
            <View
              style={{
                ...styles.column,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Image
                source={ICON_PATH.locationFill}
                style={{ width: 28, height: 28, resizeMode: 'contain' }}
              />
              <View style={{ height: 8 }}></View>
              <AppText style={{ ...styles.subtitleTextStyle, color: Colors.gray5 }} semiBold>
                Thống kê điểm danh
              </AppText>
            </View>
          </TouchableOpacity>

          <View style={styles.verticleDivider}></View>

          <TouchableOpacity style={styles.touch} activeOpacity={0.2} onPress={onReportStatistic}>
            <View
              style={{
                ...styles.column,
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Image
                source={ICON_PATH.paperFill}
                style={{ width: 28, height: 28, resizeMode: 'contain' }}
              />
              <View style={{ height: 8 }}></View>
              <AppText style={{ ...styles.subtitleTextStyle, color: Colors.gray5 }} semiBold>
                Thống kê công việc
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.gap}></View>
    </View>
  );
};

export default StatisticWorkingComponent;

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticleDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
    backgroundColor: Colors.neutral5,
  },
  container: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    marginTop: 10,
  },
  gap: {
    width: 20,
    height: 20,
  },
  titleTextStyle: { fontSize: 14, lineHeight: 20, color: Colors.primary, flex: 1 },
  subtitleTextStyle: { fontSize: 14, lineHeight: 20, color: Colors.gray5, marginRight: 4 },
  touch: { flex: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f000' },
});
