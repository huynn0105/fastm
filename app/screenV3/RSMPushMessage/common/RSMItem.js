import React, { memo } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import commonStyle from '../../../constants/styles';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import Colors from '../../../theme/Color';
import { styles } from '../RSMPushMessage.style';

const RSMItem = ({ item, onDelete, hideRemoveButton }) => {
  const fixUrl = (url) => {
    return hardFixUrlAvatar(url)?.uri;
  };
  return (
    <View style={styles.containerItemRsm}>
      {item?.avatarImage?.length > 0 ? (
        <FastImage
          source={{ uri: fixUrl(item?.avatarImage) }}
          style={[styles.avatarImage, {}]}
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
            {item?.fullName.slice(0, 1).toUpperCase()}
          </AppText>
        </View>
      )}
      <AppText numberOfLines={1} style={commonStyle.mediumText}>
        {item?.fullName}
      </AppText>
      {!hideRemoveButton ? (
        <TouchableWithoutFeedback onPress={() => onDelete(item?.ID)}>
          <View style={styles.containerDeleteButton}>
            <FastImage source={ICON_PATH.delete1} style={styles.iconStyle} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
};

export default memo(RSMItem);
