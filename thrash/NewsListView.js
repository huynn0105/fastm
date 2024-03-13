'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import NewsRow from '../../common/NewsRow';
import ViewMoreRow from '../../common/ViewMoreRow';

// --------------------------------------------------

const LogTAG = '7777: NewsListView.js'; // eslint-disable-line

class NewsListView extends Component {
  constructor(props) {
    super(props);

    const rows = this.mapItemsToRows(props.data);
    this.state = {
      title: props.title,
      data: rows,
    };
  }
  componentWillReceiveProps(nextProps) {
    const products = nextProps.data;
    const rows = this.mapItemsToRows(products);
    this.setState({
      title: nextProps.title,
      data: rows,
    });
  }
  mapItemsToRows(items) {
    let rows = [];
    if (items.length === 0) {
      rows = [{
        key: 'EMPTY',
        type: 'EMPTY',
        data: {}
      }];
    } else {
      rows = items.map((data, index) => (
        {
          key: `ITEM_${index}`,
          type: 'ITEM',
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
  renderNews(news, isSeparatorHidden = false) {
    return (
      <NewsRow
        image={{ uri: news.image }}
        title={news.title}
        details={news.details}
        time={`${news.createTimeString()}`}
        isSeparatorHidden={isSeparatorHidden}
        onPress={() => this.props.onItemPress(news)}
      />
    );
  }
  renderButton() {
    return (
      <ViewMoreRow
        title={'Xem thêm'}
        onPress={() => this.props.onActionPress()}
      />
    );
  }
  renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {this.props.placeHolderText}
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
            initialNumToRender={5}
            data={this.state.data}
            renderItem={(row) => {
              if (row.item.type === 'EMPTY') {
                return this.renderEmpty(props.placeHolderText);
              }
              if (row.item.type === 'BUTTON') {
                return this.renderButton();
              }
              // hiden separator on last row
              const isSeparatorHidden = (row.index === this.state.data.length - 2);
              return this.renderNews(row.item.data, isSeparatorHidden);
            }}
          />
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

NewsListView.defaultProps = {
  title: 'Tin tức nổi bật',
  placeHolderText: 'Không có tin tức nào',
  data: [],
  onItemPress: console.log('onItemPress'),
  onActionPress: console.log('onActionPress'),
};

NewsListView.propTypes = {
  title: PropTypes.string,
  placeHolderText: PropTypes.string,
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

export default NewsListView;
