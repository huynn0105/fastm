import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FlatList } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { TAB_TYPE } from '../Customer.constants';
import { getListCustomer } from '../../../redux/actions/actionsV3/customerAction';
import { useDispatch, useSelector } from 'react-redux';
import ItemListCustomer from '../common/ItemListCustomer';
import HeaderSection from '../../Collaborator/common/HeaderSection';
import Indicator from '../../../componentV3/Indicator/Indicator';

import { BOTTOM_BAR_HEIGHT } from '../../../screens2/Root/Tabbar';
import ListEmpty from '../../../componentV3/ListComponents/ListEmpty';
import SearchInput from '../../../componentV3/SearchInput/SearchInput';
import { IMAGE_PATH } from '../../../assets/path';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HFlatList = HPageViewHoc(FlatList);

const ListCustomer = memo(
  forwardRef((props, ref) => {
    const { navigation, index } = props;

    const [group, setGroup] = useState(TAB_TYPE.ALL);
    const [filter, setFilter] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [outOfData, setOutOfData] = useState(false);
    const [, setPage] = useState(0);

    const listCustomer = useSelector((state) => state?.customerReducer?.listCustomer || []);

    const dispatch = useDispatch();
    const flatListRef = useRef();

    const renderEmpty = useCallback(() => {
      if (isLoading) {
        return (
          <View style={styles.itemEmptyContainer}>
            <Indicator />
          </View>
        );
      }

      switch (group) {
        case TAB_TYPE.PRIORITY:
          return (
            <>
              <ListEmpty title={'Bạn chưa có khách hàng tiềm năng nào'} />
              <Image source={IMAGE_PATH.exPriority} style={styles.imageExPriority} />
            </>
          );
        default:
          return (
            <>
              <ListEmpty title={'Không tìm thấy khách hàng nào'} />
              <Image source={IMAGE_PATH.exLink} style={styles.imageExLink} />
            </>
          );
      }
    }, [group, isLoading]);

    const renderFooter = useCallback(() => {
      if (!listCustomer?.length) return null;
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
            <AppText style={[styles.footerText, { marginLeft: 0 }]}>Đã tải hết khách hàng</AppText>
          </View>
        );
      }

      return null;
    }, [isLoadingMore, listCustomer?.length, outOfData]);

    const timeout = useRef();

    const onChangeText = useCallback((_text) => {
      setIsLoading(true);
      if (timeout?.current) {
        clearTimeout(timeout?.current);
      }

      timeout.current = setTimeout(() => {
        setFilter((prev) => ({
          ...prev,
          keySearch: _text,
        }));
      }, 500);
    }, []);

    const renderHeader = useCallback(() => {
      return (
        <>
          <HeaderSection title={'Danh sách khách hàng'} style={{ marginTop: 12 }} />
          <SearchInput
            containerStyle={{
              marginHorizontal: 0,
              height: 40,
              marginVertical: 8,
            }}
            placeholder="Tìm nhanh theo tên hoặc số điện thoại"
            onChangeText={onChangeText}
          />
        </>
      );
    }, [onChangeText]);

    const onGetData = useCallback(
      (_page = 1, isHideLoading, callback) => {
        if (!isHideLoading) {
          _page === 1 ? setIsLoading(true) : setIsLoadingMore(true);
        }

        const params = {
          ...filter,
          group,
          page: _page,
          per_page: 20,
        };

        if (group === TAB_TYPE.ALL) {
          delete params?.group;
        }

        setPage(_page);
        dispatch(
          getListCustomer(params, (isSuccess, results) => {
            if (!isSuccess || !results?.length) {
              setOutOfData(true);
            }

            _page === 1 ? setIsLoading(false) : setIsLoadingMore(false);
            if (typeof callback === 'function') callback?.(isSuccess, results);
          }),
        );
      },
      [dispatch, filter, group],
    );

    const onLoadMore = useCallback(
      (callback) => {
        const callLegal = typeof callback === 'function' ? callback : () => {};

        if (outOfData || isLoadingMore) return callLegal?.(false);
        setPage((prevState) => {
          const newPage = prevState + 1;
          onGetData(newPage, false, callLegal);
          return prevState;
        });
      },
      [isLoadingMore, onGetData, outOfData],
    );

    const keyExtractor = useCallback((item) => item?.ID, []);

    const onGotoCustomerDetail = useCallback(
      (item, idx) => {
        setPage((prevPage) => {
          navigation.navigate('CustomerDetail', {
            params: item,
            index: idx,
            group,
            onLoadMore,
          });
          return prevPage;
        });
      },
      [group, navigation, onLoadMore],
    );

    const renderItem = useCallback(
      ({ item, index: idx }) => {
        return (
          <ItemListCustomer item={item} index={idx} onPress={onGotoCustomerDetail} group={group} />
        );
      },
      [group, onGotoCustomerDetail],
    );

    const onRefresh = useCallback(
      (callback) => {
        setOutOfData(false);
        onGetData(1, true, callback);
      },
      [onGetData],
    );

    useEffect(() => {
      setOutOfData(false);
      onGetData(1);
      const sub = navigation.addListener('willFocus', onRefresh);
      return () => {
        sub?.remove();
      };
    }, [onGetData, onRefresh]);

    useImperativeHandle(ref, () => ({
      setFilter,
      setTab: setGroup,
      onRefresh,
    }));

    return (
      <HFlatList
        ref={flatListRef}
        index={index}
        data={isLoading ? [] : listCustomer}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={onLoadMore}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
      />
    );
  }),
);

export default ListCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  iconEmpty: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
  imageExPriority: {
    marginTop: SH(40),
    width: SW(316),
    height: SH(125),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  imageExLink: {
    height: SH(162),
    width: SW(320),
    alignSelf: 'center',
    resizeMode: 'contain',
    // position: 'absolute',
    marginTop: SH(90),
  },
  listContentContainer: {
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(6),
    paddingHorizontal: 16,
    width: SCREEN_WIDTH,
  },

  loading: {
    marginTop: SH(20),
  },
  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SH(12),
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: SW(8),
    lineHeight: 20,
  },
});
