import LottieView from 'lottie-react-native';
import React, { PureComponent } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SCREEN_SIZE = Dimensions.get('window');
const REACT_VIEW_WIDTH = SCREEN_SIZE.width - 64;

const REACTION_LIST_ID = ['like', 'love', 'haha', 'yay', 'wow', 'sad', 'angry'];

const REACTION_LIST = [
  require('./img/react_like.json'),
  require('./img/react_love.json'),
  require('./img/react_haha.json'),
  require('./img/react_yay.json'),
  require('./img/react_wow.json'),
  require('./img/react_sad.json'),
  require('./img/react_angry.json'),
];

export const REACTION_IMAGE = {
  like: require('./img/react_like_small.png'),
  love: require('./img/react_love_small.png'),
  haha: require('./img/react_haha_small.png'),
  yay: require('./img/react_yay_small.png'),
  wow: require('./img/react_wow_small.png'),
  sad: require('./img/react_sad_small.png'),
  angry: require('./img/react_angry_small.png'),
};

class ReactionView extends PureComponent {
  onItemPress = (index) => {
    if (this.props.onItemPress) {
      this.props.onItemPress(REACTION_LIST_ID[index]);
    }
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {REACTION_LIST.map((item, index) => (
          <Animatable.View animation={'bounceIn'}>
            <TouchableOpacity
              style={styles.reactionItem}
              onPress={() => {
                this.onItemPress(index);
              }}
              activeOpacity={0.2}
            >
              <LottieView style={styles.lottieView} source={item} autoPlay loop />
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    );
  }
}

export default ReactionView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: (40 / 280) * REACT_VIEW_WIDTH,
    width: REACT_VIEW_WIDTH,
    paddingRight: (4 / 280) * REACT_VIEW_WIDTH,
    paddingLeft: (4 / 280) * REACT_VIEW_WIDTH,
    marginLeft: (SCREEN_SIZE.width - REACT_VIEW_WIDTH) / 2,
    shadowOffset: { width: 0.0, height: 1 },
    shadowColor: '#808080',
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    borderRadius: (20 / 280) * REACT_VIEW_WIDTH,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
    marginTop: Platform.OS === 'ios' ? 0 : 4,
    marginRight: Platform.OS === 'ios' ? 0 : 4,
    elevation: 2,
  },
  reactionItem: {
    width: (28 / 280) * REACT_VIEW_WIDTH,
    height: (28 / 280) * REACT_VIEW_WIDTH,
    marginLeft: (5 / 280) * REACT_VIEW_WIDTH,
    marginRight: (5 / 280) * REACT_VIEW_WIDTH,
  },
  lottieView: {
    flex: 1,
    shadowOffset: { width: 0.0, height: 0.5 },
    shadowColor: '#808080',
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
  },
});
