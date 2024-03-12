/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Text, View, Image, TextInput, StyleSheet, Animated } from 'react-native';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import ImageButton from '../../common/buttons/ImageButton';
import AppText from '../../componentV3/AppText';
import {ICON_PATH} from '../../assets/path';

/**
 * @author: Trung Nguyen
 */
export default class CustomTextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: undefined,
      isShownClearTextButton: false,
    };
  }

  _onClearTextButtonPress = () => {
    this.textInputRef.clear();
    this.props.onChangeText('');
    this.setState({ isShownClearTextButton: false });
  };
  _onChangeText = (text) => {
    this.setState({ isShownClearTextButton: text.length > 0 });
    this.props.onChangeText(text);
  };

  _onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocusListener();
  };

  _onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlurListener();
  };

  _getTextInputRef = (ref) => {
    this.textInputRef = ref;
    this.props.textInputRef(ref);
  };

  _renderTextInput = () => {
    const {
      inputStyle,
      placeholder,
      isShownTitle,
      keyboardType,
      autoFocus,
      secureTextEntry,
      returnKeyType,
      textAlign = 'center',
      maxLength = 1000,
    } = this.props;

    const placeHolderTextColor =
      isShownTitle && !this.state.isFocused ? Colors.primary4 : `${Colors.primary4}44`;

    return (
      <TextInput
        ref={this._getTextInputRef}
        style={[styles.textInput, TextStyles.heading3, inputStyle, { textAlign }]}
        placeholder={placeholder}
        placeholderTextColor={placeHolderTextColor}
        autoFocus={autoFocus}
        autoCorrect={false}
        keyboardType={keyboardType}
        underlineColorAndroid="transparent"
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        onChangeText={this._onChangeText}
        maxLength={maxLength}
      />
    );
  };

  _renderClearTextButton = () => (
    <ImageButton
      style={{ position: 'absolute', top: 0, bottom: 0, right: 0 }}
      imageSource={ICON_PATH.delete1}
      onPress={this._onClearTextButtonPress}
    />
  );

  _renderLeftIcon = (icon, iconText) => (
    <View style={styles.leftIconContainer}>
      <Image style={styles.iconLeft} source={icon} />
      <AppText style={[TextStyles.normalTitle, styles.textLeft]}>{iconText}</AppText>
    </View>
  );

  _renderErrorMessage = (errorMessage) => (
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image style={{ width: 20, height: 20 }} source={ICON_PATH.warning} />
      <AppText
        style={{
          ...TextStyles.heading4,
          color: Colors.accent3,
          marginLeft: 4,
          textAlign: 'center',
        }}
      >
        {errorMessage}
      </AppText>
    </View>
  );

  render() {
    const {
      containerStyle,
      isShownLeftIcon,
      icon = ICON_PATH.flag_vn,
      iconText = '(+84)',
      isShownError,
      errorMessage,
      isShowUnderLine,
      hideShowClearTextButton,
    } = this.props;
    const { isShownClearTextButton, isFocused } = this.state;
    return (
      <View style={{ ...containerStyle }}>
        <View style={{ ...styles.textInputContainer }}>
          {isShownLeftIcon ? this._renderLeftIcon(icon, iconText) : null}
          {this._renderTextInput()}
          {isShownClearTextButton && !hideShowClearTextButton
            ? this._renderClearTextButton()
            : null}
        </View>
        {isShowUnderLine && <View style={{ height: 1, backgroundColor: Colors.primary1 }} />}
        {/* <AnimatedLine
          style={{ height: 0.5 }}
          focusing={isFocused}
          lineColor={isShownError ? LINE_COLOR_STATUS.ERROR : LINE_COLOR_STATUS.NORMAL}
        /> */}
        {isShownError && errorMessage ? this._renderErrorMessage(errorMessage) : null}
      </View>
    );
  }
}

CustomTextInput.defaultProps = {
  onChangeText: () => {},
  textInputRef: () => {},
  onFocusListener: () => {},
  onBlurListener: () => {},
  isShownClearTextButton: false,
};

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
  },
  textInput: {
    flex: 1,
    height: 52,
    textAlign: 'center',
  },
  leftIconContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
  },
  // iconLeft: {
  //   width: 24,
  //   height: 18
  // },
  textLeft: {
    marginLeft: 4,
    color: `${Colors.primary4}44`,
  },
});
