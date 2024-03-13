import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { forwardRef, memo, useCallback, useMemo } from 'react';
import { SH, SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';

import { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const InputForm = forwardRef((props, ref) => {
  const {
    title,
    isRequire,
    style,
    inputStyle,
    type = 'text',
    onPress,
    icon,
    onPressIcon,
    errorText,
    ...rest
  } = props;

  const isDisabledInput = useMemo(() => type === 'date' || !onPress, [onPress, type]);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const _onPress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      setIsDatePickerVisible(true);
    }
  }, [onPress]);

  const hideDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleConfirmDatePicker = useCallback(
    (date) => {
      hideDatePicker();
      props?.onChangeText?.(moment(date).format('DD / MM / YYYY'));
    },
    [hideDatePicker, props],
  );

  return (
    <View style={style}>
      <AppText style={styles.title}>
        {title}
        {isRequire && <AppText style={styles.require}> {` *`}</AppText>}
      </AppText>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.center}
        disabled={isDisabledInput}
        onPress={_onPress}
      >
        <TextInput
          {...rest}
          ref={ref}
          editable={isDisabledInput}
          pointerEvents={!isDisabledInput && 'none'}
          style={[styles.input, inputStyle, errorText && { borderBottomColor: Colors.accent3 }]}
        />
        {(type === 'date' || icon) && (
          <TouchableWithoutFeedback onPress={onPressIcon} disabled={!onPressIcon}>
            <Image source={icon || ICON_PATH.calendar} style={styles.icon} />
          </TouchableWithoutFeedback>
        )}
      </TouchableOpacity>
      {errorText ? (
        <View style={styles.errorContainer}>
          <Image source={ICON_PATH.warning} style={styles.errorIcon} />
          <AppText style={styles.require}>{errorText}</AppText>
        </View>
      ) : null}
      {type === 'date' && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          cancelTextIOS={'Hủy'}
          confirmTextIOS={'Xác nhận'}
          locale={'vi-VN'}
          onConfirm={handleConfirmDatePicker}
          onCancel={hideDatePicker}
          customHeaderIOS={() => null}
        />
      )}
    </View>
  );
});

export default memo(InputForm);

const styles = StyleSheet.create({
  title: { fontSize: 13, lineHeight: 18, color: Colors.gray5 },
  require: { fontSize: 12, lineHeight: 18, color: Colors.accent3 },
  input: {
    fontSize: 14,
    color: Colors.primary4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral4,
    paddingVertical: 6,
    width: '100%',
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    padding: 2,
    right: 0,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
});
