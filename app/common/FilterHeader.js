import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from './KJTouchableOpacity';
import colors from '../constants/colors';
import AppText from '../componentV3/AppText';
const _ = require('lodash');

// --------------------------------------------------

class FilterHeader extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onFilterPress = () => {
    this.props.onFilterPress();
  }
  // --------------------------------------------------
  render() {
    const {
      style,
      title, titleStyle,
      filterText, filterTextStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <AppText style={[styles.titleText, titleStyle]}>
          {title}
        </AppText>
        <KJTouchableOpacity
          onPress={this.onFilterPress}
        >
          <View style={styles.filterContainer}>
            <AppText style={[styles.filterText, filterTextStyle]}>
              {filterText}
            </AppText>
            <Image
              style={styles.filterIcon}
              source={require('./img/filter.png')}
              resizeMode="contain"
            />
          </View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

FilterHeader.propTypes = {
  title: PropTypes.string,
  titleStyle: Text.propTypes.style,
  filterText: PropTypes.string,
  filterTextStyle: Text.propTypes.style,
  onFilterPress: PropTypes.func,
};

FilterHeader.defaultProps = {
  title: 'Title',
  filterText: 'Filter',
  onFilterPress: () => console.log('onFilterPress'),
};

export default FilterHeader;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 40,
    backgroundColor: colors.separator,
  },
  titleText: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 4,
    fontSize: 15,
    color: '#8C8D99',
  },
  filterContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterText: {
    paddingLeft: 0,
    paddingRight: 4,
    fontSize: 12,
    color: '#8C8D99',
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});
