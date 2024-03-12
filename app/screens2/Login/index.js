/* eslint-disable react-native/no-inline-styles */
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Easing,
  Dimensions,
  Keyboard,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView as SafeAreaViewNavigation } from 'react-navigation';
import { createAnimatableComponent } from 'react-native-animatable';

import CustomTextInput from '../../components2/CustomTextInput/index';
import CustomButton, { BUTTON_COLOR, BUTTON_SIZE } from '../../components2/CustomButton';
import ImageButton from '../../components2/ImageButton/index';
import IntroSwiper from './IntroSwiper';

import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { METHOD } from '../../utils/FacebookWrapper';
import { loginExternal, chooseUser } from '../../redux/actions/user';
import { Loading } from '../../components2/LoadingComponent';
import { fetchAppInfo } from '../../redux/actions/general';
import BottomActionSheet from '../../components2/BottomActionSheet';
import LoginUserList from '../../components2/LoginUserList';
import { logEvent } from '../../tracking/Firebase';
import PopupBeforeLogin from './PopupBeforeLogin';
import DigitelClient from '../../network/DigitelClient';

// Animation Duration
const DURATION_SHORT = 500;

// Dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const PADDING_TOP = 36.0;
const PHONE_INPUT_SECTION = 111.0;
const PADDING_BETWEEN = 50.0;
const LOGIN_BUTTONS_SECTION = 210.0;
const PADDING_BOTTOM = 25.0;

// Animations
const AnimatableSwiper = createAnimatableComponent(IntroSwiper);
const AnimatableTouchable = createAnimatableComponent(TouchableOpacity);
const easingOutPoly = Easing.out(Easing.poly(4));
const easingDefault = Easing.ease;

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    const params = this.props?.navigation?.state?.params;
    this.isShowSkipLogin = params?.isShowSkipLogin;
    this.state = {
      toolbarX: new Animated.Value(screenWidth),
      phoneInputY: new Animated.Value(0),
      nextButtonY: new Animated.Value(0),
      nextButtonOpacity: new Animated.Value(0),
      disabledNextButton: true,
      statusBarColor: 'white',
      showNextStepPhoneInput: false,
      isShownPhoneInputError: false,
      isShowPopup: false,
      urlContent: null
    };
    this.phoneNumber = '';
    this.didDismiss = false;
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.myUser.isLoggedIn && !this.didDismiss) {
      this.didDismiss = true;
      this.props.navigation.dismiss();
    }
  }

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (props.myUsers.length > 0 && prevProps.myUsers.length === 0) {
      this.handleLoggedInUsers(props.myUsers);
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.fetchAppInfo();
  }

  // --------------------------------------
  // ON-PRESS METHODS
  // --------------------------------------

  onUserRowPress = (user) => {
    this.props.chooseUser(user);
  };

  _onToolbarBackPress = () => {
    if (this._phoneTextInput) {
      this._phoneTextInput._onBlur();
    }
    this._animateBackToLogin();
    this.setState({
      statusBarColor: 'white',
      showNextStepPhoneInput: false,
    });
  };

  _onPhoneInputTitlePress = () => {
    this._animateToPhoneInput();
  };

  _onLoginByFacebookPress = () => {
    this.props.loginExternal(METHOD.FACEBOOK);
  };

  _onLoginByCMNDPress = () => {
    this.props.navigation.navigate('LoginCitizenId');
  };

  _onPolicyLinkPress = () => {
    // TODO: Implement read policy
  };

  _onPhoneInputFocus = () => {
    const { showNextStepPhoneInput } = this.state;
    if (!showNextStepPhoneInput) {
      this._animateToPhoneInput();
      this.setState({
        statusBarColor: Colors.neutral6,
        showNextStepPhoneInput: true,
      });
    }
  };

  _onPhoneInputChangeText = (text) => {
    this.phoneNumber = text;
    this.validatePhoneInput(this.phoneNumber);
  };

  _onNextPhoneInputBtnPress = () => {
    logEvent('press_next_login_phone');
    this.props.loginExternal(METHOD.PHONE, this.phoneNumber);
  };

  _onCloseModalPress = () => {
    this.props.navigation.dismiss();
  };

  onPolicyPress = () => {
    const { appInfo } = this.props;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Điều khoản sử dụng',
      url: appInfo?.termsOfUsageUrl,
    });
  };

  onPrivacyPress = () => {
    const { appInfo } = this.props;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Chính sách bảo mật',
      url: appInfo?.privacyPolicyUrl,
    });
  };

  /*  LISTENER
   */

  _keyboardDidShow = (e) => {
    const keyboardHeight = Platform.OS === 'ios' ? e.endCoordinates.height : 0;
    this._animateShowNextButton(keyboardHeight);
  };

  _keyboardDidHide() {}

  // --------------------------------------
  // ANIMATION METHODS

  _createAnimation = (animatedValue, toValue, duration, easing) => {
    Animated.timing(animatedValue, {
      toValue,
      duration,
      easing,
      useNativeDriver: true,
    }).start();
  };

  _animateShowNextButton = (toValue) => {
    this._createAnimation(this.state.nextButtonY, -toValue - 25, 200, easingOutPoly);
    setTimeout(() => {
      this._createAnimation(this.state.nextButtonOpacity, 1, 250, easingDefault);
    }, 75);
  };

  _animateBackToLogin = () => {
    this._createAnimation(this.state.phoneInputY, 0, DURATION_SHORT, easingOutPoly);
    this._createAnimation(this.state.toolbarX, screenWidth, DURATION_SHORT, easingOutPoly);
    // Delay a short period of time for the keyboard to hide completely
    setTimeout(() => {
      // this._loginButtonsContainer.animate('fadeInUp', DURATION_SHORT);
      this._introSwiper.animate('fadeInDown', DURATION_SHORT);
      this._closeModalBtn.animate('fadeInDown', DURATION_SHORT);
    }, 300);
  };

  _animateToPhoneInput = () => {
    this._introSwiper.animate('fadeOutUp', DURATION_SHORT);
    this._closeModalBtn.animate('fadeOutUp', DURATION_SHORT);
    // Delay a short period of time for other views completely hide
    setTimeout(() => {
      // Animate PhoneInput
      this._createAnimation(
        this.state.phoneInputY,
        Platform.OS === 'ios' ? -screenHeight * 0.34 : -screenHeight * 0.15,
        DURATION_SHORT,
        easingOutPoly,
      );
      // Animate Toolbar
      this._createAnimation(this.state.toolbarX, 0, DURATION_SHORT, easingOutPoly);
    }, 250);
  };

  _onAsyncValidPopup = async () => {
    const payload = await DigitelClient.getPopupTermWhenUserLogin(this.phoneNumber);
    const isShow = !!payload?.is_show;
    if(isShow) {
      Keyboard.dismiss();
    } else {
      this._onNextPhoneInputBtnPress();
    }
    this.setState({
      isShowPopup: isShow,
      urlContent: payload?.html_content
    })
  }

  onPressClosePopup = () => {
    this.setState({
      isShowPopup: false
    })
  }

  onHandlerSubmitTerm = () => {
    this.onPressClosePopup();
    DigitelClient.submitConfirmTermWhenUserLogin(this.phoneNumber);
    setTimeout(() => {
      this._onNextPhoneInputBtnPress();
    }, 200);
  }

  /*  PRIVATE
   */

  isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length > 9 && phoneNumber.length < 12;
  };

  validatePhoneInput = (phoneNumber) => {
    const isValidPhoneNumber = this.isValidPhoneNumber(phoneNumber);
    const phoneNumberLength = phoneNumber.length;
    this.setState({
      disabledNextButton: !isValidPhoneNumber,
      isShownPhoneInputError: !isValidPhoneNumber && phoneNumberLength >= 12,
    });
  };

  handleLoggedInUsers = (users) => {
    users.length === 1 ? this.onUserRowPress(users[0]) : this.userListSheetRef.open();
  };

  // --------------------------------------------------
  // Reference Components methods
  // --------------------------------------------------

  _referencePhoneInputContainer = (ref) => {
    this._phoneInputContainer = ref;
  };

  _referencePhoneTextInput = (ref) => {
    this._phoneTextInput = ref;
  };

  _referenceLoginButtonsContainer = (ref) => {
    this._loginButtonsContainer = ref;
  };

  _referenceIntroSwiper = (ref) => {
    this._introSwiper = ref;
  };

  _referenceToolbar = (ref) => {
    this._toolbar = ref;
  };

  _referenceCloseModalButton = (ref) => {
    this._closeModalBtn = ref;
  };

  // --------------------------------------------------
  // RENDER METHODS
  // --------------------------------------------------

  _renderIntroSwiper = () => (
    <AnimatableSwiper ref={this._referenceIntroSwiper} style={{ flex: 425 }} useNativeDriver />
  );

  _renderPhoneInputSection = () => {
    const { isShownPhoneInputError, phoneInputY } = this.state;
    return (
      <Animated.View
        ref={this._referencePhoneInputContainer}
        style={{
          ...styles.phoneInputSection,
          // flex: PHONE_INPUT_SECTION,
          transform: [{ translateY: phoneInputY }],
        }}
      >
        <View style={{ paddingHorizontal: 50, marginVertical: 16 }}>
          <Text style={[TextStyles.heading3, styles.text]}>
            {'Nhập số điện thoại để đăng nhập'}
          </Text>
        </View>
        <CustomTextInput
          textInputRef={this._referencePhoneTextInput}
          containerStyle={{
            marginHorizontal: 16,
            backgroundColor: '#fff',
            borderRadius: 27,
            paddingHorizontal: 16,
            borderColor: Colors.primary2,
            borderWidth: 1,
          }}
          autoFocus
          inputStyle={{
            textAlign: 'center',
            fontSize: 16,
            height: '100%',
            marginBottom: Platform.OS === 'ios' ? 6 : 0,
          }}
          placeholder={'Nhập số điện thoại'}
          keyboardType={'phone-pad'}
          isShownLeftIcon
          isShownTitle
          isShownError={isShownPhoneInputError}
          errorMessage={'Độ dài số điện thoại khồng đúng'}
          onFocusListener={this._onPhoneInputFocus}
          onChangeText={this._onPhoneInputChangeText}
          maxLength={10}
        />
        <Text style={styles.indicatorBottomTxt}>
            {'1 mã xác thực sẽ được gửi về SĐT trên, sau khi  bạn bấm đăng nhập'}
        </Text>
      </Animated.View>
    );
  };

  _renderPaddingView = (flex) => <View style={{ flex }} />;

  _renderLoginContainer = () => {
    const { showNextStepPhoneInput } = this.state;
    return (
      <View style={{ ...styles.container, flex: 800 }}>
        {this._renderPaddingView(PADDING_TOP)}
        {this._renderPhoneInputSection()}
        {showNextStepPhoneInput ? this._renderNextButton() : null}
        {this._renderPaddingView(PADDING_BETWEEN)}
        {this._renderPaddingView(PADDING_BOTTOM)}
      </View>
    );
  };

  _renderLoginButtonSection = () => (
    <View>
      <View style={{ flex: 30 }} />
      <View style={{ ...styles.policy, height: 36 }}>
        <Text style={[TextStyles.normalTitle, { lineHeight: 18 }]}>
          {'Bằng việc đăng nhập vào MFast, bạn đã đồng ý với'}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[TextStyles.normalTitle, { textDecorationLine: 'underline', color: Colors.primary2 }]}
            onPress={this.onPolicyPress}
          >
            {'điều khoản sử dụng '}
          </Text>
          <Text>{'và '}</Text>
          <Text
            style={[TextStyles.normalTitle, { textDecorationLine: 'underline', color: Colors.primary2 }]}
            onPress={this.onPrivacyPress}
          >
            {'chính sách bảo mật '}
          </Text>
        </View>
      </View>
    </View>
  );

  _renderToolbar = () => {
    const { toolbarX } = this.state;
    return (
      <Animated.View
        ref={this._referenceToolbar}
        style={{
          ...styles.toolbar,
          transform: [{ translateX: toolbarX }],
        }}
      >
        <ImageButton
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            left: 8,
            zIndex: 1,
          }}
          imageSource={require('../../components2/LoginToolbar/img/icon_back_btn.png')}
          onPress={this._onCloseModalPress}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            style={{ alignSelf: 'center' }}
            source={require('../../components2/LoginToolbar/img/mfast_logo.png')}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    );
  };

  _renderNextButton = () => {
    const { nextButtonY, nextButtonOpacity, disabledNextButton } = this.state;
    return (
      <Animated.View
        style={{
          ...styles.nextButton,
          transform: [{ translateY: nextButtonY }],
        }}
      >
        <CustomButton
          containerStyle={{
            opacity: nextButtonOpacity,
          }}
          buttonStyle={{ width: screenWidth - 32 }}
          disabled={disabledNextButton}
          title={'Đăng nhập'}
          buttonColor={BUTTON_COLOR.GREEN}
          sizeType={BUTTON_SIZE.LARGE}
          onPress={this._onAsyncValidPopup}
        />
        <View style={styles.nextButtonMessageContainer}>
          <View style={{ flex: 2 }} />
        </View>
        {this.isShowSkipLogin && (<View>
            <Text style={styles.txtAfterRegister} onPress={this._onCloseModalPress}>
              Trải nghiệm trước, đăng nhập sau
            </Text>
            <View style={{ height: 16 }} />
          </View>
        )}
        {this._renderLoginButtonSection()}
      </Animated.View>
    );
  };

  _renderCloseModalButton = () => (
    <AnimatableTouchable
      ref={this._referenceCloseModalButton}
      style={styles.modalCloseButton}
      useNativeDriver
      onPress={this._onCloseModalPress}
    >
      <Image resizeMode={'contain'} source={require('./img/icon_close.png')} />
    </AnimatableTouchable>
  );

  renderUserListSheet = (myUsers = []) => {
    if (myUsers.length === 0) {
      return null;
    }
    return (
      <BottomActionSheet
        ref={(ref) => {
          this.userListSheetRef = ref;
        }}
        render={() => <LoginUserList users={myUsers} onUserRowPress={this.onUserRowPress} />}
        canClose={false}
      />
    );
  };

  onReadMoreTermPress = () => {
    const { appInfo } = this.props;
    if(appInfo) {
      this.props.navigation.navigate('WebView', {
        mode: 0,
        title: 'Điều khoản sử dụng',
        url: appInfo.termsOfUsageUrl,
      });
    }   
  };


  onReadMorePolicyPress = () => {
    const { appInfo } = this.props;
    if(appInfo) {
      this.props.navigation.navigate('WebView', {
        mode: 0,
        title: 'Chính sách bảo mật',
        url: appInfo.privacyPolicyUrl,
      });
    }
  };


  render() {
    const { isLoginProcessing, myUsers } = this.props;
    const { statusBarColor, isShowPopup, urlContent } = this.state;
    return (
      <Fragment>
        <SafeAreaViewNavigation
          style={{ flex: 0, backgroundColor: Colors.neutral5, paddingTop: 8 }}
        />
        <SafeAreaViewNavigation style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
          {this._renderIntroSwiper()}
          {/* absolute button */}
          {this._renderCloseModalButton()}
          {/* absolute toolbar */}
          {this._renderToolbar()}
          {this._renderLoginContainer()}
          {this.renderUserListSheet(myUsers)}
        </SafeAreaViewNavigation>
        <Loading visible={isLoginProcessing} />
        {isShowPopup &&
          <PopupBeforeLogin
            urlContent={urlContent}
            onPressClose={this.onPressClosePopup}
            onHandlerSubmit={this.onHandlerSubmitTerm}
            onReadMoreTermPress={this.onReadMoreTermPress}
            onReadMorePolicyPress={this.onReadMorePolicyPress}
          />
        }
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoginProcessing: state.isLoginProcessing,
  myUser: state.myUser,
  myUsers: state.myUsers,
  appInfo: state.appInfo,
});

const mapDispatchToProps = {
  loginExternal,
  fetchAppInfo,
  chooseUser,
};

LoginScreen.navigationOptions = () => ({
  header: null,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
  },
  phoneInputSection: {
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'stretch',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  phoneInput: {
    marginLeft: 16,
    marginRight: 16,
  },
  loginButtonSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  facebookButton: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  cmndButton: {
    color: Colors.primary2,
  },
  policy: {
    alignItems: 'center',
  },
  toolbar: {
    width: '100%',
    padding: 16,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  nextButtonMessageContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  indicatorBottomTxt: {
    opacity: 0.7,
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: Colors.primary4,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  txtAfterRegister: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: Colors.primary2,

  }
});
