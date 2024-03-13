import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import OtpInputs from './OtpInput';

export default class CustomOtpInput extends PureComponent {
  _onChangeText = code => {
    this.props.onChangeText(code);
  };

  render() {
    const { onRef, containerStyle = {}, numberOfInputs } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <OtpInputs
          onRef={onRef}
          numberOfInputs={numberOfInputs}
          handleChange={this._onChangeText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  }
});
