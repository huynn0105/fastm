import { Image, Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { AppInfoDefault, DEEP_LINK_BASE_URL } from '../../../constants/configs';

const InfoLeave = memo(({ onCloseBottomSheet }) => {
  const onPress = useCallback(() => {
    onCloseBottomSheet?.();
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${
        AppInfoDefault?.collaboratorLeaveDetailUrl
      }&title=${'Điều kiện CTV rời đi'}`,
    );
  }, []);

  return (
    <View style={styles.container}>
      <AppText style={[styles.text, { color: Colors.gray1 }]}>
        Cộng tác viên của bạn có thể rời đi khi thỏa 1 trong 3 điều kiện dưới đây:
      </AppText>
      <View style={styles.infoContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={ICON_PATH.money2} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[styles.text, { color: Colors.gray5, flex: 1 }]}>Điều kiện 1</AppText>
          <AppText medium style={[styles.content, { color: Colors.gray1 }]}>
            30 ngày
            <AppText style={[styles.content, { color: Colors.sixRed }]}>{' không '}</AppText>
            phát sinh thu nhập
          </AppText>
        </View>
      </View>
      <View style={[styles.infoContainer, { borderTopWidth: 1, borderTopColor: Colors.gray4 }]}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={ICON_PATH.add3} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[styles.text, { color: Colors.gray5, flex: 1 }]}>Điều kiện 2</AppText>
          <AppText medium style={[styles.content, { color: Colors.gray1 }]}>
            15 ngày không
            <AppText style={[styles.content, { color: Colors.sixRed }]}>{' không '}</AppText>
            có hoạt động làm việc trên MFast
            <AppText style={[styles.content, { color: Colors.sixRed }]}>{' và không '}</AppText>
            phát sinh thu nhập
          </AppText>
        </View>
      </View>
      <View style={[styles.infoContainer, { borderTopWidth: 1, borderTopColor: Colors.gray4 }]}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={ICON_PATH.out} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={[styles.text, { color: Colors.gray5, flex: 1 }]}>Điều kiện 3</AppText>
          <AppText medium style={[styles.content, { color: Colors.gray1 }]}>
            10 ngày không
            <AppText style={[styles.content, { color: Colors.sixRed }]}>{' không '}</AppText>
            mở MFast
            <AppText style={[styles.content, { color: Colors.sixRed }]}>{' và không '}</AppText>
            phát sinh thu nhập
          </AppText>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            backgroundColor: Colors.primary5,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginTop: 4,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 48,
          }}
        >
          <AppText medium style={[styles.content, { color: Colors.primary2 }]}>
            Xem chi tiết điều kiện tại đây
          </AppText>
          <Image
            source={ICON_PATH.arrow_right}
            style={{ width: 16, height: 16, tintColor: Colors.primary2 }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
});

export default InfoLeave;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    padding: 16,
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
  },
  image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40 / 2,
    backgroundColor: Colors.primary5,
  },
});
