import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const MomoItem = ({ phoneNumber, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.containerIconStyle}>
      <Image source={ICON_PATH.add_momo} style={styles.iconStyle} />
    </View>
    <View style={{ marginLeft: SW(12) }}>
      <AppText medium style={[styles.textStyle]}>
        Ví điện tử MoMo
      </AppText>
      <View style={{ marginTop: SH(3) }}>
        <AppText style={styles.smallTextStyle}>
          Số tài khoản:{' '}
          <AppText semiBold style={styles.mediumTextStyle}>
            {phoneNumber}
          </AppText>
        </AppText>
      </View>
    </View>
    <View style={styles.detailContainerStyle}>
      <AppText style={[styles.smallTextStyle, { color: Colors.primary2 }]}>{`Chi tiết >`}</AppText>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: SW(12),
    minHeight: SH(48),
  },
  iconStyle: {
    width: SW(30),
    height: SH(30),
    resizeMode: 'contain',
  },
  containerIconStyle: {
    width: SW(44),
    height: SW(44),
    backgroundColor: Colors.actionBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SW(22),
  },
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  smallTextStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
  mediumTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: '#24253d',
  },
  detailContainerStyle: {
    position: 'absolute',
    right: SW(12),
    top: SH(12),
  },
});

export default MomoItem;
