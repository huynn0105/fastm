import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Keyboard, Platform } from 'react-native';
import HTML from 'react-native-render-html';
import isEmpty from 'lodash/isEmpty';
import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import LinkButton from '../LinkButton';
import { CircleImageButton } from '../CircleImageButton';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { CustomTextField } from '../CustomTextField';
import { FormPolicy } from './FormPolicy';
import GroupCheckBox from '../GroupCheckBox';
import LocalStorageUtil from '../../utils/LocalStorageUtil';
import SwitchKeyboardSupport from './SwitchKeyboardSupport';

import PickerSelector from '../../componentV3/PickerSelector';
import WrapperCustomTextField from '../../componentV3/WrapperCustomTextField';
import AppText from '../../componentV3/AppText';

const SELECTED_ROLE_INDEX_KEY = 'SELECTED_ROLE_INDEX_KEY';


const GENDER_LIST = [
  {
    label: 'Nam',
    key: 'Nam',
    isSelected: false,
    value: 'M',
  },
  {
    label: 'Nữ',
    key: 'Nu',
    isSelected: false,
    value: 'F',
  },
];

class FinancialCustomerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyboardType: 'numeric',

      districtTextInputValue: '',
      showDropDownSearchResults: false,

      showErrorFullNameTextInput: false,
      showErrorCitizenIDTextInput: false,
      showErrorPhoneNumberTextInput: false,
      showErrorDistrictTextInput: false,
      selectedRoleIndex: 0,

      isFullNameEmpty: true,
      isCitizenIDEmpty: true,
      isPhoneNumberEmpty: true,
      selectedGenderIndex: 0,
    
      isVisiblePicker: false,
    };
    this.selectedGender = GENDER_LIST[0];
    this.fullNameTextInputValue = '';
    this.citizenIDTextInputValue = '';
    this.phoneNumberTextInputValue = '';
    this.districtTextInputValue = '';
    this.selectedRole = {};
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
    this.loadSelectedRole();
  }

  async saveSelectedRole(selectedRoleIndex) {
    try {
      await LocalStorageUtil.saveDataAsyncStorage(
        selectedRoleIndex.toString(),
        SELECTED_ROLE_INDEX_KEY,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
    }
  }

  loadSelectedRole = async () => {
    // try {
    //   let selectedRoleIndex =
    //     (await LocalStorageUtil.retrieveDataAsyncStorage(SELECTED_ROLE_INDEX_KEY)) || 0;
    //   if (selectedRoleIndex > this.props.listRole.length - 1) {
    //     selectedRoleIndex = 0;
    //   }
    //   this.setState({
    //     selectedRoleIndex: parseInt(selectedRoleIndex, 2) || 0,
    //   });
    //   this.selectedRole = parseInt(selectedRoleIndex, 2) || 0;
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.log('FinancialCustomerForm -> asyncloadSelectedRole -> error', error.message);
    // }
  };

  onSelectedGender = (index) => {
    this.selectedGender = GENDER_LIST[index];
    this.setState({
      selectedGenderIndex: index,
    });
  };

  onSwitchKeyboardPress = () => {
    this.setState({ keyboardType: this.state.keyboardType === 'numeric' ? 'default' : 'numeric' });
  };
  onChangeFullNameText = (text) => {
    this.fullNameTextInputValue = text;
    this.setState({
      showErrorFullNameTextInput: false,
      isFullNameEmpty: isEmpty(text),
    });
  };
  onChangeCitizenIdText = (text) => {
    this.citizenIDTextInputValue = text;
    this.setState({
      showErrorCitizenIDTextInput: false,
      isCitizenIDEmpty: isEmpty(text),
    });
  };
  onChangePhoneNumberText = (text) => {
    this.phoneNumberTextInputValue = text;
    this.setState({
      showErrorPhoneNumberTextInput: false,
      isPhoneNumberEmpty: isEmpty(text),
    });
  };

  onFinancialPartnerItemPress = (item, index) => {
    this.props.onPartnerItemPress(item, index);
  };
  onSelectedRole = (index) => {
    // this.selectedRole = this.props.listRole[index];
    // this.setState(
    //   {
    //     selectedRoleIndex: index,
    //   },
    //   () => {
    //     this.saveSelectedRole(index);
    //   },
    // );
  };

  onSecondButtonPress = () => {
    const { listRole } = this.props;
    const url = listRole[this.state.selectedRoleIndex].dashboard_url;
    const title = listRole[this.state.selectedRoleIndex].dashboard_title;
    this.props.navigation.navigate('WebView', { mode: 0, url, title });
  };

  getFullNameTextInputValue = () => {
    const value = this.fullNameTextInputValue;
    return value;
  };
  getCitizenIDTextInputValue = () => {
    const value = this.citizenIDTextInputValue;
    return value;
  };
  getPhoneNumberTextInputValue = () => {
    const value = this.phoneNumberTextInputValue;
    return value;
  };
  getDistrictTextInputValue = () => {
    const { districtTextInputValue } = this.state;
    return districtTextInputValue;
  };
  getSelectedRole = () => {
    return this.selectedRole;
  };

  getSelectedGender = () => {
    return this.selectedGender;
  };

  showErrorFullNameTextInput = (isShown, message) => {
    this.setState({
      showErrorFullNameTextInput: isShown,
      errorFullNameTextInputMessage: message,
    });
  };
  showErrorCitizenIDTextInput = (isShown, message) => {
    this.setState({
      showErrorCitizenIDTextInput: isShown,
      errorCitizenIDTextInputMessage: message,
    });
  };
  showErrorPhoneNumberTextInput = (isShown, message) => {
    this.setState({
      showErrorPhoneNumberTextInput: isShown,
      errorPhoneNumberTextInputMessage: message,
    });
  };
  showErrorDistrictTextInput = (isShown) => {
    this.setState({
      showErrorDistrictTextInput: isShown,
    });
  };

  blurAllTextInput = () => {
    this.fullNameTextInputRef.blur();
    this.citizenIDTextInputRef.blur();
    this.phoneNumberTextInputRef.blur();
    if(this.districtTextInputRef) {
      this.districtTextInputRef.blur();
    }
  };

  validateFormPolicy = () => {
    return this.formPolicyRef.validateFormPolicy();
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  onPressPreSelectDistrict = () => {
    // const { onPreFocusDistrictTextInput } = this.props;
    // if (onPreFocusDistrictTextInput) {
    //   onPreFocusDistrictTextInput();
    // }
    // this.setState({ showDropDownSearchResults: true });
    // setTimeout(() => {
    //   if(this.districtTextInputRef) {
    //     this.districtTextInputRef.focus();
    //   }
    // }, 350);
  }

  onPressSelectDistrict = () => {
    if(this.phoneNumberTextInputRef) {
      this.phoneNumberTextInputRef.blur();
    }
    if(this.fullNameTextInputRef) {
      this.fullNameTextInputRef.blur();
    }
    if(this.citizenIDTextInputRef) {
      this.citizenIDTextInputRef.blur();
    }
    setTimeout(() => {
      this.setState({ isVisiblePicker: true });
    }, 500);
  };

  onPressItemDistrict = (item) => {
    this.setState({
      districtTextInputValue: item.value,
      showDropDownSearchResults: false,
      showErrorDistrictTextInput: false,
      isVisiblePicker: false
    });
			console.log("TCL: FinancialCustomerForm -> onPressItemDistrict -> this.districtTextInputRef", this.districtTextInputRef)

    if(this.districtTextInputRef) {
      this.districtTextInputRef.setValue(item.value)
    }
    Keyboard.dismiss();
  }

  onClosePicker = () => {
    this.setState({ isVisiblePicker: false });
  }

  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------

  renderGender = () => {
    const { selectedGenderIndex } = this.state;
    return (
      <View style={{ flex: 1, marginLeft: 16 }}>
        <GroupCheckBox
          containerStyle={{ marginBottom: 10 }}
          checkBoxItems={GENDER_LIST}
          selectedIndex={selectedGenderIndex}
          onPress={this.onSelectedGender}
        />
      </View>
    );
  };

  renderFormTitle = () => {
    const { formTitle } = this.props;
    return (
      <View
        style={{
          marginTop: -2,
          marginBottom: 16,
        }}
      >
        <HTML
          html={formTitle}
          onLinkPress={(obj, href) => {
            this.navigateToWebView({ mode: 0, title: 'Tìm hiểu thêm', url: href });
          }}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
        />
      </View>
    );
  };
  renderFullNameTextInput = () => {
    const { isFullNameEmpty, showErrorFullNameTextInput, errorFullNameTextInputMessage } = this.state;
    const { onFocusFullNameTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => this.fullNameTextInputRef = ref}
        baseColor={!isFullNameEmpty && !showErrorFullNameTextInput ? 'rgba(36, 37, 61, 0.5)' : null}
        autoCapitalize={'words'}
        containerStyle={{ flex: 1, marginTop: -12 }}
        textFieldLabel={'Nhập họ và tên KH'}
        showError={showErrorFullNameTextInput}
        errorMessage={errorFullNameTextInputMessage}
        onChangeTextFieldText={this.onChangeFullNameText}
        onTextFieldFocus={onFocusFullNameTextInput}
      />
    );
  };
  renderCitizenIdTextInput = () => {
    const {
      keyboardType,
      isCitizenIDEmpty,
      showErrorCitizenIDTextInput,
      errorCitizenIDTextInputMessage,
    } = this.state;
    const { onFocusCitizenIdTextInput } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <CustomTextField
          textFieldRef={(ref) => {
            this.citizenIDTextInputRef = ref;
          }}
          baseColor={!isCitizenIDEmpty && !showErrorCitizenIDTextInput ? 'rgba(36, 37, 61, 0.5)' : null}
          keyboardType={keyboardType}
          containerStyle={{ flex: 1 }}
          textFieldLabel={'CMND / CCCD'}
          showError={showErrorCitizenIDTextInput}
          errorMessage={errorCitizenIDTextInputMessage}
          onChangeTextFieldText={this.onChangeCitizenIdText}
          onTextFieldFocus={onFocusCitizenIdTextInput}
          rightComponent={() => (
            <View style={{ position: 'absolute', right: -4, bottom: 12 }}>
            <SwitchKeyboardSupport
              keyboardType={keyboardType}
              onSwitchCallback={this.onSwitchKeyboardPress}
            />
          </View>
          )}
        />
      </View>
    );
  };
  renderPhoneNumberTextInput = () => {
    const { isPhoneNumberEmpty, showErrorPhoneNumberTextInput, errorPhoneNumberTextInputMessage } = this.state;
    const { onFocusPhoneNumberTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.phoneNumberTextInputRef = ref;
        }}
        baseColor={!isPhoneNumberEmpty && !showErrorPhoneNumberTextInput ? 'rgba(36, 37, 61, 0.5)' : null}
        containerStyle={{ flex: 1, marginLeft: 11 }}
        textFieldLabel={'Số điện thoại'}
        showError={showErrorPhoneNumberTextInput}
        errorMessage={errorPhoneNumberTextInputMessage}
        keyboardType={'phone-pad'}
        onChangeTextFieldText={this.onChangePhoneNumberText}
        onTextFieldFocus={onFocusPhoneNumberTextInput}
      />
    );
  };
  
  renderDistrictTextInput = () => {
    const {
      showDropDownSearchResults,
      districtTextInputValue,
      showErrorDistrictTextInput,
    } = this.state;
    const textFieldLabel = 'Huyện/Tỉnh (Quận/TP)';
    const leftIconSearch = require('./img/ic_search.png');
    const textFieldMessage = showDropDownSearchResults
      ? ''
      : 'Nhập kí tự tìm kiếm và chọn từ danh sách hiện ra\n(vd: Q. 3 - Ho Chi Minh hoặc H. Dong Anh - Ha Noi)';

    return (
      <View>
        <WrapperCustomTextField
          ref={(ref) => {
            this.districtTextInputRef = ref;
          }}
          fontSize={12}
          labelFontSize={12}
          textFieldValue={districtTextInputValue}
          textFieldLabel={textFieldLabel}
          leftIcon={leftIconSearch}
          containerStyle={{ marginVertical: 10 }}
          showError={showErrorDistrictTextInput}
          errorMessage={textFieldMessage}
          onPress={this.onPressSelectDistrict}
        />
      </View>
    );
  };
  // -------- Buttons --------
  renderLinkButton = (onSecondButtonPress) => (
    <LinkButton
      text={'Quản lý'}
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      onPress={onSecondButtonPress}
    />
  );
  renderSubmitButton = (onMainButtonPress) => (
    <CustomButton
      sizeType={BUTTON_SIZE.REGULAR}
      title={'Tạo khách hàng'}
      rightIcon={require('./img/ic_arrow_point_to_right.png')}
      onPress={onMainButtonPress}
    />
  );
  renderDescriptionText = () => {
    const { formFooterDescription } = this.props;
    return (
      <View>
        <HTML html={formFooterDescription} />
      </View>
    );
  };
  renderFinancialCompanyItem = ({ item, index }) => (
    <CircleImageButton
      style={{ marginRight: 16 }}
      borderWidth={0.5}
      borderColor={index % 2 === 0 ? Colors.primary1 : Colors.primary2}
      imageSize={46}
      imageSource={{ uri: item.imageUrl }}
      // label={item.label}
      textStyle={{ marginTop: 7, opacity: 0.6, ...TextStyles.normalTitle }}
      onPress={() => {
        this.onFinancialPartnerItemPress(item, index);
      }}
    />
  );
  renderListFinancialCompany = (partnerDataSource) => (
    <FlatList
      style={{ marginTop: -6 }}
      data={partnerDataSource}
      renderItem={this.renderFinancialCompanyItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );

  renderListPartner = (partnerDataSource) => (
    <View style={{ marginTop: -4 }}>
      {this.renderDescriptionText()}
      {this.renderListFinancialCompany(partnerDataSource)}
    </View>
  );

  renderRolePicker = () => {
    const { listRole } = this.props;
    const items = listRole.map((role) => ({ ...role, label: role.name, isSelected: false }));
    if (items.length > 0) {
      if (!this.selectedRole.value) this.selectedRole = items[this.state.selectedRoleIndex];
    }

    if (items.length === 1) return null;

    return (
      <View style={{ marginTop: 16 }}>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6 }}>
          {'Lên hồ sơ bằng nghiệp vụ'}
        </AppText>
        <GroupCheckBox
          containerStyle={{ marginTop: 8 }}
          checkBoxItems={items}
          selectedIndex={this.state.selectedRoleIndex}
          onPress={this.onSelectedRole}
        />
      </View>
    );
  };

  render() {
    const {
      status,
      onMainButtonPress,
      policyDefaultHtml,
      navigation,
      policyDetailsUrl,
      partnerDataSource,
      termsOfUsageUrl,
      districts
    } = this.props;
    const { isVisiblePicker } = this.state;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;
    // const partnerDataSource = listRole && listRole.length > 0 ? listRole[this.state.selectedRoleIndex].listPartner : [];
    // const url = listRole && listRole.length > 0 ? listRole[this.state.selectedRoleIndex].dashboard_url : '';
    return (
      <View style={[styles.container, containerStyle]}>
        {/* {this.renderRolePicker()} */}
        <View style={{ height: 8, backgroundColor: '#fff0' }} />
        {this.renderListPartner(partnerDataSource)}
        {this.renderFormTitle()}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {this.renderFullNameTextInput()}
          {this.renderGender()}
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {this.renderCitizenIdTextInput()}
          {this.renderPhoneNumberTextInput()}
        </View>
        {this.renderDistrictTextInput()}
        {policyDefaultHtml && (
          <FormPolicy
            navigation={navigation}
            containerStyle={{ marginTop: 10 }}
            formPolicyRef={(ref) => {
              this.formPolicyRef = ref;
            }}
            termsOfUsageUrl={termsOfUsageUrl}
            onSelectPolicyCheckBox={(isSelected) => {}}
            policyHTMLContent={policyDefaultHtml}
            policyURL={policyDetailsUrl}
          />
        )}
        <View style={styles.buttonContainer}>
          {/* {url ? this.renderLinkButton(this.onSecondButtonPress) : null} */}
          {this.renderSubmitButton(onMainButtonPress)}
        </View>
        <PickerSelector
          title={'Huyện / Tỉnh'}
          data={districts}
          onPressItem={this.onPressItemDistrict}
          onCloseModal={this.onClosePicker}
          isVisible={isVisiblePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    borderRadius: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
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
  label: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  dropDownContainer: {},
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

export default FinancialCustomerForm;
