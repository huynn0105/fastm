import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { WebView } from 'react-native-webview';
import CharAvatar from '../components/CharAvatar';
const _ = require('lodash');
import AppText from '../componentV3/AppText';
import {IMAGE_PATH} from '../assets/path';

// --------------------------------------------------
// ViewAvatar
// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

export default class ViewAvatar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onClosePress = () => {
    this.props.onClosePress();
  }

  onChatPress = () => {
    if (this.props.onChatPress) {
      this.props.onChatPress(this.props.user);
    }
  }

  render() {
    const { moveIn, close, baseReviewUrl, uid, accessToken, avatarURI, name } = this.props;
    const uri = `${baseReviewUrl}/${uid}?accessToken=${accessToken}`;
    return (
      <TouchableOpacity
        style={[styles.touchContainer,
        moveIn ? {} : { top: 6000, bottom: 6000 }]}
        onPress={() => {}}
        activeOpacity={1}
      >
        <Animatable.View
          style={[styles.container, moveIn ? {} : { top: 6000, bottom: 6000 }]}
          animation={close ? 'fadeOut' : 'fadeIn'}
          duration={300}
          useNativeDriver
        >
          <View style={styles.contentCotainer}>
              {(baseReviewUrl && uid && accessToken) ? 
                <WebView
                  source={{ uri }}
                  style={styles.webView}
                /> : 
                <View style={{ flex: 1, alignItems: 'center', marginVertical: 12 }}>
                  <CharAvatar
                    avatarStyle={styles.avatar}
                    source={avatarURI}
                    defaultName={name}
                    textStyle={{
                      color: '#fff',
                      fontSize: 46,
                    }}
                  />
                  <AppText style={styles.name}>
                    {name}
                  </AppText>
                  <View
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Image
                      style={styles.emptyImage}
                      source={IMAGE_PATH.empty_review}
                    />
                    <AppText style={styles.txtEmpty}>Hiện tại chưa có đánh giá nào về người này</AppText>
                  </View>
                </View>

              }
            <TouchableOpacity onPress={this.onClosePress}>
              <View style={styles.footer}>
                <AppText style={styles.txtClose}>Đóng</AppText>
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </TouchableOpacity >
    );
  }
}

// --------------------------------------------------

const styles = StyleSheet.create({
  touchContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  contentCotainer: {
    width: SCREEN_SIZE.width - 32,
    height: SCREEN_SIZE.height / 1.5,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  webView: {
    width: SCREEN_SIZE.width - 32,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  emptyImage: {
    height: SCREEN_SIZE.height / 6,
    aspectRatio: 121 / 79,
    marginTop: 36,
    marginBottom: 30,
  },
  txtEmpty: {
    fontSize: 14,
    color: '#24253d',
    opacity: 0.7
  },
  footer: {
    width: '100%',
    height: 52,
    backgroundColor: '#E6EBFF',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtClose: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#39b818'
  },
  background: {
    position: 'absolute',
    top: 40,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  close: {
    width: 20,
    height: 20,
    marginTop: 16,
    marginRight: 16,
  },
  avatar: {
    height: 88,
    width: 88,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 44,
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    marginLeft: 0,
    marginRight: 0,
    color: '#808080',
    fontSize: 13,
    fontWeight: '300',
  },
  status: {
    marginRight: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    backgroundColor: '#E6EBFF',
  },
});
