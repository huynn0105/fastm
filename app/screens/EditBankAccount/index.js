import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalFilterPicker from 'react-native-modal-filter-picker';

import TextInputRow from 'common/inputs/TextInputRow';
import TextHeader from 'common/TextHeader';
import KJTouchableOpacity from 'common/KJTouchableOpacity';

import {
  getBanks,
  getBankBranches,
  requestImportantUpdateProfile,
  importantUpdateProfile,
} from 'app/redux/actions';

import Styles from 'app/constants/styles';
import Strings, { formatString } from 'app/constants/strings';
import styles from './styles';

const PICKER_MODE_BANK = 'bank';
const PICKER_MODE_BRANCH = 'branch';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'EditBankAccountScreen.js';
/* eslint-enable */

// --------------------------------------------------
// EditBankAccountScreen
// --------------------------------------------------

class EditBankAccountScreen extends Component {
  constructor(props) {
    super(props);

    const myUser = this.props.myUser;

    this.state = {
      step: 0, // 0: key-in bank info, 1: request otp & update
      otpConfirmCode: '',
      bankAccountName: myUser.bankAccountName || '',
      bankAccount: myUser.bankAccount || '',
      bankName: myUser.bankName || '',
      bankBranch: myUser.bankBranch || '',
      pickerMode: '',
      isPickerVisible: false,
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
    // load bank list
    this.loadBanks();
    // load branch list if possible
    if (this.state.bankName && this.state.bankName.length > 0) {
      this.loadBankBranches();
    }
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
    // no need to update
    if (!this.isBankInfoChange()) {
      return;
    }
    // 1. check inputs
    if (!this.checkInputsValid()) {
      return;
    }
    // 2. request otp
    this.props.requestImportantUpdateProfile();
  }
  onBankAccountNameChangeText = (text) => {
    this.setState({
      bankAccountName: text,
    }, () => {
      this.onBankInfoChange();
    });
  }
  onBankAccountChangeText = (text) => {
    this.setState({
      bankAccount: text,
    }, () => {
      this.onBankInfoChange();
    });      
  }
  onBankPress = () => {
    this.showBankPicker();
  }
  onBranchPress = () => {
    this.showBranchPicker();
  }
  onPickerSelect = (item) => {
    if (this.state.pickerMode === PICKER_MODE_BANK) {
      this.setState({
        bankName: item,
        bankBranch: '',
        isPickerVisible: false,
      }, () => {
        this.onBankInfoChange(); 
        setTimeout(() => {
          this.loadBankBranches();
        }, 250);
      });
    }
    else {
      this.setState({
        bankBranch: item,
        isPickerVisible: false,
      }, () => { 
        this.onBankInfoChange(); 
      });
    }
  }
  onPickerCancel = () => {
    this.setState({
      isPickerVisible: false,
    });
  }
  onBankInfoChange = () => {
    if (this.props.navigation) {
      const isBankInfoChange = this.isBankInfoChange();
      this.props.navigation.setParams({ isBankInfoChange });
    }
  }
  // --------------------------------------------------
  loadBanks() {
    this.props.getBanks();
  }
  loadBankBranches() {
    this.props.getBankBranches(this.state.bankName);
  }
  handleRequestImportantUpdateProfileResponse(prevProps) {
    const status = this.props.importantUpdateProfileResponse.status;
    const prevStatus = prevProps.importantUpdateProfileResponse.status;
    if (status === true && status !== prevStatus) {
      // success
      const actionCode = this.props.importantUpdateProfileResponse.data.actionCode;
      this.setState({
        step: 1,
        otpConfirmCode: actionCode,
      }, () => {
        setTimeout(() => {
          this.openOtpConfirm();
        }, 500);
      });
    } else if (status === false && status !== prevStatus) {
      // error
      setTimeout(() => {
        const message = formatString(Strings.request_action_error, { action_name: 'gửi mã xác nhận' });
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
        message = message || formatString(Strings.request_action_error, { action_name: 'cập nhật' });
        this.showAlert(message);
      }, 500);
    }
  }
  openOtpConfirm() {
    this.props.navigation.navigate('OtpConfirm', {

      userPhoneNumber: this.props.myUser.phoneNumber,
      otpConfirmCode: '',

      onOtpSubmitCallback: (otpCode) => {
        const params = {
          bankOwnerName: this.state.bankAccountName,
          bankNumber: this.state.bankAccount,
          bankName: this.state.bankName,
          bankBranch: this.state.bankBranch,
        };
        this.props.importantUpdateProfile(otpCode, params);
      },

      onOtpResendCallback: () => {
        this.setState({
          step: 0,
          otpConfirmCode: '',
        }, () => {
          this.props.requestImportantUpdateProfile();
        });
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
  checkInputsValid() {
    const bankAccountName = this.state.bankAccountName ? this.state.bankAccountName.trim() : '';
    if (bankAccountName.length === 0) {
      this.showAlert(Strings.missing_bank_account_name);
      return false;
    }
    const bankAccount = this.state.bankAccount ? this.state.bankAccount.trim() : '';
    if (bankAccount.length === 0) {
      this.showAlert(Strings.missing_bank_account);
      return false;
    }
    const bankName = this.state.bankName ? this.state.bankName : '';
    if (bankName.length === 0) {
      this.showAlert(Strings.missing_bank_name);
      return false;
    }
    const bankBranch = this.state.bankBranch ? this.state.bankBranch : '';
    if (bankBranch.length === 0) {
      this.showAlert(Strings.missing_bank_branch);
      return false;
    }
    return true;
  }
  // --------------------------------------------------
  showBankPicker() {
    this.setState({
      isPickerVisible: true,
      pickerMode: PICKER_MODE_BANK,
    });
  }
  showBranchPicker() {
    this.setState({
      isPickerVisible: true,
      pickerMode: PICKER_MODE_BRANCH,
    });
  }
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{ text: 'Đóng' }],
      { cancelable: false },
    );
  }
  showSuccessAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{
        text: 'Đóng',
        onPress: () => {
          this.props.navigation.goBack();
        },
      }],
      { cancelable: false },
    );
  }
  isBankInfoChange() {
    if (this.state.bankAccountName !== this.props.myUser.bankAccountName || 
        this.state.bankAccount !== this.props.myUser.bankAccount || 
        this.state.bankName !== this.props.myUser.bankName ||
        this.state.bankBranch !== this.props.myUser.bankBranch) {
      return true;
    }
    return false;
  }
  // --------------------------------------------------
  renderBankAccountName() {
    const bankAccountName = this.state.bankAccountName;
    return (
      <TextInputRow
        title="Tên chủ tài khoản"
        textInputProps={{
          value: bankAccountName,
          onChangeText: this.onBankAccountNameChangeText,
        }}
        isSeperatorHidden={false}
      />
    );
  }
  renderBankAccount() {
    const bankAccount = this.state.bankAccount;
    return (
      <TextInputRow
        title="Số tài khoản"
        textInputProps={{
          value: bankAccount,
          onChangeText: this.onBankAccountChangeText,
        }}
        isSeperatorHidden={false}
      />
    );
  }
  renderBankName() {
    const bankName = this.state.bankName;
    return (
      <KJTouchableOpacity
        onPress={this.onBankPress}
        activeOpacity={0.65}
      >
        <TextInputRow
          title="Tên ngân hàng"
          textInputProps={{
            value: bankName,
            editable: false,
          }}
          isSeperatorHidden={false}
        />
      </KJTouchableOpacity>
    );
  }
  renderBankBranch() {
    const bankBranch = this.state.bankBranch;
    return (
      <KJTouchableOpacity
        onPress={this.onBranchPress}
        activeOpacity={0.65}
      >
        <TextInputRow
          title="Chi nhánh"
          textInputProps={{
            value: bankBranch,
            editable: false,
          }}
          isSeperatorHidden={false}
        />
      </KJTouchableOpacity>
    );
  }
  renderModalPicker() {
    const {
      pickerMode,
      isPickerVisible,
    } = this.state;
    const {
      isGetBanksProcessing,
      getBanksResponse,
      isGetBankBranchesProcessing,
      getBankBranchesResponse,
    } = this.props;
    // ---
    let noResultsText = 'Không tìm thấy';
    if (pickerMode === PICKER_MODE_BANK) {
      if (isGetBanksProcessing) {
        noResultsText = 'Đang tải dữ liệu...';
      }
    } else if (pickerMode === PICKER_MODE_BRANCH) {
      if (!this.state.bankName || this.state.bankName.length === 0) {
        noResultsText = 'Bạn chưa chọn\ntên ngân hàng';
      } else if (isGetBankBranchesProcessing) {
        noResultsText = 'Đang tải dữ liệu...';
      }
    }
    // ---
    let pickerOptions = [];
    if (pickerMode === PICKER_MODE_BANK) {
      pickerOptions = (getBanksResponse.data || []).map(item => {
        return {
          key: item,
          label: item,
        };
      });
    } else if (pickerMode === PICKER_MODE_BRANCH) {
      pickerOptions = (getBankBranchesResponse.data || []).map(item => {
        return {
          key: item,
          label: item,
        };
      });
    }
    // ---
    return (
      <ModalFilterPicker
        visible={isPickerVisible}
        listViewProps={{
          keyboardShouldPersistTaps: 'always',
          keyboardDismissMode: 'on-drag',
        }}
        placeholderText="Tìm..."
        placeholderTextColor="#808080"
        noResultsText={noResultsText}
        cancelButtonText="Đóng"
        listContainerStyle={styles.pickerList}
        optionTextStyle={styles.pickerOptionText}
        cancelButtonStyle={styles.pickerCancelButton}
        cancelButtonTextStyle={styles.pickerCancelText}
        onSelect={this.onPickerSelect}
        onCancel={this.onPickerCancel}
        options={pickerOptions}
      />
    );
  }
  renderSpinner() {
    const isSpinnerVisible =
      // this.props.isGetBanksProcessing || 
      // this.props.isGetBankBranchesProcessing || 
      this.props.isImportantUpdateProfileProcessing;
    let spinnerText = 'Đang tải...';
    if (this.state.step === 0 && this.props.isImportantUpdateProfileProcessing) {
      spinnerText = 'Đang gửi mã xác nhận ...';
    }
    if (this.state.step === 1 && this.props.isImportantUpdateProfileProcessing) {
      spinnerText = 'Đang xử lý ...';
    }
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#FFF' }}
        overlayColor="#00000080"
      />
    );
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          overScrollMode={'always'}
          keyboardShouldPersistTaps={'handled'}
        >
          <TextHeader
            title={'Thay đổi thông tin ngân hàng'}
          />
          <View style={styles.inputsContainer}>
            {this.renderBankAccountName()}
            {this.renderBankAccount()}
            {this.renderBankName()}
            {this.renderBankBranch()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderModalPicker()}
        {this.renderSpinner()}
      </View>
    );
  }
}

EditBankAccountScreen.navigationOptions = ({ navigation }) => ({
  title: 'Tài khoản ngân hàng',
  headerBackTitle: Strings.navigation_back_title,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  headerRight: <HeaderRightButton navigation={navigation} />,
});

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  const textColor = (params && params.isBankInfoChange) ? '#000' : '#ccc';
  return (
    <KJTouchableOpacity
      style={styles.headerRightButton}
      onPress={() => {
        if (params && params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    >
      <Text 
        style={[
          styles.headerRightButtonText, { color: textColor },
        ]}
      >
        {'Tiếp tục'}
      </Text>
    </KJTouchableOpacity>
  );
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

EditBankAccountScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isGetBanksProcessing: state.isGetBanksProcessing,
  getBanksResponse: state.getBanksResponse,
  isGetBankBranchesProcessing: state.isGetBankBranchesProcessing,
  getBankBranchesResponse: state.getBankBranchesResponse,
  isImportantUpdateProfileProcessing: state.isImportantUpdateProfileProcessing,
  importantUpdateProfileResponse: state.importantUpdateProfileResponse,
});

const mapDispatchToProps = (dispatch) => ({
  getBanks: () => dispatch(getBanks()),
  getBankBranches: (bankName) => dispatch(getBankBranches(bankName)),
  requestImportantUpdateProfile: () => 
    dispatch(requestImportantUpdateProfile()),
  importantUpdateProfile: (actionCode, userInfo) => 
    dispatch(importantUpdateProfile(actionCode, userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBankAccountScreen);
