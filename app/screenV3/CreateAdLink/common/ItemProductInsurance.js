import { Image, StyleSheet, TextInput, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';
import { onLayoutAnimationCreateLink } from '../CreateAdLink.View';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { fonts } from '../../../constants/configs';
import { ICON_PATH } from '../../../assets/path';
import { formatNumber } from '../../../utils/Utils';

const ItemProductInsurance = memo((props) => {
  const {
    item,
    onSelected,
    onChangeDiscount,
    initDiscount,
    isSelected,
    disabled,
    isError,
    disabledDiscount,
  } = props;

  const [isChecked, setIsChecked] = useState(isSelected);

  const [textError, setTextError] = useState('');

  const [discountTemp, setDiscountTemp] = useState(`${initDiscount || 0}`);

  useEffect(() => {
    setIsChecked(isSelected);
  }, [isSelected]);

  const onChangeValue = useCallback(
    (value) => {
      onLayoutAnimationCreateLink();
      onSelected?.(value);
      onChangeDiscount?.(initDiscount);
      setIsChecked(value);
    },
    [onChangeDiscount, onSelected, initDiscount],
  );

  const restDiscount = useMemo(
    () => (Number(item?.comm_percent) - Number(discountTemp)).toFixed(1),
    [item, discountTemp],
  );

  const onBlur = useCallback(
    (text) => {
      onChangeDiscount?.(discountTemp);
    },
    [discountTemp, onChangeDiscount],
  );

  useEffect(() => {
    setDiscountTemp((prev) => {
      if (`${initDiscount}` !== `${prev}`) {
        return `${initDiscount}`;
      }
      return prev;
    });
  }, [initDiscount]);

  useEffect(() => {
    if (restDiscount < 0) {
      setTextError('Chiết khấu cho khách phải thấp hơn thu nhập mặc định');
    } else {
      setTextError('');
    }
  }, [restDiscount]);

  useEffect(() => {
    if (item?.is_disable) {
      setTextError('Sản phẩm bị giới hạn, không thể cài đặt chiết khấu cho khách hàng');
    }
  }, [item?.is_disable]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CheckBoxSquare
          onChangeValue={onChangeValue}
          label={item?.name}
          style={{ marginTop: 0, flex: 1 }}
          textColor={isChecked && Colors.gray1}
          isSelected={isChecked}
          disabled={disabled}
          isError={isError}
          labelStyle={{ flex: 1 }}
        />
        <Image style={styles.image} source={{ uri: item?.iconURL2 }} />
      </View>
      {isChecked ? (
        <View style={styles.itemRoseContainer}>
          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <View style={styles.itemRose}>
              <AppText style={styles.titleText} numberOfLines={2}>
                Thu nhập mặc định
              </AppText>
              <AppText semiBold style={[styles.valueText, { marginTop: SH(14) }]}>
                {item?.comm_percent}%
              </AppText>
            </View>
            <AppText
              medium
              style={[
                styles.textMath,
                {
                  marginRight: SW(16),
                },
              ]}
            >
              -
            </AppText>
            <View style={styles.itemRose}>
              <AppText style={styles.titleText} numberOfLines={2}>
                Chiết khấu cho khách
              </AppText>
              <View
                style={[
                  styles.inputValueContainer,
                  restDiscount < 0 && {
                    backgroundColor: `${Colors.fiveRed}40`,
                    borderColor: Colors.fiveRed,
                  },
                  (item?.is_disable || disabledDiscount) && {
                    backgroundColor: Colors.gray8,
                    borderColor: Colors.gray8,
                  },
                ]}
              >
                <TextInput
                  editable={!item?.is_disable && !disabledDiscount}
                  value={discountTemp}
                  onChangeText={(text) => {
                    setDiscountTemp((prev) => {
                      text = text.replace(/,/g, '.');
                      var regex = /^\d+(\.\d{0,1})?$/g;
                      if (text?.length && !regex.test(text)) {
                        return prev;
                      }
                      return text;
                    });
                  }}
                  onBlur={onBlur}
                  style={styles.inputValue}
                  keyboardType={'numeric'}
                />
                <AppText semiBold style={[styles.valueText, { color: Colors.gray5 }]}>
                  %
                </AppText>
              </View>
            </View>
            <AppText
              medium
              style={[
                styles.textMath,
                {
                  marginLeft: SW(16),
                },
              ]}
            >
              =
            </AppText>
            <View style={styles.itemRose}>
              <AppText style={[styles.titleText, { textAlign: 'right' }]} numberOfLines={2}>
                Thu nhập còn lại
              </AppText>
              <AppText
                semiBold
                style={[
                  styles.valueText,
                  { marginTop: SH(14), color: Colors.secondGreen, textAlign: 'right' },
                  restDiscount < 0 && { color: Colors.fiveRed },
                ]}
              >
                {formatNumber(restDiscount)}%
              </AppText>
            </View>
          </View>
          {textError?.length ? (
            <View style={{ flexDirection: 'row', marginTop: SH(12) }}>
              <Image source={ICON_PATH.warning} style={styles.warning} />
              <AppText style={styles.errorText}>{textError}</AppText>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

export default ItemProductInsurance;

const styles = StyleSheet.create({
  container: {
    marginTop: SH(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: SW(28),
    height: SH(28),
    resizeMode: 'contain',
  },
  itemRoseContainer: {
    marginLeft: SW(36),
    backgroundColor: Colors.neutral5,
    paddingHorizontal: SW(10),
    paddingVertical: SH(10),
    borderRadius: SH(6),
    justifyContent: 'flex-start',
    marginTop: SH(5),
  },
  titleText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.gray5,
  },
  valueText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray1,
  },
  itemRose: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: SH(4),
    backgroundColor: Colors.primary5,
    paddingHorizontal: SW(8),
    borderWidth: 1,
    borderColor: Colors.gray8,
    marginTop: SH(6),
  },
  inputValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: Colors.fiveRed,
    paddingVertical: 0,
    height: SH(32),
  },
  textMath: {
    fontSize: 14,
    marginTop: SH(48),
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.fiveRed,
    marginLeft: SW(4),
  },
  warning: {
    width: SW(15),
    height: SH(15),
    resizeMode: 'contain',
    marginRight: SW(4),
    tintColor: Colors.fiveRed,
  },
});
