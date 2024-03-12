import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { UserApp } from 'app/models';

import UserAppRow from './UserAppRow';
import UserAppLightRow from './UserAppLightRow';

const _ = require('lodash');

// --------------------------------------------------
// UserAppsList
// --------------------------------------------------

class UserAppsList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem(item, isSeparatorHidden = false) {
    return (
      (item instanceof UserApp) ?
        <UserAppRow
          userApp={item}
          isSeparatorHidden={isSeparatorHidden}
          onPress={this.props.onItemPress}
          style={this.props.itemStyle}
        />
        :
        <UserAppLightRow
          userApp={item}
          isSeparatorHidden={isSeparatorHidden}
          onPress={this.props.onItemLightPress}
          style={this.props.itemStyle}
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
        keyExtractor={item => item.detailURL}
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
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          this.renderList()
        }
      </View>
    );
  }
}

// --------------------------------------------------

UserAppsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(UserApp)),
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

UserAppsList.defaultProps = {
  data: [],
  isLastRowSeparatorHidden: false,
  onItemPress: () => { },
};

export default UserAppsList;

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
});
