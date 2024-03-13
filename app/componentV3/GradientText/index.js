import React from 'react';
import {Text} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../componentV3/AppText';

const GradientText = props => {
  return (
    <MaskedView maskElement={<AppText {...props} />}>
      <LinearGradient
        colors={['rgb(166,123,2)', 'rgb(189,140,3)', 'rgb(255,190,6)', 'rgb(191,142,3)', 'rgb(219,163,4)', 'rgb(166,123,2)']}
      >
        <AppText {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
}

  export default GradientText;