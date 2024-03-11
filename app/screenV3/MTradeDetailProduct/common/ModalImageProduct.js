import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ModalImageProduct = memo(
  forwardRef((props, ref) => {
    const { images } = props;

    const insets = useSafeAreaInsets();

    const [isVisible, setIsVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const open = useCallback((_index = 0) => {
      setIndex(_index);
      setIsVisible(true);
    }, []);
    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <Modal isVisible={isVisible} style={styles.container}>
        <ImageViewer show imageUrls={images} index={index} />
        <TouchableOpacity
          onPress={close}
          style={{
            width: 32,
            height: 32,
            borderRadius: 32 / 2,
            backgroundColor: Colors.primary5,
            position: 'absolute',
            top: insets.top + 10,
            right: insets.right + 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={ICON_PATH.close1} style={{ width: 16, height: 16 }} />
        </TouchableOpacity>
      </Modal>
    );
  }),
);

export default ModalImageProduct;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },
});
