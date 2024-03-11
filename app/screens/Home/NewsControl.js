import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';

import PropTypes from 'prop-types';

import { News } from '../../models';
import NewsList from '../../common/NewsList';
import TextButton from '../../common/buttons/TextButton';
import HotNewsSlideView from './HotNewsSlideView';
import ContestBannerSwiper from '../../screenV3/Home/ContestBannerSwiper';

import colors from '../../theme/Color';
import { SH } from '../../constants/styles';
import AppText from '../../componentV3/AppText';
import FinanceNews from '../../screenV3/News/components/FinanceNews';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';

const _ = require('lodash');

// --------------------------------------------------
// NewsControl
// --------------------------------------------------

class NewsControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasDelayShowContenst: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hasDelayShowContenst: false });
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onItemPress = (item) => {
    this.props.onItemPress(item);
  };
  onMorePress = () => {
    this.props.onMorePress();
  };
  onViewMorePress = () => {
    this.props.onViewMorePress();
  };

  isDeepLink(url) {
    return url && (url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith('tel:'));
  }

  onPressBanner = (item) => {
    if (this.isDeepLink(item.url)) {
      Linking.openURL(item.url);
      return false;
    }
    this.props.onPressBanner(item);
  };

  renderSwiperBanner = () => {
    const { contests } = this.props;
    const { hasDelayShowContenst } = this.state;
    if (hasDelayShowContenst) return <View />;
    const isShowlistBanner =
      contests && Array.isArray(contests.processing) && contests.processing.length > 0;
    if (!isShowlistBanner) return <View />;
    const list = [];
    contests.processing.map((categories) => categories.items.map((item) => list.push(item)));

    return (
      <ContestBannerSwiper
        dataSource={list}
        onBannerItemPress={(item) => {
          this.onPressBanner(item);
        }}
      />
    );
  };

  // --------------------------------------------------
  render() {
    const {
      style,
      viewMode,
      title,
      viewMoreTitle,
      extraData,
      emptyDataText,
      indexMenu,
      allNews,
      tipNews,
    } = this.props;

    const titleMenu = indexMenu?.title;

    const hotNews = allNews.filter((item) => item.isHighlight);

    const isViewMoreHidden = viewMode !== 'short';

    const containerOverrideStyle = viewMode === 'short' ? {} : styles.containerOverride;
    const listOverrideStyle = viewMode === 'short' ? {} : styles.listContainerOverride;
    const titleOverrideStyle = viewMode === 'short' ? {} : styles.titleContainerOverride;

    const isLastRowSeparatorHidden = true;

    // if(indexMenu !== 'Taa')

    const listNewsRender =
      titleMenu === 'Tất cả'
        ? allNews.filter((item) => !item.isHighlight)
        : titleMenu === 'Bí quyết'
        ? tipNews
        : allNews.filter((item) => item.hashtag.includes(titleMenu));

    return (
      <View>
        {viewMode !== 'short' && hotNews && hotNews.length > 0 && titleMenu === 'Tất cả' ? (
          <View style={styles.hotNewsContainer}>
            <HotNewsSlideView data={hotNews} title="Tin tức nổi bật" onPress={this.onItemPress} />
            <View style={{ height: SH(16) }} />
          </View>
        ) : null}

        {this.renderSwiperBanner()}
        <View style={[styles.container, style, containerOverrideStyle]}>
          <View style={[styles.titleContainer, titleOverrideStyle]}>
            <AppText medium style={styles.titleText}>
              {titleMenu === 'Tất cả' ? title : `Tin tức ${titleMenu}`}
            </AppText>
            {/* {
              isMoreButtonHidden ? null :
                <MoreButton
                  onPress={this.onMorePress}
                />
            } */}
          </View>
          {/* <View style={styles.divider} /> */}
          <View style={[styles.listContainer, listOverrideStyle]}>
            {titleMenu === 'Tài chính' ? (
              <FinanceNews newsList={listNewsRender} onItemPress={this.onItemPress} />
            ) : (
              <NewsList
                data={listNewsRender}
                extraData={extraData}
                isLastRowSeparatorHidden={isLastRowSeparatorHidden}
                onItemPress={this.onItemPress}
                emptyDataText={emptyDataText}
              />
            )}
            {isViewMoreHidden ? null : (
              <ViewMoreRow title={viewMoreTitle} onPress={this.onViewMorePress} />
            )}
          </View>
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

const ViewMoreRow = (props) => (
  <View style={styles.viewMoreContainer}>
    <TextButton
      style={styles.viewMoreButton}
      title={props.title}
      titleStyle={styles.viewMoreButtonTitle}
      isArrowHidden
      onPress={props.onPress}
      iconSource={require('./img/next.png')}
    />
  </View>
);

// --------------------------------------------------

NewsControl.propTypes = {
  viewMode: PropTypes.oneOf(['short', 'full']),
  data: PropTypes.arrayOf(PropTypes.instanceOf(News)),
  title: PropTypes.string,
  viewMoreTitle: PropTypes.string,
  onItemPress: PropTypes.func,
  onMorePress: PropTypes.func,
  onViewMorePress: PropTypes.func,
};

NewsControl.defaultProps = {
  viewMode: 'short',
  data: [],
  title: 'Tin tức khác',
  viewMoreTitle: 'Xem thêm >',
  onItemPress: () => {},
  onMorePress: () => {},
  onViewMorePress: () => {},
};

export default NewsControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 0,
    backgroundColor: colors.neutral5,
  },
  containerOverride: {
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  listContainer: {
    marginBottom: 0,
  },
  listContainerOverride: {
    // borderColor: '#0000',
    // shadowColor: '#0000',
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: SH(12),
    paddingRight: 6,
  },
  titleContainerOverride: {},
  titleText: {
    flex: 1,
    fontSize: SH(14),
    lineHeight: SH(20),
    color: colors.gray1,
    backgroundColor: '#0000',
  },
  moreButton: {
    flex: 0,
    flexDirection: 'row',
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f7f7f',
  },
  moreButtonIcon: {
    alignSelf: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  viewMoreContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  viewMoreButton: {
    marginTop: 0,
  },
  viewMoreButtonTitle: {
    fontWeight: '400',
    color: '#1B94E3',
  },
  hotNewsContainer: {
    // paddingTop: 16,
    backgroundColor: colors.neutral5,
  },
  divider: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    marginTop: 4,
    marginBottom: 12,
  },
});
