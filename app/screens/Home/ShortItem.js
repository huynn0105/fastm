import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import KJImage from 'app/components/common/KJImage';

class ShortItem extends PureComponent {

  render() {
    const {
      itemData,
      imageUrl,
      title,
      onPress,
      isUnread,
    } = this.props;

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => onPress(itemData)}>
          <View style={{ alignItems: 'center' }}>
            <KJImage
              style={{
                width: 64,
                height: 78,
                marginBottom: 8,
              }}
              source={imageUrl}
            />
            <Text numberOfLines={4} style={isUnread ? styles.hilightTitle : styles.title}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ShortItem;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    // justifyContent: 'center',
    width: '32%',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: '#fff',
  },
  hilightTitle: {
    fontWeight: '800',
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'center',
  }
});