import React, { PureComponent } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';



export default class Card extends PureComponent {
  render() {
    const {
      image,
      text,
      onPress,
    } = this.props;
    return (
      <TouchableOpacity style={{ ...styles.container }} activeOpacity={0.2} onPress={onPress}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image style={styles.image} source={image} resizeMode={'contain'} />
        </View>
        <View style={{ marginTop: 10 }}>
          <HTML html={text} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    backgroundColor: 'white',
    shadowRadius: 5,
    shadowOpacity: 0.125,
    elevation: 2,
    margin: 8,
    padding: 10,
    borderRadius: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 120.0 / 90.0,
    width: '90%',
    height: undefined,
  },
});
