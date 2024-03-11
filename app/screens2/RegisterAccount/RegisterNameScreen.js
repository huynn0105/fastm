import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import LoginToolbar from '../../components2/LoginToolbar/index';
import CustomTextInput from '../../components2/CustomTextInput';
import CustomButton, { BUTTON_SIZE, BUTTON_COLOR } from '../../components2/CustomButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import AppPolicyCheckBox from '../../components2/AppPolicyCheckBox';
import DigitelClient from '../../network/DigitelClient';

import LoadingModal from '../../componentV3/LoadingModal';
class RegisterNameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoNextStep: false,
      fullName: '',
      isShownError: false,
      errorMessage: '',
      isLoading: false,
    };
    this.params = this.props.navigation.state.params;
  }

  _onToolbarBackBtnPress = () => {
    this.props.navigation.goBack();
  };

  isValidNickName = () => {
    const { fullName } = this.state;
    const regEx = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return regEx.test(fullName);
  };

  isValidSpace = () => {
    const { fullName } = this.state;
    var regEx = /\s/;
    return regEx.test(fullName);
  };

  _onNextButtonPress = async () => {
    const { fullName } = this.state;
    if (this.isValidSpace()) {
      this.setState({
        isShownError: true,
        errorMessage: 'Nickname không được có khoảng trắng.',
      });
      return;
    }
    if (this.isValidNickName()) {
      this.setState({
        isShownError: true,
        errorMessage: 'Nickname không được chứa các ký tự đặc biệt',
      });
      return;
    }
    this.setState({
      isShownError: false,
      errorMessage: '',
    });
    this.setState({ isLoading: true });
    const response = await DigitelClient.checkDuplicateNickName(fullName);
    this.setState({ isLoading: false });
    if (!response.status) {
      this.setState({
        isShownError: true,
        errorMessage: response.message || 'Có lỗi xãy ra vui lòng thử lại',
      });
      return;
    }
    this.props.navigation.navigate('RegisterReferral', {
      ...this.params,
      fullName,
    });
  };

  onPolicyPress = () => {
    const { termsOfUsageUrl } = this.props.appInfo;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Điều khoản sử dụng',
      url: termsOfUsageUrl,
    });
  };

  onPrivacyPress = () => {
    const { privacyPolicyUrl } = this.props.appInfo;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Chính sách bảo mật',
      url: privacyPolicyUrl,
    });
  };

  checkIfCanGoNextStep = (fullName, isPolicyChecked) => {
    this.setState({ canGoNextStep: fullName.length >= 5 && isPolicyChecked });
  };

  _onChangeText = (text) => {
    this.setState({ fullName: text }, () => {
      this.checkIfCanGoNextStep(text, this.isPolicyCheckBoxChecked);
    });
  };

  _onPolicyCheckBoxPress = (isChecked) => {
    this.isPolicyCheckBoxChecked = isChecked;
    const { fullName } = this.state;
    this.checkIfCanGoNextStep(fullName, this.isPolicyCheckBoxChecked);
  };

  // --------------------------------------------------
  // Render methods
  // --------------------------------------------------
  _renderToolbar = () => <LoginToolbar onToolbarBackPress={this._onToolbarBackBtnPress} />;

  _renderNameInput = () => (
    <CustomTextInput
      containerStyle={{
        marginLeft: 16,
        marginRight: 16,
      }}
      isShownError={this.state.isShownError}
      errorMessage={this.state.errorMessage}
      value={this.state.fullName}
      inputStyle={{
        fontSize: 16,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: 'center',
        color: Colors.primary4,
      }}
      isShowUnderLine
      placeholder={'Nhập nickname'}
      autoFocus
      showIcon={false}
      onChangeText={this._onChangeText}
    />
  );

  _renderNextButton = () => (
    <CustomButton
      containerStyle={{ height: 54 }}
      buttonStyle={{ width: 246 }}
      title={'Tiếp tục'}
      buttonColor={BUTTON_COLOR.BLUE}
      sizeType={BUTTON_SIZE.LARGE}
      disabled={!this.state.canGoNextStep}
      onPress={this._onNextButtonPress}
    />
  );

  render() {
    const { myUser } = this.props;
    const { isLoading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <View style={{ flex: 1, alignItems: 'stretch' }}>
          {this._renderToolbar()}
          <View style={{ flex: 38 }} />
          <Text style={{ ...TextStyles.heading4, ...styles.text }}>
            {myUser && myUser.isLoggedIn
              ? 'Họ và tên cho tài khoản mới'
              : 'Sử dụng 1 nickname để gợi nhớ và giúp người khác kết nối với bạn trên MFast'}
          </Text>
          <View style={{ flex: 78 }} />
          {this._renderNameInput()}
          <Text style={styles.indicatorNote}>
            Nickname này cũng sẽ đại diện cho tên của bạn trên MFast. Nickname{' '}
            <Text style={styles.waring}>không được gồm khoảng trắng.</Text>
          </Text>
          <View style={{ flex: 36 }} />
          <AppPolicyCheckBox
            containerStyle={{ paddingLeft: 54, paddingRight: 54 }}
            onPolicyPress={this.onPolicyPress}
            onPrivacyPress={this.onPrivacyPress}
            onCheckBoxPress={this._onPolicyCheckBoxPress}
          />
          <View style={{ flex: 36 }} />
          {this._renderNextButton()}
          <View style={{ flex: 330 }} />
        </View>
        <LoadingModal visible={isLoading} />
      </SafeAreaView>
    );
  }
}

RegisterNameScreen.navigationOptions = () => ({
  header: null,
});

const styles = StyleSheet.create({
  text: {
    marginLeft: 30,
    marginRight: 30,
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
  waring: {
    color: Colors.accent3,
  },
});

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
  myUser: state.myUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterNameScreen);
