import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { ICON_PATH } from '../../../assets/path';
import { hardFixUrlAvatar, updateProfile } from '../../../redux/actions/user';
import ImageUtils from '../../../utils/ImageUtils';
import { showAlertForRequestPermission } from '../../../utils/permissionV3';
import strings from '../../../constants/strings';
import ImageResizer from 'react-native-image-resizer';
import FirebaseStorage from '../../../submodules/firebase/FirebaseStorage';
import { useDispatch, useSelector } from 'react-redux';
import Indicator from '../../../componentV3/Indicator/Indicator';
import AppText from '../../../componentV3/AppText';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import EditNickname from './EditNickname';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Loading from './Loading';
import DigitelClient from '../../../network/DigitelClient';
import { updateUserMetaStep } from '../../../redux/actions/actionsV3/userMetaData';
import { TrackingEvents } from '../../../constants/keys';
import { logEvent } from '../../../tracking/Firebase';

const UserInfo = memo((props) => {
  const { rankTitle, myUser, userMetaData } = props;

  const bottomSheetRef = useRef();

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState('');
  const [dataLoading, setDataLoading] = useState({
    type: 'LOADING',
    title: '',
    content: '',
  });

  const sourceAvatar = useMemo(() => hardFixUrlAvatar(myUser?.avatarImage), [myUser?.avatarImage]);

  const avatarContainerStyle = useMemo(
    () => [
      styles.avatarContainer,
      {
        borderColor: sourceAvatar?.uri ? Colors.primary5 : Colors.transparent,
      },
    ],
    [sourceAvatar?.uri],
  );

  const pickImage = useCallback(() => {
    const title = 'Cập nhật hình đại điện';
    return new Promise((resolve, reject) => {
      ImageUtils.pickImage('photo', null, title, false, 'photo')
        .then((response) => {
          if (response) {
            resolve(response);
          } else if (response === false) {
            showAlertForRequestPermission(
              Platform.OS === 'ios'
                ? strings.camera_access_error
                : strings.camera_access_error_android,
            );
            reject();
          }
        })
        .catch(() => {
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? strings.camera_access_error
              : strings.camera_access_error_android,
          );
          reject();
        });
    });
  }, []);

  const resizeImage = useCallback(async (fileURI, width = 512, height = 512) => {
    try {
      const response = await ImageResizer.createResizedImage(fileURI, width, height, 'JPEG', 80);
      return response.uri;
    } catch (error) {
      return await Promise.reject(error);
    }
  }, []);

  const uploadImage = useCallback(
    (fileURI, callback) => {
      const userID = myUser.uid;
      let uploadTask = null;
      // create upload task
      uploadTask = FirebaseStorage.uploadProfileAvatar(userID, fileURI);
      // upload
      if (!uploadTask) {
        return;
      }
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          //
        },
        (error) => {
          // error
          callback?.(false, error);
        },
        async (snapshot) => {
          // success
          const downloadURL = await FirebaseStorage.getDownloadURL(snapshot?.metadata?.fullPath);
          callback?.(true, snapshot);
          dispatch(updateProfile({ avatarImage: downloadURL }));
        },
      );
    },
    [dispatch, myUser.uid],
  );

  const onEditAvatar = useCallback(async () => {
    if (!myUser?.isLoggedIn) return;
    try {
      setIsLoadingAvatar(true);
      const response = await pickImage();
      if (response === null) {
        return;
      }
      const image = response?.assets?.[0];
      const imageURI = await resizeImage(image.uri, 256, 256);
      uploadImage(imageURI, (isSuccess, error) => {
        if (!isSuccess) {
          throw error;
        }
        setIsLoadingAvatar(false);
      });
    } catch (error) {
      setIsLoadingAvatar(false);
      Alert.alert('Lỗi cập nhật hình đại điện', error?.message);
    }
  }, [myUser?.isLoggedIn, pickImage, resizeImage, uploadImage]);

  const onOpenBottomSheetEditName = useCallback(() => {
    setBottomSheetType('EditNickname');
    bottomSheetRef?.current?.open('Thay đổi nickname');
  }, []);

  const onEditNickname = useCallback(
    async (nickname) => {
      setBottomSheetType('Loading');
      setDataLoading({
        type: 'LOADING',
        title: `Hệ thống đang xử lý,\nvui lòng không thoát lúc này`,
      });
      const response = await DigitelClient.checkDuplicateNickName(nickname);
      if (!response.status) {
        setDataLoading({
          type: 'ERROR',
          title: `Thay đổi nickname thất bại`,
          content: response.message || 'Có lỗi xãy ra vui lòng thử lại',
        });
        return;
      }
      dispatch(
        updateUserMetaStep({ fullName: nickname }, (isSuccess, result) => {
          if (isSuccess) {
            setDataLoading({
              type: 'SUCCESS',
              title: `Thay đổi nickname thành công`,
              content: `Bạn có thể thay đổi nickname này bất cứ lúc nào, tại trang thông tin tài khoản của mình.`,
            });
          } else {
            setDataLoading({
              type: 'ERROR',
              title: `Cập nhật nickname thất bại`,
              content: result.message || 'Có lỗi xãy ra vui lòng thử lại',
            });
          }
        }),
      );
      DigitelClient.trackEvent(TrackingEvents.UPDATE_NICKNAME);
      logEvent(TrackingEvents.UPDATE_NICKNAME);
    },
    [dispatch],
  );

  const BottomSheetAllType = useMemo(
    () => ({
      EditNickname: EditNickname,
      Loading: Loading,
    }),
    [],
  );

  const BottomSheetRender = useMemo(
    () => BottomSheetAllType?.[bottomSheetType],
    [BottomSheetAllType, bottomSheetType],
  );
  const BottomSheetProps = useMemo(() => {
    switch (bottomSheetType) {
      case 'EditNickname':
        return {
          value: userMetaData?.fullName,
          onEditNickname,
          insetBottom: insets.bottom,
        };
      case 'Loading':
        return {
          insetBottom: insets.bottom,
          ...dataLoading,
        };
    }
  }, [bottomSheetType, dataLoading, insets.bottom, onEditNickname, userMetaData?.fullName]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onEditAvatar}>
        <View style={avatarContainerStyle}>
          <CharAvatar
            style={styles.avatar}
            source={sourceAvatar}
            defaultImage={ICON_PATH.defaultAvatar}
          />
          {myUser?.isLoggedIn ? (
            <>
              <View style={[styles.avatarIconContainer, { left: 0 }]}>
                <Image
                  source={
                    userMetaData?.isCTVConfirmed ? ICON_PATH.activeShield : ICON_PATH.blockShield2
                  }
                  style={[styles.avatarIcon, { paddingTop: 1 }]}
                />
              </View>
              <View style={[styles.avatarIconContainer, { right: 0, paddingLeft: 1 }]}>
                <Image source={ICON_PATH.camera} style={styles.avatarIcon} />
              </View>
            </>
          ) : null}
          {isLoadingAvatar ? <Indicator style={styles.indicator} /> : null}
        </View>
      </TouchableWithoutFeedback>
      {myUser?.isLoggedIn ? (
        <TouchableWithoutFeedback onPress={onOpenBottomSheetEditName}>
          <View style={styles.infoContainer}>
            <Image source={ICON_PATH.edit1} style={styles.editNicknameIcon} />
            <View style={styles.inputEditNicknameContainer}>
              <AppText semiBold style={styles.textEditNickname}>
                {userMetaData?.fullName}
              </AppText>
              <DashedHorizontal />
            </View>
            <View style={styles.dot} />
            <AppText
              semiBold
              style={[styles.textEditNickname, { color: rankTitle ? Colors.blue3 : Colors.gray5 }]}
            >
              {rankTitle || 'Đang cập nhật'}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => <BottomSheetRender {...BottomSheetProps} />}
        canClose
        haveCloseButton
        avoidKeyboard
        headerStyle={styles?.bottomSheetHeaderContainer}
      />
    </View>
  );
});

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 96 / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 96 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIconContainer: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  indicator: {
    position: 'absolute',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    height: 26,
  },
  editNicknameIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  inputEditNicknameContainer: {
    height: '100%',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEditNickname: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.gray1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4 / 2,
    backgroundColor: Colors.gray8,
    marginHorizontal: 12,
  },
  bottomSheetHeaderContainer: { backgroundColor: Colors.primary5 },
});

const DashedHorizontal = memo((props) => {
  const { width = '100%', height = 1, size = 1, color = Colors.neutral3 } = props;
  return (
    <View style={{ width, height, overflow: 'hidden', bottom: 0, position: 'absolute' }}>
      <View
        style={{
          height: height * 2,
          borderWidth: size,
          width,
          borderStyle: 'dashed',
          borderColor: color,
        }}
      />
    </View>
  );
});
