import { Alert, Animated, Image, Linking, StyleSheet, Text, UIManager, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import Swiper from 'react-native-deck-swiper';
import { useDispatch, useSelector } from 'react-redux';
import CardView from './components/CardView';
import Colors from '../../theme/Color';
import CardViewEmpty from './components/CardViewEmpty';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import {
  addPriorityCustomer,
  clearTrashCustomer,
  getListCustomer,
  removePriorityCustomer,
  trashCustomer,
  updateCustomer,
} from '../../redux/actions/actionsV3/customerAction';
import { TAB_TYPE } from '../Customer/Customer.constants';
import ModalUpdateInfoCustomer from './components/ModalUpdateInfoCustomer';
import { showInfoAlert } from '../../utils/UIUtils';
import Loading from '../../componentV3/LoadingModal';
import { useEffect } from 'react';
import ImageUtils from '../../utils/ImageUtils';
import ModalListImage from './components/ModalListImage';
import ModalProject from './components/ModalProject';
import BottomSheetReferral from '../../componentV3/BottomSheetReferral/BottomSheetReferral';
import HeaderCustomerDetail from './components/HeaderCustomerDetail';
import { IS_ANDROID, isDeepLink } from '../../utils/Utils';
import CardViewGuide from './components/CardViewGuide';
import ModalAlertCustomerPending from './components/ModalAlertCustomerPending';
import { AsyncStorageKeys } from '../../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CustomerDetailNew = memo((props) => {
  const { navigation } = props;

  const customerID = useMemo(
    () => navigation?.state?.params?.params?.ID,
    [navigation?.state?.params?.params?.ID],
  );

  const itemID = useMemo(
    () => navigation?.state?.params?.params?.itemID,
    [navigation?.state?.params?.params?.itemID],
  );

  const group = useMemo(() => navigation?.state?.params?.group, [navigation?.state?.params?.group]);
  const initIndex = useMemo(
    () => navigation?.state?.params?.index,
    [navigation?.state?.params?.index],
  );

  const isFromDeeplink = useMemo(() => customerID && !group, [customerID, group]);

  const onLoadMore = useMemo(
    () => navigation?.state?.params?.onLoadMore,
    [navigation?.state?.params?.onLoadMore],
  );

  const idLink = useMemo(
    () => navigation?.state?.params?.idLink,
    [navigation?.state?.params?.idLink],
  );

  const isCustomerPending = useMemo(
    () => group === TAB_TYPE.PAGE || isFromDeeplink,
    [group, isFromDeeplink],
  );
  const isCustomerTrash = useMemo(() => group === TAB_TYPE.TRASH, [group]);

  const dispatch = useDispatch();

  const swiperRef = useRef();
  const offsetSwipe = useRef(0);
  const animated = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef();
  const bottomSheetListImageRef = useRef();
  const bottomSheetProjectRef = useRef();
  const bottomSheetReferralRef = useRef();
  const modalAlertCustomerPendingRef = useRef();

  const isHideAlertPriorityCustomerPending = useRef(false);
  const isHideAlertTrashCustomerPending = useRef(false);

  const [indexCustomer, setIndexCustomer] = useState(initIndex || 0);
  const [cardHeight, setCardHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(
    isCustomerPending
      ? {
          [TAB_TYPE.PAGE]: idLink ? [idLink] : [],
        }
      : {},
  );

  const [, setPage] = useState(1);
  const [outOfData, setOutOfData] = useState(false);

  const onGetListCustomer = useCallback(
    (_page = 1, callback) => {
      const params = {
        page: _page,
        per_page: 20,
        group,
        ...filter,
      };

      setPage(_page);
      dispatch(
        getListCustomer(params, (isSuccess, results) => {
          if (!isSuccess || !results?.length) {
            setOutOfData(true);
          }

          if (typeof callback === 'function') callback?.(isSuccess, results);
        }),
      );
    },
    [dispatch, filter, group],
  );
  const onLoadMoreListCustomer = useCallback(
    (callback) => {
      if (!isCustomerPending && !isCustomerTrash) {
        onLoadMore?.(() => {
          setIsLoading(false);
        });
        return;
      }
      if (outOfData) return callback?.();
      setPage((prevState) => {
        const newPage = prevState + 1;
        onGetListCustomer(newPage, callback);
        return prevState;
      });
    },
    [isCustomerPending, isCustomerTrash, onGetListCustomer, onLoadMore, outOfData],
  );

  const listCustomer = useSelector((state) =>
    isFromDeeplink
      ? [{ ID: customerID, itemID }]
      : (group === TAB_TYPE.PAGE
          ? state?.customerReducer?.listCustomerPending
          : group === TAB_TYPE.TRASH
          ? state?.customerReducer?.listCustomerTrash
          : state?.customerReducer?.listCustomer) || [],
  );
  const maxIndexCustomer = useMemo(() => listCustomer?.length - 1, [listCustomer?.length]);
  const customer = useMemo(() => listCustomer[indexCustomer], [indexCustomer, listCustomer]);

  const onPriority = useCallback(
    (item, isPriority, callback) => {
      if (isPriority) {
        dispatch(removePriorityCustomer(item, callback, group));
      } else {
        dispatch(addPriorityCustomer(item, callback, group));
      }
    },
    [dispatch, group],
  );

  const onPriorityAndNext = useCallback((item, isPriority, callback) => {
    offsetSwipe.current = 10;
    swiperRef?.current?.swipeRight();
  }, []);

  const onTrash = useCallback(
    (item) => {
      const payload = {
        ID: item?.ID,
        permanentlyDeleted: false,
      };
      dispatch(trashCustomer(payload));
    },
    [dispatch],
  );

  const onTrashAndNext = useCallback((item) => {
    offsetSwipe.current = -10;
    swiperRef?.current?.swipeLeft();
  }, []);

  const onUpdateInfo = useCallback(
    (_payload, localPayload, callback, hideLoading) => {
      bottomSheetRef?.current?.close();
      const payload = {
        ..._payload,
        ID: customer?.ID,
      };

      setTimeout(() => {
        !hideLoading && setIsLoading(true);
        dispatch(
          updateCustomer(
            payload,
            (isSuccess, message) => {
              showInfoAlert(message);
              !hideLoading && setIsLoading(false);
              callback?.(isSuccess, message);
            },
            localPayload,
            group,
          ),
        );
      }, 500);
    },
    [customer?.ID, dispatch, group],
  );

  const onPressUpdateAvatar = useCallback(
    (callback) => {
      ImageUtils.pickAndUploadImage(
        'photo',
        512,
        512,
        (step) => {
          console.log('\u001B[36m -> file: CardView.js -> line 290 -> step', step);
        },
        (processing) => {
          console.log('\u001B[36m -> file: CardView.js -> line 293 -> processing', processing);
        },
        (step, error) => {
          console.log('\u001B[36m -> file: CardView.js -> line 297 -> error', error);
        },
        (result) => {
          result ? onUpdateInfo({ avatar: result }, {}, callback, true) : callback?.();
        },
      );
    },
    [onUpdateInfo],
  );

  const onPressListImage = useCallback((listImage, imageSelected) => {
    bottomSheetListImageRef?.current?.open(listImage, imageSelected);
  }, []);
  const onPressProject = useCallback((project) => {
    bottomSheetProjectRef.current.open(project, `${project?.projectName}`);
  }, []);

  const onPressProjectWaiting = useCallback(
    (project) => {
      if (isDeepLink(project?.url_detail)) {
        Linking.openURL(project?.url_detail);
      } else {
        navigation.navigate('WebView', {
          mode: 0,
          title: project?.url_title || '',
          url: project?.url_detail,
        });
      }
    },
    [navigation],
  );

  const onPressUpdateInfo = useCallback((type, data) => {
    bottomSheetRef?.current?.open(type, data);
  }, []);

  const onOpenBottomSheetReferral = useCallback((item) => {
    bottomSheetReferralRef?.current?.open(item);
  }, []);

  const overlayLabels = useMemo(
    () =>
      isCustomerPending
        ? {
            left: {
              element: (
                <View
                  style={{
                    transform: [
                      {
                        rotate: '45deg',
                      },
                    ],
                    backgroundColor: '#fbdada',
                    borderWidth: 1,
                    borderColor: '#e93535',
                    borderRadius: 8,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: 0.8,
                  }}
                >
                  <Image
                    source={ICON_PATH.trash3}
                    style={{ width: 24, height: 24, resizeMode: 'contain', marginRight: 2 }}
                  />
                  <AppText
                    bold
                    style={{
                      color: Colors.sixRed,
                      fontSize: 16,
                      lineHeight: 22,
                      top: 2,
                    }}
                  >
                    BỎ QUA
                  </AppText>
                </View>
              ),
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 45,
                  marginLeft: -20,
                  zIndex: 999,
                },
              },
            },
            right: {
              element: (
                <View
                  style={{
                    transform: [
                      {
                        rotate: '-45deg',
                      },
                    ],
                    backgroundColor: '#d6fff4',
                    borderWidth: 1,
                    borderColor: '#00cc94',
                    borderRadius: 8,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    opacity: 0.8,
                  }}
                >
                  <Image
                    source={ICON_PATH.boldStar}
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      marginRight: 2,
                      tintColor: '#00cc94',
                    }}
                  />
                  <AppText
                    bold
                    style={{
                      color: '#00cc94',
                      fontSize: 16,
                      lineHeight: 28,
                      top: 2,
                    }}
                  >
                    TIỀM NĂNG
                  </AppText>
                </View>
              ),
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 50,
                  marginLeft: 10,
                  zIndex: 999,
                },
              },
            },
          }
        : {},
    [isCustomerPending],
  );

  const renderItem = useCallback(
    (item, index) => {
      return (
        <CardView
          cardHeight={cardHeight}
          item={item}
          navigation={navigation}
          onPriority={onPriority}
          onPressUpdateInfo={onPressUpdateInfo}
          onPressUpdateAvatar={onPressUpdateAvatar}
          onPressListImage={onPressListImage}
          onPressProject={onPressProject}
          onPressProjectWaiting={onPressProjectWaiting}
          onReferral={onOpenBottomSheetReferral}
          isCustomerPending={isCustomerPending}
          onTrashAndNext={onTrashAndNext}
          onPriorityAndNext={onPriorityAndNext}
        />
      );
    },
    [
      cardHeight,
      navigation,
      onPriority,
      onPressUpdateInfo,
      onPressUpdateAvatar,
      onPressListImage,
      onPressProject,
      onPressProjectWaiting,
      onOpenBottomSheetReferral,
      isCustomerPending,
      onTrashAndNext,
      onPriorityAndNext,
    ],
  );

  const onSwiping = useCallback((x, y) => {
    offsetSwipe.current = x;
  }, []);

  const onSwiped = useCallback(
    (_, isConfirm = true) => {
      const isPrev = offsetSwipe.current > 0;
      if (isConfirm) {
        // Check show modal confirm
        if (!isPrev && isCustomerPending && !isHideAlertTrashCustomerPending.current) {
          modalAlertCustomerPendingRef?.current?.open(TAB_TYPE.TRASH);
          return;
        }
        if (isPrev && isCustomerPending && !isHideAlertPriorityCustomerPending.current) {
          modalAlertCustomerPendingRef?.current?.open(TAB_TYPE.PRIORITY);
          return;
        }
      }

      const newIndexCustomer = indexCustomer + (isPrev && !isCustomerPending ? -1 : 1);
      setIndexCustomer(newIndexCustomer);
      offsetSwipe.current = 0;
      if (isCustomerPending) {
        isPrev ? onPriority(customer, Number(customer?.isPrioritized) > 0) : onTrash(customer);
      }
      if (newIndexCustomer === maxIndexCustomer) {
        setIsLoading(true);
        onLoadMoreListCustomer(() => {
          setIsLoading(false);
        });
      }
    },
    [
      customer,
      indexCustomer,
      isCustomerPending,
      maxIndexCustomer,
      onLoadMoreListCustomer,
      onPriority,
      onTrash,
    ],
  );

  const onLayoutCard = useCallback((event) => {
    setCardHeight(event?.nativeEvent?.layout?.height);
  }, []);

  const keyExtractor = useCallback((it) => it?.ID, []);

  const insets = useSafeAreaInsets();

  const getSpaceBottom = useMemo(() => insets?.bottom || 32, [insets?.bottom]);

  const onChangeFilter = useCallback((_filter) => {
    setFilter(_filter);
  }, []);

  const onTrashAll = useCallback(
    (isDelete) => {
      setTimeout(() => {
        setIsLoading(true);
        const payload = {
          permanentlyDeleted: isDelete,
          deleteAll: true,
        };
        dispatch(
          trashCustomer(
            payload,
            () => {
              setIsLoading(false);
            },
            group,
          ),
        );
      }, 500);
    },
    [dispatch, group],
  );

  const onDeleteAllTrash = useCallback(
    (isDelete) => {
      setTimeout(() => {
        setIsLoading(true);

        dispatch(
          clearTrashCustomer((isSuccess) => {
            setIsLoading(false);
          }, group),
        );
      }, 500);
    },
    [dispatch, group],
  );

  const checkModalAlertCustomerPending = useCallback(() => {
    AsyncStorage.getItem(AsyncStorageKeys.IS_HIDE_ALERT_PRIORITY_CUSTOMER_PENDING).then((value) => {
      isHideAlertPriorityCustomerPending.current = JSON.parse(value);
    });
    AsyncStorage.getItem(AsyncStorageKeys.IS_HIDE_ALERT_TRASH_CUSTOMER_PENDING).then((value) => {
      isHideAlertTrashCustomerPending.current = JSON.parse(value);
    });
  }, []);

  useEffect(() => {
    if (isCustomerPending) {
      checkModalAlertCustomerPending();
    }
  }, [checkModalAlertCustomerPending, isCustomerPending]);

  useEffect(() => {
    if (isCustomerPending || isCustomerTrash) {
      setIsLoading(true);
      setOutOfData(false);
      onGetListCustomer(1, () => {
        setIsLoading(false);
      });
    }
  }, [group, isCustomerPending, isCustomerTrash, onGetListCustomer]);

  useEffect(() => {
    if (isFromDeeplink) {
      navigation?.setParams({
        title: 'Khách hàng chờ xử lý',
      });
    }
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: getSpaceBottom }]}>
      {(isCustomerPending || isCustomerTrash) && !isFromDeeplink ? (
        <HeaderCustomerDetail
          onChangeFilter={onChangeFilter}
          filter={filter}
          // number={totalNum || 0}
          // group={group}
          onDelete={isCustomerPending ? onTrashAll : onDeleteAllTrash}
          goToTrash={() => {
            navigation?.push('CustomerDetail', {
              group: TAB_TYPE.TRASH,
              title: 'Khách hàng bỏ qua',
            });
          }}
          isCustomerTrash={isCustomerTrash}
        />
      ) : null}
      <View style={styles.cardContainer}>
        <View onLayout={onLayoutCard} style={styles.cardEmptyContainer}>
          <CardViewEmpty
            animated={animated}
            outOfList={!customer}
            isHideArrow={isCustomerPending}
            navigation={navigation}
            hasCustomer={listCustomer?.length}
          />
        </View>
        {customer?.ID && cardHeight ? (
          <Swiper
            ref={swiperRef}
            cards={[customer]}
            key={`${customer?.ID}`}
            renderCard={renderItem}
            onSwiped={onSwiped}
            backgroundColor={`rgba(0,0,0,0)`}
            stackSize={1}
            cardIndex={0}
            cardHorizontalMargin={16}
            cardVerticalMargin={0}
            verticalSwipe={false}
            goBackToPreviousCardOnSwipeLeft={false}
            showSecondCard={false}
            onSwiping={Animated.event([animated], {
              useNativeDriver: false,
              listener: onSwiping,
            })}
            keyExtractor={keyExtractor}
            infinite={false}
            overlayLabels={overlayLabels}
            disableRightSwipe={!isCustomerPending && Number(indexCustomer) === 0}
          />
        ) : null}
        <CardViewGuide cardHeight={cardHeight} isCustomerPending={isCustomerPending} />
      </View>
      <Loading visible={isLoading} />

      <ModalUpdateInfoCustomer ref={bottomSheetRef} onSubmit={onUpdateInfo} />
      <ModalListImage ref={bottomSheetListImageRef} />
      <ModalProject ref={bottomSheetProjectRef} navigation={navigation} />
      <BottomSheetReferral ref={bottomSheetReferralRef} navigation={navigation} />
      <ModalAlertCustomerPending
        ref={modalAlertCustomerPendingRef}
        onConfirm={(type, isCheck) => {
          if (isCheck) {
            const key =
              type === TAB_TYPE.TRASH
                ? AsyncStorageKeys.IS_HIDE_ALERT_TRASH_CUSTOMER_PENDING
                : AsyncStorageKeys.IS_HIDE_ALERT_PRIORITY_CUSTOMER_PENDING;

            AsyncStorage.setItem(key, 'true');
            if (type === TAB_TYPE.TRASH) {
              isHideAlertTrashCustomerPending.current = true;
            } else {
              isHideAlertPriorityCustomerPending.current = true;
            }
          }
          onSwiped(null, false);
        }}
        onCancel={() => {
          swiperRef?.current?.jumpToCardIndex(0);
        }}
      />
    </View>
  );
});

export default CustomerDetailNew;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    flex: 1,
  },
  cardContainer: { flex: 1, alignContent: 'center', marginTop: 20 },
  cardEmptyContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
    alignItems: 'center',
  },
});
