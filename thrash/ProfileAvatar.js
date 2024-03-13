import React, { } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

import KJRoundedImage from './KJRoundedImage';

const ProfileAvatar = (props) => (
  <View
    style={{
      flex: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 4,
      paddingBottom: 12,
      backgroundColor: '#f000',
    }}
  >

    <TouchableHighlight
      style={{ width: 64, height: 64, borderRadius: 32 }}
      underlayColor="#39B5FC20"
      onPress={() => {
        if (props.onAvatarPress !== undefined) {
          props.onAvatarPress();
        }
      }}
    >
      <View>
        <KJRoundedImage
          imageStyle={{ width: 64, height: 64, borderRadius: 32, resizeMode: 'cover' }}
          backgroundStyle={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' }}
          source={props.avatar}
        />
      </View>
    </TouchableHighlight>

    <Text
      style={{
        marginTop: 8,
        backgroundColor: '#0000',
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
    >
      {props.name}
    </Text>
  </View>
);

export default ProfileAvatar;
