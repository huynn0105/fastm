import React, { PureComponent } from 'react';
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

class ViewsCounterText extends PureComponent {
  render() {
    const {
      style,
      iconImageStyle,
      count, titleTextStyle,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Image
          style={[styles.iconImage, iconImageStyle]}
          source={require('./img/eye.png')}
          resizeMode={'contain'}
        />
        <AppText style={[styles.titleText, titleTextStyle]}>
          {count}
        </AppText>
      </View>
    );
  }
}

// --------------------------------------------------

ViewsCounterText.propTypes = {
  count: PropTypes.number,
};

ViewsCounterText.defaultProps = {
  count: 0,
};

export default ViewsCounterText;

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
