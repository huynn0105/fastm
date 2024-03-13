import { View } from 'react-native';
import React from 'react';
import Colors from '../../theme/Color';

const DashedHorizontal = (props) => {
  const { width = '100%', height = 1, size = 1, color = Colors.neutral3, style } = props;
  return (
    <View
      style={[
        {
          width,
          height,
          overflow: 'hidden',
          bottom: 0,
          position: 'absolute',
        },
        style,
      ]}
    >
      <View
        style={{
          height: height * 2,
          borderWidth: size,
          width,
          borderStyle: 'dashed',
          borderColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export default DashedHorizontal;
