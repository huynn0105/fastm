import React, { Component } from 'react';
import { View, Dimensions, Platform, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import iphone12Helper from '../../utils/iphone12Helper';
import ModalKnowleage from '../../components2/ModalKnowleage';
import ChatBoxButton from '../../components2/ChatBoxButton';
import Colors from '../../theme/Color';
import { getKnowledges, getContests } from '../../redux/actions/knowledge';
import { getNoticeNews } from '../../redux/actions/news';
import Knowledges from './Knowledges';
import { News } from './News';
import Contest from './Contest';
import AppText from '../../componentV3/AppText';

export const TABS = {
  KNOWLEDGES: 0,
  NEWS: 1,
  CONTEST: 2,
};

const MENU = [
  { title: 'Tin tức', tag: TABS.NEWS, unread: 0 },
  { title: 'Kiến thức', tag: TABS.KNOWLEDGES, unread: 0 },
  { title: 'Thi đua', tag: TABS.CONTEST, unread: 0 },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
class NewsScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation, myUser } = props;
    navigation.setParams({ isHideChatBox: !(myUser && myUser?.isLoggedIn) });
    //
    this.initTab = navigation.getParam('focusedTabIndex') || TABS.NEWS;

    //
    this.useDeepLink = navigation.getParam('useDeepLink');
    this.nextUrl = navigation.getParam('nextUrl');
    this.prefixDeeplink = navigation.getParam('prefixDeeplink');
    this.title = navigation.getParam('title');

    this.state = {
      isVisible: false,
      titleModal: '',
      dataExtendKnowLeage: [],
      index: parseInt(this.initTab),
      routes: [
        { key: TABS.KNOWLEDGES, item: MENU[1] },
        { key: TABS.NEWS, item: MENU[0] },
        { key: TABS.CONTEST, item: MENU[2] },
      ],
    };
    this.isRefreshing = false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.fetchAllAPI();
    }, 400);
    if (this.nextUrl) {
      if ((this.useDeepLink === '1' || this.useDeepLink === 1) && this.prefixDeeplink) {
        setTimeout(() => {
          const deep = `mfastmobile://${this.prefixDeeplink}&url=${this.nextUrl}&title=${
            this.title || ' '
          }`;
          Linking.openURL(deep);
        }, 300);
      } else {
        this.props.navigation.push('WebView', {
          mode: 0,
          title: this.title || ' ',
          url: this.nextUrl,
        });
      }
    }
  }

  onTabsHeaderSelected = (tab) => {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ index: tab });
  };

  onKnowPress = (item) => {
    const isExtend = Array.isArray(item.extend) && item.extend.length > 0;
    if (isExtend) {
      this.setState({
        isVisible: true,
        titleModal: item?.title || '',
        dataExtendKnowLeage: item.extend,
      });
    } else {
      const url = item.type === 'BANNER' ? item.bannerUrl : item.ackUrl;
      this.props.navigation.navigate('WebView', { mode: 0, title: item.title || '', url });
    }
  };

  onNewsPress = (item) => {
    this.props.navigation.navigate('WebView', { mode: 0, title: 'Tin tức', url: item.webURL });
  };

  isDeepLink(url) {
    return url && (url.startsWith('mfastmobile://') || url.startsWith('tel:'));
  }

  onContestPress = (item) => {
    if (this.isDeepLink(item.webURL)) {
      Linking.openURL(item.webURL);
      return false;
    }
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: item.title || '',
      url: item.webURL,
    });
  };

  onRefreshAllNews = () => {
    this.isRefreshing = true;
    this.fetchAllAPI();
  };

  onFocusOnTab = (tab) => {
    // this.animatedTabbar.onTabTapped(tab);
    this.setState({ index: tab });
  };

  onCardBonusPress = () => {};

  onCardRsaPress = () => {};

  fetchAllAPI = () => {
    this.props.getKnowledges();
    this.props.getNoticeNews();
    this.props.getContests();
  };

  onCloseModal = () => {
    this.setState({
      isVisible: false,
      dataExtendKnowLeage: [],
      titleModal: '',
    });
  };

  onPressSelectItem = (item) => {
    this.props.navigation.navigate('WebView', { mode: 0, title: item.title, url: item.url });
  };

  onPressBanner = (item) => {
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: item.url_title || '',
      url: item.url,
    });
  };

  renderMenu = (props) => (
    <TabBar
      {...props}
      style={{ backgroundColor: '#E6EBFF' }}
      indicatorStyle={{ backgroundColor: Colors.primary2, height: 1 }}
      renderLabel={({ route, focused }) => (
        <AppText
          style={{
            color: focused ? Colors.primary2 : '#0006',
            fontSize: 14,
            textAlign: 'center',
            fontWeight: '400',
          }}
        >
          {route.item.title}
        </AppText>
      )}
    />
  );

  renderTabKnowledges = () => {
    const { isGetKnowledgesProcessing } = this.props;
    const isRefreshingKnowledge = this.isRefreshing && isGetKnowledgesProcessing;
    return (
      <Knowledges
        knowledges={this.props.knowledges}
        onItemPress={this.onKnowPress}
        isRefreshing={isRefreshingKnowledge}
        onRefresh={this.onRefreshAllNews}
      />
    );
  };

  renderTabNews = () => {
    const { isGetNewsProcessing, postList, contests } = this.props;
    const isRefreshingNews = this.isRefreshing && isGetNewsProcessing;
    return (
      <News
        noticeNews={postList.filter((item) => !item.isHighlight)}
        hotNews={postList.filter((item) => item.isHighlight)}
        onItemPress={this.onNewsPress}
        isRefreshing={isRefreshingNews}
        onRefresh={this.onRefreshAllNews}
        contests={contests}
        onPressBanner={this.onPressBanner}
      />
    );
  };

  renderTabContest = () => {
    const { isGetNewsProcessing, contests } = this.props;
    const isRefreshingNews = this.isRefreshing && isGetNewsProcessing;
    return (
      <Contest
        contests={contests}
        isRefreshing={isRefreshingNews}
        onRefresh={this.onRefreshAllNews}
        onItemPress={this.onContestPress}
      />
    );
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case TABS.KNOWLEDGES:
        return this.renderTabKnowledges();
      case TABS.NEWS:
        return this.renderTabNews();
      case TABS.CONTEST:
        return this.renderTabContest();
      default:
        return <View />;
    }
  };

  renderTabView = () => {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderMenu}
        onIndexChange={(index) => this.onFocusOnTab(index)}
      />
    );
  };

  render() {
    const { isVisible, dataExtendKnowLeage, titleModal } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {this.renderTabView()}
        <ModalKnowleage
          isVisible={isVisible}
          data={dataExtendKnowLeage}
          title={titleModal}
          onPressSelectItem={this.onPressSelectItem}
          onCloseModal={this.onCloseModal}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  knowledges: state.knowledges,
  noticeNews: state.noticeNews,
  isGetNewsProcessing: state.isGetNewsProcessing,
  isGetKnowledgesProcessing: state.isGetKnowledgesProcessing,
  postList: state.postList,
  contests: state.contests,
});
const mapDispatchToProps = (dispatch) => ({
  getKnowledges: (page, perPage) => dispatch(getKnowledges(page, perPage)),
  getNoticeNews: (page, perPage) => dispatch(getNoticeNews(page, perPage)),
  getContests: () => dispatch(getContests()),
});

NewsScreen.navigationOptions = (navigation) => {
  const params = navigation?.state?.params;
  return {
    title: 'Thông tin',
    headerRight: params?.isHideChatBox ? (
      <View />
    ) : (
      <View style={{ marginRight: 6 }}>
        <ChatBoxButton type={'anna'} navigation={navigation} />
      </View>
    ),
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: Colors.neutral5,
      elevation: 0,
      marginLeft: Platform.OS === 'ios' ? 6 : 0,
      marginRight: Platform.OS === 'ios' ? 6 : 0,
      marginTop: iphone12Helper() ? 10 : 0,
    },
    headerTintColor: '#000',
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsScreen);
