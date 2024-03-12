import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { _ } from 'lodash';

import CustomButton, { BUTTON_SIZE, BUTTON_COLOR } from '../../components2/CustomButton';
import TextStyles from '../../theme/TextStyle';
import LoginToolbar from '../../components2/LoginToolbar/index';
import CustomTextInput from '../../components2/CustomTextInput/index';
import LinkButton from '../../components2/LinkButton';
import ReferralResult from '../../components2/ReferralResult';
import Colors from '../../theme/Color';
import { registerExternal, getUsers } from '../../redux/actions/user';
import { Alert } from 'react-native';
import { AsyncStorageKeys } from '../../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SH, SW } from '../../constants/styles';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class RegisterReferralScreen extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      RegisterReferralScreen._getFirstUser(nextProps.getUsersResponse) &&
      RegisterReferralScreen._getFirstUser(nextProps.getUsersResponse).isKyc
    ) {
      return { ...prevState, canGoNextStep: true };
    }
    return { ...prevState, canGoNextStep: false };
  }

  static _getFirstUser = (userResponse) => {
    const user = userResponse ? userResponse : {};

    const userData = (user?.data || [])[0];

    if (userData?.isKyc) {
      return userData;
    } else {
      return undefined;
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      canGoNextStep: false,
      isShownReferralResult: false,
      isCheck: false,
      referralID: '',
    };
    this._onChangeTextDelayed = _.debounce(this._onChangeText, 700);

    this.params = this.props.navigation.state.params;
  }
  async componentDidMount() {
    try {
      const refCode = await AsyncStorage.getItem(AsyncStorageKeys.REFFERAL_CODE);
      if (refCode?.length > 0) {
        // this.referralID = refCode;
        this.setState({
          referralID: refCode,
          isShownReferralResult: true,
        });
        setTimeout(() => {
          this.props.getUsers(refCode);
        }, 200);
      }
    } catch (error) {}
  }

  _onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  _onNextButtonPress = () => {
    const id = RegisterReferralScreen._getFirstUser(this.props.getUsersResponse)?.subscriptionID;
    const onSuccess = () => {
      this.props.navigation.dismiss();
    };
    this.props.register({ ...this.params, referralID: id }, onSuccess);
  };

  _onSkipPress = () => {
    const onSuccess = () => {
      this.props.navigation.dismiss();
    };
    this.props.register({ ...this.params }, onSuccess);
  };

  _onChangeText = (text) => {
    this.setState({ isShownReferralResult: text !== '', referralID: text });
    this.props.getUsers(text);
  };

  // --------------------------------------------------
  // Render methods
  // --------------------------------------------------
  _renderToolbar = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: SW(24),
        }}
      >
        <TouchableWithoutFeedback onPress={this._onToolbarBackBtnPress}>
          <Image source={ICON_PATH.back} style={styles.backIconStyle} />
        </TouchableWithoutFeedback>
        <AppText style={styles.headerTitle}>Chọn người giới thiệu</AppText>
        <View opacity={0}>
          <TouchableWithoutFeedback>
            <Image source={ICON_PATH.back} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  _renderReferralInput = () => (
    // <CustomTextInput
    //   containerStyle={{
    //     marginLeft: 16,
    //     marginRight: 16,
    //   }}
    //   isShowUnderLine
    //   placeholder={'Nhập để tìm kiếm'}
    //   autoFocus
    //   showIcon={false}
    //   keyboardType={'phone-pad'}
    //   returnKeyType={'done'}
    //   onChangeText={this._onChangeTextDelayed}
    // />
    <TextInput
      style={{
        marginLeft: 16,
        marginRight: 16,
        paddingBottom: SW(16),
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        fontSize: SH(16),
        lineHeight: SH(22),
        textAlign: 'center',
      }}
      placeholder={'Nhập để tìm kiếm'}
      autoFocus
      keyboardType="phone-pad"
      onChangeText={this._onChangeText}
      value={this.state.referralID}
    />
  );

  _renderWarningMessage = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <Text style={{ ...TextStyles.heading4 }}>
        {'Chỉ được chọn '}
        <Text style={{ ...TextStyles.heading4, color: Colors.accent3, fontWeight: 'bold' }}>
          {'1 lần duy nhất'}
        </Text>
      </Text>
    </View>
  );

  showAlert = (text) => {
    return Alert.alert(text);
  };

  _renderReferralSearchResult = () => {
    const user = RegisterReferralScreen._getFirstUser(this.props.getUsersResponse) || {};

    return (
      <ReferralResult
        containerStyle={{ marginTop: SH(12), marginHorizontal: SW(16) }}
        userAvatarUrl={user.avatarImage ? user.avatarImage : ''}
        userName={user.fullName ? user.fullName : ''}
        userPhoneNumber={user.mobilePhone ? user.mobilePhone : ''}
        hasNoData={!user.mobilePhone}
        isLoading={this.props.isGetUsersProcessing}
        onReferralResultPress={() => {}}
        mFastCode={this.state.referralID}
      />
    );
  };

  _renderSkipThisStep = () => (
    <View
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 0,
        justifyContent: 'center',
        paddingHorizontal: 40,
        alignItems: 'flex-end',
      }}
    >
      <Text style={{ ...TextStyles.caption1, opacity: 0.8 }}>{'Nếu không có vui lòng bấm '}</Text>
      <LinkButton
        textStyle={{
          fontSize: 16,
          fontWeight: '500',
          fontStyle: 'normal',
          lineHeight: 23,
          letterSpacing: 0,
          color: Colors.primary4,
        }}
        text={'Bỏ qua'}
        onPress={this._onSkipPress}
      />
      <Text style={{ ...TextStyles.caption1, opacity: 0.8 }}>{' để hoàn tất đăng ký'}</Text>
    </View>
  );

  _renderPickReferralButton = () => (
    <CustomButton
      // containerStyle={{ marginTop: 31 }}
      buttonStyle={{ width: 246 }}
      title={'Chọn người giới thiệu'}
      buttonColor={BUTTON_COLOR.BLUE}
      sizeType={BUTTON_SIZE.LARGE}
      disabled={!this.state.canGoNextStep}
      onPress={this._onNextButtonPress}
    />
  );

  clearInput = () => {
    this.setState({
      referralID: '',
      isShownReferralResult: false,
    });
  };

  render() {
    const { isShownReferralResult, referralID } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1, backgroundColor: Colors.actionBackground }}
      >
        <SafeAreaView style={{}}>
          {this._renderToolbar()}
          <View style={{}}>
            <View style={{ marginTop: SH(36), alignItems: 'center' }}>
              <AppText style={styles.titleStyle}>Người hướng dẫn của bạn</AppText>
            </View>
            <View style={{ marginHorizontal: SW(16) }}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={this._onChangeText}
                value={referralID}
                placeholder={'Nhập mã MFast'}
              />
              {referralID?.length > 0 ? (
                <TouchableWithoutFeedback onPress={this.clearInput}>
                  <View style={styles.rightIconStyle}>
                    <Image source={ICON_PATH.close4} style={styles.iconStyle} />
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
            </View>
            <View style={{ marginTop: SH(12), alignItems: 'center' }}>
              <AppText style={styles.regularText}>Kết quả tìm kiếm</AppText>
            </View>
            {isShownReferralResult && this._renderReferralSearchResult()}
            <View style={{ paddingHorizontal: SW(16), alignItems: 'center', marginTop: SH(32) }}>
              <AppText
                style={[
                  styles.titleStyle,
                  { textAlign: 'center', paddingHorizontal: SW(16), color: '#6b6b81' },
                ]}
              >
                Nếu{' '}
                <AppText semiBold style={styles.titleStyle}>
                  không có người hướng dẫn
                </AppText>{' '}
                hoặc không muốn chọn vui lòng bấm{' '}
                <AppText
                  semiBold
                  style={[
                    styles.titleStyle,
                    { color: Colors.primary2, textDecorationLine: 'underline' },
                  ]}
                  onPress={this._onSkipPress}
                >
                  Bỏ qua
                </AppText>
              </AppText>
            </View>
            <View
              style={[
                styles.buttonStyle,
                {
                  backgroundColor: !this.state.canGoNextStep ? '#c4c7d8' : Colors.primary2,
                  // marginTop: SH(250),
                },
              ]}
            >
              <TouchableOpacity
                onPress={this._onNextButtonPress}
                disabled={!this.state.canGoNextStep}
              >
                <AppText medium style={[styles.titleStyle, { color: Colors.primary5 }]}>
                  Xác nhận
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginLeft: 80,
    marginRight: 80,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
  },
  indicatorNote: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: 'normal',
    fontStyle: 'italic',
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    marginLeft: 30,
    marginRight: 30,
  },
  headerTitle: {
    fontSize: SH(17),
    lineHeight: SH(20),
    color: Colors.primary4,
  },
  backIconStyle: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
  },
  titleStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  inputStyle: {
    height: SH(48),
    borderRadius: 24,
    borderColor: Colors.gray4,
    borderWidth: 1,
    backgroundColor: Colors.primary5,
    marginTop: SH(12),
    textAlign: 'center',
    fontSize: SH(18),
    // lineHeight: SH(21),
    color: Colors.gray1,
    fontFamily: fonts.medium,
    minWidth: SW(343),
  },
  regularText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray5,
  },
  rightIconStyle: {
    position: 'absolute',
    right: SW(16),
    top: SH(24),
  },
  iconStyle: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  buttonStyle: {
    minHeight: SH(48),
    backgroundColor: Colors.primary2,
    marginHorizontal: SW(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: SH(20),
  },
});

const mapDispatchToProps = (dispatch) => ({
  register: (data, options) => dispatch(registerExternal(data, options)),
  getUsers: (keySearch) => dispatch(getUsers(keySearch)),
});

const mapStateToProps = (state) => ({
  getUsersResponse: state.getUsersResponse,
  isLoginProcessing: state.isLoginProcessing,
  isGetUsersProcessing: state.isGetUsersProcessing,
});

RegisterReferralScreen.navigationOptions = () => ({
  header: null,
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterReferralScreen);
