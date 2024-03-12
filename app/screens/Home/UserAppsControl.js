import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { UserApp } from 'app/models';
import UserAppsList from './UserAppList';
import colors from '../../constants/colors';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';

const _ = require('lodash');

// --------------------------------------------------
// UserAppsControl
// --------------------------------------------------

class UserAppsControl extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onItemPress = (item) => {
    this.props.onItemPress(item);
  };
  // --------------------------------------------------
  render() {
    const {
      style,
      title,
      data,
      lightData,
      extraData,
      emptyDataText,
      isGettingUserAppList,
      showTitle
    } = this.props;

    const listData = data.concat(lightData);

    const isLastRowSeparatorHidden = true;

    return (
      <View style={[styles.container, style]}>
        {showTitle ? (
          <Text
            style={{
              opacity: 0.7,
              fontSize: 14,
              color: Colors.primary4,
              marginLeft: 16,
              marginBottom: 4,
              marginTop: 16,
            }}
          >
            {title}
          </Text>
        ) : null}
        {isGettingUserAppList && (
          <ActivityIndicator
            style={styles.headerAccessoryButton}
            animating
            color="#404040"
            size="small"
          />
        )}
        <View style={styles.listContainer}>
          <UserAppsList
            data={listData}
            extraData={extraData}
            emptyDataText={emptyDataText}
            isLastRowSeparatorHidden={isLastRowSeparatorHidden}
            onItemPress={this.onItemPress}
            onItemLightPress={this.props.onItemLightPress}
            itemStyle={this.props.userAppItemStyle}
          />
        </View>
      </View>
    );
  }
}

UserAppsControl.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(UserApp)),
  extraData: PropTypes.bool,
  title: PropTypes.string,
  onItemPress: PropTypes.func,
  showTitle: PropTypes.bool
};

UserAppsControl.defaultProps = {
  data: [],
  extraData: true,
  title: 'Giao dịch tài chính của bạn',
  onItemPress: () => {},
  showTitle: true
};

const mapStateToProps = (state) => ({
  isGettingUserAppList: state.isGettingUserAppList
});

export default connect(
  mapStateToProps,
  null
)(UserAppsControl);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  listContainer: {
    marginTop: 4,
    marginBottom: 0,
    overflow: 'hidden'
  },
  titleText: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: '#7f7f7f',
    fontSize: 14,
    fontWeight: '800',
    backgroundColor: '#0000'
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
    paddingBottom: 8
  }
});
