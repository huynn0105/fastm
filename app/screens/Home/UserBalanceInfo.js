import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import { User } from '../../models';

import { prettyNumberString, prettyMoneyString } from '../../utils/Utils';

import KJTouchableOpacity from '../../common/KJTouchableOpacity';

// --------------------------------------------------

class UserBalanceInfo extends PureComponent {
  onMoneyPress = () => {
    this.props.onMoneyPress();
  }
  onPointsPress = () => {
    this.props.onPointsPress();
  }
  // --------------------------------------------------
  render() {
    const props = this.props;
    const {
      user,
    } = this.props;
    const moneyString = prettyMoneyString(user.totalMoney, '');
    const pointsString = prettyNumberString(user.totalPoint);
    return (
      <View style={[styles.container, props.style]}>
        <Text style={styles.titleText}>
          {'Thu nhập tích lũy'}
        </Text>
        <View style={styles.balanceContainer}>
          <BalanceButton
            style={styles.moneyButton}
            icon={require('./img/money_bag.png')}
            title={moneyString}
            details={'vnđ'}
            detailsTextStyle={{ marginBottom: 8 }}
            onActionPress={this.onMoneyPress}
          />
          <View style={styles.verticalLine} />
          <BalanceButton
            style={styles.pointsButton}
            icon={require('./img/gift_box.png')}
            title={pointsString}
            details={'điểm'}
            onActionPress={this.onPointsPress}
          />
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

const BalanceButton = (props) => (
  <View
    style={[{
      flex: 0,
      justifyContent: 'center',
      alignItems: 'stretch',
    }, props.style]}
  >
    <KJTouchableOpacity
      onPress={() => props.onActionPress()}
    >
      <Image
        style={{
          alignSelf: 'center',
          width: '28%',
          marginTop: 2,
          marginRight: 4,
        }}
        source={props.icon}
        resizeMode={'contain'}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text style={{ color: '#0097DF', fontSize: 16, fontWeight: '600' }}>
          {`${props.title} `}
        </Text>
        <Text style={[{ color: '#0097DF', fontSize: 10, fontWeight: '300' }, props.detailsTextStyle]}>
          {`${props.details} `}
        </Text>
        <Image
          style={{ alignSelf: 'center', width: 12 }}
          source={require('./img/arrow_right.png')}
          resizeMode={'contain'}
        />
      </View>
    </KJTouchableOpacity>
  </View>
);

// --------------------------------------------------

UserBalanceInfo.propTypes = {
  user: PropTypes.instanceOf(User),
  onMoneyPress: PropTypes.func,
  onPointsPress: PropTypes.func,
};

UserBalanceInfo.defaultProps = {
  onMoneyPress: () => { },
  onPointsPress: () => { },
};

export default UserBalanceInfo;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 16,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
  titleText: {
    color: '#0097DF',
  },
  balanceContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  moneyButton: {
    flex: 0.5,
  },
  pointsButton: {
    flex: 0.5,
  },
  verticalLine: {
    width: 1,
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
    backgroundColor: '#92DAFD',
  },
});
