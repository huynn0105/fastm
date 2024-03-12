import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import SearchInput from '../../../componentV3/SearchInput/SearchInput';
import ItemCollaborator from '../components/ItemCollaborator';
import ListEmpty from '../../../componentV3/ListComponents/ListEmpty';
import { BOTTOM_BAR_HEIGHT } from '../../../screens2/Root/Tabbar';
import { SH } from '../../../constants/styles';
import { useDispatch } from 'react-redux';
import { getListMTradeIndirectBonus } from '../../../redux/actions/actionsV3/mtradeAction';
import ListLoading from '../../../componentV3/ListComponents/ListLoading';
import moment from 'moment';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HFlatList = HPageViewHoc(FlatList);

const LIST_LEVEL = [
  { id: '', title: 'Tất cả' },
  { id: '1', title: 'Tầng 1' },
  { id: '2', title: 'Tầng 2' },
  { id: '3', title: 'Tầng 3' },
  { id: '4', title: 'Tầng 4' },
  { id: '5', title: 'Tầng 5' },
  { id: '6', title: 'Tầng 6' },
  { id: '7', title: 'Tầng 7' },
];

const OrderIndirect = memo(
  forwardRef((props, ref) => {
    const { index, navigation } = props;

    const dispatch = useDispatch();

    const timeout = useRef(null);

    const [data, setData] = useState([]);
    const [month, setMonth] = useState(null);
    const [textSearch, setTextSearch] = useState('');
    const [level, setLevel] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [outOfData, setOutOfData] = useState(false);

    const onPressItem = useCallback(
      (item) => () => {
        navigation.navigate('MTradeDetailCollaborator', {
          collaborator: {
            ID: item?.saleID,
            avatarImage: item?.avatarImage,
            mobilePhone: item?.mobilePhone,
          },
        });
      },
      [navigation],
    );

    const renderTab = useCallback(
      (item, _index) => {
        const isSelected = item?.id === level;
        return (
          <TouchableOpacity
            key={item?.id}
            style={[styles.itemTabContainer, isSelected && { backgroundColor: Colors.primary2 }]}
            onPress={() => {
              setData([]);
              setLevel(item?.id);
            }}
          >
            <AppText
              medium={isSelected}
              style={[styles.itemTabTitle, { color: isSelected ? Colors.primary5 : Colors.gray5 }]}
            >
              {item?.title}
            </AppText>
          </TouchableOpacity>
        );
      },
      [level],
    );

    const onChangeText = useCallback((_text) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
      timeout.current = setTimeout(() => {
        setData([]);
        setTextSearch(_text);
        timeout.current = null;
      }, 500);
    }, []);

    const renderHeader = useCallback(() => {
      return (
        <>
          <AppText semiBold style={[styles.title, { marginTop: 16 }]}>
            Thống kê theo Cộng tác viên của bạn
          </AppText>
          <SearchInput
            placeholder={'Tìm theo nickname'}
            containerStyle={styles.searchContainer}
            style={styles.searchInput}
            onChangeText={onChangeText}
          />
          <ScrollView
            style={styles.listTabContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {LIST_LEVEL?.map(renderTab)}
          </ScrollView>
        </>
      );
    }, [onChangeText, renderTab]);

    const renderEmpty = useCallback(() => {
      if (isLoading) {
        return <ListLoading title={'Đang tải...'} />;
      }

      return (
        <ListEmpty
          isMascot
          style={{ marginTop: 24 }}
          title={'Hiện tại chưa phát sinh thu nhập từ\ncộng tác viên của bạn'}
        />
      );
    }, [isLoading]);

    const renderFooter = useCallback(() => {
      if (isLoadingMore) {
        return <ListLoading title={'Đang tải thêm...'} />;
      }

      return null;
    }, [isLoadingMore]);

    const renderItem = useCallback(
      ({ item, index: _index }) => {
        return <ItemCollaborator onPressItem={onPressItem(item)} item={item} index={_index} />;
      },
      [onPressItem],
    );

    useImperativeHandle(ref, () => ({
      setMonth: (_month) => {
        setMonth((prevState) => {
          if (!prevState || !moment(prevState).isSame(moment(_month), 'month')) {
            setData([]);
            return _month;
          }
          return prevState;
        });
      },
    }));

    const onGetData = useCallback(
      (_page, callback) => {
        if (!month) {
          callback?.();
          return;
        }
        setPage(_page);
        const payload = {
          month: moment(month).format('MM'),
          year: moment(month).format('YYYY'),
          page: _page,
          filter_level: level,
          filter_text: textSearch,
        };
        dispatch(
          getListMTradeIndirectBonus(payload, (isSuccess, results) => {
            if (isSuccess) {
              setData((prev) => (_page === 1 ? [...results] : [...prev, ...results]));
            }
            if (!isSuccess || !results?.length) {
              setOutOfData(true);
            }
            callback?.();
          }),
        );
      },
      [dispatch, level, month, textSearch],
    );

    const onLoadMore = useCallback(() => {
      if (isLoadingMore || outOfData) return;
      setIsLoadingMore(true);
      const newPage = page + 1;
      onGetData(newPage, () => {
        setIsLoadingMore(false);
      });
    }, [isLoadingMore, onGetData, outOfData, page]);

    useEffect(() => {
      setIsLoading(true);
      setOutOfData(false);
      onGetData(1, () => {
        setIsLoading(false);
      });
    }, [onGetData]);

    return (
      <HFlatList
        index={index}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
      />
    );
  }),
);

export default OrderIndirect;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: BOTTOM_BAR_HEIGHT + SH(6),
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  listTabContainer: {
    marginTop: 12,
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
  searchContainer: {
    marginTop: 8,
    marginHorizontal: 0,
  },
  searchInput: {
    height: 40,
  },
});
