import _ from 'lodash';
import { AppInfoDefault } from '../constants/configs';

import { PRODUCT_KEY } from '../screenV3/Home/CustomerFormContainer/CustomerFormContainerEnums';

class PartnerItem {
  id = '';
  formTitleHTML = '';
  label = '';
  description = '';
  imageUrl = '';
  documentUrl = '';
  extraData = {};
  listRouting = [];
  isSelected = false;
  discount = '';
  title = '';
  value = '';
  telco = [];
  amount = [];
  items = [];
  secondButtonURL = '';

  static objectFormJSON(json) {
    const partnerItem = new PartnerItem();
    partnerItem.id = json.id;
    partnerItem.formTitleHTML = json.formTitleHTML;
    partnerItem.title = json.title;
    partnerItem.label = json.label;
    partnerItem.description = json.description;
    partnerItem.imageUrl = json.imageUrl;
    partnerItem.documentUrl = json.documentUrl;
    partnerItem.extraData = json.extraData;
    partnerItem.discount = json.discount;
    partnerItem.listRouting = json.listRouting;
    partnerItem.title = json.title;
    partnerItem.value = json.value;
    partnerItem.telco = json.telco;
    partnerItem.amount = json.amount;
    partnerItem.mainButtonURL = json.mainButtonURL;
    partnerItem.listInsuranceType = json.listInsuranceType;
    partnerItem.items = json.items;
    partnerItem.secondButtonURL = json.secondButtonURL;
    partnerItem.disable = json.disable;
    return partnerItem;
  }

  getSelectedRoutingItem = () => {
    for (let i = 0; i < this.listRouting.length; i += 1) {
      const item = this.listRouting[i];
      if (item.isSelected) {
        return item;
      }
    }
    return {};
  };
}

class CustomerFormPartner {
  selectedIndex = -1;
  items = [];

  static objectFromJSON(json) {
    const customFormPartner = new CustomerFormPartner();
    customFormPartner.selectedIndex = json.listPartner.selectedIndex;
    customFormPartner.items = json.listPartner.items.map((item) => {
      return PartnerItem.objectFormJSON(item);
    });
    return customFormPartner;
  }
}

class CustomerFormItem {
  formKey = '';
  formTitleHTML = '';
  footerTitleHTML = '';
  mainButtonURL = '';
  secondButtonURL = '';
  maxCanPurchase = -1;
  listPartner = {};
  // listRole - Example data: [{name: 'PreDSA', value: '2222'}, {name: 'DSA', value: 1111}]
  listRole = [];
  policyDefaultHtml = '';
  policyDetailsUrl = '';

  static objectFromJSON(json, policyDetailsUrl, policyDefaultHtml) {
    const customerFormItem = new CustomerFormItem();
    customerFormItem.formKey = json.formKey;
    customerFormItem.formTitleHTML = json.formTitleHTML;
    customerFormItem.title = json.title;
    customerFormItem.footerTitleHTML = json.footerTitleHTML;
    customerFormItem.mainButtonURL = json.mainButtonURL;
    customerFormItem.secondButtonURL = json.secondButtonURL;
    customerFormItem.maxCanPurchase = json.maxCanPurchase;
    customerFormItem.listRole = json.listRole;
    customerFormItem.policyDefaultHtml = json.policyDefaultHtml || policyDefaultHtml;
    customerFormItem.policyDetailsUrl =
      json.policyDetailsUrl || policyDetailsUrl || AppInfoDefault?.privacyPolicyURL;
    customerFormItem.listPartner = CustomerFormPartner.objectFromJSON(json);
    customerFormItem.disable = json.disable;
    return customerFormItem;
  }

  getSelectedPartnerItem = () => {
    const { selectedIndex, items } = this.listPartner;
    return items[selectedIndex];
  };
}

export default class CustomerForm {
  selectedIndex;
  formItems = [];
  policyDefaultHtml = '';

  static objectFormJSON(json) {
    const customerForm = new CustomerForm();
    customerForm.selectedIndex = json.selectedIndex;
    customerForm.policyDefaultHtml = json.policyDefaultHtml;
    customerForm.policyDetailsUrl = json.policyDetailsUrl;
    customerForm.formItems = json.formItems.map((itemJSON) => {
      if (itemJSON.formKey === PRODUCT_KEY.mobileCardAndTopup)
        return {
          ...itemJSON,
          mobileCard: itemJSON?.listPartner?.items?.mobileCard,
          topup: itemJSON?.listPartner?.items?.topup,
        };
      return CustomerFormItem.objectFromJSON(
        itemJSON,
        json.policyDetailsUrl,
        json.policyDefaultHtml,
      );
    });
    customerForm.disable = json.disable;
    return customerForm;
  }

  getFormItemByKey = (key) => {
    for (let i = 0; i < this.formItems.length; i += 1) {
      const formItem = this.formItems[i];
      if (_.isEqual(key, formItem.formKey)) {
        return formItem;
      }
    }
    return {};
  };
}
