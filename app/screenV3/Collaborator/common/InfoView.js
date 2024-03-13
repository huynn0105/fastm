import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';

const InfoView = memo((props) => {
  const {
    direction = 'column',
    backgroundColor = Colors.highLightColor,
    title,
    titleColor = 'rgba(255,255,255,0.7)',
    content,
    contentColor = Colors.primary5,
    arrowColor = Colors.primary5,
    style,
    keyContent,
    onPress,
    isBetweenContent = true,
    hideArrow,
  } = props;

  const handleOnPress = useCallback(() => {
    onPress?.(keyContent);
  }, [keyContent, onPress]);

  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            flexDirection: direction,
            paddingVertical: direction === 'column' ? 8 : 12,
            justifyContent: 'space-between',
          },
          style,
        ]}
      >
        <AppText style={[styles.title, { color: titleColor }]}>{title}</AppText>
        <View
          style={[
            styles.contentContainer,
            {
              justifyContent:
                direction === 'column' && isBetweenContent ? 'space-between' : 'flex-start',
            },
            direction === 'column' && { marginTop: 4 },
          ]}
        >
          <AppText
            semiBold
            style={[
              styles.content,
              { color: contentColor },
              direction === 'row' && { lineHeight: 20 },
            ]}
          >
            {content}
          </AppText>
          {hideArrow ? null : (
            <Image
              source={ICON_PATH.arrow_right}
              style={[styles.arrow, { tintColor: arrowColor }]}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default InfoView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flex: 1,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.7)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    fontSize: 18,
    color: Colors.primary5,
    lineHeight: 24,
  },
  arrow: {
    tintColor: Colors.primary5,
    width: 16,
    height: 16,
    marginLeft: 8,
    resizeMode: 'contain',
  },
});
