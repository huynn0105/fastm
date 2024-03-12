import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const BoxIdentifyV2 = ({
  fullName = '',
  dob = '',
  gender = '',
  countryId = '',
  countryIdDate = '',
  requestSupport = () => {},
  onSetGender = () => {},
  hideEdit,
  countryOldId,
}) => {
  const getNameGender = (value) => {
    switch (value) {
      case 'Male':
      case 'male':
      case 'Nam':
      case 'nam':
        return 'Nam';
      case 'Female':
      case 'female':
      case 'Nữ':
      case 'nữ':
        return 'Nữ';
    }
  };

  return (
    <View style={styles.containerBox}>
      <View style={styles.rowView}>
        <AppText style={styles.textStyle}>Thông tin định danh</AppText>
        {hideEdit ? (
          <View />
        ) : (
          <TouchableOpacity style={styles.rowView} onPress={requestSupport}>
            <AppText style={styles.subTitleTextStyle}>Chỉnh sửa</AppText>
            <Image source={ICON_PATH.edit1} style={[styles.iconStyle, { marginLeft: SW(7) }]} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.containerBoxIdentify}>
        <View style={styles.rowViewStart}>
          <View style={{ flex: 0.3 }}>
            <AppText style={styles.fieldTitleText}>Họ và tên:</AppText>
          </View>
          <View style={styles.marginTitleView}>
            <AppText style={styles.titleText}>{fullName.toUpperCase()}</AppText>
          </View>
        </View>
        <View style={[styles.rowViewStart, { marginTop: SH(10) }]}>
          <View style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 0.625 }}>
              <AppText style={styles.fieldTitleText}>Ngày sinh:</AppText>
            </View>
            <View style={styles.marginTitleView}>
              <AppText style={styles.titleText}>{dob}</AppText>
            </View>
          </View>
          {gender?.length && gender !== 'other' ? (
            <View
              style={{
                flexDirection: 'row',
                flex: 0.4,
                alignItems: 'center',
                //   backgroundColor: 'red',
              }}
            >
              <AppText style={[styles.fieldTitleText, { flex: 0.8 }]}>Giới tính:</AppText>
              <View style={styles.marginTitleView}>
                <AppText style={[styles.titleText, { lineHeight: SH(18) }]}>
                  {getNameGender(gender)}
                </AppText>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                flex: 0.4,
                alignItems: 'center',
                //   backgroundColor: 'red',
              }}
            ></View>
          )}
        </View>
        <View style={[styles.rowViewStart, { marginTop: SH(10) }]}>
          <View style={{ flex: 0.3 }}>
            <AppText style={styles.fieldTitleText}>Số CCCD:</AppText>
          </View>

          <View style={styles.marginTitleView}>
            <AppText semiBold style={styles.titleText}>
              {countryId}
            </AppText>
          </View>
        </View>
        <View style={[styles.rowViewStart, { marginTop: SH(10) }]}>
          <View style={{ flex: 0.3 }}>
            <AppText style={styles.fieldTitleText}>Ngày cấp:</AppText>
          </View>
          <View style={styles.marginTitleView}>
            <AppText style={styles.titleText}>{countryIdDate}</AppText>
          </View>
        </View>

        {countryOldId ? (
          <View style={[styles.rowViewStart, { marginTop: SH(10) }]}>
            <View style={{ flex: 0.3 }}>
              <AppText style={styles.fieldTitleText}>Số CMND cũ:</AppText>
            </View>
            <View style={styles.marginTitleView}>
              <AppText style={styles.titleText}>{countryOldId}</AppText>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  containerBox: {
    // marginTop: SH(8),
    // marginBottom: SH(24)
  },
  iconStyle: {
    width: SW(18),
    height: SH(18),
    resizeMode: 'contain',
  },
  textStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
  },
  subTitleTextStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray5,
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerBoxIdentify: {
    backgroundColor: Colors.primary5,
    padding: SW(16),
    borderRadius: 8,
    marginTop: SH(8),
  },
  rowViewStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginTitleView: {
    // marginLeft: SW(20),
    flex: 0.7,
  },
  fieldTitleText: {
    fontSize: SH(13),
    lineHeight: SH(22),
    color: Colors.gray5,
    // flex: 0.3,
  },
  titleText: {
    fontSize: SH(14),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
});

export default BoxIdentifyV2;
