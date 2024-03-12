import { ActivityIndicator } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../theme/Color';

const Indicator = memo((props) => {
  return <ActivityIndicator color={Colors.gray5} {...props} />;
});

export default Indicator;
