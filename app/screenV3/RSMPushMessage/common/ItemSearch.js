import React, { useCallback } from 'react';
import { Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import Colors from '../../../theme/Color';
import { styles } from '../RSMPushMessage.style';

const ItemSearch = ({ item, onPressSelect, onPressUnselect }) => {
  const onPressItem = useCallback(() => {
    // setIsSelected(!isSelected);
    item?.isUnselect ? onPressSelect(item?.ID) : onPressUnselect(item?.ID);
  }, [item?.ID, item?.isUnselect, onPressSelect, onPressUnselect]);
  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View
        style={[
          styles.rowView,
          {
            justifyContent: 'space-between',
            paddingHorizontal: SW(16),
            marginBottom: SH(12),
          },
        ]}
      >
        <View style={styles.rowView}>
          {item?.avatarImage ? (
            <FastImage
              source={{ uri: hardFixUrlAvatar(item?.avatarImage).uri }}
              style={styles.avatarImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View
              style={[
                styles.avatarImage,
                {
                  backgroundColor: Colors.primary2,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <AppText style={[styles.headerPopupTextStyle, { color: Colors.primary5 }]}>
                {item?.fullName.slice(0, 1)}
              </AppText>
            </View>
          )}
          <View style={styles.marginText}>
            <AppText
              style={[
                styles.headerPopupTextStyle,
                {
                  maxWidth: SW(150),
                },
              ]}
              numberOfLines={1}
            >
              {item?.fullName}
            </AppText>
            <AppText style={[commonStyle.commonText, { color: Colors.gray5 }]}>
              Mã MFast:{'   '}
              <AppText
                style={[styles.headerPopupTextStyle, { marginLeft: SW(8), marginTop: SH(4) }]}
              >
                {item?.referralCode
                  ? item?.referralCode?.length === 5
                    ? item?.referralCode
                    : `${item?.referralCode}`
                        .slice(item?.referralCode?.length - 6, item?.referralCode?.length)
                        ?.replace('_', '')
                  : ''}
              </AppText>
            </AppText>
          </View>
        </View>
        <View style={styles.rowView}>
          <AppText style={[commonStyle.commonText, { color: Colors.gray5, marginRight: SW(4) }]}>
            Đã thêm
          </AppText>
          <TouchableWithoutFeedback onPress={onPressItem}>
            {item?.isUnselect ? (
              <View style={styles.checkBoxContainer} />
            ) : (
              <Image
                source={ICON_PATH.checkbox_ac}
                style={[
                  styles.indicationStyle,
                  { tintColor: Colors.primary2, resizeMode: 'contain' },
                ]}
              />
            )}
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ItemSearch;
