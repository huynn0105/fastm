import {
  DeviceEventEmitter,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import HeaderSection from './HeaderSection';
import ListButtonFilter from './ListButtonFilter';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import IconUpDown from './IconUpDown';
import { ICON_PATH } from '../../../assets/path';
import ListDetailChart from './ListDetailChart';
import { useDispatch } from 'react-redux';
import {
  getExperienceChart,
  getWorkingChart,
} from '../../../redux/actions/actionsV3/collaboratorAction';
import { useCallback } from 'react';
import moment from 'moment';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import PieChart from '../../../componentV3/PieChart/PieChart';
import { formatNumber } from '../../../utils/Utils';
import AnimateNumber from '../../../componentV3/AnimateNumber/AnimateNumber';
import { DATA_PIE_EMPTY } from '../Collaborator.constants';
import DetailLevelUp from './DetailLevelUp';

const WorkingContent = memo((props) => {
  const { myUser, userId, userInfo, onLayout } = props;

  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const [type, setType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const typeRef = useRef(type);

  const dataList = useMemo(() => {
    const dbData = data?.list?.map((item, index) => {
      const percent = Number(item?.percentage || 0).toFixed(0);
      const percentGrowth = Number(item?.percent_growth || 0);
      return {
        background: item?.background,
        title: `title-${index}`,
        color: item?.background,
        value: item?.num_of_type,
        key: `pie-${index}`,
        statusGrowth: percentGrowth === 0 ? null : percentGrowth > 0 ? 'up' : 'down',
        salesGrowth: Math.abs(percentGrowth),
        currentGrowth: Math.abs(percent),
        name: item?.type_name,
      };
    });

    return dbData;
  }, [data?.list]);

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
  const onChangeType = useCallback((_type) => {
    pieRef?.current?.focus();
    setType(_type);
  }, []);

  const onOpenLink = useCallback((item) => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${item?.url}&title=${item?.title}`,
    );
  }, []);

  const onGetData = useCallback(() => {
    setIsLoading(true);
    dispatch(
      getWorkingChart(
        userId || myUser?.uid,
        type,
        moment().format('YYYY-MM'),
        // '2023-10',
        (isSuccess, result) => {
          typeRef.current = type;
          setIsLoading(false);
          if (isSuccess) {
            setData(result);
          }
        },
      ),
    );
  }, [dispatch, userId, myUser?.uid, type]);

  useEffect(() => {
    if ((userId && userInfo) || !userId) {
      onGetData();
      DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
      return () => {
        DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
      };
    }
  }, [myUser?.uid, onGetData, userId, userInfo]);

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

  const total = useMemo(() => Number(data?.total?.num_of_type || 0), [data?.total?.num_of_type]);
  const totalPercent = useMemo(
    () => Number(data?.total?.percent_growth || 0),
    [data?.total?.percent_growth],
  );

  return (
    <>
      <HeaderSection
        title={`Hoạt động của ${userId ? userInfo?.user?.fullName || '' : 'bạn'}`}
        onLayout={onLayout}
        keyLayout={'WorkingContent'}
        elementNote={
          data?.note?.length && (
            <View style={{ maxWidth: 275 }}>
              {data?.note?.map((item, index) => {
                if (!item?.length) return null;
                return (
                  <View key={index} style={[styles.elementContainer, index && { marginTop: 12 }]}>
                    <AppText style={styles.note}>- </AppText>
                    <AppText style={[styles.note, { flexShrink: 1 }]}>
                      {item?.map((it) => (
                        <AppText {...it} style={[styles.note, it?.color && { color: it?.color }]}>
                          {it?.text}
                        </AppText>
                      ))}
                    </AppText>
                  </View>
                );
              })}
            </View>
          )
        }
      />
      <ListButtonFilter
        data={data?.filter}
        disabled={isLoading}
        onPress={onChangeType}
        isLoading={isLoading}
      />
      <View style={styles.cardContainer}>
        <View style={styles.chartInfoContainer}>
          <View style={styles?.chartContainer}>
            <PieChart
              ref={pieRef}
              pieStyle={styles.chart}
              outerRadius={55}
              innerRadius={40}
              data={pieData}
              animate
              padAngle={0.02}
            />
            {isLoading ? null : (
              <>
                <AppText style={styles.totalValueChart} semiBold>
                  <AnimateNumber
                    style={styles.totalValueChart}
                    semiBold
                    value={total}
                    time={1500}
                    formatter={(value) => {
                      return formatNumber(value.toFixed(0));
                    }}
                  />
                  <AppText style={styles.totalUnitChart} regular>
                    {`\n`}
                    {`hồ sơ`}
                  </AppText>
                </AppText>
              </>
            )}
          </View>
          <View style={styles.infoContainer}>
            <AppText style={styles.infoTitle}>{data?.total?.type_name}</AppText>
            <View style={styles.infoValueContainer}>
              <AppText semiBold style={styles.infoValue}>
                {formatNumber(total)}
              </AppText>
              {totalPercent ? (
                <IconUpDown up={totalPercent > 0} value={Math.abs(totalPercent)} />
              ) : null}
            </View>
          </View>
        </View>
        {data?.list?.length ? (
          <AppText style={[styles.infoTitle, { marginTop: 16 }]}>
            Phân loại hồ sơ theo nhóm dự án
          </AppText>
        ) : null}
        <ListDetailChart
          data={dataList}
          unit={'hồ sơ'}
          onPressItem={onPressItem}
          type={typeRef.current}
        />
        <View
          style={{
            backgroundColor: Colors.blue6,
            borderRadius: 8,
            marginTop: 18,
            paddingHorizontal: 12,
          }}
        >
          {/* {data?.url_post && data?.url_post?.length
            ? data?.url_post?.map((item, index) => {
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
              })
            : null} */}
        </View>
      </View>
    </>
  );
});

export default WorkingContent;

export const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.primary5,
    marginTop: 8,
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
    marginTop: 4,
    justifyContent: 'space-between',
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
    color: Colors.blue5,
    lineHeight: 30,
    fontSize: 18,
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
