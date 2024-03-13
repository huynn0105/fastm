import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';

// Component's dimensions
const CONTAINER_WIDTH = SCREEN_WIDTH / 3.5;
export const CONTAINER_HEIGHT = SCREEN_WIDTH / 5.06;
const TEXT_FONT_SIZE = CONTAINER_WIDTH / 7.57;
const CONTAINER_MARGIN_RIGHT = CONTAINER_WIDTH / 10.6;
const CONTAINER_PADDING_TOP = CONTAINER_WIDTH / 10.5;
export const CONTAINER_PADDING_BOTTOM = CONTAINER_WIDTH / 7.5;

import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';

// Component's icons
const uncheckedIcon = ICON_PATH.checkbox_round;
const checkedIcon = ICON_PATH.checkbox_ac;
const bottomArrowIcon = IMAGE_PATH.view_rect;

export const STATUS = {
  none: 'none',
  selected: 'selected',
  highlighted: 'highlighted',
};

// Styling
const STATUS_STYLE = {
  [STATUS.none]: {
    labelSelectedStyle: { opacity: 0.6, fontFamily: 'MFastVN-Regular' },
    itemIconStyle: { opacity: 0.6 },
    selectedIconSource: uncheckedIcon,
  },
  [STATUS.selected]: {
    labelSelectedStyle: { opacity: 1, fontFamily: 'MFastVN-Bold' },
    itemIconStyle: { opacity: 1 },
    containerShadow: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowRadius: 64,
      shadowOpacity: 1,
      elevation: 4,
    },
    selectedIconSource: checkedIcon,
  },
  [STATUS.highlighted]: {
    labelSelectedStyle: { opacity: 1, fontWeight: 'normal' },
    itemIconStyle: { opacity: 1 },
    selectedIconSource: uncheckedIcon,
  },
};

class ProductItem extends Component {
  renderProductIcon = (icon, itemIconStyle) => (
    <View style={{ minHeight: CONTAINER_WIDTH / 3.8 }}>
      <Image style={{ ...itemIconStyle }} source={icon} />
    </View>
  );

  renderProductLabel = (label, labelStyle, labelHighlightedStyle) => (
    <View>
      <AppText
        style={{
          ...styles.label,
          ...labelStyle,
          ...labelHighlightedStyle,
        }}
      >
        {label}
      </AppText>
    </View>
  );

  renderAbsoluteImage = (imageStyle, imageSource) => (
    <Image style={{ ...imageStyle }} source={imageSource} />
  );

  render() {
    const {
      label,
      iconSource,
      labelStyle,
      containerStyle,
      onPress,
      status, // none, selected, highlighted
      buttonCotaninerStyle,
    } = this.props;
    let statusStyle = {};
    statusStyle = STATUS_STYLE[status];
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        style={{
          ...styles.buttonCotaniner,
          ...statusStyle.containerShadow,
          ...buttonCotaninerStyle,
        }}
        onPress={onPress}
      >
        <View style={{ ...styles.container, ...containerStyle }}>
          {this.renderProductIcon(iconSource, statusStyle.itemIconStyle)}
          {this.renderProductLabel(label, { ...labelStyle, ...statusStyle.labelSelectedStyle })}
        </View>
        {this.renderAbsoluteImage(styles.tickIcon, statusStyle.selectedIconSource)}
        {status === STATUS.selected &&
          this.renderAbsoluteImage(styles.bottomArrowIcon, bottomArrowIcon)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonCotaniner: {
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: CONTAINER_MARGIN_RIGHT,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    paddingTop: CONTAINER_PADDING_TOP,
    paddingBottom: CONTAINER_PADDING_BOTTOM,
    borderRadius: 6,
    backgroundColor: Colors.primary5,
  },
  containerShadow: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    elevation: 6,
  },
  label: {
    ...TextStyles.heading4,
    fontSize: TEXT_FONT_SIZE,
    marginTop: 6,
  },
  tickIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 4,
    right: 4,
  },
  bottomArrowIcon: {
    bottom: 0,
    position: 'absolute',
    tintColor: 'white',
  },
});

export default ProductItem;
