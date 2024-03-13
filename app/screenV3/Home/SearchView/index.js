import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import NewsRow from '../../../common/NewsRow';
import AppText from '../../../componentV3/AppText';
import { AsyncStorageKeys } from '../../../constants/keys';
import { SH, SW } from '../../../constants/styles';
import DigitelClient from '../../../network/DigitelClient';
import Colors from '../../../theme/Color';
import { removeVietnameseTones } from '../../../tracking/Firebase';
import isIphone12 from '../../../utils/iphone12Helper';
import HeaderNewsBar from '../../News/components/HeaderNewsBar';
import { listMenu } from '../../News/News.View';
import { SEARCH_HEIGHT, USER_INFO_HEIGHT } from '../constants';
const { debounce } = _;

const SearchView = ({ opacity, zIndex, keyword, navigation, listFinance, shopV2Items, top }) => {
  const [listNews, setListNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listRecent, setListRecent] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const listHighlightsProject = useSelector((state) => state?.userConfigs?.highLightProjects);
  const [listProductsSearch, setListProductsSearch] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceLoadNews = useCallback(
    debounce((key) => {
      fetchListNews(key);
    }, 800),
    [],
  );
  useEffect(() => {
    combineListProject();
    searchLocal();
    const getDataRecentSearch = async () => {
      try {
        const listRecentSearch = await AsyncStorage.getItem(AsyncStorageKeys.RECENT_SEARCH);
        const _listRecentSearch = JSON.parse(listRecentSearch);
        console.log('1111', _listRecentSearch);
        setListRecent(_listRecentSearch);
      } catch (error) {
        if (__DEV__) {
          console.log('error json', error);
        }
      }
    };
    setTimeout(() => {
      getDataRecentSearch();
    }, 100);
  }, []);
  useEffect(() => {
    if (keyword.length > 0) {
      setIsLoading(true);
      searchLocal(keyword);
      debounceLoadNews(keyword);
    }
  }, [keyword]);

  useEffect(() => {
    combineListProject();
  }, [shopV2Items.length, listFinance.length]);

  const fetchListNews = async (key) => {
    const data = await DigitelClient.fetchListNewsFromKeyword(key);
    setListNews(data);
    setIsLoading(false);
    return data;
  };
  const onPressItem = async (title, url, needToSave = false, icon = '', id = '') => {
    Keyboard.dismiss();
    if (needToSave) {
      try {
        const listRecentSearch = await AsyncStorage.getItem(AsyncStorageKeys.RECENT_SEARCH);
        let listSearch = JSON.parse(listRecentSearch);
        if (!listSearch) {
          listSearch = [];
        }
        const checkDuplicate = listSearch.findIndex((item) => item?.id === id);
        if (checkDuplicate === -1) {
          listSearch.unshift({ title, url, icon, id });
        } else {
          const indexToMove = listSearch.findIndex((item) => item?.id === id);
          listSearch.unshift(listSearch.splice(indexToMove, 1)[0]);
        }
        setListRecent(listSearch);
        await AsyncStorage.setItem(AsyncStorageKeys.RECENT_SEARCH, JSON.stringify(listSearch));
      } catch (error) {
        if (__DEV__) {
          console.log('error', error);
        }
      }
    }
    if (url?.length) {
      navigation.navigate('WebView', { mode: 0, title, url });
    }
  };

  console.log('aaa-47', JSON.stringify(listHighlightsProject));

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity onPress={() => onPressItem(item?.title, item?.url)}>
          <View
            style={{
              width: SW(77),
              marginLeft: index === 0 ? 0 : SW(12),
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: item?.icon }}
              style={{ width: SW(32), height: SH(32), resizeMode: 'contain' }}
            />
            <AppText
              style={[
                styles.itemTextStyle,
                { paddingHorizontal: SW(4), marginTop: SH(12), textAlign: 'center' },
              ]}
            >
              {item.title}
            </AppText>
          </View>
        </TouchableOpacity>
      );
    },
    [listHighlightsProject],
  );

  const renderNullKeyword = () => {
    return (
      <View style={{ marginTop: SH(16) }}>
        <AppText style={styles.textStyle}>Sản phẩm nổi bật</AppText>
        <FlatList
          data={listHighlightsProject}
          keyExtractor={(item) => `${item.url}`}
          renderItem={renderItem}
          horizontal
          style={{ marginTop: SH(12), maxWidth: SW(343) }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps={'handled'}
        />
        <KeyboardAwareScrollView
          style={styles.containerRecentSearchData}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
        >
          <AppText style={[styles.textStyle, { marginBottom: SH(18) }]}>Tìm kiếm gần đây</AppText>
          {listRecent?.slice(0, 5)?.map((item, index) => {
            return renderProductItemRecent(item, index);
          })}
        </KeyboardAwareScrollView>
      </View>
    );
  };
  const convertObjectNews = (item) => {
    const mediaObject = item?._embedded;
    const source = mediaObject?.['wp:featuredmedia'];
    return {
      categories: item?.categories,
      createdDate: new Date(item?.modified).getTime() / 1000,
      hashtag: item?.category_name,
      isHighlight: 0,
      postID: item?.id,
      postImage: source?.[0]?.source_url,
      postTitle: item?.title?.rendered,
      sortPosition: 1,
      totalViews: item?.views,
      webURL: item?.link,
    };
  };

  const renderNewsItem = ({ item, index }) => {
    const newsItemStandard = convertObjectNews(item);
    return (
      <View style={{}}>
        <NewsRow
          news={newsItemStandard}
          onPress={() => {
            onPressItem(newsItemStandard?.postTitle, newsItemStandard?.webURL);
          }}
        />
        {index !== listNews.length - 1 ? (
          <View style={styles.divider} />
        ) : (
          <View style={{ height: SH(16) }} />
        )}
      </View>
    );
  };
  const renderProductItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.searchProductBox, { paddingVertical: index !== 0 ? SH(12) : 0 }]}
        onPress={() =>
          onPressItem(
            item?.url_title || item?.title,
            item?.url,
            item?.tag_name?.length > 0 ? true : false,
            item?.icon,
            item.id ? item.id : item.tag_name,
          )
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: item?.icon || item?.iconURL }}
            style={{ width: SW(32), height: SH(32), resizeMode: 'contain' }}
          />
          <AppText style={[styles.bigTextStyle, { marginLeft: SW(12) }]}>{item?.title}</AppText>
        </View>
        <Image source={ICON_PATH.arrow_right} />
      </TouchableOpacity>
    );
  };
  const renderProductItemRecent = (item, index) => {
    return (
      <TouchableOpacity
        style={[styles.searchProductBox, { paddingVertical: index !== 0 ? SH(12) : 0 }]}
        onPress={() =>
          onPressItem(
            item?.url_title || item?.title,
            item?.url,
            item?.tag_name?.length > 0 ? true : false,
            item?.icon,
            item.id ? item.id : item.tag_name,
          )
        }
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: item?.icon || item?.iconURL }}
            style={{ width: SW(32), height: SH(32), resizeMode: 'contain' }}
          />
          <AppText style={[styles.bigTextStyle, { marginLeft: SW(12) }]}>{item?.title}</AppText>
        </View>
        <Image source={ICON_PATH.arrow_right} />
      </TouchableOpacity>
    );
  };
  const renderListSearch = () => {
    const listNewsRender =
      selectedIndex === 0
        ? listNews
        : selectedIndex === 2
        ? listNews.filter((news) => listMenu[selectedIndex].children.includes(news?.category_name))
        : listNews.filter((news) => news?.category_name === listMenu[selectedIndex].title);
    return (
      <ScrollView style={{ marginTop: SH(18) }} keyboardShouldPersistTaps={'handled'}>
        <View style={{}}>
          <AppText style={[styles.textStyle, { marginBottom: SH(8) }]}>Kết quả tìm kiếm</AppText>
          {isLoadingLocal ? (
            <View
              style={{
                height: SH(54),
                justifyContent: 'center',
                marginTop: SH(24),
              }}
            >
              <ActivityIndicator color={Colors.primary2} size={'large'} />
            </View>
          ) : (
            <FlatList
              data={listProductsSearch}
              renderItem={renderProductItem}
              keyExtractor={(item, index) => `${item?.tag_name}${index}`}
              ListEmptyComponent={() => renderEmptySearch('Không tìm thấy sản phẩm liên quan')}
              keyboardShouldPersistTaps={'handled'}
            />
          )}
          <View style={{ marginBottom: SH(8), marginTop: SH(24) }}>
            <AppText style={styles.textStyle}>Tin tức, kiến thức liên quan</AppText>
          </View>
          <View style={{ marginBottom: SH(20) }}>
            <HeaderNewsBar
              data={listMenu}
              onIndexChange={(index, item) => {
                setSelectedIndex(index);
              }}
              defaultIndex={0}
            />
          </View>
        </View>
        {isLoading ? (
          <View style={{ marginTop: SH(120) }}>
            <ActivityIndicator color={Colors.primary2} size={'large'} />
          </View>
        ) : (
          <FlatList
            data={listNewsRender}
            renderItem={renderNewsItem}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => renderEmptySearch('Không có tin tức, kiến thức liên quan')}
            keyboardShouldPersistTaps={'handled'}
          />
        )}
      </ScrollView>
    );
  };

  const renderEmptySearch = useCallback(
    (text) => {
      return (
        <View style={{ alignItems: 'center', marginTop: SH(24) }}>
          <Image
            source={ICON_PATH.iconNull}
            style={{ width: SW(24), height: SH(24), resizeMode: 'contain' }}
          />
          <AppText
            style={{ fontSize: SH(13), lineHeight: SH(18), color: Colors.gray2, marginTop: SH(12) }}
          >
            {text}
          </AppText>
        </View>
      );
    },
    [keyword],
  );
  const combineListProject = () => {
    let arrayShopV2 = [];
    shopV2Items?.forEach((item) => {
      const temp = item?.items || [];
      return arrayShopV2.push(...temp);
    });
    console.log('aaa-43', JSON.stringify(listFinance));
    const listFull = listFinance?.items?.concat(arrayShopV2);
    return listFull;
  };

  const searchLocal = (keyword) => {
    const listFull = combineListProject();
    const listSearch = [];
    if (!listFull || listFull.length === 0) {
      return;
    }
    setIsLoadingLocal(true);
    listFull?.forEach((item) => {
      const _title = removeVietnameseTones(item?.title.toLowerCase());
      const _keyword = removeVietnameseTones(keyword?.toLowerCase());
      if (_title?.includes(_keyword)) {
        listSearch.push(item);
      }
      return item;
    });
    setTimeout(() => {
      setIsLoadingLocal(false);
    }, 300);
    setListProductsSearch(listSearch);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={[styles.container, { opacity: opacity, zIndex: zIndex, top }]}>
        {keyword?.length === 0 ? renderNullKeyword() : renderListSearch()}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: Colors.actionBackground,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SW(16),
    // alignItems: 'center',
    // zIndex: -1,
  },
  buttonStyle: {
    width: '100%',
    height: SH(40),
    backgroundColor: 'yellow',
  },
  textStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray2,
  },
  itemTextStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray1,
    textAlign: 'center',
  },
  containerRecentSearchData: {
    marginTop: SH(32),
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#cfd3d6',
    marginVertical: SH(16),
  },
  searchProductBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SH(12),
    // height: SH(36),
  },
  bigTextStyle: {
    color: Colors.gray1,
    fontSize: SH(16),
    lineHeight: SH(22),
  },
});

export default SearchView;
