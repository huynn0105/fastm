import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import iphone12Helper from '../../utils/iphone12Helper';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

export const renderNavigation = ({ onBackPress, title }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: iphone12Helper() ? 12 : 0,
        backgroundColor: Colors.actionBackground,
      }}
    >
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          left: 2,
          width: 44,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onBackPress}
      >
        <Image
          style={{ height: 24, width: 24 }}
          source={require('./img/arrow_left.png')}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      <AppText
        style={{
          fontSize: 17,
          textAlign: 'center',
          color: '#24253d',
        }}
      >
        {title}
      </AppText>
    </View>
  );
};
