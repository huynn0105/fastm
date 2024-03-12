'use strict';

import React, { } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import AppStyles from '../constants/styles';
import AppColors from '../constants/colors';

import KJTextButton from '../common/KJTextButton';
import TextButton from './TextButton';

// --------------------------------------------------

// const SubscriptionRegisterRow = (props) => (
//   <View style={styles.container}>
//     <TouchableOpacity
//       style={[AppStyles.link_button, { paddingTop: 12, paddingBottom: 12 }]}
//       onPress={() => {
//         if (props.onPress !== undefined) {
//           props.onPress();
//         }
//       }}
//       underlayColor={AppColors.touchable_underlay}
//     >
//       <View style={styles.row}>
//         <Text style={[AppStyles.link_button_text, { alignSelf: 'center' }]}>
//           {props.title}
//         </Text>
//         <Image
//           style={{ alignSelf: 'center', marginLeft: 6, height: 12 }}
//           source={require('./img/ic_arrow_right.png')}
//           resizeMode='contain'
//         />
//       </View>
//     </TouchableOpacity>
//   </View>
// );

const SubscriptionRegisterRow = (props) => (
<View
  style={{
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  }}
>
  <Text style={{ color: '#808080', fontSize: 14 }}>
  {'Vẫn còn 30 công việc hấp dẫn đang chờ '}
  </Text>
  <View style={{ height: 4 }} />
  <TextButton
    title={'Đăng ký ngay'}
  />
</View>
);

// <KJTextButton
//   buttonStyle={[AppStyles.button, { height: 36, borderRadius: 4, backgroundColor: '#0000' }]}
//   textStyle={[AppStyles.button_text, { marginLeft: 12, marginRight: 12, color: '#2696E0' }]}
//   text={props.title}
//   onPress={() => {
//     if (props.onPress !== undefined) {
//       props.onPress();
//     }
//   }}
// />

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

// --------------------------------------------------

SubscriptionRegisterRow.defaultProps = {
  title: 'Đăng ký thêm',
};

SubscriptionRegisterRow.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};

export default SubscriptionRegisterRow;
