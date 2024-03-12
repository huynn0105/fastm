import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
} from 'react-native';

import Svg, {
  Ellipse,
} from 'react-native-svg';

import PropTypes from 'prop-types';

import CharAvatar from 'app/components/CharAvatar';
import AppColors from '../../constants/colors';
import { User } from '../../models';

import KJTouchableOpacity from '../../common/KJTouchableOpacity';

// --------------------------------------------------

const LOG_TAG = '7777: UserHeader.js'; // eslint-disable-line

const SCREEN_SIZE = Dimensions.get('window');

const BOTTOM_ECLIPSE_WIDTH = SCREEN_SIZE.width;
const BOTTOM_ECLIPSE_HEIGHT = BOTTOM_ECLIPSE_WIDTH / 6.28;
const BOTTOM_ECLIPSE_CX = BOTTOM_ECLIPSE_WIDTH / 2.0;
const BOTTOM_ECLIPSE_CY = BOTTOM_ECLIPSE_HEIGHT;
const BOTTOM_ECLIPSE_RX = BOTTOM_ECLIPSE_WIDTH * 0.64;
const BOTTOM_ECLIPSE_RY = BOTTOM_ECLIPSE_HEIGHT / 1.68;

const _ = require('lodash');

// --------------------------------------------------

class UserHeader extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onAvatarPress = () => {
    this.props.onAvatarPress();
  }
  // --------------------------------------------------
  render() {
    const {
      user, style, avatarImageStyle, backgroundImageStyle,
    } = this.props;
    const flatStyle = StyleSheet.flatten(style);
    return (
      <View style={[styles.container, style]}>
        <Image
          style={[
            styles.backgroundImage,
            backgroundImageStyle,
            { width: flatStyle.width, height: flatStyle.height },
          ]}
          source={user.wallImageURI()}
          resizeMode={'cover'}
          renderToHardwareTextureAndroid
          shouldRasterizeIOS
        />
        <Svg
          style={styles.bottomEclipse}
          width={`${BOTTOM_ECLIPSE_WIDTH}`}
          height={`${BOTTOM_ECLIPSE_HEIGHT}`}
        >
          <Ellipse
            cx={`${BOTTOM_ECLIPSE_CX}`}
            cy={`${BOTTOM_ECLIPSE_CY}`}
            rx={`${BOTTOM_ECLIPSE_RX}`}
            ry={`${BOTTOM_ECLIPSE_RY}`}
            stroke={AppColors.app_theme}
            strokeWidth="1"
            fill="#fff"
          />
        </Svg>
        <KJTouchableOpacity
          activeOpacity={0.65}
          onPress={this.onAvatarPress}
        >
          <CharAvatar
            avatarStyle={[styles.avatarImage, avatarImageStyle]}
            source={user.avatarImageURI()}
            defaultSource={user.avatarImagePlaceholder()}
            defaultName={user.fullName}
          />
        </KJTouchableOpacity>
        <Text
          style={styles.nameText}
        >
          {user.fullName.toUpperCase()}
        </Text>
      </View>
    );
  }
}

// --------------------------------------------------

UserHeader.propTypes = {
  user: PropTypes.instanceOf(User),
  onAvatarPress: PropTypes.func,
};

UserHeader.defaultProps = {
  onAvatarPress: () => {},
};

export default UserHeader;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    top: -4,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 0,
  },
  bottomEclipse: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -8,
    backgroundColor: '#0000',
  },
  nameText: {
    marginTop: 8,
    backgroundColor: '#0000',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: '#0005',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1.5,
  },
});
