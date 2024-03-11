import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { BadLoans } from 'app/models';

import BadLoansRow from './BadLoansRow';

const _ = require('lodash');

// --------------------------------------------------
// BadLoansList
// --------------------------------------------------

class BadLoansList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  renderItem(item, isSeparatorHidden = false) {
    return (
      <BadLoansRow
        badLoans={item}
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
        testID="test_badloanlist"
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

BadLoansList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

BadLoansList.defaultProps = {
  data: [],
  isLastRowSeparatorHidden: false,
  onItemPress: () => { },
};

export default BadLoansList;

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
