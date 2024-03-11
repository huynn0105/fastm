import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeaderSection from './HeaderSection';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import Rating from './Rating';
import { getTimeBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getListRating } from '../../../redux/actions/actionsV3/collaboratorAction';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import HTML from 'react-native-render-html';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';

const MAX_STAR = 5;

const parseObjectToArray = (object = {}, reverse) => {
  let ids = Object.keys(object);

  if (!ids?.length) return [];
  let values = Object.values(object);

  if (reverse) {
    ids = [...ids].reverse();
    values = [...values].reverse();
  }

  return ids?.map((id, i) => {
    return {
      id,
      title: values[i],
      isActive: i === 0,
    };
  });
};

const ListCollaboratorReview = memo((props) => {
  const {
    skill,
    tab,
    userId,
    notes,
    headerView,
    callbackFuncLoadMore,
    style,
    headerStyle = {},
    initCategory,
  } = props;

  const dispatch = useDispatch();
  const emptyReviewUrl = useSelector((state) => state?.appInfo?.emptyReviewUrl);

  const [category, setCategory] = useState(parseObjectToArray(skill || {}));
  const [tabs, setTabs] = useState(parseObjectToArray(tab || {}, true));

  const [dataRating, setTotalRating] = useState({});

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [outOfData, setOutOfData] = useState(false);
  const [page, setPage] = useState(0);

  const tabActive = useMemo(() => tabs?.find((item) => item?.isActive)?.id || 'all', [tabs]);

  const skillActive = useMemo(
    () => initCategory || category?.find((item) => item?.isActive)?.id || 'sell',
    [category, initCategory],
  );

  const renderItemCategory = useCallback(({ item }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setCategory((prev) => {
            let newState = [...prev];
            newState = newState.map((it) => {
              if (it?.id === item?.id) {
                return {
                  ...it,
                  isActive: true,
                };
              }
              if (it?.isActive) {
                return {
                  ...it,
                  isActive: false,
                };
              }
              return it;
            });
            return newState;
          });
        }}
      >
        <View
          style={[
            styles.itemCategoryContainer,
            item?.isActive && { backgroundColor: Colors.primary2 },
          ]}
        >
          <AppText style={[styles.itemCategoryText, item?.isActive && { color: Colors.primary5 }]}>
            {item?.title}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
    );
  }, []);
  const renderItemTab = useCallback(({ item, index }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setTabs((prev) => {
            let newState = [...prev];
            newState = newState.map((it) => {
              if (it?.id === item?.id) {
                return {
                  ...it,
                  isActive: true,
                };
              }
              if (it?.isActive) {
                return {
                  ...it,
                  isActive: false,
                };
              }
              return it;
            });
            return newState;
          });
        }}
      >
        <View
          style={[
            styles.itemCategoryContainer,
            { backgroundColor: item?.isActive ? Colors.primary2 : Colors.neutral5 },
            index === 0 && { marginLeft: 16 },
          ]}
        >
          <AppText style={[styles.itemCategoryText, item?.isActive && { color: Colors.primary5 }]}>
            {item?.title}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
    );
  }, []);

  const renderStar = useCallback((_, index) => {
    const numberStar = MAX_STAR - index;

    return (
      <View key={index} style={styles.itemStarContainer}>
        {Array.from({ length: numberStar })?.map((__, idx) => {
          return (
            <View style={{ width: 11, height: 11 }}>
              <Image key={idx} source={ICON_PATH.boldStar} style={styles.iconStar} />
            </View>
          );
        })}
      </View>
    );
  }, []);
  const renderPercentStar = useCallback(
    (_, index) => {
      const numberStar = MAX_STAR - index;

      return (
        <View key={index} style={styles.itemStarContainer}>
          <View style={styles.maxPercent}>
            <View
              style={[styles.percent, { width: `${dataRating?.percent?.[numberStar] || 0}%` }]}
            />
          </View>
        </View>
      );
    },
    [dataRating?.percent],
  );

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <AppText semiBold style={styles.itemTitle}>
          {item?.title?.slice(0, 1).toUpperCase() + item?.title?.slice(1, item?.title?.length)}
        </AppText>
        <View style={styles.itemInfoContainer}>
          <Rating star={item?.rating} />
          <AppText style={styles.itemName}>
            {item?.fullName} - {getTimeBetween(moment(item?.createdDate)?.valueOf())}
          </AppText>
        </View>
        {item?.comment ? <AppText style={styles.itemContent}>{item?.comment}</AppText> : null}
      </View>
    );
  }, []);

  const onGetData = useCallback(
    (isRefreshing) => {
      let newPage;
      const setStateLoading = isRefreshing ? setIsLoading : setIsLoadMore;
      setPage((prev) => {
        if (isRefreshing) {
          newPage = 1;
          setOutOfData(false);
        } else {
          newPage = prev + 1;
        }

        setStateLoading(true);

        dispatch(
          getListRating(userId, tabActive, skillActive, newPage, (isSuccess, result) => {
            setStateLoading(false);
            if (!result?.list?.length) {
              setOutOfData(true);
            }
            if (isSuccess) {
              setData((prevData) => {
                if (isRefreshing) {
                  return result?.list || [];
                } else {
                  return [...prevData, ...(result?.list || [])];
                }
              });
              delete result.list;
              setTotalRating(result);
            }
          }),
        );
        return newPage;
      });
    },
    [dispatch, userId, skillActive, tabActive],
  );

  const renderFooter = useCallback(() => {
    if (isLoadMore) {
      return <ActivityIndicator style={{ marginTop: 8 }} color={Colors.gray5} />;
    } else if (outOfData) {
      return (
        <View style={styles.footerContainer}>
          <AppText style={[styles.footerText, { marginLeft: 0 }]}>Đã tải hết đánh giá</AppText>
        </View>
      );
    }
    return null;
  }, [isLoadMore, outOfData]);

  const onLoadMore = useCallback(() => {
    if (outOfData || isLoadMore) return;
    onGetData();
  }, [isLoadMore, onGetData, outOfData]);

  const onPressEmptyDetail = useCallback(() => {
    if (emptyReviewUrl?.length) {
      Linking.openURL(`${emptyReviewUrl}`);
    }
  }, [emptyReviewUrl]);

  useEffect(() => {
    setTabs(parseObjectToArray(tab, true));
  }, [tab]);

  useEffect(() => {
    setCategory(parseObjectToArray(skill));
  }, [skill]);

  useEffect(() => {
    onGetData(true);
    const onRefresh = () => {
      onGetData(true);
    };

    DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onRefresh);
    return () => {
      DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onRefresh);
    };
  }, [onGetData]);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR_REVIEW,
      onLoadMore,
    );

    callbackFuncLoadMore?.(onLoadMore);

    return () => {
      DeviceEventEmitter.removeListener(
        DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR_REVIEW,
        onLoadMore,
      );
    };
  }, [onLoadMore]);

  return (
    <>
      {headerView || (
        <HeaderSection
          title={'Cộng đồng nghĩ gì về bạn?'}
          elementNote={<HTMLView html={notes} containerStyle={{}} />}
          style={{ ...styles.headerStyle, ...headerStyle }}
        />
      )}
      {category?.length ? (
        <View>
          <FlatList
            data={category}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItemCategory}
            style={styles.listCategory}
          />
        </View>
      ) : null}
      <View style={[styles.cardContainer, style]}>
        <View style={styles.rowCenter}>
          <View style={styles.ratingContainer}>
            <AppText bold style={styles.avgRating}>
              {`${dataRating?.avgRating || 0}`?.replace('.', ',')}
            </AppText>
            <AppText style={styles.maxRating}>/{MAX_STAR} sao</AppText>
          </View>
          <View style={styles.listStar}>{Array.from({ length: MAX_STAR }).map(renderStar)}</View>
          <View style={styles.listPercentStar}>
            {Array.from({ length: MAX_STAR }).map(renderPercentStar)}
          </View>
          <AppText style={styles.countRating}>{dataRating?.amountRating || 0} đánh giá</AppText>
        </View>
        <View style={styles.line} />
        <AppText style={[styles.itemCategoryText, { marginHorizontal: 16 }]}>
          Chi tiết đánh giá
        </AppText>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItemTab}
          style={styles.listCategory}
        />
        {isLoading ? (
          <View style={{ alignItems: 'center', marginTop: 16, height: 70 }}>
            <ActivityIndicator color={Colors.gray5} />
          </View>
        ) : !data?.length ? (
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Image source={ICON_PATH.block} style={{ width: 24, height: 24 }} />
            <AppText
              style={{
                marginTop: 12,
                marginBottom: 30,
                marginHorizontal: 16,
                fontSize: 14,
                lineHeight: 20,
                color: Colors.gray5,
                textAlign: 'center',
              }}
            >
              Không tìm thấy đánh giá nào{'\n\n'}
              “Kỹ năng bán hàng” và “Kỹ năng dẫn dắt” đại diện cho sự thừa nhận của mọi người về
              năng lực và uy tín của bạn,{' '}
              <AppText
                onPress={onPressEmptyDetail}
                semiBold
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: Colors.primary2,
                }}
              >
                tìm hiểu thêm >>
              </AppText>
            </AppText>
          </View>
        ) : (
          <FlatList
            nestedScrollEnabled={false}
            scrollEnabled={false}
            data={[...data]}
            renderItem={renderItem}
            style={styles.list}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>
    </>
  );
});

export default ListCollaboratorReview;

const styles = StyleSheet.create({
  headerStyle: {
    marginTop: 32,
  },
  listCategory: {
    marginVertical: 8,
  },
  itemCategoryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primary5,
    marginRight: 8,
  },
  itemCategoryText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  cardContainer: {
    borderRadius: 12,
    backgroundColor: Colors.primary5,
    marginTop: 12,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avgRating: {
    fontSize: 40,
    lineHeight: 56,
    color: Colors.thirdGreen,
  },
  maxRating: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    top: -5,
  },
  ratingContainer: {
    marginLeft: 24,
    marginTop: 16,
    alignItems: 'center',
    width: 65,
  },
  listStar: {
    alignItems: 'flex-end',
    marginLeft: 24,
  },
  itemStarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 14,
    justifyContent: 'center',
  },
  iconStar: {
    tintColor: Colors.gray8,
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  listPercentStar: {
    flex: 1,
    marginLeft: 12,
    marginRight: 16,
  },
  itemPercentStarContainer: {
    height: 14,
    width: '100%',
  },
  maxPercent: {
    width: '100%',
    height: 4,
    borderRadius: 8,
    backgroundColor: Colors.gray4,
  },
  percent: {
    height: 4,
    borderRadius: 8,
    backgroundColor: Colors.gray8,
    position: 'absolute',
  },
  countRating: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    position: 'absolute',
    bottom: -7,
    right: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray4,
    marginTop: 18,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  titleDetailRating: {},
  list: {
    marginBottom: 16,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: Colors.neutral5,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  itemName: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.gray5,
  },
  itemContent: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray1,
    marginTop: 10,
  },
  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: 8,
    lineHeight: 20,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  elementContainer: {
    flexDirection: 'row',
  },
});
