import { connect } from 'react-redux';
import { SafeAreaView, View, Share } from 'react-native';
import React, { Component } from 'react';

import { Configs } from '../../constants/configs';
import { openLogin } from '../../redux/actions/navigation';
import BottomActionSheet from '../../components2/BottomActionSheet';
import Colors from '../../theme/Color';
import HomeActionSheet, { ITEM_IDS } from '../Home/HomeActionSheet';
import WebViewScreen from '../Others/WebViewScreen';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';

class CustomerScreen extends Component {
  constructor(props) {
    super(props);
    this.webView = React.createRef();
  }
  // #region EVENTS
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
      this.props.navigation.addListener('willBlur', this.componentWillBlur),
    ];
    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.EVENT.RELOAD_CUTOMER,
      this,
      this.onReloadPage,
    );
  }
  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.EVENT.RELOAD_CUTOMER, this);
  }

  componentDidFocus = () => {
    // setTimeout(() => {
    //   Linking.openURL('mfastmobile://open_ctv');
    // }, 1000);
  };

  componentWillBlur = () => {
    // BroadcastManager.shared().removeObserver(BroadcastManager.NAME.UI.BOTTOM_ACTION_HOME2, this);
  };

  onReloadPage = () => {
    if (this.webView && this.webView.reloadWebView) {
      this.webView.reloadWebView();
    }
  };

  onOpenBottomSheet = () => {
    this.actionSheetRef.open();
  };

  onBottomSheetItemPress = (itemID) => {
    this.actionSheetRef.close();
    if (!this.props.myUser.isLoggedIn) {
      this.props.openLogin();
      return;
    }
    const invitation = this.props.invitationInfo;

    setTimeout(() => {
      switch (itemID) {
        case ITEM_IDS.COLLABORATORS:
          this.props.navigation.navigate('Collaborator');
          break;
        case ITEM_IDS.INSTALL_LINK:
          Share.share({ message: invitation.CTV_text });
          break;
        default:
          break;
      }
    }, 450);
  };

  onSettingPress = () => {
    const { myUser } = this.props;
    let url = `${Configs.serverURL}/mfast/General/subscription_setting`;
    if (myUser.accessToken) {
      url = `${url}?accessToken=${myUser.accessToken}`;
    }

    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Cài đặt nghiệp vụ',
      url,
      bgImage: require('./img/bg_add_customer.png'),
    });
  };

  onCollaboratorPress = () => {
    // const url = this.props.appInfo.mFastNewCollaborator;
    // this.props.navigation.navigate('WebView', {
    //   mode: 0,
    //   title: 'Tạo tài khoản CTV',
    //   url,
    // });
    if (this.actionSheetRef) this.actionSheetRef.open();
  };
  onAddCustomerPress = () => {
    const url = this.props.appInfo.mFastPredsaCustomer;
    this.props.navigation.navigate('WebView', {
      mode: 0,
      title: 'Giới thiệu KH',
      url,
      bgImage: require('./img/bg_add_customer.png'),
    });
  };
  // #region RENDER

  renderBottomActionSheet = () => {
    return (
      <BottomActionSheet
        ref={(ref) => {
          this.actionSheetRef = ref;
        }}
        render={() => (
          <View>
            <HomeActionSheet
              onClosePress={() => {
                this.actionSheetRef.close();
              }}
              onItemPress={this.onBottomSheetItemPress}
              user={this.props.myUser}
            />
          </View>
        )}
      />
    );
  };

  render() {
    const url = this.props.appInfo.potentialCustomer;
    if (!url) return null;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        <View style={{ flex: 1, backgroundColor: 'red' }}>
          <WebViewScreen
            ref={(ref) => {
              if (ref && ref.getWrappedInstance) {
                this.webView = ref.getWrappedInstance();
              }
            }}
            navigation={this.props.navigation}
            params={{ url, bgImage: require('./img/bg_customer.png') }}
            needReloadForLogin
          />
        </View>
        {this.renderBottomActionSheet()}
      </SafeAreaView>
    );
  }
}

CustomerScreen.navigationOptions = (navigation) => {
  return {
    title: 'Khách hàng', // must have a space or navigation will crash
    header: null,
  };
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
  totalUnReadSystemNotifications: state.totalUnReadSystemNotificationsFb,
  invitationInfo: state.invitationInfo,
});

const mapDispatchToProps = {
  openLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen);
