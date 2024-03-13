import { ScrollView, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

import { SCREEN_HEIGHT } from '../../utils/Utils';
import CharAvatar from '../../components/CharAvatar';
import Colors from '../../theme/Color';
import PrefixText from '../../components2/Prefix';
import AppText from '../../componentV3/AppText';
class AccountList extends Component {
  onClosePress = () => {
    this.props.onClosePress();
  };

  onUserRowPress = (user) => {
    const { invitations } = this.props;
    const selectedInvitation = invitations.filter(
      (invitation) => invitation.receiverUID === user.ID,
    )[0];

    this.props.onUserRowPress(selectedInvitation);
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
            {'Chấp nhận với tài khoản?'}
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

  renderAcceptStatus = (invitation, user, isAccepting) => {
    if (isAccepting) return <ActivityIndicator animating />;

    return invitation.accepted ? (
      <AppText style={{ color: '#24253d' }}>{'Đã kết bạn'}</AppText>
    ) : (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 4,
          paddingTop: 4,
        }}
        onPress={() => this.onUserRowPress(user)}
      >
        <AppText style={{ color: Colors.primary2 }}>{' Xác nhận '}</AppText>
      </TouchableOpacity>
    );
  };

  renderUserRow = (user) => {
    // eslint-disable-next-line camelcase
    const { invitations, accepting } = this.props;
    const currentInvitation = invitations.filter(
      (invitation) => invitation.receiverUID === user.ID,
    )[0];

    const { fullName, avatarImage, rsm_description: note, prefix } = user;

    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
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
              <View style={{ flexDirection: 'row' }}>
                <PrefixText text={prefix} />
                <AppText style={{ fontWeight: '500', marginRight: 16, color: '#333' }}>
                  {fullName}
                </AppText>
              </View>
            </View>
            {note ? (
              <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ marginRight: 8, width: 16, heigth: 16 }}
                  source={require('./img/ic_info.png')}
                />
                <AppText style={{ fontSize: 14, color: '#24253d', fontStyle: 'italic' }}>{note}</AppText>
              </View>
            ) : null}
          </View>
          {/* <Image style={{ width: 24, height: 24 }} source={require('./img/ic_next.png')} /> */}
          {this.renderAcceptStatus(currentInvitation, user, !!accepting[currentInvitation.uid])}
        </View>
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

AccountList.defaultProps = {
  users: [],
};

export default AccountList;
