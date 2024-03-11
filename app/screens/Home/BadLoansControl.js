import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';

import { BadLoans } from 'app/models';
import BadLoansList from './BadLoansList';
import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// BadLoansControl
// --------------------------------------------------

class BadLoansControl extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onItemPress = (item) => {
    this.props.onItemPress(item);
  }
  // --------------------------------------------------
  render() {
    const {
      style, title, data,
      isGettingBadLoans,
    } = this.props;

    const isLastRowSeparatorHidden = true;

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.titleText}>
          {title}
        </Text>
        {
          isGettingBadLoans &&
          <ActivityIndicator
            style={styles.headerAccessoryButton}
            animating
            color="#404040"
            size="small"
          />
        }
        <View style={styles.listContainer}>
          <BadLoansList
            data={data}
            isLastRowSeparatorHidden={isLastRowSeparatorHidden}
            onItemPress={this.onItemPress}
          />
        </View>
      </View>
    );
  }
}

BadLoansControl.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  onItemPress: PropTypes.func,
};

BadLoansControl.defaultProps = {
  data: [],
  title: 'Chỉ số nợ xấu từ khách hàng của bạn',
  onItemPress: () => { },
};


export default BadLoansControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 0,
    backgroundColor: colors.navigation_bg,
  },
  listContainer: {
    marginLeft: 2,
    marginRight: 2,
    marginTop: 4,
    marginBottom: 0,
    backgroundColor: '#0000',
    overflow: 'hidden',
  },
  titleText: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: '#7f7f7f',
    fontSize: 14,
    fontWeight: '800',
    backgroundColor: '#0000',
  },
  headerAccessoryButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 44,
    height: 36,
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 8,
  },
});
