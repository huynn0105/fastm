import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

import KJButton from 'app/components/common/KJButton';
import BaseNavigationBar from 'app/components/NavigationBar';

/* eslint-disable */
const LOG_TAG = 'CreateGroupChat/NavigationBar.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// NavigationBar
// --------------------------------------------------

class NavigationBar extends PureComponent {
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  // --------------------------------------------------
  render() {
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{ backgroundColor: '#eee' }}
          title={'Chuyển tiếp'}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/close.png')}
              leftIconStyle={{ marginLeft: 0 }}
              onPress={this.onCancelPress}
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
};

NavigationBar.defaultProps = {
  onCancelPress: () => {},
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
