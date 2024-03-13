/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import { STICKER_DOG, STICKER_CAT, STICKER_PIG, STICKER_MONEY } from './StickerDataSource';
import AppText from '../../componentV3/AppText';

// --------------------------------------------------

const EMOJI_SIZE = Platform.OS === 'ios' ? 32 : 28;
const EMOJI_FONT_SIZE = EMOJI_SIZE / 4 * 3;
const PATH = `../../assets/emoji`;

export const EMOJI_CATEGORIES = {
  history: {
    type: 'history',
    symbol: '🕘',
    name: 'Recently used',
  },
  people: {
    type: 'people',
    symbol: '😊',
    name: 'Smileys & People',
  },
  dog: {
    icon: require(`${PATH}/dog_ic.png`),
    name: 'dog',
    data: STICKER_DOG,
  },
  cat: {
    icon: require(`${PATH}/cat_ic.png`),
    name: 'cat',
    data: STICKER_CAT,
  },
  pig: {
    icon: require(`${PATH}/pig_ic.png`),
    name: 'pig',
    data: STICKER_PIG,
  },
  money: {
    icon: require(`${PATH}/money_ic.png`),
    name: 'money',
    data: STICKER_MONEY,
  },
  nature: {
    type: 'nature',
    symbol: '🐶',
    name: 'Animals & Nature',
  },
  food: {
    type: 'food',
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    type: 'activities',
    symbol: '⚾️',
    name: 'Activities',
  },
  places: {
    type: 'places',
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    type: 'objects',
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    type: 'symbols',
    symbol: '❤️',
    name: 'Symbols',
  },
  flags: {
    type: 'flags',
    symbol: '🚩',
    name: 'Flags',
  },
};

const _ = require('lodash');

// --------------------------------------------------
// Toolbar
// --------------------------------------------------

class Toolbar extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onCategoryPress = (category) => {
    this.props.onCategorySelected(category);
  }
  onKeyboardSelected = () => {
    this.props.onKeyboardSelected();
  }
  onDeletePressed = () => {
    this.props.onDeletePressed();
  }
  // --------------------------------------------------
  renderKeyboardButton() {
    return (
      <TouchableOpacity
        style={styles.keyboardButton}
        activeOpacity={0.5}
        onPress={() => this.onKeyboardSelected()}
      >
        <AppText
          style={styles.keyboardButtonTitle}
        >
          {'Aa'}
        </AppText>
      </TouchableOpacity>
    );
  }
  renderDeleteButton() {
    return (
      <TouchableOpacity
        style={styles.keyboardButton}
        activeOpacity={0.5}
        onPress={() => this.onDeletePressed()}
      >
        <AppText
          style={[styles.keyboardButtonTitle, { fontSize: 18 }]}
        >
          {' ⌫ '}
        </AppText>
      </TouchableOpacity>
    );
  }
  renderEmojiCategory(category) {
    const isSelected = category.name === this.props.selectedCategory.name;
    return (
      <TouchableOpacity
        key={category.type}
        style={styles.emojiButton}
        activeOpacity={0.5}
        onPress={() => this.onCategoryPress(category)}
      >
        <AppText
          style={styles.emojiText}
        >
          {category.symbol}
        </AppText>
        {isSelected ? <View style={styles.indicator} /> : null}
      </TouchableOpacity>
    );
  }
  renderStickerCategory = (category) => {
    const isSelected = category.name === this.props.selectedCategory.name;
    return (
      <TouchableOpacity
        key={category.type}
        style={styles.emojiButton}
        activeOpacity={0.5}
        onPress={() => this.onCategoryPress(category)}
      >
        <Image
          style={{
            width: 30,
            height: 34,
          }}
          source={category.icon}
        />
        {isSelected ? <View style={styles.indicator} /> : null}
      </TouchableOpacity>
    );
  }
  render() {
    const {
      categories,
      isTopSeparatorHidden,
      isBottomSeparatorHidden,
    } = this.props;
    return (
      <View style={styles.container}>
        {!isTopSeparatorHidden ? <View style={styles.seperator} /> : null}
        <View style={styles.rowContainer}>
          {this.renderKeyboardButton()}
          <ScrollView
            style={styles.categoriesScrollView}
            horizontal
          >
            <View style={styles.categoriesContainer}>
              {
                categories.map(key => {
                  const category = EMOJI_CATEGORIES[key];
                  if (key === 'people') {
                    return this.renderEmojiCategory(category);
                  }
                  return this.renderStickerCategory(category);
                })
              }
            </View>
          </ScrollView>
          {this.renderDeleteButton()}
        </View>
        {!isBottomSeparatorHidden ? <View style={styles.seperator} /> : null}
      </View>
    );
  }
}

Toolbar.defaultProps = {
  categories: [],
  selectedCategory: '',
  isTopSeparatorHidden: false,
  isBottomSeparatorHidden: false,
  onCategorySelected: () => { },
  onKeyboardSelected: () => { },
};

export default Toolbar;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: '#0000',
  },
  categoriesScrollView: {
    flex: 1,
    backgroundColor: '#0000',
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  emojiButton: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  emojiText: {
    width: EMOJI_SIZE,
    height: null,
    fontSize: EMOJI_FONT_SIZE * 1.2,
    textAlign: 'center',
    opacity: 1.0,
    color: '#000',
    backgroundColor: '#0000',
  },
  keyboardButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
  },
  keyboardButtonTitle: {
    width: null,
    height: null,
    fontSize: 22,
    opacity: 1.0,
    color: '#808080',
    fontWeight: '300',
    backgroundColor: '#0000',
  },
  indicator: {
    position: 'absolute',
    left: 2,
    right: 2,
    bottom: 0,
    height: 1.5,
    backgroundColor: '#00A0F3',
  },
  seperator: {
    height: 1,
    backgroundColor: '#EAEAEA',
  },
});
