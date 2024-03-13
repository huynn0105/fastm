import React, { useCallback } from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import CharAvatar from '../CharAvatar';

const UserBox = (props) => {
  const {
    isShowEdit = false,
    name,
    avatar,
    phoneNumber,
    isVerifiedAccount,
    referralCode,
    createTime,
    onPress,
    hideIconNext,
    isLogined,
    arenaLogoUrl,
    onPressReferralCode,
    onPressReferralDisabledCode,
    onPressEditAvatar,
    onPressEditNickName,
    myUser,
    onPressReferralName,
  } = props;

  const _onPress = useCallback(() => {
    if (onPress) {
      onPress(isLogined);
    }
  }, [isLogined, onPress]);

  const _onPressReferralCode = useCallback(() => {
    if (referralCode && !isVerifiedAccount && onPressReferralDisabledCode) {
      onPressReferralDisabledCode();
    }
    if (referralCode && isVerifiedAccount && onPressReferralCode) {
      onPressReferralCode(referralCode);
    }
  }, [referralCode, onPressReferralCode, isVerifiedAccount, onPressReferralDisabledCode]);

  const _onPressReferralDisabledCode = useCallback(() => {
    if (referralCode && !isVerifiedAccount && onPressReferralDisabledCode) {
      onPressReferralDisabledCode();
    }
  }, [referralCode, isVerifiedAccount, onPressReferralDisabledCode]);

  const onStaticPressEditAvatar = useCallback(() => {
    if (isShowEdit && onPressEditAvatar) {
      onPressEditAvatar();
    } else {
      if (onPress) {
        onPress(isLogined);
      }
    }
  }, [isShowEdit, onPressEditAvatar, onPress, isLogined]);

  const parseDate = useCallback(() => {
    if (!createTime) return;
    const d = new Date(createTime * 1000);
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    return `${date}/${month}/${year}`;
  }, [createTime]);

  const renderAnonymous = useCallback(() => {
    return (
      <View style={styles.inforContainer}>
        <AppText medium style={styles.txtIndicator}>
          Xin chào!
        </AppText>
        <AppText style={styles.txtIndicator}>
          <AppText bold style={styles.txtIndicatorBold}>
            Đăng nhập
          </AppText>
          {' để bắt đầu tạo nhu nhập'}
        </AppText>
      </View>
    );
  }, []);

  return (
    <SafeAreaView>
      <View>
        <View
          style={{ borderBottomLeftRadius: 26, borderBottomRightRadius: 26, overflow: 'hidden' }}
        >
          <LinearGradient
            colors={['rgb(40, 158, 255)', 'rgb(0, 91, 243)']}
            style={styles.linearGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableWithoutFeedback onPress={_onPress}>
              <View style={styles.wrapper}>
                <View style={styles.formContainer}>
                  <TouchableWithoutFeedback disabled={!isLogined} onPress={onStaticPressEditAvatar}>
                    <View>
                      <CharAvatar defaultName={name} source={avatar} style={styles.avatar} />
                      {isShowEdit && (
                        <View style={styles.icEditCon}>
                          <Image source={ICON_PATH.edit1} style={styles.icEdit} />
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>

                  {!isLogined ? (
                    renderAnonymous()
                  ) : (
                    <View style={styles.inforContainer}>
                      <View
                        style={[styles.row, { justifyContent: 'space-between', marginBottom: 6 }]}
                      >
                        <View style={[styles.row, { flex: 1, marginRight: 16 }]}>
                          {isVerifiedAccount ? (
                            <Image
                              style={styles.icAc}
                              source={ICON_PATH.shield}
                              resizeMode="contain"
                            />
                          ) : (
                            <Image
                              style={[styles.ic, { marginRight: 8 }]}
                              source={ICON_PATH.shield_un}
                              resizeMode="contain"
                            />
                          )}
                          <AppText style={styles.name} numberOfLines={2}>
                            {name || '---'}
                          </AppText>
                        </View>
                        {!!onPressEditNickName && (
                          <TouchableWithoutFeedback onPress={onPressEditNickName}>
                            <View style={styles.row}>
                              <AppText style={styles.indicatorEdit}>nickname</AppText>
                              <Image
                                style={[styles.icEdit, { marginLeft: 5 }]}
                                source={ICON_PATH.edit1}
                                resizeMode="contain"
                              />
                            </View>
                          </TouchableWithoutFeedback>
                        )}
                      </View>

                      <View style={styles.phoneRow}>
                        <Image style={styles.ic} source={ICON_PATH.phone1} resizeMode="contain" />
                        <AppText style={styles.phone}>{phoneNumber || '---'}</AppText>
                      </View>
                      {createTime ? (
                        <View style={styles.phoneRow}>
                          <Image style={styles.ic} source={ICON_PATH.clock1} resizeMode="contain" />
                          <AppText
                            style={styles.createTime}
                          >{`Ngày tham gia - ${parseDate()}`}</AppText>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  )}
                  {!!arenaLogoUrl && (
                    <Image
                      source={{ uri: arenaLogoUrl }}
                      style={{ width: 56, height: 56, marginRight: 10 }}
                    />
                  )}
                  {!hideIconNext && <Image source={ICON_PATH.next1} resizeMode="contain" />}
                </View>
                {!!referralCode && <View style={styles.divider} />}
                {!!referralCode && (
                  <View>
                    <TouchableWithoutFeedback onPress={_onPressReferralCode}>
                      <View>
                        <View style={styles.refCodeContainer}>
                          <AppText style={styles.indicatorRefCode}>Mã MFast của bạn là:</AppText>
                          <AppText
                            bold
                            style={[styles.refCode, !isVerifiedAccount && styles.refCodeDisabled]}
                          >
                            {referralCode}
                          </AppText>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={onPressReferralName}>
                      <View style={styles.refCodeContainer}>
                        <AppText style={styles.indicatorRefCode}>Người hướng dẫn bán hàng:</AppText>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <AppText
                            style={[
                              styles.referralCodeText,
                              !isVerifiedAccount && styles.refCodeDisabled,
                            ]}
                          >
                            {myUser?.userReferralName?.length > 0
                              ? myUser?.userReferralName
                              : 'Bạn là CTV tự do'}
                          </AppText>
                          <Image
                            source={ICON_PATH.arrow_right}
                            style={{
                              width: SW(16),
                              height: SH(16),
                              resizeMode: 'contain',
                              tintColor: Colors.primary5,
                            }}
                          />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )}
                {!!referralCode && !isVerifiedAccount && (
                  <TouchableWithoutFeedback onPress={_onPressReferralDisabledCode}>
                    <View style={styles.lockRefCode}>
                      <Image style={styles.ic} source={ICON_PATH.shield_un} resizeMode="contain" />
                      <AppText style={styles.anonymous}>
                        Định danh tài khoản để kích hoạt mã MFast
                      </AppText>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </View>
        <View style={styles.overlay} />
      </View>
    </SafeAreaView>
  );
};

export default UserBox;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  linearGradient: {
    flex: 1,
  },
  overlay: {
    backgroundColor: Colors.neutral5,
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    zIndex: -100,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inforContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    opacity: 0.3,
    backgroundColor: Colors.neutral4,
    marginVertical: 13,
  },
  refCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  indicatorRefCode: {
    flex: 1,
    fontSize: SH(13),
    lineHeight: SH(18),
    letterSpacing: 0,
    opacity: 0.8,
    color: '#fff',
  },
  refCode: {
    fontSize: SH(20),
    lineHeight: SH(30),
    textAlign: 'right',
    letterSpacing: 2,
    color: '#fff',
  },
  referralCodeText: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.primary5,
  },
  refCodeDisabled: {
    opacity: 0.3,
    color: '#fff',
  },
  lockRefCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  name: {
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fff',
  },
  phone: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fff',
  },
  anonymous: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 18,
    letterSpacing: 0,
    color: '#fff',
    marginLeft: 10,
  },
  ic: {
    width: 20,
    height: 20,
  },
  icAc: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  createTime: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.primary3,
    marginLeft: 10,
  },
  txtIndicator: {
    fontSize: SH(14),
    lineHeight: SH(22),
    // fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fff',
  },
  txtIndicatorBold: {
    textDecorationLine: 'underline',

    color: '#fff',
  },
  icEditCon: {
    position: 'absolute',
    bottom: 6,
    right: -5,
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icEdit: {
    width: 21,
    height: 21,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorEdit: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: Colors.primary2,
  },
});
