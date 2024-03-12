import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import DigitelClient from '../../network/DigitelClient';
import { TrackingEvents } from '../../constants/keys';

import { useActions } from '../../hooks/useActions';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { updateUserMetaStep } from '../../redux/actions/actionsV3/userMetaData';
import { getIsLoadingUpdateUserMeta } from '../../redux/selectors/commonLoadingSelector';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';

import { ICON_PATH } from '../../assets/path';
import { logEvent } from '../../tracking/Firebase';

const PopupNickName = ({ onClose, isVisible, isRequired = true }) => {
  const [nickname, setNickname] = useState('');
  const [isShowError, setIsShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const userMetaData = useSelectorShallow(getUserMetaDataSelector);
  const isLoadingUpdate = useSelectorShallow(getIsLoadingUpdateUserMeta);

  //
  const [isSuccess, setIsSuccess] = useState(false);

  const actions = useActions({ updateUserMetaStep });

  useEffect(() => {
    if (!isLoadingUpdate && userMetaData?.fullName === nickname && nickname) {
      setIsSuccess(true);
    }
  }, [userMetaData, isLoadingUpdate]);

  const onStaticClose = useCallback(() => {
    if (onClose) {
      onClose();
      setNickname('');
      setIsShowError(false);
      setErrorMessage('');
      setIsSuccess(false);
    }
  }, [onClose]);

  const onStaticBackdropPress = useCallback(() => {
    if (isRequired) {
      return;
    }
    if (onClose) {
      onClose();
      setNickname('');
      setIsShowError(false);
      setErrorMessage('');
      setIsSuccess(false);
    }
  }, [onClose, isRequired]);

  const onClearNickName = useCallback(() => {
    setNickname('');
  }, []);

  const isValidNickName = useCallback(() => {
    const regEx = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return regEx.test(nickname);
  }, [nickname]);

  const isValidSpace = useCallback(() => {
    const regEx = /\s/;
    return regEx.test(nickname);
  }, [nickname]);

  const onPressSubmit = useCallback(async () => {
    if (isValidSpace()) {
      setIsShowError(true);
      setErrorMessage('Nickname không được có khoảng trắng.');
      return;
    }
    if (isValidNickName()) {
      setIsShowError(true);
      setErrorMessage('Nickname không được chứa các ký tự đặc biệt');
      return;
    }
    const response = await DigitelClient.checkDuplicateNickName(nickname);
    if (!response.status) {
      setIsShowError(true);
      setErrorMessage(response.message || 'Có lỗi xãy ra vui lòng thử lại');
      return;
    }
    actions.updateUserMetaStep({ fullName: nickname });
    setIsShowError(false);
    setErrorMessage('');
    DigitelClient.trackEvent(TrackingEvents.UPDATE_NICKNAME);
    logEvent(TrackingEvents.UPDATE_NICKNAME);
  }, [nickname, isValidNickName, isValidSpace, actions]);

  const renderBottomLock = useCallback(() => {
    if (isSuccess) return renderSuccessButton();
    const disabled = nickname?.length < 5;
    return (
      <TouchableOpacity disabled={disabled} onPress={onPressSubmit}>
        <View style={[styles.footer, disabled && { opacity: 0.3 }]}>
          <AppText style={styles.labelBtn}>Cập nhật</AppText>
        </View>
      </TouchableOpacity>
    );
  }, [onPressSubmit, isSuccess, renderSuccessButton]);

  const renderSuccessButton = useCallback(() => {
    return (
      <TouchableOpacity onPress={onStaticClose}>
        <View style={[styles.footer]}>
          <AppText style={styles.labelBtn}>Hoàn tất</AppText>
        </View>
      </TouchableOpacity>
    );
  }, [onStaticClose]);

  const renderBottomGroup = useCallback(() => {
    if (isSuccess) return renderSuccessButton();
    const disabled = nickname?.length < 5;
    return (
      <View style={styles.footerGroup}>
        <View style={styles.bottomLeft}>
          <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
            <AppText style={styles.labelLeftBtn}>Đóng</AppText>
          </TouchableOpacity>
        </View>
        <View style={[styles.bottomRight, disabled && { opacity: 0.3 }]}>
          <TouchableOpacity disabled={disabled} onPress={onPressSubmit} style={styles.bottomRight}>
            <AppText style={styles.labelBtn}>Cập nhật</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [onPressSubmit, onStaticClose, nickname, isSuccess, renderSuccessButton]);

  const renderSuccess = useCallback(() => {
    return (
      <View style={styles.body}>
        <Image source={ICON_PATH.success} />
        <AppText style={styles.indicatorSuccess}>Cập nhật nickname thành công !!!</AppText>
        <AppText style={styles.indicatorDecsSuccess}>
          Bạn có thể thay đổi nickname này bất cứ lúc nào, tại trang thông tin tài khoản của mình.
        </AppText>
      </View>
    );
  }, []);

  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        onBackdropPress={onStaticBackdropPress}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.wrapper}>
            <View style={styles.container}>
              {isLoadingUpdate && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary2} />
                </View>
              )}
              {isSuccess ? (
                renderSuccess()
              ) : (
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Image source={ICON_PATH.search2} style={styles.ic} />
                    <AppText style={styles.headerTitle}>Đặt cho mình một nickname</AppText>
                  </View>
                  <View style={{ width: '100%', justifyContent: 'center' }}>
                    <TextInput
                      autoFocus
                      value={nickname}
                      autoCapitalize="none"
                      onChangeText={(value) => setNickname(value)}
                      style={[
                        styles.input,
                        isShowError && { borderColor: Colors.accent3, backgroundColor: '#ffeaec' },
                      ]}
                      autoCorrect={false}
                      placeholder="Nhập nickname"
                    />
                    {!!nickname && (
                      <View style={styles.clearIc}>
                        <TouchableOpacity onPress={onClearNickName}>
                          <Image source={ICON_PATH.delete1} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {isShowError && (
                    <View style={styles.errorWrapper}>
                      <Image source={ICON_PATH.warning} />
                      <AppText style={styles.errorTxt}>{errorMessage}</AppText>
                    </View>
                  )}
                  <View>
                    <AppText style={styles.indicator}>
                      Nickname này sẽ dùng thay cho tên của bạn tại tất cả hiện thị và tìm kiếm trên
                      MFast.
                    </AppText>
                    <View style={{ height: 8 }} />
                    <AppText style={styles.indicator}>
                      Lưu ý: Nickname{' '}
                      <AppText style={styles.waring}>
                        không được gồm khoảng trắng, độ dài từ 5 đến 20 ký tự.
                      </AppText>
                    </AppText>
                  </View>
                </View>
              )}
              {isRequired ? renderBottomLock() : renderBottomGroup()}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PopupNickName;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  safe: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 16,
    top: 120,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: Colors.neutral5,
    borderRadius: 10,
  },
  body: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ic: {
    width: 29,
    height: 32,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary1,
    marginLeft: 10,
  },
  input: {
    marginTop: 14,
    marginBottom: 10,
    width: '100%',
    height: 42,
    borderRadius: 5,
    backgroundColor: '#f3fff0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.primary2,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  footer: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBtn: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
  },
  indicator: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: Colors.primary4,
    textAlign: 'left',
  },
  waring: {
    color: Colors.accent3,
  },
  clearIc: {
    position: 'absolute',
    right: 20,
  },
  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  errorTxt: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
    marginLeft: 6,
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  bottomLeft: {
    flex: 1,
    height: 56,
    width: '100%',
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    flex: 1,
    width: '100%',
    height: 56,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 10,
  },
  labelLeftBtn: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary3,
  },
  labelBtn: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary2,
  },
  indicatorSuccess: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#2b7d0a',
    marginTop: 20,
    marginBottom: 10,
  },
  indicatorDecsSuccess: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    opacity: 0.8,
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
