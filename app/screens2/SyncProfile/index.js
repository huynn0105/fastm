import React, { Component } from 'react';

import { Text, View, Platform, StyleSheet, ScrollView } from 'react-native';
import Styles from '../../constants/styles';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import CustomButton, { BUTTON_SIZE } from '../../components2/CustomButton';
import UserPersonalInfoContainer from '../../screens/Profile/UserPersonalInfoContainer';
import AppText from '../../componentV3/AppText';

export class SyncProfileScreen extends Component {
  static navigationOptions = {
    title: 'Đồng bộ hồ sơ cá nhân',
    headerStyle: {
      ...Styles.navigator_header_no_border,
      backgroundColor: Colors.neutral5,
      marginLeft: Platform.OS === 'ios' ? 16 : 0,
      marginRight: Platform.OS === 'ios' ? 16 : 0,
    },
    headerTintColor: '#000000',
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.currentUser = navigation.getParam('myUser', {});
  }

  onSyncButtonPress = () => {};

  renderTitle = () => {
    const phoneNumber = this.currentUser.mPhoneNumber;
    return (
      <View style={{ paddingLeft: 16, paddingRight: 16, marginTop: 12 }}>
        <AppText style={{ ...TextStyles.heading4 }}>
          {'SĐT '}
          <AppText style={{ fontWeight: 'bold' }}>{phoneNumber}</AppText>
          {' đã được cập nhật hồ sơ cá nhân theo thông tin dưới đây:'}
        </AppText>
      </View>
    );
  };

  renderUserInfo = () => {
    return (
      <View style={{ marginTop: 16, backgroundColor: '#ffffffff' }}>
        <UserPersonalInfoContainer hideFieldFullName user={this.currentUser} />
      </View>
    );
  };

  renderFooterMessage = () => (
    <View style={{ marginTop: 36, paddingLeft: 36.5, paddingRight: 36.5 }}>
      <AppText style={{ ...TextStyles.heading4, opacity: 0.6, textAlign: 'center' }}>
        {'Để sử dụng lại thông tin trên cho tài khoản này, vui lòng nhấn đồng bộ'}
      </AppText>
    </View>
  );

  renderSyncButton = () => (
    <View style={{ marginTop: 16 }}>
      <CustomButton
        buttonStyle={{ paddingLeft: 24, paddingRight: 24 }}
        title="Đồng bộ"
        sizeType={BUTTON_SIZE.REGULAR}
        onPress={this.onSyncButtonPress}
      />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          {this.renderTitle()}
          {this.renderUserInfo()}
          {this.renderFooterMessage()}
          {this.renderSyncButton()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
});

export default SyncProfileScreen;
