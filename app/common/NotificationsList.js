import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { Notification } from '../models';
import NotificationRow from './NotificationRow';
import PlaceholderView from './PlaceholderView';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

class NotificationsList extends Component {

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
  renderItem(notification, isSeparatorHidden = false) {
    return (
      <NotificationRow
        notification={notification}
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
        style={{
          backgroundColor: colors.separator,
        }}
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
    );
  }
  // --------------------------------------------------
  render() {
    const {
      data,
      containerStyle,
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
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

NotificationsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Notification)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

NotificationsList.defaultProps = {
  data: [],
  emptyDataText: 'Không có thông báo',
  isLastRowSeparatorHidden: false,
  onItemPress: () => { },
};

export default NotificationsList;

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
    // height: 112,
    paddingBottom: 16,
    backgroundColor: colors.navigation_bg,
  },
});

// --------------------------------------------------

/**
 * Test data. Should move to storybook later on
 */
// function getTestData() {
//   const testData = [
//     {
//       uid: '1',
//       type: NOTIFICATION_TYPES.PLAIN_TEXT,
//       title: 'Chương trìn thi đua',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: '',
//       extraData: {
//         title: 'Chương trình thi đua',
//         details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       },
//       createTime: 1507190995,
//     },
//     {
//       uid: '2',
//       type: NOTIFICATION_TYPES.PLAIN_TEXT,
//       title: 'Chương trìn thi đua',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: '',
//       extraData: {
//         title: 'Chương trình thi đua',
//         details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       },
//       createTime: 1507190995,
//     },
//     {
//       uid: '3',
//       type: NOTIFICATION_TYPES.PLAIN_TEXT,
//       title: 'Chương trìn thi đua',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: '',
//       extraData: {
//         title: 'Chương trình thi đua',
//         details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       },
//       createTime: 1507190995,
//     },
//   ];
//   const testItems = testData.map(json => {
//     return Object.assign(new Notification(), json);
//   })
//   return testItems;
// }
