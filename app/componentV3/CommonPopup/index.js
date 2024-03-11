import React from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';

const CommonPopup = ({ isVisible, children }) => {
  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      animationIn="zoomIn"
      animationOut="zoomOut"
      // style={{ borderRadius: 16, overflow: 'hidden' }}
    >
      {children}
    </Modal>
  );
};

export default CommonPopup;
