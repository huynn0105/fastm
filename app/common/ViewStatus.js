import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import { ICON_PATH } from '../assets/path';
import Colors from '../theme/Color';
import AppText from '../componentV3/AppText';
import AnimatedLottieView from 'lottie-react-native';

export const STATUS_ENUM = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  WARNING2: 'WARNING2',
};

const ViewStatus = memo((props) => {
  const { status, title, content, style } = props;

  const renderImage = useMemo(() => {
    switch (status) {
      case STATUS_ENUM.SUCCESS: {
        return (
          <Image
            source={ICON_PATH.statusSuccess}
            style={styles.imageStyle}
            resizeMode={'contain'}
          />
        );
      }
      case STATUS_ENUM.WARNING: {
        return (
          <Image source={ICON_PATH.warning2} style={styles.imageStyle} resizeMode={'contain'} />
        );
      }
      case STATUS_ENUM.WARNING2: {
        return (
          <Image source={ICON_PATH.iconBell2} style={styles.imageStyle} resizeMode={'contain'} />
        );
      }
      case STATUS_ENUM.LOADING: {
        return (
          <AnimatedLottieView
            style={styles.imageStyle}
            source={ICON_PATH.loadingLottie}
            autoPlay
            loop
          />
        );
      }
      default: {
        return (
          <Image source={ICON_PATH.statusError} style={styles.imageStyle} resizeMode={'contain'} />
        );
      }
    }
  }, [status]);

  const titleColor = useMemo(() => {
    switch (status) {
      case STATUS_ENUM.SUCCESS: {
        return Colors.success;
      }
      case STATUS_ENUM.WARNING: {
        return Colors.fiveOrange;
      }
      case STATUS_ENUM.WARNING2: {
        return Colors.highLightColor;
      }
      case STATUS_ENUM.LOADING: {
        return Colors.gray5;
      }
      default: {
        return Colors.sixRed;
      }
    }
  }, [status]);

  return (
    <View style={[styles.container].concat(style)}>
      {renderImage}
      {title ? (
        <AppText semiBold style={[styles.title, { color: titleColor }]}>
          {title}
        </AppText>
      ) : null}
      {content ? <AppText style={styles.content}>{content}</AppText> : null}
    </View>
  );
});

export default ViewStatus;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  content: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.gray5,
  },
});
