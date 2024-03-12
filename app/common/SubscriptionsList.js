/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { Subscription } from 'app/models';
import PlaceholderView from 'app/common/PlaceholderView';

import SubscriptionRow from './SubscriptionRow';

const _ = require('lodash');

// --------------------------------------------------
// SubscriptionsList
// --------------------------------------------------

class SubscriptionsList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderPlaceholder() {
    const {
      emptyDataText,
    } = this.props;
    return (
      <PlaceholderView
        containerStyle={styles.emptyContainer}
        text={emptyDataText}
      />
    );
  }
  renderItem(item, isSeparatorHidden = false) {
    return (
      <SubscriptionRow
        subscription={item}
        isSeparatorHidden={isSeparatorHidden}
        onPress={this.props.onItemPress}
      />
    );
  }
  renderList() {
    const {
      data, extraData,
      isLastRowSeparatorHidden,
    } = this.props;
    return (
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
    );
  }
  // --------------------------------------------------
  render() {
    const {
      style,
      data,
    } = this.props;
    return (
      <View style={[styles.container, style]} testID="test_SubscriptionsList" >
        {
          data.length === 0 ?
          this.renderPlaceholder() :
          this.renderList()
        }
      </View>
    );
  }
}

// --------------------------------------------------

SubscriptionsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

SubscriptionsList.defaultProps = {
  data: [],
  emptyDataText: 'Không có công việc nào',
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default SubscriptionsList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 2,
    backgroundColor: '#0000',
  },
  emptyContainer: {
    // height: 112,
    marginTop: 0,
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
    backgroundColor: '#E6EBFF',
  },
});

// --------------------------------------------------

// function getTestData() {
//   const testData = [
//     {
//       uid: '1',
//       projectID: '1',
//       projectDetails: 'SP FE Credit PreDSA',
//       roleID: '1',
//       roleDetails: 'DSA - DSA3',
//       levelID: '1',
//       levelDetails: 'Platinum',
//       partnerWebsite: 'http://www.fecredit.com.vn',
//       detailsURL: 'http://crm.appay.vn/fe_credit/pre_dsa',
//       logoImage: 'http://125.212.211.29/docs/fecredit.jpg',
//       featureImage: 'http://crm.appay.vn/assets/img-temp/600x300/img1.png',
//       totalMoney: 2250000,
//       totalPoint: 1546,
//     },
//     {
//       uid: '1',
//       projectID: '1',
//       projectDetails: 'SP FE Credit PreDSA',
//       roleID: '1',
//       roleDetails: 'DSA - DSA3',
//       levelID: '1',
//       levelDetails: 'Platinum',
//       partnerWebsite: 'http://www.fecredit.com.vn',
//       detailsURL: 'http://crm.appay.vn/fe_credit/pre_dsa',
//       logoImage: 'http://125.212.211.29/docs/fecredit.jpg',
//       featureImage: 'http://crm.appay.vn/assets/img-temp/600x300/img1.png',
//       totalMoney: 2250000,
//       totalPoint: 1546,
//     },
//     {
//       uid: '1',
//       projectID: '1',
//       projectDetails: 'SP FE Credit PreDSA',
//       roleID: '1',
//       roleDetails: 'DSA - DSA3',
//       levelID: '1',
//       levelDetails: 'Platinum',
//       partnerWebsite: 'http://www.fecredit.com.vn',
//       detailsURL: 'http://crm.appay.vn/fe_credit/pre_dsa',
//       logoImage: 'http://125.212.211.29/docs/fecredit.jpg',
//       featureImage: 'http://crm.appay.vn/assets/img-temp/600x300/img1.png',
//       totalMoney: 2250000,
//       totalPoint: 1546,
//     },
//   ];
//   for (let i = 0; i < testData.length; i++) {
//     Object.setPrototypeOf(testData[i], Subscription.prototype);
//   }
//   return testData;
// }
