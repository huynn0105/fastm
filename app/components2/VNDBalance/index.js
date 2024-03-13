import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
class VNDBalance extends PureComponent {
  onPress = () => {
    if (this.props.onPress) this.props.onPress();
  };
  render() {
    const { vnd, title = 'Tiền tích luỹ' } = this.props;
    return (
      <View>
        <TouchableOpacity activeOpacity={0.2} onPress={this.onPress}>
          <AppText style={{ ...TextStyles.normalTitle, marginBottom: 4, opacity: 0.7 }}>{title}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.primary1,
                marginRight: 4,
              }}
            >
              {vnd || 0}
            </AppText>
            <AppText
              style={{
                fontSize: 12,
                color: colors.primary1,
                marginRight: 9,
                marginTop: 4,
              }}
            >
              {'vnđ'}
            </AppText>
            <Image style={{ width: 16, height: 16 }} source={require('./img/ic_detail_blue.png')} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default VNDBalance;
