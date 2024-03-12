/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * TODO:
 * - animation selected category, the indicator will transit smoothly
 * - optimize emoji render: change to horizontal scrollview like facebook
 * - optimize keyboard/emoji switch smoother
 */

import React, { Component } from 'react';
import { StyleSheet, Platform, Dimensions, View, ScrollView } from 'react-native';

import { EMOJI_CATEGORIES } from 'app/components/EmojiPicker/Toolbar';

import EmojiDataSource from './DataSource';
import EmojiView from './EmojiView';
import Toolbar from './Toolbar';

import StickerView from './StickerView';

// --------------------------------------------------

const SCREEN_SIZE = Dimensions.get('window');

const EMOJI_IDEAL_PADDING = 0.5;
const EMOJIS_CONTAINER_PADDING = 4;
const CONTAINER_WIDTH = SCREEN_SIZE.width - EMOJIS_CONTAINER_PADDING * 2;

const EMOJI_SIZE = Platform.OS === 'ios' ? 40 : 36;
const EMOJI_FONT_SIZE = EMOJI_SIZE * 0.75;

const EMOJI_BUTTON_SIZE = EMOJI_SIZE + EMOJI_IDEAL_PADDING * 2;
const EMOJIS_COLUMS = Math.floor(CONTAINER_WIDTH / EMOJI_BUTTON_SIZE);
const EMOJI_PADDING = (CONTAINER_WIDTH - EMOJIS_COLUMS * EMOJI_SIZE - 2) / EMOJIS_COLUMS / 2;

const _ = require('lodash');

// --------------------------------------------------
// EmojiPicker
// --------------------------------------------------

class EmojiPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: EMOJI_CATEGORIES.people,
    };
  }
  componentDidMount() {
    // log categories
    // const categories = Object.keys(EmojiDataSource);
    // for (let i = 0; i < categories.length; i += 1) {
    //   console.log(`EmojiPicker.category: ${categories[i]}`);
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------

  onStickerPress = (uid) => {
    if (this.props.onStickerPressed) {
      this.props.onStickerPressed(uid);
    }
  };

  onCategorySelected = (category) => {
    // console.log(`EmojiPicker.onCategorySelected: ${category.name}`);
    const selectedCategory = category;
    this.setState({
      selectedCategory,
    });
  };
  onKeyboardSelected = () => {
    // console.log(`EmojiPicker.onKeyboardSelected: `);
    this.props.onKeyboardSelected();
  };
  onEmojiSelected = (emoji) => {
    // console.log(`EmojiPicker.onEmojiSelected: ${emoji}`);
    this.props.onEmojiSelected(emoji);
  };
  onDeletePressed = () => {
    this.props.onDeletePressed();
  };
  // --------------------------------------------------
  renderToolbar() {
    const categories = ['people', 'dog', 'cat', 'pig', 'money'];
    const selectedCategory = this.state.selectedCategory;
    return (
      <Toolbar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelected={this.onCategorySelected}
        onKeyboardSelected={this.onKeyboardSelected}
        onDeletePressed={this.onDeletePressed}
      />
    );
  }

  renderEmojis() {
    const category = this.state.selectedCategory;
    if (category.type === 'people') {
      return this.renderEmoijUnicode(category.name);
    }
    return this.renderSticker(category);
  }
  renderEmoijUnicode = (category) => {
    const emojis = EmojiDataSource[category];
    return (
      <ScrollView style={styles.emojisScrollView}>
        <View style={styles.emojisContainer}>
          {emojis.map((emoji) => (
            <EmojiView
              emojiSize={EMOJI_SIZE}
              emojiFontSize={EMOJI_FONT_SIZE}
              emojiPadding={EMOJI_PADDING}
              key={emoji.char}
              emoji={emoji.char}
              onPress={this.onEmojiSelected}
            />
          ))}
        </View>
      </ScrollView>
    );
  };
  renderSticker = (category) => {
    const dataSource = category.data;
    return (
      <ScrollView style={styles.emojisScrollView}>
        <View style={styles.emojisContainer}>
          {dataSource.map((data) => (
            <StickerView data={data} onPress={this.onStickerPress} />
          ))}
        </View>
      </ScrollView>
    );
  };
  render() {
    const { style, isSeparatorHidden, toolbarPosition } = this.props;
    return (
      <View style={[styles.container, style]}>
        {!isSeparatorHidden ? <View style={styles.seperator} /> : null}
        {toolbarPosition === 'top' ? this.renderToolbar() : null}
        {this.renderEmojis()}
        {toolbarPosition !== 'top' ? this.renderToolbar() : null}
      </View>
    );
  }
}

EmojiPicker.defaultProps = {
  isSeparatorHidden: true,
  toolbarPosition: 'bottom',
  onEmojiSelected: () => {},
  onKeyboardSelected: () => {},
};

export default EmojiPicker;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: null,
    height: 216,
    backgroundColor: '#F7F7F7',
    paddingBottom: 0,
  },
  categoryName: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 8,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '400',
    color: '#7f7f7f',
    backgroundColor: '#0000',
  },
  emojisScrollView: {
    flex: 1,
    padding: 0,
  },
  emojisContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: EMOJIS_CONTAINER_PADDING,
    paddingRight: EMOJIS_CONTAINER_PADDING,
  },
  seperator: {
    height: 1,
    backgroundColor: '#EAEAEA',
  },
});
