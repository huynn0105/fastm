import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

import MapView from 'react-native-maps';

import PropTypes from 'prop-types';
import { Message } from '../../../submodules/firebase/model';
import { MESSAGE_TYPES } from '../../../submodules/firebase/model/Message';
import AudioPlayer from '../../Chat/AudioPlayer';
import ViewPlayerContainer from '../../Chat/VideoPlayerContainer';
import RemoteImage from '../../../components/common/RemoteImage';
import AppText from '../../../componentV3/AppText';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import Colors from '../../../theme/Color';
const LOG_TAG = 'QuotedView.js';
/* eslint-enable */

const _ = require('lodash');

const SCREEN_SIZE = Dimensions.get('window');

const QUOTED_WIDTH = SCREEN_SIZE.width * 0.5;

// --------------------------------------------------
// QuotedView.js
// --------------------------------------------------

class QuotedView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onImagePress = () => {
    if (this.props.onImagePress) {
      this.props.onImagePress({ image: this.props.message.quotedText });
    }
  };

  onLocationPress = (lat, lon) => {
    console.log(lat, lon);
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${lat},${lon}`,
      android: `http://maps.google.com/?q=${lat},${lon}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        return false;
      })
      .catch((err) => {
        Utils.log(`${LOG_TAG} open map err:`, err);
      });
  };

  renderAuthor(author, isSelf) {
    // eslint-disable-line
    return <AppText style={isSelf ? styles.nameSelf : styles.name}>{author}</AppText>;
  }

  renderQuotedContent(quotedType, text, isMine) {
    let quotedConntent = null;
    switch (quotedType) {
      case MESSAGE_TYPES.LOCATION:
        quotedConntent = this.rednerQuotedLocation;
        break;
      case MESSAGE_TYPES.IMAGES:
        quotedConntent = this.renderQuotedImage;
        break;
      case MESSAGE_TYPES.VIDEOS:
        quotedConntent = this.renderQuotedVideo;
        break;
      case MESSAGE_TYPES.AUDIOS:
        quotedConntent = this.renderQuotedAudio;
        break;
      default:
        quotedConntent = this.renderQuotedText;
    }
    return quotedConntent(text, isMine);
  }

  renderQuotedText(text, isMine) {
    return <AppText style={isMine ? styles.quotedSelf : styles.quoted}>{text}</AppText>;
  }

  rednerQuotedLocation = (location) => {
    const latlon = location.split('-');
    const lat = parseFloat(latlon[0]);
    const lon = parseFloat(latlon[1]);
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginLeft: 8, justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              height: QUOTED_WIDTH,
              minWidth: QUOTED_WIDTH,
              overflow: 'hidden',
            }}
            onPress={() => {
              this.onLocationPress(lat, lon);
            }}
          >
            <MapView
              style={{
                flex: 1,
                height: QUOTED_WIDTH,
                minWidth: QUOTED_WIDTH,
              }}
              region={{
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            />
            {/* work around for tapping in iOS  */}
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderQuotedImage = (imageURL) => {
    const contents = imageURL.split('[[');
    const url = contents[0].trim();
    let size = [QUOTED_WIDTH, QUOTED_WIDTH];
    if (contents.length >= 2) {
      size = contents[1].split('-');

      let width = parseFloat(size[0]);
      let heigth = parseFloat(size[1]);
      const tempWidth = parseFloat(size[0]);
      const tempHeight = parseFloat(size[1]);

      if (width < QUOTED_WIDTH) {
        width = QUOTED_WIDTH;
        heigth = (QUOTED_WIDTH / tempWidth) * tempHeight;
      }
      if (width > QUOTED_WIDTH) {
        width = QUOTED_WIDTH;
        heigth = (QUOTED_WIDTH / tempWidth) * tempHeight;
      }
      size = [width, heigth];
    }

    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={this.onImagePress}>
        <RemoteImage
          style={{
            flex: 0,
            width: size[0],
            height: size[1],
            resizeMode: 'cover',
          }}
          source={{ uri: url }}
        />
      </TouchableOpacity>
    );
  };

  renderQuotedVideo(text, isMine) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ height: '100%', marginLeft: 8, justifyContent: 'center' }}>
          <ViewPlayerContainer
            video={text}
            isMine={isMine}
            videoPlayerStyle={{
              margin: 0,
              borderRadius: 0,
            }}
            videoStyle={{
              width: QUOTED_WIDTH,
              height: QUOTED_WIDTH,
            }}
          />
        </View>
      </View>
    );
  }

  renderQuotedAudio(audioURL, isMine) {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <AudioPlayer audio={audioURL} isMine={isMine} width={QUOTED_WIDTH} />
      </View>
    );
  }

  renderContent() {
    const { message, isSelf } = this.props;
    const { quotedText, quotedType } = message;
    const components = quotedText.split('>>>');
    let name = '';
    let text = '';
    if (components !== undefined && components.length === 2) {
      name = components[0];
      text = components[1];
      text.trim(quotedType.trim(), text.trim(), isSelf);
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={isSelf ? styles.contentSelf : styles.content}>
          <View style={isSelf ? styles.verticleLineSelf : styles.verticleLine} />
          <View>
            {this.renderAuthor(name.trim(), isSelf)}
            <View style={{ marginBottom: 8 }}>
              {this.renderQuotedContent(quotedType.trim(), text.trim(), isSelf)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderHtmlText() {
    const { message, isSelf } = this.props;
    const htmlContent = message.htmlText;
    const components = htmlContent.split('>>>');
    let name = '';
    let content = '';
    if (components !== undefined && components.length === 2) {
      name = components[0];
      content = components[1];
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={isSelf ? styles.contentSelf : styles.content}>
          <View style={isSelf ? styles.verticleLineSelf : styles.verticleLine} />
          <View>
            <AppText style={isSelf ? styles.nameSelf : styles.name}>{name.trim()}</AppText>
            <AppText style={isSelf ? styles.quotedSelf : styles.quoted}>{content.trim()}</AppText>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { message } = this.props;
    const quotedID = message.quotedID;
    // for old prop, will be remove soon
    if (message.htmlText && message.htmlText.length > 0) {
      return this.renderHtmlText();
    }
    //
    return quotedID ? this.renderContent() : null;
  }
}

// --------------------------------------------------

QuotedView.defaultProps = {
  message: {},
};

QuotedView.propTypes = {
  message: PropTypes.instanceOf(Message),
};

export default QuotedView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: Platform.OS === 'ios' ? 0 : 6,
    backgroundColor: '#0000',
    justifyContent: 'center',
  },
  nameSelf: {
    color: '#fff',
    backgroundColor: '#0000',
    fontSize: 12,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8,
  },
  name: {
    color: '#000b',
    backgroundColor: '#0000',
    fontSize: 12,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8,
  },
  contentSelf: {
    flexDirection: 'row',
    backgroundColor: '#adf3',
    paddingRight: 8,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral5,
    paddingRight: 8,
  },
  markSelf: {
    color: '#fffc',
    fontWeight: '500',
    fontSize: 13,
  },
  mark: {
    color: '#000a',
    fontWeight: '500',
    fontSize: 13,
  },
  verticleLineSelf: {
    width: 1,
    marginRight: 8,
    paddingTop: Platform.OS === 'ios' ? 3 : 4,
    backgroundColor: '#fffb',
    paddingBottom: Platform.OS === 'ios' ? 7 : 0,
  },
  verticleLine: {
    width: 1,
    marginRight: 8,
    paddingTop: Platform.OS === 'ios' ? 3 : 4,
    backgroundColor: '#13a7e2',
    paddingBottom: Platform.OS === 'ios' ? 7 : 0,
  },
  quotedSelf: {
    color: '#fff',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 4,
    fontStyle: 'italic',
    paddingBottom: 8,
  },
  quoted: {
    color: '#000b',
    backgroundColor: '#0000',
    fontSize: 13,
    fontWeight: '400',
    paddingLeft: 4,
    fontStyle: 'italic',
    paddingBottom: 8,
  },
  hrSelf: {
    height: 1,
    backgroundColor: '#fff6',
    marginBottom: Platform.OS === 'ios' ? 2 : 6,
    marginTop: 4,
    top: Platform.OS === 'ios' ? -8 : 0,
  },
  hr: {
    height: 1,
    backgroundColor: '#0004',
    marginBottom: Platform.OS === 'ios' ? 2 : 6,
    marginTop: 4,
    top: Platform.OS === 'ios' ? -8 : 0,
  },
});
