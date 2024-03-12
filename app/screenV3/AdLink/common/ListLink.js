import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { TYPE_LINK, LIST_TYPE_LINK } from '../AdLink.constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCountCustomerLink,
  getListCustomerLink,
  getPosterLink,
} from '../../../redux/actions/actionsV3/customerAction';
import { showAlert } from '../../../utils/UIUtils';
import HeaderSection from '../../Collaborator/common/HeaderSection';
import ListButtonFilter from '../../Collaborator/common/ListButtonFilter';
import SearchInput from '../../../componentV3/SearchInput/SearchInput';
import useDebounce from '../../../hooks/useDebounce';
import { TAB_TYPE } from '../../Customer/Customer.constants';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import PopupAdImage from '../components/PopupAdImage';
import Loading from '../../../componentV3/LoadingModal';
import { useImperativeHandle } from 'react';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';
import FlutterService from '../../Home/FlutterService';

const HFlatList = HPageViewHoc(FlatList);

const ListLink = memo(
  forwardRef((props, ref) => {
    const { navigation, index } = props;

    const dispatch = useDispatch();

    const bottomSheetRef = useRef();

    const totalNumLink = useSelector((state) => state.customerReducer.totalNumLink);
    const listCustomerLink = useSelector((state) => state.customerReducer.listCustomerLink);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPoster, setIsLoadingPoster] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [outOfData, setOutOfData] = useState(false);
    const [page, setPage] = useState(0);

    const [dataAdImage, setDataAdImage] = useState({});
    const [itemSelected, setItemSelected] = useState({});
    const [type, setType] = useState(TYPE_LINK.ALL);
    const [filter, setFilter] = useState({});

    const onGetData = useCallback(
      (_page, refreshing) => {
        _page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
        setPage(_page);
        const params = {
          ...filter,
          type,
          page: _page,
          per_page: 20,
        };

        if (type === TYPE_LINK.ALL) {
          delete params?.type;
        }

        dispatch(
          getListCustomerLink(params, (isSuccess, results) => {
            if (!isSuccess || !results?.length) {
              setOutOfData(true);
            }

            _page === 1 ? setIsLoading(false) : setIsLoadingMore(false);
          }),
        );
      },
      [dispatch, filter, type],
    );

    const onGetPosterLink = useCallback(
      (id) => {
        setIsLoadingPoster(true);
        dispatch(
          getPosterLink(id, (isSuccess, result) => {
            setIsLoadingPoster(false);
            if (isSuccess) {
              setDataAdImage(result);
              bottomSheetRef.current.open();
            } else {
              showAlert('Không thể tải dữ liệu');
            }
          }),
        );
      },
      [dispatch],
    );

    const onLoadMore = useCallback(() => {
      if (outOfData || isLoadingMore || isLoading) return;
      const newPage = page + 1;
      onGetData(newPage);
    }, [isLoading, isLoadingMore, onGetData, outOfData, page]);

    const dataTabMapSelected = useMemo(() => {
      const newObject = LIST_TYPE_LINK.map((item) => {
        return {
          ...item,
          title: `${item?.title || ''} (${totalNumLink?.[item?.id] || 0})`,
        };
      });

      return newObject;
    }, [totalNumLink]);

    const debounceSetKeySearch = useDebounce((_text) => {
      setFilter((prev) => ({ ...prev, keySearch: _text }));
    }, 500);

    const onChangeText = useCallback(
      (_text) => {
        setIsLoading(true);
        debounceSetKeySearch(_text);
      },
      [debounceSetKeySearch],
    );
    const debounceSetType = useDebounce((_text) => {
      setType((prev) => _text);
    }, 100);

    const onChangeType = useCallback(
      (_text) => {
        setIsLoading(true);
        debounceSetType(_text);
      },
      [debounceSetType],
    );

    const renderHeader = useMemo(() => {
      return (
        <View>
          <HeaderSection
            title={'Các liên kết tiếp thị đã tạo'}
            elementNote={
              <View style={styles.noteContainer}>
                <View style={[styles.noteItemContainer, { paddingTop: 0 }]}>
                  <Image source={ICON_PATH.saleman2} style={styles.noteItemImage} />
                  <View style={styles.noteItemTextContainer}>
                    <AppText semiBold style={[styles.noteItemText, { color: Colors.purple3 }]}>
                      Quan tâm
                    </AppText>
                    <AppText style={styles.noteItemText}>
                      Khách hàng để lại thông tin và nhu cầu, đang chờ xử lý
                    </AppText>
                  </View>
                </View>
                <View style={styles.noteItemContainer}>
                  <Image source={ICON_PATH.saleman3} style={styles.noteItemImage} />
                  <View style={styles.noteItemTextContainer}>
                    <AppText semiBold style={[styles.noteItemText, { color: Colors.sixOrange }]}>
                      Tham gia
                    </AppText>
                    <AppText style={styles.noteItemText}>
                      Khách hàng đã được tạo hồ sơ tham gia nhưng chưa thành công
                    </AppText>
                  </View>
                </View>
                <View
                  style={[styles.noteItemContainer, { paddingBottom: 0, borderBottomWidth: 0 }]}
                >
                  <Image
                    source={ICON_PATH.commissionUser}
                    style={[styles.noteItemImage, { tintColor: Colors.green5 }]}
                  />
                  <View style={styles.noteItemTextContainer}>
                    <AppText semiBold style={[styles.noteItemText, { color: Colors.green5 }]}>
                      Thành công
                    </AppText>
                    <AppText style={styles.noteItemText}>Khách hàng đã tham gia thành công</AppText>
                  </View>
                </View>
              </View>
            }
          />
          <ListButtonFilter
            data={dataTabMapSelected}
            onPress={onChangeType}
            itemTextColor={Colors.gray5}
          />
          <SearchInput
            placeholder={'Tìm theo tên kênh'}
            containerStyle={{ marginHorizontal: 0, height: 40, marginVertical: 12 }}
            onChangeText={onChangeText}
          />
          <BottomActionSheet
            ref={bottomSheetRef}
            render={() => (
              <PopupAdImage
                itemSelected={itemSelected}
                onClose={() => bottomSheetRef?.current?.close?.()}
                data={dataAdImage}
              />
            )}
          />
          <Loading visible={isLoadingPoster} />
        </View>
      );
    }, [
      dataAdImage,
      dataTabMapSelected,
      isLoadingPoster,
      itemSelected,
      onChangeText,
      onChangeType,
    ]);

    const renderEmpty = useCallback(() => {
      if (isLoading) {
        return (
          <View style={styles.itemEmptyContainer}>
            <ActivityIndicator style={styles.loading} color={Colors.gray5} />
          </View>
        );
      }
      return (
        <View style={styles.itemEmptyContainer}>
          <Image style={styles.iconEmpty} source={ICON_PATH.block} />
          <AppText style={styles.textEmpty}>{'Hiện chưa có link nào được tạo'}</AppText>
        </View>
      );
    }, [isLoading]);

    const onShareLink = useCallback(async (link) => {
      try {
        await Share.share({
          message: link,
        });
      } catch (error) {
        if (__DEV__) {
          console.log('error', error);
        }
      }
    }, []);

    const renderFooter = useCallback(() => {
      if (!listCustomerLink?.length || isLoading) return null;
      if (isLoadingMore) {
        return (
          <View style={styles.footerContainer}>
            <ActivityIndicator size="small" color={Colors.gray5} />
            <AppText style={styles.footerText}>Đang tải thêm</AppText>
          </View>
        );
      }
      if (outOfData) {
        return (
          <View style={styles.footerContainer}>
            <AppText style={[styles.footerText, { marginLeft: 0 }]}>
              Đã tải hết tiếp thị liên kết
            </AppText>
          </View>
        );
      }

      return null;
    }, [isLoading, isLoadingMore, listCustomerLink?.length, outOfData]);

    const onPressStatus = useCallback(
      (id, status, isFinance) => {
        if (status) {
          navigation?.popToTop();
          navigation?.navigate('Customer', {
            params: {
              initTabType: isFinance ? TAB_TYPE.LOAN : TAB_TYPE.INSURANCE,
              initFilter: {
                page_qc: [id],
                status: [status],
              },
              initTabIndex: 1,
            },
          });
        } else {
          navigation?.navigate('CustomerDetail', {
            group: TAB_TYPE.PAGE,
            idLink: id,
            title: 'Khách hàng chưa phân loại',
          });
        }
      },
      [navigation],
    );

    const renderItem = useCallback(
      ({ item, index: idx }) => {
        return (
          <ItemLink
            item={item}
            index={idx}
            navigation={navigation}
            onPressDetail={() => {
              setItemSelected(item);
              onGetPosterLink(item?.id);
            }}
            onPressShare={() => {
              onShareLink(item?.link_review);
            }}
            onPressStatus={onPressStatus}
          />
        );
      },
      [navigation, onGetPosterLink, onPressStatus, onShareLink],
    );

    const keyExtractor = useCallback((item) => {
      return item?.id;
    }, []);

    const refreshList = useCallback(() => {
      dispatch(getCountCustomerLink());
      onGetData(1, true);
    }, [dispatch, onGetData]);

    useImperativeHandle(ref, () => ({ refreshList }));

    useEffect(() => {
      setOutOfData(false);
      onGetData(1);
      dispatch(getCountCustomerLink());
    }, [dispatch, onGetData]);

    return (
      <HFlatList
        index={index}
        // key={type}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        data={isLoading ? [] : listCustomerLink}
        renderItem={renderItem}
        style={styles.listContainer}
        // refreshing={isRefreshing}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        // scrollEventThrottle=
        // onRefresh={onRefresh}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    );
  }),
);

export default ListLink;

const styles = StyleSheet.create({
  loading: {
    marginVertical: 20,
  },
  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 11,
  },
  iconEmpty: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary5,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderRadius: 8,
  },
  itemImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
  },
  itemButtonIcon: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemInfoTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  itemInfoValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemArrow: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: 8,
    lineHeight: 20,
  },
  noteContainer: {
    maxWidth: SW(300),
  },
  noteItemContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray4,
  },
  noteItemImage: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  noteItemTextContainer: {
    width: '88%',
  },
  noteItemText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    flex: 1,
  },

  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SH(12),
  },
});

const ItemLink = memo(({ item, index, navigation, onPressDetail, onPressShare, onPressStatus }) => {
  const [itemState, setItemState] = useState(item);

  const onUpdateItem = useCallback((newItem) => {
    setItemState((prev) => {
      return {
        ...prev,
        ...newItem,
        title: newItem?.customer_label || prev?.title,
        active:
          typeof newItem?.active === 'boolean' ? (newItem?.active ? '1' : '0') : prev?.newItem,
      };
    });
  }, []);

  const disabled = itemState?.active !== '1';

  const onGoListCustomer = useCallback(
    (status) => {
      onPressStatus?.(item?.id, status, item?.finance === '1');
    },
    [item?.finance, item?.id, onPressStatus],
  );

  useEffect(() => {
    setItemState(item);
  }, [item]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (itemState?.finance === '1') {
          FlutterService.handleDeeplink({
            name: '',
            path: `/link_setup`,
          });
        } else {
          navigation.navigate('CreateAdLinkScreen', {
            item: itemState,
            title: 'Chi tiết liên kết tiếp thị',
            onUpdateItem,
          });
        }
      }}
      style={[
        styles.itemContainer,
        index && { marginTop: SH(12) },
        disabled && { backgroundColor: Colors.gray4 },
      ]}
    >
      <Image style={styles.itemImage} source={{ uri: itemState?.icon }} />
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <AppText style={styles.itemTitle} medium numberOfLines={1}>
            {itemState?.customer_label}
          </AppText>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.itemButtonIcon}
              onPress={onPressDetail}
              disabled={disabled}
            >
              <Image
                style={[styles.itemIcon, disabled && { tintColor: Colors.gray3 }]}
                source={ICON_PATH.outlinePicture}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.itemButtonIcon, { paddingRight: 0 }]}
              onPress={onPressShare}
              disabled={disabled}
            >
              <Image
                style={[styles.itemIcon, disabled && { tintColor: Colors.gray3 }]}
                source={ICON_PATH.outlineSend}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.row, { marginTop: 5 }]}>
          <TouchableOpacity
            style={styles.itemInfo}
            disabled={!itemState?.total_follow > 0}
            onPress={() => {
              onGoListCustomer();
            }}
          >
            <AppText style={styles.itemInfoTitle}>Quan tâm</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.purple3 }]}>
                {itemState?.total_follow || 0}
              </AppText>
              {itemState?.total_follow > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.purple3 }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemInfo}
            disabled={!itemState?.total_attended > 0}
            onPress={() => {
              onGoListCustomer('2');
            }}
          >
            <AppText style={styles.itemInfoTitle}>Tham gia</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.sixOrange }]}>
                {itemState?.total_attended || 0}
              </AppText>
              {itemState?.total_attended > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.sixOrange }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!itemState?.total_success > 0}
            style={styles.itemInfo}
            onPress={() => {
              onGoListCustomer('1');
            }}
          >
            <AppText style={styles.itemInfoTitle}>Thành công</AppText>
            <View style={styles.row}>
              <AppText semiBold style={[styles.itemInfoValue, { color: Colors.green5 }]}>
                {itemState?.total_success || 0}
              </AppText>
              {itemState?.total_success > 0 ? (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={[styles.itemArrow, { tintColor: Colors.green5 }]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});
