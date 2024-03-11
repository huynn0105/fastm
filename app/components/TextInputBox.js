/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
} from 'react-native';

import KJButton from '../components/common/KJButton';
import AppText from '../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'TextInputBox.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// TextInputBox
// --------------------------------------------------

class TextInputBox extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inputValue: '',
    };
  }
  componentWillMount() {
    const inputValue = this.props.initInputValue;
    this.setState({
      inputValue,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  onYesPress = () => {
    this.props.onYesPress(this.state.inputValue);
  }
  onChangeText = (text) => {
    this.setState({ inputValue: text });
    this.props.onChangeText(text);
  }
  // --------------------------------------------------
  renderInput() {
    const { title, inputPlaceholder } = this.props;
    const { inputValue } = this.state;
    return (
      <View>
        <AppText style={styles.titleText}>
          {title}
        </AppText>
        <TextInput
          style={styles.textInput}
          value={inputValue}
          placeholder={inputPlaceholder}
          autoFocus
          onChangeText={this.onChangeText}
        />
      </View>
    );
  }
  renderButtons() {
    return (
      <View style={styles.buttonsContainer}>
        <KJButton
          containerStyle={styles.cancelButton}
          title={'Đóng'}
          titleStyle={styles.cancelButtonTitle}
          onPress={this.onCancelPress}
        />
        <KJButton
          containerStyle={styles.yesButton}
          title={'Đổi tên'}
          titleStyle={styles.yesButtonTitle}
          onPress={this.onYesPress}
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderInput()}
        <View style={styles.hline} />
        <View style={{ height: 32 }} />
        {this.renderButtons()}
      </View>
    );
  }
}

TextInputBox.defaultProps = {
  inputValue: '',
  inputPlaceholder: '',
  onCancelPress: () => {},
  onYesPress: () => {},
  onChangeText: () => {},
};

export default TextInputBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginLeft: 24,
    marginRight: 24,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  titleText: {
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '300',
    color: '#0009',
  },
  textInput: {
    flex: 0,
    marginTop: 12,
    marginLeft: 24,
    marginRight: 24,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'stretch',
    height: 40,
    // borderRadius: 2,
    // backgroundColor: '#E6EBFF',
    textAlign: 'left',
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#E6EBFF',
  },
  yesButton: {
    flex: 0.5,
    height: 44,
    backgroundColor: '#0000',
  },
  yesButtonTitle: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#39B5FC',
  },
  cancelButton: {
    flex: 0.5,
    height: 44,
  },
  cancelButtonTitle: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#0005',
  },
  hline: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: 32,
    marginRight: 32,
  },
  vline: {
    width: 1,
    backgroundColor: '#E0E0E1',
    marginTop: 0,
    marginBottom: 0,
  },
});
