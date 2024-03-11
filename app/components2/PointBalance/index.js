import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import colors from '../../theme/Color';

import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';
class PointBalance extends PureComponent {
  onPress = () => {
    if (this.props.onPress) this.props.onPress();
  };
  render() {
    const { point, title = 'Điểm tích luỹ' } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={{ alignItems: 'flex-end' }}
          activeOpacity={0.2}
          onPress={this.onPress}
        >
          <AppText style={{ ...TextStyles.normalTitle, marginBottom: 4, opacity: 0.7 }}>{title}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.primary2,
                marginRight: 4,
              }}
            >
              {point || 0}
            </AppText>
            <Image
              style={{ width: 16, height: 16 }}
              source={ICON_PATH.arrow_right_green}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PointBalance;
