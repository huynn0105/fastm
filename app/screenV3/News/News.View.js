import React, { useEffect, useRef, useState } from 'react';
import { Linking, View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import { getKnowledges, getContests } from '../../redux/actions/knowledge';
import Colors from '../../theme/Color';
import Knowledges from './components/Knowledges';
import ModalKnowleage from '../../components2/ModalKnowleage';
import { getNoticeNews } from '../../redux/actions/news';
import { News } from '../../screens2/News/News';
import Contest from '../../screens2/News/Contest';
import { isDeepLink } from '../../utils/Utils';
import HeaderNewsBar from './components/HeaderNewsBar';
import EnableTracking from '../../componentV3/EnableTracking';
import BottomActionSheet from '../../components2/BottomActionSheet';
import PopupGuildEnable from '../../componentV3/EnableTracking/PopupGuildEnable';

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

export const listMenu = [
  {
    id: 1,
    title: 'Tất cả',
  },
  {
    id: 2,
    title: 'Tin tức',
  },
  {
    id: 3,
    title: 'Tài chính',
    children: [
      'Mcredit',
      'Cash24',
      'Mirae Asset',
      'Easy Credit',
      'Cimb Bank',
      'MFast',
      '$NAP',
      'PTF',
    ],
  },
  {
    id: 4,
    title: 'Bảo hiểm',
  },
  {
    id: 5,
    title: 'Thi đua',
  },
  {
    id: 6,
    title: 'Bí quyết',
  },
];

const NewsScreen = ({ props, navigation }) => {
  const disabledKnowledged = useSelector((state) => state?.appInfo?.disabledKnowledged);

  const [index, setIndex] = useState(navigation.state.params.focusedTabIndex || 0);
  const tabNewsIndex = navigation.state.params.tabNewsIndex || 0;
  const [routes, setRoutes] = useState(
    disabledKnowledged
      ? [
          { key: TABS.NEWS, item: MENU[0] },
          { key: TABS.CONTEST, item: MENU[2] },
        ]
      : [
          { key: TABS.KNOWLEDGES, item: MENU[1] },
          { key: TABS.NEWS, item: MENU[0] },
          { key: TABS.CONTEST, item: MENU[2] },
        ],
  );

  const [selectedIndexMenu, setSelectedIndexMenu] = useState(listMenu[tabNewsIndex]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const [dataExtendKnowLeage, setDataExtendKnowLeage] = useState([]);
  const knowledges = useSelector((state) => state.knowledges);
  const isGetKnowledgesProcessing = useSelector((state) => state.isGetKnowledgesProcessing);
  const isGetNewsProcessing = useSelector((state) => state.isGetNewsProcessing);
  const contests = useSelector((state) => state.contests);
  const postList = useSelector((state) => state.postList);
  const tipNews = useSelector((state) => state.postTips);
  const actionSheetRef = useRef(null);

  const dispatch = useDispatch();

  const fetchAllAPI = () => {
    dispatch(getKnowledges());
    dispatch(getNoticeNews());
    dispatch(getContests());

    // this.props.getKnowledges();
    // this.props.getNoticeNews();
    // this.props.getContests();
  };

  const renderTabKnowledges = () => {
    const isRefreshingKnowledge = isRefreshing && isGetKnowledgesProcessing;
    return (
      <Knowledges
        knowledges={knowledges}
        onItemPress={onKnowPress}
        isRefreshing={isRefreshingKnowledge}
        onRefresh={onRefreshAllNews}
      />
    );
  };

  const onRefreshAllNews = () => {
    setIsRefreshing(true);
    fetchAllAPI();
  };

  const renderTabContest = () => {
    const isRefreshingNews = isRefreshing && isGetNewsProcessing;
    return (
      <Contest
        contests={contests}
        isRefreshing={isRefreshingNews}
        onRefresh={onRefreshAllNews}
        onItemPress={onContestPress}
      />
    );
  };

  const onContestPress = (item) => {
    if (isDeepLink(item?.webURL)) {
      Linking.openURL(item?.webURL);
      return false;
    }
    navigation.navigate('WebView', {
      mode: 0,
      title: item?.title || '',
      url: item?.webURL,
    });
  };

  const onKnowPress = (item) => {
    const isExtend = Array.isArray(item.extend) && item.extend.length > 0;
    if (isExtend) {
      setIsVisible(true);
      setTitleModal(item?.title || '');
      setDataExtendKnowLeage(item?.extend || []);
    } else {
      const url = item?.type === 'BANNER' ? item?.bannerUrl : item?.ackUrl;
      navigation.navigate('WebView', { mode: 0, title: item?.title || '', url });
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case TABS.KNOWLEDGES:
        return renderTabKnowledges();
      case TABS.NEWS:
        return renderTabNews();
      case TABS.CONTEST:
        return renderTabContest();
      default:
        return <View />;
    }
  };

  const onNewsPress = (item) => {
    navigation.navigate('WebView', { mode: 0, title: 'Tin tức', url: item.webURL });
  };

  const onPressBanner = (item) => {
    navigation.navigate('WebView', {
      mode: 0,
      title: item.url_title || '',
      url: item.url,
    });
  };

  const renderTabNews = () => {
    const isRefreshingNews = isRefreshing && isGetNewsProcessing;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingVertical: SH(16), marginLeft: SW(16) }}>
          <HeaderNewsBar
            data={listMenu}
            onIndexChange={(index, item) => {
              setSelectedIndexMenu(item);
            }}
            defaultIndex={tabNewsIndex}
          />
        </View>

        <News
          noticeNews={postList.filter((item) => !item.isHighlight)}
          hotNews={postList.filter((item) => item.isHighlight)}
          tipNews={tipNews}
          allNews={postList}
          onItemPress={onNewsPress}
          isRefreshing={isRefreshingNews}
          onRefresh={onRefreshAllNews}
          contests={contests}
          onPressBanner={onPressBanner}
          indexMenu={selectedIndexMenu}
        />
      </View>
    );
  };

  const renderMenu = (props) => {
    return (
      <TabBar
        {...props}
        style={{ backgroundColor: Colors.neutral5 }}
        indicatorStyle={{ backgroundColor: Colors.primary2, height: 1 }}
        renderLabel={({ route, focused }) => (
          <AppText
            bold
            style={{
              color: focused ? Colors.primary2 : '#0006',
              fontSize: SH(14),
              textAlign: 'center',
            }}
          >
            {route?.item?.title}
          </AppText>
        )}
      />
    );
  };

  const onFocusOnTab = (index) => {
    setIndex(index);
  };

  const onPressSelectItem = (item) => {
    navigation.navigate('WebView', { mode: 0, title: item?.title, url: item?.url });
  };

  const renderTabView = () => {
    return (
      <TabView
        // navigationState={this.state}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderMenu}
        onIndexChange={onFocusOnTab}
        // onIndexChange={(index) => onFocusOnTab(index)}
      />
    );
  };

  const onCloseModal = () => {
    setIsVisible(false);
    setDataExtendKnowLeage([]);
    setTitleModal('');
  };

  useEffect(() => {
    fetchAllAPI();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral5, paddingBottom: SH(20) }}>
      <EnableTracking
        onOpenBottomSheet={() => {
          actionSheetRef.current.open();
        }}
      />
      {renderTabView()}
      <ModalKnowleage
        isVisible={isVisible}
        data={dataExtendKnowLeage}
        title={titleModal}
        onPressSelectItem={onPressSelectItem}
        onCloseModal={onCloseModal}
      />
      <BottomActionSheet
        ref={(ref) => (actionSheetRef.current = ref)}
        render={() => {
          return <PopupGuildEnable />;
        }}
        canClose={true}
        headerText={'Mở theo dõi ứng dụng'}
        haveCloseButton={true}
      ></BottomActionSheet>
    </View>
  );
};

export default NewsScreen;
