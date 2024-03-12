import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';
export class CustomTextField extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
    };
  }

  componentDidMount() {
    if (this.props.textFieldRef !== null && this.props.textFieldRef !== undefined) {
      this.props.textFieldRef(this.textFieldRef);
    }
  }

  onChangeText = (text) => {
    this.props.onChangeTextFieldText(text);
  };

  onTextFieldFocus = () => {
    this.setState({
      isFocused: true,
    });

    this.props.onTextFieldFocus();
  };

  onTextFieldBlur = () => {
    this.setState({
      isFocused: false,
    });

    this.props.onTextFieldBlur();
  };

  renderRightIcon = (rightIcon) => {
    const { isFocused } = this.state;
    const { showError } = this.props;
    let rightIconTintColor = null;
    if (isFocused) {
      rightIconTintColor = showError ? Colors.accent3 : Colors.primary1;
    }
    return (
      <Image
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          right: 0,
          bottom: 14,
          tintColor: rightIconTintColor,
        }}
        source={rightIcon}
        resizeMode="stretch"
      />
    );
  };

  renderLeftIcon = (leftIcon) => {
    const { isFocused } = this.state;
    const { showError } = this.props;
    let leftIconTintColor = null;
    if (isFocused) {
      leftIconTintColor = showError ? Colors.accent3 : Colors.primary1;
    }
    return (
      <Image
        style={{
          position: 'absolute',
          width: 20,
          height: 20,
          left: 0,
          bottom: 14,
          tintColor: leftIconTintColor,
        }}
        source={leftIcon}
        resizeMode="stretch"
      />
    );
  };

  renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <Image style={{ width: 16, height: 16 }} source={ICON_PATH.warning} />
        <AppText
          style={{ marginLeft: 4, ...TextStyles.normalTitle, fontSize: 11, color: Colors.accent3 }}
        >
          {errorMessage}
        </AppText>
      </View>
    ) : null;
  };

  renderDescription = (description) => {
    return description ? (
      <View style={{ marginTop: 2 }}>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6 }}>{description}</AppText>
      </View>
    ) : null;
  };

  render() {
    const {
      containerStyle,

      textFieldContainerStyle,
      textFieldInputStyle,

      textFieldValue,

      textFieldLabel,
      textFieldLabelTextStyle,

      autoCapitalize,
      keyboardType,

      description,

      showError,
      errorMessage,

      rightIcon,
      leftIcon,
      editable,

      baseColor,
      rightComponent,
      labelFontSize,
    } = this.props;
    const tintColor = showError ? Colors.accent3 : Colors.primary1;

    const marginLeft = leftIcon ? 28 : 0;
  
    return (
      <View style={{ ...containerStyle }}>
        <View>
          {leftIcon && this.renderLeftIcon(leftIcon)}
          <TextField
            ref={(ref) => {
              this.textFieldRef = ref;
            }}
            style={{ ...textFieldInputStyle, marginLeft }}
            containerStyle={{ flex: 1, ...textFieldContainerStyle }}
            fontSize={14}
            activeLineWidth={1.3}
            animationDuration={180}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            value={textFieldValue}
            label={textFieldLabel}
            labelFontSize={labelFontSize || 14}
            autoCorrect={false}
            labelOffset={{ y0: 0, y1: 0 }}
            contentInset={{ top: 0, input: 4 }}
            labelTextStyle={{
              ...textFieldLabelTextStyle,
              marginLeft,
              paddingTop: 2,
              position: 'absolute',
              left: '100%',
            }}
            baseColor={baseColor || '#24253d'}
            tintColor={tintColor} // the main color (label, activeLineColor)
            onChangeText={this.onChangeText}
            onFocus={this.onTextFieldFocus}
            onBlur={this.onTextFieldBlur}
            editable={editable}
          />
          {rightComponent && rightComponent()}
          {rightIcon && this.renderRightIcon(rightIcon)}
        </View>
        {showError ? this.renderErrorMessage(errorMessage) : this.renderDescription(description)}
      </View>
    );
  }
}

CustomTextField.defaultProps = {
  onTextFieldFocus: () => {},
  onTextFieldBlur: () => {},
  onChangeTextFieldText: () => {},
};

export default CustomTextField;
