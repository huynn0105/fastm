import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import AppColors from '../constants/colors';
import AppText from '../componentV3/AppText';

import { Gift } from '../models';

import KJImage from './KJImage';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

class GiftRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.gift);
  }
  render() {
    const {
      style,
      gift,
      isArrowHidden, isSeparatorHidden,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          onPress={this.onPress}
        >
          <View style={styles.row}>
            <KJImage
              style={styles.image}
              source={gift.imageURI()}
              defaultSource={gift.imagePlaceholder()}
            />
            <View style={styles.body}>
              <AppText style={styles.titleText}>
                {gift.title}
              </AppText>
              <AppText style={styles.pointsText}>
                {`${gift.redeemPointsString()} điểm`}
              </AppText>
            </View>
            {
              isArrowHidden ? null :
              <Arrow />
            }
          </View>
        </TouchableOpacity>
        {
          isSeparatorHidden ? null :
          <Seperator />
        }
      </View>
    );
  }
}

// --------------------------------------------------

const Arrow = () => (
  <Image
    style={{
      width: 14,
      height: 14,
    }}
    source={require('./img/arrow_right.png')}
    resizeMode={'contain'}
  />
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

GiftRow.propTypes = {
  gift: PropTypes.instanceOf(Gift),
  isArrowHidden: PropTypes.bool,
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

GiftRow.defaultProps = {
  isArrowHidden: false,
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

export default GiftRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.navigation_bg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.navigation_bg,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 12,
    marginRight: 8,
    backgroundColor: colors.navigation_bg,
  },
  titleText: {
    color: '#131313',
    fontSize: 16,
  },
  pointsText: {
    marginTop: 6,
    color: AppColors.text_blue,
    fontSize: 14,
  },
});
