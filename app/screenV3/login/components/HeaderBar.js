import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { icons } from '../../../img';
import styles from '../Login.styles';
import {IMAGE_PATH} from '../../../assets/path';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderBar = ({ params, goBack }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.containerHeader, { paddingTop: insets?.top || 16 }]}>
      <View style={{ flex: 0.1, justifyContent: 'center' }}>
        <TouchableOpacity onPress={goBack}>
          <Image source={icons.back} style={styles.smallIcon} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={IMAGE_PATH.mfast_logo_verti} style={styles.logo} />
      </View>
      <View style={{ flex: 0.1, justifyContent: 'center', opacity: 0 }}>
        <TouchableOpacity>
          <Image source={icons.back} style={styles.smallIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderBar;
