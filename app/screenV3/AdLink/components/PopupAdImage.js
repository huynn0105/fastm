import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { IMAGE_PATH, ICON_PATH } from '../../../assets/path';
import { useDispatch, useSelector } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import { AppInfoDefault } from '../../../constants/configs';
import { sendEmailLink } from '../../../redux/actions/actionsV3/customerAction';
import Swiper from 'react-native-swiper';
import { SCREEN_WIDTH } from '../../../utils/Utils';

const HEIGHT_ITEM = SH(214);
const LIST_EX_IMAGE = Array.from({ length: 5 }, (_, index) => IMAGE_PATH?.[`exPL${index + 1}`]);

const PopupAdImage = memo((props) => {
  const { data, onClose, itemSelected } = props;
  const [state, setState] = useState('');

  const dispatch = useDispatch();

  const onSendAdImage = () => {
    setState('LOADING');
    dispatch(
      sendEmailLink(itemSelected?.id, data?.email, (isSuccess) => {
        if (isSuccess) {
          setState('DONE');
        }
      }),
    );
  };

  const onGoToGuide = () => {
    Linking.openURL(AppInfoDefault.guideUseAdImage).catch(() => {});
  };

  const renderQR = () => {
    return (
      <View style={styles.item}>
        <View style={[styles.itemImage, { alignItems: 'center', justifyContent: 'center' }]}>
          <QRCode value={data?.link} size={0.8 * SH(110)} />
        </View>
        <AppText style={[styles.textTitle, { color: Colors.gray1, marginTop: SH(12) }]} semiBold>
          QRCode dẫn tới trang liên kết
        </AppText>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item }} style={styles.itemImage} />
        <AppText style={[styles.textTitle, { color: Colors.gray1, marginTop: SH(12) }]} semiBold>
          Tời rơi mẫu {index + 1}
        </AppText>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.popupHeader}>
        <AppText medium style={styles.popupHeaderText}>
          Bộ nhận diện
        </AppText>
        <TouchableWithoutFeedback onPress={onClose}>
          <Image source={ICON_PATH.close1} style={styles.popupHeaderClose} />
        </TouchableWithoutFeedback>
      </View>
      <View
        style={[styles.popupHeader, { borderBottomWidth: 0, backgroundColor: Colors.primary5 }]}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <AppText style={styles.textTitle}>Tất cả gửi về mail</AppText>
          <AppText style={styles.textValue}>{data?.email || 'Không có mail'}</AppText>
        </View>
        <TouchableOpacity
          disabled={!data?.email}
          style={[styles.buttonSend, (state || !data?.email) && { backgroundColor: Colors.gray8 }]}
          onPress={onSendAdImage}
        >
          <AppText medium style={[styles.textValue, { color: Colors.primary5 }]}>
            {state === 'LOADING' ? 'Đang gửi...' : state === 'DONE' ? 'Đã gửi' : 'Gửi ngay'}
          </AppText>
        </TouchableOpacity>
      </View>
      <View style={[styles.body, { paddingBottom: SH(30) }]}>
        <View
          style={[
            styles.body,
            {
              paddingHorizontal: SW(16),
              paddingTop: SH(20),
              paddingBottom: SH(16),
            },
          ]}
        >
          <AppText style={[styles.textValue, { color: Colors.gray5 }]}>
            Bộ nhận diện cho liên kết
            <AppText semiBold style={{ color: Colors.gray1 }}>{` ${
              itemSelected?.title || ''
            }`}</AppText>
          </AppText>
          <View style={{ marginTop: SH(12) }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={data?.poster}
              ListHeaderComponent={renderQR}
              renderItem={renderItem}
            />
          </View>
          <AppText style={[styles.textValue, { color: Colors.gray5, marginTop: SH(24) }]}>
            Sử dụng bộ hình ảnh giúp bạn
          </AppText>

          <View style={[styles.row, { marginTop: SH(8) }]}>
            <Image source={ICON_PATH.check_success} style={styles.checkIcon} />
            <AppText semiBold style={styles.textValue}>
              Tiếp cận với nhiều khách hàng hơn
            </AppText>
          </View>
          <View style={styles.row}>
            <Image source={ICON_PATH.check_success} style={styles.checkIcon} />
            <AppText semiBold style={styles.textValue}>
              Đa dạng cách sử dụng: dán lên tường, tủ, mặt kính hoặc đặt lên bàn, phát tờ rơi
            </AppText>
          </View>
          <View style={styles.row}>
            <Image source={ICON_PATH.check_success} style={styles.checkIcon} />
            <AppText semiBold style={styles.textValue}>
              Kích cỡ chuẩn A3,4,5 dễ dàng in ấn với chi phí rẻ.
            </AppText>
          </View>
          <AppText style={[styles.textValue, { color: Colors.gray5 }]}>
            Xem hướng dẫn cách sử dụng
            <AppText semiBold style={{ color: Colors.primary2 }} onPress={onGoToGuide}>
              {' '}
              Tại đây >>
            </AppText>
          </AppText>
        </View>
        <Swiper
          height={HEIGHT_ITEM}
          showsButtons={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          horizontal
          autoplay
          autoplayTimeout={5}
          removeClippedSubviews={false}
          loop
        >
          {LIST_EX_IMAGE.map((item, index) => {
            return (
              <View style={styles.imageExContainer}>
                <Image source={item} style={styles.imageEx} />
              </View>
            );
          })}
        </Swiper>
      </View>
    </View>
  );
});

export default PopupAdImage;

const styles = StyleSheet.create({
  container: {
    marginBottom: SH(20),
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundChatScreen,
    paddingHorizontal: SW(16),
  },
  popupHeaderText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
    paddingVertical: SH(12),
  },
  popupHeaderClose: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 20,
    tintColor: Colors.primary3,
  },
  textTitle: {
    fontSize: 13,
    color: Colors.gray5,
  },
  textValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  buttonSend: {
    backgroundColor: Colors.primary2,
    paddingVertical: SH(10),
    marginVertical: SH(10),
    paddingHorizontal: SW(16),
    borderRadius: SH(20),
  },
  body: {
    backgroundColor: Colors.neutral5,
  },
  item: {
    marginRight: SW(16),
    alignItems: 'center',
  },
  itemImage: {
    width: 0.8 * SH(200),
    height: 0.8 * SH(130),
    borderRadius: SH(10),
    backgroundColor: Colors.primary5,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    marginBottom: SH(12),
  },
  checkIcon: {
    width: SW(18),
    height: SH(18),
    resizeMode: 'contain',
    marginRight: SW(8),
  },
  imageEx: {
    width: SW(343),
    height: HEIGHT_ITEM,
    borderRadius: SH(24),
  },
  imageExContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: Colors.gray1,
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -SH(80),
  },
  dot: {
    backgroundColor: Colors.gray8,
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: -SH(80),
  },
});
