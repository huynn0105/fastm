// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';

import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import KJImage from 'app/components/common/KJImage';
import Promotion from '../../models/Promotion';

const _ = require('lodash');

class PromotionControl extends Component<Props, States> {

  state = {
    opacityValue: new Animated.Value(0),
    scaleValue: new Animated.Value(0),
    translateX: new Animated.Value(200),
  }

  componentDidMount() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.opacityValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.scaleValue, {
          toValue: 1,
          easing: Easing.out(Easing.ease),
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.translateX, {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.promotion);
  }

  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container} testID="promotion_control" >
        <KJTouchableOpacity
          activeOpacity={0.85}
          onPress={this.onPress}
        >
        <Animated.Image
          style={{
            width: 246,
            height: 76,
            transform: [{
              scaleX: this.state.scaleValue,
            }, {
              scaleY: this.state.scaleValue,
            }, {
              translateX: this.state.translateX,
            },
            ],
          }}
          source={this.props.promotion.imageGifURI()}
          resizeMode="contain"
        />
        </KJTouchableOpacity>
        <KJTouchableOpacity
          activeOpacity={0.85}
          onPress={this.onPress}
        >
          {
            <KJImage
              style={{
                width: 76,
                height: 76,
                top: 2,
              }}
              source={this.props.promotion.imageURI()}
              resizeMode="contain"
            />
          }
        </KJTouchableOpacity>
      </View>
    );
  }
}

type Props = {
  promotion: Promotion,
  onPress: (promotion: Promotion) => void
}
type States = {
  opacityValue: Animated,
  scaleValue: Animated,
  translateX: Animated,
}

// --------------------------------------------------

export default PromotionControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 16,
    right: 6,
  },
});
