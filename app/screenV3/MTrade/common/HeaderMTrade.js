import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import SearchInput from '../../../componentV3/SearchInput/SearchInput';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import { useDispatch, useSelector } from 'react-redux';
import { resetTextSearch } from '../../../redux/actions/actionsV3/mtradeAction';

const HeaderMTrade = memo((props) => {
  const { onPressLocation, onPressFilter, onPressSearch, textSearch, onPressResetSearch } = props;
  const isFilter = useSelector((state) => Object?.keys(state?.mtradeReducer?.filter)?.length > 0);
  const isLocation = useSelector(
    (state) => state?.mtradeReducer?.location?.length > 0 || state?.mtradeReducer?.location > 0,
  );
  const isSearch = useSelector((state) => state?.mtradeReducer?.textSearch?.length > 0);

  const onClearKeySearch = useCallback(() => {
    onPressResetSearch?.();
  }, [onPressResetSearch]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPressSearch}>
        <View style={styles.flex}>
          <SearchInput
            containerStyle={styles.inputContainerStyle}
            placeholder={'Tìm kiếm'}
            editable={false}
            pointerEvents="none"
            value={textSearch}
          />
          {isSearch && onPressResetSearch ? (
            <TouchableWithoutFeedback onPress={onClearKeySearch}>
              <View style={{ position: 'absolute', right: 24 }}>
                <Image source={ICON_PATH.close4} style={{ width: 20, height: 20, margin: 5 }} />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <ButtonIcon
        icon={isLocation ? ICON_PATH.markerActive : ICON_PATH.marker}
        onPress={onPressLocation}
      />
      <View style={{ marginHorizontal: 22 }}>
        <ButtonIcon
          icon={isFilter ? ICON_PATH.filterActive : ICON_PATH.filter}
          onPress={onPressFilter}
        />
        {isFilter ? (
          <Image
            source={ICON_PATH.checkboxOn}
            style={{ position: 'absolute', width: 16, height: 16, right: 0, bottom: 0 }}
          />
        ) : null}
      </View>
    </View>
  );
});

export default HeaderMTrade;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  inputContainerStyle: {
    height: 36,
  },
  //* ButtonIcon
  buttonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: '66%',
    height: '66%',
  },
  flex: {
    flex: 1,
    justifyContent: 'center',
  },
});

const ButtonIcon = memo((props) => {
  const { icon, containerStyle, style, ...rest } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styles.buttonIconContainer].concat(containerStyle)}>
        <Image source={icon} style={[styles.buttonIcon].concat(style)} />
      </View>
    </TouchableWithoutFeedback>
  );
});
