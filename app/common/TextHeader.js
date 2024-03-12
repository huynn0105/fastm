import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import PropTypes from 'prop-types';
import colors from '../constants/colors';

import AppText from '../componentV3/AppText';


const _ = require('lodash');

// --------------------------------------------------

class TextHeader extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress();
  }
  render() {
    const {
      style,
      title, titleStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <AppText style={[styles.titleText, titleStyle]}>
          {title}
        </AppText>
        <KJTouchableOpacity
          style={styles.button}
          onPress={this.onPress}
        />
      </View>
    );
  }
}

// --------------------------------------------------

TextHeader.propTypes = {
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  onPress: PropTypes.func,
};

TextHeader.defaultProps = {
  title: 'Title',
  onPress: () => {},
};

export default TextHeader;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
    // backgroundColor: colors.separator,
  },
  titleText: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 4,
    fontSize: 15,
    color: '#8C8D99',
  },
  button: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
