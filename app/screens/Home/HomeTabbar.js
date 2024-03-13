import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

export const TABS = {
  GENERAL: 0,
  SHOP: 1,
  KNOWLEDGE: 2,
  NEWS: 3,
};

class HomeTabbar extends Component {

  selectedIndex = -1;
  movingView = false;

  state = {
    leftPositionOfSelectedView: new Animated.Value(0),
    scaleXOfSelectedView: new Animated.Value(1),
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onTabTapped = (tab) => {
    if (this.movingView === true) {
      return;
    }
    this.movingView = true;
    this.selectTab(tab);
    setTimeout(() => {
      this.movingView = false;
      this.props.onTabTapped(tab);
    }, 0);
  }

  calLeftPositionForIndex = (index) => {
    const numOfBtn = 4;
    const widthOfSelectedView = 0.2 * SCREEN_SIZE.width;
    return (SCREEN_SIZE.width * 0.2) / (numOfBtn * 2) * (index * 2 + 1) + widthOfSelectedView * index;
  }

  movingSelectedView(left, tab) {
    const scaleX = 1 + ((Math.abs(this.selectedIndex - tab)) / 3);

    Animated.parallel([
      Animated.timing(this.state.leftPositionOfSelectedView, {
        toValue: left,
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(this.state.scaleXOfSelectedView, {
          toValue: scaleX,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.scaleXOfSelectedView, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }
  selectTab = (tab) => {
    const left = this.calLeftPositionForIndex(tab);
    this.movingSelectedView(left, tab);
    this.selectedIndex = tab;
  }

  renderButton = (imgPath, title, tag, imageStyle = {}, selected) => {
    const testID = `test_home_tab_${tag}`;
    return (
      <TouchableOpacity testID={testID} style={styles.touchable} onPressIn={() => { this.onTabTapped(tag); }}>
        <View style={[styles.button, selected ? {} : { opacity: 1 }]}>
          <View style={styles.imageContainter}>
            <Image source={imgPath} style={[styles.image, imageStyle]} />
          </View>
          <Text style={[styles.title, selected ? { fontWeight: '600' } : {}]}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {

    const { style, selectedIndex } = this.props;

    if (selectedIndex !== this.selectedIndex) {
      this.selectTab(selectedIndex);
    }

    return (
      <Animated.View style={[styles.container, style]}>
        <Animatable.View
          style={styles.buttonContainer}
          animation="fadeIn"
          duration={1000}
          useNativeDriver
        >
          {this.renderButton(
            require('./img/home.png'),
            'Tổng quan',
            TABS.GENERAL,
            {},
            this.selectedIndex === TABS.GENERAL,
          )}
          {this.renderButton(
            require('./img/shop.png'),
            'Mua sắm',
            TABS.SHOP,
            { height: 32 },
            this.selectedIndex === TABS.SHOP,
          )}
          {this.renderButton(
            require('./img/doc.png'),
            'Kiến thức',
            TABS.KNOWLEDGE,
            {},
            this.selectedIndex === TABS.KNOWLEDGE,
          )}
          {this.renderButton(
            require('./img/news.png'),
            'Tin tức',
            TABS.NEWS,
            {},
            this.selectedIndex === TABS.NEWS,
          )}
        </Animatable.View>
        <Animated.View
          style={[styles.selectedView, {
            transform: [{
              translateX: this.state.leftPositionOfSelectedView
            }, {
              scaleX: this.state.scaleXOfSelectedView
            }]
          }]}
        />
      </Animated.View>
    );
  }
}

HomeTabbar.contextTypes = {
  onTabTapped: PropTypes.func,
};

export default HomeTabbar;

const styles = StyleSheet.create({
  container: {
    marginTop: -64,
    flex: 0,
    height: 64,
    paddingBottom: 4,
  },
  buttonContainer: {
    height: 58,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  touchable: {
    flex: 0.25,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // backgroundColor: 'red',
  },
  imageContainter: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  image: {
    resizeMode: 'contain',
    height: 28,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    flex: Platform.OS === 'ios' ? 0.8 : 0.9,
  },
  selectedView: {
    marginTop: 4,
    height: 1,
    width: '20%',
    backgroundColor: '#fff',
  },
});
