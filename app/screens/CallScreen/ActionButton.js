// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AppText from '../../componentV3/AppText';

type Props = {
  active: boolean,
  selected: boolean,
  type: $Values<typeof ACTION_TYPE>,
  onPress: Function,
  transfrom: any,
  showTitleActionButton: boolean,
}

export const ACTION_TYPE = {
  MUTE: {
    img: require('./img/mute.png'),
    imgSelected: require('./img/mute_selected.png'),
    title: 'Tắt tiếng',
    titleSelected: 'Đang tắt tiếng',
  },
  END_CALL: {
    img: require('./img/cancel.png'),
    imgSelected: require('./img/cancel.png'),
    title: 'Huỷ',
    titleSelected: 'Huỷ',
  },
  SPEAKER: {
    img: require('./img/speaker.png'),
    imgSelected: require('./img/speaker_selected.png'),
    title: 'Mở loa',
    titleSelected: 'Đang mở loa',
  },
  KEYPAD: {
    img: require('./img/keypad.png'),
    imgSelected: require('./img/keypad.png'),
    title: 'Bàn phím',
    titleSelected: 'Bàn phím',
  },
  BACK_KEYPAD: {
    img: require('./img/backKeypad.png'),
    imgSelected: require('./img/backKeypad.png'),
    title: 'Quay lại',
    titleSelected: 'Quay lại',
  },
};

const _ = require('lodash');

export default class ActionButton extends Component<Props> {
  static defaultProps = {
    transfrom: {},
    showTitleActionButton: true,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }


  onPress = () => {
    return this.props.onPress(!this.props.selected);
  }

  render() {
    const { active, selected, type, showTitleActionButton } = this.props;
    return (
      active ?
        <View style={styles.container}>
          <TouchableOpacity style={{ flex: 1 }} onPress={this.onPress}>
            <Animated.Image
              style={[styles.button, this.props.transfrom]}
              source={selected ? type.imgSelected : type.img}
            />
            <AppText style={[styles.title, {
              opacity: showTitleActionButton ? 1 : 0,
            }]}
            >
              {selected ? type.titleSelected : type.title}
            </AppText>
          </TouchableOpacity>
        </View>
        :
        <View style={[styles.container, styles.inactive]}>
          <Animated.Image
            style={styles.button}
            source={selected ? type.imgSelected : type.img}
          />
          <AppText style={styles.title}>
            {selected ? type.titleSelected : type.title}
          </AppText>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inactive: {
    opacity: 0.5,
  },
  button: {
    marginLeft: 18,
    marginRight: 18,
    width: 66,
    height: 66,
  },
  title: {
    fontSize: 12,
    color: '#3338',
    textAlign: 'center',
    marginTop: 8,
  },
});
