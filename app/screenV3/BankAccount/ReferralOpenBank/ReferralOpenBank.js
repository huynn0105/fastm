import { Image, Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { SW } from '../../../constants/styles';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';

const LIST_CONTENT = (data, navigation) => ({
  convenient: ['Mở 100% online', 'Rút tiền nhanh 24/7', 'Tự liên kết với MFast'],
  free: ['Mở tài khoản', 'Duy trì tài khoản', 'Chuyển & rút tiền'],
  gift: [
    <AppText style={styles?.text}>
      <AppText style={[styles?.text, { color: Colors.blue5 }]} bold>
        {data?.commission?.phase_1 ?? '0k'} vào ví MFast
      </AppText>{' '}
      ngay khi mở thành công
    </AppText>,
    <AppText style={styles?.text}>
      <AppText style={[styles?.text, { color: Colors.blue5 }]} bold>
        {data?.commission?.phase_2 ?? '0k'} vào tài khoản BIDV
      </AppText>{' '}
      khi tham gia chương trình quà tặng dành cho khách hàng mới, chi tiết xem{' '}
      <AppText
        onPress={() => {
          Linking.openURL(
            `${DEEP_LINK_BASE_URL}://open?view=webview&url=${data?.url_bonus}&title=${data?.title}`,
          );
        }}
        style={[styles.text, { color: Colors.primary2 }]}
        bold
      >
        chi tiết >>
      </AppText>
    </AppText>,
  ],
});

const ReferralOpenBank = memo(({ data }) => {
  const onPressDetail = useCallback(() => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${data?.url_intro}&title=${data?.title}`,
    );
  }, [data?.title, data?.url_intro]);

  const onRegister = useCallback(() => {
    data?.url && Linking.openURL(data?.url);
  }, [data?.url]);

  const renderItem = useCallback((item, index) => {
    return (
      <View key={index} style={[styles.row, { marginTop: 6 }]}>
        <Image source={ICON_PATH.tick2} style={styles.iconTick} />
        <AppText style={styles.text}>{item}</AppText>
      </View>
    );
  }, []);

  const renderFlag = (text, backgroundColor) => {
    return (
      <View style={[styles.flagContainer, { backgroundColor }]}>
        <AppText bold style={styles.textFlag}>
          {text}
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: data?.image }} style={styles.logo} />
      <AppText style={[styles.text, { marginTop: 12 }]}>
        Khuyến nghị mở tài khoản ngân hàng BIDV, để có trải nghiệm tốt nhất với MFast
      </AppText>
      <AppText bold style={[styles.text, { marginTop: 12 }]}>
        Tại sao nên chọn BIDV SmartBanking ?
      </AppText>
      <View style={[styles.row, { marginTop: 8 }]}>
        <View style={[styles.box, { backgroundColor: '#fdecd8', marginRight: 4 }]}>
          {LIST_CONTENT()?.convenient?.map(renderItem)}
          {renderFlag('Tiện lợi', Colors.sixOrange)}
        </View>
        <View style={[styles.box, { backgroundColor: '#d6fff4' }]}>
          {LIST_CONTENT()?.free?.map(renderItem)}
          {renderFlag('Miễn phí', Colors.thirdGreen)}
        </View>
      </View>
      <View style={[styles.box, { backgroundColor: '#e0ecff', marginTop: 4 }]}>
        {LIST_CONTENT(data)?.gift?.map(renderItem)}
        {renderFlag('Quà tặng', Colors.blue5)}
      </View>

      <View style={{ marginTop: 22 }}>
        <AppText bold style={styles.text}>
          Lưu ý: khi mở tài khoản BIDV Smartbanking, cần chọn chi nhánh mở tài khoản là
        </AppText>
        <View style={[styles.row, { flex: 1, marginRight: SW(16), zIndex: 9, marginTop: 12 }]}>
          <View style={[styles.boxDash, { flex: 1, marginRight: 12 }]}>
            <AppText bold style={{ lineHeight: 26, fontSize: 20, color: Colors.sixOrange, top: 2 }}>
              CN TÂY HỒ
            </AppText>
          </View>
          <AppText style={[styles.smallText, { flex: 1 }]}>
            để được liên kết tự động với MFast và nhận được những ưu đãi trên
          </AppText>
        </View>
        <View style={{ width: '100%', aspectRatio: 315 / 197, marginTop: 16 }}>
          <Image
            source={IMAGE_PATH.exBidvBank}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{ flex: 1, marginTop: 16 }}>
          <TouchableWithoutFeedback onPress={onRegister}>
            <View
              style={{
                height: 50,
                width: '100%',
                backgroundColor: Colors.action,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppText style={{ fontSize: 16, lineHeight: 24, color: Colors.primary5 }}>
                {data?.desc}
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
});

export default ReferralOpenBank;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  logo: {
    width: 90,
    height: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  smallText: {
    fontSize: 13,
    color: Colors.gray1,
    lineHeight: 18,
  },
  text: {
    fontSize: 14,
    color: Colors.gray1,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
  },
  iconTick: {
    tintColor: Colors.thirdGreen,
    width: 20,
    height: 20,
  },
  box: {
    flex: 1,
    borderRadius: 8,
    paddingTop: 28,
    paddingLeft: 4,
    paddingRight: 10,
    paddingBottom: 12,
  },
  flagContainer: {
    position: 'absolute',
    height: 24,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textFlag: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.primary5,
    textTransform: 'uppercase',
  },
  boxDash: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.sixOrange,
    borderStyle: 'dashed',
    backgroundColor: '#fdecd8',
    width: '100%',
    height: 54,
  },
  image: {
    width: SW(105),
    resizeMode: 'contain',
  },
});
