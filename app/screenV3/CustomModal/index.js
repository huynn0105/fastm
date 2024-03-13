import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppText from '../../componentV3/AppText';
import { SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const CustomModal = ({ children, isVisible }) => {
  const [isShow, setIsShow] = useState(isVisible);
  useEffect(() => {
    setIsShow(isVisible);
  }, [isVisible]);
  if (!isShow) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a28d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContent: {
    backgroundColor: Colors.primary5,
    borderRadius: 24,
    marginHorizontal: SW(24),
  },
});

export default CustomModal;
