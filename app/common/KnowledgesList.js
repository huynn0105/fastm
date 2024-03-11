import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
} from 'react-native';

import PropTypes from 'prop-types';

import { Knowledge } from '../models';
import PlaceholderView from '../common/PlaceholderView';
import KnowledgeRow from './KnowledgeRow';
import colors from '../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// KnowledgeList
// --------------------------------------------------

class KnowledgeList extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  renderPlaceholder() {
    const {
      emptyDataText,
    } = this.props;
    return (
      <PlaceholderView
        containerStyle={styles.emptyContainer}
        text={emptyDataText}
      />
    );
  }
  renderItem(knowledge, isSeparatorHidden = false) {
    return (
      <KnowledgeRow
        knowledge={knowledge}
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
        initialNumToRender={5}
        data={data}
        extraData={extraData}
        keyExtractor={item => item.uid}
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
      data,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        {
          data.length === 0 ?
            this.renderPlaceholder() :
            this.renderList()
        }
      </View>
    );
  }
}

// --------------------------------------------------

KnowledgeList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Knowledge)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

KnowledgeList.defaultProps = {
  data: [],
  emptyDataText: 'Không có kiến thức nào',
  isLastRowSeparatorHidden: false,
  onItemPress: () => { },
};

export default KnowledgeList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 2,
    backgroundColor: colors.navigation_bg,
  },
  emptyContainer: {
    // height: 112,
    marginTop: 0,
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
    backgroundColor: '#fff0',
  },
});

// --------------------------------------------------

// function getTestData() {
//   const testData = [
//     {
//       uid: '1',
//       groupID: '1',
//       categoryID: '1',
//       title: 'Chương trình thi đua T8/2017',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: 'https://crm.digitel.vn/files/contests/vZBPd1jt.jpg',
//       createTime: 1507190995,
//     },
//     {
//       uid: '2',
//       groupID: '1',
//       categoryID: '1',
//       title: 'Chương trình thi đua T8/2017',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: 'https://crm.digitel.vn/files/contests/vZBPd1jt.jpg',
//       createTime: 1507190995,
//     },
//     {
//       uid: '3',
//       groupID: '1',
//       categoryID: '1',
//       title: 'Chương trình thi đua T8/2017',
//       details: 'Nôi dung thi đua dành cho cấp DSA trong tháng 9/ 2017',
//       image: 'https://crm.digitel.vn/files/contests/vZBPd1jt.jpg',
//       createTime: 1507190995,
//     },
//   ];
//   for (let i = 0; i < testData.length; i++) {
//     Object.setPrototypeOf(testData[i], News.prototype);
//   }
//   return testData;
// }
