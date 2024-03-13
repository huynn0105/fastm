import React from 'react';
import { Text } from 'react-native';
import { mapPropsToFontStyle } from '../../utils/textStyleHelper';

const mapPropsToStyle = (props) => {
  let style = [mapPropsToFontStyle(props)];
  if (!props.style) {
    return style;
  }
  if (props.style?.length > 0) {
    style = style.concat(props.style);
  } else {
    style = [...style, { ...props.style }];
  }
  return style;
};

const AppText = (props) => {
  return (
    <Text {...props} onPress={props.onPress && props.onPress} style={mapPropsToStyle(props)}>
      {props.children}
    </Text>
  );
};

export default AppText;
