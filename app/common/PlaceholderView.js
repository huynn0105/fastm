import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';
import PropTypes from 'prop-types';
import { ICON_PATH } from '../assets/path';
const _ = require('lodash');

// --------------------------------------------------

class PlaceholderView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const { containerStyle, text, icon, textStyle, iconStyle, isIconHidden, onPress } = this.props;
    return (
      <KJTouchableOpacity onPress={onPress}>
        <View style={[styles.container, containerStyle]}>
          {isIconHidden ? null : <Image style={[styles.icon, iconStyle]} source={icon} />}
          <AppText style={[styles.text, textStyle]}>{text}</AppText>
        </View>
      </KJTouchableOpacity>
    );
  }
}

// --------------------------------------------------

PlaceholderView.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  // containerStyle: View.propTypes.style,
  textStyle: Text.propTypes.style,
  iconStyle: Image.propTypes.style,
  isIconHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

PlaceholderView.defaultProps = {
  text: 'No data',
  icon: ICON_PATH.empty,
  isIconHidden: false,
  onPress: () => {},
};

export default PlaceholderView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 64,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fefefe',
  },
  text: {
    alignSelf: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '400',
    color: '#808080',
    backgroundColor: '#0000',
  },
  icon: {
    alignSelf: 'center',
    resizeMode: 'contain',
    backgroundColor: '#0000',
  },
});
