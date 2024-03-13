import React, { PureComponent } from 'react';
import {
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const SCREEN_SIZE = Dimensions.get('window');


// --------------------------------------------------
// StickerView
// --------------------------------------------------

class StickerView extends PureComponent {

  onPress = () => {
    this.props.onPress(this.props.data.uid);
  }
  render() {
    const {
      data,
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          {
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0',
            paddingLeft: 4,
            paddingRight: 4,
            marginBottom: 16,
          },
        ]}
        onPress={this.onPress}
      >
        <Image
          style={{
            width: (SCREEN_SIZE.width - (4 * 5)) / 4.3,
            height: (SCREEN_SIZE.width - (4 * 5)) / 4.3,
          }}
          source={data.icon}
        />
      </TouchableOpacity>
    );
  }
}

export default StickerView;
