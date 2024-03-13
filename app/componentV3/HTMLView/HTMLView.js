import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import HTML from 'react-native-render-html';
import { fonts } from '../../constants/configs';
import AppText from '../AppText';

const HTMLView = memo((props) => {
  const renderers = useMemo(
    () => ({
      span: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {
        return (
          <AppText
            numberOfLines={_?.numberoflines ? Number(_?.numberoflines) : null}
            allowFontScaling={allowFontScaling}
            style={convertedCSSStyles}
            key={key}
          >
            {children}
          </AppText>
        );
      },
      rowview: (_, children, convertedCSSStyles, { allowFontScaling, key }) => {
        return (
          <View key={key} style={[{ flexDirection: 'row' }].concat(convertedCSSStyles)}>
            {children}
          </View>
        );
      },
    }),
    [],
  );

  const onLinkPress = useCallback((_, link) => {
    Linking.openURL(link);
  }, []);

  return (
    <HTML
      baseFontStyle={styles.text}
      onLinkPress={onLinkPress}
      containerStyle={[Platform.OS === 'ios' ? {} : styles.container].concat(props?.style)}
      renderers={renderers}
      {...props}
    />
  );
});

export default HTMLView;

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  container: { marginTop: -8, marginBottom: -8 },
});
