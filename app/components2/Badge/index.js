import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';

const Badge = ({ text, style }) => (
  <View
    style={{
      position: 'absolute',
      width: SW(16),
      height: SW(16),
      borderRadius: SW(8),
      backgroundColor: colors.gradient3a,
      justifyContent: 'center',
      alignItems: 'center',
      right: SW(-4),
      top: SH(-3),
    }}
  >
    <AppText
      style={{
        color: '#fff',

        fontSize: SH(11),
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {text}
    </AppText>
  </View>
);

export default Badge;
