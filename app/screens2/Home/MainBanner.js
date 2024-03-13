import { View, Animated } from 'react-native';
import React from 'react';
import MainMenu from './MainMenu/index';
import VNDBalance from '../../components2/VNDBalance/index';
import WalletBalance from '../../components2/WalletBalance';

import { MAX_HEIGHT_HEADER } from './index';

export class MainBanner extends React.PureComponent {
  renderBalance() {
    const { walletInfo } = this.props;
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          marginBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          justifyContent: 'space-between',
          opacity: this.props.opacityBalanceView,
          elevation: 2,
        }}
        pointerEvents={'box-none'}
      >
        <VNDBalance
          vnd={
            this.props.myUser.totalMoneyPrettyString
              ? this.props.myUser.totalMoneyPrettyString()
              : '0'
          }
          navigation={this.props.navigation}
          onPress={this.props.onAvailableMoneyPress}
        />
        {/* <PointBalance
          point={
            this.props.myUser.totalPointPrettyString
              ? this.props.myUser.totalPointPrettyString()
              : '0'
          }
          navigation={this.props.navigation}
          onPress={this.props.onAvailablePointsPress}
        /> */}
        {walletInfo && (
          <WalletBalance
            title={walletInfo.title}
            desc={walletInfo.desc}
            descHtml={walletInfo.desc_html}
            navigation={this.props.navigation}
            onPress={this.props.onWalletPress}
          />
        )}
      </Animated.View>
    );
  }
  renderMenu() {
    const { isShowGift } = this.props;
    return (
      <View
        style={{
          elevation: 2,
        }}
        pointerEvents={'box-none'}
      >
        <MainMenu
          maxHeight={MAX_HEIGHT_HEADER}
          onPress={this.props.onMenuPress}
          scrollY={this.props.scrollY}
          isShowGift={isShowGift}
        />
      </View>
    );
  }
  render() {
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            padding: 14,
            height: 180,
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
              position: 'absolute',
              top: 0,
              left: 16,
              right: 16,
              shadowOpacity: 0.08,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              backgroundColor: '#fff',
              borderRadius: 10,
              elevation: 1,
              height: 150,
            },
            {
              transform: [
                {
                  scaleX: this.props.scaleWhiteBGY,
                },
              ],
            },
          ]}
          pointerEvents={'box-none'}
        />
        {this.renderBalance()}
        <Animated.View
          style={{
            marginLeft: 16,
            marginRight: 16,
            height: 1,
            backgroundColor: '#E6EBFF',
            opacity: this.props.opacityBalanceView,
            marginBottom: 16,
          }}
        />
        {this.renderMenu()}
      </Animated.View>
    );
  }
}
