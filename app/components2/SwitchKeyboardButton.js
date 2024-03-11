import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppText from '../componentV3/AppText';
export class SwitchKeyboardButton extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
        onPress={this.props.onSwitchCallback}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: '#555',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <AppText
            style={{
              color: '#555',
              fontSize: 12
            }}
          >
            {this.props.keyboardType === 'numeric' ? 'abc' : '123'}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
}
