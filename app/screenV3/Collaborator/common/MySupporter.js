import { Alert, Image, Linking, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import HeaderSection from './HeaderSection';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import CharAvatar from '../../../componentV3/CharAvatar';
import { debounce } from 'lodash';
import { ICON_PATH } from '../../../assets/path';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { ActivityIndicator } from 'react-native';
import ButtonText from '../../../common/ButtonText';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import { useSelector } from 'react-redux';
import ModalListReview from './ModalListReview';
import ModalReview from './ModalReview';
import ModalCheckChangeSupporter from './ModalCheckChangeSupporter';
import ModalRemoveSupporter from './ModalRemoveSupporter';

const MySupporter = memo((props) => {
  const { isLoading, myUser, style, headerView, navigation, isCTVConfirmed, isHideUserSupport } =
    props;

  const filterRating = useSelector((state) => state?.collaboratorReducer?.filterRating);

  const mySupporter = filterRating?.infoUserSp;
  const bottomSheetRef = useRef();

  const [bottomSheetType, setBottomSheetType] = useState('');
  const [isChange, setIsChange] = useState(false);

  const openChat = useCallback(
    debounce(
      () => {
        Linking.openURL(
          `${DEEP_LINK_BASE_URL}://chat/single?userID=${mySupporter?.detail?.toUserID}`,
        );
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [mySupporter],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${mySupporter?.detail?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [mySupporter],
  );

  const onOpenUrlPost = useCallback(() => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${mySupporter?.url_post}&title=${mySupporter?.title}`,
    );
  }, [mySupporter]);

  const onOpenBottomSheet = useCallback(() => {
    setBottomSheetType('LIST_REVIEW');
    bottomSheetRef?.current?.open('Người dẫn dắt');
  }, []);

  const onOpenReview = useCallback(() => {
    setBottomSheetType('REVIEW');
    bottomSheetRef?.current?.open(
      `Bạn đánh giá sao về chất lượng\ndẫn dắt của ${mySupporter?.detail?.fullName} ?`,
    );
  }, [mySupporter?.detail?.fullName]);

  const onRemoveSupporter = useCallback(() => {
    setBottomSheetType('REMOVE_SUPPORTER');
    bottomSheetRef?.current?.open(`Bỏ người dẫn dắt`);
  }, []);

  const onOpenCheckChangeSupporter = useCallback(() => {
    setBottomSheetType('CHANGE_SUPPORTER');
    setIsChange(true);
    bottomSheetRef?.current?.open(`Người dẫn dắt`);
  }, []);
  const onOpenCheckRemoveSupporter = useCallback(() => {
    setBottomSheetType('CHANGE_SUPPORTER');
    setIsChange(false);
    bottomSheetRef?.current?.open(`Người dẫn dắt`);
  }, []);

  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  const onChangeSupporter = useCallback(() => {
    onCloseBottomSheet();
    navigation?.navigate('RegisterReferral', {});
  }, [navigation, onCloseBottomSheet]);

  const bottomSheetRender = useMemo(
    () => ({
      LIST_REVIEW: (
        <ModalListReview
          data={filterRating}
          onCloseModal={onCloseBottomSheet}
          onReview={onOpenReview}
          onRemoveSupporter={onOpenCheckRemoveSupporter}
          onChangeSupporter={onOpenCheckChangeSupporter}
        />
      ),
      REVIEW: (
        <ModalReview
          infoUser={mySupporter}
          titleRating={filterRating?.titleRating}
          myUser={myUser}
          onCloseModal={onCloseBottomSheet}
        />
      ),
      CHANGE_SUPPORTER: (
        <ModalCheckChangeSupporter
          onCloseModal={onCloseBottomSheet}
          onNextHandle={isChange ? onChangeSupporter : onRemoveSupporter}
          onBack={onOpenBottomSheet}
          isChange={isChange}
        />
      ),
      REMOVE_SUPPORTER: (
        <ModalRemoveSupporter
          infoUser={mySupporter}
          myUser={myUser}
          onCloseModal={onCloseBottomSheet}
          onBack={onOpenBottomSheet}
        />
      ),
    }),
    [
      filterRating,
      isChange,
      mySupporter,
      myUser,
      onChangeSupporter,
      onCloseBottomSheet,
      onOpenBottomSheet,
      onOpenCheckChangeSupporter,
      onOpenCheckRemoveSupporter,
      onOpenReview,
      onRemoveSupporter,
    ],
  );

  const isDisplayNone = useMemo(
    () =>
      (isHideUserSupport && !mySupporter?.detail) ||
      !Object.keys(mySupporter || {})?.length ||
      mySupporter?.hideFindUserSP ||
      (!mySupporter?.detail && !isCTVConfirmed),
    [isCTVConfirmed, isHideUserSupport, mySupporter],
  );

  return (
    <>
      {isDisplayNone ? null : (
        <>
          {headerView || (
            <HeaderSection
              title={'Người dẫn dắt của bạn'}
              elementNote={
                <View style={{ maxWidth: 275 }}>
                  {mySupporter?.noteUserSP?.map((item, index) => {
                    if (!item?.length) return null;
                    return (
                      <AppText style={[styles.note, index && { marginTop: 12 }, { flexShrink: 1 }]}>
                        {item?.map((it) => (
                          <AppText {...it} style={[styles.note, it?.color && { color: it?.color }]}>
                            {it?.text}
                          </AppText>
                        ))}
                      </AppText>
                    );
                  })}
                </View>
              }
            />
          )}
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: mySupporter?.detail ? Colors.blue3 : Colors.primary5 },
              style,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.gray5} />
            ) : mySupporter?.detail ? (
              <>
                <TouchableWithoutFeedback onPress={onOpenBottomSheet}>
                  <View style={styles.infoContainer}>
                    <Image
                      source={ICON_PATH.mfastWhite}
                      style={{
                        position: 'absolute',
                        right: 16,
                        width: 62,
                        height: 56,
                        opacity: 0.1,
                      }}
                    />
                    <View style={styles.avatarContainer}>
                      {mySupporter?.detail ? (
                        <CharAvatar
                          style={styles.avatar}
                          defaultName={mySupporter?.detail?.fullName}
                          source={hardFixUrlAvatar(mySupporter?.detail?.avatarImage)}
                          textStyle={styles.avatarText}
                        />
                      ) : null}
                      {/* <BlurView
                    style={styles.avgRatingContainer}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                  >
                    <AppText
                      style={[styles.avgRating, { position: 'absolute', textAlign: 'center' }]}
                    >
                      {' '}
                      {mySupporter?.avgRating || 0}{' '}
                    </AppText>
                  </BlurView> */}
                    </View>
                    <View style={[styles.viewContainer, { flex: 1 }]}>
                      <View style={styles.rowCenter}>
                        <AppText medium style={styles.name}>
                          {mySupporter?.detail?.fullName}
                        </AppText>
                        <Image source={ICON_PATH.arrow_right} style={styles.iconArrow} />
                      </View>
                      <AppText style={[styles?.note, { color: Colors.primary5, marginTop: 2 }]}>
                        {mySupporter?.detail?.title}
                      </AppText>
                    </View>
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
                </TouchableWithoutFeedback>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Image source={ICON_PATH.findSupporter} />
                <AppText bold style={styles.titleEmpty}>
                  Bạn chưa có người dẫn dắt
                </AppText>
                <AppText style={styles.contentEmpty}>{mySupporter?.detailNoteUserSP || ''}</AppText>
                <ButtonText onPress={onChangeSupporter} title="Chọn người dẫn dắt" top={12} />
              </View>
            )}
          </View>
        </>
      )}
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => bottomSheetRender[bottomSheetType]}
        canClose={true}
        haveCloseButton={true}
        avoidKeyboard={false}
        headerTextStyle={{
          textAlign: 'center',
        }}
      />
    </>
  );
});

export default MySupporter;

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  avatarText: {
    fontSize: 18,
  },
  avgRatingContainer: {
    width: '100%',
    height: 18,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgRating: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.primary5,
  },
  name: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary5,
  },
  viewContainer: {
    marginLeft: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  review: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
  },
  imageReview: {
    width: 22,
    height: 22,
    marginLeft: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.blue6,
  },
  tips: {
    color: Colors.primary2,
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  iconArrow: {
    width: 16,
    height: 16,
    tintColor: Colors.primary5,
    marginLeft: 8,
  },
  emptyContainer: {
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmpty: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleEmpty: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue3,
    textAlign: 'center',
    marginTop: 12,
  },
  contentEmpty: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    textAlign: 'center',
    marginTop: 8,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});
