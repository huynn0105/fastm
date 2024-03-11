import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SH, SW } from '../../../constants/styles';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { LayoutAnimation } from 'react-native';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { LIST_TYPE_NOTIFICATION, TAB_TYPE } from '../Notification.constants';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterNotification } from '../../../redux/actions/actionsV3/notificationAction';
import ButtonCheckBox from '../../Customer/common/ButtonCheckBox';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import ListCheckBox from '../../Customer/common/ListCheckBox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const onLayoutAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      200,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity,
    ),
  );
};

const FilterNotification = memo((props) => {
  const {
    onChangeIndex,
    parentIndex,
    category,
    onChangeFilter,
    onChangeKeySearch,
    // filters,
    onResetFilters,
    keyword,
  } = props;

  const dispatch = useDispatch();

  const isFocusInput = useRef(false);
  const bottomSheetRef = useRef(null);
  const itemCheckboxModal = useRef({});
  const idsCheckboxModal = useRef([]);

  const filterNotification = useSelector(
    (state) => state?.notificationReducer?.filterNotification?.[category],
  );

  const [isShowOptionFilter, setIsShowOptionFilter] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [keySearch, setKeySearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterCondition, setFilterCondition] = useState({});

  const isFilter = useMemo(() => {
    return false;
  }, []);
  const dataMapSelected = useMemo(() => {
    let list;

    const tabKey = LIST_TYPE_NOTIFICATION.data[tabIndex].id;
    if (tabKey === TAB_TYPE.ALL) {
      list = filterNotification;
    } else {
      list = filterNotification.filter((item) => item?.key === tabKey);
    }

    return list?.map?.((item) => {
      const { key, data } = item;
      const valueSelected = filterCondition?.[key] || [];

      const newData = data?.map?.((it) => {
        return {
          ...it,
          isSelected: valueSelected?.includes?.(it?.id),
        };
      });

      return {
        ...item,
        data: newData,
      };
    });
  }, [filterCondition, filterNotification, tabIndex]);

  const dataTabMapSelected = useMemo(() => {
    const newObject = { ...LIST_TYPE_NOTIFICATION };

    newObject.data = newObject.data.map((item, index) => {
      return {
        ...item,
        title: `${item?.title || ''}`,
        isSelected: tabIndex === index,
      };
    });

    return newObject;
  }, [tabIndex]);

  const onFocusInput = useCallback(() => {
    onLayoutAnimation();
    setIsShowSearch(true);
    isFocusInput.current = true;
  }, []);

  const onBlurInput = useCallback(() => {
    isFocusInput.current = false;
  }, []);

  const onBackdropPress = useCallback(() => {
    if (isFocusInput.current) {
      Keyboard.dismiss();
      return;
    } else {
      onLayoutAnimation();
      setTabIndex(parentIndex);
      setIsShowSearch(false);
      setIsShowOptionFilter(false);
      setKeySearch(keyword);
    }
  }, [keyword, parentIndex]);

  const onSearchNotification = useCallback(() => {
    if (isFocusInput?.current) {
      Keyboard.dismiss();
    }
    onLayoutAnimation();
    setIsShowOptionFilter(false);
    setIsShowSearch(false);
    requestAnimationFrame(() => {
      onChangeIndex?.(tabIndex);
      const tabKey = LIST_TYPE_NOTIFICATION.data[tabIndex].id;
      onChangeFilter?.(tabKey, filterCondition);
      onChangeKeySearch?.(keySearch);
    });
  }, [filterCondition, keySearch, onChangeFilter, onChangeIndex, onChangeKeySearch, tabIndex]);
  const onClearInput = useCallback(() => {
    setKeySearch('');
    const disabledChange = isShowOptionFilter || isShowSearch;
    !disabledChange && onChangeKeySearch('');
  }, [isShowOptionFilter, isShowSearch, onChangeKeySearch]);
  const onPressRemoveFilterNotification = useCallback(() => {
    onLayoutAnimation();
    setIsShowOptionFilter(false);
    setIsShowSearch(false);
    onChangeIndex(0);
    setTabIndex(0);
    setFilterCondition({});
    onResetFilters();
    onClearInput();
  }, [onChangeIndex, onClearInput, onResetFilters]);
  const onPressFilterNotification = useCallback(() => {
    if (isFocusInput?.current) {
      Keyboard.dismiss();
    }
    onLayoutAnimation();
    setIsShowOptionFilter(false);
    setIsShowSearch(false);
    requestAnimationFrame(() => {
      onChangeIndex?.(tabIndex);
      const tabKey = LIST_TYPE_NOTIFICATION.data[tabIndex].id;
      onChangeKeySearch(keySearch);
      onChangeFilter(tabKey, filterCondition);
    });
  }, [filterCondition, keySearch, onChangeFilter, onChangeIndex, onChangeKeySearch, tabIndex]);
  const onPressAppendFilter = useCallback(() => {
    onLayoutAnimation();
    setIsShowOptionFilter((prevState) => !prevState);
  }, []);
  const keyExtractor = useCallback(() => {}, []);

  //!---------------------------------------------------------------------
  const onPressItemOpenCheckBox = useCallback(
    (item) => {
      itemCheckboxModal.current = item;

      if (item?.key === TAB_TYPE.PAGE) {
        const tabKey = LIST_TYPE_NOTIFICATION.data[tabIndex].id;

        if (tabKey === TAB_TYPE.INSURANCE || TAB_TYPE.AFFILIATE) {
          itemCheckboxModal.current.data = item?.data?.filter((it) => it?.type === tabKey);
        }
      }
      bottomSheetRef.current.open(`Lọc ${itemCheckboxModal.current.subTitle}`);
    },
    [tabIndex],
  );

  const renderItemOptionFilter = useCallback(({ item, index }) => {
    switch (item.key) {
      case TAB_TYPE.AFFILIATE:
      case TAB_TYPE.INSURANCE:
        const numCheckboxSelected = item?.data?.filter?.((it) => it?.isSelected)?.length;
        return (
          <>
            <AppText style={styles.title}>{item?.title}</AppText>
            <ButtonCheckBox
              placeholder={'Chọn tên sản phẩm'}
              value={numCheckboxSelected > 0 ? `Đã chọn ${numCheckboxSelected} sản phẩm` : ''}
              onPress={() => onPressItemOpenCheckBox(item)}
            />
            <View style={styles.line} />
          </>
        );
      default:
        return (
          <>
            <AppText style={styles.title}>{item?.title}</AppText>
            <View style={[styles.listWrapper, { paddingTop: SH(8) }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  style={[styles.listTypeCustomerContainer, styles.listTypeCustomerActiveContainer]}
                >
                  {item?.data?.map?.(renderItem(item?.key))}
                </View>
              </ScrollView>
            </View>
            <View
              style={[
                styles.line,
                {
                  marginTop: SH(6),
                },
              ]}
            />
          </>
        );
    }
  }, []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyText}>Không có dữ liệu</AppText>
        <AppText
          onPress={() => {
            // setIsLoading(true);
            // onGetListFilterCustomer();
          }}
          style={[styles.emptyText, { color: Colors.primary2 }]}
        >
          Nhấn để tải lại
        </AppText>
      </View>
    );
  }, [isLoading]);

  const onPressItem = useCallback(
    (item, index, key) => {
      if (key === 'tab') {
        const disabledChangeParentIndex = isShowOptionFilter || isShowSearch;
        setTabIndex((prevState) => {
          let newState = index;
          if (prevState === index) {
            newState = 0;
            setFilterCondition({});
          } else {
            // const tabKey = LIST_TYPE_NOTIFICATION.data[newState].id;
            // setFilterCondition(filters[tabKey]);
          }
          if (!disabledChangeParentIndex) {
            onChangeIndex(newState);
            setKeySearch((prevStateSearch) => {
              if (prevStateSearch.length) {
                onChangeKeySearch(prevStateSearch);
              }
              return prevStateSearch;
            });
          }
          return newState;
        });
      } else {
        setFilterCondition((prevState) => {
          const isExist = prevState?.[key]?.includes?.(item?.id);
          if (isExist) {
            return {
              ...prevState,
              [key]: '',
            };
          } else {
            setTabIndex(LIST_TYPE_NOTIFICATION.data.findIndex((it) => it?.id === key));
            return {
              ...prevState,
              [key]: item?.id,
            };
          }
        });
      }
    },
    [isShowOptionFilter, isShowSearch, onChangeIndex, onChangeKeySearch],
  );

  const renderItem = useCallback(
    (key) => (item, index) => {
      const { id, title, isSelected, isHidden } = item;
      if (isHidden) return null;
      return (
        <TouchableOpacity
          key={id}
          style={[
            styles.itemTypeCustomerContainer,
            isSelected && { backgroundColor: Colors.primary2 },
          ]}
          onPress={() => onPressItem(item, index, key)}
        >
          <AppText
            style={[styles.itemTextTypeCustomer, isSelected && { color: Colors.primary5 }]}
          >{`${title}`}</AppText>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  const paddingTop = useMemo(
    () => ({
      paddingTop: SH(8),
    }),
    [],
  );
  const height = useMemo(
    () => ({
      height: SH(83) + paddingTop.paddingTop,
    }),
    [paddingTop.paddingTop],
  );

  const onCheckboxSelected = useCallback((ids) => {
    idsCheckboxModal.current = ids;
  }, []);

  const onConfirmCheckbox = useCallback(() => {
    bottomSheetRef.current.close();
    requestAnimationFrame(() => {
      if (idsCheckboxModal.current?.length) {
        setTabIndex(
          LIST_TYPE_NOTIFICATION.data.findIndex((it) => it?.id === itemCheckboxModal.current?.key),
        );
      }
      setFilterCondition((prevState) => {
        const newFilterCondition = {
          ...prevState,
          [itemCheckboxModal.current?.key]: idsCheckboxModal.current,
        };

        return newFilterCondition;
      });
    });
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(
  //     getFilterNotification(category, () => {
  //       setIsLoading(false);
  //     }),
  //   );
  // }, [category, dispatch]);

  useEffect(() => {
    setTabIndex((prev) => {
      if (prev !== parentIndex) {
        return parentIndex;
      }

      return prev;
    });
  }, [parentIndex]);

  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={[styles.headerContainer, height, paddingTop]}>
          <View style={styles.inputContainer}>
            <View
              style={[styles.searchContainer, isShowSearch && { borderColor: Colors.primary2 }]}
            >
              <Image source={ICON_PATH.search3} style={styles.iconSearch} />
              <TextInput
                placeholder="Tìm theo nội dung thông báo"
                style={styles.input}
                onFocus={onFocusInput}
                onBlur={onBlurInput}
                onChangeText={setKeySearch}
                value={keySearch}
                onSubmitEditing={onSearchNotification}
              />
              {keySearch?.length > 0 ? (
                <TouchableWithoutFeedback onPress={onClearInput}>
                  <Image source={ICON_PATH.close4} style={[styles.iconSearch, { margin: SH(5) }]} />
                </TouchableWithoutFeedback>
              ) : null}
            </View>
          </View>
          <View style={[styles.listWrapper, { paddingTop: SH(8) }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={[
                  styles.listTypeCustomerContainer,
                  isShowOptionFilter && styles.listTypeCustomerActiveContainer,
                ]}
              >
                {dataTabMapSelected?.data?.map?.(renderItem(dataTabMapSelected?.key))}
              </View>
            </ScrollView>
          </View>
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: SH(4) }} color={Colors.gray5} />
          ) : (
            <>
              <View style={[styles.line, !isShowOptionFilter && { height: 0 }]} />
              <FlatList
                data={dataMapSelected}
                renderItem={renderItemOptionFilter}
                showsVerticalScrollIndicator={false}
                // ListEmptyComponent={renderEmpty}
                style={{ opacity: isShowOptionFilter ? 1 : 0 }}
                keyExtractor={keyExtractor}
              />
              <View
                style={[
                  styles.buttonContainer,
                  !isShowOptionFilter && { height: 0, overflow: 'hidden', opacity: 0 },
                ]}
              >
                <TouchableOpacity style={styles.button} onPress={onPressRemoveFilterNotification}>
                  <AppText style={styles.buttonText}>Bỏ lọc</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { borderColor: Colors.primary2, backgroundColor: Colors.primary2 },
                  ]}
                  onPress={onPressFilterNotification}
                >
                  <AppText style={[styles.buttonText, { color: Colors.primary5 }]}>
                    Lọc thông báo
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ListCheckBox
            title={itemCheckboxModal.current.subTitle}
            data={itemCheckboxModal.current.data}
            onCheckboxSelected={onCheckboxSelected}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        backdropColor={'transparent'}
        onPressDone={onConfirmCheckbox}
      />
    </>
  );
});

export default FilterNotification;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    borderBottomLeftRadius: SW(20),
    borderBottomRightRadius: SW(20),
    backgroundColor: Colors.primary5,
    marginBottom: SH(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SH(36),
    marginHorizontal: SH(16),
    zIndex: 999,
  },
  input: {
    flex: 1,
    fontSize: 13,
    paddingRight: 12,
    height: 36,
    paddingVertical: 0,
  },
  searchContainer: {
    flex: 1,
    height: SH(36),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral5,
    borderRadius: SH(32),
    borderWidth: 1,
    borderColor: Colors.neutral5,
  },
  iconSearch: {
    width: SH(20),
    height: SH(20),
    resizeMode: 'contain',
    marginHorizontal: SH(12),
  },
  iconFilter: {
    width: SH(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  buttonSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: SW(16),
  },
  textSearch: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
  },
  typeCustomerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listWrapper: {},
  listTypeCustomerContainer: {
    flexDirection: 'row',
    paddingHorizontal: SH(12),
    zIndex: 999,
  },
  listTypeCustomerActiveContainer: {
    flexWrap: 'wrap',
    width: SCREEN_WIDTH,
  },
  itemTypeCustomerContainer: {
    height: SH(32),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SH(12),
    backgroundColor: Colors.neutral5,
    borderRadius: SH(18),
    // marginBottom: SH(8),
    marginHorizontal: SW(4),
  },
  itemTextTypeCustomer: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  optionFilterContainer: {
    height: 0,
  },
  optionFilterActiveContainer: {
    height: 'auto',
  },
  line: {
    backgroundColor: Colors.gray4,
    marginHorizontal: SH(16),
    height: 1,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginHorizontal: SH(16),
    marginTop: SH(12),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: SH(12),
  },
  button: {
    paddingVertical: SH(10),
    paddingHorizontal: SW(45),
    borderWidth: 1,
    borderColor: Colors.gray5,
    borderRadius: SH(24),
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  shapeImage: {
    height: SH(30),
    top: -SH(3),
    justifyContent: 'center',
    paddingHorizontal: SH(24),
    paddingTop: SH(4),
    flexDirection: 'row',
  },
  iconAppendFilter: {
    width: SW(20),
    height: SH(20),
    marginRight: SW(8),
    tintColor: Colors.gray5,
  },
  textAppendFilter: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: SH(12),
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});
