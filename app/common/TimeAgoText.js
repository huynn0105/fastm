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

const TimeAgoText = (props) => (
  <View style={[styles.container, props.style]}>
    <Image
      style={[styles.iconImage, props.iconImageStyle]}
      source={require('./img/time2.png')}
      resizeMode={'contain'}
    />
    <AppText style={[styles.titleText, props.titleTextStyle]}>
      {props.timeAgo}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconImage: {
    width: 12,
    height: 12,
  },
  titleText: {
    marginLeft: 4,
    color: AppColors.text_black3,
    fontSize: 12,
  },
});

TimeAgoText.propTypes = {
  timeAgo: PropTypes.string,
};

TimeAgoText.defaultProps = {
  timeAgo: '',
};

export default TimeAgoText;
