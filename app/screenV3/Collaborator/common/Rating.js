import { Image, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import { isInteger } from 'lodash';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';

const Rating = memo((props) => {
  const {
    star = 0,
    size = 16,
    space = 0,
    style,
    iconInActive = ICON_PATH.boldStar,
    iconActive = ICON_PATH.boldStar,
    colorInActive = Colors.gray4,
    colorActive = Colors.thirdGreen,
    onPress,
  } = props;

  let numberStarActive = 0;
  let numberHaftStar = 0;
  let numberStarInActive = 0;
  const parseStar = Number(star) || 0;

  if (isInteger(parseStar)) {
    numberStarActive = parseStar;
    numberStarInActive = 5 - numberStarActive;
  } else {
    numberStarActive = Math.floor(parseStar);
    numberHaftStar = 1;
    numberStarInActive = 5 - Math.ceil(parseStar);
  }
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {Array.from({ length: numberStarActive }).map((_, i) => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              onPress?.(i + 1);
            }}
          >
            <Image
              source={iconActive}
              style={{
                width: size,
                height: size,
                tintColor: colorActive,
                marginHorizontal: space / 2,
              }}
            />
          </TouchableWithoutFeedback>
        );
      })}
      {Array.from({ length: numberHaftStar }).map(() => {
        return (
          <View style={{ width: size, height: size, marginHorizontal: space / 2 }}>
            <View
              style={{
                width: size / 2,
                overflow: 'hidden',
                position: 'absolute',
                left: 0,
              }}
            >
              <Image
                source={iconActive}
                style={{ width: size, height: size, tintColor: colorActive }}
              />
            </View>
            <View
              style={{
                width: size / 2,
                overflow: 'hidden',
                position: 'absolute',
                right: 0,
              }}
            >
              <Image
                source={iconActive}
                style={{ width: size, height: size, tintColor: colorInActive, left: -size / 2 }}
              />
            </View>
          </View>
        );
      })}
      {Array.from({ length: numberStarInActive }).map((_, i) => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              onPress?.(numberStarActive + i + 1);
            }}
          >
            <Image
              source={iconInActive}
              style={{
                width: size,
                height: size,
                tintColor: colorInActive,
                marginHorizontal: space / 2,
              }}
            />
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
});

export default Rating;
