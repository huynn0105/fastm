import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SH, SW } from '../../constants/styles';
import ViewPlayContainer from '../../screens/Chat/VideoPlayerContainer';
import { SCREEN_WIDTH } from '../../utils/Utils';

export class ListImageMessage extends PureComponent {
  render() {
    const { alignItems, listImage, onImagePress, style } = this.props;
    const alignment = alignItems === 'left' ? 'flex-start' : 'flex-end';
    if (listImage?.length === 0) {
      return;
    }

    const listImageToView = listImage?.filter((item) => !item.includes('video'));
    return (
      <View style={[styles.containerStyle, { alignItems: alignment }, style]}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: alignment,
            maxWidth: SW(285),
          }}
        >
          {listImage?.map((item, index) => {
            if (item.includes('video') || item.includes('mov') || item.includes('mp4')) {
              return (
                <ViewPlayContainer
                  // uploadingProgress={this.props.uploadingProgress}
                  video={item}
                  isMine={true}
                  // onLongPress={this.onLongPress}
                  // setPlayerRef={ref => {
                  //   this.player = ref;
                  // }}
                  // fullscreenMode={false}
                  // onFullScreenPress={this.onFullScreenPress}
                />
              );
            } else {
              return (
                <TouchableOpacity onPress={() => onImagePress(listImageToView, index)}>
                  <FastImage
                    style={{
                      width: SCREEN_WIDTH / 6,
                      height: SH(65),
                      margin: 4,
                      borderRadius: 8,
                    }}
                    source={{ uri: item }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export default ListImageMessage;
