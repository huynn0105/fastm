import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SCREEN_SIZE, TOP_PADDING } from '../CustomCamera.contants';

const CameraMark = ({ cameraHeight, cameraWidth, maskColor = '#000' }) => {
  const topHeight = (SCREEN_SIZE.height - cameraHeight) / 2 - TOP_PADDING;
  const bottomHeight = (SCREEN_SIZE.height - cameraHeight) / 2 + TOP_PADDING;
  const leftWidth = (SCREEN_SIZE.width - cameraWidth) / 2;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          height: topHeight,
          width: SCREEN_SIZE.width,
          backgroundColor: maskColor,
        }}
      />
      <View
        style={{
          height: cameraHeight,
          width: SCREEN_SIZE.width,
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            height: cameraHeight,
            width: leftWidth,
            backgroundColor: maskColor,
          }}
        />
        <View
          style={{
            height: cameraHeight,
            width: cameraWidth,
            backgroundColor: '#0000',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: -2,
              bottom: -2,
              left: -2,
              right: -2,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: maskColor,
            }}
          />
        </View>
        <View
          style={{
            height: cameraHeight,
            width: leftWidth,
            backgroundColor: maskColor,
          }}
        />
      </View>
      <View
        style={{
          height: bottomHeight,
          width: SCREEN_SIZE.width,
          backgroundColor: maskColor,
        }}
      />
    </View>
  );
};

export default CameraMark;

const styles = StyleSheet.create({});
