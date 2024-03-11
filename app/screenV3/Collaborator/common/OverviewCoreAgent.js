import { Image, StyleSheet, View } from 'react-native';
import React, { memo, useEffect, useMemo } from 'react';
import SectionHeader from '../../AccountSetting/components/SectionHeader';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { ProgressCircle } from 'react-native-svg-charts';
import DashedHorizontal from '../../../componentV3/DashedHorizontal/DashedHorizontal';
import { useDispatch, useSelector } from 'react-redux';
import { getOverviewCoreAgent } from '../../../redux/actions/actionsV3/userConfigs';
import isEmpty from 'lodash/isEmpty';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';

const OverviewCoreAgent = memo(() => {
  const dispatch = useDispatch();
  const overviewCoreAgent = useSelector((state) => state.userConfigs.overviewCoreAgent);

  const data = useMemo(
    () => overviewCoreAgent?.content?.items,
    [overviewCoreAgent?.content?.items],
  );
  const title = useMemo(
    () => overviewCoreAgent?.content?.label,
    [overviewCoreAgent?.content?.label],
  );
  const html = useMemo(() => overviewCoreAgent?.content?.html, [overviewCoreAgent?.content?.html]);

  useEffect(() => {
    dispatch(getOverviewCoreAgent());
  }, [dispatch]);

  if (isEmpty(overviewCoreAgent)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SectionHeader title={title} note={overviewCoreAgent?.policy} />
      <View style={styles.boxContainer}>
        <View style={[styles.rowContainer, { paddingHorizontal: 16 }]}>
          <Image source={ICON_PATH.targetMoney} style={styles.icon} />
          <View style={styles.valueContainer}>
            <AppText style={styles.title}>{data?.kpi_target?.label}</AppText>
            <AppText semiBold style={styles.value}>
              {data?.kpi_target?.value}
            </AppText>
          </View>
          <View style={styles.valueContainer}>
            <AppText style={styles.title}>{data?.kpi_current?.label}</AppText>
            <AppText semiBold style={styles.value}>
              {data?.kpi_current?.value}
            </AppText>
          </View>
        </View>
        <View style={[styles.rowContainer, { marginTop: 12, paddingHorizontal: 16 }]}>
          <View style={[styles.rowContainer, styles.valueContainer]}>
            <ProgressCircle
              style={styles.chart}
              progress={data?.kpi_current_percent?.percent || 0}
              strokeWidth={6}
              progressColor={Colors.highLightColor}
            />
            <View style={styles.valueContainer}>
              <AppText style={styles.title}>{data?.kpi_current_percent?.label}</AppText>
              <AppText semiBold style={styles.value}>
                {data?.kpi_current_percent?.value}
              </AppText>
            </View>
          </View>
          <View style={[styles.rowContainer, styles.valueContainer]}>
            <ProgressCircle
              style={styles.chart}
              progress={data?.kpi_expected_percent?.percent || 0}
              strokeWidth={6}
              progressColor={
                (data?.kpi_expected_percent?.percent || 0) < 0.6
                  ? Colors.secondRed
                  : (data?.kpi_expected_percent?.percent || 0) < 0.8
                  ? Colors.secondOrange
                  : Colors.secondGreen
              }
            />
            <View style={styles.valueContainer}>
              <AppText style={styles.title}>{data?.kpi_expected_percent?.label}</AppText>
              <AppText semiBold style={styles.value}>
                {data?.kpi_expected_percent?.value}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.dashedContainer}>
          <View style={{ width: '100%' }}>
            <DashedHorizontal />
          </View>
          <View style={[styles.dashedCircle, { left: -styles.dashedCircle.width / 2 }]} />
          <View style={[styles.dashedCircle, { right: -styles.dashedCircle.width / 2 }]} />
        </View>
        <View style={[styles.rowContainer, { paddingHorizontal: 16 }]}>
          <View
            style={[
              styles.valueContainer,
              styles.moneyContainer,
              { marginRight: 8, backgroundColor: '#eaeef6' },
            ]}
          >
            <AppText style={styles.title}>{data?.fixed_salary?.label}</AppText>
            <AppText semiBold style={styles.value}>
              {data?.fixed_salary?.value}
            </AppText>
          </View>
          <View
            style={[styles.valueContainer, styles.moneyContainer, { backgroundColor: '#fdecd8' }]}
          >
            <AppText style={styles.title}>{data?.expected_reward?.label}</AppText>
            <AppText semiBold style={styles.value}>
              {data?.expected_reward?.value}
            </AppText>
          </View>
        </View>
        <View
          style={[
            styles.valueContainer,
            styles.moneyContainer,
            styles.rowContainer,
            {
              backgroundColor: '#0fa97f',
              marginHorizontal: 16,
              marginTop: 8,
              paddingVertical: 8,
              alignItems: 'center',
            },
          ]}
        >
          <AppText style={[styles.title, { color: '#dcf9f1', marginRight: 12 }]}>
            {data?.total_income?.label}
          </AppText>
          <AppText semiBold style={[styles.value, { color: Colors.primary5 }]}>
            {data?.total_income?.value}
          </AppText>
        </View>
        {html ? (
          <View style={styles.htmlContainer}>
            <HTMLView html={html} />
          </View>
        ) : null}
      </View>
    </View>
  );
});

export default OverviewCoreAgent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  boxContainer: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    paddingTop: 12,
    paddingBottom: 16,
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  valueContainer: {
    flex: 1,
  },
  chart: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  dashedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
    marginVertical: 8,
  },
  dashedCircle: {
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    backgroundColor: Colors.neutral5,
    position: 'absolute',
  },
  moneyContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  htmlContainer: { marginTop: 8, paddingHorizontal: 16 },
});
