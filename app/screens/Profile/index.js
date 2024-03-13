import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Alert,
  View,
  Animated,
  ActivityIndicator,
  Platform
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { NavigationActions } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageResizer from 'react-native-image-resizer';

import ImageButton from 'common/buttons/ImageButton';
import NavigationBar from 'common/NavigationBar';
import TextButton from 'common/buttons/TextButton';
import TextHeader from 'common/TextHeader';

import { logout, updateProfile, requestUserBankList } from 'app/redux/actions';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import { showAlertForRequestPermission } from 'app/utils/UIUtils';
import ImageUtils from 'app/utils/ImageUtils';
import KJImage from 'app/components/common/KJImage';

import UserHeaderContainer from './UserHeaderContainer';
import UserPersonalInfoContainer from './UserPersonalInfoContainer';
import UserBankInfoContainer from './UserBankInfoContainer';
import TextRow from './TextRow';

import FirebaseStorage from '../../submodules/firebase/FirebaseStorage';

// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');
const TOP_SPACING = 72;
const BACKGROUND_IMAGE_WIDTH = SCREEN_SIZE.width * 1.2;
const BACKGROUND_IMAGE_HEIGHT = TOP_SPACING + 150;

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'ProfileScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ProfileScreen
// --------------------------------------------------

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.previousPosition = 0;

    this.state = {
      isImageProcessing: false,
      navigationBarBackgroundOpacity: 0.0,
      navigationBarTitleOpacity: 0,

      scrollY: new Animated.Value(0)
    };
  }
  componentDidMount() {
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    this.handleLogoutResponse(prevProps);
    this.handleUpdateProfileResponse(prevProps);
  }
  // --------------------------------------------------
  onAvatarPress = () => {
    this.pickImage('avatar')
      .then((response) => {
        // user cancel
        if (response === null) {
          return;
        }
        // resize image & upload
        this.setState({ isImageProcessing: true });
        this.resizeImage(response.uri, 256, 256)
          .then((imageURI) => {
            this.uploadImage(imageURI, 'avatar');
          })
          .catch(() => {
            this.setState({ isImageProcessing: false });
          });
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} pickImage error: `, error);
        this.setState({ isImageProcessing: false });
      });
  };
  onWallPress = () => {
    this.pickImage('wall')
      .then((response) => {
        // user cancel
        if (response === null) {
          return;
        }
        // resize image & upload
        this.setState({ isImageProcessing: true });
        this.resizeImage(response.uri, 1024, 1024)
          .then((imageURI) => {
            this.uploadImage(imageURI, 'wall');
          })
          .catch(() => {
            this.setState({ isImageProcessing: false });
          });
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} pickImage error: `, error);
        this.setState({ isImageProcessing: false });
      });
  };
  onBackPress = () => {
    const backAction = NavigationActions.back();
    this.props.navigation.dispatch(backAction);
  };
  onEditProfilePress = () => {
    this.props.navigation.navigate('EditProfile');
  };
  onEditBankAccountPress = () => {
    this.props.navigation.navigate('EditBankAccount');
  };
  onChangePasswordPress = () => {
    this.props.navigation.navigate('EditPassword');
  };
  onHistoryPress = () => {
    this.props.navigation.navigate('MoneyHistory');
  };
  onLogoutPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            this.logout(false);
          }
        },
        {
          text: 'Đóng',
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };
  onLogoutOfAllDevicesPress = () => {
    Alert.alert(
      Strings.alert_title,
      Strings.logout_of_all_devices_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            this.logout(true);
          }
        },
        {
          text: 'Đóng',
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };
  onBankPress = (url) => {
    const title = 'TÀI KHOẢN NH LIÊN KẾT';
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title,
      url,
      callbackBackEvent: this.needReloadBankList
    });
  };
  onAddBankPress = (url) => {
    const title = 'TÀI KHOẢN NH LIÊN KẾT';
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title,
      url,
      callbackBackEvent: this.needReloadBankList
    });
  };
  needReloadBankList = () => {
    this.props.requestUserBankList();
  };
  // --------------------------------------------------
  isHandleScrollProcessing = false;
  handleScroll({ contentOffset }) {
    // hide navigation bar
    if (contentOffset.y < 164) {
      if (
        this.state.navigationBarBackgroundOpacity !== 0.2 ||
        this.state.navigationBarTitleOpacity !== 0.0
      ) {
        this.setState(
          {
            navigationBarBackgroundOpacity: 0.2,
            navigationBarTitleOpacity: 0.0
          },
          () => {
            this.isHandleScrollProcessing = false;
          }
        );
      } else {
        this.isHandleScrollProcessing = false;
      }
      return;
    }
    // show navigation bar
    if (
      this.state.navigationBarBackgroundOpacity !== 1.0 ||
      this.state.navigationBarTitleOpacity !== 1.0
    ) {
      this.setState(
        {
          navigationBarBackgroundOpacity: 1.0,
          navigationBarTitleOpacity: 1.0
        },
        () => {
          this.isHandleScrollProcessing = false;
        }
      );
    } else {
      this.isHandleScrollProcessing = false;
    }
  }
  handleScrollWithoutBlock(event) {
    const nativeEvent = event.nativeEvent;

    if (!this.isHandleScrollProcessing) {
      this.isHandleScrollProcessing = true;
      setTimeout(() => {
        this.handleScroll(nativeEvent);
      }, 10);
    }
  }
  pickImage(type) {
    const title = type === 'avatar' ? 'Cập nhật hình đại điện' : 'Cập nhật hình nền';
    return new Promise((resolve, reject) => {
      ImageUtils.pickImage(null, title)
        .then((response) => {
          if (response) {
            resolve(response);
          } else if (response === false) {
            showAlertForRequestPermission(
              Platform.OS === 'ios'
                ? Strings.camera_access_error
                : Strings.camera_access_error_android
            );
            reject();
          }
        })
        .catch((err) => {
          Utils.warn(`${LOG_TAG}.pickImage: `, err);
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? Strings.camera_access_error
              : Strings.camera_access_error_android
          );
          reject();
        });
    });
  }
  resizeImage(fileURI, width = 512, height = 512) {
    return ImageResizer.createResizedImage(fileURI, width, height, 'JPEG', 80)
      .then((response) => {
        // eslint-disable-line
        // Utils.log(`${LOG_TAG} resizeImage: `, response);
        return response.uri;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} resizeImage error: `, error);
        return Promise.reject(error);
      });
  }
  uploadImage(fileURI, type = 'avatar') {
    const userID = this.props.myUser.uid;
    let uploadTask = null;
    // create upload task
    if (type === 'avatar') {
      uploadTask = FirebaseStorage.uploadProfileAvatar(userID, fileURI);
    } else {
      uploadTask = FirebaseStorage.uploadProfileWall(userID, fileURI);
    }
    // upload
    if (!uploadTask) {
      return;
    }
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // eslint-disable-line
        // progress
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Utils.log(`${LOG_TAG} uploadImage progress: ${progress} %`);
      },
      (error) => {
        // error
        Utils.warn(`${LOG_TAG} uploadImage: error: `, error);
        this.setState({ isImageProcessing: false });
        setTimeout(() => {
          this.showAlert(Strings.upload_image_error);
        }, 250);
      },
    async (snapshot) => {
        // success
        // Utils.log(`${LOG_TAG} uploadImage: `, snapshot);
        const downloadURL = FirebaseStorage.getDownloadURL(snapshot.name);
        this.updateUserImage(downloadURL, type);
        setTimeout(() => {
          this.setState({ isImageProcessing: false });
        }, 250);
      }
    );
  }
  updateUserImage(imageURL, type) {
    if (type === 'avatar') {
      this.props.updateProfile({
        avatarImage: imageURL
      });
    }
    if (type === 'wall') {
      this.props.updateProfile({
        wallImage: imageURL
      });
    }
  }
  logout(isLogOutOfAllDevices = false) {
    const asyncTask = async () => {
      try {
        // tracking -> disabled because taking too long, should disable check token on tracking api
        // await DigitelClient.trackEvent(TrackingEvents.USER_LOGOUT);
        // logout
        this.props.logout(isLogOutOfAllDevices);
      } catch (err) {
        Utils.warn(`${LOG_TAG}: logout: err: ${err}`, err);
      }
    };
    asyncTask();
  }
  handleUpdateProfileResponse(prevProps) {
    const status = this.props.updateProfileResponse.status;
    const prevStatus = prevProps.updateProfileResponse.status;
    if (status === false && status !== prevStatus) {
      setTimeout(() => {
        const message = this.props.updateProfileResponse.message;
        this.showAlert(message);
      }, 250);
    }
  }
  handleLogoutResponse(prevProps) {
    const status = this.props.logoutResponse.status;
    const prevStatus = prevProps.logoutResponse.status;
    if (status === false && status !== prevStatus) {
      setTimeout(() => {
        this.showAlert(Strings.logout_error);
      }, 250);
    }
  }
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  // --------------------------------------------------
  renderUserInfoSection() {
    const { myUser } = this.props;
    return (
      <View style={{ backgroundColor: colors.navigation_bg }}>
        <View>
          <TextHeader title={'THÔNG TIN CÁ NHÂN'} />
          <ImageButton
            style={styles.headerAccessoryButton}
            imageSource={require('./img/edit.png')}
            onPressIn={this.onEditProfilePress}
          />
        </View>
        <UserPersonalInfoContainer style={styles.personalInfoContainer} user={myUser} />
      </View>
    );
  }
  renderBankAccountSection() {
    const { myUser, isGettingBankList } = this.props;
    return (
      <View style={{ backgroundColor: colors.navigation_bg }}>
        <View>
          <TextHeader title={'TÀI KHOẢN NGÂN HÀNG LIÊN KẾT'} />
          {/* <ImageButton
            style={styles.headerAccessoryButton}
            imageSource={require('./img/edit.png')}
            onPress={this.onEditBankAccountPress}
          /> */}
          {isGettingBankList && (
            <ActivityIndicator
              style={styles.headerAccessoryButton}
              animating
              color="#404040"
              size="small"
            />
          )}
        </View>
        <UserBankInfoContainer
          style={styles.bankInfoContainer}
          user={myUser}
          onAddBankPress={this.onAddBankPress}
          onBankPress={this.onBankPress}
        />
      </View>
    );
  }
  renderSettingsSection() {
    return (
      <View style={{ backgroundColor: colors.navigation_bg }}>
        <TextHeader title={'QUẢN LÝ TÀI KHOẢN'} />
        <TextRow
          containerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          title={'Đổi mật khẩu'}
          details={''}
          isArrowHidden={false}
          isSeparatorHidden
          onAccessoryPress={this.onChangePasswordPress}
        />
      </View>
    );
  }
  // --------------------------------------------------
  render() {
    const { myUser } = this.props;

    const isSpinnerVisible =
      this.state.isImageProcessing ||
      this.props.isUpdateProfileProcessing ||
      this.props.isImportantUpdateProfileProcessing ||
      this.props.isLogoutProcessing;

    let spinnerText = '';
    if (this.props.isImportantUpdateProfileProcessing) {
      spinnerText = 'Đang gửi mã OTP\n     Vui lòng chờ ...';
    } else if (this.state.isImageProcessing || this.props.isUpdateProfileProcessing) {
      spinnerText = 'Đang cập nhật ảnh\n     Vui lòng chờ ...';
    }

    const scaleBG = this.state.scrollY.interpolate({
      inputRange: [-200, -100, 0, 1],
      outputRange: [1.5, 1.25, 1, 1]
    });
    const translateYBG = this.state.scrollY.interpolate({
      inputRange: [-100, -50, 0, 100, 200],
      outputRange: [50, 25, 0, -50, -50]
    });

    return (
      <View style={styles.container} testID="test_profile_screen">
        <NavigationBar
          backgroundOpacity={this.state.navigationBarBackgroundOpacity}
          titleOpacity={this.state.navigationBarTitleOpacity}
          title={myUser.fullName ? myUser.fullName.toUpperCase() : ''}
          leftButton={<BackButton onPress={this.onBackPress} />}
        />

        <Animated.View
          style={[
            styles.backgroundImage,
            {
              transform: [
                {
                  scaleX: scaleBG
                },
                {
                  scaleY: scaleBG
                },
                {
                  translateY: translateYBG
                }
              ]
            }
          ]}
        >
          <KJImage
            style={styles.backgroundImage}
            source={myUser.wallImageURI()}
            defaultSource={myUser.wallImagePlaceholder()}
            resizeMode={'cover'}
            renderToHardwareTextureAndroid
            shouldRasterizeIOS
          />
        </Animated.View>
        <Animated.ScrollView
          testID="test_ScrollView_Profile"
          style={{ flex: 1, marginTop: -64, backgroundColor: '#fff0' }}
          scrollEventThrottle={20}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            {
              useNativeDriver: true,
              listener: (event) => {
                this.handleScrollWithoutBlock(event);
              }
            }
          )}
        >
          <UserHeaderContainer
            ref={(item) => {
              this.userheader = item;
            }}
            containerStyle={styles.headerContainer}
            user={myUser}
            onAvatarPress={this.onAvatarPress}
            onWallPress={this.onWallPress}
          />

          {this.renderUserInfoSection()}

          {this.renderBankAccountSection()}

          {/* // move to setting screen */}
          {/* {this.renderSettingsSection()} */}

          <View style={{ height: 20, backgroundColor: colors.separator }} />

          <LogoutButton onPress={this.onLogoutPress} />

          <View style={{ height: 20, backgroundColor: colors.separator }} />

          <LogoutOfAllDevicesButton onPress={this.onLogoutOfAllDevicesPress} />

          <View style={{ height: 36, backgroundColor: colors.separator }} />
        </Animated.ScrollView>

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

ProfileScreen.navigationOptions = () => ({
  title: 'Profile',
  header: null,
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#fff0'
});

// --------------------------------------------------

const BackButton = (props) => (
  <ImageButton
    testID="header-back"
    style={styles.backButton}
    imageSource={require('./img/arrow_left.png')}
    onPressIn={props.onPress}
  />
);

const LogoutButton = (props) => (
  <TextButton
    style={styles.logoutButton}
    title={'Đăng xuất'}
    titleStyle={styles.logoutButtonTitle}
    isArrowHidden
    onPress={props.onPress}
    testID="test_btn_logout"
  />
);

const LogoutOfAllDevicesButton = (props) => (
  <TextButton
    style={styles.logoutButton}
    title={'Đăng xuất tất cả thiết bị'}
    titleStyle={styles.logoutButtonTitle}
    isArrowHidden
    onPress={props.onPress}
  />
);

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ProfileScreen.contextTypes = {
  store: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isUpdateProfileProcessing: state.isUpdateProfileProcessing,
  updateProfileResponse: state.updateProfileResponse,
  isLogoutProcessing: state.isLogoutProcessing,
  logoutResponse: state.logoutResponse,
  isGettingBankList: state.isGetUserBankList
});

const mapDispatchToProps = (dispatch) => ({
  logout: (isLogOutOfAllDevices) => dispatch(logout(isLogOutOfAllDevices)),
  updateProfile: (userInfo) => dispatch(updateProfile(userInfo)),
  requestUserBankList: () => dispatch(requestUserBankList())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E6EBFF'
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    // paddingBottom: 16,
    backgroundColor: '#fff0'
  },
  personalInfoContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  bankInfoContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  backButton: {
    width: 64,
    height: 64,
    paddingTop: 4,
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 28
  },
  editBankAccountButton: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: -4,
    marginBottom: 4,
    backgroundColor: '#f000'
  },
  historyButton: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: -4,
    marginBottom: 4,
    backgroundColor: '#f000'
  },
  logoutButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 44,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: colors.navigation_bg,
    borderRadius: 0.0
  },
  logoutButtonTitle: {
    color: '#d83c4c',
    fontSize: 15,
    fontWeight: '400'
  },
  headerAccessoryButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 44,
    height: 36,
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    top: -10,
    bottom: 0,
    left: 0,
    right: 0,
    width: BACKGROUND_IMAGE_WIDTH,
    height: BACKGROUND_IMAGE_HEIGHT,
    borderRadius: 0
  }
});
