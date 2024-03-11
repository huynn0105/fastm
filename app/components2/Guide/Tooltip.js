// @flow
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-render-html';

const Tooltip = ({ handleStop, currentStep }) => (
  <View style={{ marginBottom: 16 }}>
    <TouchableOpacity onPress={handleStop}>
      <HTMLView html={currentStep.text} />
    </TouchableOpacity>
  </View>
);

export default Tooltip;
