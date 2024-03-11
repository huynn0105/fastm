import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import colors from '../../theme/Color';
import KJImage from 'app/components/common/KJImage';
import CharAvatar from '../../components/CharAvatar';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';

const styles = StyleSheet.create({
  photoImage: {
    width: SW(58),
    height: SW(58),
    borderRadius: SW(58) / 2,
  },
  itemContainer: {
    width: SW(58),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    paddingTop: SH(6),
    opacity: 0.8,
    fontSize: SH(12),
    lineHeight: SH(16),
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.primary4,
  },
  doc: {
    width: SW(12),
    height: SH(12),
    borderRadius: 6,
    backgroundColor: colors.primary2,
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: colors.primary5,
    position: 'absolute',
    bottom: 0,
    right: 10,
  },
});

export const ActiveUserItem = ({ user, onPress, onLongPress }) => {
  const _onPress = () => {
    requestAnimationFrame(() => {
      onPress(user);
    });
  };

  const _onLongPress = () => {
    requestAnimationFrame(() => {
      onLongPress(user);
    });
  };

  return (
    <TouchableOpacity onPress={_onPress} onLongPress={_onLongPress}>
      <View style={styles.itemContainer}>
        <View>
          <CharAvatar
            avatarStyle={styles.photoImage}
            source={{ uri: user.avatar }}
            defaultName={user.fullName}
          />
          <View style={styles.doc} />
        </View>
        <AppText style={styles.title} numberOfLines={2}>
          {`${user.fullName}`}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export const AddFriendButton = ({ onRequestContactPress }) => (
  <TouchableOpacity onPress={onRequestContactPress}>
    <View style={styles.itemContainer}>
      <Image style={styles.photoImage} source={require('./img/icons_adduser.png')} />
      <AppText style={styles.title}>Thêm bạn</AppText>
    </View>
  </TouchableOpacity>
);
