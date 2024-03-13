import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Alert, Share } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import SpaceRow from '../../screens/AboutAppay/SpaceRow';
import UserInfo from '../UserInfo';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

export const ACCOUNT_TYPE = {
  NEED_REGISTER_OFFICIAL_ACCOUNT: 2,
  OFFICIAL_ACCOUNT: 3,
};

class UserInfoContainer extends PureComponent {
  onReferralCodePress = () => {
    this.openShareDialog();
  };

  onUserInfoPress = () => {
    this.props.onUserInfoPress();
  };

  onSeeMorePress = () => {
    Alert.alert('See more');
  };

  onVerifyAccountPress = () => {
    this.props.onVerifyAccountPress();
  };

  onRegisterOfficial = () => {
    this.props.onRegisterOfficialPress();
  };

  onWaitingOfficial = () => {
    this.props.onWaitingOfficialPress();
  };

  onUpdatePhoneNumberPress = () => {
    this.props.onUpdatePhoneNumberPress();
  };

  openShareDialog = async () => {
    try {
      const { userRefCode } = this.props;
      await Share.share({
        message: userRefCode,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  renderUserInfoSection = (userInfo, isVerified) => (
    <TouchableOpacity style={{ marginLeft: 16, marginRight: 16 }} onPress={this.onUserInfoPress}>
      <UserInfo
        user={userInfo}
        isVerifiedAccount={isVerified}
        onPress={this.onUserInfoPress}
        onUpdatePhoneNumberPress={this.onUpdatePhoneNumberPress}
      />
      <Image
        style={{ position: 'absolute', height: '100%', right: 0, top: 0, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  renderUserRefSection = (userRefCode) => (
    <View
      style={{ flex: 1, marginLeft: 16, marginRight: 16, marginTop: 10, backgroundColor: 'white' }}
    >
      <View style={styles.seperateLine} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={TextStyles.heading4}>Mã giới thiệu của bạn là</AppText>
        <TouchableOpacity onPress={this.onReferralCodePress}>
          <AppText style={{ ...TextStyles.heading3, color: Colors.primary2 }}>{userRefCode}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  renderVerifyAccount = () => (
    <TouchableOpacity
      style={{ marginLeft: 16, marginRight: 16, marginTop: 10 }}
      onPress={this.onVerifyAccountPress}
    >
      <AppText style={{ ...TextStyles.heading3 }}>{'Xác thực tài khoản MFAST'}</AppText>
      <AppText style={{ marginTop: 7 }}>{'Để rút tiền về tài khoản NH LK cần xác thực TK'}</AppText>
      <Image
        style={{ position: 'absolute', height: '100%', right: 0, top: 0, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  renderRegisterOfficialAccount = () => (
    <View>
      <SpaceRow style={{ marginTop: 12 }} />
      <TouchableOpacity
        style={{ marginLeft: 16, marginRight: 16, marginTop: 10 }}
        onPress={this.onRegisterOfficial}
      >
        <AppText style={{ ...TextStyles.heading4, fontSize: 12 }}>
          {'Ứng tuyển thành'}
          <AppText style={{ fontWeight: 'bold' }}>{' chuyên viên MFAST '}</AppText>
          {'để tăng thêm thu nhập và hưởng nhiều chính xác và ưu đãi từ MFAST'}
        </AppText>
      </TouchableOpacity>
      <Image
        style={{ position: 'absolute', height: '100%', right: 8, top: 16, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </View>
  );

  renderWaitingOfficial = () => (
    <TouchableOpacity
      style={{ marginLeft: 16, marginRight: 16, marginTop: 10 }}
      onPress={this.onWaitingOfficial}
    >
      <View style={{ flexDirection: 'row' }}>
        <AppText style={{ flex: 6, ...TextStyles.heading4 }}>
          {'Đã đăng kí trở thành chuyên viên bán hàng (DSA)'}
        </AppText>
        <View style={{ flexDirection: 'row', flex: 4 }}>
          <Image source={require('./img/ic_waiting.png')} resizeMode="contain" />
          <AppText style={{ ...TextStyles.heading4, marginLeft: 6, color: Colors.accent2 }}>
            {'Chờ duyệt'}
          </AppText>
        </View>
      </View>
      <Image
        style={{ position: 'absolute', height: '100%', right: 0, top: 0, bottom: 0 }}
        source={require('./img/ic_next.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  renderTypeOfAccount = (accountType) => {
    switch (accountType) {
      // case ACCOUNT_TYPE.NEED_REGISTER_OFFICIAL_ACCOUNT:
      //   return this.renderRegisterOfficialAccount();
      case ACCOUNT_TYPE.OFFICIAL_ACCOUNT:
        return null;
      default:
        return null;
    }
  };

  render() {
    const { user, userRefCode, accountType } = this.props;
    const isVerified = accountType === ACCOUNT_TYPE.OFFICIAL_ACCOUNT;
    return (
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        {this.renderUserInfoSection(user, isVerified)}
        {this.renderUserRefSection(userRefCode)}
        {this.renderTypeOfAccount(accountType)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  seperateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9E9E9',
    marginBottom: 10,
  },
});

export default UserInfoContainer;
