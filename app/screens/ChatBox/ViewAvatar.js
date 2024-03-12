import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import CharAvatar from 'app/components/CharAvatar';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils, { getAppVersionAndBuild } from 'app/utils/Utils';
const LOG_TAG = 'ViewAvatar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ViewAvatar
// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

export default class ViewAvatar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onClosePress = () => {
    this.props.onClosePress();
  }

  render() {
    const { avatarURI, name, status, moveIn, close } = this.props;
    // const statusColor = User.getPresenceStatusColor(status);
    // const statusString = User.getPresenceStatusString(status);
    return (
      <TouchableOpacity
        style={[styles.touchContainer,
        moveIn ? {} : { top: 6000, bottom: 6000 }]}
        onPress={this.onClosePress}
        activeOpacity={1}
      >
        <Animatable.View
          style={[styles.container, moveIn ? {} : { top: 6000, bottom: 6000 }]}
          animation={close ? 'fadeOut' : 'fadeIn'}
          duration={300}
          useNativeDriver
        >
          <View style={styles.contentCotainer}>
            <View style={styles.background}>
              <Image
                style={styles.close}
                source={require('./img/close.png')}
                reziseMode="contain"
              />
            </View>
            <CharAvatar
              avatarStyle={styles.avatar}
              source={avatarURI}
              defaultName={name}
              textStyle={{
                color: '#fff',
                fontSize: 46,
              }}
            />
            <AppText style={styles.name}>
              {name}
            </AppText>
          </View>
        </Animatable.View>
      </TouchableOpacity >
    );
  }
}

// --------------------------------------------------

const styles = StyleSheet.create({
  touchContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  contentCotainer: {
    height: 180,
    width: SCREEN_SIZE.width - 32,
    alignItems: 'center',
    backgroundColor: '#0000',
    marginBottom: SCREEN_SIZE.height * 0.2,
  },
  background: {
    position: 'absolute',
    top: 40,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  close: {
    width: 20,
    height: 20,
    marginTop: 16,
    marginRight: 16,
  },
  avatar: {
    height: SCREEN_SIZE.width / 3.15,
    width: SCREEN_SIZE.width / 3.15,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: (SCREEN_SIZE.width / 3.15) / 2,
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    marginLeft: 0,
    marginRight: 0,
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  status: {
    marginRight: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#E6EBFF',
  },
});
