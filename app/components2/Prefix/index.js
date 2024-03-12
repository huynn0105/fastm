import { View, Text } from 'react-native';
import React from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const PrefixText = ({ text, style }) => {
  if (!text) return null;

  return (
    <View
      style={[
        {
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.primary1,
          paddingLeft: 6,
          paddingRight: 6,
          borderRadius: 8,
          marginRight: 6,
        },
        style,
      ]}
    >
      <AppText style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>{text}</AppText>
    </View>
  );
};

export default PrefixText;
