/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  FlatList,
  Alert,
  ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';

import ActionSheet from 'react-native-actionsheet';

import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RemoteImage from 'app/components/common/RemoteImage';
import Strings from 'app/constants/strings';

import ImageUtils from '../../utils/ImageUtils';

import KJButton from 'app/components/common/KJButton';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { ICON_PATH } from '../../assets/path';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Utils';
import ImageZoom from 'react-native-image-pan-zoom';
const LOG_TAG = 'ImagesViewer/index.js';
/* eslint-enable */

// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

// --------------------------------------------------
// ImagesViewer
// --------------------------------------------------

class ImagesViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloading: 'none',
      beginIndex: this.props.beginIndex,
      showMenuBar: true,
      isLoadingImage: true,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onBackPress = () => {
    this.props.onBackPress();
  };
  onSavePress = (item) => {
    // this.onActionSheetPress(1);

    ImageUtils.mSaveToCameraRoll(item?.url)
      .then((response) => {
        Alert.alert('Lưu ảnh thành công!');
      })
      .catch(() => Alert.alert('Đã có lỗi xảy ra. Vui lòng thử lại sau.'));
  };
  onLongPress = () => {
    this.actionSheet.show();
  };
  onActionSheetPress = (index) => {
    const url = this.props.imageURLs[this.imageViewer.state.currentShowIndex];
    if (index === 1) {
      this.setState({
        downloading: 'downloading',
        beginIndex: this.imageViewer.state.currentShowIndex,
      });
      ImageUtils.saveImage(url)
        .then((doneDownload) => {
          if (doneDownload) {
            this.setState({
              downloading: 'done',
              beginIndex: this.imageViewer.state.currentShowIndex,
            });
            setTimeout(() => {
              this.setState({
                downloading: 'none',
                beginIndex: this.imageViewer.state.currentShowIndex,
              });
            }, 1000);
          }
        })
        .catch(() => {
          this.setState({
            downloading: 'fail',
            beginIndex: this.imageViewer.state.currentShowIndex,
          });
        });
    }
  };
  // --------------------------------------------------
  renderLoadingFunc = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: SCREEN_SIZE.height,
          backgroundColor: '#0000',
        }}
      >
        <ActivityIndicator
          style={{
            alignSelf: 'center',
          }}
          size="small"
          color="#fff"
        />
      </View>
    );
  };
  renderImage = (props) => {
    return <RemoteImage style={props.style} source={props.source} />;
  };
  renderIndicator = (currentIndex, allSize) => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 32,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#0005',
            height: 22,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 11,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppText
            style={{
              color: '#fff',
            }}
          >
            {`${currentIndex}/${allSize}`}
          </AppText>
        </View>
      </View>
    );
  };

  renderItemImageViewer = ({ item, index }) => {
    const { showMenuBar, isLoadingImage } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {/* <ImageZoom imageWidth={SCREEN_WIDTH} imageHeight={SCREEN_HEIGHT}> */}

        <ImageZoom
          onClick={() => {
            this.setState({
              showMenuBar: !showMenuBar,
            });
          }}
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height - 200}
          imageWidth={'100%'}
          imageHeight={'100%'}
        >
          {isLoadingImage ? (
            <View
              style={{
                position: 'absolute',
                top: SCREEN_HEIGHT / 2,
                left: SCREEN_WIDTH / 2,
              }}
            >
              <ActivityIndicator size={'large'} color={Colors.primary5} />
            </View>
          ) : null}
          <Image
            source={item}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              resizeMode: 'contain',
              justifyContent: 'space-between',
            }}
            onLoadEnd={() => {
              this.setState({
                isLoadingImage: false,
              });
            }}
          />
        </ImageZoom>

        {showMenuBar ? (
          <View
            style={{
              height: SH(88),
              backgroundColor: '#0a0a28d9',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: SW(16),
              position: 'absolute',
              top: 0,
              width: SCREEN_WIDTH,
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.props.onBackPress()}>
              <Image
                source={ICON_PATH.back}
                style={{
                  width: SW(18),
                  height: SH(18),
                  resizeMode: 'contain',
                  tintColor: Colors.primary5,
                  marginTop: SH(10),
                }}
              />
            </TouchableWithoutFeedback>
            <View style={{ marginTop: SH(10) }}>
              <AppText
                bold
                style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.primary5 }}
              >
                {index + 1}
                <AppText
                  style={{ fontSize: SH(14), lineHeight: SH(22) }}
                >{` / ${this.props.imageURLs?.length}`}</AppText>
              </AppText>
            </View>
            <TouchableWithoutFeedback onPress={() => this.onSavePress(item)}>
              <Image
                source={ICON_PATH.iconDownload}
                style={{
                  width: SW(24),
                  height: SH(24),
                  resizeMode: 'contain',
                  tintColor: Colors.primary5,
                  marginTop: SH(10),
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        {showMenuBar ? (
          <View
            style={{
              height: SH(88),
              backgroundColor: '#0a0a28d9',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              position: 'absolute',
              bottom: 0,
              width: SCREEN_WIDTH,
              // maxWidth: 20,
            }}
          >
            <View style={{ flexDirection: 'row', maxWidth: SW(180), alignItems: 'center' }}>
              {this.props.imageURLs.map((image, indexImage) => {
                return (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: SW(32),
                      height: SH(32),
                      resizeMode: 'cover',
                      marginLeft: SW(4),
                      opacity: indexImage === index ? 1 : 0.4,
                    }}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    );
  };
  renderImageViewer() {
    const { imageURLs } = this.props;

    const urls = imageURLs.map((item) => {
      return { url: item };
    });
    const { beginIndex } = this.state;

    // const urls = [
    //   {
    //     url:
    //       'https://cdn.24h.com.vn/upload/4-2021/images/2021-11-08/comp-1634981328-740-1636332967-805-width740height389.jpg',
    //   },
    //   {
    //     url:
    //       'https://cdn.24h.com.vn/upload/4-2021/images/2021-11-08/eg-740-1636332992-341-width740height445.jpg',
    //   },
    // ];

    return (
      <FlatList
        horizontal
        data={urls}
        renderItem={this.renderItemImageViewer}
        pagingEnabled={true}
        style={{ flex: 1, width: SCREEN_WIDTH, backgroundColor: Colors.primary4 }}
        initialScrollIndex={typeof this.props.beginIndex === 'number' ? this.props.beginIndex : 0}
      />
    );
  }
  renderBackButton() {
    return (
      <KJButton containerStyle={styles.backButton} onPress={this.onBackPress}>
        <Icon name="close" size={28} color="#FFF" />
      </KJButton>
    );
  }
  renderSaveButton = () => {
    return (
      <KJButton containerStyle={styles.saveButton} onPress={this.onSavePress}>
        <Icon name="vertical-align-bottom" size={28} color="#FFF" />
      </KJButton>
    );
  };
  renderActionSheet() {
    const options = ['Đóng'];
    options.push(Strings.save_image_photo);
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        onPress={this.onActionSheetPress}
      />
    );
  }
  renderDownloadState = (state) => {
    return state === 'none' ? null : (
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0080DC',
            borderRadius: 4,
          }}
        >
          <AppText
            style={{
              color: '#fff',
              padding: 8,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
            {state === 'downloading'
              ? Strings.saving_image // eslint-disable-line
              : state === 'done'
              ? Strings.saving_image_success
              : Strings.saving_image_fail}
          </AppText>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageViewer()}
        {/* {this.renderBackButton()} */}
        {/* {this.renderSaveButton()} */}
        {this.renderActionSheet()}
        {this.renderDownloadState(this.state.downloading)}
      </View>
    );
  }
}

ImagesViewer.defaultProps = {
  beginIndex: 0,
  imageURLs: [],
  onBackPress: () => {},
};

ImagesViewer.propTypes = {
  beginIndex: PropTypes.number,
  imageURLs: PropTypes.arrayOf(String),
  onBackPress: PropTypes.func,
};

export default ImagesViewer;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0005',
  },
  saveButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0005',
  },
  backButtonTitle: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
