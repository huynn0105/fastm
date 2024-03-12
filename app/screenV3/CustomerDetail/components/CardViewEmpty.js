import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import ButtonText from '../../../common/ButtonText';
import CharAvatar from '../../../componentV3/CharAvatar';

const CardViewEmpty = memo((props) => {
  const { animated, outOfList, isHideArrow, navigation, hasCustomer } = props;

  if (outOfList) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.primary5 }]}>
        <View style={styles.itemEmptyContainer}>
          <Image style={styles.iconEmpty} source={ICON_PATH.block} />
          <AppText style={styles.textEmpty}>
            {hasCustomer ? 'Đã tải hết khách hàng' : 'Khách hàng chưa có dự án'}
          </AppText>

          <Image source={IMAGE_PATH.loginRequire2} style={styles.imageEmpty} />
          <AppText style={styles.textEmpty}>
            {'Tiếp cận không giới hạn khách hàng có nhu\ncầu thông qua công cụ “Tiếp thị liên kết”'}
          </AppText>

          <ButtonText
            onPress={() => {
              navigation?.navigate('AdLinkScreen');
            }}
            title={'Tìm hiểu thêm'}
            top={16}
            height={48}
            fontSize={16}
            lineHeight={22}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isHideArrow ? null : (
        <View style={[styles.rowCenter, { position: 'absolute', top: 12 }]}>
          <Animated.View
            style={{
              opacity: animated.interpolate({
                inputRange: [0, 10, 20],
                outputRange: [0, 1, 1],
              }),
            }}
          >
            <Image
              style={[
                styles.icon,
                {
                  transform: [
                    {
                      rotate: '90deg',
                    },
                  ],
                },
              ]}
              source={ICON_PATH.arrowDownAppend}
            />
            <AppText style={styles.text}>
              {`Khách hàng\n`}
              <AppText bold style={styles.text3}>
                TRƯỚC ĐÓ
              </AppText>
            </AppText>
          </Animated.View>
          <Animated.View
            style={{
              opacity: animated.interpolate({
                inputRange: [-20, -10, 0],
                outputRange: [1, 1, 0],
              }),
              alignItems: 'flex-end',
            }}
          >
            <Image
              style={[
                styles.icon,
                {
                  transform: [
                    {
                      rotate: '270deg',
                    },
                  ],
                },
              ]}
              source={ICON_PATH.arrowDownAppend}
            />
            <AppText style={[styles.text, { textAlign: 'right' }]}>
              {`Khách hàng\n`}
              <AppText bold style={styles.text3}>
                KẾ TIẾP
              </AppText>
            </AppText>
          </Animated.View>
        </View>
      )}
      <CharAvatar
        style={styles.avatar}
        backgroundColor={Colors.neutral5}
        defaultImage={ICON_PATH.defaultAvatar}
      />
      <AppText
        style={[
          styles.text2,
          {
            marginTop: 12,
          },
        ]}
      >
        Hồ sơ khách hàng
      </AppText>
      <View style={[styles.box, { marginTop: 24 }]} />
      <View>
        <AppText
          style={[
            styles.text2,
            {
              marginTop: 33,
            },
          ]}
        >
          Lịch sử tham gia
        </AppText>
        <View style={[styles.box, { marginTop: 12 }]} />
      </View>
    </View>
  );
});

export default CardViewEmpty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SW(340),
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.gray8,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray8,
    marginTop: 4,
  },
  text2: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray8,
  },
  text3: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.sixOrange,
  },

  itemEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 34,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 12,
  },
  iconEmpty: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
    tintColor: Colors.gray5,
    marginTop: 12,
  },
  imageEmpty: {
    width: 132,
    height: 99,
    resizeMode: 'contain',
    marginTop: 49,
  },
  avatar: {
    width: SH(92),
    height: SH(92),
    borderRadius: SH(47),
    backgroundColor: Colors.neutral5,
  },
  box: {
    height: 113,
    width: SW(311),
    backgroundColor: Colors.neutral5,
    borderRadius: 8,
  },
});
