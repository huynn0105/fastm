import { View, Text, Image, ScrollView } from 'react-native';
import React from 'react';

import { unixTimeToDateString, SCREEN_WIDTH, SCREEN_HEIGHT } from '../../utils/Utils';
import CharAvatar from '../CharAvatar';
import colors from '../../theme/Color';
import Popup from '../Popup';
import AppText from '../../componentV3/AppText';

import {IMAGE_PATH, ICON_PATH} from '../../assets/path';

export const PopupExistingUser = ({ users, phone, handleRef, yesCallback, noCallback }) => {
  return (
    <Popup
      ref={handleRef}
      style={{ width: SCREEN_WIDTH * 0.9 }}
      cancelText={'Đổi số điện thoại'}
      renderContent={() => {
        return (
          <View style={{ justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{ width: 160, height: 122, marginTop: 16, marginBottom: 24 }}
                source={IMAGE_PATH.im_caution}
              />
            </View>
            <AppText
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: `${colors.primary4}bb`
              }}
            >
              {'Số điện thoại '}
              <AppText style={{ fontWeight: '600', color: '#000' }}>{phone}</AppText>
              {' đã được\nđăng kí trước đó bởi:'}
            </AppText>
            <View
              style={{
                margin: 16,
                maxHeight: SCREEN_HEIGHT * 0.4,
                borderRadius: 6,
              }}
            >
              <ScrollView>
                {users.map((user) => {
                  const { fullName, avatarImage, createTime, accountNote } = user;
                  return renderUserRow(fullName, avatarImage, createTime, accountNote);
                })}
              </ScrollView>
            </View>
            <AppText
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: `${colors.primary4}66`
              }}
            >
              {'Liên hệ trung tâm hỗ trợ MFast '}
              <AppText style={{ fontWeight: '600', color: colors.primary2 }}>{'08999.09789\n'}</AppText>
              {' nếu phát hiện có sai phạm'}
            </AppText>
          </View>
        );
      }}
      content={users}
      onYesPress={yesCallback}
      onCancelPress={noCallback}
    />
  );
};

function renderUserRow(fullName, avatarImage, createTime, accountNote) {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        justifyContent: 'center',
        backgroundColor: '#eeeeee88'
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
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: '#eee'
        }}
      />
    </View>
  );
}
