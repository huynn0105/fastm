import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import CharAvatar from '../CharAvatar';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const EDIT_STATE = {
  NONE: 'NONE',
  EDITING: 'EDITING',
  BLUR: 'BLUR',
};

class UserRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: props.userInfo.note,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { note } = this.state;
    const { userInfo: nextUserInfo } = nextProps;
    if (nextUserInfo && note !== nextUserInfo.note) {
      this.setState({ note: nextUserInfo.note });
    }
  }

  /*  EVENTS
   */

  onChangeNoteText = (text) => {
    this.setState({ note: text });
  };

  onSaveEditNotePress = () => {
    const { note } = this.state;
    const { userID } = this.props.userInfo;
    this.props.onSaveEditNotePress(userID, note);
  };

  onCancelEditNotePress = () => {
    const { userID } = this.props.userInfo;
    this.props.onCancelEditNotePress(userID);
  };

  onClearEditNotePress = () => {
    this.setState({ note: '' });
  };

  onEditNotePress = () => {
    this.props.onEditNotePress(this.props.userInfo.userID);
  };

  onSwitchAccountPress = () => {
    this.props.onSwitchAccountPress(this.props.userData);
  };

  /*  PRIVATE
   */

  editState = (editingUserID, userID) => {
    if (editingUserID && editingUserID === userID) return EDIT_STATE.EDITING;
    if (editingUserID && editingUserID !== userID) return EDIT_STATE.BLUR;
    return EDIT_STATE.NONE;
  };

  /*  RENDER
   */

  renderAvartar = (fullName, avatar) => {
    return (
      <View style={{ width: 42, height: 42, marginRight: 10 }}>
        <CharAvatar defaultName={fullName} source={avatar ? { uri: avatar } : ''} />
      </View>
    );
  };

  renderFullName = (isCurrentUser, name) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText
          style={{
            height: 18,
            fontSize: 12,
            
            fontWeight: 'bold',
            lineHeight: 18,
            color: colors.primary4,
          }}
        >
          {name}
        </AppText>
        <TouchableOpacity onPress={this.onSwitchAccountPress}>
          {isCurrentUser ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppText
                style={{
                  
                  fontSize: 12,
                  letterSpacing: 0,
                  color: colors.primary2,
                  marginRight: 4,
                }}
              >
                {'Thông tin'}
              </AppText>
              <Image style={{ width: 16, heigth: 16 }} source={require('./img/ic_next.png')} />
            </View>
          ) : (
            <AppText
              style={{
                height: 16,
                
                fontSize: 13,
                fontWeight: '500',
                color: colors.primary2,
              }}
            >
              {'Chuyển tài khoản'}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  renderReferral = (referralName) => {
    return referralName ? (
      <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 8 }}>
        <AppText
          style={{
            height: 14,
            opacity: 0.6,
            
            fontSize: 12,
            color: colors.primary4,
          }}
        >
          {'Người giới thiệu: '}
        </AppText>
        <AppText
          style={{
            height: 14,
            
            fontSize: 12,
            letterSpacing: 0,
            color: colors.primary4,
          }}
        >
          {referralName}
        </AppText>
      </View>
    ) : (
      <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 8 }}>
        <AppText
          style={{
            height: 14,
            opacity: 0.6,
            
            fontSize: 12,
            color: colors.primary4,
          }}
        >
          {'Không có người giới thiệu'}
        </AppText>
      </View>
    );
  };

  renderNote = (note, onEditNotePress) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          style={{ marginRight: 8, width: 16, heigth: 16 }}
          source={require('./img/ic_info.png')}
        />
        {note ? (
          <View style={{ flex: 1 }}>
            <AppText
              style={{
                opacity: 0.8,
                
                fontSize: 12,
                letterSpacing: 0,
                color: colors.primary4,
                marginRight: 8,
              }}
              numberOfLines={0}
            >
              {note}
            </AppText>
          </View>
        ) : null}
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={onEditNotePress}
        >
          {note ? (
            <Image style={{ width: 16, heigth: 16 }} source={require('./img/ic_edit.png')} />
          ) : (
            <AppText
              style={{
                height: 14,
                
                fontSize: 12,
                letterSpacing: 0,
                color: colors.primary2,
              }}
            >
              {'Thêm ghi chú tài khoản'}
            </AppText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  renderEditingNote = (note) => {
    return (
      <View>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Image
            style={{ marginRight: 8, width: 16, heigth: 16 }}
            source={require('./img/ic_editing.png')}
          />
          <TextInput
            style={{
              flex: 1,
              
              fontSize: 14,
              marginRight: 8,
              color: colors.primary4,
            }}
            value={note}
            placeholder={'Nhập ghi chú'}
            onChangeText={this.onChangeNoteText}
            autoFocus
          />
          <TouchableOpacity
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            onPress={this.onClearEditNotePress}
          >
            <Image
              style={{ marginRight: 8, width: 16, heigth: 16 }}
              source={require('./img/ic_clear.png')}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            height: 1,
            marginBottom: 16,
            marginTop: 8,
            backgroundColor: colors.primary1,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 26,
            }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            onPress={this.onCancelEditNotePress}
          >
            <AppText
              style={{
                opacity: 0.8,
                
                fontSize: 14,
                letterSpacing: 0,
                color: colors.primary4,
              }}
            >
              {'Hủy'}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            onPress={this.onSaveEditNotePress}
          >
            <AppText
              style={{
                
                fontWeight: '500',
                fontSize: 14,
                letterSpacing: 0,
                color: colors.primary2,
              }}
            >
              {'Lưu ghi chú'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { editingUserID, userInfo } = this.props;
    const { isCurrentUser, fullName, avatar, referralName, userID } = userInfo;
    const { note } = this.state;

    const editingState = this.editState(editingUserID, userID);

    return (
      <View style={{ flex: 1, flexDirection: 'row', padding: 14, backgroundColor: '#fff' }}>
        {this.renderAvartar(fullName, avatar)}

        <View style={{ flex: 1 }}>
          {this.renderFullName(isCurrentUser, fullName)}
          {this.renderReferral(referralName)}

          {editingState === EDIT_STATE.EDITING
            ? this.renderEditingNote(note)
            : this.renderNote(note, this.onEditNotePress)}
        </View>

        {editingState === EDIT_STATE.BLUR ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fffa',
            }}
          />
        ) : null}
      </View>
    );
  }
}

export default UserRow;
