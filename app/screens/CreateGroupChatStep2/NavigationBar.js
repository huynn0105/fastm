import KJButton from 'app/components/common/KJButton';
import BaseNavigationBar from 'app/components/NavigationBar';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

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
  };
  onDonePress = () => {
    this.props.onDonePress();
  };
  // --------------------------------------------------
  render() {
    const { isDoneButtonEnable } = this.props;
    const doneButtonColor = isDoneButtonEnable ? '#007BFA' : '#808080';
    return (
      <View>
        <BaseNavigationBar
          containerStyle={{ backgroundColor: '#fff' }}
          title={'       Đặt tên nhóm'}
          leftButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.barButton}
              leftIconSource={require('./img/back.png')}
              leftIconStyle={{ marginLeft: 0 }}
              onPress={this.onCancelPress}
            />,
          ]}
          rightButtons={[
            <KJButton
              key={'1'}
              containerStyle={styles.rightBarButton}
              title={'Tạo nhóm'}
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
  onDonePress: () => {},
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
    width: 68,
    height: 44,
    backgroundColor: '#f000',
  },
});
