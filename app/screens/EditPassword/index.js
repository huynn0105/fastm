import { showInfoAlert } from 'app/utils/UIUtils';
import TextInputRow from 'common/inputs/TextInputRow';
import KJTouchableOpacity from 'common/KJTouchableOpacity';
import TextHeader from 'common/TextHeader';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import colors from '../../constants/colors';
import { Configs } from '../../constants/configs';
import Strings, { formatString } from '../../constants/strings';
import Styles from '../../constants/styles';
import {
  forceLogout,
  importantUpdateProfile,
  requestImportantUpdateProfile,
} from '../../redux/actions';

// --------------------------------------------------
// EditPasswordScreen
// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

const LOG_TAG = '7777: EditPasswordScreen.js';
/* eslint-enable */

class EditPasswordScreen extends Component {
  constructor(props) {
    super(props);

    const myOldPassword = this.props.myUser.password;

    this.state = {
      step: 0, // 0: cache info & request otp, 1: update password
      otpConfirmCode: '',
      oldPassword: '',
      oldPasswordConfirm: myOldPassword,
      newPassword: '',
      newPasswordConfirm: '',
    };
  }
  componentDidMount() {
    // setup navigation
    if (this.props.navigation) {
      this.props.navigation.setParams({
        onHeaderLeftButtonPress: this.onHeaderLeftButtonPress,
        onHeaderRightButtonPress: this.onHeaderRightButtonPress,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    if (this.state.step === 0) {
      this.handleRequestImportantUpdateProfileResponse(prevProps);
    } else if (this.state.step === 1) {
      this.handleImportantUpdateProfileResponse(prevProps);
    }
  }
  // --------------------------------------------------
  onHeaderRightButtonPress = () => {
    // 1. check inputs
    // if (!this.checkOldPasswordValid()) {
    //   return;
    // }
    // 2. check inputs
    if (!this.checkNewPasswordValid()) {
      return;
    }
    // 3. request otp
    this.props.requestImportantUpdateProfile();
  };
  onOldPasswordChangeText = (text) => {
    this.setState({
      oldPassword: text,
    });
  };
  onOldPasswordSubmitEditing = () => {
    if (this.newPasswordInput && this.newPasswordInput.textInput) {
      this.newPasswordInput.textInput.focus();
    }
  };
  onNewPasswordChangeText = (text) => {
    this.setState({
      newPassword: text,
    });
  };
  onNewPasswordSubmitEditing = () => {
    if (this.newPasswordConfirmInput && this.newPasswordConfirmInput.textInput) {
      this.newPasswordConfirmInput.textInput.focus();
    }
  };
  onNewPasswordConfirmChangeText = (text) => {
    this.setState({
      newPasswordConfirm: text,
    });
  };
  onNewPasswordConfirmSubmitEditing = () => {
    this.onHeaderRightButtonPress();
  };
  // --------------------------------------------------
  handleRequestImportantUpdateProfileResponse(prevProps) {
    const status = this.props.importantUpdateProfileResponse.status;
    const prevStatus = prevProps.importantUpdateProfileResponse.status;
    if (status === true && status !== prevStatus) {
      // success
      // const actionCode = this.props.importantUpdateProfileResponse.data.actionCode;
      this.setState(
        {
          step: 1,
          // otpConfirmCode: actionCode,
        },
        () => {
          setTimeout(() => {
            this.openOtpConfirm();
          }, 500);
        },
      );
    } else if (status === false && status !== prevStatus) {
      // error
      setTimeout(() => {
        const message = formatString(Strings.request_action_error, {
          action_name: 'gửi mã xác nhận',
        });
        this.showAlert(message);
      }, 500);
    }
  }
  handleImportantUpdateProfileResponse(prevProps) {
    const status = this.props.importantUpdateProfileResponse.status;
    const prevStatus = prevProps.importantUpdateProfileResponse.status;
    if (
      this.props.importantUpdateProfileResponse.shouldAlert &&
      this.props.importantUpdateProfileResponse.message
    ) {
      showInfoAlert(this.props.importantUpdateProfileResponse.message);
    } else if (status === true && status !== prevStatus) {
      // success
      setTimeout(() => {
        const message = formatString(Strings.request_action_success, {
          action_name: 'đổi mật khẩu',
        });
        this.showSuccessAlert(message);
      }, 500);
    } else if (status === false && status !== prevStatus) {
      // error
      setTimeout(() => {
        const message = formatString(Strings.request_action_error, { action_name: 'đổi mật khẩu' });
        this.showAlert(message);
      }, 500);
    }
  }
  openOtpConfirm() {
    this.props.navigation.navigate('OtpConfirm', {
      userPhoneNumber: this.props.myUser.phoneNumber,
      otpConfirmCode: '',

      onOtpSubmitCallback: (otpCode) => {
        const newPassword = this.state.newPassword.trim();
        const params = {
          password: newPassword,
        };
        this.props.importantUpdateProfile(otpCode, params);
      },

      onOtpResendCallback: () => {
        this.setState(
          {
            step: 0,
            otpConfirmCode: '',
          },
          () => {
            this.props.requestImportantUpdateProfile();
          },
        );
      },

      onOtpCancelCallback: () => {
        this.setState({
          step: 0,
          otpConfirmCode: '',
        });
      },
    });
  }
  // --------------------------------------------------
  checkOldPasswordValid() {
    const oldPassword = this.state.oldPassword ? this.state.oldPassword.trim() : '';
    if (oldPassword.length === 0) {
      this.showAlert(formatString(Strings.missing_field, { field_name: 'mật khẩu cũ' }));
      return false;
    }
    if (oldPassword !== this.state.oldPasswordConfirm) {
      this.showAlert(Strings.wrong_old_password);
      return false;
    }
    return true;
  }
  checkNewPasswordValid() {
    const newPassword = this.state.newPassword ? this.state.newPassword.trim() : '';
    const newPasswordConfirm = this.state.newPasswordConfirm
      ? this.state.newPasswordConfirm.trim()
      : '';
    if (newPassword.length === 0) {
      this.showAlert(formatString(Strings.missing_field, { field_name: 'mật khẩu mới' }));
      return false;
    }
    if (newPassword.length < Configs.minPasswordLength) {
      this.showAlert(Strings.password_too_short);
      return false;
    }
    if (newPassword !== newPasswordConfirm) {
      this.showAlert(Strings.wrong_new_password);
      return false;
    }
    return true;
  }
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  showSuccessAlert = (message) => {
    Alert.alert(
      Strings.alert_title,
      message,
      [
        {
          text: 'Đóng',
          onPress: () => {
            this.props.forceLogout();
            this.props.navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };
  // --------------------------------------------------
  renderOldPasswordInput() {
    return (
      <TextInputRow
        ref={(o) => {
          this.oldPasswordInput = o;
        }}
        textInputProps={{
          value: this.state.oldPassword,
          editable: true,
          secureTextEntry: true,
          onChangeText: this.onOldPasswordChangeText,
          onSubmitEditing: this.onOldPasswordSubmitEditing,
        }}
        title="Mật khẩu cũ"
        isSeparatorHidden={false}
        isRevealButtonHidden={false}
      />
    );
  }
  renderNewPasswordInput() {
    return (
      <TextInputRow
        ref={(o) => {
          this.newPasswordInput = o;
        }}
        textInputProps={{
          value: this.state.newPassword,
          editable: true,
          secureTextEntry: true,
          onChangeText: this.onNewPasswordChangeText,
          onSubmitEditing: this.onNewPasswordSubmitEditing,
        }}
        title="Mật khẩu mới"
        isSeperatorHidden={false}
      />
    );
  }
  renderNewPasswordConfirmInput() {
    return (
      <TextInputRow
        ref={(o) => {
          this.newPasswordConfirmInput = o;
        }}
        textInputProps={{
          value: this.state.newPasswordConfirm,
          editable: true,
          secureTextEntry: true,
          onChangeText: this.onNewPasswordConfirmChangeText,
          onSubmitEditing: this.onNewPasswordConfirmSubmitEditing,
        }}
        title="Xác nhận mật khẩu mới"
        isSeperatorHidden={false}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const isSpinnerVisible = this.props.isImportantUpdateProfileProcessing;
    const spinnerText = this.state.step === 0 ? 'Đang gửi OTP ...' : 'Đang xử lý ...';
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView overScrollMode={'always'} keyboardShouldPersistTaps={'handled'}>
          <TextHeader title={'Hãy cập nhật mật khẩu mới của bạn'} />

          <View style={styles.inputsContainer}>
            {/* {this.renderOldPasswordInput()} */}
            {this.renderNewPasswordInput()}
            {this.renderNewPasswordConfirmInput()}
          </View>
          <View style={{ width: SCREEN_SIZE.width - 32, flexDirection: 'row', padding: 16 }}>
            <Text style={{ color: '#888', fontWeight: '600' }}>{'Lưu ý: '}</Text>
            <Text style={{ color: '#888' }}>
              {'Mật khẩu phải từ 7 kí tự và có ít nhất 1 chữ cái'}
            </Text>
          </View>
        </KeyboardAwareScrollView>

        <Spinner
          visible={isSpinnerVisible}
          textContent={spinnerText}
          textStyle={{ marginTop: 4, color: '#FFF' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

EditPasswordScreen.navigationOptions = ({ navigation }) => ({
  title: 'Đổi mật khẩu',
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  headerRight: <HeaderRightButton navigation={navigation} />,
});

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <KJTouchableOpacity
      style={styles.headerRightButton}
      onPress={() => {
        if (params && params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    >
      <Text style={styles.headerRightButtonText}>{'Tiếp tục'}</Text>
    </KJTouchableOpacity>
  );
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

EditPasswordScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isImportantUpdateProfileProcessing: state.isImportantUpdateProfileProcessing,
  importantUpdateProfileResponse: state.importantUpdateProfileResponse,
});

const mapDispatchToProps = (dispatch) => ({
  requestImportantUpdateProfile: () => dispatch(requestImportantUpdateProfile()),
  importantUpdateProfile: (actionCode, userInfo) =>
    dispatch(importantUpdateProfile(actionCode, userInfo)),
  forceLogout: () => dispatch(forceLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPasswordScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  scrollView: {
    flex: 1,
  },
  inputsContainer: {
    marginTop: 4,
    paddingTop: 0,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.navigation_bg,
  },
  headerRightButton: {
    width: 64,
    height: 44,
    paddingLeft: 0,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '400',
  },
});
