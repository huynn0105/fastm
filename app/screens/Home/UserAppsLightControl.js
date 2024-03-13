import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';

import { UserApp } from 'app/models';
import UserAppsLightList from './UserAppsLightList';
import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// UserAppsLightControl
// --------------------------------------------------

class UserAppsLightControl extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  
  onItemPress = (item) => {
    this.props.onItemPress(item);
  }
  // --------------------------------------------------
  render() {
    const {
      style, title, data, lightData,
      extraData, emptyDataText,
      isGettingUserAppList,
      showTitle,
    } = this.props;

    const listData = data.concat(lightData);

    const isLastRowSeparatorHidden = true;

    return (
      <View style={[styles.container, style]}>
        {
          showTitle ?
            <Text style={styles.titleText}>
              {title}
            </Text>
            : null
        }
        {
          isGettingUserAppList &&
          <ActivityIndicator
            style={styles.headerAccessoryButton}
            animating
            color="#404040"
            size="small"
          />
        }
        <View style={styles.listContainer}>
          <UserAppsLightList
            data={listData}
            extraData={listData}
            emptyDataText={emptyDataText}
            isLastRowSeparatorHidden={isLastRowSeparatorHidden}
            onItemPress={this.onItemPress}
            itemStyle={this.props.userAppItemStyle}
            onItemLightPress={this.props.onItemLightPress}
          />
        </View>
      </View>
    );
  }
}

UserAppsLightControl.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(UserApp)),
  extraData: PropTypes.bool,
  title: PropTypes.string,
  onItemPress: PropTypes.func,
  showTitle: PropTypes.bool,
};

UserAppsLightControl.defaultProps = {
  data: [],
  extraData: true,
  title: 'Giao dịch tài chính của bạn',
  onItemPress: () => { },
  showTitle: true,
};


export default UserAppsLightControl;

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
