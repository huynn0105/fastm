import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { PureComponent } from 'react';

import { SCREEN_WIDTH } from '../../utils/Utils';

export class ListImageMessage extends PureComponent {
  render() {
    const { alignItems, listImage } = this.props;
    const alignment = alignItems === 'left' ? 'flex-start' : 'flex-end';
    return (
      <View style={[styles.containerStyle, { alignItems: alignment }]}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: alignment,
            maxWidth: SCREEN_WIDTH / 1.42,
          }}
        >
          {listImage.map((item) => {
            return (
              <FastImage
                style={{
                  width: SCREEN_WIDTH / 3.2,
                  height: SCREEN_WIDTH / 2.34,
                  margin: 4,
                }}
                source={{ uri: item }}
                resizeMode="stretch"
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export default ListImageMessage;
