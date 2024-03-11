import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Communications from 'react-native-communications';
import AppText from '../componentV3/AppText';
import Strings from '../constants/strings';
import { getAppVersion } from '../utils/Utils';

// --------------------------------------------------

const LOG_TAG = '7777: LoginBackground.js'; // eslint-disable-line
const SCREEN_SIZE = Dimensions.get('window');
const LOGO_IMAGE_WIDTH = SCREEN_SIZE.width * 0.33;
const LOGO_IMAGE_HEIGHT = SCREEN_SIZE.width * 0.33 * 0.9;

const _ = require('lodash');

// --------------------------------------------------

class LoginBackground extends Component {
  
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPolicyPress = () => {
    Communications.web(this.props.appInfo.termsOfUsageUrl);
  }
  render() {
    const {
      style,
    } = this.props;
    const version = getAppVersion();
    return (
      <View style={[styles.container, style]}>
        <ImageBackground
          style={{ flex: 1 }}
          source={require('./img/background.jpg')}
        >
          <View style={styles.body}>
            <Image
              style={styles.logoImage}
              source={require('./img/logo.png')}
              resizeMode="contain"
            />
            <AppText style={styles.agreementsText}>
              {Strings.agreements_1}
            </AppText>
            <TouchableOpacity
              style={styles.agreementsPolicyButton}
              onPress={this.onPolicyPress}
            >
              <AppText style={styles.agreementsPolicyText}>
                {Strings.agreements_2}
              </AppText>
            </TouchableOpacity>
            <AppText style={styles.versionText}>
              {`Version ${version}`}
            </AppText>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
});

export default connect(mapStateToProps, null)(LoginBackground);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  logoImage: {
    alignSelf: 'center',
    marginTop: 44,
    marginBottom: 20,
    width: LOGO_IMAGE_WIDTH,
    height: LOGO_IMAGE_HEIGHT,
  },
  agreementsText: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 38,
    backgroundColor: '#0000',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  agreementsPolicyButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 28,
    backgroundColor: '#f000',
  },
  agreementsPolicyText: {
    alignSelf: 'center',
    backgroundColor: '#0000',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  versionText: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#0000',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
