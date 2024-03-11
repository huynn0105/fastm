import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  RefreshControl,
  Linking,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { logEvent } from '../../tracking/Firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SectionHeader = ({ title }) => (
  <AppText
    style={{
      marginLeft: 6,
      ...TextStyles.heading4,
      marginTop: 22,
      opacity: 0.6,
      fontSize: 14,
      color: '#24253d',
    }}
  >
    {title}
  </AppText>
);

const ItemHeader = ({ item }) => (
  <View>
    <FastImage
      style={{
        width: SCREEN_WIDTH - 16 * 2,
        aspectRatio: 343 / 192,
        marginRight: 10,
      }}
      resizeMode="stretch"
      source={{ uri: item.img }}
    />
  </View>
);

const FILTER_ID = {
  ALL: 0,
  PROCESSING: 1,
  ENDED: 2,
};

const FILTER_DATA = [
  { uid: FILTER_ID.ALL, title: 'Tất cả' },
  { uid: FILTER_ID.PROCESSING, title: 'Đang diễn ra' },
  { uid: FILTER_ID.ENDED, title: 'Đã kết thúc' },
];

class Contest extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentFilter: FILTER_ID.PROCESSING,
    };
  }

  currentData = () => {
    const { contests } = this.props;
    const { currentFilter: filter } = this.state;
    let data = [];
    if (filter === FILTER_ID.PROCESSING || filter === FILTER_ID.ALL) {
      data = contests.processing || [];
    }
    if (filter === FILTER_ID.ENDED || filter === FILTER_ID.ALL) {
      if (contests.end && contests.end.length) {
        data = [...data, { cat_title: 'Các chương trình đã kết thúc', items: contests.end }];
      }
    }
    return data;
  };

  onFilterPress = (item) => {
    this.setState({ currentFilter: item.uid });
  };

  onItemPress = (item) => {
    const { url, url_title } = item;
    if (url && url.includes('appaymobile://')) {
      Linking.openURL(url);
    } else {
      // this.props.navigation.navigate('WebView', { mode: 0, title: url_title, url });
      this.props.onItemPress({ title: url_title, webURL: url });
    }
  };

  renderFilter = () => {
    const { currentFilter: filter } = this.state;
    return (
      <ScrollView style={{ flex: 1 }} horizontal>
        <View style={{ flexDirection: 'row', marginTop: 16, marginLeft: 16 }}>
          {FILTER_DATA.map((item) => {
            return (
              <TouchableOpacity
                style={{
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: filter === item.uid ? Colors.primary2 : 'white',
                  marginRight: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.onFilterPress(item)}
              >
                <AppText
                  style={{
                    fontSize: 14,
                    color: filter === item.uid ? '#ffffff' : '#24253d99',
                    paddingLeft: 20,
                    paddingRight: 20,
                  }}
                >
                  {item.title}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  renderContestRow = (item) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 16,
        }}
        onPress={() => {
          if (item?.moengage_event?.length > 0) {
            logEvent(item?.moengage_event);
          }
          this.onItemPress(item);
        }}
      >
        <ItemHeader item={item} />
      </TouchableOpacity>
    );
  };

  renderContestList = (itemList) => {
    return <View>{itemList.map((item) => this.renderContestRow(item))}</View>;
  };

  renderSections = () => {
    const { contests } = this.props;
    if (!contests) return null;

    const dataSource = this.currentData();

    return (
      <View style={{ marginLeft: 16, marginRight: 16 }}>
        {dataSource.map((section) => {
          return (
            <View>
              <SectionHeader title={section.cat_title} />
              {this.renderContestList(section.items)}
            </View>
          );
        })}
      </View>
    );
  };

  render() {
    const { isRefreshing, onRefresh } = this.props;
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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {this.renderFilter()}
        {this.renderSections()}
        <View style={{ height: 24 }} />
      </ScrollView>
    );
  }
}

export default Contest;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginTop: 6,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  newsContainer: {},
  textLabel: {
    marginLeft: 16,
  },
});
