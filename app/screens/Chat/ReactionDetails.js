import React, { PureComponent } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  Image,
} from 'react-native';

import CharAvatar from '../../components/CharAvatar';
import { REACTION_IMAGE } from './ReactionView';
import AppText from '../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');
const AVATAR_SIZE = 34;
const ROW_HEIGHT = 34 + 12;
const REACTION_HEIGHT = 16;

class ReactionDetails extends PureComponent {

  renderDetailItem(item) {
    const name = item.name;
    const avatar = item.avatar;
    const reaction = item.reaction;
    return (
      <View
        style={{
          flexDirection: 'row',
          height: ROW_HEIGHT,
          alignItems: 'center',
        }}
        onStartShouldSetResponder={() => true}
      >
        <View>
          <CharAvatar
            avatarStyle={styles.avatarImage}
            source={avatar}
            defaultName={name}
          />
          <Image
            source={REACTION_IMAGE[reaction]}
            style={{ position: 'absolute', bottom: 0, right: 0, width: REACTION_HEIGHT, height: REACTION_HEIGHT }}
          />
        </View>
        <AppText style={{ marginLeft: 8 }}>
          {name}
        </AppText>
      </View>
    );
  }

  renderDetailList(items) {
    return (
      <FlatList
        initialNumToRender={5}
        data={items}
        keyExtractor={item => item.uid}
        renderItem={(row) => {
          return this.renderDetailItem(row.item);
        }}
      />
    );
  }

  render() {
    const { items, style } = this.props;
    return (
      <View
        style={[{
          width: SCREEN_SIZE.width * 0.9,
          height: (items.length * ROW_HEIGHT) + 8,
          maxHeight: SCREEN_SIZE.height * 0.4,
          backgroundColor: '#fff',
          paddingRight: 12,
          paddingLeft: 12,
          paddingTop: 4,
          paddingBottom: 4,
          borderRadius: 10,
          shadowOffset: { width: 0.0, height: 1 },
          shadowColor: '#808080',
          shadowOpacity: 0.5,
          shadowRadius: 1.0,
          elevation: 1,
        }, style]}
      >
        {this.renderDetailList(items)}
      </View>
    );
  }
}

export default ReactionDetails;

const styles = StyleSheet.create({
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
  },
});
