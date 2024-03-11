import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCustomerDetail } from '../../../redux/actions/actionsV3/customerAction';
import Colors from '../../../theme/Color';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { SH, SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { getNumberDayBetween } from '../../../utils/dateHelper';
import moment from 'moment';
import { formatPhoneNumber } from '../../../utils/phoneHelper';
import CharAvatar from '../../../componentV3/CharAvatar';
import LinearGradient from 'react-native-linear-gradient';
import { getDefaultAvatar } from '../../../utils/userHelper';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import Indicator from '../../../componentV3/Indicator/Indicator';
import ProjectItem from './ProjectItem';
import ProjectWaitingItem from './ProjectWaitingItem';

const CardView = memo((props) => {
  const {
    item,
    cardHeight,
    isCustomerPending,
    isCustomerTrash,
    onReferral,
    onPriority,
    onPressUpdateInfo,
    onPressUpdateAvatar,
    onTrashAndNext,
    onPriorityAndNext,
    onPressProject,
    onPressProjectWaiting,
    onPressListImage,
  } = props;

  const dispatch = useDispatch();

  const [data, setData] = useState({ ...item, projects: [] });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPriority, setIsLoadingPriority] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isPriority = useMemo(() => Number(item?.isPrioritized) > 0, [item?.isPrioritized]);

  const listDocsImage = useMemo(() => {
    let list = [];

    for (let i = 0; i < data?.documents?.length; i++) {
      const element = data?.documents[i];
      list = list.concat(element?.image);
    }
    return list?.slice(0, 4);
  }, [data?.documents]);

  const onPressPriority = useCallback(() => {
    setIsLoadingPriority(true);
    onPriority?.(data, isPriority, (isSuccess, result) => {
      setIsLoadingPriority(false);
    });
  }, [data, isPriority, onPriority]);

  const renderSectionHeader = useCallback(({ section: { title, data } }) => {
    if (!data?.length) return;
    return (
      <>
        <View style={[styles.line, { marginVertical: 13, marginHorizontal: SW(16) }]} />
        <AppText
          style={[
            styles.text,
            { marginTop: SH(0), marginHorizontal: SW(16), marginBottom: SH(10) },
          ]}
        >
          {title}
        </AppText>
      </>
    );
  }, []);

  const renderItem = useCallback(
    ({ item: it, index }, isFirstItem = false) => {
      const isItemLastList =
        (isFirstItem && data?.projects?.length === 1) ||
        (!isFirstItem && index === data?.projects?.length - 2);
      const isItemFirstList = isFirstItem || index === 0;

      return (
        <ProjectItem
          item={it}
          isItemFirstList={isItemFirstList}
          isItemLastList={isItemLastList}
          onPress={() => {
            onPressProject(it);
          }}
        />
      );
    },
    [data?.projects?.length, onPressProject],
  );
  const renderItemWaiting = useCallback(
    ({ item: it, index }, isFirstItem = false) => {
      const isItemLastList =
        (isFirstItem && data?.projects?.length === 1) ||
        (!isFirstItem && index === data?.projects?.length - 2);
      const isItemFirstList = isFirstItem || index === 0;

      return (
        <ProjectWaitingItem
          item={it}
          isItemFirstList={isItemFirstList}
          isItemLastList={isItemLastList}
          onPress={() => {
            onPressProjectWaiting(it);
          }}
        />
      );
    },
    [data?.projects?.length, onPressProjectWaiting],
  );

  const onPressPhone = useCallback(() => {
    if (data?.mobilePhone) {
      Linking.openURL(`tel://${data?.mobilePhone}`);
    }
  }, [data?.mobilePhone]);

  const onPressAvatar = useCallback(() => {
    setIsLoadingAvatar(true);
    onPressUpdateAvatar(() => {
      setIsLoadingAvatar(false);
    });
  }, [onPressUpdateAvatar]);
  const _onPressListImage = useCallback(
    (imageSelected) => {
      onPressListImage?.(data?.documents, imageSelected);
    },
    [data?.documents, onPressListImage],
  );

  const renderHeader = useCallback(() => {
    return (
      <TouchableWithoutFeedback>
        <View>
          {isCustomerPending || isCustomerTrash ? (
            <Flag isMe={!item?.next_handler || item?.next_handler === 'me'} />
          ) : null}
          {isCustomerPending ? null : (
            <TouchableOpacity
              disabled={isLoadingPriority}
              style={styles.buttonPriority}
              onPress={onPressPriority}
            >
              <AppText
                style={[
                  styles.textPriority,
                  { color: isPriority ? Colors.secondGreen : Colors.gray5 },
                ]}
              >
                Tiềm năng
              </AppText>
              <View>
                <Image
                  source={isPriority ? ICON_PATH.boldStar : ICON_PATH.outlineStar}
                  style={[
                    styles.star,
                    { tintColor: isPriority ? Colors.thirdGreen : Colors.gray5 },
                  ]}
                />
                {isLoadingPriority ? (
                  <View style={styles.loadingContainer}>
                    <Indicator color={isPriority ? Colors.thirdGreen : Colors.gray5} />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          <View style={styles.boxContainer}>
            <View style={styles.headerContainer}>
              <TouchableWithoutFeedback disabled={isLoadingAvatar} onPress={onPressAvatar}>
                <View style={styles.avatarContainer}>
                  <CharAvatar
                    style={styles.avatar}
                    defaultImage={getDefaultAvatar('male')}
                    backgroundColor={Colors.neutral5}
                    fontSize={SH(30)}
                    textColor={Colors.neutral1}
                    source={hardFixUrlAvatar(data?.avatar)}
                  />
                  {isLoadingAvatar ? (
                    <View
                      style={[styles.loadingContainer, { backgroundColor: Colors.transparent }]}
                    >
                      <Indicator />
                    </View>
                  ) : null}
                  <View
                    style={{
                      backgroundColor: Colors.primary5,
                      width: 28,
                      height: 28,
                      borderRadius: 28 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <Image source={ICON_PATH.camera} style={{ width: 22, height: 22 }} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View style={{ marginTop: 12 }}>
                <AppText semiBold style={styles.name}>
                  {data?.fullName}
                </AppText>
                <TouchableWithoutFeedback
                  onPress={() => {
                    onPressUpdateInfo('UPDATE_INFO', data);
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      padding: 16,
                      top: -16,
                    }}
                  >
                    <Image source={ICON_PATH.edit1} style={{ width: 18, height: 18 }} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={[styles.row, { marginTop: SH(8) }]}>
                <View style={[styles.row, { flex: 1, marginLeft: SW(16) }]}>
                  <Image
                    source={IMAGE_PATH.cmndBefore}
                    style={styles.icon}
                    resizeMode={'contain'}
                  />
                  <AppText
                    style={[
                      styles.textValue,
                      { color: data?.idNumber ? Colors.gray1 : Colors.gray5 },
                    ]}
                  >
                    {data?.idNumber || 'Chờ cập nhật'}
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={onPressPhone}
                  style={[styles.row, { flex: 1, marginLeft: SW(16) }]}
                >
                  <Image
                    source={ICON_PATH.outlinePhone2}
                    style={styles.icon}
                    tintColor={Colors.primary2}
                  />
                  <AppText
                    style={[
                      styles.textValue,
                      { color: data?.mobilePhone ? Colors.primary2 : Colors.gray5 },
                    ]}
                  >
                    {data?.mobilePhone ? formatPhoneNumber(data?.mobilePhone) : 'Chờ cập nhật'}
                  </AppText>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    marginLeft: SW(16),
                    marginRight: SW(35),
                    alignSelf: 'flex-start',
                    marginTop: SH(8),
                  },
                ]}
              >
                <Image source={ICON_PATH.marker} style={styles.icon} />
                <AppText
                  style={[
                    styles.textValue,
                    {
                      color:
                        data?.district_name && data?.province_name ? Colors.gray1 : Colors.gray5,
                    },
                  ]}
                >
                  {data?.district_name && data?.province_name
                    ? `${data?.district_name} - ${data?.province_name}`
                    : 'Chờ cập nhật'}
                </AppText>
              </View>
              <View style={[styles.line, { marginVertical: 13, marginHorizontal: SW(16) }]} />
              <View style={{ marginHorizontal: SW(16) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={ICON_PATH.search3}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                  />
                  <AppText style={styles.textValue}>{data?.from_text}</AppText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Image
                    source={ICON_PATH.clock2}
                    style={{ width: 20, height: 20, marginRight: 8, tintColor: Colors.gray5 }}
                  />
                  <AppText style={styles.textValue}>
                    Từ {getNumberDayBetween(moment(data?.updatedDate).valueOf())}
                  </AppText>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Image
                    source={ICON_PATH.note2}
                    style={{ width: 20, height: 20, marginRight: 8, tintColor: Colors.gray5 }}
                  />
                  <AppText
                    style={[
                      styles.textValue,
                      { flex: 1, color: data?.note ? Colors.gray1 : Colors.gray5 },
                    ]}
                  >
                    {data?.note || 'Chú thích về khách hàng này'}
                  </AppText>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onPressUpdateInfo('UPDATE_NOTE', data);
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        right: -16,
                        padding: 16,
                        top: -16,
                      }}
                    >
                      <Image source={ICON_PATH.edit1} style={{ width: 18, height: 18 }} />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <>
                <View style={[styles.line, { marginVertical: 13, marginHorizontal: SW(16) }]} />
                <View
                  style={{
                    marginHorizontal: SW(16),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <AppText style={[styles.textValue, { color: Colors.gray5, flex: 0 }]}>
                    {'Hình ảnh hồ sơ đi kèm'}
                  </AppText>
                  <TouchableWithoutFeedback
                    disabled={!listDocsImage?.length}
                    onPress={() => {
                      _onPressListImage();
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <AppText style={[styles.textValue, { color: Colors.gray5, flex: 0 }]}>
                        {data?.total_document}
                      </AppText>
                      <Image
                        source={ICON_PATH.arrow_right}
                        style={{ width: 14, height: 14, resizeMode: 'contain' }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {listDocsImage?.length ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: SW(16),
                      marginTop: 10,
                    }}
                  >
                    {listDocsImage?.map((it, idx) => {
                      const isShowArrow = idx === 3;
                      return (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            _onPressListImage(isShowArrow ? '' : it);
                          }}
                        >
                          <View>
                            <Image
                              source={{ uri: it }}
                              key={idx}
                              style={{
                                width: SW(75),
                                aspectRatio: 1,
                                backgroundColor: Colors.neutral5,
                                borderRadius: 8,
                                marginRight: 4,
                              }}
                            />
                            {isShowArrow ? (
                              <View
                                style={{
                                  width: SW(75),
                                  aspectRatio: 1,
                                  backgroundColor: '#080821A3',
                                  borderRadius: 8,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'absolute',
                                }}
                              >
                                <Image
                                  source={ICON_PATH.downArrow}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    tintColor: Colors.primary2,
                                    transform: [
                                      {
                                        rotate: '-90deg',
                                      },
                                    ],
                                  }}
                                />
                              </View>
                            ) : null}
                          </View>
                        </TouchableWithoutFeedback>
                      );
                    })}
                  </View>
                ) : null}
              </>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    _onPressListImage,
    data?.avatar,
    data?.district_name,
    data?.from_text,
    data?.fullName,
    data?.idNumber,
    data?.mobilePhone,
    data?.note,
    data?.province_name,
    data?.total_document,
    data?.type,
    data?.updatedDate,
    isCustomerPending,
    isCustomerTrash,
    isLoadingAvatar,
    isLoadingPriority,
    isPriority,
    item?.next_handler,
    listDocsImage,
    onPressAvatar,
    onPressPhone,
    onPressPriority,
    onPressUpdateInfo,
  ]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <ActivityIndicator color={Colors.gray5} />;
    }
    return (
      <TouchableWithoutFeedback>
        <View style={styles.itemEmptyContainer}>
          <Image style={styles.iconEmpty} source={ICON_PATH.block} />
          <AppText style={styles.textEmpty}>{'Khách hàng chưa có dự án'}</AppText>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [isLoading]);

  const onGetData = useCallback(() => {
    setIsLoading(true);
    dispatch(
      getCustomerDetail({ ID: item?.ID, itemID: item?.itemID }, (isSuccess, result) => {
        if (isSuccess) {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              100,
              LayoutAnimation.Types.easeInEaseOut,
              LayoutAnimation.Properties.opacity,
            ),
          );
          setData((prevState) => {
            const newState = { ...(prevState || {}), ...result };
            return newState;
          });
        }
        setTimeout(() => {
          setIsLoading(false);
          setIsRefreshing(false);
        }, 100);
      }),
    );
  }, [dispatch, item?.ID]);

  const startOffset = useRef({ pageX: 0, pageY: 0 });
  const onTouchStart = useCallback((event) => {
    startOffset.current.pageX = event?.nativeEvent?.pageX;
    startOffset.current.pageY = event?.nativeEvent?.pageY;
  }, []);

  const checkSwiping = useCallback((x1, y1, x2, y2) => {
    const horizontalDistance = Math.abs(x2 - x1);
    const verticalDistance = Math.abs(y2 - y1);

    if (horizontalDistance > 10 && verticalDistance <= 10) {
      return true;
    } else {
      return false;
    }
  }, []);

  const onTouchMove = useCallback(
    (event) => {
      const currentOffset = {
        pageX: event?.nativeEvent?.pageX,
        pageY: event?.nativeEvent?.pageY,
      };
      setIsSwiping((prevState) => {
        const newState = checkSwiping(
          currentOffset.pageX,
          currentOffset.pageY,
          startOffset.current.pageX,
          startOffset.current.pageY,
        );
        if (prevState || newState === prevState) return prevState;
        return newState;
      });
    },
    [checkSwiping],
  );

  const onTouchEnd = useCallback(() => {
    setTimeout(() => {
      setIsSwiping(false);
    }, 400);
  }, []);

  const keyExtractor = useCallback((it, idx) => it?.ID + idx, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    onGetData();
  }, []);

  useEffect(() => {
    setData((prevState) => ({ ...prevState, note: item?.note }));
  }, [item?.note]);
  useEffect(() => {
    setData((prevState) => ({ ...prevState, idNumber: item?.idNumber }));
  }, [item?.idNumber]);
  useEffect(() => {
    setData((prevState) => ({ ...prevState, mobilePhone: item?.mobilePhone }));
  }, [item?.mobilePhone]);
  useEffect(() => {
    setData((prevState) => ({ ...prevState, fullName: item?.fullName }));
  }, [item?.fullName]);
  useEffect(() => {
    setData((prevState) => ({ ...prevState, avatar: item?.avatar }));
  }, [item?.avatar]);
  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      district_name: item?.district_name,
      province_name: item?.province_name,
    }));
  }, [item?.district_name, item?.province_name]);

  const dataSection = useMemo(
    () => [
      {
        title: 'Nhu cầu tham gia',
        data: data?.projects_waiting || [],
        renderItem: renderItemWaiting,
      },
      { title: 'Lịch sử tham gia ', data: data?.projects || [], renderItem: renderItem },
    ],
    [data?.projects, data?.projects_waiting, renderItem, renderItemWaiting],
  );

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={[styles.container, { height: cardHeight }]}
    >
      <View
        style={[
          styles.container,
          {
            flex: 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: isSwiping ? 0.4 : 0,
            shadowRadius: 5,
            elevation: isSwiping ? 1 : 0,
          },
        ]}
      >
        <SectionList
          sections={dataSection}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={renderHeader()}
          ListEmptyComponent={renderEmpty()}
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          stickySectionHeadersEnabled={false}
        />
        {data?.hideActions === true || isLoading ? null : (
          <BottomCard
            isShowTrash={isCustomerPending}
            onReferral={onReferral}
            onTrash={onTrashAndNext}
            onPriority={onPriorityAndNext}
            item={{ ...item, requirements: data?.requirements || [] }}
          />
        )}
      </View>
    </View>
  );
});

export default CardView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    width: SW(343),
  },
  buttonPriority: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    top: SH(18),
    position: 'absolute',
    zIndex: 99,
    right: SW(16),
  },
  textPriority: {
    fontSize: 14,
    color: Colors.gray5,
    marginRight: SW(4),
    lineHeight: 20,
  },
  star: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  boxContainer: {
    borderTopLeftRadius: SH(12),
    borderTopRightRadius: SH(12),
    marginTop: SH(12),
  },
  listContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.primary5,
  },
  listContentContainer: {
    flexGrow: 1,
    paddingBottom: 22,
  },
  headerContainer: {
    // alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral5,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.highLightColor,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
    marginRight: SW(8),
  },
  iconSmall: {
    width: SW(14),
    height: SH(14),
    resizeMode: 'contain',
  },
  textValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    flex: 1,
  },
  imageProfileContainer: {
    marginTop: SH(12),
    marginHorizontal: SW(16),
    borderRadius: SH(8),
    backgroundColor: Colors.neutral5,
    paddingVertical: SH(12),
    paddingHorizontal: SW(12),
  },
  buttonImageProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.neutral5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: { width: '60%', height: '60%', resizeMode: 'contain', alignSelf: 'center' },
  itemIconState: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: SW(4),
    height: SW(4),
    borderRadius: SW(2),
    backgroundColor: Colors.neutral3,
    marginHorizontal: SW(6),
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemInfo: {
    justifyContent: 'space-between',
    marginLeft: SW(16),
    flex: 1,
    paddingVertical: 12,
  },
  itemTextState: {
    fontSize: 16,
    lineHeight: 22,
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray4,
  },
  buttonConfirm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary2,
    height: 48,
    borderRadius: 24,
  },
  buttonTextConfirm: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary5,
  },
  checkboxContainer: {
    width: SH(24),
    height: SH(24),
    backgroundColor: Colors.primary5,
    borderWidth: 1,
    borderColor: Colors.neutral4,
    borderRadius: SH(6),
    marginRight: SW(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActiveContainer: {
    backgroundColor: Colors.primary2,
    borderColor: Colors.primary2,
  },
  iconTick: {
    width: SH(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.primary5,
  },
  avatarContainer: {
    backgroundColor: Colors.primary5,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    padding: SW(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SH(16),
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: SH(24),
  },
  iconEmpty: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
  bottomContainer: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageAddCustomer: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  textAddCustomer: {
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary5,
  },
});

const BottomCard = memo((props) => {
  const { isShowTrash, onReferral, onTrash, onPriority, item } = props;

  if (isShowTrash) {
    return (
      <LinearGradient style={styles.bottomContainer} colors={[`${Colors.blue6}00`, Colors.blue6]}>
        <View style={styles.row}>
          <TouchableWithoutFeedback onPress={() => onTrash(item)}>
            <Image source={IMAGE_PATH.trashCustomer} style={styles.imageAddCustomer} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => onReferral(item)}>
            <Image
              source={IMAGE_PATH.addCustomer}
              style={[styles.imageAddCustomer, { marginHorizontal: 44 }]}
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => onPriority(item, Number(item?.isPrioritized) > 0)}
          >
            <Image source={IMAGE_PATH.priorityCustomer} style={styles.imageAddCustomer} />
          </TouchableWithoutFeedback>
        </View>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient style={styles.bottomContainer} colors={[`${Colors.blue6}00`, Colors.blue6]}>
      <TouchableWithoutFeedback onPress={() => onReferral(item)}>
        <View style={styles.row}>
          <Image source={IMAGE_PATH.addCustomer} style={styles.imageAddCustomer} />
          <AppText medium style={styles.textAddCustomer}>
            Khởi tạo bán hàng
          </AppText>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
});

const Flag = memo(({ isMe }) => (
  <View style={{ position: 'absolute', top: 16, left: 1 }}>
    <View
      style={{
        borderTopWidth: SW(11),
        borderTopColor: isMe ? 'rgb(234, 238, 246)' : 'rgb(253, 236, 216)',
        borderLeftColor: isMe ? 'rgb(234, 238, 246)' : 'rgb(253, 236, 216)',
        borderLeftWidth: isMe ? 60 : 100,
        borderRightColor: 'transparent',
        borderRightWidth: SW(9),
        borderBottomColor: isMe ? 'rgb(234, 238, 246)' : 'rgb(253, 236, 216)',
        borderBottomWidth: SW(11),
      }}
    />
    <View
      style={{
        position: 'absolute',
        backgroundColor: isMe ? 'rgb(234, 238, 246)' : 'rgb(253, 236, 216)',
        top: Platform.OS === 'ios' ? SH(4) : SH(6),
        left: SW(6),
      }}
    >
      <AppText
        bold
        style={{
          fontSize: 12,
          lineHeight: 14,
          fontStyle: 'normal',
          letterSpacing: 0,
          textAlign: 'center',
          color: isMe ? 'rgb(34, 29, 176)' : 'rgb( 245, 139, 20)',
        }}
      >
        {isMe ? 'Của tôi' : 'Được giới thiệu'}
      </AppText>
    </View>
  </View>
));
