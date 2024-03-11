import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

class DelModControl extends Component {

  onItemPress = () => {
    this.props.onItemPress(this.props.delMod);
  }

  renderDelModItem = (delMod) => {
    return (
      <TouchableOpacity onPress={this.onItemPress}>
        <View style={{
          flexDirection: 'row',
          height: 70,
          backgroundColor: '#fff',
          alignItems: 'center',
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
          marginTop: 16,
        }}
        >
          <Image
            style={{ width: 40, height: 40, marginRight: 8 }}
            source={{ uri: delMod.icon }}
          />
          <View>
            <Text style={{ marginTop: 8, flex: 4, fontSize: 14, fontWeight: '500' }}>
              {delMod.title}
            </Text>
            <Text style={{ marginBottom: 12, flex: 3, fontSize: 12, opacity: 0.6 }}>
              {delMod.detail}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{
              // flex: 1,
              fontSize: 26,
              fontWeight: '600',
              color: delMod.del30Color,
              textAlign: 'center',
              numberOfLines: 1,
            }}
            >
              {delMod.del30}
            </Text>
            {
              delMod.del30Detail ?
              <Text style={{
                flex: 1,
                fontSize: 16,
                fontWeight: '400',
                color: '#444',
                textAlign: 'center',
                numberOfLines: 1,
              }}
              >
                {delMod.del30Detail}
              </Text>
              : null
            }
          </View>
          <Image
            style={{ height: 20 }}
            source={require('./img/arrow_right2.png')}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity >
    );
  }

  render() {
    return (
      <View>
        {this.renderDelModItem(this.props.delMod)}
      </View>
    );
  }
}

export default DelModControl;
