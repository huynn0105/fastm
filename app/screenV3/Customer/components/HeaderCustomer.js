import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { LIST_TYPE_CUSTOMER, TAB_ITEM, TAB_TYPE, getTabId } from '../Customer.constants';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import ButtonCheckBox from '../common/ButtonCheckBox';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import { useDispatch, useSelector } from 'react-redux';
import { getListFilterCustomer } from '../../../redux/actions/actionsV3/customerAction';
import { isEqual } from 'lodash';
import ListCheckBox from '../common/ListCheckBox';

const HeaderCustomer = memo((props) => {
  const {
    onChangeTab,
    tab,
    onChangeFilter,
    filter: mainFilterCondition,
    navigation,
    onRemoveFilter,
  } = props;

  const dispatch = useDispatch();

  const listFilterCustomer = useSelector((state) => state.customerReducer.listFilterCustomer);
  const totalNum = useSelector((state) => state.customerReducer.totalNum);

  const sumTotalNum = useMemo(() => {
    const obj = { ...totalNum };
    delete obj[TAB_TYPE.PRIORITY];
    delete obj[TAB_TYPE.TRASH];
    delete obj[TAB_TYPE.PAGE];

    return Object.values(obj)?.reduce((prevValue, item) => prevValue + item, 0);
  }, [totalNum]);

  const bottomSheetRef = useRef();
  const itemCheckboxModal = useRef({});
  const isFocusInput = useRef(false);

  const idsCheckboxModal = useRef([]);

  const [isShowOptionFilter, setIsShowOptionFilter] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filterCondition, setFilterCondition] = useState(mainFilterCondition[getTabId(tabIndex)]);

  const [keySearch, setKeySearch] = useState('');

  const isFilter = useMemo(() => {
    let temp = false;
    const arrayValue = Object?.values(mainFilterCondition[tab] || {});

    if (arrayValue.length > 0) {
      for (let i = 0; i < arrayValue.length; i++) {
        if (arrayValue?.[i]?.length > 0) {
          temp = true;
          break;
        }
      }
    }

    return temp;
  }, [mainFilterCondition, tab]);

  const dataMapSelected = useMemo(() => {
    const tabId = getTabId(tabIndex);
    let list = [];
    if (tabId === TAB_TYPE.ALL) {
      list = listFilterCustomer;
    } else {
      list = listFilterCustomer?.filter((item) => item?.type?.includes(tabId));
    }

    return list?.map?.((item) => {
      const { key, projects } = item;
      const valueSelected = filterCondition?.[key] || [];

      const newData = projects?.map?.((it) => {
        return {
          ...it,
          isSelected: valueSelected?.includes?.(`${it?.id}`),
        };
      });

      return {
        ...item,
        data: newData,
      };
    });
  }, [filterCondition, listFilterCustomer, tabIndex]);

  const dataTabMapSelected = useMemo(() => {
    const newObject = { ...LIST_TYPE_CUSTOMER };

    newObject.data = newObject.data.map((item, index) => {
      return {
        ...item,
        title: `${item?.title || ''} (${
          (item?.id === TAB_TYPE.ALL ? sumTotalNum : totalNum?.[item?.id]) || 0
        })`,
        isSelected: tabIndex === index,
      };
    });

    return newObject;
  }, [sumTotalNum, tabIndex, totalNum]);

  const onPressAppendFilter = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setIsShowOptionFilter((prevState) => !prevState);
  }, []);

  const onPressItem = useCallback(
    (item, index, key) => {
      if (key === TAB_ITEM) {
        setIsShowOptionFilter((prevState) => {
          if (!prevState) {
            onChangeTab?.(item?.id);
          }

          return prevState;
        });
        const newTabId = getTabId(index);
        setTabIndex(index);
        setFilterCondition(() => {
          let newState = mainFilterCondition?.[newTabId];
          if (newState?.keySearch === keySearch) {
            return newState;
          }
          newState = {
            ...newState,
            keySearch,
          };
          onChangeFilter?.(newTabId, newState);
          return newState;
        });
      } else {
        setFilterCondition((prevState) => {
          const isExist = prevState?.[key]?.findIndex((it) => it == `${item.id}`);
          if (isExist >= 0) {
            return {
              ...prevState,
              [key]: [],
            };
          } else {
            return {
              ...prevState,
              [key]: [`${item.id}`],
            };
          }
        });
      }
    },
    [keySearch, mainFilterCondition, onChangeFilter, onChangeTab],
  );

  const onPressItemOpenCheckBox = useCallback(
    (item) => {
      itemCheckboxModal.current = item;

      if (item?.key === TAB_TYPE.PAGE) {
        const tabId = getTabId(tabIndex);

        if (tabId === TAB_TYPE.FINANCIAL || tabId === TAB_TYPE.INSURANCE) {
          itemCheckboxModal.current.data = item?.data?.filter((it) => it?.type === tabId);
        }
      }

      const titleModal = item?.title?.replace('từng tham gia', '')?.toLowerCase() || '';

      bottomSheetRef.current.open(`Lọc ${titleModal}`);
    },
    [tabIndex],
  );

  //-----------------------------------------------------

  const renderItem = useCallback(
    (key) => (item, index) => {
      const {
        id,
        title,
        isSelected,
        isHidden,
        colorActive,
        colorInActive,
        textColorActive,
        textColorInActive,
      } = item;
      if (isHidden) return null;
      const backgroundColor = isSelected
        ? colorActive || Colors.primary2
        : colorInActive || Colors.neutral5;
      const color = isSelected
        ? textColorActive || Colors.primary5
        : textColorInActive || Colors.gray5;
      return (
        <TouchableOpacity
          key={id}
          style={[styles.itemTypeCustomerContainer, { backgroundColor }]}
          onPress={() => onPressItem(item, index, key)}
        >
          <AppText style={[styles.itemTextTypeCustomer, { color }]}>{`${title}`}</AppText>
        </TouchableOpacity>
      );
    },
    [onPressItem],
  );

  const onGetListFilterCustomer = useCallback(async () => {
    dispatch(
      getListFilterCustomer((isSuccess) => {
        setIsLoading(false);
      }),
    );
  }, [dispatch]);

  //-----------------------------------------------------

  const renderItemOptionFilter = useCallback(
    ({ item, index }) => {
      if (item?.isMultiSelect) {
        const numCheckboxSelected = item?.data?.filter?.((it) => it?.isSelected)?.length;
        return (
          <View style={styles.lineWrapper}>
            <AppText style={styles.title}>{item?.title}</AppText>
            <ButtonCheckBox
              placeholder={'Chọn tên sản phẩm'}
              value={numCheckboxSelected > 0 ? `Đã chọn ${numCheckboxSelected} sản phẩm` : ''}
              onPress={() => onPressItemOpenCheckBox(item)}
              style={{
                marginHorizontal: 0,
              }}
            />
          </View>
        );
      }
      return (
        <View style={styles.lineWrapper}>
          <AppText style={styles.title}>{item?.title}</AppText>
          <View style={styles.listWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={[
                  styles.listTypeCustomerContainer,
                  styles.listTypeCustomerActiveContainer,
                  {
                    paddingHorizontal: 0,
                  },
                ]}
              >
                {item?.data?.map?.(renderItem(item?.key))}
              </View>
            </ScrollView>
          </View>
        </View>
      );
    },
    [onPressItemOpenCheckBox, renderItem],
  );

  const keyExtractor = useCallback((item) => item?.id, []);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyText}>Không có dữ liệu</AppText>
        <AppText
          onPress={() => {
            setIsLoading(true);
            onGetListFilterCustomer();
          }}
          style={[styles.emptyText, { color: Colors.primary2 }]}
        >
          Nhấn để tải lại
        </AppText>
      </View>
    );
  }, [isLoading, onGetListFilterCustomer]);

  //-----------------------------------------------------

  const onBackdropPress = useCallback(() => {
    if (isFocusInput.current) {
      Keyboard.dismiss();
      return;
    } else {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          200,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ),
      );
      setIsShowSearch(false);
      setIsShowOptionFilter(false);
      const currentMainFilter = mainFilterCondition[tab];
      setFilterCondition(currentMainFilter);
      const indexTab = dataTabMapSelected?.data?.findIndex((it) => it?.id === tab);
      setTabIndex(indexTab);
      setKeySearch(currentMainFilter?.keySearch);
    }
  }, [mainFilterCondition, tab, dataTabMapSelected]);

  //-----------------------------------------------------

  const onPressFilterCustomer = useCallback(() => {
    if (isFocusInput?.current) {
      Keyboard.dismiss();
    }
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setIsShowOptionFilter(false);
    setIsShowSearch(false);
    requestAnimationFrame(() => {
      onChangeTab?.(getTabId(tabIndex));
      onChangeFilter?.(getTabId(tabIndex), { ...filterCondition, keySearch });
    });
  }, [filterCondition, keySearch, onChangeFilter, onChangeTab, tabIndex]);

  const onPressRemoveFilterCustomer = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setIsShowOptionFilter(false);
    setIsShowSearch(false);
    setKeySearch('');
    setFilterCondition({});
    setTabIndex(0);
    requestAnimationFrame(() => {
      onRemoveFilter?.();
    });
  }, [onRemoveFilter]);

  //-----------------------------------------------------

  const onCheckboxSelected = useCallback((ids) => {
    idsCheckboxModal.current = ids;
  }, []);

  const onConfirmCheckbox = useCallback(() => {
    bottomSheetRef.current.close();
    requestAnimationFrame(() => {
      setFilterCondition((prevState) => {
        const newFilterCondition = {
          ...prevState,
          [itemCheckboxModal.current?.key]: idsCheckboxModal.current,
        };

        return newFilterCondition;
      });
    });
  }, []);

  //-----------------------------------------------------

  useEffect(() => {
    setIsLoading(true);
    onGetListFilterCustomer();
    const sub = navigation?.addListener('willFocus', onGetListFilterCustomer);
    return () => {
      sub?.remove();
    };
  }, [navigation, onGetListFilterCustomer]);

  useEffect(() => {
    setFilterCondition((prevState) => {
      if (isEqual(prevState, mainFilterCondition[tab])) return prevState;
      return mainFilterCondition[tab];
    });
  }, [mainFilterCondition]);

  useEffect(() => {
    setTabIndex((prevState) => {
      const indexTab = dataTabMapSelected?.data?.findIndex((it) => it?.id === tab);
      if (prevState === indexTab) return prevState;
      return indexTab;
    });
  }, [tab]);

  return (
    <>
      <View style={[styles.headerContainer, { marginBottom: SH(28) }]} />
      <View
        style={[
          styles.container,
          (isShowOptionFilter || isShowSearch) && {
            backgroundColor: 'rgba(10, 10, 40, 0.85)',
            zIndex: 9999,
          },
        ]}
      >
        <View
          style={[
            styles.headerContainer,
            isShowOptionFilter && { height: 'auto', maxHeight: SH(525) },
          ]}
        >
          <View style={[styles.listWrapper, { paddingTop: SH(12) }]}>
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
                ListEmptyComponent={renderEmpty}
                style={{ opacity: isShowOptionFilter ? 1 : 0 }}
                keyExtractor={keyExtractor}
              />
              {dataMapSelected?.length ? (
                <View
                  style={[
                    styles.buttonContainer,
                    !isShowOptionFilter && { height: 0, overflow: 'hidden', opacity: 0 },
                  ]}
                >
                  <TouchableOpacity style={styles.button} onPress={onPressRemoveFilterCustomer}>
                    <AppText style={styles.buttonText}>Bỏ lọc</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { borderColor: Colors.primary2, backgroundColor: Colors.primary2 },
                    ]}
                    onPress={onPressFilterCustomer}
                  >
                    <AppText style={[styles.buttonText, { color: Colors.primary5 }]}>
                      Lọc khách hàng
                    </AppText>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </View>
        <ImageBackground
          resizeMode="stretch"
          source={IMAGE_PATH.shapeFilter}
          style={[styles.shapeImage, { paddingHorizontal: SW(isFilter ? 16 : 6) }]}
          fadeDuration={0}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              paddingTop: SH(4),
              paddingHorizontal: SW(16),
            }}
            onPress={onPressAppendFilter}
          >
            <Image
              source={ICON_PATH.arrowDownAppend}
              style={[
                styles.iconAppendFilter,
                isShowOptionFilter && {
                  transform: [
                    {
                      rotate: '180deg',
                    },
                  ],
                },
                isFilter && {
                  tintColor: Colors.primary2,
                },
              ]}
            />
            <AppText
              semiBold={isFilter}
              style={[styles.textAppendFilter, isFilter && { color: Colors.primary2 }]}
            >
              {isFilter ? 'Đang lọc' : 'Lọc nâng cao'}
            </AppText>
          </TouchableOpacity>

          {isFilter ? (
            <>
              <View
                style={{ width: 1, height: 18, backgroundColor: Colors.gray4, marginTop: SH(4) }}
              />
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  paddingTop: SH(4),
                  paddingHorizontal: SW(16),
                }}
                onPress={onPressRemoveFilterCustomer}
              >
                <AppText
                  semiBold
                  style={[styles.textAppendFilter, { color: Colors.sixRed, marginRight: SW(4) }]}
                >
                  {'Bỏ lọc'}
                </AppText>
                <Image
                  source={ICON_PATH.close1}
                  style={{
                    width: 15,
                    height: 15,
                    tintColor: Colors.sixRed,
                    top: 1,
                  }}
                />
              </TouchableOpacity>
            </>
          ) : null}
        </ImageBackground>
        {isShowSearch || isShowOptionFilter ? (
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, width: '100%' }}
            onPress={onBackdropPress}
          />
        ) : null}
      </View>
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ListCheckBox
            data={itemCheckboxModal.current.data}
            onCheckboxSelected={onCheckboxSelected}
          />
        )}
        canClose
        haveCloseButton
        onPressDone={onConfirmCheckbox}
        backdropColor={'transparent'}
      />
    </>
  );
});

export default HeaderCustomer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  headerContainer: {
    height: SH(62),
    width: '100%',
    borderBottomLeftRadius: SW(20),
    borderBottomRightRadius: SW(20),
    backgroundColor: Colors.primary5,
  },

  listWrapper: {
    paddingBottom: SH(4),
    paddingTop: SH(8),
  },
  listTypeCustomerContainer: {
    flexDirection: 'row',
    paddingHorizontal: SH(12),
  },
  listTypeCustomerActiveContainer: {
    flexWrap: 'wrap',
    width: SCREEN_WIDTH,
  },
  itemTypeCustomerContainer: {
    paddingVertical: SH(6),
    paddingHorizontal: SH(12),
    backgroundColor: Colors.neutral5,
    borderRadius: SH(18),
    marginBottom: SH(12),
    marginHorizontal: SW(4),
  },
  itemTextTypeCustomer: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  lineWrapper: {
    borderBottomColor: Colors.gray4,
    borderBottomWidth: 1,
    marginHorizontal: SH(16),
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
    top: -1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconAppendFilter: {
    width: SW(20),
    height: SH(20),
    marginRight: SW(4),
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
