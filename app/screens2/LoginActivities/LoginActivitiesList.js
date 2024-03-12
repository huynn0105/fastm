import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, SectionList, ScrollView, RefreshControl } from 'react-native';

import LoadMoreView from '../../common/LoadMoreView';

import LoginActivityRow from './LoginActivityRow';
import LoginActivitySectionHeader from './LoginActivitySectionHeader';
import SpaceRow from './SpaceRow';

import { requestLoginActivities } from '../../redux/actions';
import colors from '../../constants/colors';

const _ = require('lodash');

class LoginActivitiesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  componentDidMount() {
    this.onRefreshLoginActivities();
  }

  componentDidUpdate(prevProps) {
    this.updateSectionListState(prevProps, this.props);
  }

  onRefreshLoginActivities = () => {
    this.sectionListLoginState.reset();
    this.props.requestLoginActivities(this.sectionListLoginState.page);
  };

  loadMoreLoginActivities() {
    if (
      this.props.isGetLoginActivityProcessing ||
      this.sectionListLoginState.canLoadMore === false
    ) {
      return;
    }

    this.sectionListLoginState.page += 1;
    this.props.requestLoginActivities(this.sectionListLoginState.page);
  }

  updateSectionListState(prevProps, props) {
    if (prevProps.getLoginActivityResponse.status !== undefined) return;
    if (props.getLoginActivityResponse.status === undefined) return;
    if (!props.getLoginActivityResponse.canLoadMore) {
      this.sectionListLoginState.canLoadMore = false;
    }
  }

  isHiddenLoadMore() {
    if (this.props.isGetLoginActivityProcessing || this.sectionListLoginState.canLoadMore) {
      return false;
    }
    return true;
  }

  sectionListLoginState = {
    canLoadMore: true,
    page: 1,

    reset() {
      this.canLoadMore = true;
      this.page = 1;
    },
  };

  renderItem = (loginActivity, isSeparatorHidden) => {
    return <LoginActivityRow loginActivity={loginActivity} isSeparatorHidden={isSeparatorHidden} />;
  };

  renderSectionHeader = (title) => {
    return <LoginActivitySectionHeader title={title} />;
  };

  renderList = (data) => {
    return (
      <SectionList
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        initialNumToRender={7}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          this.loadMoreLoginActivities();
        }}
        sections={data}
        renderItem={({ item }) => {
          return this.renderItem(item);
        }}
        renderSectionHeader={({ section: { title } }) => {
          return this.renderSectionHeader(title);
        }}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                height: 1.0,
                backgroundColor: colors.separator,
              }}
            >
              <View
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  height: 1.0,
                  backgroundColor: colors.separator,
                }}
              />
            </View>
          );
        }}
        renderSectionFooter={() => {
          return <SpaceRow />;
        }}
        keyExtractor={(item) => item.dateTime}
      />
    );
  };

  renderLoadMore() {
    return (
      <LoadMoreView
        style={{ marginTop: 12, marginBottom: 20 }}
        isHidden={this.isHiddenLoadMore()}
        isLoading={this.props.isGetLoginActivityProcessing}
      />
    );
  }

  render() {
    return (
      // <ScrollView
      //   refreshControl={
      //     <RefreshControl
      //       style={{ backgroundColor: '#E6EBFF' }}
      //       refreshing={this.state.refreshing}
      //       onRefresh={() => {
      //         this.onRefreshLoginActivities();
      //       }}
      //     />
      //   }
      // >
      <View style={styles.container}>
        {this.renderList(this.props.loginActivities)}
        {/* {this.renderLoadMore()} */}
      </View>
      // </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  loginActivities: state.loginActivities,
  isGetLoginActivityProcessing: state.isGetLoginActivityProcessing,
  getLoginActivityResponse: state.getLoginActivityResponse,
});

const mapDispatchToProps = (dispatch) => ({
  requestLoginActivities: (page) => dispatch(requestLoginActivities(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginActivitiesList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  emptyContainer: {
    height: 112,
    paddingBottom: 16,
    backgroundColor: '#0000',
  },
});
