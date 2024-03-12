import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';

const ItemTag = memo((props) => {
  const { title, backgroundColor, color, height = 18 } = props;

  return (
    <View
      style={{
        height: height,
        backgroundColor: backgroundColor,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        paddingTop: 1.5,
        marginRight: 8,
      }}
    >
      <View
        style={[
          {
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderBottomWidth: height,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: backgroundColor,
          },
          { top: 0, left: -5, position: 'absolute' },
        ]}
      />
      <View
        style={[
          {
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderBottomWidth: height,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: backgroundColor,
            transform: [{ rotate: '180deg' }],
          },
          { top: 0, right: -5, position: 'absolute' },
        ]}
      />
      <AppText italic style={{ fontSize: 12, lineHeight: 16, color }}>
        {title}
      </AppText>
    </View>
  );
});

export default ItemTag;
