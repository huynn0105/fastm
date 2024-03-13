/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import LottieView from 'lottie-react-native';
import AppText from '../../componentV3/AppText';

import Styles from 'app/constants/styles';
import KJButtonPressIn from 'app/components/common/KJButtonPressIn';
import User from 'app/models/User';

import { call } from 'app/utils/UIUtils';
import colors from 'app/constants/colors';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
// --------------------------------------------------
import { updateTimeAgoString } from 'app/utils/Utils';
import Colors from '../../theme/Color';
import { connect } from 'react-redux';
import { getPresenceStatusUser } from '../../redux/actions/actionsV3/userMetaData';

const TITLE_MARGIN_TOP = Platform.OS === 'ios' ? 0 : -2;
const STATUS_MARGIN_TOP = Platform.OS === 'ios' ? 2 : 0;

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeOnlineString: ' ',
      isOnline: false,
    };
    this.lastOnline = 0;
    this.startLoop = false;
    this.enableLoop = true;
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isSingleThread && this.startLoop === false) {
      this.updateOnlineTime();
    }
    if (nextProps.singleThreadTargetUserPresence !== this.props.singleThreadTargetUserPresence) {
      this.syncTimeOnline();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    this.enableLoop = false;
  }

  updateOnlineTime = () => {
    // eslint-disable-line
    if (this.enableLoop) {
      this.startLoop = true;
      this.syncTimeOnline();
      const delay = this.lastOnline === 0 ? 1000 : 1000 * 30;
      setTimeout(() => {
        if (this) {
          this.updateOnlineTime();
        }
      }, delay);
    }
  };

  syncTimeOnline = async () => {
    // const timeOnline = await ChatManager.shared().getUserPresence(this.props.user.uid);

    this.props.getPresenceStatusUser(this.props.user?.uid, (payload) => {
      this.lastOnline = payload?.last_time_login;
      this.setState({
        isOnline: payload?.is_online,
        timeOnlineString: updateTimeAgoString(payload?.last_time_login),
      });
    });

    // if (timeOnline.lastTimeOnline !== this.lastOnline) {
    //   this.lastOnline = timeOnline.lastTimeOnline;
    //   let onlStatus = updateTimeAgoString(timeOnline.lastTimeOnline);
    //   if (onlStatus === 'vài giây trước') {
    //     onlStatus = 'vừa truy cập';
    //   }
    //   this.setState({
    //     timeOnline: onlStatus,
    //   });
    // }
  };

  // --------------------------------------------------
  onBackPress = () => {
    this.props.onBackPress();
  };
  onTitlePress = () => {
    this.props.onTitlePress();
  };
  onPhonePress = () => {
    call(this.props.phoneNumber);
  };
  // --------------------------------------------------
  renderBackButton() {
    return (
      <KJButtonPressIn
        testID="header-back"
        containerStyle={styles.backButton}
        leftIconSource={require('./img/back.png')}
        leftIconStyle={{ marginLeft: -12 }}
        onPressIn={this.onBackPress}
      />
    );
  }

  renderSingleThreadStatus() {
    const { isOnline, timeOnlineString } = this.state;
    const statusColor = isOnline
      ? User.PRESENCE_STATUS_COLOR.ONLINE
      : User.PRESENCE_STATUS_COLOR.OFFLINE;

    const statusString = isOnline ? User.PRESENCE_STATUS_STRING.ONLINE : timeOnlineString;

    // if (status === null) {
    //   timeOnline = ' ';
    // }
    // if (status !== User.PRESENCE_STATUS.ONLINE) {
    //   timeOnline = this.state.timeOnline;
    // }

    return (
      <View style={styles.statusContainer}>
        <View style={[styles.status, { backgroundColor: statusColor }]} />
        <AppText style={styles.statusText}>{statusString}</AppText>
      </View>
    );
  }
  renderGroupThreadStatus() {
    const { thread } = this.props;
    const statusString = thread.statusString();
    return (
      <View style={styles.statusContainer}>
        <AppText style={styles.statusText}>{statusString}</AppText>
      </View>
    );
  }
  renderTitle() {
    const { thread, title } = this.props;
    return !thread?.titleString() ? (
      !!title ? (
        <View style={styles.titleContainer}>
          <AppText style={[styles.titleText, { alignSelf: 'center' }]}>{title}</AppText>
        </View>
      ) : (
        <View style={styles.titleContainer} />
      )
    ) : (
      <Animatable.View
        style={styles.titleContainer}
        animation="fadeIn"
        duration={1500}
        useNativeDriver
      >
        <TouchableOpacity
          style={[Styles.button_overlay, { flexDirection: 'row', alignItems: 'center' }]}
          onPress={this.onTitlePress}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText style={styles.titleText}>{thread?.titleString()}</AppText>
              <Animatable.View
                style={{ marginLeft: 8, marginTop: 1, height: 16 }}
                animation={this.props.loading ? 'zoomIn' : 'zoomOut'}
                duration={200}
                useNativeDriver
              >
                <LottieView
                  style={{ flex: 1, width: 16, height: 16 }}
                  source={require('./img/loading.json')}
                  autoPlay
                  loop
                />
              </Animatable.View>
            </View>
            {thread?.isSingleThread()
              ? this.renderSingleThreadStatus()
              : this.renderGroupThreadStatus()}
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  renderButtons = () => {
    const { phoneNumber, thread } = this.props;
    if (!thread) return <View />;
    return (
      <View style={styles.buttonsContainer}>
        {!phoneNumber && phoneNumber !== '' && (
          <TouchableOpacity onPress={this.onPhonePress}>
            <Image style={styles.call} source={require('./img/phoneCall.png')} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={this.onTitlePress}>
          <Image style={styles.setting} source={require('./img/setting.png')} />
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <SafeAreaView style={{ backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.rowContainer}>
            {this.renderBackButton()}
            {this.renderTitle()}
            {this.renderButtons()}
          </View>
          <View style={styles.separator} />
        </View>
      </SafeAreaView>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  thread: PropTypes.instanceOf(Object),
  singleThreadTargetUserPresence: PropTypes.string,
  onBackPress: PropTypes.func,
  onTitlePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  thread: {},
  singleThreadTargetUserPresence: null,
  onBackPress: () => {},
  onTitlePress: () => {},
};

const mapDispatchToProps = (dispatch) => ({
  getPresenceStatusUser: (userId, callback) => dispatch(getPresenceStatusUser(userId, callback)),
});

export default connect(null, mapDispatchToProps)(NavigationBar);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    paddingBottom: 0,
    height: 48,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 0,
    width: 52,
    height: 44,
    backgroundColor: '#f000',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: TITLE_MARGIN_TOP,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#0000',
  },
  titleText: {
    flex: 0,
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#202020',
    fontSize: 15,
    fontWeight: '400',
  },
  statusContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: STATUS_MARGIN_TOP,
  },
  statusText: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#ff00',
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  status: {
    flex: 0,
    marginTop: 2,
    marginRight: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: Colors.neutral5,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
    marginRight: 0,
  },
  call: {
    width: 22,
    height: 44,
    resizeMode: 'contain',
    marginRight: 8,
    marginLeft: 16,
  },
  setting: {
    width: 28,
    height: 44,
    resizeMode: 'contain',
    marginRight: 16,
    marginLeft: 8,
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: TITLE_MARGIN_TOP,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#0000',
    opacity: 0.8,
  },
});
