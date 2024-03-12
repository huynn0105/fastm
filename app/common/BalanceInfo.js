import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import colors from '../constants/colors';
import AppText from '../componentV3/AppText';

// --------------------------------------------------

class BalanceInfo extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const {
      style,
      title, titleStyle,
      iconType, iconStyle,
      balance, balanceStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <AppText style={[styles.title, titleStyle]}>
          {title}
        </AppText>
        <View style={styles.balanceContainer}>
          {
            iconType === 'money' ?
              <Image
                style={[{ width: 20, height: 20 }, iconStyle]}
                source={require('./img/money_bag.png')}
                resizeMode="contain"
              /> :
              <Image
                style={[{ width: 20, height: 20 }, iconStyle]}
                source={require('./img/gift_box.png')}
                resizeMode="contain"
              />
          }
          <AppText style={[styles.balanceText, balanceStyle]}>
            {balance}
          </AppText>
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

BalanceInfo.propTypes = {
  iconType: PropTypes.string,
  iconStyle: Image.propTypes.style,
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  balance: PropTypes.string,
  balanceStyle: Text.propTypes.style,
};

BalanceInfo.defaultProps = {
  iconType: 'money',
};

export default BalanceInfo;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.navigation_bg,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  titleText: {
    fontSize: 16,
    color: '#7F7F7F',
  },
  balanceText: {
    marginLeft: 4,
    fontSize: 20,
    fontWeight: '700',
    color: '#25A5F7',
  },
});
