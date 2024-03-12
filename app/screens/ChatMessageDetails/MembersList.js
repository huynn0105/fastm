/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  SectionList,
} from 'react-native';

import PropTypes from 'prop-types';

import { User } from 'app/models';

import MemberCell from './MemberCell';

// --------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;

const SECTION_PADDING_SIDE = 12;
const SECTION_CONTENT_WIDTH = SCREEN_WIDTH - 8 - (SECTION_PADDING_SIDE * 2);

const IDEAL_CELL_HORZ_SPACING = 16;
const IDEAL_CELL_VERT_SPACING = 16;
const CELL_WIDTH = (SECTION_CONTENT_WIDTH - (2 * IDEAL_CELL_HORZ_SPACING)) / 6;
const CELL_HEIGHT = CELL_WIDTH;

const IDEAL_NUM_COLUMS = SECTION_CONTENT_WIDTH / (CELL_WIDTH + (IDEAL_CELL_HORZ_SPACING * 2));
const NUM_COLUMS = IDEAL_NUM_COLUMS < 5 ? IDEAL_NUM_COLUMS : 5;
const SECTION_SPACING = (SECTION_CONTENT_WIDTH - (NUM_COLUMS * CELL_WIDTH));
const CELL_HORZ_SPACING = SECTION_SPACING / (NUM_COLUMS - 1) / 2;
const CELL_VERT_SPACING = IDEAL_CELL_VERT_SPACING;

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'ChatMessageDetails/MembersList.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// MembersList
// --------------------------------------------------

class MembersList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onMemberPress = (user) => {
    this.props.onMemberPress(user);
  }
  // --------------------------------------------------
  renderSectionHeaderFunc = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.separator} />
        <Text style={styles.sectionHeaderTitle}>
          {section.title}
        </Text>
      </View>
    );
  }
  renderSectionFunc = (section) => {
    const data = section.item;
    return (
      <FlatList
        style={[
          styles.sectionContent,
          { paddingLeft: SECTION_PADDING_SIDE, paddingRight: SECTION_PADDING_SIDE },
        ]}
        numColumns={5}
        keyExtractor={item => item.uid}
        renderItem={this.renderCellFunc}
        data={data}
      />
    );
  }
  renderCellFunc = (item) => {
    const user = item.item;
    return (
      <MemberCell
        containerStyle={{
          width: CELL_WIDTH + CELL_HORZ_SPACING,
          height: CELL_HEIGHT + CELL_VERT_SPACING,
        }}
        imageStyle={{
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          borderRadius: CELL_WIDTH / 2.0,
        }}
        user={user}
        onPress={this.onMemberPress}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const { readMembers, unReadMembers, containerStyle } = this.props;
    const sections = [];
    if (unReadMembers.length > 0) {
      sections.push({ uid: 0, data: [unReadMembers], title: 'Đã nhận' });
    }
    if (readMembers.length > 0) {
      sections.push({ uid: 1, data: [readMembers], title: 'Đã xem' });
    }
    return (
      <View style={[styles.container, containerStyle]}>
        <SectionList
          keyExtractor={item => item.uid}
          renderSectionHeader={this.renderSectionHeaderFunc}
          renderItem={this.renderSectionFunc}
          sections={sections}
        />
      </View>
    );
  }
}

MemberCell.propTypes = {
  readMembers: PropTypes.arrayOf(User),
  unReadMembers: PropTypes.arrayOf(User),
  onMemberPress: PropTypes.func,
};

MembersList.defaultProps = {
  readMembers: [],
  unReadMembers: [],
  onMemberPress: () => { },
};

export default MembersList;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    backgroundColor: '#fff',
  },
  sectionHeaderTitle: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    color: '#7f7f7f',
    backgroundColor: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContent: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 0,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    marginLeft: 10,
    marginRight: 42,
    backgroundColor: '#F8F8F8',
  },
});
