import _ from 'lodash';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import React from 'react';

import { CircleImageButton } from '../CircleImageButton';
import { CustomTextField } from '../CustomTextField';
import { FormPolicy } from './FormPolicy';
import Colors from '../../theme/Color';
import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import LinkButton from '../LinkButton/index';
import TextStyles from '../../theme/TextStyle';
import { checkRestrict } from '../../utils/Utils';

const mockupTitle =
  '<p style="color: rgba(36, 37, 61, 0.6); text-align: center">Chiếc khấu trực tiếp <span style="color: #00863d">10%</span> và nhận thêm <span style="color: #00863d">5%</span> thu nhập cho các nhà mạng hỗ trợ</p>';

class DigitalWalletCustomerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showErrorFullNameTextInput: false,
      showErrorPhoneNumberTextInput: false,
    };
    this.fullNameTextInputValue = '';
    this.phoneNumberTextInputValue = '';
    this.phoneNumberTextInputRef = undefined;
    this.fullNameTextInputRef = undefined;
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
  }

  // -----------------------------------------
  // EVENT HANDLER METHODS
  // -----------------------------------------
  onDigitalWalletItemPress = (item, index) => {
    this.props.onPartnerItemPress(item, index);
  };
  onChangeFullNameText = (text) => {
    this.fullNameTextInputValue = text;
    this.setState({
      showErrorFullNameTextInput: false,
    });
  };
  onChangePhoneNumberText = (text) => {
    this.phoneNumberTextInputValue = text;
    this.setState({
      showErrorPhoneNumberTextInput: false,
    });
  };

  // -----------------------------------------
  // COMMON METHODS
  // -----------------------------------------
  getFullNameTextInputValue = () => {
    return this.fullNameTextInputValue;
  };
  getPhoneNumberTextInputValue = () => {
    return this.phoneNumberTextInputValue;
  };
  showErrorFullNameTextInput = (isShown, message) => {
    this.setState({
      showErrorFullNameTextInput: isShown,
      errorFullNameMessage: message,
    });
  };
  showErrorPhoneNumberTextInput = (isShown, message) => {
    this.setState({
      showErrorPhoneNumberTextInput: isShown,
      errorPhoneNumberMessage: message,
    });
  };
  blurAllTextInput = () => {
    // this.fullNameTextInputRef.blur();
    this.phoneNumberTextInputRef.blur();
  };
  validateFormPolicy = () => {
    return this.formPolicyRef.validateFormPolicy();
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------
  renderFormTitle = () => {
    const { formTitle, partnerDataSource } = this.props;
    const smartPayItem = partnerDataSource.items[0];
    return (
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            flex: 1,
            marginTop: -8,
            paddingRight: 16,
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
        <View style={{ alignItems: 'flex-end' }}>
          <CircleImageButton
            imageSize={46}
            imageSource={{ uri: smartPayItem.imageUrl }}
            textStyle={{ marginTop: 7, opacity: 0.6, ...TextStyles.normalTitle }}
            onPress={() => {
              this.onDigitalWalletItemPress();
            }}
          />
        </View>
      </View>
    );
  };
  renderFullNameTextInput = () => {
    const { showErrorFullNameTextInput, errorFullNameMessage } = this.state;
    const { onFocusFullNameTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.fullNameTextInputRef = ref;
        }}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12, marginBottom: 20 }}
        textFieldLabel={'Nhập họ và tên KH'}
        showError={showErrorFullNameTextInput}
        errorMessage={errorFullNameMessage}
        onChangeTextFieldText={this.onChangeFullNameText}
        onTextFieldFocus={onFocusFullNameTextInput}
      />
    );
  };
  renderPhoneNumberTextInput = () => {
    const { showErrorPhoneNumberTextInput, errorPhoneNumberMessage } = this.state;
    const { onFocusPhoneNumberTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.phoneNumberTextInputRef = ref;
        }}
        containerStyle={{ marginBottom: 20, marginTop: 0 }}
        textFieldLabel={'Vui lòng nhập đúng số điện thoại'}
        showError={showErrorPhoneNumberTextInput}
        errorMessage={errorPhoneNumberMessage}
        keyboardType={'phone-pad'}
        onChangeTextFieldText={this.onChangePhoneNumberText}
        onTextFieldFocus={onFocusPhoneNumberTextInput}
      />
    );
  };
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
  renderDigitalWalletItem = ({ item, index }) => (
    <CircleImageButton
      borderWidth={0.5}
      borderColor={index % 2 === 0 ? Colors.primary2 : Colors.primary1}
      imageSize={46}
      imageSource={{ uri: item.imageUrl }}
      label={item.label}
      textStyle={{ marginTop: 7, opacity: 0.6, ...TextStyles.normalTitle }}
      onPress={() => {
        this.onDigitalWalletItemPress(item, index);
      }}
    />
  );
  renderListDigitalWallet = (partnerDataSource) => (
    <FlatList
      style={{ marginBottom: 20 }}
      data={partnerDataSource.items}
      renderItem={this.renderDigitalWalletItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );

  renderRestrictButton = (data, myUser) => {
    return (
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            const restrict = checkRestrict(myUser.prefix, data.disable);
            this.props.onRestrictPress(restrict);
          }}
        />
      </View>
    );
  };

  render() {
    const {
      navigation,
      status,
      partnerDataSource,
      onSecondButtonPress,
      onMainButtonPress,
      policyDefaultHtml,
      policyDetailsUrl,
      data = {},
      myUser = {},
    } = this.props;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderFormTitle()}
        {/* {this.renderFullNameTextInput()} */}
        {this.renderPhoneNumberTextInput()}
        {policyDefaultHtml && (
          <FormPolicy
            navigation={navigation}
            containerStyle={{ marginBottom: 10 }}
            formPolicyRef={(ref) => {
              this.formPolicyRef = ref;
            }}
            onSelectPolicyCheckBox={(isSelected) => {}}
            policyHTMLContent={policyDefaultHtml}
            policyURL={policyDetailsUrl}
          />
        )}
        <View style={styles.buttonContainer}>
          {data.secondButtonURL ? this.renderLinkButton(onSecondButtonPress) : null}
          {this.renderSubmitButton(onMainButtonPress)}
        </View>
        {/* {this.renderDescriptionText()} */}
        {/* {this.renderListDigitalWallet(partnerDataSource)} */}
        {checkRestrict(myUser.prefix, data.disable) ? this.renderRestrictButton(myUser, data) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
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
    marginBottom: 20,
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

export default DigitalWalletCustomerForm;
