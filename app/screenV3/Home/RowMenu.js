/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');

class RowMenu extends PureComponent {
  onPress = ({ title, url }) => {
    if (this.props.onPress) {
      this.props.onPress({ title, url });
    }
    else {
      if (this.props.navigation) {
        this.props.navigation.navigate('WebView', { mode: 0, title, url });
      }
    }
  }

  renderItem = (item) => <RowMenuItem {...item} total={this.props.dataSources.length} onPress={this.onPress} />;

  render() {
    const { dataSources } = this.props;

    return (
      <View style={{ flexDirection: 'row', padding: 0, backgroundColor: 'white' }}>
        {dataSources.map(this.renderItem)}
      </View >
    );
  }
}

export default RowMenu;

class RowMenuItem extends PureComponent {
  onPress = () => {
    this.props.onPress({ title: this.props.title, url: this.props.url });
  }
  render() {
    const { icon, title } = this.props;
    return (
      <TouchableOpacity
        style={{ padding: 13, flex: 1 }}
        activeOpacity={0.2}
        onPress={this.onPress}
      >
        <Image style={{ aspectRatio: 98 / 42 }} source={icon} resizeMode={'contain'} />
        <AppText style={{ ...TextStyles.caption2, marginTop: 6, textAlign: 'center' }}>
          {title}
        </AppText>
        <View style={{ position: 'absolute', right: 0, top: 16, bottom: 16, backgroundColor: Colors.neutral5, width: 1 }} />
      </TouchableOpacity>
    );
  }
}
