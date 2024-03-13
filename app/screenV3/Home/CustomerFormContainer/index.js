import _ from 'lodash';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, Alert } from 'react-native';
import React, { PureComponent } from 'react';

import { ListProductItem } from '../../../components2/ListProductItem';
import FinancialCustomerForm from '../../../components2/Forms/FinancialCustomerForm';
import TextStyles from '../../../theme/TextStyle';

import InsuranceCustomerForm, {
  INSURANCE_FORM_MODE,
} from '../../../components2/Forms/InsuranceCustomerForm';
import DigitalWalletCustomerForm from '../../../components2/Forms/DigitalWalletCustomerForm';
import MobileCardForm from '../../../components2/Forms/MobileCardForm';
import { STATUS } from '../../../components2/ListProductItem/ProductItem';
import { isFullNameValid, isCitizenIDValid, isPhoneNumberValid } from '../../../utils/Utils';
import { TopUpForm } from '../../../components2/Forms/TopUpForm';
import {
  findDistrictsByText,
  updateMobileCardCustomerForm,
} from '../../../redux/actions/customerForm';
import {
  PRODUCT_KEY,
  PRODUCT_ITEM_DATA,
  SAVE_SELECTED_PRODUCT_ITEM_KEY,
  SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM,
} from './CustomerFormContainerEnums';
import { fetchMobileCardPaymentURLData } from '../../../redux/actions/mobileCardPayment';
import { fetchGlobalCareURLData } from '../../../redux/actions/globalCare';
import LocalStorageUtil from '../../../utils/LocalStorageUtil';
import { fetchTopUpPaymentURLData, fetchTopupStatus } from '../../../redux/actions/topUpPayment';
import DigitelClient from '../../../network/DigitelClient';
import { showInfoAlert } from '../../../utils/UIUtils';
import { logEvent } from '../../../tracking/Firebase';
import SolarForm from '../../../components2/Forms/SolarForm';
import MakeMoneyForm from '../../../components2/Forms/MakeMoneyForm';
import MobileCardAndTopupForm from '../../../components2/Forms/MobileCardFormAndTopupForm';
import StatisticForm from '../../../components2/Forms/StatisticForm';
import AppText from '../../../componentV3/AppText';

import { SCREEN_WIDTH } from '../../../utils/Utils';
import Colors from '../../../theme/Color';

// Component's dimensions
const CONTAINER_WIDTH = SCREEN_WIDTH / 3.5;
export const CONTAINER_HEIGHT = SCREEN_WIDTH / 5.06;

import { triggerLoading } from '../../../redux/actions/loading';

const SELECTED_FORM_KEY_STATE_ENUM = {
  INIT_STATE: 'INIT_STATE',
  EMPTY_STATE: 'EMPTY_STATE',
};

const ERROR_MESSAGE_ENUM = {
  FULL_NAME_INVALID: 'Họ và tên không hợp lệ',
  FULL_NAME_EMPTY: 'Vui lòng nhập họ tên',
  PHONE_NUMBER_INVALID: 'SĐT không hợp lệ',
  PHONE_NUMBER_EMPTY: 'Nhập SĐT',
  CITIZEN_ID_INVALID: 'CMND/ CCCD không hợp lệ',
  CITIZEN_ID_EMPTY: 'Nhập CMND/ CCCD',
};

class CustomerFormContainer extends PureComponent {
  static getDerivedStateFromProps(nextProps, state) {
    if (_.isEmpty(nextProps.customerFormData) || _.isEmpty(nextProps.customerFormData.formItems)) {
      return null;
    }
    if (state.selectedFormKey === SELECTED_FORM_KEY_STATE_ENUM.INIT_STATE) {
      const { customerFormData } = nextProps;
      return {
        selectedFormKey:
          customerFormData.selectedIndex >= 0
            ? customerFormData.formItems[customerFormData.selectedIndex].formKey
            : 'none',
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedFormKey: SELECTED_FORM_KEY_STATE_ENUM.INIT_STATE,
      selectedCarrierIndex: undefined,
      bshListSearchResultItem: [],
    };
    // Insurance
    this.bshSeri = '';
    this.onChangeDistrictInputTextDelayed = _.debounce(this.onChangeDistrictInputText, 500);
    this.listProductItemRef = undefined;

    this.onBSHSerialNumberInputChangeTextDelayed = _.debounce(
      this.onBSHSerialNumberInputChangeText,
      500,
    );
  }

  componentDidMount() {
    this.loadSelectedFormKeyFromLocalStorage();
    this.loadSelectedCarrierIndexFromLocalStorage();
    this.props.fetchTopUpStatus();
  }

  initListProductItemByFormKey = (customerFormData, selectedFormKey) => {
    let newList = customerFormData.formItems.map((item) => {
      return {
        ...item,
        ...PRODUCT_ITEM_DATA[item.formKey],
        // status: customerFormData.selectedIndex === index ? STATUS.selected : STATUS.none,
        status: selectedFormKey === item.formKey ? STATUS.selected : STATUS.none,
      };
    });
    const selectedItemList = newList.filter((item) => item.status === STATUS.selected);
    if (selectedItemList.length === 0) {
      newList = newList.map((item) => ({ ...item, status: STATUS.highlighted }));
    }
    // newList = newList.concat([
    //   {
    //     formKey: PRODUCT_KEY.mobileCardAndTopup,
    //     ...PRODUCT_ITEM_DATA[PRODUCT_KEY.mobileCardAndTopup],
    //   },
    //   {
    //     formKey: PRODUCT_KEY.statistic,
    //     ...PRODUCT_ITEM_DATA[PRODUCT_KEY.statistic],
    //   }
    // ])
    // hide form insurance
    // newList = newList.filter((item) => item.formKey !== PRODUCT_KEY.insurance);
    return newList;
  };

  setSelectedFormKey = (selectedFormKey) => {
    if (selectedFormKey !== null) {
      this.setState(
        {
          selectedFormKey,
        },
        () => {
          if (this.listProductItemRef !== null && this.listProductItemRef !== undefined) {
            this.listProductItemRef.scrollToSelectedItem();
          }
        },
      );
    }
  };
  setSelectedCarrierIndex = (selectedCarrierIndex) => {
    if (selectedCarrierIndex !== null) {
      this.setState(
        {
          selectedCarrierIndex: parseInt(selectedCarrierIndex, 0),
        },
        () => {
          if (this.mobileCardFormRef !== null && this.mobileCardFormRef !== undefined) {
            this.mobileCardFormRef.scrollToSelectedCarrierCheckBoxItemIndex(
              this.state.selectedCarrierIndex,
            );
          }
        },
      );
    }
  };

  loadSelectedFormKeyFromLocalStorage = async () => {
    try {
      const responseValue = await LocalStorageUtil.retrieveDataAsyncStorage(
        SAVE_SELECTED_PRODUCT_ITEM_KEY,
      );
      this.setSelectedFormKey(responseValue);
    } catch (error) {
      // console.log('loadSelectedFormKeyFromLocalStorage failed: ', error.message);
    }
  };
  loadSelectedCarrierIndexFromLocalStorage = async () => {
    try {
      const responseValue = await LocalStorageUtil.retrieveDataAsyncStorage(
        SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM,
      );
      this.setSelectedCarrierIndex(responseValue);
    } catch (error) {
      // console.log('loadSelectedCarrierIndexFromLocalStorage failed: ', error.message);
    }
  };

  getContainerStatus(isSelected) {
    if (isSelected) {
      return 1;
    }
    return 0;
  }

  setListProductItemRef = (ref) => {
    this.listProductItemRef = ref;
  };

  isMyUserValid() {
    const { myUser } = this.props;
    return !_.isEmpty(myUser) && !_.isEmpty(myUser.accessToken);
  }

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  navigateToLogin = () => {
    this.props.navigation.navigate('LoginModal');
  };

  isHavingCustomerFormData(customerFormData) {
    return !_.isEmpty(customerFormData) && !_.isEmpty(customerFormData.formItems);
  }

  saveSelectedFormKeyToLocalStorage = async (selectedFormKey) => {
    try {
      await LocalStorageUtil.saveDataAsyncStorage(selectedFormKey, SAVE_SELECTED_PRODUCT_ITEM_KEY);
    } catch (error) {
      //
    }
  };

  // Event

  onProductItemPress = (index, item) => {
    const { selectedFormKey } = this.state;
    if (item.formKey === 'topup') {
      this.props.fetchTopUpStatus();
    }
    this.setState(
      {
        selectedFormKey:
          selectedFormKey !== item.formKey
            ? item.formKey
            : SELECTED_FORM_KEY_STATE_ENUM.EMPTY_STATE,
      },
      () => {
        this.saveSelectedFormKeyToLocalStorage(this.state.selectedFormKey);
      },
    );
  };
  onDigitalWalletFormMainButtonPress = () => {
    const { digitalWalletCustomerForm, myUser } = this.props;
    const { mainButtonURL } = digitalWalletCustomerForm;

    // const fullName = this.digitalWalletFormRef.getFullNameTextInputValue();
    const phoneNumber = this.digitalWalletFormRef.getPhoneNumberTextInputValue();

    const isFormFieldValuesValid = () =>
      // isFullNameValid(fullName) &&
      isPhoneNumberValid(phoneNumber) && this.digitalWalletFormRef.validateFormPolicy();

    if (!isFormFieldValuesValid()) {
      this.digitalWalletFormRef.validateFormPolicy();
      // this.digitalWalletFormRef.showErrorFullNameTextInput(
      //   !isFullNameValid(fullName),
      //   _.isEmpty(fullName)
      //     ? ERROR_MESSAGE_ENUM.FULL_NAME_EMPTY
      //     : ERROR_MESSAGE_ENUM.FULL_NAME_INVALID,
      // );
      this.digitalWalletFormRef.showErrorPhoneNumberTextInput(
        !isPhoneNumberValid(phoneNumber),
        _.isEmpty(phoneNumber)
          ? 'Vui lòng nhập đúng số điện thoại'
          : ERROR_MESSAGE_ENUM.PHONE_NUMBER_INVALID,
      );
      return;
    }

    if (this.isMyUserValid(myUser)) {
      this.navigateToWebView({
        mode: 0,
        title: 'Tài chính',
        url: mainButtonURL,
        passParams: {
          // name_smart: fullName,
          phone: phoneNumber,
        },
      });
    } else {
      this.navigateToLogin();
    }
  };
  onDigitalWalletFormSecondButtonPress = () => {
    const { digitalWalletCustomerForm } = this.props;
    const title = 'Ví điện tử';
    const url = digitalWalletCustomerForm.secondButtonURL;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onGlobalCareMainButtonPress = () => {
    const { myUser } = this.props;
    const { accessToken } = myUser;
    const fullName = this.insuranceCustomerFormRef.getFullNameTextInputValue();
    const phoneNumber = this.insuranceCustomerFormRef.getPhoneNumberTextInputValue();
    const citizenID = this.insuranceCustomerFormRef.getCitizenIDTextInputValue();

    const isFormFieldValuesValid = () =>
      isFullNameValid(fullName) &&
      isCitizenIDValid(citizenID) &&
      isPhoneNumberValid(phoneNumber) &&
      this.insuranceCustomerFormRef.validateFormPolicy();

    if (!isFormFieldValuesValid()) {
      this.insuranceCustomerFormRef.validateFormPolicy();
      this.insuranceCustomerFormRef.showErrorFullNameTextInput(
        !isFullNameValid(fullName),
        _.isEmpty(fullName)
          ? ERROR_MESSAGE_ENUM.FULL_NAME_EMPTY
          : ERROR_MESSAGE_ENUM.FULL_NAME_INVALID,
      );
      this.insuranceCustomerFormRef.showErrorCitizenIDTextInput(
        !isCitizenIDValid(citizenID),
        _.isEmpty(citizenID)
          ? ERROR_MESSAGE_ENUM.CITIZEN_ID_EMPTY
          : ERROR_MESSAGE_ENUM.CITIZEN_ID_INVALID,
      );
      this.insuranceCustomerFormRef.showErrorPhoneNumberTextInput(
        !isPhoneNumberValid(phoneNumber),
        _.isEmpty(phoneNumber)
          ? ERROR_MESSAGE_ENUM.PHONE_NUMBER_EMPTY
          : ERROR_MESSAGE_ENUM.PHONE_NUMBER_INVALID,
      );
      return;
    }

    if (this.isMyUserValid(myUser)) {
      this.props.fetchGlobalCareURLData(
        { accessToken, fullName, citizenID, phoneNumber },
        (url) => {
          if (_.isEmpty(url)) {
            return;
          }
          this.navigateToWebView({
            mode: 0,
            title: 'Bảo hiểm',
            url,
          });
        },
      );
    } else {
      this.navigateToLogin();
    }
  };
  // onGlobalCareSecondButtonPress = () => {
  //   const { insuranceCustomerForm } = this.props;
  //   const title = 'Global Care';
  //   const url = insuranceCustomerForm.secondButtonURL;
  //   this.navigateToWebView({ mode: 0, title, url });
  // };
  onFinancialFormMainButtonPress = () => {
    const { financialCustomerForm, districtsObject } = this.props;
    const { mainButtonURL } = financialCustomerForm;

    this.financialCustomerFormRef.blurAllTextInput();

    const fullName = this.financialCustomerFormRef.getFullNameTextInputValue();
    const citizenID = this.financialCustomerFormRef.getCitizenIDTextInputValue();
    const phoneNumber = this.financialCustomerFormRef.getPhoneNumberTextInputValue();
    const districtInputValue = this.financialCustomerFormRef.getDistrictTextInputValue();
    const selectedRole = this.financialCustomerFormRef.getSelectedRole();
    const selectedGender = this.financialCustomerFormRef.getSelectedGender();

    const selectedDistrict = this.getArrDistrictSelector(districtsObject).find((district) =>
      _.isEqual(district.value, districtInputValue),
    );

    const isFormFieldValuesValid = () =>
      isFullNameValid(fullName) &&
      isCitizenIDValid(citizenID) &&
      isPhoneNumberValid(phoneNumber) &&
      selectedDistrict &&
      this.financialCustomerFormRef.validateFormPolicy();

    if (!isFormFieldValuesValid()) {
      this.financialCustomerFormRef.validateFormPolicy();
      this.financialCustomerFormRef.showErrorFullNameTextInput(
        !isFullNameValid(fullName),
        _.isEmpty(fullName)
          ? ERROR_MESSAGE_ENUM.FULL_NAME_EMPTY
          : ERROR_MESSAGE_ENUM.FULL_NAME_INVALID,
      );
      this.financialCustomerFormRef.showErrorCitizenIDTextInput(
        !isCitizenIDValid(citizenID),
        _.isEmpty(citizenID)
          ? ERROR_MESSAGE_ENUM.CITIZEN_ID_EMPTY
          : ERROR_MESSAGE_ENUM.CITIZEN_ID_INVALID,
      );
      this.financialCustomerFormRef.showErrorPhoneNumberTextInput(
        !isPhoneNumberValid(phoneNumber),
        _.isEmpty(phoneNumber)
          ? ERROR_MESSAGE_ENUM.PHONE_NUMBER_EMPTY
          : ERROR_MESSAGE_ENUM.PHONE_NUMBER_INVALID,
      );
      this.financialCustomerFormRef.showErrorDistrictTextInput(!selectedDistrict);
      return;
    }

    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Tài chính',
      url: mainButtonURL,
      passParams: {
        fullName,
        idNumber: citizenID,
        mobilePhone: phoneNumber,
        districtID: selectedDistrict.id,
        districtText: selectedDistrict.value,
        subscriptionID: selectedRole.value,
        accept_term: 1,
        gender: selectedGender.value || 'M',
      },
    });
  };
  onFinancialFormSecondButtonPress = () => {
    // this.props.navigation.navigate('Customer');
    const { financialCustomerForm } = this.props;
    const title = 'Tài chính';
    const url = financialCustomerForm.secondButtonURL;
    this.navigateToWebView({ mode: 0, title, url });
  };
  onFinancialFormPartnerItemPress = (item, index) => {
    const { listPartner } = this.props.financialCustomerForm;
    const { documentUrl } = listPartner.items[index];
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: '',
      url: documentUrl,
    });
  };
  onChangeDistrictInputText = (textSearch) => {
    const { districtsObject } = this.props;
    this.props.findDistrictsByText(districtsObject, textSearch);
  };
  onMobileCardFormMainButtonPress = ({
    isEmailCheckBoxSelected,
    numberPickerValue,
    selectedTelephoneCard,
  }) => {
    logEvent('press_onMobileCardFormMainButtonPress');
    const { mobileCardCustomerForm, myUser } = this.props;
    const selectedCarrier = mobileCardCustomerForm.getSelectedPartnerItem();
    if (this.isMyUserValid(myUser)) {
      const paramObject = {
        amount: selectedTelephoneCard.price,
        quantity: numberPickerValue,
        telco: selectedCarrier.extraData.telcoAlias,
        accessToken: myUser.accessToken,
      };
      if (isEmailCheckBoxSelected) {
        paramObject.email = 1;
      }
      this.props.fetchMobileCardPaymentURLData(paramObject, (paymentURLObject) => {
        this.navigateToWebView({
          mode: 0,
          title: 'Mã thẻ ĐT',
          url: paymentURLObject.redirect,
        });
      });
    } else {
      this.navigateToLogin();
    }
  };
  onMobileCardFormSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const { mobileCardCustomerForm } = this.props;
    const title = 'Mã thẻ ĐT';
    const url = mobileCardCustomerForm.secondButtonURL;
    this.navigateToWebView({ mode: 0, title, url });
  };
  onMobileCardSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const { mobileCardCustomerForm } = this.props;
    const title = 'Mã thẻ ĐT';
    const url = mobileCardCustomerForm.secondButtonURL;
    this.navigateToWebView({ mode: 0, title, url });
  };
  onMobileCardCarrierCheckBoxItemPress = (index) => {
    this.setState({ selectedCarrierIndex: index });
  };
  onMobileCardEmailTextInputChangeText = (text) => {
    this.mobileCardFormEmailInput = text;
  };
  onMobileCardUpdateEmailPress = () => {
    this.props.navigation.navigate('EditProfile');
  };
  onTopUpMainButtonPress = ({ selectedTopUpPlanID, selectedCarrier, selectedAmount, phone }) => {
    logEvent('press_onTopUpMainButtonPresss');
    const { myUser } = this.props;
    if (this.isMyUserValid(myUser)) {
      this.props.fetchTopUpPaymentURLData(
        {
          type: selectedTopUpPlanID,
          telco: selectedCarrier.value,
          amount: selectedAmount.ori_price,
          phone,
          accessToken: myUser.accessToken,
        },
        (data) => {
          if (!_.isEmpty(data.url)) {
            this.navigateToWebView({
              mode: 0,
              title: 'Nạp tiền ĐT',
              url: data.url,
            });
          } else {
            showInfoAlert(data.message);
          }
        },
      );
    } else {
      this.navigateToLogin();
    }
  };
  onTopUpSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const { topUpCustomerForm } = this.props;
    const title = 'Nạp tiền ĐT';
    const url = topUpCustomerForm.secondButtonURL;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onBSHSerialNumberInputChangeText = (text) => {
    DigitelClient.searchBSHTicketBySerialNumber(text, (results) => {
      this.setState({
        bshListSearchResultItem: results,
      });
    });
  };

  /*
    Hander MobileCard and Topup form
  */
  mOnTopUpSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const title = 'Nạp tiền ĐT';
    const { mobileCardAndTopupForm } = this.props;
    const { topup } = mobileCardAndTopupForm;
    const url = topup?.secondButtonURL;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };

  mOnTopUpMainButtonPress = ({ selectedCarrier, selectedAmount, phone }) => {
    logEvent('press_onTopUpMainButtonPresss');
    const { myUser } = this.props;
    if (this.isMyUserValid(myUser)) {
      this.props.fetchTopUpPaymentURLData(
        {
          type: 'prepaid',
          telco: selectedCarrier.value,
          amount: selectedAmount.ori_price,
          phone,
          accessToken: myUser.accessToken,
        },
        (data) => {
          if (!_.isEmpty(data.url)) {
            this.navigateToWebView({
              mode: 0,
              title: 'Nạp tiền ĐT',
              url: data.url,
            });
          } else {
            showInfoAlert(data.message);
          }
        },
      );
    } else {
      this.navigateToLogin();
    }
  };

  mOnMobileCardFormMainButtonPress = ({
    isEmailCheckBoxSelected,
    numberPickerValue,
    selectedTelephoneCard,
    telcoAlias,
  }) => {
    logEvent('press_onMobileCardFormMainButtonPress');
    const { myUser } = this.props;
    if (this.isMyUserValid(myUser)) {
      const paramObject = {
        amount: selectedTelephoneCard.price,
        quantity: numberPickerValue,
        telco: telcoAlias,
        accessToken: myUser.accessToken,
      };
      if (isEmailCheckBoxSelected) {
        paramObject.email = 1;
      }
      this.props.fetchMobileCardPaymentURLData(paramObject, (paymentURLObject) => {
        this.navigateToWebView({
          mode: 0,
          title: 'Mã thẻ ĐT',
          url: paymentURLObject.redirect,
        });
      });
    } else {
      this.navigateToLogin();
    }
  };
  mOnMobileCardFormSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const { mobileCardAndTopupForm } = this.props;
    const { mobileCard } = mobileCardAndTopupForm;
    const title = 'Mã thẻ ĐT';
    const url = mobileCard?.secondButtonURL;
    this.navigateToWebView({ mode: 0, title, url });
  };

  // Render

  renderDigitalWalletCustomerForm = (isSelected) => {
    const { digitalWalletCustomerForm, navigation, myUser } = this.props;
    if (_.isEmpty(digitalWalletCustomerForm)) {
      return null;
    }
    if (!this.digitalWalletFormRef && !isSelected) return null;

    const {
      formTitleHTML,
      footerTitleHTML,
      listPartner,
      policyDefaultHtml,
      policyDetailsUrl,
    } = digitalWalletCustomerForm;
    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <DigitalWalletCustomerForm
        onRef={(ref) => {
          this.digitalWalletFormRef = ref;
        }}
        navigation={navigation}
        status={containerStatus}
        data={digitalWalletCustomerForm}
        formTitle={formTitleHTML}
        policyDefaultHtml={policyDefaultHtml}
        policyDetailsUrl={policyDetailsUrl}
        formFooterDescription={footerTitleHTML}
        partnerDataSource={listPartner}
        onPartnerItemPress={() => {}}
        onMainButtonPress={this.onDigitalWalletFormMainButtonPress}
        onSecondButtonPress={this.onDigitalWalletFormSecondButtonPress}
        onRestrictPress={this.props.onRestrictPress}
        myUser={myUser}
      />
    );
  };
  renderInsuranceCustomerForm = (isSelected) => {
    const { bshListSearchResultItem } = this.state;
    const { insuranceCustomerForm, customerFormData, navigation, myUser, appInfo } = this.props;
    if (_.isEmpty(insuranceCustomerForm)) {
      return null;
    }
    if (!this.insuranceCustomerFormRef && !isSelected) return null;

    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <InsuranceCustomerForm
        onRef={(ref) => {
          this.insuranceCustomerFormRef = ref;
        }}
        navigation={navigation}
        status={containerStatus}
        data={insuranceCustomerForm}
        bshListSearchResult={bshListSearchResultItem}
        policyHTMLContent={customerFormData.policyDefaultHtml}
        policyDetailsUrl={customerFormData.policyDetailsUrl}
        initialFormMode={INSURANCE_FORM_MODE.GLOBAL_CARE}
        onGlobalCareMainButtonPress={this.onGlobalCareMainButtonPress}
        // onGlobalCareSecondButtonPress={this.onGlobalCareSecondButtonPress}
        onBSHSeriInputChangeText={this.onBSHSerialNumberInputChangeTextDelayed}
        onGlobalCareFormTitleLinkPress={(href) => {
          this.navigateToWebView({ mode: 0, url: href, title: 'Global Care' });
        }}
        insuranceCommonUrl={appInfo?.insuranceCommonUrl}
        onRestrictPress={this.props.onRestrictPress}
        myUser={myUser}
      />
    );
  };
  renderFinancialCustomerForm = (isSelected) => {
    const {
      financialCustomerForm,
      customerFormFoundDistricts,
      navigation,
      appInfo,
      onPreFocusDistrictTextInput,
      districtsObject,
    } = this.props;
    if (_.isEmpty(financialCustomerForm)) {
      return null;
    }
    if (!this.financialCustomerFormRef && !isSelected) return null;

    const {
      formTitleHTML,
      footerTitleHTML,
      listPartner,
      listRole,
      policyDefaultHtml,
      policyDetailsUrl,
    } = financialCustomerForm;
    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <FinancialCustomerForm
        onRef={(ref) => {
          this.financialCustomerFormRef = ref;
        }}
        districts={this.getArrDistrictSelector(districtsObject)}
        onPreFocusDistrictTextInput={onPreFocusDistrictTextInput}
        termsOfUsageUrl={appInfo?.termsOfUsageUrl}
        navigation={navigation}
        status={containerStatus}
        formTitle={formTitleHTML}
        formFooterDescription={footerTitleHTML}
        partnerDataSource={listPartner.items || []}
        listRole={listRole}
        policyDefaultHtml={policyDefaultHtml}
        policyDetailsUrl={policyDetailsUrl}
        onPartnerItemPress={this.onFinancialFormPartnerItemPress}
        onMainButtonPress={this.onFinancialFormMainButtonPress}
        // onSecondButtonPress={this.onFinancialFormSecondButtonPress}
        onChangeDistrictTextInputText={this.onChangeDistrictInputTextDelayed}
      />
    );
  };
  renderMobileCardForm = (isSelected) => {
    const { selectedCarrierIndex } = this.state;
    const {
      mobileCardCustomerForm,
      myUser,
      fetchingMobileCardPaymentURLData,
      navigation,
      topupStatus,
    } = this.props;

    if (_.isEmpty(mobileCardCustomerForm)) return null;
    if (!this.mobileCardFormRef && !isSelected) return null;

    const { email } = myUser;
    const { formTitleHTML, maxCanPurchase, listPartner } = mobileCardCustomerForm;
    listPartner.selectedIndex =
      selectedCarrierIndex === undefined ? listPartner.selectedIndex : selectedCarrierIndex;
    const selectedCarrier = listPartner.items[listPartner.selectedIndex];
    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <MobileCardForm
        onRef={(ref) => {
          this.mobileCardFormRef = ref;
        }}
        navigation={navigation}
        status={containerStatus}
        showLoading={fetchingMobileCardPaymentURLData}
        selectedCarrier={selectedCarrier}
        email={email}
        formTitle={formTitleHTML}
        numberPickerMax={maxCanPurchase}
        listCarrier={listPartner}
        data={mobileCardCustomerForm}
        onMainButtonPress={this.onMobileCardFormMainButtonPress}
        onSecondButtonPress={this.onMobileCardSecondButtonPress}
        onCarrierCheckBoxItemPress={this.onMobileCardCarrierCheckBoxItemPress}
        onEmailTextInputChangeText={this.onMobileCardEmailTextInputChangeText}
        onUpdateEmailPress={this.onMobileCardUpdateEmailPress}
        maintenanceData={topupStatus}
      />
    );
  };
  renderTopUpForm = (isSelected) => {
    const { topUpCustomerForm, navigation, topupStatus } = this.props;

    if (_.isEmpty(topUpCustomerForm)) return null;
    if (!this.topUpFormRef && !isSelected) return null;

    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <TopUpForm
        onRef={(ref) => {
          this.topUpFormRef = ref;
        }}
        navigation={navigation}
        status={containerStatus}
        data={topUpCustomerForm}
        maintenanceData={topupStatus}
        onMainButtonPress={this.onTopUpMainButtonPress}
        onSecondButtonPress={this.onTopUpSecondButtonPress}
        showLoading={this.props.fetchingTopUpPaymentURLData}
      />
    );
  };

  onSolarFormMainButtonPress = () => {
    const { myUser } = this.props;
    if (!this.isMyUserValid(myUser)) {
      this.navigateToLogin();
      return;
    }

    const { dispatchTriggerLoading } = this.props;
    this.solarFormRef.blurAllTextInput();

    const fullName = this.solarFormRef.getFullNameTextInputValue();
    const citizenID = this.solarFormRef.getCitizenIDTextInputValue();
    const phoneNumber = this.solarFormRef.getPhoneNumberTextInputValue();

    const processValue = this.solarFormRef.getProcessInputValue();
    const provinceValue = this.solarFormRef.getProvinceInputValue();
    const districtValue = this.solarFormRef.getDistrictInputValue();
    const wardValue = this.solarFormRef.getWardInputValue();

    const noteValue = this.solarFormRef.getNoteInputValue();

    const isFormFieldValuesValid = () =>
      isFullNameValid(fullName) &&
      isCitizenIDValid(citizenID) &&
      isPhoneNumberValid(phoneNumber) &&
      !_.isEmpty(processValue) &&
      !_.isEmpty(provinceValue) &&
      !_.isEmpty(districtValue) &&
      !_.isEmpty(wardValue);

    if (!isFormFieldValuesValid()) {
      this.solarFormRef.showErrorFullNameTextInput(
        !isFullNameValid(fullName),
        _.isEmpty(fullName)
          ? ERROR_MESSAGE_ENUM.FULL_NAME_EMPTY
          : ERROR_MESSAGE_ENUM.FULL_NAME_INVALID,
      );
      this.solarFormRef.showErrorCitizenIDTextInput(
        !isCitizenIDValid(citizenID),
        _.isEmpty(citizenID)
          ? ERROR_MESSAGE_ENUM.CITIZEN_ID_EMPTY
          : ERROR_MESSAGE_ENUM.CITIZEN_ID_INVALID,
      );
      this.solarFormRef.showErrorPhoneNumberTextInput(
        !isPhoneNumberValid(phoneNumber),
        _.isEmpty(phoneNumber)
          ? ERROR_MESSAGE_ENUM.PHONE_NUMBER_EMPTY
          : ERROR_MESSAGE_ENUM.PHONE_NUMBER_INVALID,
      );

      this.solarFormRef.showErrorProcessTextInput(_.isEmpty(processValue));
      this.solarFormRef.showErrorProvinceTextInput(_.isEmpty(provinceValue));
      this.solarFormRef.showErrorDistrictTextInput(_.isEmpty(districtValue));
      this.solarFormRef.showErrorWardTextInput(_.isEmpty(wardValue));

      return;
    }
    dispatchTriggerLoading(true);
    DigitelClient.postSolarForm({
      fullName,
      idNumber: citizenID,
      mobilePhone: phoneNumber,
      processID: processValue.ID,
      provinceID: provinceValue.province_id,
      districtIDSolar: districtValue.district_id,
      wardID: wardValue.ward_id,
      processNote: noteValue || '',
    })
      .then((results) => {
        if (results.status) {
          dispatchTriggerLoading(false);
          this.solarFormRef.clearAllCurrentValue();
          setTimeout(() => {
            Alert.alert(
              'Thông báo',
              results.message || 'Thành công',
              [{ text: 'OK', onPress: () => {} }],
              { cancelable: false },
            );
          }, 250);
        } else {
          dispatchTriggerLoading(false);
          setTimeout(() => {
            Alert.alert(
              'Thông báo',
              results.message || 'Có lỗi xảy ra.',
              [{ text: 'OK', onPress: () => {} }],
              { cancelable: false },
            );
          }, 250);
        }
      })
      .catch(() => {})
      .finally(() => {
        dispatchTriggerLoading(false);
      });
  };

  onSolarSecondButtonPress = () => {
    if (!this.isMyUserValid()) {
      this.navigateToLogin();
      return;
    }
    const { solarCustomerForm = {} } = this.props;
    const url = solarCustomerForm.secondButtonURL;
    const title = 'Solar';
    this.props.navigation.navigate('WebView', { mode: 0, url, title });
  };

  renderSolarForm = (isSelected) => {
    const { navigation, solarCustomerForm } = this.props;
    const containerStatus = this.getContainerStatus(isSelected);
    if (_.isEmpty(solarCustomerForm)) return <View />;
    return (
      <SolarForm
        onRef={(ref) => {
          this.solarFormRef = ref;
        }}
        navigation={navigation}
        status={containerStatus}
        solarCustomerForm={solarCustomerForm}
        // onPartnerItemPress={this.onFinancialFormPartnerItemPress}
        onMainButtonPress={this.onSolarFormMainButtonPress}
        onSolarSecondButtonPress={this.onSolarSecondButtonPress}
      />
    );
  };

  onPressTopupFormMakeMoney = () => {
    const { customerFormData } = this.props;
    const { selectedFormKey } = this.state;
    const productItems = this.initListProductItemByFormKey(customerFormData, selectedFormKey);
    if (this.listProductItemRef) {
      const indexFormMobileCardAndTopup = productItems?.findIndex(
        (item) => item.formKey === PRODUCT_KEY.mobileCardAndTopup,
      );
      if (indexFormMobileCardAndTopup > -1) {
        this.listProductItemRef.onItemPress(indexFormMobileCardAndTopup, {
          formKey: PRODUCT_KEY.mobileCardAndTopup,
        });
        this.props.scrollToOffsetTopForm();
        setTimeout(() => {
          if (this.mobileCardAndTopupFormRef) {
            this.mobileCardAndTopupFormRef.onPressSelectedTopup();
          }
        }, 300);
        return;
      }

      const indexFormTopup = productItems?.findIndex((item) => item.formKey === PRODUCT_KEY.topUp);
      if (indexFormTopup > -1) {
        this.listProductItemRef.onItemPress(indexFormTopup, { formKey: PRODUCT_KEY.topUp });
        this.props.scrollToOffsetTopForm();
        setTimeout(() => {
          if (this.topUpFormRef) {
            this.topUpFormRef.onGroupCheckBoxItemPress(0);
          }
        }, 300);
        return;
      }
    }
  };

  onPressWallet = () => {
    this.props.onPressWalletFormMakeMoney();
  };

  getArrDistrictSelector = (districtsObject) => {
    const arr = [];
    Object.entries(districtsObject).forEach(([key, value]) => {
      arr.push({ id: key, value });
    });
    return arr;
  };

  renderMakeMoneyForm = (isSelected) => {
    const { makeMoneyCustomerForm, navigation } = this.props;
    if (!isSelected || !makeMoneyCustomerForm) return null;
    const { listPartner } = makeMoneyCustomerForm;
    return (
      <MakeMoneyForm
        data={listPartner?.items?.[0]?.items || []}
        navigation={navigation}
        onPressTopup={this.onPressTopupFormMakeMoney}
        onPressWallet={this.onPressWallet}
      />
    );
  };

  renderMobileCardAndTopupForm = (isSelected) => {
    const {
      mobileCardAndTopupForm,
      navigation,
      myUser,
      topupStatus,
      fetchingTopUpPaymentURLData,
      fetchingMobileCardPaymentURLData,
    } = this.props;
    if (_.isEmpty(mobileCardAndTopupForm)) return null;
    if (!this.mobileCardAndTopupFormRef && !isSelected) return null;
    const { email } = myUser;
    const { mobileCard, topup, selectedId } = mobileCardAndTopupForm;
    const containerStatus = this.getContainerStatus(isSelected);
    return (
      <View>
        <MobileCardAndTopupForm
          email={email}
          topup={topup}
          mobileCard={mobileCard}
          navigation={navigation}
          status={containerStatus}
          initSelectedId={selectedId}
          maintenanceData={topupStatus}
          numberPickerMax={mobileCard?.maxCanPurchase}
          onUpdateEmailPress={this.onMobileCardUpdateEmailPress}
          onMobileCardMainButtonPress={this.mOnMobileCardFormMainButtonPress}
          onMobileCardSecondButtonPress={this.mOnMobileCardFormSecondButtonPress}
          onTopupMainButtonPress={this.mOnTopUpMainButtonPress}
          onTopupSecondButtonPress={this.mOnTopUpSecondButtonPress}
          onRef={(ref) => {
            this.mobileCardAndTopupFormRef = ref;
          }}
          onCarrierCheckBoxItemPress={this.onMobileCardCarrierCheckBoxItemPress}
          onEmailTextInputChangeText={this.onMobileCardEmailTextInputChangeText}
          showLoading={fetchingTopUpPaymentURLData || fetchingMobileCardPaymentURLData}
        />
      </View>
    );
  };

  renderStatisticForm = (isSelected) => {
    if (!isSelected) return null;
    return <StatisticForm />;
  };

  renderForm = () => {
    const { selectedFormKey } = this.state;
    return (
      <View style={{ marginTop: -0.75, paddingHorizontal: 12, backgroundColor: Colors.neutral5 }}>
        {this.renderInsuranceCustomerForm(selectedFormKey === PRODUCT_KEY.insurance)}
        {this.renderFinancialCustomerForm(selectedFormKey === PRODUCT_KEY.financial)}
        {this.renderTopUpForm(selectedFormKey === PRODUCT_KEY.topUp)}
        {this.renderMobileCardForm(selectedFormKey === PRODUCT_KEY.mobileCard)}
        {this.renderDigitalWalletCustomerForm(selectedFormKey === PRODUCT_KEY.digitalWallet)}
        {this.renderSolarForm(selectedFormKey === PRODUCT_KEY.solar)}
        {this.renderMakeMoneyForm(selectedFormKey === PRODUCT_KEY.makeMoney)}
        {this.renderMobileCardAndTopupForm(selectedFormKey === PRODUCT_KEY.mobileCardAndTopup)}
        {this.renderStatisticForm(selectedFormKey === PRODUCT_KEY.statistic)}
      </View>
    );
  };
  renderTopTitle = () => (
    <AppText style={styles.topTitle}>{'Sản phẩm/ dịch vụ nổi bật trên MFast'}</AppText>
  );

  renderLoadingShopItem = () => (
    <View
      style={{
        height: CONTAINER_HEIGHT,
        width: CONTAINER_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ height: 12, width: CONTAINER_WIDTH - 20, backgroundColor: '#f2f2f2' }} />
      <View style={{ height: 10 }} />
      <View style={{ height: 30, width: CONTAINER_WIDTH - 20, backgroundColor: '#f2f2f2' }} />
    </View>
  );

  renderLoading = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
      }}
    >
      {this.renderLoadingShopItem()}
      {this.renderLoadingShopItem()}
      {this.renderLoadingShopItem()}
    </View>
  );

  renderListProductItem = () => {
    const { customerFormData } = this.props;
    const { selectedFormKey } = this.state;
    const productItems = this.initListProductItemByFormKey(customerFormData, selectedFormKey);
    if (_.isEmpty(productItems)) return <View />;
    return (
      <ListProductItem
        myRef={this.setListProductItemRef}
        dataSource={productItems}
        onItemPress={this.onProductItemPress}
      />
    );
  };
  renderCustomerFormContainer = (customerFormData) => (
    <View style={this.props.containerStyle}>
      {this.renderTopTitle()}
      {this.renderListProductItem(customerFormData)}
      {this.renderForm()}
    </View>
  );

  renderPenddingLoading = () => (
    <View style={this.props.containerStyle}>
      {this.renderTopTitle()}
      {this.renderLoading()}
    </View>
  );

  render() {
    const { customerFormData } = this.props;
    return this.isHavingCustomerFormData(customerFormData)
      ? this.renderCustomerFormContainer()
      : this.renderPenddingLoading();
  }
}

const styles = StyleSheet.create({
  topTitle: {
    padding: 16,
    paddingBottom: 12,
    paddingTop: 4,
    ...TextStyles.normalTitle,
    fontSize: 14,
    backgroundColor: '#0000',
    opacity: 0.8,
    color: '#24253d',
  },
  highlightText: {
    ...TextStyles.heading4,
    color: 'rgba(57, 184, 24, 1)',
    textDecorationLine: 'underline',
  },
  formTitle: {
    marginBottom: 20,
    paddingLeft: 28,
    paddingRight: 28,
    textAlign: 'center',
    
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.4,
    color: 'rgba(36, 37, 61, 0.6)',
  },
  formTitleHighlightedText: {
    ...TextStyles.normalTitle,
    fontWeight: 'bold',
  },
  formStatusNone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    opacity: 0,
    zIndex: -999,
  },
  formStatusSelected: {
    position: 'relative',
    opacity: 1,
    zIndex: 999,
  },
});

const mapDispatchToProps = (dispatch) => ({
  findDistrictsByText: (districtsObject, textSearch) =>
    dispatch(findDistrictsByText(districtsObject, textSearch)),
  fetchMobileCardPaymentURLData: (params, callback) =>
    dispatch(fetchMobileCardPaymentURLData(params, callback)),
  fetchGlobalCareURLData: (params, callback) => dispatch(fetchGlobalCareURLData(params, callback)),
  updateMobileCardCustomerForm: (mobileCardCustomerForm) =>
    dispatch(updateMobileCardCustomerForm(mobileCardCustomerForm)),
  fetchTopUpPaymentURLData: (params, callback) =>
    dispatch(fetchTopUpPaymentURLData(params, callback)),
  fetchTopUpStatus: () => dispatch(fetchTopupStatus()),
  dispatchTriggerLoading: (isLoading) => dispatch(triggerLoading(isLoading)),
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
  fetchingCustomerFormData: state.fetchingCustomerFormData,
  customerFormData: state.customerFormData,
  districtsObject: state.districtsObject,
  customerFormFoundDistricts: state.customerFormFoundDistricts,
  financialCustomerForm: state.financialCustomerForm,
  insuranceCustomerForm: state.insuranceCustomerForm,
  digitalWalletCustomerForm: state.digitalWalletCustomerForm,
  topUpCustomerForm: state.topUpCustomerForm,
  mobileCardCustomerForm: state.mobileCardCustomerForm,
  fetchingMobileCardPaymentURLData: state.fetchingMobileCardPaymentURLData,
  fetchingTopUpPaymentURLData: state.fetchingTopUpPaymentURLData,
  fetchingGlobalCareURLData: state.isFetchingGlobalCareURLData,
  topupStatus: state.topupStatus,
  solarCustomerForm: state.solarCustomerForm,
  makeMoneyCustomerForm: state.makeMoneyCustomerForm,
  mobileCardAndTopupForm: state.mobileCardAndTopupForm,
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFormContainer);
