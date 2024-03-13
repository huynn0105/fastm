import React, { useCallback } from 'react';
import { Linking, ScrollView } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { AppInfoDefault } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { openOSSettings } from '../../utils/UIUtils';
import AppText from '../AppText';

const PopupGuildEnable = ({ params }) => {
  const onOpenGuide = useCallback(() => {
    Linking.openURL(AppInfoDefault.guideEnableTrackingUrl).catch((err) => {});
  }, []);

  const openPrivacySettings = useCallback(() => {
    Linking.canOpenURL('App-Prefs:Privacy').then((supported) => {
      if (supported) {
        Linking.openURL('App-Prefs:Privacy');
      } else {
        openOSSettings();
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <AppText style={styles.headerText}>Mở theo dõi ứng dụng của bạn</AppText>
      <View style={styles.rowView}>
        <Image source={ICON_PATH.bell} style={styles.icon} />
        <View style={styles.containerNormalText}>
          <AppText style={styles.normalText} medium>
            Không bỏ lỡ những
            <AppText bold style={[styles.normalText, { color: Colors.primary2 }]}>
              {` tin tức quan trọng `}
            </AppText>
            từ MFast
          </AppText>
        </View>
      </View>
      <View style={styles.rowView}>
        <View style={styles.iconContainer}>
          <Image source={ICON_PATH.gift} style={styles.smallIcon} />
        </View>
        <View style={styles.containerNormalText}>
          <AppText style={styles.normalText} medium>
            Nhận những
            <AppText bold style={[styles.normalText, { color: Colors.highLightColor }]}>
              {` ưu đãi `}
            </AppText>
            dành riêng cho bạn
          </AppText>
        </View>
      </View>
      <View style={styles.rowView}>
        <Image source={ICON_PATH.support} style={styles.icon} />
        <View style={styles.containerNormalText}>
          <AppText style={styles.normalText} medium>
            Kịp thời
            <AppText bold style={[styles.normalText, { color: Colors.secondGreen }]}>
              {` hỗ trợ `}
            </AppText>
            khi xảy ra sự cố
          </AppText>
        </View>
      </View>
      <ScrollView horizontal style={styles.containerImage} showsHorizontalScrollIndicator={false}>
        <Image source={IMAGE_PATH.enableTracking1} style={styles.imageStyle} />
        <Image
          source={IMAGE_PATH.enableTracking2}
          style={[styles.imageStyle, { marginLeft: SW(8) }]}
        />
        <Image
          source={IMAGE_PATH.enableTracking3}
          style={[styles.imageStyle, { marginLeft: SW(8) }]}
        />
        <Image
          source={IMAGE_PATH.enableTracking4}
          style={[styles.imageStyle, { marginLeft: SW(8) }]}
        />
      </ScrollView>
      <View style={styles.containerBottomPath}>
        <AppText
          style={[
            styles.normalText,
            { color: Colors.gray5, textAlign: 'center', paddingHorizontal: SW(4) },
          ]}
        >
          {`Vào Cài đặt của iPhone -> Chọn “Quyền riêng tư”->\nBật “Cho phép ứng dụng yêu cầu theo dõi”\n-> Kích chọn MFast`}
        </AppText>
        <View style={styles.containerBottomButton}>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              {
                marginRight: SW(24),
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: Colors.gray5,
              },
            ]}
            onPress={onOpenGuide}
          >
            <AppText
              medium
              style={[
                styles.buttonText,
                {
                  color: Colors.gray5,
                },
              ]}
            >
              Tìm hiểu thêm
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={openPrivacySettings}>
            <AppText medium style={styles.buttonText}>
              Mở ngay
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SH(16),
    paddingBottom: SH(22),
    paddingHorizontal: SW(16),
    backgroundColor: Colors.actionBackground,
  },
  headerText: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.gray5,
    marginBottom: SH(10),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SH(12),
  },
  icon: {
    width: SW(32),
    height: SH(32),
    resizeMode: 'contain',
  },
  smallIcon: {
    width: SW(22),
    height: SH(22),
    resizeMode: 'contain',
  },
  iconContainer: {
    width: SH(32),
    height: SH(32),
    borderRadius: SH(32),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary5,
  },
  normalText: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray1,
  },
  containerNormalText: {
    marginLeft: SW(8),
  },
  containerImage: {
    marginTop: SH(8),
  },
  imageStyle: {
    width: SW(140),
    height: SH(238),
    resizeMode: 'contain',
  },
  containerBottomPath: {
    marginTop: SH(12),
  },
  containerBottomButton: {
    marginTop: SH(16),
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.primary5,
  },
  buttonStyle: {
    backgroundColor: Colors.primary2,
    justifyContent: 'center',
    alignItems: 'center',
    height: SH(48),
    borderRadius: SH(24),
    flex: 1,
  },
});

export default PopupGuildEnable;
