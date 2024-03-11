import {
  Alert,
  Animated,
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { AsyncStorageKeys } from '../../../constants/keys';

const CardViewGuide = memo((props) => {
  const { cardHeight, isCustomerPending } = props;
  const [isHide, setIsHide] = useState(true);

  const onPressIn = useCallback(() => {
    setIsHide(true);
    const key = isCustomerPending
      ? AsyncStorageKeys.IS_HIDE_GUILD_PENDING_CUSTOMER_DETAIL
      : AsyncStorageKeys.IS_HIDE_GUILD_CUSTOMER_DETAIL;
    AsyncStorage.setItem(key, JSON.stringify(true));
  }, [isCustomerPending]);

  useEffect(() => {
    const key = isCustomerPending
      ? AsyncStorageKeys.IS_HIDE_GUILD_PENDING_CUSTOMER_DETAIL
      : AsyncStorageKeys.IS_HIDE_GUILD_CUSTOMER_DETAIL;

    AsyncStorage.getItem(key, (error, result) => {
      result = JSON.parse(result);
      if (result) {
        setIsHide(true);
      } else {
        setIsHide(false);
      }
    });
  }, [isCustomerPending]);

  if (isHide) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPressIn={onPressIn}>
      {isCustomerPending ? (
        <View style={[styles.container, { height: cardHeight, flexDirection: 'row' }]}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={ICON_PATH.fingerSwipeLeft} style={styles.icon} />
            <AppText medium style={[styles.text, { textAlign: 'center' }]}>
              Vuốt sang trái để{'\n'}
              <AppText medium style={styles.text} bold>
                BỎ QUA{'\n '}
              </AppText>
            </AppText>
          </View>
          <View style={{ width: 2, overflow: 'hidden' }}>
            <View
              style={{
                height: cardHeight,
                borderWidth: 2,
                width: 10,
                borderStyle: 'dashed',
                borderColor: Colors.primary5,
                opacity: 0.6,
              }}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image source={ICON_PATH.fingerSwipeRight} style={styles.icon} />
            <AppText medium style={[styles.text, { textAlign: 'center' }]}>
              Vuốt sang phải để{'\n'}phân loại là{'\n'}
              <AppText medium style={styles.text} bold>
                TIỀM NĂNG
              </AppText>
            </AppText>
          </View>
        </View>
      ) : (
        <View style={[styles.container, { height: cardHeight }]}>
          <Image source={ICON_PATH.fingerSwipe} style={styles.icon} />
          <AppText medium style={styles.text}>
            Vuốt để xem khách hàng tiếp theo
          </AppText>
        </View>
      )}
    </TouchableWithoutFeedback>
  );
});

export default CardViewGuide;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 10, 40, 0.84)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
    borderRadius: 12,

    width: SW(343),
    paddingHorizontal: 16,
    paddingVertical: 22,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: 'rgba(255,255,255, 0.8)',
    marginTop: 16,
  },
});
