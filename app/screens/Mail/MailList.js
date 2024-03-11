import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { Notification } from '../../models';
import MailRow from './MailRow';
import PlaceholderView from '../../common/PlaceholderView';
import colors from '../../constants/colors';

const _ = require('lodash');
// --------------------------------------------------

class MailList extends Component {
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
      <MailRow
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

MailList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Notification)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

MailList.defaultProps = {
  data: [],
  emptyDataText: 'Không có thông báo',
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default MailList;

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
    // height: 112,
    paddingBottom: 16,
    backgroundColor: colors.navigation_bg,
  },
});
