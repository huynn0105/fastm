import { connect } from 'react-redux';
import { Image, SafeAreaView } from 'react-native';
import React, { Component } from 'react';

import ChatBoxButton from '../../components2/ChatBoxButton/index';
import Colors from '../../theme/Color';
import NavigationBar from '../../components2/NavigationBar';
import WebViewScreen from '../Others/WebViewScreen';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';

class CollaboratorScreen extends Component {
  componentDidMount() {
    BroadcastManager.shared().addObserver(
      BroadcastManager.NAME.EVENT.RELOAD_COL,
      this,
      this.onReloadPage,
    );
  }
  componentWillUnmount() {
    BroadcastManager.shared().removeObserver(BroadcastManager.NAME.EVENT.RELOAD_COL, this);
  }
  onReloadPage = () => {
    if (this.webView && this.webView.reloadWebView) {
      this.webView.reloadWebView();
    }
  };
  renderRightNaviButton = () => {
    const { navigation } = this.props;
    return <ChatBoxButton size={34} type="elly" unread={0} navigation={navigation} />;
  };
  renderNavigation = () => {
    return <NavigationBar title={'Cộng tác viên'} />;
  };
  render() {
    const url = this.props.appInfo.mFastCollaborators;
    if (!url) return null;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5, marginTop: 4 }}>
        <WebViewScreen
          ref={(ref) => {
            if (ref && ref.getWrappedInstance) {
              this.webView = ref.getWrappedInstance();
            }
          }}
          navigation={this.props.navigation}
          params={{ url, bgImage: require('./img/bg_collaborator.png') }}
          needReloadForLogin
        />
      </SafeAreaView>
    );
  }
}

CollaboratorScreen.navigationOptions = () => {
  return {
    title: 'Cộng tác viên', // must have a space or navigation will crash
    header: null,
  };
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  appInfo: state.appInfo,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CollaboratorScreen);
