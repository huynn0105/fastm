import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import moment from 'moment/min/moment-with-locales';

import PropTypes from 'prop-types';

import { News } from 'app/models';
import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';
import Colors from '../theme/Color';
import { SH, SW } from '../constants/styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
// --------------------------------------------------
// NewsRow
// --------------------------------------------------

class NewsRow extends Component {
  // --------------------------------------------------
  shouldComponentUpdate(nextProps) {
    // since realm update isRead transparent with setState, setProps
    // so I cached the isRead to compare if realm db change it
    if (
      this.props.news.uid !== nextProps.news.uid ||
      this.props.isSeparatorHidden !== nextProps.isSeparatorHidden ||
      this.isRead !== nextProps.news.isRead
    ) {
      this.isRead = nextProps.news.isRead;
      return true;
    }
    return false;
  }
  // --------------------------------------------------
  onPress = () => {
    this.props.onPress(this.props.news);
  };
  // --------------------------------------------------
  render() {
    const { news, containerStyle, separatorStyle, isSeparatorHidden } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <KJTouchableOpacity onPress={this.onPress}>
          <View style={styles.rowContainer}>
            <View style={{ borderRadius: 8 }}>
              <Image
                source={{ uri: news?.postImage }}
                style={{
                  width: SW(155),
                  height: SH(86),
                  resizeMode: 'cover',
                  overflow: 'hidden',
                  borderRadius: 8,
                }}
              />
            </View>

            <View style={{ flex: 1, marginLeft: SW(16) }}>
              <Content
                isHighlight={!news.isRead}
                title={news.postTitle}
                details={news.details}
                time={moment(news.createdDate, 'X').fromNow()}
                views={news.totalViews}
                hashtag={news?.hashtag}
              />
              {/* {isSeparatorHidden ? null : <Seperator style={separatorStyle} />} */}
              <AppText
                style={[
                  !news.isRead ? styles.highlightTimeText : styles.timeText,
                  { textAlign: 'right' },
                ]}
              >
                {moment(news.createdDate, 'X').fromNow()}
              </AppText>
            </View>
          </View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const LogoImage = (props) => (
  <View style={styles.logoShadow}>
    <KJImage style={styles.logoImage} source={props.image} resizeMode="stretch" />
  </View>
);

const Content = (props) => {
  const titleStyle = props.isHighlight ? styles.highlightTitleText : styles.titleText;
  return (
    <View style={styles.contentContainer}>
      <View style={{ marginBottom: SH(8) }}>
        <TimeText
          isHighlight={props.isHighlight}
          // time={props.time}
          views={props.views}
          hastag={props.hashtag}
        />
      </View>
      <AppText style={titleStyle} numberOfLines={2}>
        {props.title}
      </AppText>
    </View>
  );
};

const TimeText = (props) => {
  const timeStyle = props.isHighlight ? styles.highlightTimeText : styles.timeText;
  const timeIconOpacity = props.isHighlight ? 1.0 : 0.5;
  return (
    <View
      style={{
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {props.hashtag !== '' && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <AppText style={timeStyle}>
            {`${props.hastag?.map((item) => `#${item}`)?.join(' ')}`}
          </AppText>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <AppText style={timeStyle} numberOfLines={1}>
          {props.time}
        </AppText>
      </View>
    </View>
  );
};

const Seperator = (props) => (
  <View
    style={[
      {
        height: 0.5,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginVertical: 16,
        // opacity: 0.6
      },
      props.style,
    ]}
  />
);

// --------------------------------------------------

NewsRow.propTypes = {
  news: PropTypes.instanceOf(News),
  // containerStyle: View.propTypes.style,
  // separatorStyle: View.propTypes.style,
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

NewsRow.defaultProps = {
  isSeparatorHidden: false,
  onPress: () => {},
};

export default NewsRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // marginVertical: 16,
  },
  contentContainer: {
    flex: 1,
    // marginTop: 6,
    // width: SCREEN_WIDTH * 0.6,
    // justifyContent: 'space-between',
  },
  logoImage: {
    // width: SCREEN_WIDTH - ((SCREEN_WIDTH * 0.6) + (16 * 3)),
    width: SW(155),
    height: SH(86),
    borderRadius: 8,
    resizeMode: 'contain',
  },
  titleText: {
    marginTop: 0,
    fontSize: 15,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: '#24253d',
  },
  detailsText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '300',
    color: '#000b',
  },
  timeText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
    opacity: 0.8,

    letterSpacing: 0,
    marginLeft: 4,
  },
  highlightTitleText: {
    marginTop: 0,
    fontSize: SH(14),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: SH(20),
    letterSpacing: 0,
    color: Colors.gray1,
  },
  highlightDetailsText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    color: '#000',
  },
  highlightTimeText: {
    fontSize: 14,
    color: Colors.primary3,
    opacity: 0.8,
    lineHeight: 16,
    letterSpacing: 0,
    marginLeft: 4,
  },
  timeIcon: {
    width: 13,
    height: 13,
  },
  viewIcon: {
    width: 14,
    height: 10.5,
  },
  logoShadow: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});
