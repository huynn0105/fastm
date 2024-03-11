import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import PropTypes from 'prop-types';

import { News } from '../models';
import PlaceholderView from '../common/PlaceholderView';
import NewsRow from './NewsRow';
import colors from '../constants/colors';
import { SH } from '../constants/styles';
import Colors from '../theme/Color';

const _ = require('lodash');

// --------------------------------------------------
// NewsList
// --------------------------------------------------

class NewsList extends Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  // }

  renderPlaceholder() {
    const { emptyDataText } = this.props;
    return <PlaceholderView containerStyle={styles.emptyContainer} text={emptyDataText} />;
  }
  renderItem(news, isSeparatorHidden = false) {
    return (
      <NewsRow
        news={news}
        containerStyle={this.props.itemStyle}
        separatorStyle={this.props.itemSeparatorStyle}
        isSeparatorHidden={isSeparatorHidden}
        onPress={this.props.onItemPress}
      />
    );
  }
  itemSeparatorComponent = () => (
    <View
      style={{
        // marginLeft: 96,
        height: 0.65,
        backgroundColor: Colors.gray4,
        marginVertical: SH(16),
      }}
    />
  );
  renderList() {
    const { data, extraData, isLastRowSeparatorHidden } = this.props;

    return (
      <FlatList
        data={data}
        extraData={extraData}
        keyExtractor={(item) => `${item?.postID}`}
        renderItem={(row) => {
          return this.renderItem(row.item, false);
        }}
        initialNumToRender={3}
        ItemSeparatorComponent={this.itemSeparatorComponent}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const { data, containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {data.length === 0 ? this.renderPlaceholder() : this.renderList()}
      </View>
    );
  }
}

// --------------------------------------------------

NewsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(News)),
  emptyDataText: PropTypes.string,
  isLastRowSeparatorHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
};

NewsList.defaultProps = {
  data: [],
  emptyDataText: 'Không có tin tức nào',
  isLastRowSeparatorHidden: false,
  onItemPress: () => {},
};

export default NewsList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    // flex: 0,
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
    // alignItems: 'stretch',
    // paddingBottom: 2,
    // backgroundColor: colors.navigation_bg,
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
