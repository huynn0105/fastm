import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  View,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Spinner from 'react-native-loading-spinner-overlay';
import Picker from 'react-native-picker';

import {
  getBanks,
  getBankBranches,
  importantUpdateProfile,
} from '../../redux/actions';

import Styles from '../../constants/styles';
import Strings from '../../constants/strings';
import TextButton from '../../common/buttons/TextButton';
import KJTouchableOpacity from '../../common/KJTouchableOpacity';

import TextInputRow from './TextInputRow';

// --------------------------------------------------
// EditBankAccountScreen
// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: EditBankAccountScreen.js';
/* eslint-enable */

class EditBankAccountScreen extends Component {
  constructor(props) {
    super(props);

    const myUser = this.props.myUser;
    
    let actionCode = '';
    if (this.props.navigation) {
      const params = this.props.navigation.state.params;
      actionCode = params.actionCode;
    }

    this.state = {
      otpNumber: '',
      otpNumberConfirm: actionCode,
      accountNumber: myUser.accountNumber || '',
      bankName: myUser.bankName || '',
      branchName: myUser.branchName || '',
    };
  }
  componentDidMount() {
    this.loadBanks();
  }
  componentDidUpdate(prevProps) {
    this.handleImportantUpdateProfileResponse(prevProps);
  }
  // --------------------------------------------------
  onUpdatePress = () => {
    // 1. check inputs
    if (!this.checkInputsValid()) {
      return;
    }
    // 2. otp
    if (!this.checkOtpMatched()) {
      return;
    }
    // 2. update
    const userInfo = {
      bankNumber: this.state.accountNumber,
      bankName: this.state.bankName,
      bankBranch: this.state.branchName,
    };
    this.props.importantUpdateProfile(this.state.otpNumberConfirm, userInfo);
  }
  onBankPress = () => {
    this.showBankPicker();
  }
  onBranchPress = () => {
    this.showBranchPicker();
  }
  // --------------------------------------------------
  loadBanks() {
    this.props.getBanks();
  }
  loadBankBranches() {
    this.props.getBankBranches(this.state.bankName);
  }
  checkInputsValid() {
    const accountNumber = this.state.accountNumber ? this.state.accountNumber : '';
    if (accountNumber.length === 0) {
      this.showAlert('Vui lòng nhập số tài khoản');
      return false;
    }
    const bankName = this.state.bankName ? this.state.bankName : '';
    if (bankName.length === 0) {
      this.showAlert('Vui lòng nhập tên ngân hàng');
      return false;
    }
    const branchName = this.state.branchName ? this.state.branchName : '';
    if (branchName.length === 0) {
      this.showAlert('Vui lòng nhập tên chi nhánh');
      return false;
    }
    return true;
  }
  checkOtpMatched() {
    const otpNumber = this.state.otpNumber ? this.state.otpNumber.trim() : '';
    if (otpNumber.length === 0) {
      this.showAlert('Vui lòng nhập mã OTP');
      return false;
    }
    if (otpNumber !== this.state.otpNumberConfirm) {
      this.showAlert('Mã OTP không hợp lệ');
      return false;
    }
    return true;
  }
  showBankPicker() {
    Picker.init({
      pickerData: this.props.getBanksResponse.data,
      selectedValue: [0],
      pickerTitleText: 'Ngân hàng',
      pickerConfirmBtnText: 'Chọn',
      pickerCancelBtnText: 'Đóng',
      onPickerConfirm: data => {
        setTimeout(() => {
          const text = data.length > 0 ? data[0] : '';
          this.setState({ bankName: text });
          this.loadBankBranches();
        }, 500);
      },
    });
    Picker.show();
  }
  showBranchPicker() {
    Picker.init({
      pickerData: this.props.getBankBranchesResponse.data,
      selectedValue: [0],
      pickerTitleText: 'Chi nhánh',
      pickerConfirmBtnText: 'Chọn',
      pickerCancelBtnText: 'Đóng',
      onPickerConfirm: data => {
        setTimeout(() => {
          const text = data.length > 0 ? data[0] : '';
          this.setState({ branchName: text });
        }, 500);
      },
    });
    Picker.show();
  }
  handleImportantUpdateProfileResponse(prevProps) {
    const status = this.props.importantUpdateProfileResponse.status;
    const prevStatus = prevProps.importantUpdateProfileResponse.status;
    if (status === true && status !== prevStatus) {
      setTimeout(() => {
        Alert.alert(
          Strings.alert_title,
          Strings.update_bank_info_success,
          [{ 
            text: 'Đóng', 
            onPress: () => this.props.navigation.goBack(),
          }],
          { cancelable: false },
        );
      }, 250);
    }
    else if (status === false && status !== prevStatus) {
      setTimeout(() => {
        const message = this.props.importantUpdateProfileResponse.message;
        this.showAlert(message);
      }, 250);
    }
  }
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{ text: 'Đóng' }],
      { cancelable: false },
    );
  }
  // --------------------------------------------------
  renderOtpNumber() {
    const otpNumber = this.state.otpNumber;
    return (
      <TextInputRow
        title="Mã OTP"
        inputText={otpNumber}
        inputTextEditable
        isSeperatorHidden={false}
        onInputChangeText={(text) => {
          this.setState({ otpNumber: text });
        }}
      />
    );
  }
  renderAccountNumber() {
    const accountNumber = this.state.accountNumber;
    return (
      <TextInputRow
        title="Số tài khoản ngân hàng"
        inputText={accountNumber}
        inputTextEditable
        isSeperatorHidden={false}
        onInputChangeText={(text) => {
          this.setState({ accountNumber: text });
        }}
      />
    );
  }
  renderBankName() {
    return (
      <KJTouchableOpacity
        onPress={this.onBankPress}
        activeOpacity={0.65}
      >
        <TextInputRow
          title="Ngân hàng"
          inputText={this.state.bankName}
          inputTextEditable={false}
          isSeperatorHidden={false}
        />
      </KJTouchableOpacity>
    );
  }
  renderBranchName() {
    return (
      <KJTouchableOpacity
        onPress={this.onBranchPress}
        activeOpacity={0.65}
      >
        <TextInputRow
          title="Chi nhánh"
          inputText={this.state.branchName}
          inputTextEditable={false}
          isSeperatorHidden={false}
        />
      </KJTouchableOpacity>
    );
  }
  renderUpdateButton() {
    return (
      <TextButton
        style={styles.updateButton}
        title={'Cập nhật'}
        titleStyle={styles.updateButtonTitle}
        isArrowHidden
        onPress={this.onUpdatePress}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const isSpinnerVisible = 
      this.props.isGetBanksProcessing || 
      this.props.isGetBankBranchesProcessing;
    return (
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
        {
          this.renderOtpNumber()
        }
        {
          this.renderAccountNumber()
        }
          <View style={{ height: 0 }} />
          {
            this.renderBankName()
          }
          <View style={{ height: 0 }} />
          {
            this.renderBranchName()
          }
        </View>
        {
          this.renderUpdateButton()
        }
        <Spinner
          visible={isSpinnerVisible}
          textContent={'Đang tải...'}
          textStyle={{ marginTop: 4, color: '#FFF' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

EditBankAccountScreen.navigationOptions = () => ({
  title: 'Cập nhật số tài khoản',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

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
  importantUpdateProfile: (actionCode, userInfo) => dispatch(importantUpdateProfile(actionCode, userInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBankAccountScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  inputsContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  accountNumberInput: {
    flex: 0,
    height: 44,
  },
  bankNameInput: {
    flex: 0,
  },
  branchNameInput: {
    flex: 0,
  },
  updateButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 44,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: '#2696E0',
    borderRadius: 4.0,
  },
  updateButtonTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
