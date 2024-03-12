import { View } from 'react-native';
import React from 'react';
import Colors from '../../theme/Color';

const DashedVertical = (props) => {
  const { width = 1, height = '100%', size = 1, color = Colors.neutral3, style } = props;
  return (
    <View style={[{ width, height, overflow: 'hidden', bottom: 0, position: 'absolute' }, style]}>
      <View
        style={{
          height: height,
          borderWidth: size,
          width: width * 2,
          borderStyle: 'dashed',
          borderColor: color,
        }}
      />
    </View>
  );
};

export default DashedVertical;
