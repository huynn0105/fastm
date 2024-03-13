import React from 'react';
import { ScrollView, Dimensions, View, RefreshControl } from 'react-native';
import NewsControl from '../../screens/Home/NewsControl';
import Colors from '../../theme/Color';

const SCREEN_WIDTH = Dimensions.get('window').width;

export class News extends React.PureComponent {
  render() {
    const { isRefreshing, onRefresh, indexMenu } = this.props;
    return (
      <ScrollView
        style={{ flex: 1, width: SCREEN_WIDTH }}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: 'trasparent' }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.neutral4}
          />
        }
      >
        <NewsControl
          viewMode={'long'}
          data={this.props.noticeNews || []}
          extraData={this.props.noticeNews || []}
          hotNews={this.props.hotNews || []}
          contests={this.props.contests}
          onPressBanner={this.props.onPressBanner}
          indexMenu={indexMenu}
          allNews={this.props.allNews}
          tipNews={this.props.tipNews}
          {...this.props}
        />
        <View style={{ height: 64 }} />
      </ScrollView>
    );
  }
}
