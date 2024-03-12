// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text,
  Dimensions,
} from 'react-native';

import CharAvatar from 'app/components/CharAvatar';
import colors from '../../constants/colors';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

const PHOTO_SIZE = 80;

type Props = {
  name: string,
  myName: string,
  avatar: string,
  myAvatar: string,
}

const _ = require('lodash');


class StartChatView extends Component<Props> {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    const {
      name,
      myName,
      avatar,
      myAvatar,
    } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CharAvatar
            avatarStyle={styles.myAvatar}
            source={myAvatar}
            defaultName={myName}
            textStyle={styles.charAvatarStyle}
          />
          <View style={{ left: -8 }}>
            <CharAvatar
              avatarStyle={styles.avatar}
              source={avatar}
              defaultName={name}
              textStyle={styles.charAvatarStyle}
            />
          </View>
        </View>
        <AppText style={styles.text}>
          <AppText style={styles.text}>Bạn và </AppText>
          <AppText style={[styles.text, { fontWeight: '800' }]}>{name}</AppText>
          <AppText style={styles.text}> đã kết nối với nhau</AppText>
        </AppText>
        <AppText style={styles.textStart}>
          Bắt đầu cuộc trò chuyện nào!
        </AppText>
      </View>
    );
  }
}

export default StartChatView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#0000',
    top: Dimensions.get('window').height * 0.1,
    // bottom: Dimensions.get('window').height - 300,
    left: 0,
    right: 0,
  },
  text: {
    alignSelf: 'center',
    marginTop: 16,
    fontSize: 13,
    fontWeight: '400',
    color: '#3338',
    backgroundColor: '#0000',
    textAlign: 'center',
  },
  textStart: {
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
    color: '#333a',
    backgroundColor: '#0000',
    textAlign: 'center',
  },
  myAvatar: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: colors.separator,
    backgroundColor: colors.separator,
    // left: 8,
    // marginLeft: 8,
  },
  avatar: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: colors.separator,
    backgroundColor: colors.separator,
    // marginRight: 8,
    // left: -8,
  },
  charAvatarStyle: {
    fontSize: 20,
    fontWeight: '500',
  },
});
