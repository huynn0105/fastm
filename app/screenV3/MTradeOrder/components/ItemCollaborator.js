import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import AppText from '../../../componentV3/AppText';
import { formatNumber } from '../../../utils/Utils';
import { ICON_PATH } from '../../../assets/path';
import { TouchableWithoutFeedback } from 'react-native';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import { debounce } from 'lodash';
import { getDefaultAvatar } from '../../../utils/userHelper';

const ItemCollaborator = memo((props) => {
  const { item, onPressItem } = props;

  const openChat = useCallback(
    debounce(
      () => {
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${item?.saleID}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [item?.userID],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${item?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [item],
  );

  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styles.container}>
        <CharAvatar
          source={hardFixUrlAvatar(item?.avatarImage)}
          style={styles.imageAvatar}
          textStyle={styles.textAvatar}
          defaultImage={getDefaultAvatar('male')}
        />
        <View style={styles.infoContainer}>
          <View style={styles.rowCenter}>
            <AppText style={styles.name} numberOfLines={1}>
              {item?.saleFullName}
            </AppText>
            <View style={styles.dot} />
            <AppText numberOfLines={1} style={styles.level}>
              Tầng {item?.refLevel}
            </AppText>
          </View>
          <AppText semiBold style={styles.point} numberOfLines={1}>
            {formatNumber(item?.sum_comm)} {'đ'}
          </AppText>
        </View>
        <TouchableWithoutFeedback onPress={openChat}>
          <Image source={ICON_PATH.message} style={styles.icon} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={openCall}>
          <Image source={ICON_PATH.calling} style={styles.icon} />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemCollaborator;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  imageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
  textAvatar: {
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    maxWidth: '68%',
  },
  level: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray11,
    marginHorizontal: 6,
  },
  point: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue3,
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  star: {
    width: 12,
    height: 12,
    tintColor: Colors.gray8,
  },
});
