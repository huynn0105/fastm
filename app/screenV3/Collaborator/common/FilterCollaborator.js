import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import ListCheckBox from '../../Customer/common/ListCheckBox';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import SearchCollaborator from './SearchCollaborator';
import WheelPick from './WheelPick';
import { useDispatch } from 'react-redux';
import HeaderSection from './HeaderSection';
import { Pressable } from 'react-native';
import { getFilterCollaborator } from '../../../redux/actions/actionsV3/collaboratorAction';
import { debounce } from 'lodash';
import { showDevAlert } from '../../../utils/UIUtils';

const FilterCollaborator = memo((props) => {
  const { myUser, level, onChangeFilters, navigation } = props;

  const userLevel = useMemo(() => level?.level, [level?.level]);

  const dispatch = useDispatch();

  const bottomSheetRef = useRef();
  const dataSelect = useRef({});
  const idSelectedTemp = useRef();
  const typeSelect = useRef('');

  const [data, setData] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [tabSelected, setTabSelected] = useState('all');
  const [filters, setFilters] = useState({
    level: ['1'],
    sort: 'highComm',
    work: 'online',
    tabs: 'all',
    keyword: '',
  });

  const listTab = useMemo(() => {
    if (!data?.tabs) return [];
    const ids = Object.keys(data?.tabs || {});
    const values = Object.values(data?.tabs || {});

    const newList = [];

    for (let i = 0; i < ids?.length; i++) {
      newList.push({
        id: ids[i],
        title: values[i],
        isSelected: ids[i] === tabSelected,
      });
    }

    return newList;
  }, [data?.tabs, tabSelected]);

  const valueFilterCTV = useMemo(() => {
    if (filters?.level?.length) {
      const levelFilterSort = filters?.level?.sort();
      let value = '';

      if (levelFilterSort?.length === Object.keys(data?.level || {})?.length) {
        value = 'Tất cả tầng CTV';
      } else {
        for (let i = 0; i < levelFilterSort?.length; i++) {
          const levelName = levelFilterSort?.[i];
          const levelTitle = data?.level?.[levelName];
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
  }, [data?.level, filters?.level]);

  const renderTab = useCallback(
    (key) => (item) => {
      const onPressTab = () => {
        setTabSelected(item?.id);
        setFilters((prev) => {
          const newState = { ...prev, [key]: item?.id };
          if (newState?.keyword?.length) {
            newState.keyword = '';
          }

          return newState;
        });
      };

      return (
        <TouchableOpacity
          onPress={onPressTab}
          key={item?.id}
          style={[
            styles.itemTabContainer,
            item?.isSelected && { backgroundColor: Colors.primary2 },
          ]}
        >
          <AppText
            medium={item?.isSelected}
            style={[
              styles.itemTabTitle,
              { color: item?.isSelected ? Colors.primary5 : Colors.gray5 },
            ]}
          >
            {item?.title}
          </AppText>
        </TouchableOpacity>
      );
    },
    [],
  );

  const onOpenBottomSheet = useCallback(
    (key) => {
      const objectData = data?.[key];

      if (!objectData) return;

      let title = '';

      const ids = Object.keys(objectData);
      const values = Object.values(objectData);

      const newList = [];

      for (let i = 0; i < ids?.length; i++) {
        newList.push({
          id: ids[i],
          title: values[i],
        });
      }

      switch (key) {
        case 'level':
          title = 'Lọc cộng tác viên';
          typeSelect.current = 'RADIO';

          break;
        case 'work':
          title = 'Hoạt động bán hàng';
          typeSelect.current = 'WHEEL';
          break;
        case 'sort':
          title = 'Thứ tự hiện thị CTV';
          typeSelect.current = 'WHEEL';
          break;
      }

      dataSelect.current = {
        key,
        data: newList,
        idSelected: filters?.[key],
      };

      bottomSheetRef.current.open(title);
    },
    [data, filters],
  );

  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current.close();
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
        if (newState?.keyword?.length) {
          newState.keyword = '';
        }
        return newState;
      });
    }
  }, [onCloseBottomSheet]);

  const onSelectedAndCloseBottomSheet = useCallback(
    (ids) => {
      idSelectedTemp.current = ids;
      onConfirmSelected();
    },
    [onConfirmSelected],
  );

  const onChangeText = useCallback(
    (value = '') => {
      setFilters((prev) => {
        if (value !== prev?.keyword) {
          setTabSelected('all');
          return {
            ...prev,
            level: Object.keys(data?.level || {}),
            work: 'online',
            sort: 'highComm',
            tabs: 'all',
            keyword: value,
          };
        }
        return prev;
      });
    },
    [data?.level],
  );

  const onCollaboratorPending = useCallback(() => {
    navigation.navigate('CollaboratorPending', {
      countPending: data?.userPending,
      onSubtractUserPending: () => {
        setData((prev) => ({ ...prev, userPending: prev?.userPending - 1 }));
      },
    });
  }, [data?.userPending, navigation]);

  const onGetData = useCallback(() => {
    if (!userLevel || !myUser?.uid) return;
    setIsLoading(true);
    dispatch(
      getFilterCollaborator(userLevel, myUser?.uid, (isSuccess, result) => {
        setIsLoading(false);
        if (isSuccess) {
          setData(result);
        }
      }),
    );
  }, [dispatch, myUser?.uid, userLevel]);

  useEffect(() => {
    onGetData();
    const sub = navigation?.addListener('didFocus', () => {
      onGetData();
    });
    return () => {
      sub?.remove();
    };
  }, [onGetData]);

  useEffect(() => {
    onChangeFilters?.(filters);
  }, [filters, onChangeFilters]);

  return (
    <>
      <HeaderSection
        title={'Danh sách cộng tác viên'}
        style={styles.headerContainer}
        rightView={
          <Pressable onPress={() => onOpenBottomSheet('sort')} style={styles.sortContainer}>
            <AppText style={styles.sortTitle}>Sắp xếp</AppText>
            <Image source={ICON_PATH.sort} style={styles.sortIcon} />
          </Pressable>
        }
      />
      <SearchCollaborator onChangeText={onChangeText} value={filters?.keyword} />
      <View style={styles.container}>
        <View style={styles.buttonFilterModalContainer}>
          <ButtonFilter
            keyData={'level'}
            style={{ marginRight: 8 }}
            placeholder={'Cấp CTV'}
            value={valueFilterCTV}
            onPress={onOpenBottomSheet}
            disabled={isLoading}
          />
          <ButtonFilter
            keyData={'work'}
            placeholder={'Trạng thái'}
            onPress={onOpenBottomSheet}
            value={data?.work?.[filters?.work]}
            disabled={isLoading}
          />
        </View>
        {Number(data?.userPending) ? (
          <ButtonFilter
            onPress={onCollaboratorPending}
            style={{ marginTop: 8 }}
            icon={ICON_PATH.clock4}
            placeholder={
              <AppText style={{ color: Colors.gray5 }}>
                Có
                <AppText semiBold style={{ color: Colors.gray1 }}>
                  {` ${data?.userPending} `}
                </AppText>
                người muốn trở thành CTV của bạn
              </AppText>
            }
          />
        ) : null}
        <ScrollView
          style={styles.listTabContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {listTab?.map(renderTab('tabs'))}
        </ScrollView>
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() =>
          typeSelect.current === 'RADIO' ? (
            <ListCheckBox
              data={dataSelect.current.data}
              onCheckboxSelected={onCheckboxSelected}
              hideButtonAll
              initIdsSelected={dataSelect.current?.idSelected}
            />
          ) : (
            <WheelPick
              data={dataSelect.current.data}
              onSelected={onCheckboxSelected}
              onPressSelected={onSelectedAndCloseBottomSheet}
              initIdSelected={dataSelect.current?.idSelected}
            />
          )
        }
        canClose={true}
        haveCloseButton={true}
        onPressDone={onConfirmSelected}
      />
    </>
  );
});

export default FilterCollaborator;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  buttonFilterModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTabContainer: {
    marginTop: 8,
  },
  itemTabContainer: {
    borderRadius: 18,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 12,
    marginRight: 8,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTabTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  headerContainer: {
    justifyContent: 'space-between',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  sortTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    marginRight: 4,
  },
});

export const ButtonFilter = memo((props) => {
  const { style, placeholder, value, onPress, keyData, icon, disabled, textStyle } = props;

  const onPressButton = useCallback(() => {
    onPress?.(keyData);
  }, [keyData, onPress]);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPressButton}
      style={[stylesButtonFilter.container, style]}
    >
      <Image style={stylesButtonFilter.icon} source={icon || ICON_PATH.iconFilter} />
      <AppText
        numberOfLines={1}
        style={[stylesButtonFilter.text, textStyle, !!value && { color: Colors.gray1 }]}
        semiBold={!!value}
      >
        {value || placeholder}
      </AppText>
    </TouchableOpacity>
  );
});

const stylesButtonFilter = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray4,
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray11,
    flex: 1,
  },
});
