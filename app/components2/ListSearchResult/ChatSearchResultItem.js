import React, { PureComponent } from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import CharAvatar from '../../components/CharAvatar';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import User from '../../models/User';
import AppText from '../../componentV3/AppText';
class ChatSearchResultItem extends PureComponent {
  onItemPress = () => {
    this.props.onItemPress({ ...this.props });
  };

  render() {
    const { photo, name } = this.props;

    return (
      <TouchableHighlight
        underlayColor={`${Colors.neutral6}99`}
        onPress={this.onItemPress}
        style={this.props.style}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CharAvatar avatarStyle={styles.photoImage} source={photo} defaultName={name} />
          <AppText style={{ marginLeft: 14, ...TextStyles.heading4, fontWeight: 'bold' }}>{name}</AppText>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  photoImage: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff'
  }
});

export default ChatSearchResultItem;
