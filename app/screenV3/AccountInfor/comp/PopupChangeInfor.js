import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';

const PopupChangeInfor = ({
  phoneNumber,
  CMND,
  pressUpdatePhoneNumber = () => {},
  pressUpdateId = () => {},
}) => {
  const prettyPhoneNumber = (phoneNumber) => {
    return phoneNumber.slice(0, 4) + '.' + phoneNumber.slice(4, 7) + '.' + phoneNumber.slice(7);
  };
  return (
    <View style={styles.container}>
      <AppText style={[styles.smallTextStyle, { color: Colors.gray2 }]}>
        Chọn 1 trong 2 thông tin muốn thay đổi dưới đây:
      </AppText>
      <TouchableOpacity style={styles.rowView} onPress={pressUpdatePhoneNumber}>
        <View style={styles.smallRowView}>
          <Image source={ICON_PATH.iconPhone} style={styles.iconStyle} />
          <View style={{ marginLeft: SW(12) }}>
            <AppText style={[styles.textStyle, { color: Colors.secondGreen }]}>
              Số điện thoại đăng nhập
            </AppText>
            <AppText style={[styles.smallTextStyle, { color: Colors.gray1 }]}>
              {prettyPhoneNumber(phoneNumber)}
            </AppText>
          </View>
        </View>
        <View>
          <Image
            source={ICON_PATH.next2}
            style={[styles.smallIconStyle, { tintColor: Colors.secondGreen }]}
          />
        </View>
      </TouchableOpacity>
      <View style={{ height: 0.5, backgroundColor: Colors.neutral3 }} />
      <TouchableOpacity style={styles.rowView} onPress={pressUpdateId}>
        <View style={styles.smallRowView}>
          <Image source={ICON_PATH.iconCmnd} style={styles.iconStyle} />
          <View style={{ marginLeft: SW(12) }}>
            <AppText style={[styles.textStyle, { color: Colors.primary2 }]}>
              CMND/CCCD đã định danh
            </AppText>
            <AppText style={[styles.smallTextStyle, { color: Colors.gray1 }]}>{CMND}</AppText>
          </View>
        </View>
        <View>
          <Image
            source={ICON_PATH.next2}
            style={[styles.smallIconStyle, { tintColor: Colors.primary2 }]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SH(16),
    paddingHorizontal: SW(16),
    paddingBottom: SH(40),
  },
  smallTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
  },
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(20),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SH(16),
    justifyContent: 'space-between',
  },
  iconStyle: {
    width: SW(40),
    height: SH(40),
    resizeMode: 'contain',
  },
  smallIconStyle: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
  },
  smallRowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PopupChangeInfor;
