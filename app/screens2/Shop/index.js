import { connect } from 'react-redux';
import { copilot } from 'react-native-copilot';
import {
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';

import { Configs } from '../../constants/configs';
import Colors from '../../theme/Color';
import Menu, { ITEM_IDS } from './Menu';
import News from './News';
import PointBalance from '../../components2/PointBalance/index';
import ShopControl from './Shop';
import VNDBalance from '../../components2/VNDBalance/index';
import Tooltip from '../../components2/Guide/Tooltip';
import WebViewScreen from '../Others/WebViewScreen';
import { openLogin } from '../../redux/actions/navigation';
import AppText from '../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');

// eslint-disable-next-line no-multi-str
// const INFO = 'Ví mua sắm MFast gồm 2 loại đơn vị Tiền và Điểm, trong đó:\
// \nSố Tiền mua sắm: Bao gồm số tiền đã quyết toán từ doanh số của các tháng trước, Cộng với số tiền tạm tính từ doanh số trong tháng hiện tại.\
// \nĐiểm mua sắm: Bao gồm số điểm đã quyết toán từ doanh số của các tháng trước, Cộng với số điểm tạm tính từ doanh số trong tháng hiện tại.\
// \nBạn có thể dùng Tiền hoặc Điểm này để thanh toán các dịch vụ, sản phẩm mua sắm.';
const INFO =
  // eslint-disable-next-line no-multi-str
  '<span style="color: #333;">V&iacute; mua sắm MFast gồm 2 loại đơn vị <span style="color: #233a95;"><strong>Tiền</strong></span> v&agrave; <span style="color: #56c225;"><strong>Điểm</strong></span>, trong đ&oacute;<br/>\
<ul style="list-style-type: disc;">\
<li>Số <strong><span style="color: #233a95;">Tiền</span></strong> mua sắm: Bao gồm số tiền đ&atilde; quyết to&aacute;n từ doanh số của c&aacute;c th&aacute;ng trước, <span style="color: #233a95;"><strong>Cộng với số tiền tạm t&iacute;nh</span></strong> từ doanh số trong th&aacute;ng hiện tại.</li>\
<li><span style="color: #56c225;"><strong>Điểm</span></strong> mua sắm: Bao gồm số điểm đ&atilde; quyết to&aacute;n từ doanh số của c&aacute;c th&aacute;ng trước, <span style="color: #56c225;"><strong>Cộng với số điểm tạm t&iacute;nh</span></strong> từ doanh số trong th&aacute;ng hiện tại.</li>\
</ul>\
Bạn c&oacute; thể d&ugrave;ng <strong><span style="color: #233a95;">Tiền</span></strong> hoặc <strong><span style="color: #56c225;">Điểm</span></strong> này để thanh toán các dịch vụ, sản phẩm mua sắm.</span><br/>';

class ShopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedContent: ITEM_IDS.SHOP,
    };
  }
  onAvailableMoneyPress = () => {
    const title = 'Thu nhập tích lũy';
    const url = Configs.withdrawHistory;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onAvailablePointsPress = () => {
    const title = 'Điểm tích lũy';
    const url = Configs.pointHistory;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onMenuPress = (uid) => {
    this.setState({ selectedContent: uid });
  };
  onInfoPress = () => {
    this.props.start();
  };

  onShopItemPress = (item) => {
    // if (!this.props.myUser.isLoggedIn) {
    //   this.props.openLogin();
    //   return;
    // }
    const { url, title } = item;
    this.props.navigation.navigate('WebView', { mode: 0, title, url });
  };
  onBackPress = () => {
    this.props.navigation.goBack();
  };
  renderInfo = () => {
    // const title = this.state.showingInfo ? 'Đóng thông tin' : 'Thông tin';
    const InfoCopilot = ({ copilot }) => (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3000,
          position: 'absolute',
          right: 4,
          top: 0,
          bottom: 0,
          height: 28,
        }}
        onPress={this.onInfoPress}
        {...copilot}
      >
        <Image
          style={{ width: 24, height: 24, padding: 2 }}
          source={require('./img/ic_info.png')}
        />
      </TouchableOpacity>
    );

    return (
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 8,
          marginRight: 8,
          marginTop: 8,
          marginBottom: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 24,
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0 }}
          onPress={this.onBackPress}
        >
          <Image style={{ width: 28, height: 28 }} source={require('./img/icon_back_btn.png')} />
        </TouchableOpacity>
        <AppText
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: '600',
            textAlign: 'center',
            color: '#000',
            marginLeft: 56,
            marginRight: 56,
            marginTop: 2,
          }}
        >
          {'Dịch vụ, sản phẩm MFast'}
        </AppText>
        {/* <CopilotStep text={INFO} order={1} name="hello">
          <InfoCopilot />
        </CopilotStep> */}
      </View>
    );
  };
  renderBalance = () => {
    const { myUser } = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.primary5,
          margin: 16,
          padding: 12,
          justifyContent: 'space-between',
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <VNDBalance
          vnd={myUser.totalMoneyPrettyString ? myUser.totalMoneyPrettyString() : '0'}
          navigation={this.props.navigation}
          onPress={this.onAvailableMoneyPress}
          title={'Tiền tích luỹ'}
        />
        <PointBalance
          point={myUser.totalPointPrettyString ? myUser.totalPointPrettyString() : '0'}
          navigation={this.props.navigation}
          onPress={this.onAvailablePointsPress}
          title={'Điểm tích luỹ'}
        />
      </View>
    );
  };
  renderMenu = () => {
    return <Menu onPress={this.onMenuPress} selectedContent={this.state.selectedContent} />;
  };
  renderContent = () => {
    let result = null;

    switch (this.state.selectedContent) {
      case ITEM_IDS.NEWS:
        result = this.renderNews;
        break;
      case ITEM_IDS.HISTORY:
        result = this.renderHistory;
        break;
      default:
        result = this.renderShop;
    }
    return result();
  };
  renderNews = () => {
    return (
      <View style={{ height: SCREEN_SIZE.height - 60 - 260 }}>
        <News />
      </View>
    );
  };
  renderShop = () => {
    return (
      <View style={{ marginTop: 16, flex: 1 }}>
        <ScrollView>
          <ShopControl
            navigation={this.props.navigation}
            onPressItem={this.onShopItemPress}
            title={'Dịch vụ, sản phẩm MFast'}
          />
          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    );
  };
  renderHistory = () => {
    const url = this.props.appInfo.mFastHistoryShopping;
    return (
      <View style={{ marginTop: 16, flex: 1 }}>
        <WebViewScreen navigation={this.props.navigation} params={{ url }} />
      </View>
    );
  };
  render() {
    const Container = View;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <Container style={{ flex: 1, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            {this.renderInfo()}
            {this.renderBalance()}
            {this.renderMenu()}
            {this.renderContent()}
          </View>
        </Container>
      </SafeAreaView>
    );
  }
}

ShopScreen.navigationOptions = () => {
  return {
    title: ' ', // must have a space or navigation will crash
    header: null,
    headerTintColor: '#000',
    tabBarLabel: 'Mua sắm',
    tabBarIcon: ({ focused }) => {
      const icon = focused ? require('../img/ic_shop1.png') : require('../img/ic_shop.png');
      return <Image source={icon} style={{ width: 24, height: 24 }} resizeMode={'contain'} />;
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  openLogin: () => dispatch(openLogin()),
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
});

const CopilotShop = copilot({
  tooltipComponent: Tooltip,
  stepNumberComponent: () => <View />,
  overlay: 'view',
  animated: true,
  backdropColor: '#000a',
})(ShopScreen);

export default connect(mapStateToProps, mapDispatchToProps)(CopilotShop);
