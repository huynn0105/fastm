import React, { } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';

import AppColors from '../constants/colors';
import AppStyles from '../constants/styles';
import AppText from '../componentV3/AppText';

// --------------------------------------------------

const ViewMoreRow = (props) => (
  <View style={styles.container}>
    <TouchableHighlight
      style={[AppStyles.link_button, { paddingTop: 12, paddingBottom: 12 }]}
      onPress={() => {
        if (props.onPress !== undefined) {
          props.onPress();
        }
      }}
      underlayColor={AppColors.touchable_underlay}
    >
      <View style={styles.row}>
        <AppText style={[AppStyles.link_button_text, { alignSelf: 'center' }]}>
          {props.title}
        </AppText>
        <Image
          style={{ alignSelf: 'center', marginLeft: 6, height: 12 }}
          source={require('./img/arrow_right1.png')}
          resizeMode="contain"
        />
      </View>
    </TouchableHighlight>
  </View>
);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 0,
    borderColor: '#0000',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default ViewMoreRow;
