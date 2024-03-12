import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
/* eslint-disable */
const LOG_TAG = '7777: CodeInput.js';
/* eslint-enable */

const NUMBER_OF_CODES = 4;

const _ = require('lodash');

// --------------------------------------------------
// CodeInput
// --------------------------------------------------

class CodeInput extends Component {

  state = {
    inputText: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onTextInputChangeText = (text) => {
    // Utils.log(`${LOG_TAG} onTextInputChangeText: ${text}`);
    const newInputText = text.length <= this.props.codeLength ? text : this.state.inputText;
    this.setState({
      inputText: newInputText,
    }, () => {
      if (newInputText.length === this.props.codeLength) {
        const code = newInputText.trim();
        if (this.textInput) {
          this.textInput.blur();
        }
        this.props.onCodeInputSubmit(code);
      }
    });
  }
  onTextInpuTapped = () => {
    if (this.textInput) {
      this.textInput.blur();
      setTimeout(() => {
        if (this.textInput) {
          this.textInput.focus();
        }
      }, 100);
    }
  }

  // --------------------------------------------------
  renderTextInput() {
    const {
      textInputProps,
    } = this.props;
    return (
      <TextInput
        ref={item => { this.textInput = item; }}
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
    const codes = this.state.inputText.trim().split('');
    while (codes.length < NUMBER_OF_CODES) {
      codes.push(' ');
    }
    return (
      <View style={styles.codesContainer}>
      {
        codes.map(code => {
          return (
            <View style={styles.codeItemContainer}>
              <AppText style={styles.codeText}>
                {code}
              </AppText>
              {
                code !== ' ' ?
                <View style={styles.activeDash} /> : 
                <View style={styles.inActiveDash} />
              }
            </View>
          );
        })
      }
      </View>
    );
  }
  renderFocusButton() {
    return (
      <TouchableOpacity
        style={styles.inputButton}
        onPress={this.onTextInpuTapped}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
    } = this.props;
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
  },
  codeText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '400',
    color: '#202020',
    backgroundColor: '#0000',
  },
  activeDash: {
    alignSelf: 'center',
    marginTop: 2,
    marginLeft: 0,
    marginRight: 0,
    width: 30,
    height: 1,
    borderRadius: 1,
    backgroundColor: '#008BDA',
  },
  inActiveDash: {
    alignSelf: 'center',
    marginTop: 2,
    marginLeft: 0,
    marginRight: 0,
    width: 30,
    height: 1,
    borderRadius: 1,
    backgroundColor: '#E0E0E1',
  },
});
