import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestImportantUpdateProfile, importantUpdateProfile } from 'app/redux/actions';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  Platform,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import DateTimePicker from 'react-native-modal-datetime-picker';
import GenderInputRow from '../../common/inputs/GenderInputRow';
import KJTouchableOpacity from '../../common/KJTouchableOpacity';
import moment from 'moment/min/moment-with-locales';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import Strings, { formatString } from 'app/constants/strings';
import Styles from 'app/constants/styles';
import TextHeader from '../../common/TextHeader';

import Utils, { isEmailValid } from 'app/utils/Utils';
import colors from '../../constants/colors';
import { Notice } from '../../screens2/Profile';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import { CustomTextField } from '../../components2/CustomTextField';
import { SafeAreaView } from 'react-navigation';
import { isCitizenIDValid } from '../../utils/Utils';
import { SwitchKeyboardButton } from '../../components2/SwitchKeyboardButton';
import DigitelClient from '../../network/DigitelClient';
import { fetchMyUser } from '../../redux/actions/user';
import { showInfoAlert } from '../../utils/UIUtils';
const LOG_TAG = 'EditProfile/index.js';

const _ = require('lodash');

const DEFAULT_BIRTHDAY = 946684800;
const DEFAULT_CREATED_DATE = 1262304000;

// --------------------------------------------------
// EditProfileScreen
// --------------------------------------------------

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);
    const { myUser } = props;
    Utils.log(`${LOG_TAG} my user: `, myUser);
    this.state = {
      step: 0, // 0: request otp, 1: update profile
      otpConfirmCode: '',
      dateOfBirth: myUser.dateOfBirth || DEFAULT_BIRTHDAY,
      gender: myUser.gender || '',
      cmndIssuedDate: myUser.cmndIssuedDate || DEFAULT_CREATED_DATE,
      cmndIssuedPlace: myUser.cmndIssuedPlace || '',
      email: myUser.email || '',
      address: myUser.address || '',
      name: myUser.fullName,
      cmnd: myUser.cmnd,
      showErrorCMND: false,
      txtErrorCMND: null,
      showErrorCMNDPlace: false,
      showErrorFullName: false,
      showErrorEmail: false,
      showErrorAddress: false,
      showErrorGender: false,

      keyboardType: 'numeric',
      provinces: [],

      isFullNameEmpty: isEmpty(myUser.fullName),
      isCmndEmpty: isEmpty(myUser.cmnd),
      isAddressEmpty: isEmpty(myUser.address),
      isEmailEmpty: isEmpty(myUser.email),
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
    // test
    // this.setState({
    //   step: 1,
    //   otpConfirmCode: '111222',
    // }, () => {
    //   this.openOtpConfirm();
    // });
    // end
    this.fetchProvinces();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidUpdate(prevProps) {
    // if (this.state.step === 0) {
    //   this.handleRequestImportantUpdateProfileResponse(prevProps);
    // } else if (this.state.step === 1) {
    //   this.handleImportantUpdateProfileResponse(prevProps);
    // }
  }

  fetchProvinces = async () => {
    const provinces = await DigitelClient.fetchProvince();
    this.setState({
      provinces: provinces.sort((a, b) => a.localeCompare(b)),
    });
  };

  // --------------------------------------------------

  onSwitchKeyboardPress = () => {
    this.setState({ keyboardType: this.state.keyboardType === 'numeric' ? 'default' : 'numeric' });
  };

  onMergeAccountPress = () => {
    const { myUser } = this.props;
    this.props.navigation.navigate('SyncProfile', { myUser });
  };
  onHeaderLeftButtonPress = () => {
    this.props.navigation.popToTop();
  };
  onHeaderRightButtonPress = async () => {
    // no need to update
    if (!this.isUserInfoChange()) {
      return;
    }
    // check input
    if (!this.checkInputsValid()) {
      return;
    }
    if (isCitizenIDValid(this.state.cmnd.trim())) {
      const { myUser } = this.props;
      if (isEmpty(myUser.cmnd) || myUser.cmnd === ' ') {
        const res = await DigitelClient.checkIdnumberExists(this.state.cmnd.trim());
        if (!res.status) {
          this.setState({ showErrorCMND: true, txtErrorCMND: res.message });
          return;
        }
      }
    }

    // request otp
    // this.props.requestImportantUpdateProfile();
    const userPhoneNumber = this.props.myUser.phoneNumber;
    DigitelClient.mfRequestOTP(userPhoneNumber).then(() => {
      this.openOtpConfirm();
    });
  };
  onNameChangeText = (text) => {
    this.setState(
      {
        name: text,
        isFullNameEmpty: isEmpty(text),
        showErrorFullName: false,
      },
      () => {
        this.onUserInfoChange();
      },
    );
  };
  onDateOfBirthPress = () => {
    this.datePickerMode = 'dob';
    this.datePickerCurrentDate = moment(this.state.dateOfBirth, 'X').toDate();
    this.showDateTimePicker();
    Keyboard.dismiss();
  };
  onCmndIssuedDatePress = () => {
    this.datePickerMode = 'cmnd';
    this.datePickerCurrentDate = moment(this.state.cmndIssuedDate, 'X').toDate();
    this.showDateTimePicker();
    Keyboard.dismiss();
  };
  onChangeGender = (gender) => {
    this.setState(
      {
        gender,
        showErrorGender: false,
      },
      () => {
        this.onUserInfoChange();
      },
    );
  };
  onCmndIssuedPlaceChangeText = (text) => {
    this.setState(
      {
        cmndIssuedPlace: text,
        // cmndIssuedPlace:'',
        showErrorCMNDPlace: false,
      },
      () => {
        this.onUserInfoChange();
      },
    );
  };
  onEmailChangeText = (text) => {
    this.setState(
      {
        email: text,
        isEmailEmpty: isEmpty(text),
        showErrorEmail: false,
      },
      () => {
        this.onUserInfoChange();
      },
    );
  };
  onAddressChangeText = (text) => {
    this.setState(
      {
        address: text,
        showErrorAddress: false,
      },
      () => {
        this.onUserInfoChange();
      },
    );
  };
  onUserInfoChange = () => {
    if (this.props.navigation) {
      const isUserInfoChange = this.isUserInfoChange();
      this.props.navigation.setParams({ isUserInfoChange });
    }
  };
  onCitizenIDChangeText = (text) => {
    this.setState({ cmnd: text, showErrorCMND: false }, () => {
      this.onUserInfoChange();
    });
  };
  // --------------------------------------------------
  handleRequestImportantUpdateProfileResponse(prevProps) {
    const status = this.props.importantUpdateProfileResponse.status;
    const prevStatus = prevProps.importantUpdateProfileResponse.status;
    if (status === true && status !== prevStatus) {
      // success
      const actionCode = this.props.importantUpdateProfileResponse.data.actionCode;
      this.setState(
        {
          step: 1,
          otpConfirmCode: actionCode,
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
    if (status === true && status !== prevStatus) {
      // success
      setTimeout(() => {
        const message = formatString(Strings.request_action_success, { action_name: 'cập nhật' });
        this.showSuccessAlert(message);
      }, 500);
    } else if (status === false && status !== prevStatus) {
      // error
      setTimeout(() => {
        let message = this.props.importantUpdateProfileResponse.message;
        message =
          message || formatString(Strings.request_action_error, { action_name: 'cập nhật' });
        this.showAlert(message);
      }, 500);
    }
  }
  openOtpConfirm() {
    this.props.navigation.navigate('OtpConfirm', {
      userPhoneNumber: this.props.myUser.phoneNumber,
      otpConfirmCode: '',

      onOtpSubmitCallback: (otpCode) => {
        const { myUser } = this.props;
        const userPhoneNumber = myUser.phoneNumber;
        const params = {
          dob: moment(this.state.dateOfBirth, 'X').format('YYYY-MM-DD'),
          sex: this.state.gender,
          idIssuedDate: moment(this.state.cmndIssuedDate, 'X').format('YYYY-MM-DD'), //formatDate(this.state.cmndIssuedDate || 0),
          idIssuedBy: this.state.cmndIssuedPlace,
          email: this.state.email.trim(),
          fullName: this.state.name.trim(),
          address: this.state.address.trim(),
        };
        if (isEmpty(myUser.cmnd) || myUser.cmnd === ' ') {
          params.cmnd = this.state.cmnd.trim();
          params.idNumber = this.state.cmnd.trim();
        }
        // this.props.importantUpdateProfile(otpCode, params);
        DigitelClient.updateUserProfile({
          ...params,
          otp_code: otpCode,
          mobilePhone: userPhoneNumber,
        }).then(() => {
          setTimeout(() => {
            const message = formatString(Strings.request_action_success, {
              action_name: 'cập nhật',
            });
            this.showSuccessAlert(message);
          }, 200);
        });
      },

      onOtpResendCallback: (funcCallbackCountDownTime) => {
        this.setState(
          {
            step: 0,
            otpConfirmCode: '',
          },
          async () => {
            // this.props.requestImportantUpdateProfile();
            const userPhoneNumber = this.props.myUser.phoneNumber;
            const responseOTP = await DigitelClient.mfRequestOTP(userPhoneNumber);
            if (
              responseOTP &&
              responseOTP.data &&
              responseOTP.data.status &&
              responseOTP.data.wait_retry
            ) {
              if (typeof funcCallbackCountDownTime === 'function') {
                funcCallbackCountDownTime(responseOTP.data.wait_retry);
              }
            }
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
  showDateTimePicker() {
    this.setState({
      isDateTimePickerVisible: true,
    });
  }
  hideDateTimePicker() {
    this.setState({
      isDateTimePickerVisible: false,
    });
  }
  handleDatePicked(date) {
    // Utils.log(`${LOG_TAG} pick date: `, date, moment(date).unix());
    const dateUTC = moment(date).unix();
    if (this.datePickerMode === 'dob') {
      if (this.dateOfBirthInputRef) {
        this.dateOfBirthInputRef.setValue(this.formatDate(dateUTC));
      }
      this.setState(
        {
          dateOfBirth: dateUTC,
        },
        () => {
          this.hideDateTimePicker();
          this.onUserInfoChange();
        },
      );
    } else if (this.datePickerMode === 'cmnd') {
      if (this.cmndIssuedDateInputRef) {
        this.cmndIssuedDateInputRef.setValue(this.formatDate(dateUTC));
      }
      this.setState(
        {
          cmndIssuedDate: dateUTC,
        },
        () => {
          this.hideDateTimePicker();
          this.onUserInfoChange();
        },
      );
    }
  }
  // --------------------------------------------------
  checkInputsValid() {
    let isValid = true;

    if (!isCitizenIDValid(this.state.cmnd.trim())) {
      isValid = false;
      this.setState({ showErrorCMND: true });
    }
    if (isEmpty(this.state.gender)) {
      isValid = false;
      this.setState({ showErrorGender: true });
    }

    if (this.state.name.trim().length === 0) {
      this.setState({ showErrorFullName: true });
      isValid = false;
    }
    if (
      this.state.cmndIssuedPlace.trim().length === 0 ||
      this.state.cmndIssuedPlace.trim() === 'Đang tải...'
    ) {
      this.setState({ showErrorCMNDPlace: true });
      isValid = false;
      showInfoAlert('Vui lòng chọn nơi cấp');
    }
    if (this.state.email.trim().length === 0) {
      this.setState({ showErrorEmail: true });
      isValid = false;
    }
    if (!isEmailValid(this.state.email.trim())) {
      this.setState({ showErrorEmail: true });
      isValid = false;
    }
    if (this.state.address.trim().length === 0) {
      this.setState({ showErrorAddress: true });
      isValid = false;
    }
    return isValid;
  }
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  showSuccessAlert(message) {
    this.props.fetchMyUser();
    Alert.alert(
      Strings.alert_title,
      message,
      [
        {
          text: 'Đóng',
          onPress: () => {
            this.props.navigation.dismiss();
          },
        },
      ],
      { cancelable: false },
    );
  }
  isUserInfoChange() {
    // Utils.log(`${LOG_TAG} isUserInfoChange: `, this.state, this.props.myUser);
    if (
      this.state.dateOfBirth !== this.props.myUser.dateOfBirth ||
      this.state.gender !== this.props.myUser.gender ||
      this.state.cmndIssuedDate !== this.props.myUser.cmndIssuedDate ||
      this.state.cmndIssuedPlace !== this.props.myUser.cmndIssuedPlace ||
      this.state.email !== this.props.myUser.email ||
      this.state.name !== this.props.myUser.name ||
      this.state.address !== this.props.myUser.address ||
      this.state.cmnd !== this.props.myUser.cmnd
    ) {
      return true;
    }
    return false;
  }

  renderPhone() {
    const myUser = this.props.myUser;
    return (
      <CustomTextField
        editable={false}
        containerStyle={{ marginTop: 16 }}
        textFieldValue={myUser.phoneNumber}
        textFieldLabel="Số điện thoại"
        onChangeTextFieldText={() => {}}
        baseColor={'rgba(36, 37, 61, 0.5)'}
      />
    );
  }

  renderName() {
    const { isFullNameEmpty, name, showErrorFullName } = this.state;
    return (
      <CustomTextField
        containerStyle={{}}
        textFieldValue={name}
        textFieldLabel="Họ và tên đầy đủ *"
        showError={showErrorFullName}
        errorMessage="Bắt buộc nhập họ và tên"
        onChangeTextFieldText={this.onNameChangeText}
        baseColor={!isFullNameEmpty && !showErrorFullName ? 'rgba(36, 37, 61, 0.5)' : null}
      />
    );
  }

  renderErrorMessageGender = (errorMessage) => {
    return errorMessage ? (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Image style={{ width: 16, height: 16 }} source={require('./img/ic_warning.png')} />
          <Text
            style={{
              marginLeft: 4,
              ...TextStyles.normalTitle,
              fontSize: 11,
              color: Colors.accent3,
            }}
          >
            {errorMessage}
          </Text>
        </View>
      </View>
    ) : (
      <View />
    );
  };

  formatDate = (date) => {
    return date !== 0 ? moment(date, 'X').format('DD/MM/YYYY') : '';
  };
  // --------------------------------------------------
  renderDateOfBirthAndGender() {
    const { dateOfBirth, gender, showErrorGender } = this.state;
    const formattedDateOfBirth = this.formatDate(dateOfBirth);
    return (
      <View>
        <View
          style={{
            flex: 1,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'space-between',
          }}
        >
          <TouchableOpacity style={{ flex: 0.5 }} onPress={this.onDateOfBirthPress}>
            <CustomTextField
              textFieldRef={(ref) => {
                this.dateOfBirthInputRef = ref;
              }}
              editable={false}
              // containerStyle={{ flex: 1 }}
              textFieldValue={formattedDateOfBirth}
              textFieldLabel="Ngày sinh *"
              baseColor={'rgba(36, 37, 61, 0.5)'}
              // onTextFieldFocus={this.onDateOfBirthPress}
            />
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <GenderInputRow
            containerStyle={{ flex: 0.5, marginBottom: 8 }}
            title={'Giới tính'}
            gender={gender}
            onChangeGender={this.onChangeGender}
          />
        </View>
        {showErrorGender ? this.renderErrorMessageGender('Bắt buộc chọn giới tính') : null}
      </View>
    );
  }
  renderCitizenIDIssuedInfo() {
    const { cmndIssuedDate, cmndIssuedPlace } = this.state;
    const formattedcmndIssuedDate = this.formatDate(cmndIssuedDate);
    return (
      <View
        style={{
          marginTop: 16,
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity style={{ flex: 0.5 }} onPress={this.onCmndIssuedDatePress}>
          <CustomTextField
            textFieldRef={(ref) => {
              this.cmndIssuedDateInputRef = ref;
            }}
            editable={false}
            containerStyle={{ marginTop: 2 }}
            textFieldValue={formattedcmndIssuedDate?.toString()}
            textFieldLabel="Ngày cấp *"
            baseColor={'rgba(36, 37, 61, 0.5)'}
            // onTextFieldFocus={this.onCmndIssuedDatePress}
          />
        </TouchableOpacity>
        <View style={{ width: 20 }} />
        {/* <CustomTextField
          containerStyle={{ flex: 0.5 }}
          textFieldValue={cmndIssuedPlace}
          textFieldLabel="Nơi cấp"
          onChangeTextFieldText={this.onCmndIssuedPlaceChangeText}
        /> */}
        <View style={{ flex: 0.5, top: -17 }}>{this.renderPlaceDropDown(cmndIssuedPlace)}</View>
      </View>
    );
  }

  renderPlaceDropDown(cmndIssuedPlace) {
    const { provinces } = this.state;
    let data = provinces.map((value) => ({ value }));
    if (data.length === 0) {
      data = [{ value: 'Đang tải...' }];
    }
    return (
      <Dropdown
        label={'Nơi cấp'}
        labelTextStyle={{
          paddingTop: 2,
          position: 'absolute',
          left: '100%',
        }}
        value={cmndIssuedPlace}
        ref={(ref) => {
          this.dropdownRef = ref;
        }}
        data={data}
        itemCount={10}
        onChangeText={(value) => {
          this.setState({
            cmndIssuedPlace: value,
            showErrorCMNDPlace: false,
          });
          this.onUserInfoChange();
        }}
      />
    );
  }

  renderEmail() {
    const { isEmailEmpty, email, showErrorEmail } = this.state;
    return (
      <CustomTextField
        containerStyle={{ marginTop: 20 }}
        textFieldValue={email}
        textFieldLabel="Email *"
        keyboardType={'email-address'}
        showError={showErrorEmail}
        errorMessage="Bắt buộc nhập email"
        onChangeTextFieldText={this.onEmailChangeText}
        baseColor={!isEmailEmpty && !showErrorEmail ? 'rgba(36, 37, 61, 0.5)' : null}
      />
    );
  }
  renderAddress() {
    const { isAddressEmpty, address, showErrorAddress } = this.state;
    return (
      <CustomTextField
        containerStyle={{ marginTop: 16 }}
        textFieldValue={address}
        textFieldLabel="Địa chỉ thường trú *"
        showError={showErrorAddress}
        errorMessage="Bắt buộc nhập địa chỉ"
        baseColor={!isAddressEmpty && !showErrorAddress ? 'rgba(36, 37, 61, 0.5)' : null}
        onChangeTextFieldText={this.onAddressChangeText}
      />
    );
  }

  renderCitizenID = () => {
    const { myUser } = this.props;
    const { isCmndEmpty, cmnd, showErrorCMND, keyboardType, txtErrorCMND } = this.state;
    const canEdit = !myUser.cmnd || myUser.cmnd === ' ';
    return (
      <View>
        <View style={{ flex: 1 }}>
          <CustomTextField
            editable={canEdit}
            containerStyle={{ marginTop: 16 }}
            textFieldValue={cmnd}
            keyboardType={keyboardType}
            textFieldLabel="Số CMND/ CCCD/ CCQĐ *"
            showError={showErrorCMND}
            errorMessage={txtErrorCMND || 'Bắt buộc nhập CMND/ CCCD/ CCQĐ'}
            baseColor={!isCmndEmpty && !showErrorCMND ? 'rgba(36, 37, 61, 0.5)' : null}
            onChangeTextFieldText={this.onCitizenIDChangeText}
            rightComponent={() => {
              if (canEdit) {
                return (
                  <SwitchKeyboardButton
                    keyboardType={keyboardType}
                    onSwitchCallback={this.onSwitchKeyboardPress}
                  />
                );
              }
              return <View />;
            }}
          />
          {/* {canEdit ? (
            <View style={{ position: 'absolute', right: 0, bottom: showErrorCMND ? 45 : 30 }}>
              <SwitchKeyboardButton
                keyboardType={keyboardType}
                onSwitchCallback={this.onSwitchKeyboardPress}
              />
          </View>
        ) : null} */}
        </View>
        {canEdit ? (
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0,
              color: '#bc0f23',
              marginBottom: 8,
            }}
          >
            {'Nhập chính xác để thuận tiện chi trả thu nhập trên MFast'}
          </Text>
        ) : null}
      </View>
    );
  };

  renderCanMergeAccountMessage = () => {
    const { myUser } = this.props;
    return (
      <View style={{ padding: 10, paddingLeft: 16, paddingRight: 16, backgroundColor: 'white' }}>
        <Text style={{ ...TextStyles.heading4 }}>
          {'SĐT '}
          <Text style={{ fontWeight: 'bold' }}>{`${myUser.phoneNumber} `}</Text>
          <Text>{'này đã có sẵn thông tin cơ bản, '}</Text>
          <Text
            style={{ color: Colors.primary2, fontWeight: 'bold' }}
            onPress={this.onMergeAccountPress}
          >
            {'\n[nhấn vào đây] '}
          </Text>
          <Text>{'để cập nhật nhanh'}</Text>
        </Text>
      </View>
    );
  };

  // --------------------------------------------------
  render() {
    const isSpinnerVisible = this.props.isImportantUpdateProfileProcessing;
    const spinnerText = 'Đang xử lý...';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <KeyboardAwareScrollView overScrollMode={'always'} keyboardShouldPersistTaps={'handled'}>
            <View style={{ height: 4 }} />
            {/* {this.renderCanMergeAccountMessage()} */}
            <View style={{ height: 12 }} />
            {<TextHeader title={'Thay đổi thông tin cá nhân'} />}
            {
              <View>
                <View style={styles.inputsContainer}>
                  <View style={{ height: 8 }} />
                  {this.renderPhone()}
                  {this.renderCitizenID()}
                  {this.renderCitizenIDIssuedInfo()}
                  {this.renderName()}
                  {this.renderDateOfBirthAndGender()}
                  {this.renderEmail()}
                  {this.renderAddress()}
                </View>
                <Notice
                  textStyle={{
                    marginTop: 16,
                    marginLeft: 12,
                    marginRight: 12,
                    textAlign: 'center',
                  }}
                />
                <View style={{ height: 20 }} />
              </View>
            }
          </KeyboardAwareScrollView>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            date={this.datePickerCurrentDate}
            cancelTextIOS={'Đóng'}
            confirmTextIOS={'Chọn'}
            onConfirm={(date) => this.handleDatePicked(date)}
            onCancel={() => this.hideDateTimePicker()}
            titleIOS={'Chọn ngày'}
            headerTextIOS={'Chọn ngày'}
          />

          <Spinner
            visible={isSpinnerVisible}
            textContent={spinnerText}
            textStyle={{ marginTop: 4, color: '#FFF' }}
            overlayColor="#00000080"
          />
        </View>
      </SafeAreaView>
    );
  }
}

// --------------------------------------------------

EditProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Thông tin cá nhân',
  headerStyle: {
    ...Styles.navigator_header_no_border,
    // marginLeft: Platform.OS === 'ios' ? 16 : 0,
    marginRight: Platform.OS === 'ios' ? 16 : 0,
  },
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  headerBackTitle: null,
  headerRight: <HeaderRightButton navigation={navigation} />,
  headerLeft: <HeaderLeftButton navigation={navigation} />,
});

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  const textColor = params && params.isUserInfoChange ? '#000' : '#ccc';
  return (
    <KJTouchableOpacity
      style={styles.headerRightButton}
      onPress={() => {
        if (params && params.isUserInfoChange && params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    >
      <Text style={[styles.headerRightButtonText, { color: textColor }]}>{'Tiếp tục'}</Text>
    </KJTouchableOpacity>
  );
};

const HeaderLeftButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <KJTouchableOpacity
      style={styles.headerRightButton}
      onPress={() => {
        if (params && params.onHeaderLeftButtonPress) {
          params.onHeaderLeftButtonPress();
        }
      }}
    >
      <Image
        style={{ width: 40, height: 32 }}
        resizeMode={'contain'}
        source={require('./img/icon_back_btn.png')}
      />
    </KJTouchableOpacity>
  );
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

EditProfileScreen.contextTypes = {
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
  fetchMyUser: () => dispatch(fetchMyUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  inputsContainer: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'white',
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
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
  },
});
