import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppText from '../../componentV3/AppText';
class SwitchKeyboardSupport extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={{
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={this.props.onSwitchCallback}
      >
          <View style={{
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center' }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#555',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
            <AppText
              style={{
                color: '#555',
                fontSize: 8,
                fontWeight: 'bold',
                }}
            >
                {this.props.keyboardType === 'numeric' ? 'abc' : '123'}
            </AppText>
            </View>
          </View>
      </TouchableOpacity>
    );
  }
}

export default SwitchKeyboardSupport;
