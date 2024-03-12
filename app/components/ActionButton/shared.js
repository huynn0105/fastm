import { Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

export const DEFAULT_ACTIVE_OPACITY = 0.25;

export const shadowStyle = {
  shadowOpacity: 0.25,
  shadowOffset: {
    width: 0,
    height: Platform.OS === 'ios' ? 3 : 1,
  },
  shadowColor: '#000',
  shadowRadius: 4,
  elevation: 5,
};

export const alignItemsMap = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
};

export const isAndroid = Platform.OS === 'android';

export function getTouchableComponent(useNativeFeedback) {
  if (useNativeFeedback === true && isAndroid === true) {
    return TouchableOpacity;
  }
  return TouchableOpacity;
}

export function touchableBackground(color, fixRadius) {
  if (isAndroid) {
    if (Platform.Version >= 21) {
      return TouchableNativeFeedback.Ripple(color || 'rgba(255,255,255,0.75)', fixRadius);
    } else {
      // eslint-disable-line
      TouchableNativeFeedback.SelectableBackground();
    }
  }
  return undefined;
}
