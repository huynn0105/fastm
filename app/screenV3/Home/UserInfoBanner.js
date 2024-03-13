import React, { memo } from 'react';
import { Animated, Image, Platform, TouchableOpacity, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import WelcomeUser from '../../components2/WelcomeUser/index';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import { SEARCH_HEIGHT, USER_INFO_HEIGHT } from './constants';

export class UserInfoBanner extends React.PureComponent {
  rankLevel = () => {
    const { hierInfoUser } = this.props;

    const titleSplit = hierInfoUser?.rank?.level?.title?.split(' ');
    const maxIndex = titleSplit?.length - 1;
    const star = !isNaN(titleSplit?.[maxIndex]) ? titleSplit?.[maxIndex] : 0;
    const level = star
      ? titleSplit?.splice(0, maxIndex)?.join(' ')
      : hierInfoUser?.rank?.level?.title;
    return level;
  };

  render() {
    const {
      userMetaData,
      myUser,
      onFullNamePress,
      onWelcomeUserPress,
      opacitySearchBar,
      translateY,
      opacityBalanceView,
      onAvailableMoneyPress,
    } = this.props;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: SW(16),
          right: SW(16),
          zIndex: opacityBalanceView.interpolate({
            opacity: this.props.translateYBG,
            inputRange: [0, 1],
            outputRange: [-1, 1],
          }),
          transform: [
            {
              translateY,
            },
          ],
          height: USER_INFO_HEIGHT,
          justifyContent: 'center',
        }}
        pointerEvents={'box-none'}
      >
        <Animated.View
          style={{
            opacity: opacityBalanceView,
            flex: 1,
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              opacity: opacitySearchBar,
              flexDirection: 'row',
            }}
            pointerEvents={'box-none'}
          >
            <WelcomeUser
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
              name={userMetaData?.fullName || myUser.fullName}
              phoneNumber={myUser.phoneNumber}
              avatar={myUser.avatarImgURI}
              onPress={onWelcomeUserPress}
              onFullNamePress={onFullNamePress}
              rankLevel={this.rankLevel()}
            />
            {myUser?.isLoggedIn ? (
              <>
                <View
                  style={{
                    width: 1,
                    height: 32,
                    backgroundColor: 'rgba(214, 229, 255, 0.24)',
                    alignSelf: 'center',
                    marginHorizontal: 20,
                  }}
                />
                <IncomeUser myUser={myUser} onAvailableMoneyPress={onAvailableMoneyPress} />
              </>
            ) : null}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const IncomeUser = memo(({ myUser, onAvailableMoneyPress }) => {
  const vnd = myUser?.totalMoneyPrettyString ? myUser.totalMoneyPrettyString() : '0';

  return (
    <TouchableOpacity
      onPress={onAvailableMoneyPress}
      style={{ flex: 0.7, justifyContent: 'center' }}
    >
      <AppText
        style={{ fontSize: SH(13), lineHeight: SH(16), opacity: 0.7, color: Colors.primary5 }}
      >{`Thu nhập`}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText
          semiBold
          style={{
            textAlign: 'left',
            fontSize: SH(14),
            lineHeight: SH(17),
            color: Colors.primary5,
          }}
        >
          {vnd} đ
        </AppText>
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
      </View>
    </TouchableOpacity>
  );
});
