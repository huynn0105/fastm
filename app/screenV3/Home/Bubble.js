import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { SH } from '../../constants/styles';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    bottom: BOTTOM_BAR_HEIGHT + SH(64),
    right: 16,
  },
  img: {
    width: 96,
    height: 96,
  },
  closeWraper: {
    position: 'absolute',
    top: -10,
    right: 0,
  },
  close: {
    width: 24,
    height: 24,
  },
});

class Bubble extends PureComponent {
  render() {
    const { data, isShowBubble, onHideBubble, onBubblePress } = this.props;
    if (!data || (data && !isShowBubble)) return <View />;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBubblePress}>
          <Image source={{ uri: data?.image_url }} style={styles.img} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeWraper} onPress={onHideBubble}>
          <Image source={require('./img/ic_close2.png')} style={styles.close} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Bubble;
