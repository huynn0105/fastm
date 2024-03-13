/* eslint no-use-before-define: ["error", { "variables": false }], padded-blocks: 0 */

import { Image, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';

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
const COLORS = [carrot, emerald, peterRiver, wisteria, alizarin, turquoise, midnightBlue];

export default class CharAvatar extends PureComponent {
  onPress = () => {
    const { onPress, ...other } = this.props;
    if (onPress) {
      onPress(other);
    }
  };
  getColorNameFrom(userName = '') {
    let avatarName = '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      avatarName = `${name[0].charAt(0)}${name[name.length - 1].charAt(0)}`;
    }

    let sumChars = 0;
    for (let i = 0; i < userName.length; i += 1) {
      sumChars += userName.charCodeAt(i);
    }
    const avatarColor = COLORS[sumChars % COLORS.length];

    return { avatarColor, avatarName };
  }

  renderInitials(name) {
    return name && name !== '' ? (
      <AppText style={[styles.textStyle, this.props.textStyle]}>{name}</AppText>
    ) : (
      this.renderImage(this.props.defaultImage || IMAGE_PATH.unknown)
    );
  }

  renderImage(source) {
    const { style } = this.props;
    return <FastImage style={[styles.avatarStyle, style]} source={source} resizeMode="cover" />;
  }

  render() {
    const { source, style } = this.props;
    const { avatarColor, avatarName } = this.getColorNameFrom(this.props.defaultName || '');

    return (
      <TouchableOpacity
        disabled={!this.props.onPress}
        onPress={this.onPress}
        style={[styles.avatarStyle, style, { backgroundColor: avatarColor }]}
        accessibilityTraits="image"
      >
        {source && source.uri ? this.renderImage(source) : this.renderInitials(avatarName)}
      </TouchableOpacity>
    );
  }
}

const styles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SW(36),
    height: SW(36),
    borderRadius: SW(18),
  },
  avatarTransparent: {
    backgroundColor: Color.backgroundTransparent,
  },
  textStyle: {
    color: Color.white,
    fontSize: SH(16),
    backgroundColor: Color.backgroundTransparent,
    fontWeight: '500',
  },
};

CharAvatar.defaultProps = {
  onPress: null,
  avatarStyle: {},
  textStyle: {},
  defaultName: '',
};

CharAvatar.propTypes = {
  onPress: PropTypes.func,
  avatarStyle: Image.propTypes.style,
  textStyle: Text.propTypes.style,
  defaultName: PropTypes.string,
};
