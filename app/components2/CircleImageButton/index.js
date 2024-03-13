import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import _ from 'lodash';

export class CircleImageButton extends PureComponent {
  render() {
    const {
      imageSize,
      imageSource,
      imageResizeMode,
      imageStyle,
      borderColor,
      borderWidth,
      label,
      textStyle,
      onPress,
    } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.2} onPress={onPress}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 27,
          }}
        >
          <View
            style={{
              // width: imageSize + 2,
              // height: imageSize + 2,
              borderRadius: (imageSize + 2) / 2,
              borderWidth,
              borderColor,
            }}
          >
            <Image
              style={{ width: imageSize, height: imageSize, ...imageStyle }}
              source={imageSource}
              resizeMode={imageResizeMode || 'stretch'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default CircleImageButton;
