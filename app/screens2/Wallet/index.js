import React, { Component } from 'react';
import WebViewScreen from '../Others/WebViewScreen';

class WalletScreen extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <WebViewScreen
        ref={(ref) => {
          if (ref && ref.getWrappedInstance) {
            this.webView = ref.getWrappedInstance();
          }
        }}
        navigation={navigation}
        needReloadForLogin
      />
    );
  }
}

WalletScreen.navigationOptions = () => {
  return {
    title: '', // must have a space or navigation will crash
    header: null,
  };
};

export default WalletScreen;
