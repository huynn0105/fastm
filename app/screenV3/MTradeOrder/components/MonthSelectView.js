import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import moment from 'moment';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { debounce } from 'lodash';
import { ICON_PATH } from '../../../assets/path';

const MonthSelectView = memo((props) => {
  const { month, setMonth } = props;
  return (
    <View style={styles.monthContainer}>
      <ButtonArrow
        isLeft
        onPress={() => {
          const newMonth = moment(month)?.subtract(1, 'month');
          setMonth?.(newMonth);
        }}
      />
      <AppText medium style={styles.month}>
        {moment(month).format('MM / YYYY')}
      </AppText>
      <ButtonArrow
        disabled={moment().isSame(moment(month), 'month')}
        onPress={() => {
          const newMonth = moment(month)?.add(1, 'month');
          setMonth?.(newMonth);
        }}
      />
    </View>
  );
});

export default MonthSelectView;

const styles = StyleSheet.create({
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    width: 105,
    textAlign: 'center',
  },
  buttonArrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    borderColor: Colors.gray5,
  },
  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.gray5,
  },
});

const ButtonArrow = memo((props) => {
  const { isLeft, disabled, onPress, ...rest } = props;
  const onPressDebounce = debounce(onPress, 1000, { leading: true, trailing: false });
  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={onPressDebounce} {...rest}>
      <View
        style={[
          styles.buttonArrowContainer,
          isLeft && { transform: [{ scaleX: -1 }], paddingLeft: 1 },
          disabled && { borderColor: Colors.neutral3 },
        ]}
      >
        <Image
          source={ICON_PATH.arrow_right}
          style={[styles.arrow, disabled && { tintColor: Colors.neutral3 }]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});
