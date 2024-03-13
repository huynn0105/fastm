import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import KJImage from 'app/components/common/KJImage';

import { Notification } from '../../models';
import colors from '../../constants/colors';

// --------------------------------------------------

class NotificationRow extends Component {
  // --------------------------------------------------
  shouldComponentUpdate(nextProps) {
    // since realm update isRead transparent with setState, setProps
    // so I cached the isRead to compare if realm db change it
    if (this.props.notification.uid !== nextProps.notification.uid ||
      this.isRead !== nextProps.notification.isRead) {
      this.isRead = nextProps.notification.isRead;
      return true;
    }
    return false;
  }
  // --------------------------------------------------
  onPress = () => {
    this.props.onPress(this.props.notification);
  }
  // --------------------------------------------------
  render() {
    const {
      notification,
    } = this.props;

    return (
      <View style={styles.container}>
        <Seperator />
        <TouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.65}
        >
          <View style={styles.rowContainer} >
            <View>
              <LogoImage
                image={notification.imageURI()}
                isHighlight={!notification.isRead}
              />
            </View>
            <View style={{ width: 8 }} />
            <Content
              isHighlight={!notification.isRead}
              title={notification.details}
              time={notification.createTimeAgoString()}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const LogoImage = (props) => (
  <KJImage
    style={{
      width: 100,
      height: 62,
    }}
    source={props.isHighlight ? props.image : (props.image.uri ? props.image : require('./img/read.png'))}
    // source={props.image}
    resizeMode="contain"
  />
);

const Content = (props) => {
  const titleStyle = props.isHighlight ? styles.highlightTitleText : styles.titleText;
  return (
    <View style={styles.contentContainer}>
      <Text
        style={titleStyle}
        numberOfLines={2}
      >
        {props.title}
      </Text>
      <TimeText
        isHighlight={props.isHighlight}
        time={props.time}
      />
    </View>
  );
};

const TimeText = (props) => {
  const timeStyle = props.isHighlight ? styles.highlightTimeText : styles.timeText;
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 4,
      }}
    >
      <Image
        style={[styles.timeIcon, { opacity: 0.5 }]}
        source={require('./img/time2.png')}
        resizeMode="contain"
      />
      <Text style={timeStyle}>
        {props.time}
      </Text>
    </View>
  );
};

// 27/04/18
// const ReadDot = () => (
//   <View
//     style={{
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//       width: 14,
//       height: 14,
//       borderRadius: 7,
//       borderWidth: 2.3,
//       borderColor: '#fff',
//       backgroundColor: '#00A0F3',
//     }}
//   />
// );

const Seperator = () => (
  <View
    style={{
      height: 1.0,
      backgroundColor: colors.separator,
      marginLeft: 12,
      marginRight: 12,
    }}
  />
);

// --------------------------------------------------

NotificationRow.propTypes = {
  notification: PropTypes.instanceOf(Notification),
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

NotificationRow.defaultProps = {
  isSeparatorHidden: false,
  onPress: () => { },
};

export default NotificationRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  titleText: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: '300',
    color: '#000',
  },
  detailsText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '300',
    color: '#0008',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '300',
    color: '#0008',
  },
  highlightTitleText: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: '600',
    color: '#005dca',
  },
  highlightDetailsText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },
  highlightTimeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '300',
    color: '#0008',
  },
  timeIcon: {
    alignSelf: 'center',
    width: 14,
    height: 14,
  },
});
