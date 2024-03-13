import LottieView from 'lottie-react-native';
import React, { memo } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import LoadingDots from '../LoadingDot';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modalBackground,
  },
  modalContainer: {
    justifyContent: 'center',
    // alignItems: 'center',

    marginLeft: SW(32),
    opacity: 1,
  },
});

const FakeModalLoading = memo(({ containerStyle, visible, hideLogo, animation }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={[styles.container, containerStyle]}>
        <View style={styles.modalContainer}>
          {visible && !hideLogo ? (
            <LottieView
              style={{ width: SW(64), height: SH(64) }}
              source={ICON_PATH.loadingLottie}
              autoPlay
              loop
            />
          ) : null}
          {visible ? (
            <View style={{ marginTop: SH(17) }}>
              <LoadingDots />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
});

export default FakeModalLoading;
