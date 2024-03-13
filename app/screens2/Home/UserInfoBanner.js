import { View, Animated } from 'react-native';
import React from 'react';
import ChatBoxButton from '../../components2/ChatBoxButton/index';
import colors from '../../theme/Color';
import WelcomeUser from '../../components2/WelcomeUser/index';

export class UserInfoBanner extends React.PureComponent {
  render() {
    const { userMetaData, myUser, onFullNamePress, onWelcomeUserPress } = this.props;
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 18,
            flexDirection: 'row',
            left: 16,
            right: 16,
          },
          {
            transform: [
              {
                translateY: this.props.translateYBG,
              },
            ],
          },
        ]}
        pointerEvents={'box-none'}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              opacity: this.props.opacityBalanceView,
            },
            {
              transform: [
                {
                  translateY: this.props.translateYWelcom,
                },
              ],
            },
          ]}
          pointerEvents={'box-none'}
        >
          <WelcomeUser
            style={{
              flex: 1,
            }}
            name={userMetaData?.fullName || myUser.fullName}
            phoneNumber={myUser.phoneNumber}
            avatar={myUser.avatarImgURI}
            onPress={onWelcomeUserPress}
            onFullNamePress={onFullNamePress}
          />
        </Animated.View>
        {myUser && myUser.isLoggedIn ? (
          <Animated.View
            style={[
              {
                marginLeft: 26,
                padding: 1,
              },
              {
                transform: [
                  {
                    translateX: this.props.translateXElly,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: 0.5,
                bottom: 2.5,
                left: 0.5,
                right: 0.5,
                borderRadius: 36 / 2,
                backgroundColor: `${colors.primary1}88`,
                opacity: this.props.opacityBorderView,
              }}
              pointerEvents={'box-none'}
            />
            <ChatBoxButton
              size={36}
              type={'elly'}
              unread={this.props.totalUnReadSystemNotifications}
              navigation={this.props.navigation}
            />
          </Animated.View>
        ) : null}
        {myUser && myUser.isLoggedIn ? (
          <View
            style={{
              marginLeft: 26,
              padding: 1,
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                top: 0.5,
                bottom: 2.5,
                left: 0.5,
                right: 0.5,
                borderRadius: 36 / 2,
                backgroundColor: `${colors.primary2}66`,
                opacity: this.props.opacityBorderView,
              }}
            />
            <ChatBoxButton
              size={36}
              type={'anna'}
              unread={this.props.totalUnReadAdminNotifications}
              navigation={this.props.navigation}
            />
          </View>
        ) : null}
      </Animated.View>
    );
  }
}
