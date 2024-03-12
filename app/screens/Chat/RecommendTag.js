
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import CharAvatar from '../../components/CharAvatar';
import AppText from '../../componentV3/AppText';

const AVATAR_SIZE = 32;

class RecommendTag extends Component {
  onPress = (user) => {
    if (this.props.onPress) {
      setTimeout(() => {
        this.props.onPress(user);
      });
    }
  }
  renderUser = (user) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginLeft: 8,
          marginBottom: 6,
          marginTop: 2,
          marginRight: 8,
          alignItems: 'center',
        }}
        onPress={() => this.onPress(user)}
      >
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={user.avatarImageURI()}
          defaultName={user.fullName}
        />
        <View stlye={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <AppText style={{
            marginLeft: 8,
          }}
          >
            {user.fullName}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
  renderUserList = () => {
    const { users } = this.props;
    return (
      <FlatList
        data={users}
        keyExtractor={item => item.uid}
        keyboardShouldPersistTaps="always"
        renderItem={(row) => {
          return this.renderUser(row.item);
        }}
      />
    );
  }
  render() {
    return (
      <View
        style={{
          maxHeight: 200,
          width: '100%',
        }}
      >
        {
          this.renderUserList()
        }
      </View>
    );
  }
}

export default RecommendTag;

const styles = StyleSheet.create({
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
});
