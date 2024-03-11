import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
import { Gift } from '../models';
import GiftRow from './GiftRow';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

class GiftsList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem(item, isSeparatorHidden = false) {
    return (
      <GiftRow
        gift={item}
        isSeparatorHidden={isSeparatorHidden}
        onPress={this.props.onItemPress}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const {
      style,
      data, extraData, emptyDataText,
      isLastRowSeparatorHidden,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          data.length === 0 ?
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              {emptyDataText}
            </AppText>
          </View>
          :
          <FlatList
            data={data}
            keyExtractor={item => item.uid}
            extraData={extraData}
            renderItem={(row) => {
              // hiden separator on last row
              const isLastRow = row.index === data.length - 1;
              const isSeparatorHidden = isLastRow && isLastRowSeparatorHidden;
              return this.renderItem(row.item, isSeparatorHidden);
            }}
          />
        }
      </View>
    );
  }
}

// --------------------------------------------------

GiftsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Gift)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

GiftsList.defaultProps = {
  data: [],
  emptyDataText: 'Không có quà tặng nào',
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default GiftsList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 0,
    backgroundColor: colors.navigation_bg,
  },
  emptyContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: colors.navigation_bg,
  },
  emptyText: {
    alignSelf: 'center',
    paddingTop: 44,
    paddingBottom: 28,
    fontSize: 18,
    fontWeight: '600',
    color: '#808080',
  },
});

// --------------------------------------------------

// function getTestData() {
//   const testData = [
//     {
//       uid: '1',
//       title: 'Iphone X 64GB trắng',
//       details: 'Nhận ngay Iphone X 64GB trắng khi bạn đặt đủ 10,000 điểm tích thưởng',
//       content: 'Rome\'s history spans more than 2,500 years. ....',
//       image: 'http://via.placeholder.com/350x350',
//       redeemPoints: 100,
//       totalRedeems: 15,
//       totalViews: 2000,
//     },
//     {
//       uid: '2',
//       title: 'Iphone X 64GB trắng',
//       details: 'Nhận ngay Iphone X 64GB trắng khi bạn đặt đủ 10,000 điểm tích thưởng',
//       content: 'Rome\'s history spans more than 2,500 years. ....',
//       image: 'http://via.placeholder.com/350x350',
//       redeemPoints: 100,
//       totalRedeems: 15,
//       totalViews: 2000,
//     },
//     {
//       uid: '3',
//       title: 'Iphone X 64GB trắng',
//       details: 'Nhận ngay Iphone X 64GB trắng khi bạn đặt đủ 10,000 điểm tích thưởng',
//       content: 'Rome\'s history spans more than 2,500 years. ....',
//       image: 'http://via.placeholder.com/350x350',
//       redeemPoints: 100,
//       totalRedeems: 15,
//       totalViews: 2000,
//     },
//   ];
//   for (let i = 0; i < testData.length; i += 1) {
//     Object.setPrototypeOf(testData[i], Gift.prototype);
//   }
//   return testData;
// }
