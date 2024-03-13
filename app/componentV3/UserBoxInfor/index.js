import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import isEmpty from 'lodash/isEmpty';

import useOnPress from '../../hooks/useOnPress';

// import GradientText from '../GradientText';
import CharAvatar from '../CharAvatar';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';

const UserBox = (props) => {
  const {
    isShowEdit = false,
    name,
    avatar,
    createTime,
    onPress,
    arenaInfor,
    isLogined,
    onPressEditAvatar,
    onPressEditNickName,
    isVerifiedAccount,
    mFastCode,
    userReferralName,
    goToRefferalPage: goToReferralPage,
    isLinePartner,
  } = props;

  const _onPress = useCallback(() => {
    if (onPress) {
      onPress(isLogined);
    }
  }, [isLogined, onPress]);

  const onStaticPressEditAvatar = useCallback(() => {
    if (isShowEdit && onPressEditAvatar) {
      onPressEditAvatar();
    } else {
      if (onPress) {
        onPress(isLogined);
      }
    }
  }, [isShowEdit, onPressEditAvatar, onPress, isLogined]);

  const onStaticArenaPress = useCallback(() => {
    if (arenaInfor?.url) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useOnPress({ action: arenaInfor?.url });
    }
  }, []);

  const parseDate = useCallback(() => {
    if (!createTime) return;
    const d = new Date(createTime * 1000);
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    const date = d.getDate();
    return `${date}/${month}/${year}`;
  }, [createTime]);

  const renderAnonymous = useCallback(() => {
    return (
      <View style={styles.inforContainer}>
        <AppText style={styles.txtIndicator}>Xin chào!</AppText>
        <AppText style={styles.txtIndicator}>
          <AppText style={styles.txtIndicatorBold}>Đăng nhập</AppText> để sử dụng dịch vụ
        </AppText>
      </View>
    );
  }, []);

  const renderArenaInfor = useCallback(() => {
    if (isEmpty(arenaInfor)) {
      return <View />;
    }
    return (
      <View>
        <View style={styles.arenaInforContainer}>
          <View style={styles.arenaContainer}>
            <Image
              source={{ uri: arenaInfor?.logo }}
              style={{ width: SW(72), height: SH(72), resizeMode: 'contain' }}
            />
            <View style={{ flex: 1, marginHorizontal: SW(12) }}>
              <View style={styles.contentRow}>
                <AppText style={styles.txtLevel}>Cấp bậc hiện tại:</AppText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  minHeight: SH(30),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SH(3) }}>
                  <AppText semiBold style={styles.txtSlogan}>
                    {arenaInfor?.level}
                  </AppText>
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      backgroundColor: Colors.highLightColor,
                      borderRadius: 2,
                      marginHorizontal: SW(8),
                    }}
                  />

                  <AppText semiBold style={styles.txtSlogan}>
                    {arenaInfor?.starRanking}
                  </AppText>
                </View>
                <Image
                  source={ICON_PATH.boldStar}
                  style={{
                    tintColor: Colors.highLightColor,
                    width: SW(20),
                    height: SH(20),
                    resizeMode: 'contain',
                    marginLeft: SW(4),
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }, [arenaInfor]);

  const renderReferralBlock = useCallback(
    (mfast, userRefName) => {
      return (
        <View style={{ marginTop: SH(12), flex: 1 }}>
          <View
            style={[
              styles.blockRow,
              {
                justifyContent: 'space-between',
                flex: 1,
                marginBottom: SH(4),
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <AppText style={styles.smallText}>Mã MFast:</AppText>
            </View>

            <View style={{ flex: 1 }}>
              <AppText style={styles.smallText}>Người hướng dẫn:</AppText>
            </View>
          </View>
          <View style={[styles.blockRow, { justifyContent: 'space-between', flex: 1 }]}>
            <View style={{ flex: 1 }}>
              <AppText medium style={styles.normalText}>
                {mfast}
              </AppText>
            </View>

            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={goToReferralPage}>
                <View style={styles.blockRow}>
                  <AppText medium style={[styles.normalText, { alignText: 'center' }]}>
                    {userRefName?.length > 0 ? userRefName : 'Bạn là người dùng tự do'}
                  </AppText>

                  <Image
                    style={[styles.icNext, { marginLeft: SW(4) }]}
                    source={ICON_PATH.arrow_right}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      );
    },
    [goToReferralPage],
  );

  return (
    <TouchableWithoutFeedback onPress={_onPress}>
      <View style={styles.wrapper}>
        <View style={styles.formWrapper}>
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
                <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 3 }]}>
                  <View style={[styles.row, { flex: 1, marginRight: 16 }]}>
                    <AppText medium style={styles.name} numberOfLines={2}>
                      {name || '---'}
                    </AppText>
                  </View>
                  {!!onPressEditNickName && (
                    <TouchableWithoutFeedback onPress={onPressEditNickName}>
                      <View style={styles.row}>
                        <AppText style={styles.indicatorEdit}>Sửa</AppText>
                        <Image
                          style={[styles.icEdit, { marginLeft: SW(5) }]}
                          source={ICON_PATH.edit1}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                </View>
                {createTime ? (
                  <AppText style={styles.createTime}>{`Ngày tham gia - ${parseDate()}`}</AppText>
                ) : (
                  <View />
                )}
                {!isVerifiedAccount ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SH(5) }}>
                    <Image
                      source={ICON_PATH.block_shield}
                      style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
                    />
                    <AppText
                      style={{
                        fontSize: SH(13),
                        lineHeight: SH(18),
                        color: Colors.accent3,
                        marginLeft: SW(8),
                      }}
                    >
                      Tài khoản chưa được định danh
                    </AppText>
                  </View>
                ) : (
                  renderReferralBlock(mFastCode, userReferralName)
                )}
              </View>
            )}
          </View>
          {renderArenaInfor()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserBox;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 0,
  },
  avatar: {
    width: SW(80),
    height: SW(80),
    borderRadius: SW(40),
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inforContainer: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  arenaInforContainer: {
    flex: 1,
    marginTop: 12,
    justifyContent: 'center',
    borderTopColor: Colors.neutral3,
    borderTopWidth: 0.5,
  },
  divider: {
    width: '100%',
    height: 1,
    opacity: 0.3,
    backgroundColor: Colors.neutral4,
    marginVertical: 13,
  },
  name: {
    fontSize: SH(16),
    lineHeight: SH(19),
    // fontWeight: '500',
    // fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary1,
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
    fontSize: 12,
    opacity: 0.8,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 18,
    letterSpacing: 0,
    color: Colors.primary3,
  },
  txtIndicator: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: '#fff',
  },
  txtIndicatorBold: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    color: '#fff',
  },
  icEditCon: {
    position: 'absolute',
    bottom: 6,
    right: -5,
    width: SW(24),
    height: SW(24),
    backgroundColor: '#fff',
    borderRadius: SW(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icEdit: {
    width: SW(14),
    height: SH(14),
    resizeMode: 'contain',
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
  arenaContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtLevel: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
  icStar: {
    width: 21,
    height: 20,
    marginTop: -4,
    marginLeft: 4,
  },
  txtSlogan: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.blue4,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: Colors.gray5,
  },
  normalText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
  },
  marginView: {
    marginLeft: SW(24),
  },
  icNext: {
    width: SW(16),
    height: SH(16),
    resizeMode: 'contain',
  },
});
