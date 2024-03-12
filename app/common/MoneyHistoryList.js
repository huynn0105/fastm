import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
import { MoneyTransaction } from '../models';

import MoneyHistoryRow from './MoneyHistoryRow';

const _ = require('lodash');

// --------------------------------------------------

const LogTAG = '7777: MoneyHistoryList.js'; // eslint-disable-line

class MoneyHistoryList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem(item, isSeparatorHidden = false) {
    return (
      <MoneyHistoryRow
        moneyTransaction={item}
        isSeparatorHidden={isSeparatorHidden}
        onPress={this.props.onItemPress}
      />
    );
  }
  render() {
    const {
      style,
      data, extraData,
      isLastRowSeparatorHidden,
    } = this.props;
    return (
      <View
        style={[styles.container, style]}
      >
        {
          data.length === 0 ?
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              {'Không có giao dịch nào'}
            </AppText>
          </View>
          :
          <FlatList
            data={data}
            extraData={extraData}
            keyExtractor={item => item.uid}
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

MoneyHistoryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(MoneyTransaction)),
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

MoneyHistoryList.defaultProps = {
  data: [],
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default MoneyHistoryList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 2,
    backgroundColor: '#fefefe',
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
    backgroundColor: '#fff',
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

// getTestData() {
//   const testData = [
//     {
//       title: 'Doanh số chốt T9/2017 từ SP FE Credit PreDSA - platinum',
//       amount: 200000,
//       status: 1,
//       time: 1507005638,
//     },
//     {
//       title: 'Doanh số chốt T9/2017 từ SP FE Credit PreDSA - platinum',
//       amount: -500000,
//       status: 1,
//       time: 1506545638,
//     },
//     {
//       title: 'Doanh số chốt T9/2017 từ SP FE Credit PreDSA - platinum',
//       amount: 200000,
//       status: 2,
//       time: 1504545638,
//     },
//   ];
//   for (let i = 0; i < testData.length; i += 1) {
//     Object.setPrototypeOf(testData[i], MoneyTransaction.prototype);
//   }
//   return testData;
// }
