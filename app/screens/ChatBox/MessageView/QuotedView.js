import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import { Message } from '../../../submodules/firebase/model';
import AppText from '../../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'QuotedView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// QuotedView.js
// --------------------------------------------------

class QuotedView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  getHTMLFor(name, text) {
    return `<name><em>${name}</name><quoted>${text}</quoted><hr/>`;
  }
  renderHtmlText() {
    const { message, isSelf } = this.props;
    const htmlContent = message.htmlText;
    const components = htmlContent.split('>>>');
    let name = '';
    let content = '';
    if (components !== undefined && components.length === 2) {
      name = components[0];
      content = components[1];
      content.trim();
    }
    return (
      <View style={styles.container}>
        <AppText style={isSelf ? styles.nameSelf : styles.name}>
          {name}
        </AppText>
        <View style={styles.content}>
          <View style={isSelf ? styles.verticleLineSelf : styles.verticleLine} />
          <AppText style={isSelf ? styles.quotedSelf : styles.quoted}>
            {content}
          </AppText>
        </View>
        {/* <View style={isSelf ? styles.hrSelf : styles.hr} /> */}
      </View>
    );
  }
  render() {
    const { message } = this.props;
    if (message.htmlText && message.htmlText.length > 0) {
      return this.renderHtmlText();
    }
    return null;
  }
}

// --------------------------------------------------

QuotedView.defaultProps = {
  message: {},
};

QuotedView.propTypes = {
  message: PropTypes.instanceOf(Message),
};

export default QuotedView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: (Platform.OS === 'ios' ? 0 : 6),
    backgroundColor: '#0000',
    justifyContent: 'center',
  },
  nameSelf: {
    flex: 0,
    color: '#fffb',
    backgroundColor: '#0000',
    fontSize: 12,
    fontWeight: '500',
    height: 20,
    marginBottom: (Platform.OS === 'ios' ? 6 : 4),
  },
  name: {
    flex: 0,
    color: '#0008',
    backgroundColor: '#0000',
    fontSize: 12,
    fontWeight: '500',
    height: 20,
    marginBottom: (Platform.OS === 'ios' ? 6 : 4),
  },
  content: {
    flexDirection: 'row',
  },
  markSelf: {
    color: '#fffc',
    fontWeight: '500',
    fontSize: 13,
  },
  mark: {
    color: '#000a',
    fontWeight: '500',
    fontSize: 13,
  },
  verticleLineSelf: {
    width: 1,
    flex: 0,
    marginRight: 4,
    paddingTop: (Platform.OS === 'ios' ? 0 : 4),
    backgroundColor: '#fff',
    bottom: (Platform.OS === 'ios' ? 4 : 0),
    marginBottom: (Platform.OS === 'ios' ? 3 : 0),
    marginTop: (Platform.OS === 'ios' ? 3 : 0),
  },
  verticleLine: {
    width: 1,
    flex: 0,
    marginRight: 4,
    paddingTop: (Platform.OS === 'ios' ? 0 : 4),
    backgroundColor: '#000',
    bottom: (Platform.OS === 'ios' ? 4 : 0),
    marginBottom: (Platform.OS === 'ios' ? 3 : 0),
    marginTop: (Platform.OS === 'ios' ? 3 : 0),
  },
  quotedSelf: {
    color: '#fffb',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 4,
    fontStyle: 'italic',
    marginTop: 4,
  },
  quoted: {
    color: '#0008',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 4,
    fontStyle: 'italic',
    marginTop: 4,
  },
  hrSelf: {
    height: 1,
    backgroundColor: '#fff6',
    marginBottom: (Platform.OS === 'ios' ? 2 : 6),
    marginTop: 4,
    top: (Platform.OS === 'ios' ? -8 : 0),
  },
  hr: {
    height: 1,
    backgroundColor: '#0004',
    marginBottom: (Platform.OS === 'ios' ? 2 : 6),
    marginTop: 4,
    top: (Platform.OS === 'ios' ? -8 : 0),
  },
});
