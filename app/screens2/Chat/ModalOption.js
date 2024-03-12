import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const ModalOption = ({ listOptions, onClose }) => {
  const renderItem = (icon, title, onPress, index) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.actionBackground,
          padding: SW(16),
          borderBottomColor: Colors.gray4,
          borderBottomWidth: index !== listOptions.length - 1 ? 1 : 0,
        }}
        onPress={onPress}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icon} style={styles.bigIconStyle} />
          <View style={{ paddingLeft: SW(20) }}>
            <AppText style={styles.textStyle}>{title}</AppText>
          </View>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Image source={ICON_PATH.arrow_right} style={styles.iconStyle} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ paddingBottom: SH(20) }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: SH(15),
          paddingBottom: SH(10),
          paddingHorizontal: SW(16),
        }}
      >
        <Image source={ICON_PATH.close1} style={[styles.iconStyle, { opacity: 0 }]} />
        <AppText
          style={[
            styles.textStyle,
            {
              opacity: 0.7,
            },
          ]}
        >
          Khởi tạo
        </AppText>
        <TouchableOpacity onPress={onClose}>
          <Image source={ICON_PATH.close1} style={[styles.iconStyle]} />
        </TouchableOpacity>
      </View>
      <View>
        {listOptions.map((option, index) => {
          return renderItem(option.icon, option.title, option.onPress, index);
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: SW(18),
    height: SH(18),
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  bigIconStyle: {
    width: SW(40),
    height: SH(40),
    resizeMode: 'contain',
  },
});

export default ModalOption;
