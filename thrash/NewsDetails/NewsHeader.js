import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import HTMLView from 'react-native-htmlview';
import ScalableImage from 'react-native-scalable-image';

import PropTypes from 'prop-types';

import TimeAgoText from 'common/TimeAgoText';
import ViewsCounterText from 'common/ViewsCounterText';

import Colors from '../../constants/colors';
import { News } from '../../models';


const SCREEN_SIZE = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_SIZE.width;
const IMAGE_HEIGHT = SCREEN_SIZE.height;

// --------------------------------------------------
// NewsHeader
// --------------------------------------------------

class NewsHeader extends PureComponent {
  onImagePress = () => {
    this.props.onImagePress();
  }
  // --------------------------------------------------
  render() {
    const { news, containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          onPress={this.onImagePress}
        >
          <ScalableImage
            width={IMAGE_WIDTH}
            style={styles.headerImage}
            source={{ uri: news.image }}
          />
        </TouchableOpacity>
        <View style={styles.bodyContainer}>
          <Text
            style={styles.titleText}
          >
            {news.title}
          </Text>
          <View style={styles.infoContainer}>
            <TimeAgoText timeAgo={news.createTimeAgoString()} />
            <View style={{ width: 12 }} />
            <ViewsCounterText count={news.totalViews} />
          </View>
          <View style={styles.separator} />
          <HTMLView
            style={styles.detailsText}
            value={news.htmlContent}
            paragraphBreak={'\n'}
            lineBreak={'\n'}
          />
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

NewsHeader.propsTypes = {
  news: PropTypes.instanceOf(News),
  onImagePress: PropTypes.func,
};

NewsHeader.defaultProps = {
  news: {},
  onImagePress: () => {},
};

export default NewsHeader;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E6EBFF',
    elevation: 2,
    shadowColor: '#808080',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.35,
    shadowRadius: 1.5,
    marginBottom: 12,
  },
  bodyContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  headerImage: {
    flex: 1,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
  },
  titleText: {
    color: Colors.text_black1,
    fontSize: 20,
  },
  detailsText: {
    marginTop: 12,
    color: Colors.text_black2,
    fontSize: 14,
  },
  separator: {
    height: 1.0,
    marginTop: 12,
    backgroundColor: '#E2E2E2',
  },
});

// --------------------------------------------------

// test
// const defaultNews = {
//   uid: '6',
//   groupID: '2',
//   categoryID: '2',
//   title: 'Kiến thức 1',
//   details: 'Rome history spans more than 2,500 years. ...',
//   image: 'http://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/1.2.0/bbc_news_logo.png',
//   createTime: 1507190995,
// };
// Object.setPrototypeOf(defaultNews, News.prototype);
//
// NewsScreen.defaultProps = {
//   news: Object.setPrototypeOf(defaultNews, News.prototype),
// };
// end
