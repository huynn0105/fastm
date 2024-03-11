import AnimatedLottieView from 'lottie-react-native';
import React, { PureComponent, useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ICON_PATH } from '../../assets/path';

class ImageButton extends PureComponent {
  onPress = () => {
    if (this.props.onPress) {
      requestAnimationFrame(() => {
        this.props.onPress();
      });
    }
  };
  onPressIn = () => {
    if (this.props.onPressIn) {
      requestAnimationFrame(() => {
        this.props.onPressIn();
      });
    }
  };

  render() {
    const { style, imageSource, imageStyle, imageResizeMode, isLottieAsset } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        activeOpacity={0.2}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
      >
        {isLottieAsset ? (
          <AnimatedLottieView
            source={ICON_PATH.mascotChatBotHeadJson}
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}
            autoPlay={true}
            loop={false}
            speed={1}
          />
        ) : (
          <Image
            style={[styles.image, imageStyle]}
            source={imageSource}
            resizeMode={imageResizeMode}
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default ImageButton;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f000',
  },
  image: {
    alignSelf: 'center',
    backgroundColor: '#ff00',
  },
});
