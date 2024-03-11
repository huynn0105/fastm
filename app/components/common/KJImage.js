/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
  An Image that support background color, border color
  A View will be used to wrap a round the image and has the same style of image
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import FastImage from 'react-native-fast-image';

const _ = require('lodash');

class KJImage extends Component {

  shouldComponentUpdate(nextProps) {
    return !(_.isEqual(this.props, nextProps));
  }

  render() {
    const props = this.props;
    const flatStyle = StyleSheet.flatten(props.style);
    const imageBorderWidth = flatStyle.borderWidth || 0;
    const imageWidth = flatStyle.width - (imageBorderWidth * 2);
    const imageHeight = flatStyle.height - (imageBorderWidth * 2);
    const imageSource = props.source;
    const imageDefaultSource = props.defaultSource || props.source;
    return (
      <View
        style={{
          flex: flatStyle.flex,
          position: flatStyle.position,
          top: flatStyle.top,
          bottom: flatStyle.bottom,
          left: flatStyle.left,
          right: flatStyle.right,
          width: flatStyle.width,
          height: flatStyle.height,
          backgroundColor: flatStyle.backgroundColor,
          borderRadius: flatStyle.borderRadius,
          // paddingTop: flatStyle.paddingTop - 0,
          // paddingBottom: flatStyle.paddingBottom + 0,
          // paddingLeft: flatStyle.paddingLeft - 0,
          // paddingRight: flatStyle.paddingRight + 0,
          marginTop: flatStyle.marginTop,
          marginBottom: flatStyle.marginBottom,
          marginLeft: flatStyle.marginLeft,
          marginRight: flatStyle.marginRight,
          borderColor: flatStyle.borderColor,
          borderWidth: flatStyle.borderWidth,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FastImage
          {...props}
          style={[props.style, {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            backgroundColor: '#0000',
            alignSelf: 'center',
            borderColor: '#0000',
            borderWidth: 0,
          },
          imageWidth ? { width: imageWidth } : {},
          imageHeight ? { height: imageHeight } : {},
          ]}
          activityIndicatorProps={{
            style: { opacity: 0 },
          }}
          source={imageSource}
        // defaultSource={imageDefaultSource}
        />
      </View>
    );
  }
}

KJImage.defaultProps = {
  style: {},
};

export default KJImage;
