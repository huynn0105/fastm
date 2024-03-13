import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getBanks,
  getBankBranches,
  importantUpdateProfile,
} from '../../redux/actions';

import Styles from '../../constants/styles';
import TextButton from '../../common/buttons/TextButton';
import TextInputRow from './TextInputRow';
import AutoCompleteTextInputRow from './AutoCompleteTextInputRow';

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
      isBankNameEditing: false,
      isBranchNameEditing: false,
      isBankNameHidden: false,
      isBranchNameHidden: false,
      isUpdateButtonHidden: false,
    };
  }
  componentDidMount() {
    this.loadBanks();
  }
  // --------------------------------------------------
  onBankNameInputChangeText = (text) => {
    this.setState({ 
      bankName: text.toUpperCase(),
      isBankNameEditing: true,
      isBranchNameHidden: true,
      isUpdateButtonHidden: true,
    });
  }
  onBankNameInputSubmitEdditing = () => {
    // Utils.log(`${LOG_TAG} onBankNameInputSubmitEdditing: `);
    this.setState({
      isBankNameEditing: false,
      isBranchNameHidden: false,
      isUpdateButtonHidden: false,
    }, () => {
      this.loadBankBranches();
    });
  }
  onBankItemPress = (item) => {
    // Utils.log(`${LOG_TAG} onBankItemPress: `, item);
    this.setState({ 
      bankName: item,
      branchName: '',
      isBankNameEditing: false,
      isBranchNameHidden: false,
      isUpdateButtonHidden: false,
    }, () => {
      this.loadBankBranches();
    });
  }
  // --------------------------------------------------
  onBranchNameInputChangeText = (text) => {
    this.setState({ 
      branchName: text.toUpperCase(),
      isBranchNameEditing: true,
      isUpdateButtonHidden: true,
    });
  }
  onBranchNameInputSubmitEdditing = () => {
    // Utils.log(`${LOG_TAG} onBranchNameInputSubmitEdditing: `);
    this.setState({
      isBranchNameEditing: false,
      isUpdateButtonHidden: false,
    });
  }
  onBranchItemPress = (item) => {
    // Utils.log(`${LOG_TAG} onBranchItemPress: `, item);
    this.setState({ 
      branchName: item,
      isBranchNameEditing: false,
      isUpdateButtonHidden: false,
    });
  }
  // --------------------------------------------------
  onUpdatePress = () => {
    // 1. check branch name inside all banks
    // 2. check branch name inside all branches
    // 2. update
  }
  // --------------------------------------------------
  loadBanks() {
    this.props.getBanks();
  }
  loadBankBranches() {
    this.props.getBankBranches(this.state.bankName);
  }
  filterBanksList(query) {
    if (query.length === 0) { return []; }
    if (!this.state.isBankNameEditing) { return []; }
    const banks = this.props.getBanksResponse.data || [];
    const regex = new RegExp(`${query.trim()}`, 'i');
    return banks.filter(item => item.search(regex) >= 0);
  }
  filterBrankBranchesList(query) {
    if (query.length === 0) { return []; }
    if (!this.state.isBranchNameEditing) { return []; }
    const branches = this.props.getBankBranchesResponse.data || [];
    const regex = new RegExp(`${query.trim()}`, 'i');
    return branches.filter(item => item.search(regex) >= 0);
  }
  compareName = (name1, name2) => {
    return name1.toLowerCase().trim() === name2.toLowerCase().trim();
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
    const query = this.state.bankName;
    const banks = this.filterBanksList(query);
    const data = (banks.length === 1 && this.compareName(query, banks[0])) ? [] : banks;
    return (
      <AutoCompleteTextInputRow
        containerStyle={styles.bankNameInput}
        title="Ngân hàng"
        data={data}
        defaultValue={query}
        onInputChangeText={this.onBankNameInputChangeText}
        onInputSubmitEditing={this.onBankNameInputSubmitEdditing}
        onItemPress={this.onBankItemPress}
      />
    );
  }
  renderBranchName() {
    const query = this.state.branchName;
    const branches = this.filterBrankBranchesList(query);
    const data = (branches.length === 1 && this.compareName(query, branches[0])) ? [] : branches;
    return (
      <AutoCompleteTextInputRow
        containerStyle={styles.branchNameInput}
        title="Chi nhánh ngân hàng"
        data={data}
        defaultValue={query}
        onInputChangeText={this.onBranchNameInputChangeText}
        onInputSubmitEditing={this.onBranchNameInputSubmitEdditing}
        onItemPress={this.onBranchItemPress}
      />
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
    return (
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
        {this.renderOtpNumber()}
        {this.renderAccountNumber()}
          <View style={{ height: 0 }} />
          {
            this.state.isBankNameHidden ? null : 
            this.renderBankName()
          }
          <View style={{ height: 0 }} />
          {
            this.state.isBranchNameHidden ? null :
            this.renderBranchName()
          }
        </View>
        {
          this.state.isUpdateButtonHidden ? null :
          this.renderUpdateButton()
        }
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
});

const mapDispatchToProps = (dispatch) => ({
  getBanks: () => dispatch(getBanks()),
  getBankBranches: (bankName) => dispatch(getBankBranches(bankName)),
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

// const TEST_BANKS = [
//   "ABBANK",
//   "ABB",
//   "ACB",
//   "AGRIBANK",
//   "ANZ",
//   "BAN VIET",
//   "BANGKOK ",
//   "BANK OF CHINA",
//   "BANK OF TOKYO - MITSUBISHI",
//   "BANKCOMM",
//   "BAOVIET ",
//   "BIDC ",
//   "BIDV",
//   "BNP PARIBAS ",
//   "CHINA CONSTRUCTION",
//   "CITIBANK",
//   "COMMONWEALTH BANK OF AUSTRALIA",
//   "CREDIT AGRICOLE CIB ",
//   "CSXH ",
//   "CTBC ",
// ];

// const TEST_BRANCHES = [
//   "ACB AN GIANG",
//   "ACB BAC NINH",
//   "ACB BINH DINH",
//   "ACB BINH DUONG",
//   "ACB BINH PHUOC",
//   "ACB CA MAU",
//   "ACB CAN THO",
//   "ACB CHO LON",
//   "ACB DA NANG",
//   "ACB DAC LAK",
//   "ACB DONG NAI",
//   "ACB DONG THAP",
//   "ACB DUYEN HAI",
//   "ACB GIA LAI",
//   "ACB HA NOI (HN)",
//   "ACB HAI DUONG",
//   "ACB HAI PHONG",
//   "ACB HO CHI MINH (HCM)",
//   "ACB HOI AN",
//   "ACB HUE",
//   "ACB HUNG YEN",
//   "ACB KHAI NGUYEN",
//   "ACB KHANH HOA",
//   "ACB KIEN GIANG",
//   "ACB LONG AN",
//   "ACB LONG HOA",
//   "ACB NGHE AN",
//   "ACB PHAN RANG",
//   "ACB PHAN THIET",
//   "ACB QUANG NINH",
//   "ACB SAI GON",
//   "ACB TAY NINH",
//   "ACB THANG LONG",
//   "ACB THANH HOA",
//   "ACB THUY NGUYEN",
//   "ACB TIEN GIANG",
//   "ACB VINH LONG",
//   "ACB VINH PHUC",
//   "ACB VUNG TAU"
// ];