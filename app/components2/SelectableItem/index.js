import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';

import {ICON_PATH, IMAGE_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const exampleLabel = 'Viettel';
const exampleDescription = 'Chiết khấu 3,2% khi mua thẻ';
const exampleSelectedIcon = ICON_PATH.checkbox_ac;
const exampleUnSelectedIcon = ICON_PATH.checkbox_round;
const exampleThumbnail = IMAGE_PATH.unknown;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    flex: 1,
  },
  iconStyle: {},
  contentContainerStyle: {
    flex: 8,
    paddingLeft: 14,
  },
  labelStyle: {
    ...TextStyles.heading3,
    opacity: 0.8,
    color: Colors.primary4,
  },
  selectedLabelStyle: {
    ...TextStyles.heading3,
    fontWeight: 'bold',
    color: Colors.primary2,
  },
  descriptionStyle: {
    ...TextStyles.normalTitle,
    opacity: 0.6,
    marginTop: 4,
  },
  selectedDescriptionStyle: {
    ...TextStyles.normalTitle,
    opacity: 1,
  },
  thumbnailContainerStyle: {},
  thumbnailStyle: {},
  seperatorLine: {
    width: '100%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: Colors.neutral5,
  },
});

class SelectableItem extends PureComponent {
  renderCheckBoxIcon = () => {
    const { selectedIcon, unselectedIcon, isSelected, iconStyle, iconContainerStyle } = this.props;
    const iconSource = isSelected ? selectedIcon : unselectedIcon;
    return (
      <View style={{ ...styles.iconContainerStyle, ...iconContainerStyle }}>
        <Image style={{ ...styles.iconStyle, ...iconStyle }} source={iconSource} />
      </View>
    );
  };
  renderContent = () => {
    const {
      label,
      description,
      labelStyle,
      descriptionStyle,
      contentContainerStyle,
      isSelected,
      descriptionTextView,
    } = this.props;
    let { selectedLabelStyle, selectedDescriptionStyle } = this.props;
    selectedLabelStyle = isSelected ? selectedLabelStyle : {};
    selectedDescriptionStyle = isSelected ? selectedDescriptionStyle : {};
    return (
      <View style={{ ...styles.contentContainerStyle, ...contentContainerStyle }}>
        <AppText style={{ ...styles.labelStyle, ...labelStyle, ...selectedLabelStyle }}>{label}</AppText>
        {descriptionTextView}
      </View>
    );
  };
  renderThumbnail = () => {
    const { thumbnailSource, thumbnailStyle, thumbnailContainerStyle } = this.props;
    return (
      <View style={{ ...styles.thumbnailContainerStyle, ...thumbnailContainerStyle }}>
        <Image style={{ ...styles.thumbnailStyle, ...thumbnailStyle }} source={thumbnailSource} />
      </View>
    );
  };

  render() {
    const { containerStyle, onSelectableItemPress } = this.props;
    return (
      <TouchableOpacity onPress={onSelectableItemPress}>
        <View style={{ ...styles.contentContainer, ...containerStyle }}>
          {this.renderCheckBoxIcon()}
          {this.renderContent()}
          {this.renderThumbnail()}
        </View>
        <View style={styles.seperatorLine} />
      </TouchableOpacity>
    );
  }
}

SelectableItem.PropTypes = {
  selectedIcon: Image.propTypes.source.isRequired,
  unselectedIcon: Image.propTypes.source.isRequired,
  isSelected: PropTypes.bool,
  iconStyle: ViewPropTypes.styles,
  iconContainerStyle: ViewPropTypes.styles,
  thumbnailSource: Image.propTypes.source.isRequired,
  thumbnailStyle: ViewPropTypes.styles,
  onSelectableItemPress: PropTypes.func,
};

SelectableItem.defaultProps = {
  label: exampleLabel,
  description: exampleDescription,
  selectedIcon: exampleSelectedIcon,
  unselectedIcon: exampleUnSelectedIcon,
  selectedLabelStyle: styles.selectedLabelStyle,
  selectedDescriptionStyle: styles.selectedDescriptionStyle,
  isSelected: false,
  thumbnailSource: exampleThumbnail,
};

export default SelectableItem;
