import {
  FETCHING_CUSTOMER_FORMS,
  CUSTOMER_FORMS,
  CUSTOMER_FORMS_LIST_DISTRICT,
  FINANCIAL_CUSTOMER_FORM,
  DIGITAL_WALLET_CUSTOMER_FORM,
  INSURANCE_CUSTOMER_FORM,
  MOBILE_CARD_CUSTOMER_FORM,
  TOP_UP_CUSTOMER_FORM,
  MAKEMONEY_CUSTOMER_FORM,
  CUSTOMER_FORM_FIND_DISTRICTS_BY_TEXT,
  SOLAR_CUSTOMER_FORM,
  MOBILECARD_AND_TOPUP_FORM
} from '../actions/types';

// dummyData
import DUMMYDATA from './dummyMobileCardAndTopup';


export function fetchingCustomerFormData(state = false, action) {
  return action.type === FETCHING_CUSTOMER_FORMS ? action.payload : state;
}

export function customerFormData(state = {}, action) {
  return action.type === CUSTOMER_FORMS ? { ...action.payload } : state;
}

export function financialCustomerForm(state = {}, action) {
  return action.type === FINANCIAL_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function digitalWalletCustomerForm(state = {}, action) {
  return action.type === DIGITAL_WALLET_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function insuranceCustomerForm(state = {}, action) {
  return action.type === INSURANCE_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function mobileCardCustomerForm(state = {}, action) {
  return action.type === MOBILE_CARD_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function topUpCustomerForm(state = {}, action) {
  return action.type === TOP_UP_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function makeMoneyCustomerForm(state = {}, action) {
  return action.type === MAKEMONEY_CUSTOMER_FORM ? { ...action.payload } : state;
}

export function mobileCardAndTopupForm(state = {}, action) {
  return action.type === MOBILECARD_AND_TOPUP_FORM ? { ...action.payload } : state;
}

export function districtsObject(state = {}, action) {
  return action.type === CUSTOMER_FORMS_LIST_DISTRICT ? action.payload : state;
}

export function customerFormFoundDistricts(state = [], action) {
  return action.type === CUSTOMER_FORM_FIND_DISTRICTS_BY_TEXT ? action.payload : state;
}

export function solarCustomerForm(state = [], action) {
  return action.type === SOLAR_CUSTOMER_FORM ? action.payload : state;
}

