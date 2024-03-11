import React, { Component } from 'react';
import { StyleSheet, Image, Text } from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from '../KJTouchableOpacity';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';

const _ = require('lodash');

// --------------------------------------------------

class TextButton extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress();
  };
  render() {
    const { style, title, titleStyle, isArrowHidden, iconSource } = this.props;
    let source = ICON_PATH.arrow_right;
    if (iconSource !== undefined) {
      source = iconSource;
    }
    return (
      <KJTouchableOpacity
        testID={this.props.testID}
        style={[styles.container, style]}
        onPress={this.onPress}
      >
        <AppText style={[styles.titleText, titleStyle]}>{title}</AppText>
        {isArrowHidden ? null : (
          <Image style={styles.arrowImage} source={source} resizeMode="contain" />
        )}
      </KJTouchableOpacity>
    );
  }
}

// --------------------------------------------------

TextButton.propTypes = {
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  isArrowHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

TextButton.defaultProps = {
  title: 'Button',
  isArrowHidden: false,
  onPress: () => {},
};

export default TextButton;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#f000',
  },
  titleText: {
    backgroundColor: '#0000',
    color: '#0080DC',
    fontSize: 14,
    fontWeight: '300',
  },
  arrowImage: {
    alignSelf: 'center',
    marginLeft: 6,
    marginTop: 2,
    width: 8,
    height: 14,
  },
});
