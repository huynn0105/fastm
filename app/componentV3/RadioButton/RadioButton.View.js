import React, { useState, memo } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import { SH, SW } from '../../constants/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    marginTop: SH(12),
    // alignItems: 'center',
  },
  radioIcon: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: SW(1),
  },
  radioText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
  },
  iconNote: {
    marginLeft: SW(4),
    width: SH(20),
    height: SH(20),
    borderRadius: SH(20),
    resizeMode: 'contain',
  },
  textNoteContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
});

const CustomRadioButton = ({
  label,
  note,
  radioWrapperStyle,
  valueWrapperStyle,
  valueTextStyle,
  disabled,
  onPress,
  isSelected = true,
  error,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.radioButtonContainer, radioWrapperStyle]}
    >
      <View
        style={[
          styles.radioIcon,
          {},
          {
            borderColor: Colors.neutral4,
          },
          isSelected
            ? { borderColor: Colors.primary2 }
            : error?.length
            ? {
                borderColor: Colors.fiveRed,
              }
            : disabled && {
                backgroundColor: Colors.neutral4,
              },
        ]}
      >
        {isSelected ? (
          <View
            style={{
              width: SH(15),
              height: SH(15),
              borderRadius: SH(15),
              backgroundColor: Colors.primary2,
              position: 'absolute',
            }}
          />
        ) : null}
      </View>
      <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, valueWrapperStyle]}>
        <AppText style={[styles.radioText, valueTextStyle, isSelected && { color: Colors.gray1 }]}>
          {label}
        </AppText>
        {note ? <CustomTooltip note={note} /> : null}
      </View>
    </TouchableOpacity>
  );
};

const CustomTooltip = memo(({ note, noteStyle }) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  return (
    <Tooltip
      isVisible={toolTipVisible}
      disableShadow
      content={
        <AppText
          style={[
            styles.textNoteContent,
            {
              width: SW(250),
            },
            noteStyle,
          ]}
        >
          {note}
        </AppText>
      }
      placement="top"
      backgroundColor={'rgba(10, 10, 40, 0.85)'}
      onClose={() => {
        setToolTipVisible(false);
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setToolTipVisible(true);
        }}
      >
        <Image
          source={ICON_PATH.note2}
          style={[styles.iconNote, toolTipVisible && { backgroundColor: Colors.primary5 }]}
        />
      </TouchableWithoutFeedback>
    </Tooltip>
  );
});

export default CustomRadioButton;
