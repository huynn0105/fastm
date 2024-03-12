import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const Introduction = ({ cameraType }) => {
  const renderItem = (icon, text) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Image source={icon} style={styles.iconStyle} />
        <View style={styles.marginSmall}>
          <AppText style={styles.textStyle}>{text}</AppText>
        </View>
      </View>
    );
  };
  const renderView = useCallback(() => {
    switch (cameraType) {
      case 'FRONT': {
        return (
          <View style={styles.container}>
            <View style={{ maxWidth: SW(92), paddingVertical: 7 }}>
              {renderItem(ICON_PATH.cmndFront1, 'Hiển thị đầy đủ 4 góc')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.cmndFront2, 'Hình chụp phải\n rõ nét')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.cmndFront3, 'Không để lóa bởi ánh đèn')}
            </View>
          </View>
        );
      }
      case 'BACK': {
        return (
          <View style={styles.container}>
            <View style={{ maxWidth: SW(92), paddingVertical: 7 }}>
              {renderItem(ICON_PATH.cmndBack1, 'Hiển thị đầy đủ 4 góc')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.cmndBack2, 'Hình chụp phải\n rõ nét')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.cmndBack3, 'Không để lóa bởi ánh đèn')}
            </View>
          </View>
        );
      }
      default: {
        return (
          <View style={styles.container}>
            <View style={{ maxWidth: SW(92), paddingVertical: 7 }}>
              {renderItem(ICON_PATH.selfie1, 'Hiển thị đầy đủ chân dung')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.selfie2, 'Video phải\n rõ nét')}
            </View>
            <View style={{ maxWidth: SW(92) }}>
              {renderItem(ICON_PATH.selfie3, 'Không để lóa bởi ánh đèn')}
            </View>
          </View>
        );
      }
    }
  }, [cameraType]);
  return <View>{renderView()}</View>;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary5,
    // width: '100%',
    width: SW(343),
    paddingHorizontal: SW(16),
    borderRadius: 8,
    // flex: 1,
  },
  iconStyle: {
    width: SW(53),
    height: SH(47),
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
    textAlign: 'center',
  },
  marginSmall: {
    marginTop: SH(10),
  },
});

export default Introduction;
