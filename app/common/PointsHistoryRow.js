import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
import { PointsTransaction } from '../models';

import KJTouchableOpacity from './KJTouchableOpacity';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

class PointsHistoryRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.pointsTransaction);
  }
  render() {
    const {
      style,
      pointsTransaction,
      isSeparatorHidden,
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
            {pointsTransaction.title}
          </AppText>
          <TextInfo
            style={{ marginTop: 8 }}
            title={pointsTransaction.amount > 0 ? 'Cộng điểm:' : 'Rút điểm:'}
            details={pointsTransaction.amountString()}
            detailsStyle={[styles.money, pointsTransaction.amountStyle()]}
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
              details={pointsTransaction.statusString()}
              detailsStyle={[styles.status, pointsTransaction.statusStyle()]}
            />
            <TimeInfo
              time={pointsTransaction.timeString()}
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

PointsHistoryRow.propTypes = {
  pointsTransaction: PropTypes.instanceOf(PointsTransaction),
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

PointsHistoryRow.defaultProps = {
  isSeparatorHidden: false,
  onPress: () => {},
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

export default PointsHistoryRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.navigation_bg,
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
