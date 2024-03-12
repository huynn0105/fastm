import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from 'app/components/common/KJButton';
import BaseNavigationBar from '../../components/NavigationBar';

/* eslint-disable */
const LOG_TAG = 'CreateGroupChat/NavigationBar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  onDonePress = () => {
    this.props.onDonePress();
  }
  // --------------------------------------------------
  render() {
    const { isDoneButtonEnable } = this.props;
    const doneButtonColor = isDoneButtonEnable ? '#007BFA' : '#808080';
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{ backgroundColor: '#eee' }}
          title={'     Cuộc trò chuyện mới'}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/close.png')}
              leftIconStyle={{ marginLeft: 0 }}
              onPress={this.onCancelPress}
            />,
          ]}
          rightButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.rightBarButton}
              title={'Tiếp tục'}
              titleStyle={{ color: doneButtonColor }}
              onPress={this.onDonePress}
            />,
          ]}
          isSeparatorHidden
        />
      </View>
    );
  }
}

// --------------------------------------------------

NavigationBar.propTypes = {
  onCancelPress: PropTypes.func,
  onDonePress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onCancelPress: () => {},
  onDonePress: () => { },
};

export default NavigationBar;

// --------------------------------------------------

const styles = StyleSheet.create({
  barButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f000',
  },
  rightBarButton: {
    marginRight: 4,
    width: 60,
    height: 44,
    backgroundColor: '#f000',
  },
});
