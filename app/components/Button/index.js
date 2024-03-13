import { Text, TouchableOpacity, Image, View } from 'react-native';
import React from 'react';

import AppText from '../../componentV3/AppText';

const Button = ({ title, textStyle, image, style, onPress }) => (
  <TouchableOpacity
    style={style}
    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {image ? (
        <Image
          style={{ width: 22, height: 22, marginRight: 6, resizeMode: 'contain' }}
          source={image}
        />
      ) : null}
      <AppText
        style={[
          {
            fontSize: 14,
            color: '#009fdb',
            flexShrink: 1,
            marginTop: 2,
          },
          textStyle,
        ]}
      >
        {title}
      </AppText>
    </View>
  </TouchableOpacity>
);

export default Button;
