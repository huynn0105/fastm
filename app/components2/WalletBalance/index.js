import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import HTML from 'react-native-render-html';

import TextStyles from '../../theme/TextStyle';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
class WalletBalance extends PureComponent {
  onPress = () => {
    if (this.props.onPress) this.props.onPress();
  };

  renderDesc = () => {
    const { desc, descHtml } = this.props;
    if(descHtml) {
      return ( <HTML
          html={descHtml}
          onLinkPress={this.onPress}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
      />);
    }
    if(desc) {
      return (
        <AppText
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.accent2,
          }}
        >
          {desc}
        </AppText>
      )
    }
    return <View />
  }

  render() {
    const { desc, descHtml, title = '' } = this.props;
    return (
      <View>
        <TouchableOpacity
          style={{ alignItems: 'flex-end' }}
          activeOpacity={0.2}
          onPress={this.onPress}
        >
          <AppText style={{ ...TextStyles.normalTitle, marginBottom: 4, opacity: 0.7 }}>{title}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {this.renderDesc()}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default WalletBalance;
