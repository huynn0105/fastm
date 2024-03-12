/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';
import Swiper from 'react-native-deck-swiper';
import CardView from './components/CardView';
import { Alert, Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CardViewEmpty from './components/CardViewEmpty';
import CardViewGuide from './components/CardViewGuide';
import { SCREEN_WIDTH } from '../../utils/Utils';
import HeaderCustomerDetail from './components/HeaderCustomerDetail';
import { SH } from '../../constants/styles';
import BottomSheetReferral from '../../componentV3/BottomSheetReferral/BottomSheetReferral';
import { TAB_TYPE } from '../Customer/Customer.constants';
import {
  addPriorityCustomer,
  clearTrashCustomer,
  getListCustomer,
  removePriorityCustomer,
  subtractTotalPage,
  syncListPriorityCustomer,
  trashCustomer,
} from '../../redux/actions/actionsV3/customerAction';
import Loading from '../../componentV3/LoadingModal';
import AppText from '../../componentV3/AppText';
import { Image } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { uniqBy } from 'lodash';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ModalProject from './components/ModalProject';
import ModalListImage from './components/ModalListImage';
import ModalUpdateInfoCustomer from './components/ModalUpdateInfoCustomer';
import ModalAlertCustomerPending from './components/ModalAlertCustomerPending';

const CustomerDetail = memo((props) => {
  const { navigation } = props;

  const initialIndex = navigation?.state?.params?.index || 0;
  const group = navigation?.state?.params?.group;
  const idLink = navigation?.state?.params?.idLink;

  const itemCustomer = navigation?.state?.params?.params;

  const isCustomerPending = group === TAB_TYPE.PAGE;
  const isCustomerTrash = group === 'trash';

  const onLoadMore = navigation?.state?.params?.onLoadMore;
  const callbackUnmount = navigation?.state?.params?.callbackUnmount;
  const listCustomer = useSelector((state) => state?.customerReducer?.listCustomer[group] || []);

  const [isHidePopupConfirmDelete, setIsHidePopupConfirmDelete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const cardHeight = useMemo(
    () => (isCustomerPending || isCustomerTrash ? SH(Platform.OS === 'ios' ? 620 : 640) : SH(666)),
    [isCustomerPending, isCustomerTrash],
  );

  const animated = useRef(new Animated.Value(0)).current;

  const bottomSheetReferralRef = useRef();
  const bottomSheetRef = useRef();
  const bottomSheetListImageRef = useRef();
  const bottomSheetProjectRef = useRef();
  const modalAlertCustomerPendingRef = useRef();
  const itemProjectSelected = useRef();
  const bottomSheetType = useRef();

  const isHideAlertPriorityCustomerPending = useRef(false);
  const isHideAlertTrashCustomerPending = useRef(false);

  const swiperRef = useRef();
  const itemSelected = useRef({});

  const offsetSwipe = useRef(0);

  const idsPriorityDelete = useRef([]);
  const itemPriorityAdd = useRef([]);

  const dragEnd = useCallback(() => {
    setCurrentIndex((prevState) => {
      const isSwiped = Math.abs(offsetSwipe.current) > SCREEN_WIDTH / 4;
      if (isSwiped) {
        const isPrev = offsetSwipe.current > 0;
        const newState = prevState + (isPrev && !isCustomerPending ? -1 : 1);
        if (newState === listCustomer?.length - (isCustomerPending || isCustomerTrash ? 1 : 3)) {
          isCustomerPending || isCustomerTrash ? onGetDataPage() : onLoadMore?.();
        }
        if (isCustomerPending) {
          dispatch(subtractTotalPage());
          handleCustomerPending(isPrev);
        }
        offsetSwipe.current = 0;

        if (newState >= listCustomer?.length) {
          return -1;
        }
        return newState;
      }
      offsetSwipe.current = 0;
      return prevState;
    });
  }, [
    dispatch,
    handleCustomerPending,
    isCustomerPending,
    isCustomerTrash,
    listCustomer?.length,
    onGetDataPage,
    onLoadMore,
  ]);

  const onSwiping = useCallback((x, y) => {
    offsetSwipe.current = x;
  }, []);

  const onSwipedAll = useCallback((x) => {
    setCurrentIndex(-1);
  }, []);

  const onOpenBottomSheetReferral = useCallback(
    (item) => () => {
      bottomSheetReferralRef?.current?.open(item);
    },
    [],
  );

  const onPriority = useCallback(
    (item, isPriority, onSuccess) => {
      const isPriorityTab = group === TAB_TYPE.PRIORITY;
      if (isPriority) {
        dispatch(
          addPriorityCustomer(
            item,
            (isSuccess, _, newItem) => {
              if (isSuccess && isPriorityTab && newItem) {
                itemPriorityAdd.current = [newItem, ...itemPriorityAdd.current];
              }
              onSuccess?.(isSuccess, _, newItem);
            },
            !isPriorityTab,
            isCustomerPending,
            isCustomerTrash,
          ),
        );
      } else {
        dispatch(
          removePriorityCustomer(
            item,
            (isSuccess, _) => {
              if (isSuccess && isPriorityTab) {
                idsPriorityDelete.current = [...idsPriorityDelete.current, item?.priorityID];
              }
              onSuccess?.(isSuccess, _);
            },
            !isPriorityTab,
            isCustomerPending,
            isCustomerTrash,
          ),
        );
      }
      setIsLoading((prevState) => {
        if (!prevState) {
          if (isCustomerPending && !isHideAlertPriorityCustomerPending.current) {
            modalAlertCustomerPendingRef?.current?.open(TAB_TYPE.PRIORITY);
          }
        }
        return prevState;
      });
    },
    [dispatch, group, isCustomerPending, isCustomerTrash],
  );

  const onPriorityAndNext = useCallback(
    (item, list) => () => {
      setCurrentIndex((prev) => {
        const newState = prev + 1;
        dispatch(subtractTotalPage());
        if (newState >= list?.length) {
          return -1;
        }
        swiperRef?.current?.jumpToCardIndex(newState);
        if (newState === listCustomer?.length - (isCustomerPending || isCustomerTrash ? 1 : 3)) {
          isCustomerPending || isCustomerTrash ? onGetDataPage() : onLoadMore?.();
        }
        return newState;
      });
      onPriority(item, true);
    },
    [
      dispatch,
      isCustomerPending,
      isCustomerTrash,
      listCustomer?.length,
      onGetDataPage,
      onLoadMore,
      onPriority,
    ],
  );

  const onTrashAndNext = useCallback(
    (item, list) => () => {
      setCurrentIndex((prev) => {
        const newState = prev + 1;
        dispatch(subtractTotalPage());
        if (newState >= list?.length) {
          return -1;
        }
        swiperRef?.current?.jumpToCardIndex(newState);
        if (newState === listCustomer?.length - (isCustomerPending || isCustomerTrash ? 1 : 3)) {
          isCustomerPending || isCustomerTrash ? onGetDataPage() : onLoadMore?.();
        }
        return newState;
      });
      onTrash(item);
    },
    [
      dispatch,
      isCustomerPending,
      isCustomerTrash,
      listCustomer?.length,
      onGetDataPage,
      onLoadMore,
      onTrash,
    ],
  );

  const onTrash = useCallback(
    (item) => {
      dispatch(trashCustomer([item?.customerID], false, item?.need));
      setIsLoading((prevState) => {
        if (!prevState) {
          if (isCustomerPending && !isHideAlertTrashCustomerPending.current) {
            modalAlertCustomerPendingRef?.current?.open('TRASH');
          }
        }
        return prevState;
      });
    },
    [dispatch, isCustomerPending],
  );
  const onTrashAll = useCallback(
    (isDelete) => {
      setCurrentIndex(-1);
      dispatch(subtractTotalPage(0));
      dispatch(trashCustomer(null, isDelete));
    },
    [dispatch],
  );

  const onClearTrash = useCallback(
    (isDelete) => {
      setCurrentIndex(-1);
      dispatch(clearTrashCustomer());
    },
    [dispatch],
  );

  const handleCustomerPending = useCallback(
    (isAddPriority) => {
      if (isAddPriority) {
        onPriority(itemSelected.current, true);
      } else {
        onTrash(itemSelected.current);
      }
    },
    [onPriority, onTrash],
  );

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

  //!---------------------------------------------------------------

  const dispatch = useDispatch();

  const totalNum = isCustomerTrash
    ? useSelector((state) => state.customerReducer.currentNum?.[group])
    : useSelector((state) => state.customerReducer.currentNum?.[group]);

  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState(
    isCustomerPending
      ? {
          source: 'all',
          page_qc: idLink ? [idLink] : [],
        }
      : {},
  );

  const [outOfData, setOutOfData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsMore] = useState(false);

  const onGetDataPage = useCallback(
    (isRefreshing) => {
      if (outOfData && !isRefreshing) return;
      setPage((prevPage) => {
        let newPage = prevPage;

        if (isRefreshing || isCustomerPending) {
          newPage = 1;
        } else {
          newPage = prevPage + 1;
        }

        const params = {
          ...filter,
          group,
          page: newPage,
        };
        if (isCustomerPending) {
          params.isLoadMore = !isRefreshing;
        }
        if (isCustomerTrash) {
          params.disabledUpdateNum = !isRefreshing;
        }

        if (params?.source === 'all') {
          delete params.source;
        }

        console.log('aaa-16:', params);

        setIsLoading(true);
        dispatch(
          getListCustomer(params, (isSuccess, results, totalLength) => {
            if (!isSuccess || !results?.length) {
              setOutOfData(true);
            }
            if (isSuccess) {
              if (isRefreshing && !results?.length) {
                setCurrentIndex(-1);
              } else if (isRefreshing) {
                setCurrentIndex(0);
                swiperRef?.current?.jumpToCardIndex(0);
              }
            }

            setIsLoading(false);
          }),
        );

        return newPage;
      });
    },
    [dispatch, filter, group, isCustomerPending, isCustomerTrash, outOfData],
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
    if (isCustomerPending || isCustomerTrash) {
      onGetDataPage(true);
    }
  }, [filter]);

  useEffect(() => {
    if (isCustomerPending) {
      navigation?.setParams({
        title: 'Khách hàng chưa phân loại',
      });
      checkModalAlertCustomerPending();
    } else if (isCustomerTrash) {
      navigation?.setParams({
        title: 'Thùng rác',
      });
    }
    return () => {
      if (group === TAB_TYPE.PRIORITY) {
        dispatch(syncListPriorityCustomer(itemPriorityAdd.current, idsPriorityDelete.current));
      }
    };
  }, []);

  //!---------------------------------------------------------------

  const renderItem = useCallback(
    (item, index, list) => {
      return (
        <CardView
          item={item}
          navigation={navigation}
          isHidePopupConfirmDelete={isHidePopupConfirmDelete}
          setIsHidePopupConfirmDelete={setIsHidePopupConfirmDelete}
          cardHeight={cardHeight}
          isCustomerPending={isCustomerPending}
          isCustomerTrash={isCustomerTrash}
          onReferral={onOpenBottomSheetReferral(item)}
          onPriority={onPriority}
          onNewItem={(it) => {
            itemSelected.current = it;
          }}
          useViewOverflow={false}
          onTrashAndNext={onTrashAndNext(item, list)}
          onPriorityAndNext={onPriorityAndNext(item, list)}
          onPressProject={onPressProject}
          onPressUpdateInfo={onPressUpdateInfo}
          onPressListImage={onPressListImage}
        />
      );
    },
    [
      cardHeight,
      isCustomerPending,
      isCustomerTrash,
      isHidePopupConfirmDelete,
      navigation,
      onOpenBottomSheetReferral,
      onPressListImage,
      onPressProject,
      onPressUpdateInfo,
      onPriority,
      onPriorityAndNext,
      onTrashAndNext,
    ],
  );

  const onPressProject = useCallback((item) => {
    itemProjectSelected.current = item;
    bottomSheetProjectRef.current.open(
      `${item?.projectName} - ${item?.projectDescription || item?.productName}`,
    );
  }, []);
  const onPressUpdateInfo = useCallback((type) => {
    bottomSheetType.current = type;
    bottomSheetRef?.current?.open(
      type === 'UPDATE_INFO' ? 'Cập nhật thông tin' : 'Chú thích khách hàng',
    );
  }, []);
  const onPressListImage = useCallback(() => {
    bottomSheetListImageRef?.current?.open('');
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(
      AsyncStorageKeys.IS_HIDE_POPUP_CONFIRM_DELETE_CUSTOMER,
      (error, result) => {
        if (result) {
          result = JSON.parse(result);
          setIsHidePopupConfirmDelete(true);
        }
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      {isCustomerPending || isCustomerTrash ? (
        <HeaderCustomerDetail
          onChangeFilter={setFilter}
          filter={filter}
          number={totalNum || 0}
          group={group}
          onDelete={isCustomerPending ? onTrashAll : onClearTrash}
          goToTrash={() => {
            navigation?.push('CustomerDetail', {
              group: 'trash',
            });
          }}
          disabledFilter={isCustomerTrash}
        />
      ) : null}
      <View style={{ width: '100%', height: '100%' }}>
        <View style={{ position: 'absolute', zIndex: 0, alignSelf: 'center' }}>
          <CardViewEmpty
            animated={animated}
            cardHeight={cardHeight}
            outOfList={currentIndex < 0}
            isHideArrow={isCustomerPending}
            navigation={navigation}
            hasCustomer={listCustomer?.length}
          />
        </View>
        {!isLoading && listCustomer?.length && currentIndex >= 0 ? (
          <Swiper
            ref={swiperRef}
            cards={listCustomer}
            renderCard={renderItem}
            dragEnd={dragEnd}
            SwipedAll={onSwipedAll}
            backgroundColor={`rgba(0,0,0,0)`}
            stackSize={1}
            cardIndex={isCustomerTrash || isCustomerPending ? currentIndex : initialIndex}
            cardHorizontalMargin={16}
            cardVerticalMargin={20}
            verticalSwipe={false}
            goBackToPreviousCardOnSwipeRight={!isCustomerPending}
            goBackToPreviousCardOnSwipeLeft={false}
            showSecondCard={false}
            onSwiping={Animated.event([animated], {
              useNativeDriver: false,
              listener: onSwiping,
            })}
            keyExtractor={(it) => it?.ID}
            infinite={false}
            overlayLabels={overlayLabels}
          />
        ) : itemCustomer && currentIndex >= 0 ? (
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 16,
            }}
          >
            {renderItem(itemCustomer, 0)}
          </View>
        ) : null}
        <CardViewGuide cardHeight={cardHeight} isCustomerPending={isCustomerPending} />
      </View>
      <BottomSheetReferral ref={bottomSheetReferralRef} navigation={navigation} />
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => <ModalUpdateInfoCustomer type={bottomSheetType.current} />}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
      <BottomActionSheet
        ref={bottomSheetListImageRef}
        render={() => <ModalListImage />}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
      <BottomActionSheet
        ref={bottomSheetProjectRef}
        render={() => <ModalProject item={itemProjectSelected.current} />}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
      <ModalAlertCustomerPending
        ref={modalAlertCustomerPendingRef}
        onConfirm={(type, isCheck) => {
          if (isCheck) {
            const key =
              type === 'TRASH'
                ? AsyncStorageKeys.IS_HIDE_ALERT_TRASH_CUSTOMER_PENDING
                : AsyncStorageKeys.IS_HIDE_ALERT_PRIORITY_CUSTOMER_PENDING;

            AsyncStorage.setItem(key, 'true');
            if (type === 'TRASH') {
              isHideAlertTrashCustomerPending.current = true;
            } else {
              isHideAlertPriorityCustomerPending.current = true;
            }
          }
        }}
      />
      <Loading
        visible={
          isLoading || (!outOfData && isLoadMore && currentIndex === listCustomer?.length - 1)
        }
      />
    </View>
  );
});

export default CustomerDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    flex: 1,
  },
});
