import React, { Component } from 'react';
import {
  Dimensions,
  View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import Styles from 'app/constants/styles';
import DatabaseManager from 'app/manager/DatabaseManager';
import styles from './styles';
import KnowledgesControl from './KnowledgesControl';
import NewsControl from './NewsControl';
import SubscriptionsControl from './SubscriptionsControl';
import UserAppsControl from './UserAppsControl';
import ShopControl from './ShopControl';
import CustomNewsControl from './CustomNewsControl';
import BadLoansControl from './BadLoansControl';
import DelModControl from './DelModControl';

import { TABS } from './HomeTabbar';

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

class ContentViewTab extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  addingMissingNewInHot3 = (hotNewsData, newsData) => {
    if (hotNewsData !== null && hotNewsData.length < 3) {
      newsData.sort((item1, item2) => {
        if (item1.sortPosition < item2.sortPosition) { return -1; }
        else if (item1.sortPosition > item2.sortPosition) { return 1; }
        return 0;
      });

      const addingNew = [];
      // num of addingnews
      for (let i = 0; i < 3 - hotNewsData.length; i += 1) {
        for (let j = 0; j < newsData.length; j += 1) {
          const news = newsData[j];
          let isExist = false;

          // check exist
          for (let iHot = 0; iHot < hotNewsData.length; iHot += 1) {
            const hotNew = hotNewsData[iHot];
            if (news.uid === hotNew.uid) {
              isExist = true;
            }
          }
          // check added
          for (let iHot = 0; iHot < addingNew.length; iHot += 1) {
            const hotNew = addingNew[iHot];
            if (news.uid === hotNew.uid) {
              isExist = true;
            }
          }
          if (isExist === false) {
            addingNew.push(news);
            break;
          }
        }
      }
      return hotNewsData.concat(addingNew);
    }
    return hotNewsData;
  }

  moveInFrom = (index) => {
    if (this.handleViewRef) {
      if (index < this.props.selectedIndex) {
        // for first time
        if (index === -1) {
          this.handleViewRef.fadeIn(250);
        }
        else {
          this.handleViewRef.slideInRight(250);
        }
      }
      else {
        this.handleViewRef.slideInLeft(250);
      }
    }
    // if (this.handleViewRef) {
    //   if (index < this.props.selectedIndex) {
    //     this.handleViewRef.fadeInRight();
    //   }
    //   else {
    //     this.handleViewRef.fadeInLeft();
    //   }
    // }
  }
  moveOutFor = () => {
    // if (this.handleViewRef) {
    //   if (index < this.props.selectedIndex) {
    //     this.handleViewRef.slideOutRight();
    //   }
    //   else {
    //     this.handleViewRef.slideOutLeft();
    //   }
    // }
    this.handleViewRef.fadeOut(10);
  }

  render() {
    const userAppListData = this.props.userAppListData;
    const userAppListExtraData = this.props.userAppsExtraData;

    const userAppLightListData = this.props.userAppLightListData;
    const userAppLightListExtraData = this.props.userAppLightListExtraData;

    const subscriptionsData = this.props.subscriptions.items;
    const subscriptionsAvailableCount = this.props.subscriptions.availableCount;
    const subscriptionsExtraData = this.props.subscriptionsExtraData;
    const subscriptionsTitle = 'Danh sách nghiệp vụ';
    const isSubscriptionsRegisterHidden = subscriptionsAvailableCount === 0;
    const subscriptionsRegisterTitle = `Vẫn còn ${subscriptionsAvailableCount} công việc hấp dẫn đang chờ`;
    const subscriptionsEmptyDataText = this.props.isGetSubscriptionsProcessing ?
      'Đang tải ...' : 'Đang tải ...';

    const noticeNewsTitle = this.props.selectedIndex === TABS.GENERAL ?
      'Tin tức nổi bật' : 'Tin tức khác';
    const noticeNewsViewMode = this.props.selectedIndex === TABS.GENERAL ?
      'short' : 'full';
    let noticeNewsData = [];
    let emptyNewsText = '';
    let hotNewsData = DatabaseManager.shared().findHighlightedNews();
    hotNewsData = this.addingMissingNewInHot3(hotNewsData, this.props.noticeNews);
    if (this.props.selectedIndex === TABS.GENERAL) {
      noticeNewsData = DatabaseManager.shared().findHighlightedNews();
      noticeNewsData = this.addingMissingNewInHot3(noticeNewsData, this.props.noticeNews);
      hotNewsData = [];
    } else if (this.props.isFilterUnReadNoticeNews) {
      noticeNewsData = this.props.noticeNews.filter((news) => !news.isRead);
      noticeNewsData.sort((item1, item2) => {
        if (item1.sortPosition < item2.sortPosition) { return -1; }
        else if (item1.sortPosition > item2.sortPosition) { return 1; }
        return 0;
      });
      emptyNewsText = 'Bạn đã đọc tất cả tin tức';
    } else {
      noticeNewsData = this.props.noticeNews;
      noticeNewsData.sort((item1, item2) => {
        if (item1.sortPosition < item2.sortPosition) { return -1; }
        else if (item1.sortPosition > item2.sortPosition) { return 1; }
        return 0;
      });
      emptyNewsText = 'Không có tin tức nào';
    }
    if (this.props.noticeNews.length === 0) {
      emptyNewsText = 'Đang tải ...';
    }

    const customNews = this.props.customNews;

    const knowledgesTitle = this.props.selectedIndex === TABS.GENERAL ?
      'Kiến thức nổi bật' : 'Kiến thức mới nhất';
    const knowledgesViewMode = this.props.selectedIndex === TABS.GENERAL ?
      'short' : 'full';
    let knowledgesData = [];
    let emptyKnowledgesText = '';
    knowledgesData = this.props.knowledges;
    knowledgesData.sort((item1, item2) => {
      if (item1.sortPosition < item2.sortPosition) { return 1; }
      else if (item1.sortPosition > item2.sortPosition) { return -1; }
      return 0;
    });
    emptyKnowledgesText = 'Không có kiến thức nào';

    if (this.props.knowledges.length === 0) {
      emptyKnowledgesText = 'Đang tải ...';
    }

    return (
      <Animatable.View
        ref={ref => { this.handleViewRef = ref; }}
        style={[
          {
            // work on android
            width: this.props.isActive ? SCREEN_SIZE.width : 0,
            position: this.props.isActive ? 'relative' : 'absolute',
            // work on ios
            display: this.props.isActive ? 'flex' : 'none',
          },
          this.props.styles]}
        animation="fadeIn"
        useNativeDriver
      >
        {/* // del mod */}
        {
          this.props.showSubContent && this.props.delMod &&
            (this.props.selectedIndex === TABS.GENERAL &&
              this.props.delMod.title) ?
            <DelModControl
              delMod={this.props.delMod}
              onItemPress={this.props.onDelModPress}
            />
            : null
        }
        {
          // <View style={styles.sectionSeparatorWhite} />
        }
        {/* // user app */}
        {
          this.props.showSubContent && userAppListData &&
            (this.props.selectedIndex === TABS.GENERAL &&
              (userAppListData.length > 0 || userAppLightListData.length > 0)) ?
            <UserAppsControl
              data={userAppListData}
              lightData={userAppLightListData}
              extraData={userAppListExtraData}
              onItemPress={this.props.onUserAppPress}
              onItemLightPress={this.props.onUserAppLightPress}
            />
            : null
        }
        {
          (this.props.selectedIndex === TABS.GENERAL &&
            userAppListData.length > 0) ?
            <View style={Styles.sectionSeparator} />
            : null
        }
        {/* // bad loan */}
        {
          this.props.showSubContent && this.props.badLoans &&
            (this.props.selectedIndex === TABS.GENERAL &&
              this.props.badLoans != null) ?
            <BadLoansControl
              data={[this.props.badLoans]}
              isGettingBadLoans={this.props.isGettingBadLoans}
              onItemPress={this.props.onBadLoanPress}
            />
            : null
        }
        {
          this.props.showSubContent &&
            (this.props.selectedIndex === TABS.GENERAL &&
              userAppListData.length > 0) ?
            <View style={Styles.sectionSeparator} />
            : null
        }
        {/* // sub */}
        {
          this.props.showSubContent &&
            subscriptionsData &&
            this.props.selectedIndex === TABS.GENERAL ?
            <SubscriptionsControl
              title={subscriptionsTitle}
              registerTitle={subscriptionsRegisterTitle}
              data={subscriptionsData}
              extraData={subscriptionsExtraData}
              emptyDataText={subscriptionsEmptyDataText}
              isLastRowSeparatorHidden={isSubscriptionsRegisterHidden}
              isRegisterHidden={isSubscriptionsRegisterHidden}
              onItemPress={this.props.onSubscriptionPress}
              onRegisterPress={this.props.onSubscriptionRegisterPress}
            />
            : null
        }
        {
          this.props.showHomeContent &&
            this.props.selectedIndex === TABS.SHOP ?
            <ShopControl
              title={(this.props.selectedIndex === TABS.GENERAL) ?
                'Mặt hàng nổi bật' : 'Danh sách hàng hoá'}
              onPressCard={this.props.onPressCard}
              onPressItem={this.props.onPressShopItem}
            />
            : null
        }
        {
          this.props.showHomeContent &&
            this.props.selectedIndex === TABS.GENERAL ?
            <View style={Styles.sectionSeparator} />
            : null
        }
        {
          this.props.showHomeContent &&
            (this.props.selectedIndex === TABS.GENERAL ||
              this.props.selectedIndex === TABS.KNOWLEDGE) ?
            <KnowledgesControl
              viewMode={knowledgesViewMode}
              title={knowledgesTitle}
              data={knowledgesData}
              extraData={this.props.totalUnReadKnowledges}
              onItemPress={this.props.onKnowledgePress}
              onMorePress={this.props.onKnowledgesMorePress}
              onViewMorePress={this.props.onKnowledgesViewMorePress}
              emptyDataText={emptyKnowledgesText}
            />
            : null
        }
        {
          this.props.showHomeContent &&
            customNews && customNews.length > 0 &&
            this.props.selectedIndex === TABS.GENERAL ?
            <View style={Styles.sectionSeparator} />
            : null
        }
        {
          this.props.showHomeContent &&
            customNews && customNews.length > 0 &&
            this.props.selectedIndex === TABS.GENERAL ?
            <CustomNewsControl customNews={customNews} onPress={this.props.onCustomNewsPressed} />
            : null
        }
        {
          this.props.showHomeContent &&
            this.props.selectedIndex === TABS.GENERAL ?
            <View style={Styles.sectionSeparator} />
            : null
        }
        {
          this.props.showHomeContent &&
            (this.props.selectedIndex === TABS.GENERAL ||
              this.props.selectedIndex === TABS.NEWS) ?
            <NewsControl
              viewMode={noticeNewsViewMode}
              title={noticeNewsTitle}
              data={noticeNewsData}
              extraData={this.props.totalUnReadNoticeNews}
              hotNews={hotNewsData}
              onItemPress={this.props.onNewsPress}
              onMorePress={this.props.onNoticeNewsMorePress}
              onViewMorePress={this.props.onNoticeNewsViewMorePress}
              emptyDataText={emptyNewsText}
            />
            : null
        }
      </Animatable.View>
    );
  }
}

export default ContentViewTab;
