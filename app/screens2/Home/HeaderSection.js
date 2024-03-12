import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const HeaderSection = ({ title, onAllPress, style }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...style,
    }}
  >
    <AppText
      style={{
        fontSize: 14,
        fontWeight: '500',
        color: '#7F7F7F',
      }}
    >
      {title}
    </AppText>
    {onAllPress ? (
      <TouchableOpacity activeOpacity={0.2} onPress={onAllPress}>
        <AppText
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: colors.primary2,
            margin: 8,
            marginLeft: 16,
            marginRight: 0,
          }}
        >
          {'Tất cả'}
        </AppText>
      </TouchableOpacity>
    ) : null}
  </View>
);

export default HeaderSection;
