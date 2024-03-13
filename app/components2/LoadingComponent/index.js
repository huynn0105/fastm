import React, { PureComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import LoadingDots from '../../componentV3/LoadingDot';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import LottieView from 'lottie-react-native';

export class Loading extends PureComponent {
  render() {
    const { containerStyle, visible, hideLogo } = this.props;
    return visible ? (
      <Animatable.View
        style={[styles.container, containerStyle]}
        animation={'fadeIn'}
        duration={300}
      >
        <View
          style={{
            justifyContent: 'center',
            opacity: 1,
            marginLeft: SW(32),
          }}
        >
          {!hideLogo && (
            <LottieView
              style={{ width: SW(64), height: SH(64) }}
              source={ICON_PATH.loadingLottie}
              autoPlay
              loop
            />
          )}
          <View style={{ marginTop: SH(17) }}>
            <LoadingDots />
          </View>
        </View>
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalBackground,
    zIndex: 1000,
  },
});

export default Loading;
