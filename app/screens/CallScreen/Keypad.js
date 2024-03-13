// @flow

import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from 'react-native';
import { correctFontSizeForScreen } from 'app/utils/UIUtils';

type Props = {
  onKeyPress: Function,
  onDefineKeySize: Function,

  keyStyle: any,
  keyTextStyle: any,
  style: any,
}

type State = {
  keySize: number,
  heightRatio: number,
  keypadText: string,
}

const _ = require('lodash');

export default class Keypad extends Component<Props, State> {
  static defaultProps = {
    onKeyPress: () => {},
    onDefineKeySize: () => {},

    keyStyle: {},
    keyTextStyle: {},
    style: {},
  };

  constructor(props: Props) {
    super(props);

    const { height, width } = Dimensions.get('window');
    const ratio = height / width;

    this.state = {
      keySize: 0,
      heightRatio: ratio * ratio,
      keypadText: ' ',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onKeyPress = (key: string) => {
    this.props.onKeyPress && this.props.onKeyPress(key); // eslint-disable-line
    const currentText = this.state.keypadText;
    this.setState({
      keypadText: ((currentText === ' ') ? '' : currentText) + key,
    });
  }

  onLayoutKey = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({ keySize: height });

    this.props.onDefineKeySize && this.props.onDefineKeySize({ width, height });  // eslint-disable-line
  }

  renderKey = (digit: string, letters: string) => {
    const props = {};


    if (digit === '1') {
      props.onLayout = (event) => this.onLayoutKey(event);
    }

    return (
      <View {...props} key={digit} style={styles.keyWrapper}>

        {
          /* Show key only when we know it's width to render square touchable */
          !this.state.keySize ? null :
            <TouchableOpacity
              style={[styles.keyTouchable, { width: this.state.keySize }, this.props.keyStyle]}
              onPress={() => this.onKeyPress(digit)}
              // underlayColor="gray"
            >
              <View style={styles.keyDigitWrapper}>
                <Text style={[styles.keyDigitText, this.props.keyTextStyle]}>{digit}</Text>
                <Text style={[styles.keyLettersText, this.props.keyTextStyle]}>{letters}</Text>
              </View>
            </TouchableOpacity>
        }
      </View>
    );
  }

  render() {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['*', '0', '#'],
    ];

    const desc = [
      ['', 'ABC', 'DEF'],
      ['GHI', 'JKL', 'MNO'],
      ['PQRS', 'TUV', 'WXYZ'],
      ['', '', ''],
    ];

    const keypad = [];

    for (let i = 0; i < keys.length; i += 1) {
      keypad.push((
        <View key={keys[i].join('|')} style={styles.row}>
          <View style={styles.outerLineOffset} />
          {this.renderKey(keys[i][0], desc[i][0])}
          <View style={styles.innerLineOffset} />
          {this.renderKey(keys[i][1], desc[i][1])}
          <View style={styles.innerLineOffset} />
          {this.renderKey(keys[i][2], desc[i][2])}
          <View style={styles.outerLineOffset} />
        </View>
      ));

      if (i !== keys.length - 1) {
        keypad.push((
          <View key={`split${i}`} style={{ flex: 0.01 * this.state.heightRatio }} />
        ));
      }
    }

    return (
      <View style={this.props.style}>
        <Text style={styles.keypadText}>
          {this.state.keypadText}
        </Text>
        {keypad}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 0.2,
    flexDirection: 'row',
  },
  outerLineOffset: {
    flex: 0.106,
  },
  innerLineOffset: {
    flex: 0.06,
  },
  keyWrapper: {
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    // backgroundColor: 'red',
  },
  keyTouchable: {
    // borderRadius: 100,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  keyDigitText: {
    fontSize: correctFontSizeForScreen(32),
    color: '#0e2035',
    fontWeight: '200',
    textAlign: 'center',
  },
  keyLettersText: {
    fontSize: correctFontSizeForScreen(9),
    color: '#0e2035',
    fontWeight: '200',
    textAlign: 'center',
  },
  keyDigitWrapper: {
    backgroundColor: 'transparent',
  },
  keypadText: {
    color: '#333',
    fontSize: correctFontSizeForScreen(32),
    marginTop: 0,
    marginBottom: 24,
  },
});

