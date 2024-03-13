import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Colors from '../../theme/Color';

export const LINE_COLOR_STATUS = {
  NORMAL: Colors.primary1,
  ERROR: Colors.accent3
};

const AnimatedLine = ({ focusing, style, lineColor = LINE_COLOR_STATUS.NORMAL }) => (
  <View style={{ ...style, overflow: 'hidden' }}>
    <Animatable.View
      style={{
        backgroundColor: lineColor,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
      }}
      duration={450}
      animation={focusing ? 'fadeInLeftBig' : 'fadeOutLeftBig'}
      useNativeDriver
    />
  </View>
);

export default AnimatedLine;
