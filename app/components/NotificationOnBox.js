import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
} from 'react-native';

import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import { openOSSettings } from 'app/utils/UIUtils';
import { logEvent } from '../tracking/Firebase';
import AppText from '../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');

// --------------------------------------------------
// PopupBox.js
// --------------------------------------------------

const _ = require('lodash');

class NotificationOnBox extends Component {
  componentDidMount() {
    logEvent('view_NotificationOnBox');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onCancelPress = () => {
    if (this.props.onCancelPress) {
      this.props.onCancelPress();
    }
    logEvent('press_NotificationOnBox_cancel');
  }
  onYesPress = () => {
    if (this.props.onYesPress) {
      this.props.onYesPress();
      openOSSettings();
    }
    logEvent('press_NotificationOnBox_yes');
  }
  // --------------------------------------------------
  renderContent() {
    return (
      <Image
        style={{ width: SCREEN_SIZE.width - 26, height: (SCREEN_SIZE.width - 40) * 0.826 }}
        source={require('./img/noti.png')}
        resizeMode="contain"
      />
    );
  }

  renderButtons() {
    return (
      <View style={styles.bottomContainer}>
        <KJTouchableOpacity
          style={styles.cancelButton}
          onPress={this.onCancelPress}
        >
          <AppText style={styles.cancelButtonText}>
            {'Đóng'}
          </AppText>
        </KJTouchableOpacity>
        <KJTouchableOpacity
          style={styles.yesButton}
          onPress={this.onYesPress}
        >
          <AppText style={styles.yesButtonText}>
            {'Thiết lập thông báo'}
          </AppText>
        </KJTouchableOpacity>
      </View>
    );
  }
  render() {
    const {
      style,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderContent()}
        {this.renderButtons()}
      </View>
    );
  }
}

export default NotificationOnBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    // marginLeft: 20,
    // marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#0000',
    shadowOpacity: 0.5,
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingTop: 26,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F2F2F2',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  cancelButtonText: {
    color: '#606060',
    fontWeight: '600',
  },
  yesButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  yesButtonText: {
    color: '#50A9E4',
    fontWeight: '600',
  },
});
