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

const ItemListCollaborator = memo((props) => {
  const { item, navigation } = props;

  const starRank = useMemo(() => {
    const titleSplit = item?.level?.split(' ');
    const maxIndex = titleSplit?.length - 1;
    const star = !isNaN(titleSplit?.[maxIndex]) ? titleSplit?.[maxIndex] : 0;

    return star;
  }, [item]);

  const openChat = useCallback(
    debounce(
      () => {
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${item?.userID}`);
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

  const onOpenCollaborator = useCallback(() => {
    navigation?.push('Collaborator', { userId: item?.userID });
  }, [item?.userID, navigation]);

  return (
    <TouchableWithoutFeedback onPress={onOpenCollaborator}>
      <View style={styles.container}>
        <View style={styles.rankContainer}>
          <Image source={{ uri: item?.rankImage }} style={styles.imageRank} />
          {starRank ? (
            <View style={[styles.rowCenter, { marginTop: 2 }]}>
              {Array.from({ length: starRank }).map((_, index) => {
                return <Image key={index} source={ICON_PATH.boldStar} style={styles.star} />;
              })}
            </View>
          ) : null}
        </View>
        <CharAvatar
          source={hardFixUrlAvatar(item?.avatarImage)}
          style={styles.imageAvatar}
          textStyle={styles.textAvatar}
          defaultName={item?.fullName}
        />
        <View style={styles.infoContainer}>
          <View style={styles.rowCenter}>
            <AppText style={styles.name} numberOfLines={1}>
              {item?.fullName}
            </AppText>
            <View style={styles.dot} />
            <AppText numberOfLines={1} style={styles.level}>
              Tầng {item?.refLevel}
            </AppText>
          </View>
          <AppText semiBold style={styles.point} numberOfLines={1}>
            {formatNumber(item?.totalAmount)} {Number(item?.isPoint || 0) ? `điểm` : 'đ'}
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

export default ItemListCollaborator;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  imageRank: {
    width: 36,
    height: 36,
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
    color: Colors.thirdGreen,
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
  rankContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
});
