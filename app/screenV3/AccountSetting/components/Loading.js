import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useMemo } from 'react';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import AnimatedLottieView from 'lottie-react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';

const Loading = memo((props) => {
  const { insetBottom, type = 'LOADING', title, content } = props;

  const containerStyle = useMemo(
    () => [styles.container, { paddingBottom: insetBottom + SH(100) }],
    [insetBottom],
  );

  const imageSource = useMemo(
    () => ({
      LOADING: ICON_PATH.loadingLottie,
      SUCCESS: ICON_PATH.statusSuccess,
      ERROR: ICON_PATH.statusError,
    }),
    [],
  );

  const renderImage = useMemo(
    () => ({
      LOADING: (
        <AnimatedLottieView source={imageSource?.[type]} style={styles.image} loop autoPlay />
      ),
      SUCCESS: <Image source={imageSource?.[type]} style={styles.image} />,
      ERROR: <Image source={imageSource?.[type]} style={styles.image} />,
    }),
    [imageSource, type],
  );

  const titleColor = useMemo(
    () => ({
      LOADING: Colors.gray5,
      SUCCESS: Colors.success,
      ERROR: Colors.sixRed,
    }),
    [],
  );

  const renderTitle = useMemo(
    () => (
      <AppText semiBold style={[styles.title, { color: titleColor[type] }]}>
        {title}
      </AppText>
    ),
    [title, titleColor, type],
  );

  const renderContent = useMemo(
    () => <AppText style={styles.content}>{content}</AppText>,
    [content],
  );

  return (
    <View style={containerStyle}>
      {renderImage?.[type]}
      {title ? renderTitle : null}
      {content ? renderContent : null}
    </View>
  );
});

export default Loading;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 14,
    lineHeight: 24,
    marginTop: 16,
    textAlign: 'center',
  },
  content: { fontSize: 13, lineHeight: 18, color: Colors.gray5, marginTop: 4, textAlign: 'center' },
});
