import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  WebView,
  View,
  NativeModules,
  Platform,
  requireNativeComponent,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import CustomWebView from 'react-native-webview-android-file-upload';

import PropTypes from 'prop-types';
import { getAppVersion, checkInWhileList, Utils } from 'app/utils/Utils';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import colors from '../../constants/colors';

import {
  closeChat,
} from '../../submodules/firebase/redux/actions';

import { LOCATION_KEY } from './CommunicationKey';

import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';

import { backAndroidHandler, removeBackAndroidHandler } from '../../utils/BackButtonAndroid';

const { CustomWebViewManager } = NativeModules;

export const WebViewScreenMode = {
  NORMAL: 0,
  STACK: 1,
};

class WebViewAndroidScreen extends Component {
  static propTypes = {
    ...WebView.propTypes,
  };

  constructor(props) {
    super(props);
    if (this.props.navigation) {
      const params = this.props.navigation.state.params;
      const mode = params.mode ? params.mode : 0;
      const webURL = params.url ? params.url : '';
      const webURLsStack = params.urlsStack ? params.urlsStack : [];
      // is support back inside webview, default is true
      const isBackableInside =
        (params.isBackableInside !== undefined && params.isBackableInside !== null) ?
          params.isBackableInside : true;
      // don't allow web back if current url in unbackableURLs
      const unbackableURLs = params.unbackableURLs || [];
      if (unbackableURLs.length === 0) {
        if (mode === WebViewScreenMode.NORMAL) {
          unbackableURLs.push(webURL);
        }
        if (mode === WebViewScreenMode.STACK) {
          unbackableURLs.push(webURLsStack[webURLsStack.length - 1]);
        }
      }

      this.callbackBackEvent = params.callbackBackEvent;

      // init state
      this.state = {
        mode,
        unbackableURLs,
        isBackableInside,
        webURL,
        webURLsStack,
        currentWebURLsStackIndex: -1,
        shouldLoadNextURLOnWebURLsStack: true,
        isLoadingHidden: true,
        removeLoading: true,
      };
    }
  }
  // --------------------------------------------------
  componentDidMount() {
    // Utils.log(`${LOG_TAG} componentDidMount: `, this.state);
    if (this.props.navigation) {
      this.props.navigation.setParams({
        onHeaderBack: this.onHeaderBack,
        isBackableInside: this.state.isBackableInside,
        onClosePress: this.onClosePress,
      });
    }
    if (this.state.mode === 1) {
      setTimeout(() => {
        this.loadNextURLOnWebURLsStack();
      }, 100);
    }

    this.subs = [
      this.props.navigation.addListener('willFocus', this.reloadWhenFocus),
    ];
    backAndroidHandler(this.onHeaderBack);

  }

  componentWillUnmount() {
    if (this.callbackBackEvent !== undefined) {
      this.callbackBackEvent();
    }
    this.subs.forEach(sub => sub.remove());
    removeBackAndroidHandler(this.onHeaderBack);
  }

  reloadWhenFocus = () => { // eslint-disable-line
    this.props.closeChat();
  }

  // --------------------------------------------------
  sendMessageToWebview = (message) => {
    this.webView.postMessage(JSON.stringify(message));
  }

  fetchLocation = (uid) => {
    checkAndRequestPermissionLocation(location => {
      this.sendMessageToWebview({
        key: LOCATION_KEY,
        uid,
        location,
        os: Platform.OS,
        appVersion: getAppVersion(),
      });
    });
  }

  onMessage = (event) => {
    this.hideLoading();
    try {
      const dataJSON = JSON.parse(event.nativeEvent.data);
      if (dataJSON.key === LOCATION_KEY) {
        this.fetchLocation(dataJSON.uid);
      }
    }
    catch (err) {} // eslint-disable-line
  }

  onHeaderBack = () => {
    if (this.canWebViewGoBack && this.state.isBackableInside) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }

  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onWebViewNavigationStateChange = (state) => {
    if (checkInWhileList(state.url)) {
      Linking.openURL(state.url);
      return;
    }

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

    // normal url
    if (this.state.mode === 0) {
      this.hideLoading();
    }
    // stack urls
    else if (this.state.mode === 1) {
      if (this.state.shouldLoadNextURLOnWebURLsStack) {
        setTimeout(() => {
          this.loadNextURLOnWebURLsStack();
        }, 100);
      }
      if (this.state.currentWebURLsStackIndex >= this.state.webURLsStack.length - 1) {
        this.hideLoading();
      }
    }
  }
  onWebViewError = () => {
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
  loadNextURLOnWebURLsStack() {
    // check
    if (this.state.mode !== 1) {
      // Utils.log(`${LOG_TAG} loadNextURLOnWebURLsStack -> wrong mode`);
      return;
    }
    if (this.state.currentWebURLsStackIndex + 1 >= this.state.webURLsStack.length) {
      // Utils.log(`${LOG_TAG} loadNextURLOnWebURLsStack -> load all, stop`);
      return;
    }
    // next url
    const nextIndex = this.state.currentWebURLsStackIndex + 1;
    this.setState({
      currentWebURLsStackIndex: nextIndex,
      webURL: this.state.webURLsStack[nextIndex],
    });
  }
  appendParamToURL(url, param, paramValue) {
    let newURL = this.removeURLParameter(url, param);
    if (newURL.indexOf(param) === -1) {
      const combine = newURL.indexOf('?') === -1 ? '?' : '&';
      newURL = `${newURL}${combine}${param}=${paramValue}`;
    }
    return newURL;
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

  removeURLParameter(url, parameter) {
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + '='; // eslint-disable-line
      let pars = urlparts[1].split(/[&;]/g); // eslint-disable-line

      for (var i = pars.length; i-- > 0;) { // eslint-disable-line
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : ''); // eslint-disable-line
    }
    return url;
  }

  appendParamTo = (webURL) => {
    let newWebURL = webURL;
    if (webURL !== undefined && webURL !== '') {
      newWebURL = this.appendParamToURL(webURL, 'accessToken', this.props.myUser.accessToken);
      newWebURL = this.appendParamToURL(newWebURL, 'os', Platform.OS);
      newWebURL = this.appendParamToURL(newWebURL, 'appVersion', getAppVersion());
    }
    return newWebURL;
  };
  // --------------------------------------------------
  render() {
    // Utils.warn(`${LOG_TAG}: render, ${this.state.webURL}`);
    // append access token to every url
    let webURL = this.state.webURL;
    if (webURL !== undefined && webURL !== '') {
      if (webURL instanceof Array) {
        const newWebURLs = webURL.map(url => this.appendParamTo(url));
        webURL = newWebURLs.join(',');
      }
      else {
        webURL = this.appendParamTo(webURL);
      }
    }

    const nativeConfig =
      Platform.OS === 'android'
        ? {
          component: RCTWebViewAndroidScreen,
          viewManager: CustomWebViewManager,
        }
        : null;

    return (
      <View style={styles.container}>
        {
          webURL !== '' ?
            <CustomWebView
              webviewRef={object => { this.webView = object; }}
              source={{ uri: webURL }}
              scalesPageToFit
              onNavigationStateChange={this.onWebViewNavigationStateChange}
              onLoad={this.onWebViewLoad}
              onLoadStart={this.onWebViewLoadStart}
              onLoadEnd={this.onWebViewLoadEnd}
              onError={this.onWebViewError}
              dataDetectorTypes={'none'}
              nativeConfig={nativeConfig}
              onMessage={this.onMessage}
            />
            : null
        }
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

WebViewAndroidScreen.navigationOptions = ({ navigation }) => {
  const params = navigation.state.params;
  const title = navigation.state.params.title || ' ';
  return ({
    title,
    headerLeft: (params && params.canWebViewGoBack && params.isBackableInside) ?
      <HeaderBackButton navigation={navigation} />
      : null,
    headerStyle: Styles.navigator_header_no_border,
    headerTitleStyle: Styles.navigator_header_title,
    headerTintColor: '#000',
    headerRight: <HeaderRightButton navigation={navigation} />,
  });
};

WebViewAndroidScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => ({
  closeChat: () => dispatch(closeChat()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WebViewAndroidScreen);

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
          source={require('./img/loading.json')}
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


const HeaderBackButton = (props) => {
  const params = props.navigation.state.params;
  const iconSource = require('./img/back.png');
  return (
    (params && params.canWebViewGoBack && params.isBackableInside) &&
    <TouchableOpacity
      style={styles.headerBackButton}
      onPressIn={() => {
        if (params.onHeaderBack) {
          requestAnimationFrame(() => {
            params.onHeaderBack();
          });
        }
      }}
    >
      <Image
        style={{ width: 22, height: 22, marginLeft: 0 }}
        source={iconSource}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <TouchableOpacity
      style={styles.headerBackButton}
      onPressIn={() => {
        if (params.onClosePress) {
          requestAnimationFrame(() => {
            params.onClosePress();
          });
        }
      }}
    >
      <Image
        style={{ width: 22, height: 22, marginLeft: -8 }}
        source={require('./img/close_grey.png')}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RCTWebViewAndroidScreen = requireNativeComponent(
  'RCTWebViewAndroidScreen',
  WebViewAndroidScreen,
  WebView.extraNativeComponentConfig,
);
