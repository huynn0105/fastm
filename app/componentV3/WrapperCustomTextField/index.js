import React, { forwardRef, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import CustomTextField from '../CustomTextField';

import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import AppText from '../AppText';
import { SH } from '../../constants/styles';

const WrapperCustomTextField = (props, ref) => {
  const { textFieldValue, subNote, isRequired } = props;

  const refPickerInput = useRef(null);

  useEffect(() => {
    const refInput = ref?.current || refPickerInput?.current;
    if (refInput) {
      refInput.setValue(textFieldValue);
    }
  }, [ref, textFieldValue]);

  return (
    <View>
      <View>
        <CustomTextField
          ref={ref || refPickerInput}
          {...props}
          subNote={subNote}
          isRequired={isRequired}
        />
        {subNote && subNote.length > 0 ? <AppText style={styles.subNote}>{subNote}</AppText> : null}
        <View style={[styles.wrapperImg, { bottom: subNote?.length > 0 ? SH(50) : SH(20) }]}>
          <Image
            style={[styles.img, props.customIconStyle]}
            source={props.disabled ? ICON_PATH.dropdown_un : ICON_PATH.dropdown_ac}
            resizeMode="cover"
          />
        </View>
      </View>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={props.onPress}
        style={styles.wrapperTouch}
      />
    </View>
  );
};

export default forwardRef(WrapperCustomTextField);

const styles = StyleSheet.create({
  wrapperImg: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperTouch: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  img: {
    width: 24,
    height: 24,
    tintColor: Colors.gray3,
  },
  subNote: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: Colors.secondOrange,
  },
});
