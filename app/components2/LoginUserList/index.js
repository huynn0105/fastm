import React, { Component } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import CharAvatar from '../CharAvatar';
import { SCREEN_HEIGHT, unixTimeToDateString } from '../../utils/Utils';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import {ICON_PATH} from '../../assets/path';

class LoginUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClosePress = () => {
    this.props.onClosePress();
  };

  onUserRowPress = (user) => {
    this.props.onUserRowPress(user);
  };

  renderTitle = () => {
    return (
      <View
        style={{
          padding: 10,
          alignItems: 'stretch',
          height: 46,
          backgroundColor: '#E6EBFF',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <AppText style={{ textAlign: 'center', fontSize: 14, color: Colors.primary4 }}>
            {'Chọn tài khoản'}
          </AppText>
        </View>
      </View>
    );
  };

  renderContent = (users) => {
    return (
      <ScrollView style={{ backgroundColor: 'white', maxHeight: SCREEN_HEIGHT * 0.7 }}>
        {users.map(this.renderUserRow)}
        <View style={{ height: 16 }} />
      </ScrollView>
    );
  };

  renderUserRow = (user) => {
    const { fullName, avatarImage, createTime, accountNote } = user;
    return (
      <View>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this.onUserRowPress(user)}
        >
          <View style={{ width: 56, height: 56, marginRight: 16 }}>
            <CharAvatar
              style={{ width: 56, height: 56, borderRadius: 56 / 2 }}
              defaultName={fullName}
              source={avatarImage ? { uri: avatarImage } : ''}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText style={{ fontWeight: '500', marginRight: 16, color: '#333' }}>{fullName}</AppText>
              <Image
                style={{ width: 16, height: 16, marginRight: 6 }}
                source={ICON_PATH.clock1}
              />
              <AppText style={{ opacity: 0.6, fontSize: 12, color: '#24253d' }}>
                {unixTimeToDateString(createTime)}
              </AppText>
            </View>
            {accountNote ? (
              <View style={{ marginTop: 8 }}>
                <AppText style={{ opacity: 0.6, fontSize: 14, color: '#24253d' }}>{accountNote}</AppText>
              </View>
            ) : null}
          </View>
          <Image style={{ width: 24, height: 24 }} source={ICON_PATH.arrow_right} />
        </TouchableOpacity>
        <View style={{ height: 1, backgroundColor: '#E6EBFF' }} />
      </View>
    );
  };

  render() {
    const { users } = this.props;
    return (
      <View>
        {this.renderTitle()}
        {this.renderContent(users)}
      </View>
    );
  }
}

export default LoginUserList;
