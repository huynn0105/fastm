import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import Colors from '../theme/Color';
import AppText from '../componentV3/AppText';
import { IS_IOS } from '../utils/Utils';
const NUMBER_OF_CODES = 4;

const _ = require('lodash');

// --------------------------------------------------
// CodeInput
// --------------------------------------------------

class CodeInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      didFocus: false,
    };
    this.debounceCodeInputSubmit = _.debounce(this.props.onCodeInputSubmit, 250);
    this.debounceCodeInput = _.debounce(this.props.onCodeInput, 1);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ didFocus: true });
  };

  keyboardDidHide = () => {
    this.setState({ didFocus: false });
  };

  // --------------------------------------------------
  onTextInputChangeText = (text) => {
    // Utils.log(`${LOG_TAG} onTextInputChangeText: ${text}`);
    const newInputText = text.length <= this.props.codeLength ? text : this.state.inputText;
    this.setState(
      {
        inputText: newInputText,
      },
      () => {
        const code = newInputText.trim();
        if (newInputText.length === this.props.codeLength) {
          // this.textInput.blur();
          this.debounceCodeInputSubmit(code);
        }
        this.debounceCodeInput(code);
      },
    );
  };
  onTextInpuTapped = () => {
    if (this.textInput) {
      this.textInput.blur();
      setTimeout(() => {
        if (this.textInput) {
          this.textInput.focus();
        }
      }, 100);
    }
  };

  // --------------------------------------------------
  renderTextInput() {
    const { textInputProps } = this.props;
    return (
      <TextInput
        ref={(item) => {
          this.textInput = item;
        }}
        autoCorrect={false}
        autoFocus
        caretHidden
        selectTextOnFocus={false}
        style={styles.textInput}
        value={this.state.inputText}
        keyboardType={'numeric'}
        onChangeText={this.onTextInputChangeText}
        {...textInputProps}
      />
    );
  }
  renderCodes() {
    const { didFocus, inputText } = this.state;
    const codes = this.state.inputText.trim().split('');
    while (codes.length < NUMBER_OF_CODES) {
      codes.push(' ');
    }
    const indexActive =
      this.state.inputText.trim()?.length >= NUMBER_OF_CODES
        ? this.state.inputText.trim()?.length - 1
        : this.state.inputText.trim()?.length;

    return (
      <View style={styles.codesContainer}>
        {codes.map((code, index) => {
          const active = index === indexActive;

          return (
            <View
              style={[
                styles.codeItemContainer,
                {
                  borderColor: active ? Colors.primary2 : Colors.gray4,
                  backgroundColor: active ? Colors.blue6 : Colors.neutral5,
                },
              ]}
            >
              <AppText semiBold style={styles.codeText}>
                {code}
              </AppText>
            </View>
          );
        })}
        {didFocus ? (
          <Animatable.View
            animation={'fadeOut'}
            duration={500}
            iterationDelay={1000}
            iterationCount={'infinite'}
            useNativeDriver
            style={{
              position: 'absolute',
              //TODO: width / 2 + border left + index active * (width + border horizontal)
              left:
                this.state.inputText.trim()?.length >= NUMBER_OF_CODES
                  ? 40 / 2 + 6 + indexActive * (40 + 12) + 8
                  : 40 / 2 + 6 + indexActive * (40 + 12),
              width: 1,
              height: 26,
              backgroundColor: Colors.primary2,
            }}
          />
        ) : null}
      </View>
    );
  }
  renderFocusButton() {
    return <TouchableOpacity style={styles.inputButton} onPress={this.onTextInpuTapped} />;
  }
  // --------------------------------------------------
  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderTextInput()}
        {this.renderCodes()}
        {this.renderFocusButton()}
      </View>
    );
  }
}

CodeInput.propTypes = {
  codeLength: PropTypes.number,
  onCodeInputSubmit: PropTypes.func,
};

CodeInput.defaultProps = {
  codeLength: NUMBER_OF_CODES,
  onCodeInputSubmit: () => {},
  onCodeInput: () => {},
};

export default CodeInput;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.0,
  },
  textInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    fontSize: 8,
    opacity: 0.0,
  },
  codesContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeItemContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 6,
    borderRadius: 4,
    width: 40,
    height: 40,
  },
  codeText: {
    alignSelf: 'center',
    fontSize: 22,
    color: Colors.gray1,
    top: IS_IOS ? 1 : -1,
  },
});
