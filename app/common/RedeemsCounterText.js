import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import AppColors from '../constants/colors';
import AppText from '../componentV3/AppText';
// --------------------------------------------------

const RedeemsCounterText = (props) => (
  <View style={[styles.container, props.style]}>
    <Image
      style={[styles.iconImage, props.iconImageStyle]}
      source={require('./img/gift_box1.png')}
      resizeMode={'contain'}
    />
    <AppText style={[styles.titleText, props.titleTextStyle]}>
      {`${props.count} lượt đổi`}
    </AppText>
  </View>
);

// --------------------------------------------------

RedeemsCounterText.propTypes = {
  count: PropTypes.number,
};

RedeemsCounterText.defaultProps = {
  count: 0,
};

export default RedeemsCounterText;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconImage: {
    width: 16,
    height: 14,
  },
  titleText: {
    marginLeft: 4,
    color: AppColors.text_black2,
    fontSize: 12,
  },
});
