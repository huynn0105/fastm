import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKeys } from '../../constants/keys';
import CustomerForm from '../../models/CustomerForm';
import DigitelClient from '../../network/DigitelClient';
import {
  CUSTOMER_FORMS,
  FETCHING_CUSTOMER_FORMS,
  CUSTOMER_FORMS_LIST_DISTRICT,
  FINANCIAL_CUSTOMER_FORM,
  DIGITAL_WALLET_CUSTOMER_FORM,
  INSURANCE_CUSTOMER_FORM,
  MOBILE_CARD_CUSTOMER_FORM,
  TOP_UP_CUSTOMER_FORM,
  MAKEMONEY_CUSTOMER_FORM,
  CUSTOMER_FORM_FIND_DISTRICTS_BY_TEXT,
  SOLAR_CUSTOMER_FORM,
  MOBILECARD_AND_TOPUP_FORM,
} from './types';
import { removeAccents } from '../../utils/Utils';
import { PRODUCT_KEY } from '../../screens2/Home/CustomerFormContainer/CustomerFormContainerEnums';

export function fetchingCustomerForms(isFetching) {
  return {
    type: FETCHING_CUSTOMER_FORMS,
    payload: isFetching,
  };
}

export function updateCustomerForms(customerForms) {
  return {
    type: CUSTOMER_FORMS,
    payload: customerForms,
  };
}

export function updateListDistrict(listDistrict) {
  return {
    type: CUSTOMER_FORMS_LIST_DISTRICT,
    payload: listDistrict,
  };
}

export function updateFinancialCustomerForm(financialCustomerForm) {
  return {
    type: FINANCIAL_CUSTOMER_FORM,
    payload: financialCustomerForm,
  };
}

export function updateDigitalWalletCustomerForm(digitalWalletCustomerForm) {
  return {
    type: DIGITAL_WALLET_CUSTOMER_FORM,
    payload: digitalWalletCustomerForm,
  };
}

export function updateInsuranceCustomerForm(insuranceCustomerForm) {
  return {
    type: INSURANCE_CUSTOMER_FORM,
    payload: insuranceCustomerForm,
  };
}

export function updateMobileCardCustomerForm(mobileCardCustomerForm) {
  return {
    type: MOBILE_CARD_CUSTOMER_FORM,
    payload: mobileCardCustomerForm,
  };
}

export function updateSolarCustomerForm(customerForm) {
  return {
    type: SOLAR_CUSTOMER_FORM,
    payload: customerForm,
  };
}

export function updateTopUpCustomerForm(topUpCustomerForm) {
  return {
    type: TOP_UP_CUSTOMER_FORM,
    payload: topUpCustomerForm,
  };
}

export function updateCustomerFormFindDistrictsByText(results) {
  return {
    type: CUSTOMER_FORM_FIND_DISTRICTS_BY_TEXT,
    payload: results,
  };
}

export function updateMakeMoneyCustomerForm(makeMoneyCustomerForm) {
  return {
    type: MAKEMONEY_CUSTOMER_FORM,
    payload: makeMoneyCustomerForm,
  };
}

export function updateMobileCardAndTopupForm(payload) {
  return {
    type: MOBILECARD_AND_TOPUP_FORM,
    payload,
  };
}

export function fetchCustomerForms() {
  const doneFetching = (dispatch, formData) => {
    if (!_.isEmpty(formData)) {
      dispatch(updateFinancialCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.financial)));
      dispatch(updateInsuranceCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.insurance)));
      dispatch(updateMobileCardCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.mobileCard)));
      dispatch(
        updateDigitalWalletCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.digitalWallet)),
      );
      dispatch(updateSolarCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.solar)));
      dispatch(updateTopUpCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.topUp)));
      dispatch(updateMakeMoneyCustomerForm(formData.getFormItemByKey(PRODUCT_KEY.makeMoney)));
      dispatch(
        updateMobileCardAndTopupForm(formData.getFormItemByKey(PRODUCT_KEY.mobileCardAndTopup)),
      );
    }
    dispatch(updateCustomerForms(formData));
    dispatch(fetchingCustomerForms(false));
  };

  return (dispatch) => {
    dispatch(fetchingCustomerForms(true));
    DigitelClient.mfGetCustomerForms()
      .then((formData) => {
        doneFetching(dispatch, formData);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
}

const syncDistrict = async (listDistrict) => {
  await AsyncStorage.setItem(AsyncStorageKeys.DISTRICT, JSON.stringify(listDistrict));
};

export const fetchListDistrict = () => {
  const doneFetching = (dispatch, listDistrict) => {
    dispatch(updateListDistrict(listDistrict));
  };

  return (dispatch) => {
    DigitelClient.mfGetListDistrict()
      .then((listDistrict) => {
        if (!_.isEmpty(listDistrict)) {
          syncDistrict(listDistrict);
        }
        doneFetching(dispatch, listDistrict);
      })
      .catch((error) => {
        doneFetching(dispatch, {});
      });
  };
};

export function findDistrictsByText(districtObjects, textSearch) {
  return (dispatch) => {
    if (!textSearch) dispatch(updateCustomerFormFindDistrictsByText([]));

    const normalizeText = (text) => removeAccents(text).toLocaleLowerCase();
    const matchedObject = ([key, name], search) =>
      normalizeText(name).includes(normalizeText(search)) ? [{ key, label: name }] : [];

    const results = Object.entries(districtObjects).reduce(
      (prevResult, value) => prevResult.concat(matchedObject(value, textSearch)),
      [],
    );

    dispatch(updateCustomerFormFindDistrictsByText(results));
  };
}
