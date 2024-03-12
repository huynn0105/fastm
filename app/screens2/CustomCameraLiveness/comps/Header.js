import React from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import HTML from 'react-native-render-html';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const Header = ({ title, detail, cameraTitleHtml, cameraDetailHtml, onCancelPress }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.1, paddingTop: SH(4) }}>
        <TouchableWithoutFeedback onPress={onCancelPress}>
          <Image source={ICON_PATH.back} style={styles.backButtonIcon} />
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 0.8 }}>
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
      <View style={{ flex: 0.1, opacity: 0 }}>
        <TouchableWithoutFeedback>
          <Image source={ICON_PATH.back} style={{}} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    paddingTop: SH(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SW(16),
  },
  txtTitle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    textAlign: 'center',
    color: Colors.primary5,
    marginBottom: 8,
  },
  txtDesc: {
    fontSize: SH(13),
    lineHeight: SH(16),
    textAlign: 'center',
    color: Colors.primary5,
    opacity: 0.6,
  },
  backButtonIcon: {
    tintColor: Colors.primary5,
    width: SW(22),
    height: SH(22),
    resizeMode: 'contain',
  },
});
