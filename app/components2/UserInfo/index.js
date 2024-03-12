import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import CharAvatar from '../CharAvatar/index';
import Colors from '../../theme/Color';
import LinkButton from '../LinkButton/index';
import AppText from '../../componentV3/AppText';
class UserInfo extends PureComponent {
  onUpdatePhoneNumberPress = () => {
    const { user } = this.props;
    if (!user.phoneNumber) this.props.onUpdatePhoneNumberPress();
  };

  renderUserAvatar = (avatar, size, name) => (
    <CharAvatar
      style={{ width: size, height: size, borderRadius: size / 2 }}
      textStyle={{ fontSize: size * 0.4 }}
      source={avatar}
      defaultName={name}
    />
  );

  renderEditIcon = () => (
    <View style={styles.pencil}>
      <Image
        style={{
          width: 24,
          height: 24
        }}
        source={require('./img/pencil.png')}
        resizeMode="contain"
      />
    </View>
  );

  renderUneditableUserAvatar = (avatar, size, name) => this.renderUserAvatar(avatar, size, name);

  renderEditableUserAvatar = (avatar, size, name, onAvatarPress) => (
    <TouchableOpacity onPress={onAvatarPress}>
      <View>
        {this.renderUserAvatar(avatar, size, name)}
        {this.renderEditIcon()}
      </View>
    </TouchableOpacity>
  );

  renderUserInfoContainer = (name, phone, isVerifiedAccount) => {
    return (
      <View style={{ marginLeft: 16 }}>
        <AppText style={TextStyles.heading3}>{name}</AppText>
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <Image
            style={{ tintColor: phone ? '' : Colors.primary2 }}
            source={require('./img/icon_phone.png')}
          />
          {phone ? (
            <AppText
              style={{
                ...TextStyles.heading4,
                marginLeft: 12,
              }}
            >
              {phone}
            </AppText>
          ) : (
            <LinkButton
              textStyle={{
                ...TextStyles.heading4,
                marginLeft: 12,
                color: Colors.primary2
              }}
              text={'Cập nhật số điện thoại'}
              onPress={this.onUpdatePhoneNumberPress}
            />
          )}
        </View>
        {isVerifiedAccount ? (
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <Image source={require('./img/icon_pro.png')} />
            <AppText style={{ marginLeft: 12 }}>ProUser</AppText>
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      isEditableAvatar,
      user,
      isVerifiedAccount,
      onAvatarPress,
      onPress
    } = this.props;
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', ...containerStyle }}
        onPress={onPress}
      >
        {isEditableAvatar
          ? this.renderEditableUserAvatar(user.avatarImgURI, 80, user.fullName, onAvatarPress)
          : this.renderUneditableUserAvatar(user.avatarImgURI, 60, user.fullName)}
        {this.renderUserInfoContainer(user.fullName, user.phoneNumber, isVerifiedAccount)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  pencil: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24 / 2,
    backgroundColor: '#fff'
  }
});

export default UserInfo;
