import {
  Alert,
  DeviceEventEmitter,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useRef } from 'react';
import ListCollaboratorReview from './ListCollaboratorReview';
import Colors from '../../../theme/Color';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import SectionHeader from '../../AccountSetting/components/SectionHeader';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { debounce } from 'lodash';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import Rating from './Rating';

const ModalListReview = memo((props) => {
  const {
    data,
    onCloseModal,
    onReview,
    onChangeSupporter,
    isChoosing,
    isChecked,
    onPressSelect,
    isHideChat,
    initCategory,
    onRemoveSupporter,
  } = props;

  const dataLoadMore = useRef({
    height: 0,
    isLoadMore: false,
  });
  const refLoadMore = useRef();
  const scrollViewRef = useRef();

  const openChat = useCallback(
    debounce(
      () => {
        onCloseModal?.();
        Linking.openURL(
          `${DEEP_LINK_BASE_URL}://chat/single?userID=${data?.infoUserSp?.detail?.toUserID}`,
        );
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [data?.infoUserSp?.detail?.toUserID],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${data?.infoUserSp?.detail?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [data?.infoUserSp?.detail?.mobilePhone],
  );

  const handleLoadMoreList = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const paddingToBottom = 150;
    const isLoadMore =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isLoadMore !== dataLoadMore?.current?.isLoadMore && isLoadMore) {
      dataLoadMore.current.isLoadMore = isLoadMore;
      refLoadMore?.current?.();
    }
  }, []);

  const onContentSizeChange = useCallback((w, h) => {
    if (dataLoadMore.current.height === h) return;
    // if (Platform.OS === 'android') {

    if (h < 0.8 * SCREEN_HEIGHT) {
      refLoadMore?.current?.();
    }
    // }
    dataLoadMore.current.height = h;
    dataLoadMore.current.isLoadMore = false;
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
        onScroll={handleLoadMoreList}
        style={styles.listContainer}
        scrollEventThrottle={16}
      >
        <View style={styles.row}>
          <CharAvatar
            style={styles.avatar}
            defaultName={data?.infoUserSp?.detail?.fullName}
            source={hardFixUrlAvatar(data?.infoUserSp?.detail?.avatarImage)}
            textStyle={{ fontSize: 22 }}
          />
          <View style={[styles.infoContainer, isChoosing && { justifyContent: 'center' }]}>
            <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppText semiBold style={styles.name}>
                    {data?.infoUserSp?.detail?.fullName}
                  </AppText>
                  {isChoosing && !isHideChat ? (
                    <TouchableWithoutFeedback onPress={openChat}>
                      <Image source={ICON_PATH.message2} style={[styles.icon, { marginLeft: 8 }]} />
                    </TouchableWithoutFeedback>
                  ) : null}
                </View>

                {isChoosing ? (
                  <Rating
                    star={data?.infoUserSp?.avgRating || data?.infoUserSp?.detail?.avgRating}
                  />
                ) : (
                  <AppText semiBold style={styles.rank}>
                    {data?.infoUserSp?.detail?.title}
                  </AppText>
                )}
              </View>
              {isChoosing ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    onPressSelect?.(data?.infoUserSp?.detail);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
                    <AppText
                      style={{
                        fontSize: 13,
                        lineHeight: 18,
                        color: isChecked ? Colors.primary2 : Colors.gray5,
                        marginRight: 4,
                      }}
                    >
                      Chọn
                    </AppText>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 24 / 2,
                        borderWidth: 2,
                        borderColor: isChecked ? Colors.primary2 : Colors.neutral3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.primary5,
                      }}
                    >
                      {isChecked ? (
                        <View
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 15 / 2,
                            backgroundColor: Colors.primary2,
                          }}
                        ></View>
                      ) : null}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <View style={styles.row}>
                  <TouchableWithoutFeedback onPress={openChat}>
                    <Image source={ICON_PATH.message2} style={styles.icon} />
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={openCall}>
                    <Image
                      source={ICON_PATH.calling2}
                      style={[
                        styles.icon,
                        {
                          marginLeft: 20,
                        },
                      ]}
                    />
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
            {isChoosing ? null : (
              <AppText italic style={[styles.rank, { marginTop: 4, color: Colors.gray5 }]}>
                “Đừng ngại tương tác khi cần hỗ trợ nhé, mình ở đây là để đi cùng bạn.”
              </AppText>
            )}
          </View>
        </View>
        {isChoosing ? (
          <View style={{ marginTop: 20 }} />
        ) : (
          <View style={[styles.row, styles.box]}>
            <TouchableWithoutFeedback onPress={onRemoveSupporter}>
              <View style={{ alignItems: 'center' }}>
                <Image source={ICON_PATH.trash3} style={styles.iconAction} />
                <AppText medium style={[styles.text, { color: Colors.sixRed, marginTop: 4 }]}>
                  Bỏ người{'\n'}dẫn dắt
                </AppText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onReview}>
              <View style={{ alignItems: 'center' }}>
                <Image source={ICON_PATH.like2} style={styles.iconAction} />
                <AppText medium style={[styles.text, { color: Colors.primary2, marginTop: 4 }]}>
                  Đánh giá{'\n'}người này
                </AppText>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onChangeSupporter}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={ICON_PATH.edit1}
                  style={[
                    styles.iconAction,
                    { width: 20, height: 20, tintColor: Colors.sixOrange },
                  ]}
                />
                <AppText medium style={[styles.text, { color: Colors.sixOrange, marginTop: 4 }]}>
                  Đổi người{'\n'}dẫn dắt khác
                </AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        <ListCollaboratorReview
          tab={data?.tab}
          userId={data?.infoUserSp?.detail?.toUserID}
          notes={data?.infoUserSp?.noteRatingUser}
          scrollEnabled
          style={{ marginTop: 8 }}
          initCategory={initCategory}
          headerView={
            <SectionHeader title={`Kỹ năng dẫn dắt của ${data?.infoUserSp?.detail?.fullName}`} />
          }
          callbackFuncLoadMore={(onLoadMore) => (refLoadMore.current = onLoadMore)}
          onCloseModal={onCloseModal}
        />
      </ScrollView>
    </View>
  );
});

export default ModalListReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    padding: 16,
    height: 0.8 * SCREEN_HEIGHT,
  },
  listContainer: {},
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    paddingRight: 18,
    paddingLeft: 30,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.gray1,
  },
  rank: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue3,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary2,
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  iconAction: {
    width: 24,
    height: 24,
  },
});
