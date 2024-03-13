import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Keyboard } from 'react-native';
import DigitelClient from 'app/network/DigitelClient';
import { isEmpty } from 'lodash';
import HTML from 'react-native-render-html';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import { CustomTextField } from '../CustomTextField';
import LinkButton from '../LinkButton';
import ModalSelect from '../ModalSelect';

const KEY_PICKER = {
  STATUS_CLIENT: 'STATUS_CLIENT',
  PROVINCES: 'PROVINCES',
  DISTRICTS: 'DISTRICTS',
  WARDS: 'WARDS',
};

const TITLE_HEADER_PICKER = {
  STATUS_CLIENT: 'Chọn trạng thái KH',
  PROVINCES: 'Chọn tỉnh/ thành phố',
  DISTRICTS: 'Chọn quận/ huyện',
  WARDS: 'Chọn phường/ xã',
};

const PLACEHODER_PICKER = {
  STATUS_CLIENT: 'Tìm theo tên trạng thái KH',
  PROVINCES: 'Tìm theo tên tỉnh/ tp',
  DISTRICTS: 'Tìm theo tên quận/ huyện',
  WARDS: 'Tìm theo tên phường/ xã',
};

const FormWithTouch = (props) => (
  <View>
    <View>
      <CustomTextField
        labelFontSize={12}
        baseColor={
          // eslint-disable-next-line no-nested-ternary
          props.disabled
            ? 'rgba(36,37,61, 0.3)'
            : props.textFieldValue
            ? 'rgba(36,37,61, 0.6)'
            : null
        }
        {...props}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 10,
        }}
      >
        <Image
          style={{ width: 24, height: 24 }}
          source={
            props.disabled
              ? require('./img/icon_dropdown_disable.png')
              : require('./img/icon_dropdown.png')
          }
          resizeMode="cover"
        />
      </View>
    </View>
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        width: '100%',
        height: '180%',
        position: 'absolute',
        bottom: 8,
      }}
    />
  </View>
);

class SolarForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.keySelected = null;
    this.fullNameTextInputValue = '';
    this.citizenIDTextInputValue = '';
    this.phoneNumberTextInputValue = '';
    this.noteTextInputValue = '';

    this.state = {
      isVisible: false,
      provinceValue: null,
      processValue: null,
      districtValue: null,
      wardValue: null,
      provinces: [],
      process: [],
      wards: [],
      districts: [],

      showErrorFullNameTextInput: false,
      showErrorCitizenIDTextInput: false,
      showErrorPhoneNumberTextInput: false,

      showErrorProcessTextInput: false,
      showErrorProvinceTextInput: false,
      showErrorDistrictTextInput: false,
      showErrorWarnTextInput: false,

      isFullNameEmpty: true,
      isCitizenIDEmpty: true,
      isPhoneNumberEmpty: true,
      isNoteEmpty: true,
    };
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
    this.apiGetSolarProcess();
    this.apiGetSolarProvinces();
  }

  apiGetSolarProcess = () => {
    DigitelClient.getSolarProcess()
      .then((response) => {
        this.setState({
          process: response,
        });
      })
      .catch();
  };

  apiGetSolarProvinces = () => {
    DigitelClient.getSolarProvinces()
      .then((response) => {
        this.setState({
          provinces: response,
        });
      })
      .catch();
  };

  apiGetSolarDistricts = (provinceId) => {
    DigitelClient.getSolarDistricts(provinceId)
      .then((response) => {
        this.setState({
          districts: response,
        });
      })
      .catch();
  };

  apiGetSolarWards = (districtId) => {
    DigitelClient.getSolarWards(districtId)
      .then((response) => {
        this.setState({
          wards: response,
        });
      })
      .catch();
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

  onChangeNoteText = (text) => {
    this.noteTextInputValue = text;
    this.setState({
      isNoteEmpty: isEmpty(text),
    });
  };

  onSecondButtonPress = () => {
    if (this.props.onSolarSecondButtonPress) {
      this.props.onSolarSecondButtonPress();
    }
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

  getProcessInputValue = () => {
    const { processValue } = this.state;
    return processValue;
  };

  getProvinceInputValue = () => {
    const { provinceValue } = this.state;
    return provinceValue;
  };

  getDistrictInputValue = () => {
    const { districtValue } = this.state;
    return districtValue;
  };

  getWardInputValue = () => {
    const { wardValue } = this.state;
    return wardValue;
  };

  getNoteInputValue = () => {
    return this.noteTextInputValue;
  };

  getSelectedRole = () => {
    return this.selectedRole;
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

  showErrorProcessTextInput = (isShown) => {
    this.setState({
      showErrorProcessTextInput: isShown,
    });
  };

  showErrorProvinceTextInput = (isShown) => {
    this.setState({
      showErrorProvinceTextInput: isShown,
    });
  };

  showErrorDistrictTextInput = (isShown) => {
    this.setState({
      showErrorDistrictTextInput: isShown,
    });
  };

  showErrorWardTextInput = (isShown) => {
    this.setState({
      showErrorWarnTextInput: isShown,
    });
  };

  blurAllTextInput = () => {
    this.fullNameTextInputRef.blur();
    this.citizenIDTextInputRef.blur();
    this.phoneNumberTextInputRef.blur();
    this.noteTextInputRef.blur();
  };

  clearAllCurrentValue = () => {
    this.keySelected = null;
    this.fullNameTextInputValue = '';
    this.citizenIDTextInputValue = '';
    this.phoneNumberTextInputValue = '';
    this.noteTextInputValue = '';

    this.setState({
      isVisible: false,
      provinceValue: null,
      processValue: null,
      districtValue: null,
      wardValue: null,

      showErrorFullNameTextInput: false,
      showErrorCitizenIDTextInput: false,
      showErrorPhoneNumberTextInput: false,

      showErrorProcessTextInput: false,
      showErrorProvinceTextInput: false,
      showErrorDistrictTextInput: false,
      showErrorWarnTextInput: false,

      isFullNameEmpty: true,
      isCitizenIDEmpty: true,
      isPhoneNumberEmpty: true,
      isNoteEmpty: true,
    });

    this.fullNameTextInputRef.clear();
    this.citizenIDTextInputRef.clear();
    this.phoneNumberTextInputRef.clear();
    this.noteTextInputRef.clear();
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------

  renderFormTitle = () => {
    const { solarCustomerForm = {} } = this.props;
    return (
      <View
        style={{
          marginTop: -2,
          marginBottom: 12,
          alignItems: 'center',
        }}
      >
        <HTML
          html={solarCustomerForm.formTitleHTML}
          onLinkPress={(obj, href) => {
            this.navigateToWebView({ mode: 0, title: 'Tìm hiểu thêm', url: href });
          }}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
        />
      </View>
    );
  };

  renderFullNameTextInput = () => {
    const {
      isFullNameEmpty,
      showErrorFullNameTextInput,
      errorFullNameTextInputMessage,
    } = this.state;
    const { onFocusFullNameTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.fullNameTextInputRef = ref;
        }}
        labelFontSize={12}
        baseColor={!isFullNameEmpty && !showErrorFullNameTextInput ? 'rgba(36, 37, 61, 0.6)' : null}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Họ và tên *'}
        showError={showErrorFullNameTextInput}
        errorMessage={errorFullNameTextInputMessage}
        onChangeTextFieldText={this.onChangeFullNameText}
        onTextFieldFocus={onFocusFullNameTextInput}
      />
    );
  };

  renderCitizenIdTextInput = () => {
    const {
      isCitizenIDEmpty,
      showErrorCitizenIDTextInput,
      errorCitizenIDTextInputMessage,
    } = this.state;
    const { onFocusCitizenIdTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.citizenIDTextInputRef = ref;
        }}
        labelFontSize={12}
        baseColor={
          !isCitizenIDEmpty && !showErrorCitizenIDTextInput ? 'rgba(36, 37, 61, 0.6)' : null
        }
        containerStyle={{ flex: 1, marginRight: 11 }}
        textFieldLabel={'CMND / CCCD'}
        showError={showErrorCitizenIDTextInput}
        errorMessage={errorCitizenIDTextInputMessage}
        onChangeTextFieldText={this.onChangeCitizenIdText}
        onTextFieldFocus={onFocusCitizenIdTextInput}
      />
    );
  };
  renderPhoneNumberTextInput = () => {
    const {
      isPhoneNumberEmpty,
      showErrorPhoneNumberTextInput,
      errorPhoneNumberTextInputMessage,
    } = this.state;
    const { onFocusPhoneNumberTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.phoneNumberTextInputRef = ref;
        }}
        labelFontSize={12}
        baseColor={
          !isPhoneNumberEmpty && !showErrorPhoneNumberTextInput ? 'rgba(36, 37, 61, 0.6)' : null
        }
        containerStyle={{ flex: 1, marginLeft: 11 }}
        textFieldLabel={'Số điện thoại *'}
        showError={showErrorPhoneNumberTextInput}
        errorMessage={errorPhoneNumberTextInputMessage}
        keyboardType={'phone-pad'}
        onChangeTextFieldText={this.onChangePhoneNumberText}
        onTextFieldFocus={onFocusPhoneNumberTextInput}
      />
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

  onPressSetValueFormPicker = (keySelect) => () => {
    this.keySelected = keySelect;
    this.blurAllTextInput();
    Keyboard.dismiss();
    this.setState({ isVisible: true });
  };

  renderProcessClient = () => {
    const { processValue, showErrorProcessTextInput } = this.state;
    return (
      <FormWithTouch
        onPress={this.onPressSetValueFormPicker(KEY_PICKER.STATUS_CLIENT)}
        editable={false}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Chọn trạng thái KH *'}
        textFieldValue={processValue && processValue.processName ? processValue.processName : ''}
        showError={showErrorProcessTextInput}
        errorMessage={'Vui lòng chọn trạng thái KH'}
      />
    );
  };

  renderProvinces = () => {
    const { provinceValue, showErrorProvinceTextInput } = this.state;
    return (
      <FormWithTouch
        onPress={this.onPressSetValueFormPicker(KEY_PICKER.PROVINCES)}
        editable={false}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Chọn tỉnh/ thành phố *'}
        textFieldValue={
          provinceValue && provinceValue.province_name ? provinceValue.province_name : ''
        }
        showError={showErrorProvinceTextInput}
        errorMessage={'Vui lòng chọn tỉnh/ thành phố'}
      />
    );
  };

  renderDistricts = () => {
    const { provinceValue, districtValue, showErrorDistrictTextInput } = this.state;
    return (
      <FormWithTouch
        disabled={isEmpty(provinceValue) && isEmpty(districtValue)}
        onPress={this.onPressSetValueFormPicker(KEY_PICKER.DISTRICTS)}
        editable={false}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Chọn quận/ huyện *'}
        textFieldValue={
          districtValue && districtValue.district_name ? districtValue.district_name : ''
        }
        showError={showErrorDistrictTextInput}
        errorMessage={'Vui lòng chọn quận/ huyện'}
      />
    );
  };

  renderWards = () => {
    const { districtValue, wardValue, showErrorWarnTextInput } = this.state;
    return (
      <FormWithTouch
        disabled={isEmpty(wardValue) && isEmpty(districtValue)}
        onPress={this.onPressSetValueFormPicker(KEY_PICKER.WARDS)}
        editable={false}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Chọn phường/ xã *'}
        textFieldValue={wardValue && wardValue.ward_name ? wardValue.ward_name : ''}
        showError={showErrorWarnTextInput}
        errorMessage={'Vui lòng chọn phường/ xã'}
      />
    );
  };

  renderNoteInput = () => {
    const { isNoteEmpty } = this.state;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.noteTextInputRef = ref;
        }}
        labelFontSize={12}
        baseColor={!isNoteEmpty ? 'rgba(36, 37, 61, 0.6)' : null}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12 }}
        textFieldLabel={'Ghi chú (không bắt buộc)'}
        onChangeTextFieldText={this.onChangeNoteText}
      />
    );
  };

  getTittleHeader = () => {
    return TITLE_HEADER_PICKER[this.keySelected] || '';
  };

  getPlaceHolderTextInput = () => {
    return PLACEHODER_PICKER[this.keySelected] || '';
  };

  getCurrentData = () => {
    const { process, provinces, wards, districts } = this.state;
    switch (this.keySelected) {
      case KEY_PICKER.STATUS_CLIENT:
        return process;
      case KEY_PICKER.PROVINCES:
        return provinces;
      case KEY_PICKER.DISTRICTS:
        return districts;
      case KEY_PICKER.WARDS:
        return wards;
      default:
        return [];
    }
  };

  onCloseModal = () => {
    this.setState({ isVisible: false });
  };

  onPressSelectItem = (item) => {
    switch (this.keySelected) {
      case KEY_PICKER.STATUS_CLIENT:
        this.setState({
          processValue: item,
          showErrorProcessTextInput: false,
        });
        break;
      case KEY_PICKER.PROVINCES:
        this.apiGetSolarDistricts(item.province_id);
        this.setState({
          showErrorProvinceTextInput: false,
          provinceValue: item,
          districtValue: null,
          wardValue: null,
        });
        break;
      case KEY_PICKER.DISTRICTS:
        this.apiGetSolarWards(item.district_id);
        this.setState({
          showErrorDistrictTextInput: false,
          districtValue: item,
          wardValue: null,
        });
        break;
      case KEY_PICKER.WARDS:
        this.setState({
          wardValue: item,
          showErrorWarnTextInput: false,
        });
        break;
      default:
        break;
    }
    this.keySelected = null;
  };

  render() {
    const { status, onMainButtonPress } = this.props;
    const { isVisible } = this.state;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;
    return (
      <View>
        <View style={[styles.container, containerStyle]}>
          <View style={{ height: 8, backgroundColor: '#fff0' }} />
          {this.renderFormTitle()}
          {this.renderFullNameTextInput()}
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {this.renderCitizenIdTextInput()}
            {this.renderPhoneNumberTextInput()}
          </View>
          <View style={{ marginTop: 32 }}>{this.renderProcessClient()}</View>
          <View style={{ marginTop: 32 }}>{this.renderProvinces()}</View>
          <View style={{ marginTop: 32 }}>{this.renderDistricts()}</View>
          <View style={{ marginTop: 32 }}>{this.renderWards()}</View>
          <View style={{ marginTop: 32 }}>{this.renderNoteInput()}</View>
          <View style={styles.buttonContainer}>
            {this.renderLinkButton(this.onSecondButtonPress)}
            {this.renderSubmitButton(onMainButtonPress)}
          </View>
        </View>
        <ModalSelect
          title={this.getTittleHeader()}
          isVisible={isVisible}
          data={this.getCurrentData()}
          onCloseModal={this.onCloseModal}
          onPressSelectItem={this.onPressSelectItem}
          placeholder={this.getPlaceHolderTextInput()}
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

export default SolarForm;
