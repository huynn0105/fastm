import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';
import * as Animatable from 'react-native-animatable';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { SCREEN_HEIGHT } from '../../utils/Utils';
import colors from '../../theme/Color';
import UserRow from './UserRow';
import DigitelClient from '../../network/DigitelClient';
import { showInfoAlert, showQuestionAlert } from '../../utils/UIUtils';
import { updateUserNote } from '../../redux/actions/user';
import AppText from '../../componentV3/AppText';
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingUserList: true,
      currentUser: this.props.myUser,
      userList: [],
      editingUserID: '',
    };
  }

  componentDidMount() {
    this.fetchUserList();
  }

  /*  EVENT
   */

  onSwitchAccountPress = (user) => {
    const { myUser } = this.props;
    if (user.ID === myUser.uid) {
      this.props.navigation.navigate('Profile');
    } else {
      showQuestionAlert(
        `Bạn có muốn chuyển qua tài khoản ${user.fullName}?`,
        'Đồng ý',
        'Để sau',
        () => {
          this.props.onSwitchAccountPress(user);
        },
      );
    }
  };

  onEditNotePress = (userID) => {
    this.setState({ editingUserID: userID });
  };

  onCancelEditNotePress = () => {
    this.setState({ editingUserID: '' });
  };

  onSaveEditNotePress = async (userID, note) => {
    try {
      this.setState({ editingUserID: '' });
      this.setState({ fetchingUserList: true });
      const result = await updateUserNote(userID, note);

      if (!result) throw Error();

      this.updateUserNoteState(userID, note);
      showInfoAlert('Cập nhật ghi chú thành công');
    } catch (error) {
      showInfoAlert('Cập nhật ghi chú không thành công');
    } finally {
      this.setState({ fetchingUserList: false });
    }
  };

  onAddAccountPress = () => {
    this.props.onAddAccountPress();
  };

  onClosePress = () => {
    this.props.onClosePress();
  };

  /*  PRIVATE
   */

  fetchUserList = async () => {
    const { currentUser } = this.state;
    try {
      this.setState({ fetchingUserList: true });
      let userList = await DigitelClient.mfFetchUserList();
      userList = userList.sort((user) => user.ID !== currentUser.uid);
      this.setState({ userList });
    } catch (err) {
      showInfoAlert('Không lấy được danh sách tài khoản');
    } finally {
      this.setState({ fetchingUserList: false });
    }
  };

  updateUserNoteState = (userID, note) => {
    this.setState({
      userList: this.state.userList.map((user) =>
        user.ID === userID ? { ...user, accountNote: note } : user,
      ),
    });
  };

  /*  RENDER
   */

  renderCurrentUser = (currentUser) => {
    if (!currentUser) return null;

    const { editingUserID } = this.state;
    const {
      fullName,
      avatarImage: avatar,
      userReferralName: referralName,
      accountNote: note,
      uid: userID,
    } = currentUser;
    return (
      <View style={{ flex: 1, paddingTop: isIphoneX() ? 12 : 0 }}>
        <AppText
          style={{
            height: 14,
            opacity: 0.8,
            
            fontSize: 12,
            color: colors.primary4,
            marginLeft: 14,
          }}
        >
          {'Tài khoản đang sử dụng'}
        </AppText>
        {this.renderUserRow({
          fullName,
          avatar,
          referralName,
          note,
          userID: userID || currentUser.ID,
          isCurrentUser: true,
          editingUserID,
          userData: currentUser,
        })}
      </View>
    );
  };

  renderListUser = (users) => {
    const { fetchingUserList, currentUser } = this.state;
    return (
      <View>
        {users.length ? (
          <AppText
            style={{
              opacity: 0.8,
              
              fontSize: 12,
              lineHeight: 16,
              letterSpacing: 0,
              marginLeft: 14,
              marginTop: 14,
              color: colors.primary4,
            }}
          >
            {`Danh sách ${users.length} tài khoản MFast khác đang được quản lý bởi sđt ${currentUser.phoneNumber}`}
          </AppText>
        ) : null}
        {fetchingUserList ? (
          <ActivityIndicator style={{ margin: 4 }} animating={fetchingUserList} />
        ) : null}
        {users.map(this.renderOtherUser)}
      </View>
    );
  };

  renderOtherUser = (userInfo) => {
    const { editingUserID } = this.state;
    const {
      fullName,
      avatarImage: avatar,
      userReferralName: referralName,
      accountNote: note,
      ID: userID,
    } = userInfo;
    return (
      <View>
        {this.renderUserRow({
          fullName,
          avatar,
          referralName,
          note,
          userID,
          isCurrentUser: false,
          editingUserID,
          userData: userInfo,
        })}
        <View
          style={{
            marginLeft: 14,
            marginRight: 14,
            flex: 1,
            height: 1,
            backgroundColor: '#8883',
          }}
        />
      </View>
    );
  };

  renderUserRow = ({
    fullName,
    avatar,
    referralName,
    note,
    userID,
    isCurrentUser,
    editingUserID,
    userData,
  }) => (
    <UserRow
      state={''}
      userInfo={{ fullName, avatar, referralName, note, userID, isCurrentUser }}
      userData={userData}
      editingUserID={editingUserID}
      onSwitchAccountPress={this.onSwitchAccountPress}
      onEditNotePress={this.onEditNotePress}
      onCancelEditNotePress={this.onCancelEditNotePress}
      onSaveEditNotePress={this.onSaveEditNotePress}
    />
  );

  renderContent = () => {
    const { userList, currentUser } = this.state;
    return (
      <ScrollView
        style={{ backgroundColor: '#fff', width: '100%' }}
        keyboardShouldPersistTaps={'handled'}
      >
        {this.renderCurrentUser(userList[0] || currentUser)}
        <View style={{ width: '100%', height: 1, backgroundColor: '#8883' }} />
        {this.renderListUser(userList.slice(1))}
      </ScrollView>
    );
  };

  renderAddAccount = () => {
    const { userList, currentUser } = this.state;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', margin: 14 }}>
        {userList && userList.length <= 1 ? (
          <AppText
            style={{
              
              fontSize: 12,
              lineHeight: 20,
              color: 'rgba(36, 37, 61, 0.8)',
              marginBottom: 4,
            }}
          >
            {`Bạn có thể thêm tài khoản MFast, dùng chung sđt ${currentUser.phoneNumber}`}
          </AppText>
        ) : null}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={this.onAddAccountPress}
        >
          <Image
            style={{ width: 20, heigth: 20, marginRight: 12 }}
            source={require('./img/ic_add.png')}
          />
          <AppText
            style={{
              height: 20,
              
              fontSize: 14,
              lineHeight: 20,
              color: colors.primary2,
            }}
          >
            {'Thêm tài khoản'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  renderClose = () => {
    return (
      <Animatable.View animation={'fadeIn'} delay={500}>
        <TouchableOpacity
          onPress={this.onClosePress}
          style={{
            alignItems: 'center',
          }}
        >
          <Image
            style={{ width: 42, heigth: 42, marginBottom: 12, marginTop: 32 }}
            source={require('./img/ic_close.png')}
          />
          <AppText
            style={{
              height: 14,
              fontSize: 12,
              fontWeight: 'bold',
              color: colors.primary5,
            }}
          >
            {'Đóng'}
          </AppText>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  render() {
    return (
      <View
        style={{
          marginTop: -32,
        }}
      >
        <View
          style={{
            paddingTop: 64,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            maxHeight: SCREEN_HEIGHT - 160,
          }}
        >
          {this.renderContent()}
          {this.renderAddAccount()}
        </View>
        {this.renderClose()}
      </View>
    );
  }
}

export default UserList;
