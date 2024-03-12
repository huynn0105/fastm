import { StyleSheet, View, Text, Dimensions } from 'react-native';
import React, { Component } from 'react';

import colors from '../../constants/colors';
import GridList from '../../components2/GridList';
import AppText from '../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');

class ToolsControl extends Component {
  onItemPress = (item) => {
    this.props.onItemPress(item);
  };

  renderTitle = (title) => (
    <View style={[styles.titleContainer]}>
      <AppText style={styles.titleText}>{title}</AppText>
    </View>
  );

  renderContent = (items) => {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <GridList maxRows={1000} title={''} items={items} onPressItem={this.onItemPress} />
      </View>
    );
  };

  render() {
    const { toolItems, hideTitle } = this.props;

    return (
      <View style={[styles.container]}>
        {!hideTitle ? this.renderTitle('Tiện ích') : null}
        {this.renderContent(toolItems)}
      </View>
    );
  }
}
export default ToolsControl;

const styles = StyleSheet.create({
  container: {
    paddingRight: 2,
    // paddingBottom: 2,
    backgroundColor: colors.navigation_bg,
    overflow: 'hidden',
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: 6,
    backgroundColor: colors.navigation_bg,
    marginBottom: 12,
    marginLeft: 14,
  },
  titleText: {
    flex: 1,
    fontSize: 14,
    paddingRight: 8,
    paddingBottom: 0,
    backgroundColor: '#0000',
    opacity: 0.8,
    letterSpacing: 0,
    color: '#24253d',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.navigation_bg,
    marginBottom: 0,
    height: SCREEN_SIZE.width * 0.325,
  },
  image: {
    marginBottom: 8,
    aspectRatio: 98 / 42,
    resizeMode: 'contain',
    width: SCREEN_SIZE.width / 3 - 16 * 2,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_SIZE.width / 3 - 1.5,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
});
