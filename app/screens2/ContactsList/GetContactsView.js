/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import { connect } from 'react-redux';

import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { Component } from 'react';

import colors from '../../constants/colors';
import AppText from '../../componentV3/AppText';

const SCREEN_WIDTH = Dimensions.get('window').width;
export const USAGE_TITLE = 'Điều khoản sử dụng';
export const POLICY_TITLE = 'Chính sách bảo mật';


// --------------------------------------------------
// GetContactsView
// --------------------------------------------------

class GetContactsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreed: false,
    };
  }
  onPress = () => {
    if (!this.state.agreed) return;
    this.props.onPress();
  };
  onPolicyPress = () => {
    const { generalInfo, navigation } = this.props;
    navigation.navigate('WebView', { url: generalInfo.privacyPolicyURL, title: POLICY_TITLE });
  };
  onUsageTermPress = () => {
    const { generalInfo, navigation } = this.props;
    navigation.navigate('WebView', { url: generalInfo.termsOfUsageURL, title: USAGE_TITLE });
  };
  onAgreePress = () => {
    this.setState({ agreed: !this.state.agreed });
  };
  renderText() {
    return (
      <View>
        <AppText
          style={{
            opacity: 0.8,
            fontSize: 12,
            textAlign: 'center',
            color: '#24253d',
            marginTop: 16,
            lineHeight: 18,
          }}
        >
          {
            'MFAST truy cập thông tin danh bạ của bạn để giúp thuận tiện trong việc kết nối với bạn bè'
          }
        </AppText>
        <AppText
          style={{
            opacity: 0.8,
            fontSize: 12,
            textAlign: 'center',
            color: '#24253d',
            marginTop: 16,
            lineHeight: 18,
          }}
        >
          {
            'MFAST không lưu trữ thông tin danh bạ của bạn trên máy chủ hoặc tiết lộ cho bên thứ ba khác nếu không có sự đồng ý của bạn.\nChi tiết vui lòng xem tại '
          }
          <AppText style={{ color: colors.app_theme_darker }} onPress={this.onPolicyPress}>
            {'Chính sách bảo mật'}
          </AppText>
          <AppText>{' và '}</AppText>
          <AppText style={{ color: colors.app_theme_darker }} onPress={this.onUsageTermPress}>
            {'Điều khoản sử dụng'}
          </AppText>
        </AppText>
      </View>
    );
  }
  renderCheckBox() {
    const { agreed } = this.state;
    return (
      <View
        style={{
          marginTop: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{
            padding: 6,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onAgreePress}
        >
          <Image
            style={{ width: 24, height: 24 }}
            source={agreed ? require('./img/ic_checkbox1.png') : require('./img/ic_checkbox.png')}
          />
          <AppText
            style={{
              fontSize: 14,
              opacity: agreed ? 0.8 : 1,
              color: '#24253d',
              marginLeft: 6,
            }}
          >
            {'Tôi đã đọc hiểu và đồng ý '}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }
  renderGantAccessButton() {
    const { agreed } = this.state;
    return (
      <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            height: 46,
            width: 220,
            borderRadius: 23,
            backgroundColor: agreed ? '#0082e0' : '#424d6c33',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onPress}
        >
          <AppText
            style={{
              opacity: agreed ? 1 : 0.5,
              fontSize: 14,
              fontWeight: '500',
              textAlign: 'center',
              color: agreed ? '#fff' : '#24253d',
            }}
          >
            {'Cho phép truy cập danh bạ'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.2}
        >
          <View style={styles.rowContainer}>
            <KJImage
              style={styles.iconImage}
              source={require('./img/sync.png')}
              defaultSource={require('./img/sync.png')}
              resizeMode="cover"
            />
            <AppText style={styles.titleText}>
              {'Đồng bộ danh bạ của bạn'}
            </AppText>
          </View>
        </TouchableOpacity> */}
        <Image
          style={{
            width: SCREEN_WIDTH * 0.4,
            height: (12 / 16) * SCREEN_WIDTH * 0.4,
            resizeMode: 'contain',
          }}
          source={require('./img/bg_chat.png')}
        />
        {this.renderText()}
        {this.renderCheckBox()}
        {this.renderGantAccessButton()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  generalInfo: state.generalInfo,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GetContactsView);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginBottom: SCREEN_WIDTH * 0.3,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.navigation_bg,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  titleText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '300',
  },
});
