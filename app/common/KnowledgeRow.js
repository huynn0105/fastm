import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';
import { Knowledge } from '../models';
import KJImage from './KJImage';

// --------------------------------------------------
// KnowledgeRow
// --------------------------------------------------

class KnowledgeRow extends Component {
  // --------------------------------------------------
  shouldComponentUpdate(nextProps) {
    // since realm update isRead transparent with setState, setProps
    // so I cached the isRead to compare if realm db change it
    if (this.props.knowledge.uid !== nextProps.knowledge.uid ||
      this.props.isSeparatorHidden !== nextProps.isSeparatorHidden ||
      this.isRead !== nextProps.knowledge.isRead) {
      this.isRead = nextProps.knowledge.isRead;
      return true;
    }
    return false;
  }
  // --------------------------------------------------
  onPress = () => {
    this.props.onPress(this.props.knowledge);
  }
  // --------------------------------------------------
  render() {
    const {
      knowledge, isSeparatorHidden,
    } = this.props;
    return (
      <Animatable.View
        style={styles.container}
        animation="fadeIn"
        useNativeDriver
      >
        <KJTouchableOpacity
          onPress={this.onPress}
        >
          <View style={styles.rowContainer} >
            <View>
              <LogoImage
                image={knowledge.imageURI()}
              />
              {
                knowledge.isRead ? null :
                  <ReadDot />
              }
            </View>
            <View style={{ width: 8 }} />
            <Content
              isHighlight={!knowledge.isRead}
              title={knowledge.title}
              details={knowledge.details}
              time={knowledge.createTimeAgoString()}
            />
          </View>
          {
            isSeparatorHidden ? null :
              <Seperator />
          }
        </KJTouchableOpacity>
      </Animatable.View>
    );
  }
}

// --------------------------------------------------

const LogoImage = (props) => (
  <KJImage
    style={{
      width: 64,
      height: 78,
      borderRadius: 2.0,
    }}
    source={props.image}
    resizeMode="cover"
  />
);

const Content = (props) => {
  const titleStyle = props.isHighlight ? styles.highlightTitleText : styles.titleText;
  const detailsStyle = props.isHighlight ? styles.highlightDetailsText : styles.detailsText;
  return (
    <View style={styles.contentContainer}>
      <AppText
        style={titleStyle}
        numberOfLines={2}
      >
        {props.title}
      </AppText>
      <AppText
        style={detailsStyle}
        numberOfLines={2}
      >
        {props.details}
      </AppText>
      <TimeText
        isHighlight={props.isHighlight}
        time={props.time}
      />
    </View>
  );
};

const TimeText = (props) => {
  const timeStyle = props.isHighlight ? styles.highlightTimeText : styles.timeText;
  const timeIconOpacity = props.isHighlight ? 1.0 : 0.5;
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: 4,
      }}
    >
      <Image
        style={[styles.timeIcon, { opacity: timeIconOpacity }]}
        source={require('./img/time2.png')}
        resizeMode="cover"
      />
      <AppText
        style={timeStyle}
        numberOfLines={1}
      >
        {props.time}
      </AppText>
    </View>
  );
};

const ReadDot = () => (
  <View
    style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2.3,
      borderColor: '#fff',
      backgroundColor: '#00A0F3',
    }}
  />
);

const Seperator = () => (
  <View
    style={{
      height: 0.5,
      marginTop: 12,
      backgroundColor: '#808080A0',
    }}
  />
);

// --------------------------------------------------

KnowledgeRow.propTypes = {
  knowledge: PropTypes.instanceOf(Knowledge),
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

KnowledgeRow.defaultProps = {
  isSeparatorHidden: false,
  onPress: () => { },
};

export default KnowledgeRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    backgroundColor: '#f000',
    marginLeft: 4,
  },
  titleText: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: '300',
    color: '#000',
  },
  detailsText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '300',
    color: '#0008',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '300',
    color: '#000b',
  },
  highlightTitleText: {
    marginTop: 0,
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  highlightDetailsText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    color: '#000',
  },
  highlightTimeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '400',
    color: '#000b',
  },
  timeIcon: {
    alignSelf: 'center',
    width: 14,
    height: 14,
  },
});
