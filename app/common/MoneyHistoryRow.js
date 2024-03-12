import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import { MoneyTransaction } from '../models';
import AppText from '../componentV3/AppText';
import KJTouchableOpacity from './KJTouchableOpacity';

const _ = require('lodash');

// --------------------------------------------------

class MoneyHistoryRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.moneyTransaction);
  }
  render() {
    const {
      style,
      moneyTransaction, isSeparatorHidden,
    } = this.props;
    return (
      <View
        style={[styles.container, style]}
      >
        <KJTouchableOpacity
          onPress={this.onPress}
        >
          <AppText
            style={{ marginTop: 0 }}
          >
            {moneyTransaction.title}
          </AppText>
          <TextInfo
            style={{ marginTop: 8 }}
            title={'Số tiền:'}
            details={moneyTransaction.amountString()}
            detailsStyle={[styles.money, moneyTransaction.amountStyle()]}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              marginTop: 4,
            }}
          >
            <TextInfo
              style={{ flex: 1 }}
              title={'Trạng thái:'}
              details={moneyTransaction.statusString()}
              detailsStyle={[styles.status, moneyTransaction.statusStyle()]}
            />
            <TimeInfo
              time={moneyTransaction.timeString()}
            />
          </View>
          <View style={{ height: 20 }} />
          {
            isSeparatorHidden ? null :
            <Seperator />
          }
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const TextInfo = (props) => (
  <View
    style={[{
      flex: 0,
      flexDirection: 'row',
    }, props.style]}
  >
    <AppText
      style={{
        color: '#7F7F7F',
      }}
    >
      {props.title}
    </AppText>
    <AppText
      style={[{
        marginLeft: 6,
        color: '#7F7F7F',
      }, props.detailsStyle]}
    >
      {props.details}
    </AppText>
  </View>
);

const TimeInfo = (props) => (
  <View
    style={[{
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }, props.style]}
  >
    <Image
      style={{ width: 14, height: 14 }}
      source={require('./img/time2.png')}
      resizeMode="contain"
    />
    <AppText
      style={{
        marginLeft: 6,
        color: '#7f7f7f',
        fontSize: 12,
      }}
    >
      {props.time}
    </AppText>
  </View>
);

const Seperator = () => (
  <View
    style={{
      height: 1,
      marginTop: 0,
      backgroundColor: '#E9E9E9',
    }}
  />
);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
  },
  title: {
    color: '#7F7F7F',
    fontSize: 14,
  },
  positiveMoney: {
    color: '#2696E0',
  },
  negativeMoney: {
    color: '#FC1520',
  },
  money: {
    color: '#2696E0',
    fontSize: 14,
    fontWeight: '700',
  },
  status: {
    color: '#2696E0',
    fontSize: 14,
    fontWeight: '400',
  },
});

// --------------------------------------------------

MoneyHistoryRow.propTypes = {
  moneyTransaction: PropTypes.instanceOf(MoneyTransaction),
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

MoneyHistoryRow.defaultProps = {
  isSeparatorHidden: false,
  onPress: () => console.log('onPress'),
};

// test
// MoneyHistoryRow.defaultProps = {
//   title: 'Doanh số chốt T9/2017 từ SP FE Credit PreDSA - platinum',
//   amount: '+ 200,000 VND',
//   status: 'Hoàn tất',
//   time: '22/12/2017',
//   statusStyle: styles.statusStyle,
//   amountStyle: styles.negativeMoney,
//   isSeparatorHidden: false,
//   onPress: () => console.log('onPress'),
// };
// end

export default MoneyHistoryRow;
