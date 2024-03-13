import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { Image } from 'react-native';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const FloatingButton = memo((props) => {
  const { icon, title, onPress, style } = props;

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <ImageBackground
        source={IMAGE_PATH.backgroundButtonTicket}
        style={styles.imageBackground}
        resizeMode={'stretch'}
      >
        <AppText medium style={styles.title}>
          {title}
        </AppText>
      </ImageBackground>
      <Image style={styles.icon} source={icon} resizeMode={'stretch'} />
    </TouchableOpacity>
  );
});

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: SW(16),
    bottom: SH(38),
    height: SH(52),
  },
  imageBackground: { marginRight: SW(6) },
  title: {
    fontSize: SH(14),
    lineHeight: SH(16),
    color: Colors.primary5,
    paddingLeft: SW(12),
    paddingRight: SW(16),
    paddingVertical: SH(8),
  },
  icon: { width: SW(52), height: SH(52) },
});
