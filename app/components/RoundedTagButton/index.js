import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';

import AppText from '../../componentV3/AppText';

export const STATUS_CODE = {
  NORMAL: 1,
  SELECTED: 2,
  UNSELECTED: 3
};

class RoundedTagButton extends PureComponent {
  getStylesByStatus = (status) => {
    let buttonSelectionStyle;
    let titleSelectionStyle;
    switch (status) {
      case STATUS_CODE.NORMAL:
        buttonSelectionStyle = styles.normalButtonStyle;
        titleSelectionStyle = styles.normalTitleStyle;
        break;
      case STATUS_CODE.SELECTED:
        buttonSelectionStyle = styles.selectedButtonStyle;
        titleSelectionStyle = styles.selectedTitleStyle;
        break;
      case STATUS_CODE.UNSELECTED:
        buttonSelectionStyle = styles.unselectedButtonStyle;
        titleSelectionStyle = styles.unselectedTitleStyle;
        break;
      default:
        buttonSelectionStyle = styles.normalButtonStyle;
        titleSelectionStyle = styles.normalTitleStyle;
        break;
    }
    return { buttonSelectionStyle, titleSelectionStyle };
  };

  render() {
    const { containerStyle, title, status, onPress } = this.props;
    const { buttonSelectionStyle, titleSelectionStyle } = this.getStylesByStatus(status);
    return (
      <TouchableOpacity
        style={[styles.buttonStyle, buttonSelectionStyle, containerStyle]}
        activeOpacity={0.2}
        onPress={onPress}
      >
        <AppText style={[styles.titleStyle, titleSelectionStyle]}>{title}</AppText>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  normalButtonStyle: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary3
  },
  selectedButtonStyle: {
    backgroundColor: Colors.primary2,
    borderColor: 'transparent'
  },
  unselectedButtonStyle: {
    backgroundColor: 'transparent',
    borderColor: Colors.neutral4
  },
  titleStyle: {
    ...TextStyles.normalTitle,
    paddingTop: 9,
    paddingBottom: 11,
    paddingLeft: 16,
    paddingRight: 16
  },
  normalTitleStyle: {
    color: Colors.primary4
  },
  selectedTitleStyle: {
    color: 'white',
    fontWeight: '600',
  },
  unselectedTitleStyle: {
    color: Colors.primary4,
    opacity: 0.6
  }
});

export default RoundedTagButton;
