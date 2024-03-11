import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import * as Animatable from 'react-native-animatable';

import { Message } from '../../../submodules/firebase/model';
import AppText from '../../../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'NoticeMessageView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NoticeMessageView.js
// --------------------------------------------------

class NoticeMessageView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderHtmlText() {
    const { message } = this.props;
    const htmlContent = message.htmlText;
    const timeText = moment(message.createTime, 'x').format('HH:mm');
    return (
      <Animatable.View
        style={styles.container}
        animation="fadeIn"
        useNativeDriver
        duration={1000}
      >
        <HTMLView
          value={htmlContent}
          stylesheet={htmlContentStyles}
          paragraphBreak={'\n'}
          lineBreak={'\n'}
        />
        <AppText style={styles.timeText}>
          {timeText}
        </AppText>
      </Animatable.View>
    );
  }
  renderPlainText() {
    const { message } = this.props;
    const messageText = message.getDisplayText() || '';
    const timeText = moment(message.createTime, 'x').format('h:m A');
    return (
      <Animatable.View
        style={styles.container}
        animation="fadeIn"
        useNativeDriver
        duration={1000}
      >
        <AppText style={styles.messageText}>
          {messageText}
        </AppText>
        <AppText style={styles.timeText}>
          {timeText}
        </AppText>
      </Animatable.View>
    );
  }
  render() {
    const { message } = this.props;
    if(!message) return <View />;
    if (message.htmlText && message.htmlText.length > 0) {
      return this.renderHtmlText();
    }
    return this.renderPlainText();
  }
}

// --------------------------------------------------

NoticeMessageView.defaultProps = {
  message: {},
};

NoticeMessageView.propTypes = {
  message: PropTypes.instanceOf(Message),
};

export default NoticeMessageView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 32,
    marginRight: 32,
    backgroundColor: '#05d8',
    // backgroundColor: '#0002',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  messageText: {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#0000',
    fontSize: 14,
    fontWeight: '300',
  },
  timeText: {
    marginTop: 6,
    color: '#fff',
    backgroundColor: '#0000',
    fontSize: 11,
    fontWeight: '400',
  },
  contentText: {
    backgroundColor: '#f002',
  },
});

const htmlContentStyles = StyleSheet.create({
  p: {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#0000',
    fontSize: 12,
    fontWeight: '300',
  },
});
