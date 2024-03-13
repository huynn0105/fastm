import React from 'react';
import { View } from 'react-native';
import DoingThing from '../../components2/DoingThing/index';

const News = ({ style }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', ...style }}>
    <DoingThing />
  </View>
);

export default News;
