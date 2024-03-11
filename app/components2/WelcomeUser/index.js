import React, { PureComponent } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import CharAvatar from '../../componentV3/CharAvatar';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { getDefaultAvatar } from '../../utils/userHelper';

class WelcomeUser extends PureComponent {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  textStyle = () => {
    return this.props.theme === 'dark' ? TextStyles.heading4 : TextStyles.whiteNormal;
  };
  colorLinkButton = () => {
    return this.props.theme === 'dark' ? Colors.primary2 : '#fff';
  };

  renderWelcome = (rankLevel) => (
    <AppText style={[this.textStyle(), { fontSize: SH(13), lineHeight: SH(16), opacity: 0.7 }]}>
      {`Xin chào`}
      {rankLevel ? ` ${rankLevel}` : ''}!
    </AppText>
  );

  renderUnknownUser = () => (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <AppText
        bold
        style={[
          {
            ...TextStyles.whiteNormal,
            textDecorationLine: 'underline',
            color: this.colorLinkButton(),
          },
          {
            fontSize: SH(13),
            lineHeight: SH(18),
          },
        ]}
      >
        {'Đăng nhập'}
      </AppText>
      <AppText
        style={[
          this.textStyle(),
          {
            fontSize: SH(13),
            lineHeight: SH(18),
          },
        ]}
      >
        {' để bắt đầu tạo nhu nhập'}
      </AppText>
    </View>
  );

  renderUserInfo = (name, phoneNumber) => {
    const { theme } = this.props;
    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText
            semiBold
            style={[
              theme === 'dark' ? TextStyles.heading4 : TextStyles.whiteNormal,
              { textAlign: 'left', fontSize: SH(14), lineHeight: SH(17) },
            ]}
          >
            {name}
          </AppText>
          {phoneNumber ? (
            <Image
              style={{
                marginLeft: 8,
                width: 11,
                height: 11,
                resizeMode: 'contain',
                tintColor: Colors.primary5,
              }}
              source={ICON_PATH.arrow_right_green}
            />
          ) : null}
        </View>
      </View>
    );
  };

  renderTitle = (name, phoneNumber) => {
    const { onFullNamePress, rankLevel } = this.props;
    const ContainerView = phoneNumber ? TouchableOpacity : View;
    return (
      <ContainerView
        style={{ marginLeft: 10, justifyContent: 'center' }}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        onPress={onFullNamePress}
      >
        {this.renderWelcome(rankLevel)}
        {name ? this.renderUserInfo(name, phoneNumber) : this.renderUnknownUser()}
      </ContainerView>
    );
  };

  render() {
    const { name, phoneNumber, avatar, style } = this.props;

    return (
      <View style={style}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this.onPress}>
          <CharAvatar defaultImage={getDefaultAvatar()} source={avatar} />
          {this.renderTitle(name, phoneNumber)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default WelcomeUser;
