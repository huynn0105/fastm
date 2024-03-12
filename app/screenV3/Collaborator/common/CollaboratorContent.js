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
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import IconUpDown from './IconUpDown';
import ListDetailChart from './ListDetailChart';
import { useDispatch } from 'react-redux';
import { getCollaboratorChart } from '../../../redux/actions/actionsV3/collaboratorAction';
import { useCallback } from 'react';
import moment from 'moment';
import { formatNumber } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import ListButtonFilter from './ListButtonFilter';
import PieChart from '../../../componentV3/PieChart/PieChart';
import AnimateNumber from '../../../componentV3/AnimateNumber/AnimateNumber';
import { DATA_PIE_EMPTY } from '../Collaborator.constants';
import { ButtonFilter } from './FilterCollaborator';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import WheelPick from './WheelPick';

const CollaboratorContent = memo((props) => {
  const { myUser, level, userId, userInfo, onLayout } = props;

  const dispatch = useDispatch();

  const bottomSheetRef = useRef();
  const bottomSheetData = useRef({});
  const pickerId = useRef();

  const [data, setData] = useState({});

  const [tab, setTab] = useState('all');
  const [idLevelSelected, setIdLevelSelected] = useState('6');
  const [idTypeSelected, setIdTypeSelected] = useState('sales');

  const [isLoading, setIsLoading] = useState(true);
  const userLevel = useMemo(() => level?.level, [level?.level]);

  const dataList = useMemo(() => {
    const dbData = data?.collaborators?.data?.collaboratorList.map((item, index) => ({
      ...item,
      title: `title-${index}`,
      color: item?.background,
      value: item?.wallet,
      key: `pie-${index}`,
    }));

    return dbData;
  }, [data?.collaborators?.data?.collaboratorList]);

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

  const onOpenLink = useCallback((item) => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${item?.url}&title=${item?.title}`,
    );
  }, []);

  const onGetData = useCallback(() => {
    if (!userLevel?.length || !myUser?.uid) return;
    setIsLoading(true);
    dispatch(
      getCollaboratorChart(
        userId || myUser?.uid,
        userLevel,
        moment().format('YYYY-MM'),
        tab,
        idLevelSelected,
        idTypeSelected,
        (isSuccess, result) => {
          setIsLoading(false);
          if (isSuccess) {
            setData(result);
          }
        },
      ),
    );
  }, [userLevel, myUser?.uid, dispatch, userId, tab, idLevelSelected, idTypeSelected]);

  const onOpenBottomSheet = useCallback(
    (key) => {
      const bottomSheetTitle = key === 'level' ? 'Tầng cộng tác viên' : 'Tình trạng cộng tác viên';
      bottomSheetData.current.key = key;
      if (key === 'level') {
        if (data?.is_not_head) {
          bottomSheetData.current.data = (data?.filter_level).slice(0, -1);
        } else {
          bottomSheetData.current.data = data?.filter_level;
        }
        bottomSheetData.current.idSelected = idLevelSelected ?? data?.filter_level.at(0).id;
      }
      if (key === 'type') {
        bottomSheetData.current.data = data?.filter_type;
        bottomSheetData.current.idSelected = idTypeSelected ?? data?.filter_type.at(0).id;
      }

      bottomSheetRef.current.open(bottomSheetTitle);
    },
    [data?.filter_level, data?.filter_type, data?.is_not_head, idLevelSelected, idTypeSelected],
  );

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current.close();
  }, []);

  const onSelected = useCallback((id) => {
    pickerId.current = id;
  }, []);
  const onSubmit = useCallback(
    (id) => {
      if (bottomSheetData.current.key === 'level') {
        setIdLevelSelected(pickerId.current);
      } else {
        setIdTypeSelected(pickerId.current);
      }
      closeBottomSheet();
    },
    [closeBottomSheet],
  );

  useEffect(() => {
    if ((userId && userInfo) || !userId) {
      onGetData();
      DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
      return () => {
        DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
      };
    }
  }, [onGetData, userId, userInfo]);

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

  const titleLevelFilter: String = useMemo(() => {
    return data?.filter_level?.find((item) => item?.id === idLevelSelected).title;
  }, [data?.filter_level, idLevelSelected]);

  const titleTypeFilter: String = useMemo(() => {
    return data?.filter_type?.find((item) => item?.id === idTypeSelected).title;
  }, [data?.filter_type, idTypeSelected]);

  return (
    <>
      <HeaderSection
        title={`Cộng tác viên của ${userId ? userInfo?.user?.fullName || '' : 'bạn'}`}
        onLayout={onLayout}
        keyLayout={'CollaboratorContent'}
      />

      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        <ButtonFilter
          keyData={'level'}
          style={{ marginRight: 8 }}
          placeholder={'Tầng CTV'}
          value={titleLevelFilter}
          onPress={onOpenBottomSheet}
          disabled={isLoading}
        />
        <ButtonFilter
          keyData={'type'}
          placeholder={'Tình trạng CTV'}
          value={titleTypeFilter}
          onPress={onOpenBottomSheet}
          disabled={isLoading}
        />
      </View>
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.infoValueContainer,
            {
              marginTop: 0,
              paddingBottom: 12,
              paddingHorizontal: 16,
            },
          ]}
        >
          <View
            style={[
              styles.boxTotalContainer,
              {
                backgroundColor: '#ece4f1',
                marginRight: 19,
              },
            ]}
          >
            <AppText style={styles.totalUnitChart}>Tổng số CTV</AppText>
            <AppText semiBold style={[styles.infoValue, { marginTop: 2, lineHeight: 24 }]}>
              {formatNumber(data?.collaborator)} người
            </AppText>
          </View>
          <View
            style={[
              styles.boxTotalContainer,
              {
                backgroundColor: '#fdecd8',
              },
            ]}
          >
            <AppText style={styles.totalUnitChart}>
              % {data?.collaborators?.data?.name || ''}
            </AppText>
            <AppText
              semiBold
              style={[styles.infoValue, { marginTop: 2, lineHeight: 24, color: Colors.sixOrange }]}
            >
              {data?.raito || 0}%
            </AppText>
          </View>
        </View>
        <ListButtonFilter
          data={data?.filter}
          disabled={isLoading}
          itemBackgroundColor={Colors.neutral5}
          itemTextColor={Colors.gray5}
          style={{ marginLeft: 16, marginTop: 0, marginBottom: 0 }}
          onPress={(value) => {
            pieRef?.current?.focus();
            setTab(value);
          }}
        />
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
                  value={data?.collaborators?.data?.wallet || 0}
                  time={1500}
                  formatter={(value) => {
                    return formatNumber(value.toFixed(0));
                  }}
                />
                <AppText style={styles.totalUnitChart} regular>
                  {`\n`}
                  {'người'}
                </AppText>
              </AppText>
            )}
          </View>
          <View style={styles.infoContainer}>
            <AppText style={styles.infoTitle}>{data?.collaborators?.data?.name || ''}</AppText>
            <View style={styles.infoValueContainer}>
              <AppText semiBold style={styles.infoValue}>
                {formatNumber(data?.collaborators?.data?.wallet || 0)} người
              </AppText>
              {data?.collaborators?.data?.salesGrowth ? (
                <IconUpDown
                  up={data?.collaborators?.data?.statusGrowth === 'up'}
                  value={data?.collaborators?.data?.salesGrowth}
                />
              ) : null}
            </View>
            <AppText
              style={[
                styles.infoTitle,
                {
                  marginTop: 4,
                },
              ]}
            >{`${
              data?.collaborators?.data?.ratio ? `~ ${data?.collaborators?.data?.ratio}` : 0
            }% / tổng CTV`}</AppText>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          {data?.collaborators?.data?.collaboratorList?.length ? (
            <AppText style={[styles.infoTitle, { marginTop: 16 }]}>
              Tỉ trọng {data?.collaborators?.data?.name} theo tầng
            </AppText>
          ) : null}
          <ListDetailChart
            data={dataList}
            unit={'người'}
            onPressItem={onPressItem}
            type={idLevelSelected + tab}
          />
          <View
            style={{
              backgroundColor: Colors.blue6,
              borderRadius: 8,
              marginTop: 18,
              paddingHorizontal: 12,
            }}
          >
            {data?.url_post && data?.url_post?.length
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
              : null}
          </View>
        </View>
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <WheelPick
            data={bottomSheetData.current?.data ?? []}
            onSelected={onSelected}
            onPressSelected={(id) => {
              onSelected(id);
              onSubmit();
            }}
            initIdSelected={bottomSheetData.current?.idSelected}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        onPressDone={onSubmit}
      />
    </>
  );
});

export default CollaboratorContent;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.primary5,
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 32,
    overflow: 'hidden',
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
    marginTop: 16,
    paddingHorizontal: 16,
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
    lineHeight: 24,
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
  boxTotalContainer: {
    flex: 1,

    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});
