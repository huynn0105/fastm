/**
  Display newest newest in the same category with the target news
  Filter out target news
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';

import { News } from '../../models';
import NewsList from '../../common/NewsList';

// --------------------------------------------------

class RelatedNewsControl extends Component {
  constructor(props) {
    super(props);

    this.onItemPress = this.props.onItemPress.bind(this);
  }
  render() {
    const {
      title, data,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          {title}
        </Text>
        <NewsList
          data={data}
          containerStyle={styles.listContainer}
          itemSeparatorStyle={{ backgroundColor: '#E0E0E0' }}
          onItemPress={this.onItemPress}
          isLastRowSeparatorHidden
        />
      </View>
    );
  }
}

// --------------------------------------------------

RelatedNewsControl.propsTypes = {
  targetNews: PropTypes.instanceOf(News),
  onItemPress: () => {},
};

RelatedNewsControl.defaultProps = {
  targetNews: PropTypes.instanceOf(News),
  onItemPress: PropTypes.func,
};

export default RelatedNewsControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 8,
    paddingBottom: 32,
    backgroundColor: '#FBFBFB',
  },
  listContainer: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#FBFBFB',
  },
  titleText: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#7D7D7D',
  },
});
