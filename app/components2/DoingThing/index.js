import React from 'react';
import { View, Image, Text } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';
import {IMAGE_PATH} from '../../assets/path';

const DoingThing = () => (
  <View
    style={{
      width: `${(260.0 / 414) * 100}%`,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SCREEN_WIDTH * 0.2
    }}
  >
    <Image
      style={{ aspectRatio: 180 / 135.0, height: SCREEN_WIDTH*0.35 }}
      source={IMAGE_PATH.bg_doing}
    />
    <AppText
      style={{
        ...TextStyles.heading4,
        opacity: 0.6,
        marginTop: 16,
        textAlign: 'center'
      }}
    >
      {'MFast vẫn đang trong quá trình xây dựng chức năng này'}
    </AppText>
  </View>
);

export default DoingThing;
