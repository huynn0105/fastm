'use strict';

import React, { } from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';

import AppText from '../componentV3/AppText';

const ProfileScoreInfo = (props) => (
  <View
    style={{
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: '#fff0',
    }}
  >

    <View style={{ width: 18 }} />

    <ProfileScoreButton
      icon={props.button1Icon}
      title={props.myUser.totalMoney}
      subTitle='VND'
      actionTitle='  Rút tiền >'
      actionTitleStyle={{ color: '#0E94E0' }}
      onActionPress={() => {
        props.onButton1Press();
      }}
    />

    <View style={{ width: 16 }} />

    <ProfileScoreButton
      icon={props.button2Icon}
      title={props.myUser.totalPoint}
      subTitle='Điểm'
      actionTitle='  Đổi quà >'
      actionTitleStyle={{ color: '#0E94E0' }}
      onActionPress={() => {
        props.onButton2Press();
      }}
    />

    <View style={{ width: 18 }} />

  </View>
);

const ProfileScoreButton = (props) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 12,
      backgroundColor: '#fefefe',
      borderColor: '#f0f0f0',
      borderWidth: 0.25,
      borderRadius: 4.0,
      elevation: 4,
      shadowColor: '#202020',
      shadowOffset: { width: 0, height: 0.25 },
      shadowOpacity: 0.35,
      shadowRadius: 1,
    }}
  >

    <Image
      style={{ width: '28%', marginTop: 2 }}
      source={props.icon}
      resizeMode='contain'
    />

    <AppText
      style={{ marginTop: 8 }}
    >
      <AppText style={{ fontWeight: '600' }}>
        {`${props.title} `}
      </AppText>
      <AppText style={{ fontWeight: '300' }}>
        {`${props.subTitle}`}
      </AppText>
    </AppText>

    <AppText
      style={[props.actionTitleStyle, { marginTop: 8, marginBottom: 0 }]}
      onPress={() => props.onActionPress()}
    >
      {props.actionTitle}
    </AppText>

  </View>
);

export default ProfileScoreInfo;
