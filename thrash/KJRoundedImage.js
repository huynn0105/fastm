import React, { PureComponent } from 'react';
import {
  Image,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

class KJRoundedImage extends PureComponent {
  render() {
    const { source, imageStyle, backgroundStyle } = this.props;
    return (
      <View style={backgroundStyle}>
        <Image
          style={[imageStyle, { backgroundColor: '#0000' }]}
          source={source}
        />
      </View>
    );
  }
}

KJRoundedImage.defaultProps = {
  imageStyle: { backgroundColor: '#0000' },
  backgroundStyle: { backgroundColor: '#fff' },
  source: {},
};

KJRoundedImage.propTypes = {
  imageStyle: Image.propTypes.style,
  backgroundStyle: View.propTypes.style,
  source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

export default KJRoundedImage;
