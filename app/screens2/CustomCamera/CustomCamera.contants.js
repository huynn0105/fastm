import { Dimensions, Platform } from 'react-native';

export const SCREEN_SIZE = Dimensions.get('window');

export const MAX_PERCENT_WIDTH = 0.95;
export const MAX_PERCENT_HIEGHT = 0.7;

export const CAMERA_HEIGHT = parseInt((SCREEN_SIZE.height * MAX_PERCENT_HIEGHT).toFixed(2));
export const CAMERA_WIDTH = SCREEN_SIZE.width - 32;

export const TOP_PADDING = SCREEN_SIZE.height * 0.05 + (Platform.OS === 'android' ? -12 : 0);
//
