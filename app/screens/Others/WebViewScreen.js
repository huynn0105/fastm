/**
 *
 * A webview container
 * which override back button to back in web incase the url change
 * params: mode, url, urlsStack
 * -> mode: 0: default -> only load the url
 * -> mode: 1: stack -> load all urls in urlsStack in order, the last item will be one display
 */

import { Alert, StyleSheet, TouchableOpacity, View, Image, Platform, Linking } from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';

// import testhtml from './bridgeWebviewTest.js';

import { closeChat } from '../../submodules/firebase/redux/actions';

import { LOCATION_KEY, CONTACT_KEY } from './CommunicationKey';

import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';

import { backAndroidHandler, removeBackAndroidHandler } from '../../utils/BackButtonAndroid';

import componentWithTracker, { SCREEN } from '../Tracker/index';

// --------------------------------------------------
// WebViewScreen
// --------------------------------------------------

import { getAppVersion, checkInWhileList, getDeviceTrackingInfo } from '../..//utils/Utils';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';

export const WebViewScreenMode = {
  NORMAL: 0,
  STACK: 1,
};

class WebViewScreen extends Component {
  constructor(props) {
    super(props);

    if (this.props.navigation) {
      const params = this.props.navigation.state.params;
      const mode = params.mode ? params.mode : 0;
      const webURL = params.url ? params.url : '';
      const webURLsStack = params.urlsStack ? params.urlsStack : [];
      // is support back inside webview, default is true
      const isBackableInside =
        params.isBackableInside !== undefined && params.isBackableInside !== null
          ? params.isBackableInside
          : true;
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
        loadingPercentage: 0,
      };
      this.loadingEnd = true;
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

    this.subs = [this.props.navigation.addListener('willFocus', this.reloadWhenFocus)];
    backAndroidHandler(this.onHeaderBack);
  }

  componentWillUnmount() {
    if (this.callbackBackEvent !== undefined) {
      this.callbackBackEvent();
    }
    this.subs.forEach((sub) => sub.remove());
    removeBackAndroidHandler(this.onHeaderBack);
  }

  reloadWhenFocus = () => {
    // eslint-disable-line
    this.props.closeChat();
  };

  fetchLocation = () => {
    return new Promise((resolve) => {
      checkAndRequestPermissionLocation((location) => {
        resolve(location);
      });
    });
  };

  onMessage = async (event) => {
    this.hideLoading();
    try {
      // work around for encode data
      let data = event.nativeEvent.data;
      for (let i = 0; i < 5; i += 1) {
        if (data.includes('%')) {
          data = decodeURIComponent(data);
        } else {
          break;
        }
      }

      const dataJSON = JSON.parse(data);
      if (dataJSON.key === LOCATION_KEY) {
        this.handleLocationRequest(dataJSON);
      } else if (dataJSON.key === CONTACT_KEY) {
        this.handleContactRequest(dataJSON);
      }
    } catch (err) {} // eslint-disable-line
  };

  handleLocationRequest = async (dataJSON) => {
    const location = await this.fetchLocation(dataJSON.uid);
    const trackingInfo = getDeviceTrackingInfo();
    this.sendMessageToWebview({
      key: LOCATION_KEY,
      uid: dataJSON.uid,
      location,
      os: Platform.OS,
      appVersion: getAppVersion(),
      ...trackingInfo,
    });
  };

  handleContactRequest = async () => {
    const contacts = Object.keys(this.props.allContacts).map((key) => this.props.allContacts[key]);
    this.sendMessageToWebview({
      key: CONTACT_KEY,
      data: contacts,
      os: Platform.OS,
      appVersion: getAppVersion(),
    });
  };

  sendMessageToWebview = (message) => {
    if (this.webView) {
      const data = this.injectedJavaScriptData(JSON.stringify(message));
      this.webView.injectJavaScript(data);
    }
  };

  injectedJavaScriptData = (data) => `
    (function() {
      if (typeof listenData !== 'undefined') {
        listenData('${data}');
      };
    })();
    true;
  `;

  isDeepLink(url) {
    return (
      url &&
      (url.startsWith('mfastmobile://') ||
        url.startsWith('tel:') ||
        url.startsWith('https://join.mfast.vn'))
    );
  }

  // --------------------------------------------------
  onHeaderBack = () => {
    if (this.canWebViewGoBack && this.state.isBackableInside) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  };
  onClosePress = () => {
    this.props.navigation.goBack();
  };
  onShouldStartLoadWithRequest = (request) => {
    if (checkInWhileList(request.url)) {
      Linking.openURL(request.url);
      return false;
    }
    if (this.isDeepLink(request.url)) {
      return false;
    }
    return true;
  };
  onWebViewNavigationStateChange = (state) => {
    if (checkInWhileList(state.url)) {
      Linking.openURL(state.url);
      return;
    }
    if (this.isDeepLink(state.url)) {
      return;
    }

    // Utils.log(`${LOG_TAG} onWebViewNavigationStateChange: `, state);

    // get webview go back behaviour
    let canWebViewGoBack = state.canGoBack;

    // don't allow webview back if go back to original url
    const unbacks = this.state.unbackableURLs.filter((url) => state.url === url);
    if (unbacks.length > 0) {
      canWebViewGoBack = false;
    }

    // update state
    this.canWebViewGoBack = canWebViewGoBack;
    this.props.navigation.setParams({ canWebViewGoBack: this.canWebViewGoBack });
  };
  onWebViewLoad = () => {
    // log params here might be too much info an can cause freeze ui
    // Utils.log(`${LOG_TAG} onWebViewLoad: ${this.state.webURL}`);
  };
  onWebViewLoadStart = (event) => {
    // log params here might be too much info an can cause freeze ui
    const nativeEvent = event.nativeEvent || {};
    const url = nativeEvent.url || '';
    // --
    this.showLoading();
    // auto hide loading if tap on deeplink
    if (url && (url.startsWith(`${DEEP_LINK_BASE_URL}://`) || url.startsWith('tel:'))) {
      setTimeout(() => {
        this.hideLoading();
      }, 1000);
    }
  };
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
  };
  onWebViewError = () => {
    // Utils.warn(`${LOG_TAG} onWebViewError: `);
    setTimeout(() => {
      this.setState(
        {
          isLoadingHidden: true,
        },
        () => {
          this.showAlert(Strings.unknown_error);
        },
      );
    }, 500);
  };
  // --------------------------------------------------
  showLoading() {
    const startPercentage = 0.1 + Math.floor(Math.random() * 10 + 1) / 25.0;
    this.updatePercentage(startPercentage);
    setTimeout(() => {
      this.updatePercentage(startPercentage * (1 + 0.3));
    }, 500);
    this.loadingEnd = false;
    setTimeout(() => {
      if (this.loadingEnd === false) {
        this.setState({ isLoadingHidden: false });
      }
    }, 300);
  }
  hideLoading() {
    this.loadingEnd = true;
    this.updatePercentage(1);
    setTimeout(() => {
      this.setState({ isLoadingHidden: true, loadingPercentage: 0 });
    }, 200);
  }
  updatePercentage = (percentage) => {
    if (this.state.loadingPercentage !== 0 && this.state.loadingPercentage !== 1) {
      if (this.state.loadingPercentage > percentage) {
        return;
      }
    }
    if (this.state.loadingPercentage === 1 && percentage !== 0) {
      return;
    }
    this.setState({ loadingPercentage: percentage });
  };
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
      [
        {
          text: 'Đóng',
          onPress: () => {},
        },
      ],
      { cancelable: false },
    );
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
  removeURLParameter(url, parameter) {
    const urlparts = url.split('?');
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + '='; // eslint-disable-line
      let pars = urlparts[1].split(/[&;]/g); // eslint-disable-line

      for (let i = pars.length; i-- > 0; ) {
        // eslint-disable-line
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : ''); // eslint-disable-line
    }
    return url;
  }
  // --------------------------------------------------
  render() {
    let webURL = this.state.webURL;
    if (webURL !== undefined && webURL !== '') {
      if (webURL instanceof Array) {
        const newWebURLs = webURL.map((url) => this.appendParamTo(url));
        webURL = newWebURLs.join(',');
      } else {
        webURL = this.appendParamTo(webURL);
      }
    }
    // ---
    return (
      <View style={styles.container}>
        <WebView
          ref={(object) => {
            this.webView = object;
          }}
          source={{ uri: webURL }}
          // source={{ html: testhtml }}
          scalesPageToFit
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          onNavigationStateChange={this.onWebViewNavigationStateChange}
          onLoad={this.onWebViewLoad}
          onLoadStart={this.onWebViewLoadStart}
          onLoadEnd={this.onWebViewLoadEnd}
          onError={this.onWebViewError}
          dataDetectorTypes={'none'}
          onMessage={this.onMessage}
        />
        {
          <LoadingScreen
            hidden={this.state.isLoadingHidden}
            percentage={this.state.loadingPercentage}
          />
        }
      </View>
    );
  }
}

const LoadingScreen = ({ percentage, hidden }) => (
  <View style={[styles.loadingContainer, hidden ? { opacity: 0 } : {}]}>
    <Progress.Bar
      progress={percentage}
      borderRadius={0}
      borderWidth={0}
      height={1.5}
      width={null}
      color="#39B5FC88"
    />
  </View>
);

// --------------------------------------------------

WebViewScreen.navigationOptions = ({ navigation }) => {
  const params = navigation.state.params;
  const title = navigation.state.params.title || ' ';
  return {
    title,
    headerLeft:
      params && params.canWebViewGoBack && params.isBackableInside ? (
        <HeaderBackButton navigation={navigation} />
      ) : null,
    headerStyle: Styles.navigator_header_no_border,
    headerTitleStyle: Styles.navigator_header_title,
    headerTintColor: '#000',
    headerRight: <HeaderRightButton navigation={navigation} />,
  };
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

WebViewScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  allContacts: state.allContacts,
});

const mapDispatchToProps = (dispatch) => ({
  closeChat: () => dispatch(closeChat()),
});

const TrackingWebViewScreen = componentWithTracker(
  WebViewScreen,
  SCREEN.WEB_VIEW,
  WebViewScreen.navigationOptions,
);

export default connect(mapStateToProps, mapDispatchToProps)(TrackingWebViewScreen);

// --------------------------------------------------

const HeaderBackButton = (props) => {
  const params = props.navigation.state.params;
  const iconSource = require('./img/back.png');
  return (
    params &&
    params.canWebViewGoBack &&
    params.isBackableInside && (
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
    )
  );
};

const HeaderRightButton = (props) => {
  const params = props.navigation.state.params;
  return (
    <TouchableOpacity
      testID="header-back"
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
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    // bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0000',
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
