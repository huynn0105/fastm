
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  WebView,
  Platform,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import ImageButton from 'common/buttons/ImageButton';

import { Configs } from '../../constants/configs';
import Styles from '../../constants/styles';
import Strings from '../../constants/strings';

/* eslint-disable */
import Utils, { getAppVersion } from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = '7777: ShopScreen.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ShopScreen
// --------------------------------------------------

class ShopScreen extends Component {
  constructor(props) {
    super(props);

    const webURL = `${Configs.mobileCardURL}`;
    const unbackableURLs = [webURL];

    this.state = {
      unbackableURLs,
      webURL,
      isLoadingHidden: true,
      removeLoading: true,
    };
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  // }
  // --------------------------------------------------
  componentDidMount() {
    // setup navigation
    if (this.props.navigation) {
      this.props.navigation.setParams({
        onHeaderBackButtonPress: this.onHeaderBackButtonPress,
        onHeaderRightButtonPress: this.onHeaderRightButtonPress,
        onHeaderCloseButtonPress: this.onHeaderCloseButtonPress,
      });
    }
  }
  // --------------------------------------------------
  onHeaderBackButtonPress = () => {
    if (this.canWebViewGoBack) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }
  onHeaderCloseButtonPress = () => {
    this.props.navigation.goBack();
  }
  onHeaderRightButtonPress = () => {
    const title = 'Lịch sử mua sắm';
    const url = `${Configs.mobileCardHistoryURL}`;
    const params = {
      mode: 0, title, url, isBackableInside: true,
    };
    this.props.navigation.navigate('WebView', params);
  }
  onWebViewNavigationStateChange = (state) => {
    // Utils.log(`${LOG_TAG} onWebViewNavigationStateChange: `, state);

    // get webview go back behaviour
    let canWebViewGoBack = state.canGoBack;

    // don't allow webview back if go back to original url
    const unbacks = this.state.unbackableURLs.filter(url => state.url === url);
    if (unbacks.length > 0) {
      canWebViewGoBack = false;
    }

    // update state
    this.canWebViewGoBack = canWebViewGoBack;
    this.props.navigation.setParams({ canWebViewGoBack: this.canWebViewGoBack });
  }
  onWebViewLoad = () => {
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LOG_TAG} onWebViewLoad: ${this.state.webURL}`);
  }
  onWebViewLoadStart = () => {
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LogTAG} onWebViewLoadStart`);
    this.showLoading();
  }
  onWebViewLoadEnd = () => {
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LOG_TAG} onWebViewLoadEnd`);
    this.hideLoading();
  }
  onWebViewError = () => {
    // Utils.warn(`${LOG_TAG} onWebViewError: `);
    setTimeout(() => {
      this.setState({
        isLoadingHidden: true,
      }, () => {
        this.showAlert(Strings.unknown_error);
      });
    }, 500);
  }
  // --------------------------------------------------
  showLoading() {
    this.setState({
      isLoadingHidden: false,
      removeLoading: false,
    });
  }
  hideLoading() {
    this.setState({
      isLoadingHidden: true,
    });
    setTimeout(() => {
      this.setState({
        removeLoading: true,
      });
    }, 300);
  }
  showAlert(message) {
    Alert.alert(
      Strings.alert_title,
      message,
      [{
        text: 'Đóng',
        onPress: () => { },
      }],
      { cancelable: false },
    );
  }

  appendParamToURL(url, param, paramValue) {
    // url already has accessToken
    if (url.indexOf(param) !== -1) {
      return url;
    }
    // append accessToken
    const combine = url.indexOf('?') === -1 ? '?' : '&';
    const newURL = `${url}${combine}${param}=${paramValue}`;
    return newURL;
  }
  // --------------------------------------------------
  render() {
    let webURL = this.state.webURL;
    if (webURL !== undefined && webURL !== '') {
      webURL = this.appendParamToURL(webURL, 'accessToken', this.props.myUser.accessToken);
      webURL = this.appendParamToURL(webURL, 'os', Platform.OS);
      webURL = this.appendParamToURL(webURL, 'appVersion', getAppVersion());
    }

    return (
      <View style={styles.container}>
        <WebView
          ref={object => { this.webView = object; }}
          source={{ uri: webURL }}
          scalesPageToFit={false}
          onNavigationStateChange={this.onWebViewNavigationStateChange}
          onLoad={this.onWebViewLoad}
          onLoadStart={this.onWebViewLoadStart}
          onLoadEnd={this.onWebViewLoadEnd}
          onError={this.onWebViewError}
          dataDetectorTypes={'none'}
        />
        {
          <LoadingScreen
            hide={this.state.isLoadingHidden}
            removeLoading={this.state.removeLoading}
          />
        }
      </View>
    );
  }
}

const LoadingScreen = (props) => (
  <Animatable.View
    style={[styles.loadingContainer,
    props.removeLoading ? { top: -100 } : {}]}
    animation={props.hide ? 'fadeOut' : 'fadeIn'}
    useNativeDriver
  >
    <View
      style={styles.loadingBorder}
    >
      <View style={{ marginLeft: 4, flex: 1, width: 24, height: 24 }}>
        <LottieView
          style={{ flex: 1 }}
          source={require('app/screens/Others/img/loading.json')}
          autoPlay
          loop
        />
      </View>
      <Animatable.Text
        style={{
          color: '#fff',
          marginLeft: 4,
          marginRight: 4,
        }}
        animation="flash" 
        easing="ease-out"
        iterationCount="infinite"
        direction="alternate"
        useNativeDriver
      >
        {'Đang tải '}
      </Animatable.Text>
    </View>
  </Animatable.View>
);

// --------------------------------------------------

ShopScreen.navigationOptions = ({ navigation }) => {
  return ({
    title: 'Mua sắm',
    headerStyle: Styles.navigator_header_no_border,
    headerTitleStyle: Styles.navigator_header_title,
    headerTintColor: '#000',
    headerLeft: <HeaderBackButton navigation={navigation} />,
    headerRight: <HeaderCloseButton navigation={navigation} />,
  });
};

const HeaderBackButton = (props) => {
  const params = props.navigation.state.params;
  const iconSource = require('./img/back.png');
  return (
    (params && params.canWebViewGoBack) ?
      <ImageButton
        style={styles.headerBackButton}
        imageSource={iconSource}
        onPressIn={() => {
          if (params.onHeaderBackButtonPress) {
            params.onHeaderBackButtonPress();
          }
        }}
      />
      : null
  );
};

const HeaderCloseButton = (props) => {
  const params = props.navigation.state.params;
  const iconSource = require('./img/close_grey.png');
  return (
    <ImageButton
      style={styles.headerBackButton}
      imageSource={iconSource}
      onPressIn={() => {
        if (params.onHeaderCloseButtonPress) {
          params.onHeaderCloseButtonPress();
        }
      }}
    />
  );
};

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <ImageButton
      style={styles.headerRightButton}
      imageSource={require('./img/history.png')}
      onPressIn={() => {
        if (params.onHeaderRightButtonPress) {
          params.onHeaderRightButtonPress();
        }
      }}
    />
  );
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ShopScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ShopScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: colors.navigation_bg,
  },
  loadingContainer: {
    position: 'absolute',
    top: 8,
    // bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    height: 26,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff0',
  },
  loadingBorder: {
    flexDirection: 'row',
    width: 90,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39B5FC',
  },
  headerBackButton: {
    width: 44,
    height: 44,
    paddingLeft: 0,
    paddingRight: 0,
  },
  headerRightButton: {
    width: 44,
    height: 44,
    paddingLeft: 0,
    paddingRight: 0,
  },
});
