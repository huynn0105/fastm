import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Svg, {
  Ellipse,
} from 'react-native-svg';

import PropTypes from 'prop-types';
import CharAvatar from 'app/components/CharAvatar';
import KJImage from 'app/components/common/KJImage';

import AppColors from '../../constants/colors';
import { User } from '../../models';

import UserStatusContainer from './UserStatusContainer';

// --------------------------------------------------

const LOG_TAG = '7777: UserHeaderContainer.js'; // eslint-disable-line

const SCREEN_SIZE = Dimensions.get('window');

const TOP_SPACING = 72;
const CAMERA_BUTTON_BOTTOM = 12;
const BACKGROUND_IMAGE_WIDTH = SCREEN_SIZE.width;
const BACKGROUND_IMAGE_HEIGHT = TOP_SPACING + 72 + 16;

const BOTTOM_ECLIPSE_WIDTH = SCREEN_SIZE.width;
const BOTTOM_ECLIPSE_HEIGHT = BOTTOM_ECLIPSE_WIDTH / 6.28;
const BOTTOM_ECLIPSE_CX = BOTTOM_ECLIPSE_WIDTH / 2.0;
const BOTTOM_ECLIPSE_CY = TOP_SPACING - 4;
const BOTTOM_ECLIPSE_RX = BOTTOM_ECLIPSE_WIDTH * 0.64;
const BOTTOM_ECLIPSE_RY = BOTTOM_ECLIPSE_HEIGHT / 1.58;

const _ = require('lodash');

// --------------------------------------------------

class UserHeaderContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onAvatarPress = () => {
    this.props.onAvatarPress();
  }
  onWallPress = () => {
    this.props.onWallPress();
  }
  // --------------------------------------------------
  renderWall() {
    return (
      <View style={styles.wallContainer}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: BACKGROUND_IMAGE_HEIGHT - 36,
            height: SCREEN_SIZE.width,
            borderRadius: SCREEN_SIZE.width / 2,
            backgroundColor: AppColors.navigation_bg,
            transform: [
              { scaleX: 2 },
            ],
          }}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={this.onWallPress}
        >
          <KJImage
            style={styles.cameraIcon}
            source={require('./img/camera.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View >
    );
  }
  renderAvatar() {
    const {
      user,
    } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={this.onAvatarPress}
        >
          <View style={{ flex: 0 }}>
            <CharAvatar
              avatarStyle={styles.avatarImage}
              source={user.avatarImageURI()}
              defaultSource={user.avatarImagePlaceholder()}
              defaultName={user.fullName}
              textStyle={styles.charAvatarStyle}
            />
            <View style={styles.editIconContainer}>
              <KJImage
                style={styles.editIcon}
                source={require('./img/pencil.png')}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderUserInfo() {
    const {
      user,
    } = this.props;
    return (
      <View style={styles.userInfoContainer}>
        <Text style={styles.nameText}>
          {user.fullName}
        </Text>
        <UserStatusContainer
          user={user}
        />
      </View>
    );
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderWall()}
        {this.renderAvatar()}
        {this.renderUserInfo()}
      </View>
    );
  }
}

// --------------------------------------------------

UserHeaderContainer.propTypes = {
  user: PropTypes.instanceOf(User),
};

UserHeaderContainer.defaultProps = {

};

export default UserHeaderContainer;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    // paddingBottom: 16,
    backgroundColor: AppColors.navigation_bg,
    overflow: 'hidden',
  },
  wallContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BACKGROUND_IMAGE_HEIGHT,
  },
  avatarContainer: {
    flex: 0,
    marginTop: TOP_SPACING - 8,
    backgroundColor: '#0000',
  },
  userInfoContainer: {
    marginTop: 8,
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: AppColors.navigation_bg,
    width: '100%',
    paddingBottom: 16,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: AppColors.navigation_bg,
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: BACKGROUND_IMAGE_WIDTH,
    height: BACKGROUND_IMAGE_HEIGHT,
    borderRadius: 0,
  },
  bottomEclipse: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0000',
  },
  editIconContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 4,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  editIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: CAMERA_BUTTON_BOTTOM,
    right: 8,
    padding: 4,
    backgroundColor: '#fff0',
  },
  cameraIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  nameText: {
    marginTop: 0,
    fontSize: 16,
    color: '#202020',
    backgroundColor: '#0000',
  },
  charAvatarStyle: {
    fontSize: 24,
    fontWeight: '500',
  },
});
