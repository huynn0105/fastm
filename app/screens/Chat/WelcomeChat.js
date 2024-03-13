import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { STATE_CONTACTS } from '.';
import AppText from '../../componentV3/AppText';
import CharAvatar from '../../componentV3/CharAvatar';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const WelcomeChat = memo(
  ({
    members,
    isShow,
    state,
    recipient,
    onCancel,
    onConfirm,
    isDistinct,
    avatarGroup,
    titleGroup,
  }) => {
    const renderString = useCallback(() => {
      switch (state) {
        case STATE_CONTACTS.FRIEND:
          return (
            <AppText
              style={{
                color: Colors.gray2,
                fontSize: SH(16),
                lineHeight: SH(22),
                textAlign: 'center',
                marginTop: SH(16),
              }}
            >
              {!isDistinct
                ? `Tạo nhóm thành công. Giờ đây các bạn đã\ncó thể trò chuyện với nhau trên MFast`
                : `Kết bạn thành công. Giờ đây 2 bạn đã có thể\ntrò chuyện với nhau trên MFast`}
            </AppText>
          );
        case STATE_CONTACTS.SENDING_REQUEST:
          return (
            <AppText
              style={{
                color: Colors.gray2,
                fontSize: SH(16),
                lineHeight: SH(22),
                textAlign: 'center',
                marginTop: SH(16),
              }}
            >
              {`Đã gửi lời mới kết bạn đến `}
              <AppText
                semiBold
                style={{ color: Colors.gray1, fontSize: SH(16), lineHeight: SH(22) }}
              >
                {recipient?.fullName}
              </AppText>
            </AppText>
          );
        case STATE_CONTACTS.INVITATION:
          return (
            <AppText
              style={{
                color: Colors.gray2,
                fontSize: SH(16),
                lineHeight: SH(22),
                textAlign: 'center',
                marginTop: SH(16),
              }}
            >
              <AppText
                semiBold
                style={{ color: Colors.gray1, fontSize: SH(16), lineHeight: SH(22) }}
              >
                {recipient?.fullName}
              </AppText>
              {` đã gửi lời mới kết bạn`}
            </AppText>
          );
      }
    }, [recipient?.fullName, state]);

    const renderConfirmButton = useCallback(() => {
      if (state !== STATE_CONTACTS.INVITATION) {
        return null;
      }

      return (
        <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              borderWidth: SW(1),
              borderColor: Colors.gray2,
              borderRadius: SW(26),
              paddingHorizontal: SW(28),
              paddingVertical: SW(12),
              marginRight: SW(12),
            }}
          >
            <AppText style={{ fontSize: SH(16), top: SH(1), color: Colors.gray2 }}>Từ chối</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={{
              borderWidth: SW(1),
              borderColor: Colors.action,
              borderRadius: SW(26),
              paddingHorizontal: SW(28),
              paddingVertical: SW(12),
              backgroundColor: Colors.action,
            }}
          >
            <AppText style={{ fontSize: SH(16), top: SH(1), color: Colors.primary5 }}>
              Chấp nhận
            </AppText>
          </TouchableOpacity>
        </View>
      );
    }, [onCancel, onConfirm, state]);

    const renderAvatar = useCallback(() => {
      if (!isDistinct || state !== STATE_CONTACTS.FRIEND) {
        return (
          <CharAvatar
            source={{ uri: !isDistinct ? avatarGroup : recipient?.plainProfileUrl || '' }}
            style={{
              width: SW(100),
              height: SW(100),
              borderRadius: SW(50),
            }}
            defaultName={!isDistinct ? titleGroup : recipient?.fullName}
            textStyle={{ fontSize: SH(30) }}
          />
        );
      } else {
        return (
          <View style={{ width: SW(170), height: SW(100), flexDirection: 'row' }}>
            {members?.map((member, index) => {
              return (
                <View style={{ position: 'absolute', left: index === 0 ? SW(70) : 0 }}>
                  <CharAvatar
                    source={{ uri: member?.plainProfileUrl || '' }}
                    style={{
                      width: SW(100),
                      height: SW(100),
                      borderRadius: SW(50),
                    }}
                    defaultName={member?.fullName}
                    textStyle={{ fontSize: SH(30) }}
                  />
                </View>
              );
            })}
          </View>
        );
      }
    }, [
      avatarGroup,
      isDistinct,
      members,
      recipient?.fullName,
      recipient?.plainProfileUrl,
      state,
      titleGroup,
    ]);

    if (!isShow) {
      return null;
    }

    return (
      <View style={{ alignItems: 'center', marginTop: SH(40) }}>
        {renderAvatar()}
        {renderString()}
        {renderConfirmButton()}
      </View>
    );
  },
);

export default WelcomeChat;

const styles = StyleSheet.create({});
