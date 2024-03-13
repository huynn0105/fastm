import { connect } from 'react-redux';
import ImageResizer from 'react-native-image-resizer';

import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import _ from 'lodash';

import Spinner from 'react-native-loading-spinner-overlay';
import { fetchWithdrawInfos, logout } from '../../redux/actions';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { showAlertForRequestPermission } from '../../utils/UIUtils';
import Colors from '../../theme/Color';
import ImageUtils from '../../utils/ImageUtils';
import LinkButton from '../../components2/LinkButton';
import TextStyles from '../../theme/TextStyle';
import UserInfo from '../../components2/UserInfo';
import UserPersonalInfoContainer from '../../screens/Profile/UserPersonalInfoContainer';
import WithdrawInfo from './WithdrawInfo';
import FirebaseStorage from '../../submodules/firebase/FirebaseStorage';
import { MFConfigs } from '../../constants/configs';
import SpaceRow from '../Setting/SpaceRow';
import Strings from '../../constants/strings';
import { SCREEN_MODE } from '../PhoneInput/index';
import ImageButton from '../../components2/ImageButton/index';
import { updateProfile } from '../../redux/actions/user';
import Popup from '../../components2/Popup';
import { CustomModal } from '../../components/CustomModal';
import iphone12Helper from '../../utils/iphone12Helper';

const HeaderSection = ({ title, icon, actionTitle, onPress }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Text style={{ ...TextStyles.heading4 }}>{title}</Text>
    <LinkButton
      textStyle={{
        color: Colors.primary2,
      }}
      text={actionTitle}
      rightIcon={icon}
      onPress={onPress}
    />
  </View>
);

export const Notice = ({ textStyle }) => (
  <Text
    style={{
      ...TextStyles.heading4,
      ...textStyle,
    }}
  >
    {'Để thay đổi CMND/ CCCD/ CCQĐ vui lòng gọi đến tổng đài '}
    <Text style={{ ...TextStyles.heading4, color: Colors.primary2, opacity: 1 }}>
      {'08999.09789 '}
    </Text>
    {'để được hỗ trợ thay đổi'}
  </Text>
);

const Loading = (props) => (
  <Spinner
    visible={props.isSpinnerVisible}
    textContent={props.spinnerText}
    textStyle={{
      marginTop: 4,
      color: '#FFF',
    }}
    overlayColor="#00000080"
  />
);

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isImageProcessing: false,
      logoutWebview: false,
      showWarningUpdateInfoModal: false,
      showErrorWithdrawInfo: false,
      test: '',
    };
  }
  componentDidMount() {
    this.props.fetchWithdrawInfos();
  }
  onEditPersonalUserInfoPress = () => {
    this.props.navigation.navigate('EditProfile');
  };

  onRegisterProUserPress = () => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Ứng tuyển',
      url: MFConfigs.upPro,
    });
  };

  onWithdrawInfoPress = (url, title, index) => {
    // const { myUser } = this.props;
    // if (index === 0) {
    //   const cmnd = myUser.cmnd;
    //   if (_.isEmpty(cmnd)) {
    //     this.setState({
    //       showWarningUpdateInfoModal: true,
    //     });
    //     return;
    //   }
    // } else {
    //   const bankAccount = myUser.bankAccount;
    //   if (_.isEmpty(bankAccount)) {
    //     this.setState({
    //       showErrorWithdrawInfo: true,
    //     });
    //     return;
    //   }
    // }

    this.props.navigation.navigate('WebView', {
      mode: 0,
      title,
      url,
      callbackBackEvent: this.needReloadBankList,
    });
  };

  onWithdrawTermPress = () => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Những quy định về TK NHLK',
      url: this.props.withdrawTerm,
      callbackBackEvent: this.needReloadBankList,
    });
  };

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
      .catch(() => {
        this.setState({ isImageProcessing: false });
      });
  };

  needReloadBankList = () => {
    this.props.fetchWithdrawInfos();
  };

  // eslint-disable-next-line react/sort-comp
  logout = (isLogoutAllDevices) => {
    Alert.alert(
      Strings.alert_title,
      isLogoutAllDevices ? Strings.logout_of_all_devices_confirm : Strings.logout_confirm,
      [
        {
          text: 'Đăng xuất',
          onPress: () => {
            this.setState({ logoutWebview: true });
            this.props.logout(isLogoutAllDevices);
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  onLogoutPress = () => {
    this.logout(false);
  };

  onLogoutAllDevicesPress = () => {
    this.logout(true);
  };

  onUpdatePhoneNumberPress = () => {
    this.props.navigation.navigate('PhoneInput', {
      screenMode: SCREEN_MODE.UPDATE_PHONE_NUMBER,
    });
  };

  pickImage = (type) => {
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
                : Strings.camera_access_error_android,
            );
            reject();
          }
        })
        .catch((err) => {
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? Strings.camera_access_error
              : Strings.camera_access_error_android,
          );
          reject();
        });
    });
  };
  resizeImage = (fileURI, width = 512, height = 512) => {
    return ImageResizer.createResizedImage(fileURI, width, height, 'JPEG', 80)
      .then((response) => {
        // eslint-disable-line
        // Utils.log(`${LOG_TAG} resizeImage: `, response);
        return response.uri;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
  uploadImage = (fileURI, type = 'avatar') => {
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
        this.setState({ isImageProcessing: false });
        setTimeout(() => {
          this.showAlert(Strings.upload_image_error);
        }, 250);
      },
      async (snapshot) => {
        // success
        // Utils.log(`${LOG_TAG} uploadImage: `, snapshot);
        const downloadURL = await FirebaseStorage.getDownloadURL(snapshot?.metadata?.fullPath);
        this.updateUserImage(downloadURL, type);
        setTimeout(() => {
          this.setState({ isImageProcessing: false });
        }, 250);
      },
    );
  };
  updateUserImage = (imageURL, type) => {
    if (type === 'avatar') {
      this.props.updateProfile({
        avatarImage: imageURL,
      });
    }
    if (type === 'wall') {
      this.props.updateProfile({
        wallImage: imageURL,
      });
    }
  };

  onHideWarningUpdateInfoModalPress = () => {
    this.setState({
      showWarningUpdateInfoModal: false,
    });
  };

  onButtonUpdateInfoModalPress = () => {
    this.setState(
      {
        showWarningUpdateInfoModal: false,
      },
      () => {
        this.props.navigation.navigate('EditProfile');
      },
    );
  };

  renderRegisterProUserSection = () => (
    <TouchableOpacity
      activeOpacity={0.2}
      style={{
        marginTop: 10,
        paddingLeft: 16,
        paddingRight: 35,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
      }}
      onPress={this.onRegisterProUserPress}
    >
      <Text>
        {'Ứng tuyển thành'}
        <Text style={{ fontWeight: 'bold' }}>{' chuyên viên MFAST '}</Text>
        {'để tăng thêm thu nhập và hưởng nhiều chính sách ưu đãi từ MFAST'}
      </Text>
      <Image
        style={{ position: 'absolute', height: '100%', right: 12, top: 10, bottom: 0 }}
        source={require('../../components2/UserInfoContainer/img/ic_next.png')}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  renderBankingInfoSection = (infos, onPress) => {
    const { myUser } = this.props;
    const { showErrorWithdrawInfo } = this.state;
    const isShowError = showErrorWithdrawInfo && _.isEmpty(myUser.bankAccount);

    return (
      <View style={{ marginTop: 30, marginLeft: 16, marginRight: 16 }}>
        <HeaderSection
          title={'Tài khoản ngân hàng liên kết'}
          icon={require('./img/ic_folder.png')}
          actionTitle={'Quy định'}
          onPress={this.onWithdrawTermPress}
        />
        <Text style={{ ...TextStyles.normalTitle, opacity: 0.6 }}>
          {'Số dư tiền từ ví tích lũy có thể rút về tài khoàn này'}
        </Text>
        <View style={{ marginTop: 16 }}>
          <WithdrawInfo infos={infos} onPress={onPress} showErrorWithdrawInfo={isShowError} />
        </View>
      </View>
    );
  };

  renderPersonalUserInfoSection = (myUserInfo) => (
    <View style={{ marginTop: 24, marginLeft: 16, marginRight: 16 }}>
      <HeaderSection
        title={'Thông tin cá nhân'}
        icon={require('./img/icon_edit.png')}
        actionTitle={myUserInfo.cmnd ? 'Chỉnh sửa' : 'Cập nhật'}
        onPress={this.onEditPersonalUserInfoPress}
      />
      {/* Personal User Info Card */}
      {myUserInfo.fullName ? (
        <View style={{ marginTop: 16, backgroundColor: 'white', borderRadius: 6 }}>
          <UserPersonalInfoContainer user={myUserInfo} />
        </View>
      ) : (
        this.renderEmptyUserInfoSection()
      )}
    </View>
  );

  renderEmptyUserInfoSection = () => (
    <View style={{ marginTop: 32, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        style={{ espectRatio: 180 / 135, width: (180.0 / 414) * SCREEN_WIDTH, marginBottom: 16 }}
        source={require('./img/ic_empty.png')}
      />
      <Text style={{ ...TextStyles.normalTitle, opacity: 0.6, lineHeight: 20 }}>
        {'Cập nhật thông tin cá nhân của bạn để:'}
      </Text>
      <Text style={{ ...TextStyles.normalTitle, textAlign: 'center', lineHeight: 20 }}>
        {
          '- Dễ dàng mua sắm\n- Giúp MFast hỗ trợ bạn tốt hơn\n- Trải nghiệm tốt nhất các chức năng trên MFast'
        }
      </Text>
    </View>
  );
  renderLogoutWebview = () => {
    return this.state.logoutWebview ? (
      <View style={{ position: 'absolute', opacity: 0, width: 0 }}>
        <WebView
          ref={(object) => {
            this.webView = object;
          }}
          source={{ uri: MFConfigs.logoutWebview }}
          dataDetectorTypes={'none'}
        />
      </View>
    ) : null;
  };

  renderWarningUpdateInfoModalContent = () => {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Image source={require('./img/ic_pop_up_update_info.png')} />
        <Text
          style={{
            textAlign: 'center',
            marginRight: 36,
            marginLeft: 36,
            marginBottom: 26,
            marginTop: 10,
            ...TextStyles.heading4,
          }}
        >
          {'Bạn cần cập nhật '}
          <Text style={{ fontWeight: 'bold' }}>{'thông tin cơ bản '}</Text>
          <Text>
            {'trước khi thêm tài khoản ngân hàng liên kết để thực hiện các giao dịch rút tiền.'}
          </Text>
        </Text>
      </View>
    );
  };

  render() {
    const { myUser, withdrawInfos } = this.props;
    const isSpinnerVisible = this.state.isImageProcessing || this.props.isLogoutProcessing;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <ScrollView>
          <View style={{ paddingBottom: 36 }}>
            <UserInfo
              containerStyle={{
                marginLeft: 16,
                marginRight: 16,
                paddingTop: 10,
              }}
              user={myUser}
              isEditableAvatar
              onAvatarPress={this.onAvatarPress}
              onUpdatePhoneNumberPress={this.onUpdatePhoneNumberPress}
            />
            {/* {this.renderRegisterProUserSection()} */}
            {this.renderPersonalUserInfoSection(myUser)}
            {this.renderBankingInfoSection(withdrawInfos, this.onWithdrawInfoPress)}
            {/* {myUser.phoneNumber ? <Notice /> : null} */}
            <SpaceRow style={{ height: 12, marginTop: 30, backgroundColor: Colors.neutral5 }} />
            <LinkButton
              containerStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: Colors.accent3 }}
              text={'Đăng xuất'}
              onPress={this.onLogoutPress}
            />
            <SpaceRow style={{ height: 12, backgroundColor: Colors.neutral5 }} />
            <LinkButton
              containerStyle={{ height: 40, justifyContent: 'center' }}
              textStyle={{ color: Colors.accent3 }}
              text={'Đăng xuất tất cả các thiết bị'}
              onPress={this.onLogoutAllDevicesPress}
            />
            <SpaceRow style={{ height: 12, backgroundColor: Colors.neutral5 }} />
          </View>
        </ScrollView>
        <CustomModal
          isShown={this.state.showWarningUpdateInfoModal}
          leftButtonTitle="Để sau"
          rightButtonTitle="Cập nhật ngay"
          onTouchOutside={this.onHideWarningUpdateInfoModalPress}
          content={this.renderWarningUpdateInfoModalContent()}
          onLeftButtonPress={this.onHideWarningUpdateInfoModalPress}
          onRightButtonPress={this.onButtonUpdateInfoModalPress}
        />
        {this.renderLogoutWebview()}
        <Loading isSpinnerVisible={isSpinnerVisible} spinnerText={'Đang xử lí'} />
      </SafeAreaView>
    );
  }
}

ProfileScreen.navigationOptions = () => {
  return {
    title: 'Thông tin tài khoản',
    headerStyle: {
      backgroundColor: Colors.neutral5,
      borderBottomWidth: 0,
      elevation: 0,
      marginLeft: Platform.OS === 'ios' ? 16 : 0,
      marginRight: Platform.OS === 'ios' ? 16 : 0,
      marginTop: iphone12Helper() ? 10 : 0,
    },
    headerTintColor: '#000',
    headerBackTitle: null,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchWithdrawInfos: () => dispatch(fetchWithdrawInfos()),
  updateProfile: (userInfo) => dispatch(updateProfile(userInfo)),
  logout: (isLogOutOfAllDevices) => dispatch(logout(isLogOutOfAllDevices)),
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  withdrawInfos: state.withdrawInfos,
  withdrawTerm: state.withdrawTerm,
  isLogoutProcessing: state.isLogoutProcessing,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
