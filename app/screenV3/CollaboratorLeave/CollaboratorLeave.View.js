import { Image, ScrollView, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import ButtonText from '../../common/ButtonText';
import ListCollaboratorLeave from './components/ListCollaboratorLeave';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { useMemo } from 'react';
import DigitelClient from '../../network/DigitelClient';
import { ButtonFilter } from '../Collaborator/common/FilterCollaborator';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ListCheckBox from '../Customer/common/ListCheckBox';
import ViewPager from '@react-native-community/viewpager';
import InfoLeave from './components/InfoLeave';
import Loading from '../../componentV3/LoadingModal';
import { useSelector } from 'react-redux';
import ModalMTradeMessage from '../MTrade/common/ModalMTradeMessage';
import { showDevAlert } from '../../utils/UIUtils';

const INDEX_TAB_NOT_WORKING = 3;

const CollaboratorLeave = memo((props) => {
  const initIndex = Number(props?.navigation?.state?.params?.params?.initIndex || 0);

  const viewPagerRef = useRef();
  const mtradeMessageRef = useRef();

  const isFetchingSingleChat = useSelector((state) => state?.isFetchingSingleChat);

  const [index, setIndex] = useState(initIndex);
  const [routes] = useState([
    { key: 'working', title: 'Có hoạt động' },
    { key: 'follow', title: 'Cần chú ý' },
    { key: 'can_leave', title: 'Có thể rời đi' },
    { key: 'can_remove', title: 'Có thể xóa' },
    { key: 'departed', title: 'Vừa rời đi' },
  ]);
  const [dataFilter, setDataFilter] = useState({});
  const [filters, setFilters] = useState({ grade: [1] });

  const bottomSheetRef = useRef();
  const bottomSheetInfoLeaveRef = useRef();
  const dataSelect = useRef({});
  const idSelectedTemp = useRef();

  const onOpenBottomSheet = useCallback(
    (key) => {
      const arrData = dataFilter?.[key];

      if (!arrData) return;

      let title = '';

      const newList = [];

      for (let i = 0; i < arrData?.length; i++) {
        newList.push({
          id: arrData[i]?.level,
          title: arrData[i]?.title,
        });
      }

      switch (key) {
        case 'grade':
          title = 'Lọc cộng tác viên';

          break;
        case 'level':
          title = 'Lọc danh hiệu';

          break;
      }

      dataSelect.current = {
        key,
        data: newList,
        idSelected: filters?.[key],
      };

      bottomSheetRef.current.open(title);
    },
    [dataFilter, filters],
  );

  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  const onCheckboxSelected = useCallback((ids) => {
    idSelectedTemp.current = ids;
  }, []);

  const onConfirmSelected = useCallback(() => {
    onCloseBottomSheet();
    if (idSelectedTemp?.current) {
      setFilters((prev) => {
        const newState = { ...prev };
        newState[dataSelect.current?.key] = idSelectedTemp?.current;
        return newState;
      });
    }
  }, [onCloseBottomSheet]);

  const onPageSelected = useCallback(({ nativeEvent: { position } }) => {
    setIndex(position);
  }, []);

  const valueFilterCTV = useMemo(() => {
    if (filters?.grade?.length) {
      const levelFilterSort = filters?.grade?.sort();
      let value = '';

      if (levelFilterSort?.length === dataFilter?.grade?.length) {
        value = 'Tất cả tầng CTV';
      } else {
        for (let i = 0; i < levelFilterSort?.length; i++) {
          const levelName = levelFilterSort?.[i];
          const levelTitle = dataFilter?.grade?.find((item) => item?.level === levelName)?.title;
          if (i === 0) {
            value = levelTitle;
          } else if (levelTitle === 'CTV còn lại') {
            value = `${value}, >6`;
          } else {
            const split = levelTitle.split(' ');
            value = value = `${value}, ${split[1]}`;
          }
        }
      }
      return value;
    }
    return null;
  }, [dataFilter?.grade, filters?.grade]);

  const valueFilterLevel = useMemo(() => {
    if (filters?.level?.length) {
      const levelFilterSort = filters?.level?.sort();
      let value = '';

      if (levelFilterSort?.length === dataFilter?.level?.length) {
        value = 'Tất cả danh hiệu';
      } else {
        for (let i = 0; i < levelFilterSort?.length; i++) {
          const levelName = levelFilterSort?.[i];
          const levelTitle = dataFilter?.level?.find((item) => item?.level === levelName)?.title;
          if (i === 0) {
            value = levelTitle;
          } else {
            value = value = `${value}, ${levelTitle}`;
          }
        }
      }
      return value;
    }
    return null;
  }, [dataFilter?.level, filters?.level]);

  const renderFilter = useCallback(() => {
    return (
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <ButtonFilter
          keyData={'grade'}
          style={{ marginRight: 8, backgroundColor: Colors.neutral5 }}
          placeholder={'Lọc cấp CTV'}
          value={valueFilterCTV}
          onPress={onOpenBottomSheet}
          disabled={false}
        />
        <ButtonFilter
          keyData={'level'}
          style={{ backgroundColor: Colors.neutral5 }}
          placeholder={'Lọc danh hiệu'}
          value={valueFilterLevel}
          onPress={onOpenBottomSheet}
          disabled={false}
        />
      </View>
    );
  }, [onOpenBottomSheet, valueFilterCTV, valueFilterLevel]);

  const WorkingRoute = useCallback(
    () => (
      <View key={'working'}>
        <ListCollaboratorLeave navigation={props?.navigation} type={'working'} />
      </View>
    ),
    [],
  );
  const FollowRoute = useCallback(
    () => (
      <View key={'follow'}>
        <ListCollaboratorLeave
          navigation={props?.navigation}
          renderFilter={renderFilter}
          type={'follow'}
          filters={filters}
        />
      </View>
    ),
    [filters, renderFilter],
  );
  const CanLeaveRoute = useCallback(
    () => (
      <View key={'can_leave'}>
        <ListCollaboratorLeave
          navigation={props?.navigation}
          renderFilter={renderFilter}
          type={'can_leave'}
          filters={filters}
        />
      </View>
    ),
    [filters, renderFilter],
  );
  const NotWorkingRoute = useCallback(
    () => (
      <View key={'can_remove'}>
        <ListCollaboratorLeave
          navigation={props?.navigation}
          renderFilter={renderFilter}
          type={'can_remove'}
          filters={filters}
        />
      </View>
    ),
    [],
  );
  const LeaveRoute = useCallback(
    () => (
      <View key={'departed'}>
        <ListCollaboratorLeave
          navigation={props?.navigation}
          renderFilter={renderFilter}
          type={'departed'}
          filters={filters}
        />
      </View>
    ),
    [filters, renderFilter],
  );

  const renderTabBar = useCallback(
    (propsTab) => {
      return (
        <View>
          <ScrollView
            horizontal
            style={{ marginHorizontal: 12, marginTop: 16 }}
            showsHorizontalScrollIndicator={false}
          >
            {routes?.map((item, idx) => {
              const isActive = index === idx;
              return (
                <View style={{ alignItems: 'center' }}>
                  <ButtonText
                    title={item?.title}
                    onPress={() => {
                      setIndex(idx);
                      viewPagerRef?.current?.setPage(idx);
                    }}
                    height={32}
                    style={{ marginHorizontal: 4, paddingHorizontal: 12 }}
                    buttonColor={isActive ? Colors.primary2 : Colors.primary5}
                    titleColor={isActive ? Colors.primary5 : Colors.gray5}
                    borderColor={isActive ? Colors.primary2 : Colors.primary5}
                  />
                  {isActive ? (
                    <Image
                      source={ICON_PATH.arrow}
                      style={{
                        width: 47,
                        height: 12,
                      }}
                    />
                  ) : null}
                </View>
              );
            })}
          </ScrollView>
        </View>
      );
    },
    [index, routes],
  );

  const onGetFilterCollaboratorLeave = useCallback(async () => {
    try {
      const res = await DigitelClient.getFilterCollaboratorLeave();
      if (res?.data?.data) {
        setDataFilter(res?.data?.data);
      }
    } catch (error) {
      console.log('\u001B[36m -> file: CollaboratorLeave.View.js -> line 106 -> error', error);
    }
  }, []);

  const onCheckDeletingCollaborator = useCallback(async () => {
    try {
      const res = await DigitelClient.checkDeletingCollaborator();
      if (res.data.status) {
        mtradeMessageRef.current.open({
          image: IMAGE_PATH.mascotWait2,
          titleColor: Colors.blue3,
          title: 'Đang xóa cộng tác viên',
          content: res.data?.message || 'Đang xóa cộng tác viên',
          actions: [
            {
              title: 'Đã hiểu và quay lại',
              onPress: () => {
                mtradeMessageRef.current.close();
              },
            },
          ],
        });
      }
    } catch (error) {
      console.log(`\u001B[34m -> file: CollaboratorLeave.View.js:302 -> error:`, error.message);
    }
  }, []);

  useEffect(() => {
    onGetFilterCollaboratorLeave();
  }, [onGetFilterCollaboratorLeave]);

  useEffect(() => {
    setTimeout(() => {
      viewPagerRef?.current?.setPage(initIndex);
    });
  }, [initIndex]);

  useEffect(() => {
    if (index === INDEX_TAB_NOT_WORKING) {
      onCheckDeletingCollaborator();
    }
  }, [index, onCheckDeletingCollaborator]);

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>
        {`Cộng tác viên của bạn có quyền tự rời đi nếu họ không nhận được sự hỗ trợ tối thiểu. `}
        <AppText
          style={[styles.text, { color: Colors.primary2 }]}
          bold
          onPress={() => bottomSheetInfoLeaveRef?.current?.open()}
        >
          Xem chi tiết >>>
        </AppText>
      </AppText>
      {renderTabBar()}
      <ViewPager ref={viewPagerRef} style={styles.viewPager} onPageSelected={onPageSelected}>
        {WorkingRoute()}
        {FollowRoute()}
        {CanLeaveRoute()}
        {NotWorkingRoute()}
        {LeaveRoute()}
      </ViewPager>

      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ListCheckBox
            data={dataSelect.current.data}
            onCheckboxSelected={onCheckboxSelected}
            hideButtonAll
            initIdsSelected={dataSelect.current?.idSelected}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        onPressDone={onConfirmSelected}
      />
      <BottomActionSheet
        ref={bottomSheetInfoLeaveRef}
        headerText={'Điều kiện để rời đi'}
        render={() => (
          <InfoLeave onCloseBottomSheet={() => bottomSheetInfoLeaveRef?.current?.close()} />
        )}
        canClose={true}
        haveCloseButton={false}
      />
      <Loading visible={isFetchingSingleChat} />
      <ModalMTradeMessage ref={mtradeMessageRef} />
    </View>
  );
});

export default CollaboratorLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  text: {
    marginHorizontal: 16,
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  viewPager: {
    flex: 1,
  },
});
