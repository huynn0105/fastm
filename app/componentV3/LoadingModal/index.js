import LottieView from 'lottie-react-native';
import React from 'react';
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

const Loading = ({ containerStyle, visible, hideLogo, animation }) => {
  return (
    <Modal
      animated
      // supportedOrientations={['landscape', 'portrait']}
      transparent
      visible={visible}
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
    </Modal>
  );
};

export default Loading;
