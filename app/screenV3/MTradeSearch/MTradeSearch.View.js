import { FlatList, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchInput from '../../componentV3/SearchInput/SearchInput';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import ButtonText from '../../common/ButtonText';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListMTradeTextSearch,
  resetTextSearch,
  setTextSearch,
} from '../../redux/actions/actionsV3/mtradeAction';
import ListLoading from '../../componentV3/ListComponents/ListLoading';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SH } from '../../constants/styles';

const MTradeSearch = memo((props) => {
  const { navigation } = props;

  const dispatch = useDispatch();

  const textSearch = useSelector((state) => state?.mtradeReducer?.textSearch);

  const isBack = useMemo(
    () => navigation?.state?.params?.isBack,
    [navigation?.state?.params?.isBack],
  );

  const [text, setText] = useState(textSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const timeout = useRef(null);

  const onGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const clearSearchAndGoBack = useCallback(() => {
    dispatch(resetTextSearch());
    navigation?.goBack();
  }, [dispatch, navigation]);

  const onPressItem = useCallback(
    (item) => {
      dispatch(setTextSearch(item));
      if (isBack) {
        navigation?.goBack();
      } else {
        navigation?.goBack();
        navigation?.navigate('MTradeListProduct');
      }
    },
    [dispatch, isBack, navigation],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableWithoutFeedback onPress={() => onPressItem(item)}>
          <View style={styles.itemContainer}>
            <AppText style={styles.itemText} medium>
              {item}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [onPressItem],
  );

  const renderEmpty = useCallback(() => {
    if (!text?.length || isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Image source={IMAGE_PATH.mascotSleep} style={styles.mascot} />
        <AppText style={styles.emptyText}>Không tìm thấy sản phẩm liên quan</AppText>
        <ButtonText
          title={'Tiếp tục mua hàng'}
          fontSize={16}
          lineHeight={24}
          medium
          onPress={onGoBack}
          top={16}
          height={50}
        />
      </View>
    );
  }, [isLoading, onGoBack, text?.length]);

  const renderHeader = useCallback(() => {
    if (!isLoading || data?.length) return null;
    return <ListLoading title={'Đang tải'} />;
  }, [data?.length, isLoading]);

  const onGetData = useCallback(
    (_text) => {
      dispatch(
        getListMTradeTextSearch(_text, (isSuccess, results) => {
          if (isSuccess) {
            setData(results);
          }
          setIsLoading(false);
        }),
      );
    },
    [dispatch],
  );

  const onChangeText = useCallback(
    (_text) => {
      setText(_text);
      if (_text?.length > 0) {
        setIsLoading(true);
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }

        timeout.current = setTimeout(() => {
          onGetData(_text);
          clearTimeout(timeout.current);
          timeout.current = null;
        }, 500);
      } else {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        setIsLoading(false);
        setData([]);
      }
    },
    [onGetData],
  );

  useEffect(() => {
    if (textSearch) {
      setIsLoading(true);
      onGetData(textSearch);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          containerStyle={styles.search}
          placeholder={'Tìm kiếm'}
          autoFocus
          onChangeText={onChangeText}
          value={text}
          onSubmitEditing={onPressItem}
        />
        <AppText onPress={clearSearchAndGoBack} medium style={styles.textCancel}>
          Hủy
        </AppText>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.listContainer}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT + SH(6) }}
      />
    </View>
  );
});

export default MTradeSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: { height: 36 },
  textCancel: {
    marginRight: 20,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
  },
  listContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  itemContainer: {
    height: 48,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary5,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  emptyContainer: {
    marginTop: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  mascot: {
    width: 140,
    height: 140,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.gray1,
  },
});

const MOCKING_DATA = [
  'Điện thoại 1',

  'Điện thoại 2',

  'Điện thoại 3',

  'Điện thoại 4',

  'Điện thoại 5',

  'Điện thoại 6',

  'Điện thoại 7',

  'Điện thoại 8',

  'Điện thoại 9',

  'Điện thoại 10',

  'Điện thoại 11',

  'Điện thoại 12',

  'Điện thoại 13',

  'Điện thoại 14',

  'Điện thoại 15',
];
