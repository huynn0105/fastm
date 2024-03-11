import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTML from 'react-native-render-html';
import AppText from '../../../componentV3/AppText';

const Header = ({ title, detail, cameraTitleHtml, cameraDetailHtml }) => (
  <View style={styles.container}>
    {cameraTitleHtml ? (
      <HTML
        html={cameraTitleHtml}
        onLinkPress={() => {}}
        tagsStyles={{ a: { textDecorationLine: 'none' } }}
      />
    ) : (
      <AppText style={styles.txtTitle}>{title}</AppText>
    )}
    {cameraDetailHtml ? (
      <HTML
        html={cameraDetailHtml}
        onLinkPress={() => {}}
        tagsStyles={{ a: { textDecorationLine: 'none' } }}
      />
    ) : (
      <AppText style={styles.txtDesc}>{detail}</AppText>
    )}
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
  },
  txtTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 8,
  },
  txtDesc: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#ffffff',
  },
});
