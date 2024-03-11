import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import TextStyles from '../../../theme/TextStyle';
import Colors from '../../../theme/Color';
import CustomButton, { BUTTON_SIZE } from '../../../components2/CustomButton';
import AppText from '../../../componentV3/AppText';
class IntroCustomerInputForm extends PureComponent {
  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------

  renderFormTitle = () => (
    <AppText
      style={{
        marginBottom: 26,
        textAlign: 'center',
        
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        letterSpacing: 0.4,
        color: 'rgba(36, 37, 61, 0.6)'
      }}
    >
      {'Nhận đến '}
      <AppText style={{ ...TextStyles.normalTitle, color: Colors.primary1, fontWeight: 'bold' }}>
        {'550,000đ '}
      </AppText>
      {'khi giới thiệu\nthành công khách hàng'}
    </AppText>
  );

  renderFullNameTextInput = (onChangeFullNameText, description, errorText) => (
    <TextField
      containerStyle={{ marginBottom: 26 }}
      tintColor={Colors.primary1}
      fontSize={12}
      labelFontSize={12}
      labelHeight={0}
      labelTextStyle={{ ...styles.label }}
      label={'Họ và tên'}
      title={description}
      error={errorText}
      animationDuration={180}
      onChangeText={onChangeFullNameText}
    />
  );

  renderCitizenIdTextInput = (onChangeCitizenIdText, description, errorText) => (
    <TextField
      containerStyle={{ flex: 1 }}
      tintColor={Colors.primary1}
      fontSize={12}
      labelFontSize={12}
      labelHeight={0}
      labelTextStyle={{ ...styles.label }}
      label={'CMND / CCCD'}
      keyboardType={'phone-pad'}
      title={description}
      error={errorText}
      animationDuration={180}
      onChangeText={onChangeCitizenIdText}
    />
  );

  renderPhoneNumberTextInput = (onChangePhoneNumberText, description, errorText) => (
    <TextField
      containerStyle={{ flex: 1, marginLeft: 22 }}
      tintColor={Colors.primary1}
      fontSize={12}
      labelFontSize={12}
      labelHeight={0}
      labelTextStyle={{ ...styles.label }}
      label={'Số điện thoại'}
      keyboardType={'phone-pad'}
      title={description}
      error={errorText}
      animationDuration={180}
      onChangeText={onChangePhoneNumberText}
    />
  );

  renderChooseCityTextInput = (onChangeCityText, description, errorText) => (
    <View style={{ flexDirection: 'row' }}>
      <Image
        style={{ width: 20, height: 20, marginRight: 8 }}
        source={require('./img/ic_search.png')}
      />
      <TextField
        containerStyle={{ flex: 1, marginBottom: 26 }}
        tintColor={Colors.primary1}
        fontSize={12}
        labelFontSize={12}
        labelHeight={0}
        labelTextStyle={{ ...styles.label }}
        label={'Huyện/Tỉnh (Quận/TP)'}
        titleFontSize={12}
        title={description}
        error={errorText}
        animationDuration={180}
        onChangeText={onChangeCityText}
      />
    </View>
  );

  renderSubmitButton = onSubmitButtonPress => (
    <CustomButton
      sizeType={BUTTON_SIZE.REGULAR}
      title={'Kiểm tra hồ sơ'}
      icon={require('./img/ic_paper_work.png')}
      onPress={onSubmitButtonPress}
    />
  );

  renderCollapseButton = onCollapseButtonPress => (
    <TouchableOpacity onPress={onCollapseButtonPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, marginRight: 8 }}>{'Thu gọn'}</AppText>
        <Image source={require('./img/ic_pyramid.png')} />
      </View>
    </TouchableOpacity>
  );

  render() {
    const {
      containerStyle,

      descriptionFullNameTextInput,
      descriptionCitizenIdTextInput,
      descriptionPhoneNumberTextInput,
      descriptionChooseCityTextInput,

      errorFullNameTextInput,
      errorPhoneNumberTextInput,
      errorCitizenIdTextInput,
      errorChooseCityTextInput,

      onChangeFullNameText,
      onChangeCitizenIdText,
      onChangePhoneNumberText,
      onChangeCityText,
      onSubmitButtonPress,
      onCollapseButtonPress
    } = this.props;
    return (
      <View style={{ ...styles.container, ...containerStyle }}>
        {this.renderFormTitle()}
        {this.renderFullNameTextInput(
          onChangeFullNameText,
          descriptionFullNameTextInput,
          errorFullNameTextInput
        )}
        <View style={{ flexDirection: 'row', marginBottom: 26 }}>
          {this.renderCitizenIdTextInput(
            onChangeCitizenIdText,
            descriptionCitizenIdTextInput,
            errorCitizenIdTextInput
          )}
          {this.renderPhoneNumberTextInput(
            onChangePhoneNumberText,
            descriptionPhoneNumberTextInput,
            errorPhoneNumberTextInput
          )}
        </View>
        {this.renderChooseCityTextInput(
          onChangeCityText,
          descriptionChooseCityTextInput,
          errorChooseCityTextInput
        )}
        <View style={{ flexDirection: 'row', ...styles.buttonContainer }}>
          {this.renderSubmitButton(onSubmitButtonPress)}
          {this.renderCollapseButton(onCollapseButtonPress)}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 9.5,
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {},
  label: {
    
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export default IntroCustomerInputForm;
