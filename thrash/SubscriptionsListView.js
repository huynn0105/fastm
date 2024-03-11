'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import SubscriptionRow from '../../common/SubscriptionRow';
import SubscriptionRegisterRow from '../../common/SubscriptionRegisterRow';

// --------------------------------------------------

const LogTAG = '7777: SubscriptionsListView.js'; // eslint-disable-line

class SubscriptionsListView extends Component {
  constructor(props) {
    super(props);

    const rows = this.mapItemsToRows(props.data);
    this.state = {
      title: props.title,
      data: rows,
    };
  }
  componentWillReceiveProps(nextProps) {
    const subscriptions = nextProps.data;
    const rows = this.mapItemsToRows(subscriptions);
    this.setState({
      title: nextProps.title,
      data: rows,
    });
  }
  mapItemsToRows(subscriptions) {
    let rows = [];
    if (subscriptions.length === 0) {
      rows = [{
        key: 'EMPTY',
        type: 'EMPTY',
        data: {}
      }];
    } else {
      rows = subscriptions.map((data, index) => (
        {
          key: `ITEM_${index}`,
          type: 'SUBSCRIPTION',
          data,
        }
      ));
    }
    rows.push({
      key: 'BUTTON',
      type: 'BUTTON',
      data: {},
    });
    return rows;
  }
  renderSubscription(subscription) {
    return (
      <SubscriptionRow
        image={{ uri: subscription.logoImage }}
        name={subscription.projectDetails}
        agentRole={subscription.roleDetails}
        agentMoney={subscription.totalMoneyString}
        agentPoint={subscription.totalPoint}
        onPress={() => {
          if (this.props.onItemPress !== undefined) {
            this.props.onItemPress(subscription);
          }
        }}
      />
    );
  }
  renderButton() {
    return (
      <SubscriptionRegisterRow
        title={'Đăng ký thêm'}
        onPress={() => {
          if (this.props.onActionPress !== undefined) {
            this.props.onActionPress();
          }
        }}
      />
    );
  }
  renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {'Bạn chưa đăng ký công việc nào'}
        </Text>
        <View
          style={{
            height: 2.0,
            marginTop: 12,
            backgroundColor: '#fff'
          }}
        />
      </View>
    );
  }
  render() {
    const props = this.props;
    return (
      <View
        style={[styles.container, props.style]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {this.state.title}
          </Text>
        </View>
        <View
          style={[styles.listContainer, props.listStyle]}
        >
          <FlatList
            data={this.state.data}
            renderItem={(row) => {
              if (row.item.type === 'EMPTY') {
                return this.renderEmpty();
              }
              if (row.item.type === 'BUTTON') {
                return this.renderButton();
              }
              return this.renderSubscription(row.item.data);
            }}
          />
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

SubscriptionsListView.defaultProps = {
  title: 'Nhóm công việc của bạn',
  data: [],
};

SubscriptionsListView.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  onItemPress: PropTypes.func,
  onActionPress: PropTypes.func,
};

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 2,
    backgroundColor: '#fefefe'
  },
  titleContainer: {
    justifyContent: 'center',
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 12,
    fontSize: 14,
    fontWeight: '300',
    color: '#858585',
  },
  listContainer: {
    borderRadius: 4,
    borderColor: '#A0A0A0',
    borderWidth: 0.25,
    elevation: 8,
    shadowOffset: { width: 0, height: 0.5 },
    shadowColor: '#808080',
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  emptyContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#e2f4fe',
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

export default SubscriptionsListView;
