import _ from 'lodash';
import { Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { PureComponent } from 'react';

import ImageButton from '../../common/buttons/ImageButton';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
import VideoPlayerContainer from '../../screens/Chat/VideoPlayerContainer';
import { SH, SW } from '../../constants/styles';
// const MOCK_DATA = [
//   {
//     imageSource:
//       'https://blogsimages.adobe.com/adobeillustrator/files/2014/06/Splash-Image-Only_sm.jpg'
//   },
//   {
//     imageSource: 'https://i.ytimg.com/vi/HUdKFM-B_o0/maxresdefault.jpg'
//   },
//   {
//     imageSource:
//       'https://cdn.thedesigninspiration.com/wp-content/uploads/2012/06/Editorial-Illustrations-l.jpg'
//   },
//   {
//     imageSource: 'http://www.hear.fr/wp-content/uploads/2016/11/0722LETTERSotero-590x373.jpeg'
//   }
// ];

export class FeedbackPhotoInput extends PureComponent {
  isVideoUrl = (url) => {
    return url.includes();
  };
  render() {
    const {
      containerStyle,
      pickedImages,
      onRemovePhotoItemPress,
      uploadingImage,
      videoAttach,
    } = this.props;

    const videoAttachObject = { type: 'video', url: videoAttach };
    const listAttackTest = pickedImages.concat(videoAttachObject);

    const listAttachFull = pickedImages.concat(videoAttachObject);
    const _listRender = listAttachFull.filter((item) => item !== undefined);

    return (
      <View
        style={{
          ...containerStyle,
        }}
      >
        <ScrollView
          style={{ marginTop: 10, marginBottom: 16 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            style={{
              marginLeft: 16,
              height: 80,
              maxWidth: 100,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          >
            {uploadingImage ? (
              <View
                style={{
                  height: 80,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator animating={uploadingImage} />
                <AppText style={{ ...TextStyles.normalTitle, color: '#777' }}>
                  {' Đang tải ...'}
                </AppText>
              </View>
            ) : (
              <AppText style={{ ...TextStyles.normalTitle, color: '#777' }}>
                {'Hình ảnh\nđính kèm'}
              </AppText>
            )}
          </View>
          {/* <ImageButton
            imageStyle={{ marginLeft: 16 }}
            imageSource={require('./img/add_photo_btn.png')}
            onPress={onAddPhotoPress}
          /> */}
          {!_.isEmpty(pickedImages) && (
            <View style={{ marginLeft: SW(16), marginRight: SW(16), flexDirection: 'row' }}>
              {_listRender.reverse().map((item, index) => {
                if (!item?.type) {
                  return (
                    <View
                      style={{
                        width: SW(64),
                        height: SH(64),
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: SW(8),
                        // backgroundColor: 'red',
                      }}
                    >
                      <FastImage
                        style={{ width: SW(64), height: SH(64), marginTop: 4 }}
                        source={{ uri: item }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      <ImageButton
                        style={{ position: 'absolute', top: 0, right: -6 }}
                        imageSource={require('./img/ic_red_delete.png')}
                        onPress={() => {
                          onRemovePhotoItemPress(item, index);
                        }}
                      />
                    </View>
                  );
                } else {
                  if (item?.url?.length > 0) {
                    return (
                      <VideoPlayerContainer
                        // uploadingProgress={this.props.uploadingProgress}
                        video={item?.url || ''}
                        isMine={true}
                        videoStyle={{ width: SW(64), height: SH(64) }}
                        // onLongPress={this.onLongPress}
                        // setPlayerRef={ref => {
                        //   this.player = ref;
                        // }}
                        // fullscreenMode={false}
                        // onFullScreenPress={this.onFullScreenPress}
                      />
                    );
                  } else {
                    return null;
                  }
                }
              })}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default FeedbackPhotoInput;
