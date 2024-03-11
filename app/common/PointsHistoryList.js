import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
import { PointsTransaction } from '../models';

import PointsHistoryRow from './PointsHistoryRow';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

const LogTAG = '7777: PointsHistoryList.js'; // eslint-disable-line

class PointsHistoryList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem(item, isSeparatorHidden = false) {
    return (
      <PointsHistoryRow
        pointsTransaction={item}
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

PointsHistoryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(PointsTransaction)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

PointsHistoryList.defaultProps = {
  data: [],
  emptyDataText: 'Không có giao dịch nào',
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default PointsHistoryList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 2,
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

// getTestData() {
//   const testData = [
//     {
//       uid: '1',
//       title: 'Cộng điểm tích lũy T9/2017 từ SP FE Credit PreDSA - platinum',
//       amount: 510,
//       status: '1',
//       time: 1507005638,
//     },
//     {
//       uid: '2',
//       title: 'Cộng điểm tích lũy T8/2017 từ SP FE Credit PreDSA - platinum',
//       amount: -200,
//       status: '1',
//       time: 1506545638,
//     },
//     {
//       uid: '3',
//       title: 'Cộng điểm tích lũy T7/2017 từ SP FE Credit PreDSA - platinum',
//       amount: 510,
//       status: '2',
//       time: 1504545638,
//     },
//   ];
//   for (let i = 0; i < testData.length; i += 1) {
//     Object.setPrototypeOf(testData[i], PointsTransaction.prototype);
//   }
//   return testData;
// }
