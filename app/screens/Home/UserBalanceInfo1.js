import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { User } from 'app/models';

import KJInTouchableOpacity from 'app/common/KJInTouchableOpacity';

// --------------------------------------------------

/* eslint-disable */
import Utils, { prettyNumberString, prettyMoneyString } from 'app/utils/Utils';
const LOG_TAG = 'UserBalanceInfo1.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// UserBalanceInfo
// --------------------------------------------------

class UserBalanceInfo extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onMoneyPress = () => {
    this.props.onMoneyPress();
  }
  onPointPress = () => {
    this.props.onPointsPress();
  }
  // --------------------------------------------------
  renderMoney() {
    const { userTotalMoney, showSubContent } = this.props;
    const moneyString = prettyMoneyString(userTotalMoney, '');
    return (
      <View style={styles.moneyButton}>
        <KJInTouchableOpacity
          testID="test_home_money"
          onPressIn={this.onMoneyPress}
        >
          <Text style={styles.balanceTitle}>
            {'Thu nhập tích lũy'}
          </Text>
          {
            showSubContent &&
            <BalanceView
              amount={moneyString}
              unit={'vnđ'}
            />
          }
        </KJInTouchableOpacity>
      </View>
    );
  }
  renderPoints() {
    const { userTotalPoint, showSubContent } = this.props;
    const pointString = prettyNumberString(userTotalPoint);
    return (
      <View style={styles.pointButton}>
        <KJInTouchableOpacity
          testID="test_home_point"
          onPressIn={this.onPointPress}
        >
          <Text style={styles.balanceTitle}>
            {'Điểm tích lũy'}
          </Text>
          {
            showSubContent &&
            <BalanceView
              amount={pointString}
              unit={'điểm'}
            />
          }
        </KJInTouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.container]}>
        <LinearGradient
          style={styles.gradient}
          startPoint={{ x: 0.5, y: 0.0 }}
          endPoint={{ x: 0.5, y: 1.0 }}
          locations={[0.0, 1.0]}
          colors={['#00C5FAC6', '#0067C4C6']}
        />
        <View style={styles.row}>
          {this.renderMoney()}
          {this.renderPoints()}
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

const BalanceView = (props) => (
  <Animatable.View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
    }}
    animation="fadeIn"
    duration={2000}
    useNativeDriver
  >
    <Text style={styles.balanceAmount}>
      {`${props.amount} `}
    </Text>
    <Text style={styles.balanceUnit}>
      {`${props.unit} `}
    </Text>
    <Image
      style={{ alignSelf: 'center', width: 12 }}
      source={require('./img/arrow_right1.png')}
      resizeMode={'contain'}
    />
  </Animatable.View>
);

// --------------------------------------------------

UserBalanceInfo.propTypes = {
  user: PropTypes.instanceOf(User),
  onMoneyPress: PropTypes.func,
  onPointsPress: PropTypes.func,
  showSubContent: PropTypes.bool,
};

UserBalanceInfo.defaultProps = {
  onMoneyPress: () => { },
  onPointsPress: () => { },
  showSubContent: true,
};

export default UserBalanceInfo;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 0,
    height: 56,
    opacity: 1,
    backgroundColor: '#0000',
    zIndex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#0000',
    opacity: 0.8,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#0000',
  },
  moneyButton: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    paddingRight: 16,
    backgroundColor: '#0000',
  },
  pointButton: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    paddingLeft: 16,
    backgroundColor: '#0000',
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  balanceUnit: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 8,
  },
});
