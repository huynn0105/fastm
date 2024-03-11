import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import LoginActivitiesList from './LoginActivitiesList';

import AppStrings from '../../constants/strings';
import AppStyles from '../../constants/styles';
import TouchableText from '../../components/TouchableText';
import colors from '../../constants/colors';
import SpaceRow from './SpaceRow';

const _ = require('lodash');


class LoginActivities extends Component {
  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onForgotPass() {
    this.props.navigation.navigate('EditPassword');
  }

  renderHeaderSpace() {
    return (
      <View
        style={{
          height: 40,
          backgroundColor: colors.separator,
        }}
      >
        <Text style={{
          opacity: 0.5,
          fontSize: 14,
          paddingBottom: 12,
          paddingTop: 12,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        >
          DANH SÁCH ĐĂNG NHẬP
        </Text>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text>
          <Text style={styles.headerText}>
            {'Danh sách các thiết bị đã và đang dùng chung tài khoản MFast của bạn. Nếu phát hiện có thiết bị lạ, vui lòng '}
          </Text>
          <TouchableText
            style={{ fontSize: 14, color: '#0076ff', fontWeight: 'bold' }}
            text="đổi mật khẩu"
            onPress={() => { this.onForgotPass(); }}
          />
          <Text style={styles.headerText}>
            {' ngay lập tức để tránh lộ thông tin quan trọng'}.
          </Text>
        </Text>
      </View>
    );
  }

  renderList = () => {
    return (
      <LoginActivitiesList />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <ScrollView
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1 }}
        > */}
        <SpaceRow />
        {
          this.renderHeader()
        }
        {
          this.renderHeaderSpace()
        }
        {
          this.renderList()
        }

        {/* </ScrollView> */}
      </View>
    );
  }
}

LoginActivities.navigationOptions = () => ({
  title: 'Lịch sử đăng nhập',
  headerBackTitle: AppStrings.navigation_back_title,
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

export default LoginActivities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.navigation_bg,
    paddingTop: 14,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
  },
  headerText: {
    color: 'rgba(36,37,61,0.8)',
    fontSize: 14,
  },
});
