import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
class NavigationBar extends React.PureComponent {
  render() {
    const { title, RightComponent } = this.props;
    return (
      <View
        style={{
          height: 42,
          backgroundColor: Colors.neutral5,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AppText
          style={{
            fontSize: 17,
            fontWeight: '600',
            textAlign: 'center',
            color: '#000',
            marginLeft: 56,
            marginRight: 56
          }}
        >
          {title}
        </AppText>
        {RightComponent ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 8,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {RightComponent()}
          </View>
        ) : null}
      </View>
    );
  }
}

export default NavigationBar;
