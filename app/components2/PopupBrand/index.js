import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Linking,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SCREEN_WIDTH } from '../../utils/Utils';
import HTML from 'react-native-render-html';
import MapView, { Marker } from 'react-native-maps';

import Modal from 'react-native-modal';
import AppText from '../../componentV3/AppText';

const PopupBrand = ({ isVisible, data, onPressClose }) => {
  const onPressHotline = useCallback(() => {
    if (data?.hotline) {
      const parseHotline = data?.hotline.replace(/[.]/g, '');
      Linking.openURL(`tel://${parseHotline}`);
    }
  }, [data]);

  const onPressEmail = useCallback(() => {
    if (data?.email) {
      Linking.openURL(`mailto:${data?.email}`);
    }
  }, [data]);

  const onPressWebsite = useCallback(() => {
    if (data?.website) {
      const prefix = data?.website.includes('https://') ? '' : 'https://';
      Linking.openURL(`${prefix}${data?.website}`);
    }
  }, [data]);

  const onPressFB = useCallback(() => {
    if (data?.fb_url) {
      const prefix = data?.fb_url.includes('https://') ? '' : 'https://';
      Linking.openURL(`${prefix}${data?.fb_url}`);
    }
  }, [data]);

  const onPressAddress = useCallback(() => {
    if (data?.address) {
      const prefix =
        Platform.OS === 'ios' ? 'http://maps.apple.com/?q=' : 'https://maps.google.com/?q=';
      Linking.openURL(`${prefix}${data?.address}`);
    }
  }, [data]);

  const onPressMap = useCallback(() => {
    if (data?.location?.latitude && data?.location?.longitude) {
      const prefix = Platform.OS === 'ios' ? 'maps:' : 'geo:';
      const schema = `${prefix}${data?.location?.latitude},${data?.location?.longitude}`;
      Linking.openURL(schema);
    }
  }, [data]);

  return (
    <Modal isVisible={true} useNativeDriver>
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <View style={styles.topContainer}>
            <ImageBackground source={require('./img/bg_top.png')} style={styles.bgTop}>
              {data?.brand_logo ? (
                <FastImage source={{ uri: data?.brand_logo }} style={styles.brandLogo} />
              ) : (
                <View />
              )}
            </ImageBackground>
          </View>
          <View style={styles.bodyContainer}>
            <ScrollView style={styles.scroll}>
              <AppText style={styles.indicatorTop}>Chào mừng bạn đến với</AppText>
              <AppText style={styles.brandName}>{data?.brand_name}</AppText>
              <HTML
                html={data?.desc_txt}
                tagsStyles={{
                  a: { textDecorationLine: 'none' },
                  p: { marginBottom: 12 },
                }}
              />
              {data?.brand_profile_pic && (
                <FastImage
                  source={{ uri: data?.brand_profile_pic }}
                  style={styles.brandProfilePic}
                  resizeMode="contain"
                />
              )}
              <AppText style={styles.indicatorBold}>Thông tin liên hệ</AppText>
              {data?.hotline && (
                <TouchableWithoutFeedback onPress={onPressHotline}>
                  <View style={styles.inforWrapper}>
                    <View style={styles.labelContainer}>
                      <Image source={require('./img/ic_phone.png')} style={styles.ic} />
                      <AppText style={styles.label}>Hotline</AppText>
                    </View>
                    <AppText style={styles.content}>{data?.hotline}</AppText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {data?.email && (
                <TouchableWithoutFeedback onPress={onPressEmail}>
                  <View style={styles.inforWrapper}>
                    <View style={styles.labelContainer}>
                      <Image source={require('./img/ic_mail.png')} style={styles.ic} />
                      <AppText style={styles.label}>Email</AppText>
                    </View>
                    <AppText style={styles.content}>{data?.email}</AppText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {data?.website && (
                <TouchableWithoutFeedback onPress={onPressWebsite}>
                  <View style={styles.inforWrapper}>
                    <View style={styles.labelContainer}>
                      <Image source={require('./img/ic_website.png')} style={styles.ic} />
                      <AppText style={styles.label}>Website</AppText>
                    </View>
                    <AppText style={styles.content}>{data?.website}</AppText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {data?.fb_url && (
                <TouchableWithoutFeedback onPress={onPressFB}>
                  <View style={styles.inforWrapper}>
                    <View style={styles.labelContainer}>
                      <Image source={require('./img/ic_fb.png')} style={styles.ic} />
                      <AppText style={styles.label}>Facebook</AppText>
                    </View>
                    <AppText style={styles.content}>{data?.fb_url}</AppText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {data?.address && (
                <TouchableWithoutFeedback onPress={onPressAddress}>
                  <View style={styles.addressWrapper}>
                    <View style={styles.labelContainer}>
                      <Image source={require('./img/ic_address.png')} style={styles.ic} />
                      <AppText style={styles.label}>Địa chỉ</AppText>
                    </View>
                    <AppText style={styles.addressTxt}>{data?.address}</AppText>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {data?.location?.latitude && data?.location?.longitude && (
                <TouchableWithoutFeedback onPress={onPressMap}>
                  <MapView
                    style={styles.mapView}
                    region={{
                      latitude: parseFloat(data?.location?.latitude),
                      longitude: parseFloat(data?.location?.longitude),
                      latitudeDelta: 0.0048,
                      longitudeDelta: 0.006,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(data?.location?.latitude),
                        longitude: parseFloat(data?.location?.longitude),
                      }}
                      image={require('./img/ic_address.png')}
                    />
                  </MapView>
                </TouchableWithoutFeedback>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
          <TouchableWithoutFeedback style={styles.footer} onPress={onPressClose}>
            <View style={styles.footer}>
              <AppText style={styles.close}>Đóng</AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

export default PopupBrand;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  topContainer: {
    width: SCREEN_WIDTH - 120,
    marginBottom: -1,
  },
  bgTop: {
    width: '100%',
    aspectRatio: 221 / 39,
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 120,
  },
  brandLogo: {
    width: SCREEN_WIDTH * 0.3,
    aspectRatio: 109 / 32,
  },
  footer: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    fontSize: 16,
    lineHeight: 20,
    color: '#39b818',
    fontWeight: '500',
    textAlign: 'center',
  },
  indicatorTop: {
    fontSize: 13,
    lineHeight: 20,
    color: '#24253d',
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    lineHeight: 20,
    color: '#24253d',
    marginVertical: 8,
  },
  brandName: {
    fontSize: 15,
    lineHeight: 23,
    color: '#233a95',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 14,
  },
  brandProfilePic: {
    width: SCREEN_WIDTH - 64,
    height: ((SCREEN_WIDTH - 64) * 3) / 4,
  },
  indicatorBold: {
    fontSize: 13,
    lineHeight: 20,
    color: '#24253d',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 3,
  },
  inforWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  addressWrapper: {
    justifyContent: 'center',
    marginVertical: 2,
  },
  labelContainer: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ic: {
    width: 20,
    height: 20,
  },
  label: {
    opacity: 0.6,
    fontSize: 12,
    lineHeight: 18,
    color: '#24253d',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#233a95',
    fontWeight: '500',
  },
  addressTxt: {
    marginLeft: 30,
    fontSize: 13,
    lineHeight: 20,
    color: '#233a95',
    fontWeight: '500',
  },
  mapView: {
    width: SCREEN_WIDTH - 94,
    height: 140,
    marginLeft: 30,
  },
});
