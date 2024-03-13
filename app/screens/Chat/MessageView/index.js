import React, { Component } from 'react';
import {
} from 'react-native';

import PropTypes from 'prop-types';
import LocationMessageView from './LocationMessageView';
import NoticeMessageView from './NoticeMessageView';
import QuotedView from './QuotedView';


// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'CustomView.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MessageView
// --------------------------------------------------

class MessageView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onLocationLongPress = (giftedMessage, messageViewRef, messageViewThis) => {
    if (this.props.onLocationLongPress) {
      this.props.onLocationLongPress(giftedMessage, messageViewRef, messageViewThis);
    }
  }

  checkHasQuote = (message) => {
    const headerHtml = message.htmlText;
    const quotedID = message.quotedID;

    return (headerHtml !== undefined && headerHtml.length > 0) || quotedID;

  }

  render() {

    const { isSelf } = this.props;

    const giftedMessage = this.props.currentMessage;
    const message = giftedMessage.message;

    if (message.isNoticeMessage()) {
      return (
        <NoticeMessageView
          message={message}
        />
      );
    }
    else if (message.isLocationMessage()) {
      return (
        <LocationMessageView
          isMine={isSelf}
          message={giftedMessage}
          onLocationLongPress={this.onLocationLongPress}
        />
      );
    }
    else if (message.isTextMessage() && this.checkHasQuote(message)) {
      return (
        <QuotedView
          onImagePress={this.props.onImagePress}
          isSelf={isSelf}
          message={message}
        />
      );
    }
    return null;
  }
}

// --------------------------------------------------

MessageView.defaultProps = {
  currentMessage: {},
};

MessageView.propTypes = {
  currentMessage: PropTypes.instanceOf(Object),
};

export default MessageView;
