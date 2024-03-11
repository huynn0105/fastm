/* eslint no-use-before-define: ["error", { "variables": false }], padded-blocks: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { Image, Text } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';

const Color = {
  defaultColor: '#b2b2b2',
  backgroundTransparent: 'transparent',
  defaultBlue: '#0084ff',
  leftBubbleBackground: '#f0f0f0',
  white: '#fff',
  carrot: '#e67e22',
  emerald: '#2ecc71',
  peterRiver: '#3498db',
  wisteria: '#8e44ad',
  alizarin: '#e74c3c',
  turquoise: '#1abc9c',
  midnightBlue: '#2c3e50',
  optionTintColor: '#007AFF',
  timeTextColor: '#aaa',
};


const { carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue } = Color;
// TODO
// 3 words name initials
// handle only alpha numeric chars

const _ = require('lodash');

export default class CharAvatar extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  
  setAvatarColor() {
    const userName = this.props.defaultName || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[name.length - 1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

    this.avatarColor = colors[sumChars % colors.length];
  }

  renderInitials() {
    return <AppText style={[styles.textStyle, this.props.textStyle]}>{this.avatarName}</AppText>;
  }

  render() {
    this.setAvatarColor();
    const { source, defaultSource, defaultName, avatarStyle } = this.props;
    return (
      <KJTouchableOpacity
        disabled={!this.props.onPress}
        onPress={() => {
          const { onPress, ...other } = this.props;
          if (this.props.onPress) {
            this.props.onPress(other);
          }
        }}
        style={[styles.avatarStyle, this.props.avatarStyle, { backgroundColor: this.avatarColor }]}
        accessibilityTraits="image"
      >
        {
          (source && (!isEmpty(source.uri) || source.uri !== '')) ?

            <KJImage
              style={[styles.avatarStyle, avatarStyle]}
              source={source}
              // defaultSource={defaultSource}
              resizeMode="cover"
            />
            :
            this.renderInitials()
        }
      </KJTouchableOpacity>
    );
  }
}

const styles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarTransparent: {
    backgroundColor: Color.backgroundTransparent,
  },
  textStyle: {
    color: Color.white,
    fontSize: 16,
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '500',
  },
};

CharAvatar.defaultProps = {
  onPress: null,
  avatarStyle: {},
  textStyle: {},
};

CharAvatar.propTypes = {
  onPress: PropTypes.func,
  avatarStyle: Image.propTypes.style,
  textStyle: Text.propTypes.style,
};
