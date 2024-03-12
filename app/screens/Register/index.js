import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Alert,
  View,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

import {
  register,
  requestSendPassword,
  switchRootScreenToLogin,

  registerValidate,
} from 'app/redux/actions';

import Strings, { formatString } from 'app/constants/strings.js';
import { TestConfigs } from 'app/constants/configs.js';
import LoginBackground from 'app/common/LoginBackground';
import InputAccessory from 'app/common/InputAccessory';
import MessageBox from 'app/common/MessageBox';
import { hidePhoneNumber, showInfoAlert } from 'app/utils/UIUtils';

import UserPickerScreen from 'app/screens/Others/UserPickerScreen';

import KJTextButton from '../../common/KJTextButton';
import KJTextButtonLoading from '../../common/KJTextButtonLoading';
import RegisterControl from './RegisterControl';

import AppStyles from '../../constants/styles';

const _ = require('lodash');

/* eslint-disable */
import Utils, { isEmailValid } from 'app/utils/Utils';
const LOG_TAG = 'RegisterScreen.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');

// --------------------------------------------------
// RegisterScreen
// --------------------------------------------------

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    // setup state
    const defaultRegisterUserInfo = TestConfigs.isTestRegister ?
      TestConfigs.testRegisterUserInfo :
      {
        fullName: undefined,
        cmnd: undefined,
        phoneNumber: undefined,
        ownerReferral: undefined,
        userReferral: undefined,
        gender: 'none',
      };

    this.state = {
      pickerMode: 'user',
      isUserPickerVisible: false,
      selectedOwner: null,
      selectedUser: null,

      registerUserInfo: defaultRegisterUserInfo,
      registerSuccessTitle: '',
      registerSuccessDetails: '',

      errorName: undefined,
      errorPhone: undefined,
      errorCmnd: undefined,

      registerReferral: false,

      animationHeight: new Animated.Value(380),

      isMessageBoxVisible: false,
    };
    this.componentHeightAcc = 380;
    this.componentHeightRef = SCREEN_SIZE.height / 1.5;
    this.showingKeyboard = false;
    this.numOfFail = 0;
  }
  componentDidMount() {
    this.keyboardWillShowListener =
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener =
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    this.keyboardDidShowListener =
      Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener =
      Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

  }

  componentWillReceiveProps(nextProps) {
    this.handleRegisterValideProgress(nextProps);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentDidUpdate(prevProps) {
    this.handleRegisterResponse(prevProps);
    this.handleRegisterValidateResponse(prevProps);
    this.handleSendPasswordResponse(prevProps);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = (e) => { // eslint-disable-line
    this.componentHeightRef = Dimensions.get('window').height - e.endCoordinates.height - 68;
    this.adjustHeightOfRef(this.componentHeightRef, () => {
      if (!this.showingKeyboard) {
        this.scroll.props.scrollIntoView(this.referralView);
      }
      this.showingKeyboard = true;
    });
  }
  keyboardWillHide = () => {
    this.componentHeightRef = SCREEN_SIZE.height / 1.5;
    this.adjustHeightOfRef(this.componentHeightRef, () => {
      this.showingKeyboard = false;
    });
  }

  keyboardDidShow = (e) => { // eslint-disable-line
    if (Platform.OS === 'android') {
      this.componentHeightRef = Dimensions.get('window').height - e.endCoordinates.height - 68;
      this.adjustHeightOfRef(this.componentHeightRef, () => {
        if (!this.showingKeyboard) {
          this.scroll.props.scrollIntoView(this.referralView);
          this.showingKeyboard = true;
        }
      });
    }
  }
  keyboardDidHide = () => {
    if (Platform.OS === 'android') {
      this.componentHeightRef = SCREEN_SIZE.height / 1.5;
      this.adjustHeightOfRef(this.componentHeightRef, () => {
        this.showingKeyboard = false;
      });
    }
  }

  adjustHeightOfRef = (height, finishCallback) => {
    if (this.state.registerReferral) {
      Animated.timing(this.state.animationHeight, {
        toValue: height,
        duration: 350,
      }).start(() => {
        if (finishCallback) {
          finishCallback();
        }
      });
    }
    else if (finishCallback) {
      finishCallback();
    }
  }

  moveToRefStep = () => {
    this.setState({
      registerReferral: true,
    }, () => {
      this.state.animationHeight.setValue(this.componentHeightAcc);
      Animated.timing(this.state.animationHeight, {
        toValue: this.componentHeightRef,
        duration: 250,
      }).start(() => {
        if (this.showingKeyboard) {
          setTimeout(() => {
            this.scroll.props.scrollIntoView(this.referralView);
          }, 500);
        }
      });
    });
  }

  onChangeGender = (gender) => {
    this.setState({
      registerUserInfo: {
        ...this.state.registerUserInfo,
        gender,
      },
    });
  }

  onFullNameChangeText = (text) => {
    this.setState({
      errorName: undefined,
      registerUserInfo: {
        ...this.state.registerUserInfo,
        fullName: text,
      },
    });
    this.updateRegisterInfoLayoutWithErr();
  }
  onPhoneNumberChangeText = (text) => {
    this.setState({
      errorPhone: undefined,
      registerUserInfo: {
        ...this.state.registerUserInfo,
        phoneNumber: text,
      },
    });
    this.updateRegisterInfoLayoutWithErr();
  }
  onCmndChangeText = (text) => {
    this.setState({
      errorCmnd: undefined,
      registerUserInfo: {
        ...this.state.registerUserInfo,
        cmnd: text,
      },
    });
    this.updateRegisterInfoLayoutWithErr();
  }
  onEmailChangeText = (text) => {
    this.setState({
      registerUserInfo: {
        ...this.state.registerUserInfo,
        email: text,
      },
    });
  }
  onOwnerReferralPress = () => {
    this.showUserPicker('owner');
  }
  onUserReferralPress = () => {
    this.showUserPicker('user');
  }
  onNextToRefPress = () => {
    if (this.props.isRegisterValidateProcessing) {
      return;
    }
    if (!this.checkRegisterInputs()) {
      return;
    }

    const userInfo = JSON.parse(JSON.stringify(this.state.registerUserInfo));
    this.props.registerValidate(userInfo);
  }
  onRegisterWithSkipRefPress = () => {
    const userInfo = JSON.parse(JSON.stringify(this.state.registerUserInfo));
    if (userInfo.userReferral || userInfo.userReferral === null) {
      delete userInfo.userReferral;
    }
    // console.log(userInfo);
    this.props.register(userInfo);
  }
  onRegisterPress = () => {
    if (this.state.selectedUser && this.state.selectedUser !== null) {
      const userInfo = JSON.parse(JSON.stringify(this.state.registerUserInfo));
      if ((userInfo.userReferral && userInfo.userReferral.trim().length === 0) || userInfo.userReferral === null) {
        delete userInfo.userReferral;
      }
      // console.log(userInfo);
      this.props.register(userInfo);
    }
  }
  onLoginPress = () => {
    this.props.switchRootScreenToLogin();
  }
  onRegisterReSendPress = () => {
    const regInfo = this.state.registerUserInfo;
    const cmnd = regInfo.cmnd;
    if (cmnd && cmnd.length > 0) {
      this.props.requestSendPassword(cmnd);
    }
  }
  onRegisterContinuePress = () => {
    this.props.switchRootScreenToLogin();
  }
  onUserPickerPickUser = (user) => {
    let updateState = {};
    // pick owner
    // if (this.state.pickerMode === 'owner') {
    //   const registerUserInfo = {
    //     ...this.state.registerUserInfo,
    //     ownerReferral: user.subscriptionID,
    //   };
    //   updateState = {
    //     selectedOwner: user,
    //     registerUserInfo,
    //   };
    // }
    // pick user
    if (this.state.pickerMode === 'user') {
      const registerUserInfo = {
        ...this.state.registerUserInfo,
        userReferral: user.subscriptionID,
      };
      updateState = {
        selectedUser: user,
        registerUserInfo,
        selectedOwner: null,
      };
    }
    // update state & close picker
    this.setState({
      ...updateState,
    }, () => {
      // this.closeUserPicker();
    });
  }
  onUserPickerUnPickUser = () => {
    let updateState = {};
    // unpick owner
    // if (this.state.pickerMode === 'owner') {
    //   const registerUserInfo = {
    //     ...this.state.registerUserInfo,
    //     ownerReferral: null,
    //   };
    //   updateState = {
    //     selectedOwner: null,
    //     registerUserInfo,
    //   };
    // }
    // pick user
    if (this.state.pickerMode === 'user') {
      const registerUserInfo = {
        ...this.state.registerUserInfo,
        userReferral: null,
      };
      updateState = {
        selectedUser: null,
        registerUserInfo,
        selectedOwner: null,
      };
    }
    // update state & close picker
    this.setState({
      ...updateState,
    }, () => {
      this.closeUserPicker();
    });
  }
  onUserPickerCancel = () => {
    this.closeUserPicker();
  }
  // --------------------------------------------------
  handleRegisterValidateResponse(prevProps) {
    const status = this.props.registerValidateResponse.status;
    const prevStatus = prevProps.registerValidateResponse.status;
    if (status !== undefined && status !== prevStatus) {
      if (status) {
        this.moveToRefStep();
      } else {
        const message = this.props.registerValidateResponse.message;
        showInfoAlert(message);
      }
    }
  }
  handleRegisterValideProgress(nextProps) {
    const processing = this.props.isRegisterValidateProcessing;
    const nextProcessing = nextProps.isRegisterValidateProcessing;
    if (nextProcessing !== undefined && processing !== nextProcessing) {
      this.loadingButton.showLoading(nextProcessing);
    }
  }
  handleRegisterResponse(prevProps) {
    const status = this.props.registerResponse.status;
    const prevStatus = prevProps.registerResponse.status;
    if (status !== undefined && status !== prevStatus) {
      if (status) {
        // register success
        setTimeout(() => {
          this.showRegisterSuccessMessageBox();
        }, 250);
      } else {
        // register fail
        setTimeout(() => {
          const message = this.props.registerResponse.message;
          this.showAlert(Strings.alert_title, message);
        }, 250);
      }
    }
  }
  handleSendPasswordResponse(prevProps) {
    const status = this.props.sendPasswordResponse.status;
    const prevStatus = prevProps.sendPasswordResponse.status;
    if (status !== undefined && status !== prevStatus) {
      if (status) {
        // send success
        setTimeout(() => {
          this.showRegisterSuccessMessageBox();
        }, 250);
      } else {
        // send fail
        setTimeout(() => {
          const message = this.props.sendPasswordResponse.message || Strings.unknown_error;
          this.showAlert(Strings.alert_title, message);
        }, 250);
      }
    }
  }
  checkRegisterInputs() {
    const userInfo = this.state.registerUserInfo;
    let valid = true;
    if (userInfo.fullName === undefined || userInfo.fullName === '') {
      this.setState({
        errorName: Strings.missing_field_value,
      });
      valid = false;
    }
    if (userInfo.phoneNumber === undefined || userInfo.phoneNumber === '') {
      this.setState({
        errorPhone: Strings.missing_field_value,
      });
      valid = false;
    }
    if (userInfo.cmnd === undefined || userInfo.cmnd === '') {
      this.setState({
        errorCmnd: Strings.missing_field_value,
      });
      valid = false;
    }
    this.updateRegisterInfoLayoutWithErr();

    return valid;
  }

  updateRegisterInfoLayoutWithErr = () => {
    let numOfFail = 0;
    setTimeout(() => {
      if (this.state.errorCmnd !== undefined) {
        numOfFail += 1;
      }
      if (this.state.errorPhone !== undefined) {
        numOfFail += 1;
      }
      if (this.state.errorName !== undefined) {
        numOfFail += 1;
      }
      if (this.numOfFail !== numOfFail) { // eslint-disable-line
        this.numOfFail = numOfFail;
        Animated.timing(this.state.animationHeight, {
          toValue: this.componentHeightAcc + (15 * numOfFail),
          duration: 350,
        }).start();
      }
    });
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        { text: 'Đóng', onPress: () => { } },
      ],
      { cancelable: false },
    );
  }
  showRegisterSuccessMessageBox() {
    const regInfo = this.state.registerUserInfo;
    const hiddenPhoneNumber = hidePhoneNumber(regInfo.phoneNumber);
    const title = formatString(
      Strings.register_success_title,
      { phone_number: hiddenPhoneNumber },
    );
    const details = Strings.register_success_details;
    this.setState({
      isMessageBoxVisible: true,
      registerSuccessTitle: title,
      registerSuccessDetails: details,
    });
  }
  closeMessageBox() {
    this.setState({
      isMessageBoxVisible: false,
    });
  }
  showUserPicker(mode) {
    if (!mode) { return; }
    this.setState({
      pickerMode: mode,
    });
  }
  closeUserPicker() {
    this.setState({
    });
  }
  // --------------------------------------------------
  render() {
    const {
      registerUserInfo,
      selectedOwner,
      selectedUser,
      registerSuccessTitle,
      registerSuccessDetails,

      errorCmnd,
      errorName,
      errorPhone,

      registerReferral,
    } = this.state;

    const {
      isRegisterProcessing,
      isSendPasswordProcessing,
    } = this.props;

    const selected = selectedUser && selectedUser !== null;

    return (
      <View style={{ flex: 1, backgroundColor: '#f000' }}>
        <LoginBackground />

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          overScrollMode={'always'}
          keyboardShouldPersistTaps={'handled'}
          innerRef={ref => { this.scroll = ref; }}
          paddingBottom={64}
        >
          <View
            style={styles.container}
          >
            <View
              ref={ref => { this.referralView = ref; }}
              style={{
                flex: 0,
                height: 24,
                backgroundColor: '#0000',
              }}
            />
            <Animated.View
              style={[AppStyles.shadow, styles.registerControl, {
                height: this.state.animationHeight,
              }]}
            >
              <View
                style={[{
                  flex: 1,
                  position: registerReferral ? 'absolute' : 'relative',
                },
                registerReferral ? { top: -2000 } : {},
                ]}
              >
                <RegisterControl
                  userInfo={registerUserInfo}
                  selectedOwner={selectedOwner}
                  selectedUser={selectedUser}
                  onFullNameChangeText={this.onFullNameChangeText}
                  onPhoneNumberChangeText={this.onPhoneNumberChangeText}
                  onCmndChangeText={this.onCmndChangeText}
                  onEmailChangeText={this.onEmailChangeText}
                  onAddressChangeText={this.onAddressChangeText}
                  onOwnerReferralPress={this.onOwnerReferralPress}
                  onUserReferralPress={this.onUserReferralPress}
                  onRegisterPress={this.onNextToRefPress}
                  onLoginPress={this.onLoginPress}
                  onChangeGender={this.onChangeGender}

                  errorCmnd={errorCmnd}
                  errorName={errorName}
                  errorPhone={errorPhone}
                />
              </View>
              <Animatable.View
                style={[{
                  flex: 1,
                  position: registerReferral ? 'relative' : 'absolute',
                },
                registerReferral ? {} : { top: -2000 },
                ]}
                // onLayout={this.onLayoutRefUpdate}
                duration={1000}
                animation={(registerReferral ? 'fadeIn' : 'fadeOut')} // eslint-disable-line
                useNativeDriver
              >
                <UserPickerScreen
                  pickerMode={'user'}
                  selectedUser={selectedUser}
                  onPickUser={this.onUserPickerPickUser}
                  onUnPickUser={this.onUserPickerUnPickUser}
                  onCancel={this.onUserPickerCancel}
                  selectedRef={selectedUser}
                  registerReferral={registerReferral}
                  onRegisterPress={this.onRegisterPress}
                  onRegisterWithSkipRefPress={this.onRegisterWithSkipRefPress}
                  onLoginPress={this.onLoginPress}
                />
              </Animatable.View>
              <RegisterButton
                onPress={registerReferral ? this.onRegisterPress : this.onNextToRefPress}
                text={registerReferral ? 'Hoàn thành' : 'Tiếp tục'}
                disable={registerReferral ? !selected : false}
                refButton={refButton => {
                  this.loadingButton = refButton;
                }}
              />

              <LoginButton
                onPress={this.onLoginPress}
              />
            </Animated.View>
          </View>
        </KeyboardAwareScrollView>

        {Platform.OS !== 'ios' ? null : <InputAccessory />}

        <Modal
          isVisible={this.state.isMessageBoxVisible}
          useNativeDriver
          animationIn="zoomIn"
          animationOut="zoomOut"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RegisterSuccessMessageBox
              title={registerSuccessTitle}
              message={registerSuccessDetails}
              onResendPress={() => this.onRegisterReSendPress()}
              onContinuePress={() => this.onRegisterContinuePress()}
            />
            <View style={{ height: 44 }} />
          </View>
        </Modal>
        {/*
        <Modal
          isVisible={isUserPickerVisible}
          animationIn={'slideInRight'}
          animationOut={'slideOutLeft'}
        >
          <UserPickerScreen
            pickerMode={pickerMode}
            selectedUser={pickerMode === 'owner' ? selectedOwner : selectedUser}
            onPickUser={this.onUserPickerPickUser}
            onUnPickUser={this.onUserPickerUnPickUser}
            onCancel={this.onUserPickerCancel}
            selectedRef={selectedUser}
          />
        </Modal> */}

        <Spinner
          visible={isRegisterProcessing || isSendPasswordProcessing}
          textContent="Đang xử lý"
          textStyle={{ color: '#FFF' }}
          overlayColor="#00000080"
        />

      </View >
    );
  }
}

// --------------------------------------------------

const RegisterSuccessMessageBox = (props) => (
  <MessageBox
    title={props.title}
    message={props.message}
    leftButtonTitle={'Gửi lại'}
    leftButtonTitleStyle={{ color: '#8D8D8D' }}
    onLeftButtonPress={() => props.onResendPress()}
    rightButtonTitle={'Tiếp tục'}
    rightButtonTitleStyle={{ color: '#2A98E0' }}
    onRightButtonPress={() => props.onContinuePress()}
  />
);

// --------------------------------------------------
// react-redux
// --------------------------------------------------

RegisterScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isRegisterProcessing: state.isRegisterProcessing,
  registerResponse: state.registerResponse,
  isSendPasswordProcessing: state.isSendPasswordProcessing,
  sendPasswordResponse: state.sendPasswordResponse,

  isRegisterValidateProcessing: state.isRegisterValidateProcessing,
  registerValidateResponse: state.registerValidateResponse,
});

const mapDispatchToProps = (dispatch) => ({
  register: (userInfo) => dispatch(register(userInfo)),
  requestSendPassword: (cmnd) => dispatch(requestSendPassword(cmnd)),
  switchRootScreenToLogin: () => dispatch(switchRootScreenToLogin()),
  registerValidate: (userInfo) => dispatch(registerValidate(userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

const RegisterButton = (props) => (
  <View
    style={{
      alignSelf: 'center',
      marginTop: 24,
    }}
  >
    <KJTextButtonLoading
      buttonStyle={[AppStyles.button]}
      onPress={
        props.onPress
      }
      backgroundColor={props.disable ? '#bababa' : ''}

      refButton={props.refButton}
      title={props.text}
      titleFontSize={15}
      titleColor="#fff"
    />
  </View>
);

const LoginButton = (props) => (
  <View
    style={{
      alignSelf: 'center',
      marginTop: 4,
    }}
  >
    <KJTextButton
      buttonStyle={[AppStyles.button, {
        alignItems: 'flex-start',
        marginTop: 0,
        borderRadius: 0,
        borderColor: '#0000',
      }]}
      textStyle={[AppStyles.button_text, {
        marginLeft: 24,
        marginRight: 24,
        fontSize: 14,
        fontWeight: '400',
        color: '#0097DF',
      }]}
      underlayColor="#0000"
      text={'Đăng nhập'}
      onPress={() => {
        props.onPress();
      }}
      backgroundColor="#0000"
    />
  </View>
);

// --------------------------------------------------

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    paddingBottom: 4,
    top: 16,
    bottom: 16,
  },
  container: {
    flex: 1,
    marginBottom: 32,
    marginTop: 16,
    paddingTop: 0,
    justifyContent: 'center',
  },
  registerControl: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 300,
  },
});
