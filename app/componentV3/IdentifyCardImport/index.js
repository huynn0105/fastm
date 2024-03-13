import React, { useCallback } from 'react';
import { StyleSheet, ActivityIndicator, View, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';

import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';
import AppText from '../AppText';

const widthImage = SCREEN_WIDTH / 2 - 28;

const styles = StyleSheet.create({
  img: {
    width: SW(40),
    height: SH(28),
    borderRadius: 8,
  },
  iconContainer: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardContainer: {
    marginBottom: SH(21),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});

const IdentifyCardImport = ({
  type,
  offset,
  onPress,
  sourceUrl,
  onPressRemove,
  isProcessing,
  disabledRemove,
  width = SW(163),
  height = SH(111),
}) => {
  const sourceRequire = type === 'FRONT' ? IMAGE_PATH.cmndBefore : IMAGE_PATH.cmndAfter;

  const _onPress = useCallback(() => {
    if (isProcessing) {
      return;
    }
    if (onPress) {
      onPress(type);
    }
  }, [onPress, isProcessing]);

  const _onPressRemove = useCallback(() => {
    if (isProcessing) {
      return;
    }
    if (onPressRemove) {
      onPressRemove(type);
    }
  }, [onPressRemove, isProcessing]);
  //test
  return (
    <View>
      <TouchableOpacity onPress={_onPress}>
        {!sourceUrl || sourceUrl?.length === 0 ? (
          <View style={[styles.cardContainer, { width: width, height: height }]}>
            <FastImage
              source={sourceRequire}
              style={styles.img}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View>
              <AppText
                medium
                style={{
                  fontSize: SH(14),
                  lineHeight: SH(20),
                  color: Colors.gray5,
                  marginTop: SH(8),
                }}
              >
                {type === 'FRONT' ? 'Mặt trước' : 'Mặt sau'}
              </AppText>
            </View>

            {isProcessing && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={Colors.primary4} />
              </View>
            )}
          </View>
        ) : (
          <FastImage
            source={{ uri: sourceUrl }}
            style={{
              width: width,
              height: height,
              // overflow: 'hidden',
              borderRadius: 8,
              marginBottom: SH(21),
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        )}
      </TouchableOpacity>
      {!!sourceUrl && !disabledRemove && (
        <TouchableOpacity style={styles.iconContainer} onPress={_onPressRemove}>
          <View>
            <Image source={ICON_PATH.delete2} style={styles.icon} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IdentifyCardImport;
