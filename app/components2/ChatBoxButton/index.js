import React from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';

import ImageButton from '../ImageButton/index';
import Badge from '../Badge/index';
import { ICON_PATH } from '../../assets/path';
import { SH } from '../../constants/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AnimatedLottieView from 'lottie-react-native';

const ChatBoxButton = ({
  size = 34,
  unread = 0,
  type,
  style,
  imageStyle,
  onPress,
  icon = ICON_PATH.bellWhite,
  isLottieAsset = false,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={{
          ...style,
          borderRadius: SH(36) / 2,
        }}
      >
        <ImageButton
          isLottieAsset={isLottieAsset}
          onPress={onPress}
          style={{
            flex: 1,
          }}
          imageSource={icon}
          imageStyle={{
            width: SH(24),
            height: SH(24),
            borderRadius: SH(24) / 2,
            ...imageStyle,
          }}
          imageResizeMode={'contain'}
        />
        {unread > 0 ? <Badge text={`${unread > 99 ? '99+' : unread}`} /> : null}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

ChatBoxButton.propTypes = {
  size: PropTypes.number,
  type: PropTypes.string,
  unread: PropTypes.number,
  navigation: PropTypes.object,
};

ChatBoxButton.defaultProps = {
  size: 34,
  unread: 0,
};

export default ChatBoxButton;
