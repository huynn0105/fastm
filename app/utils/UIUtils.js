import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Dimensions, Linking, PixelRatio, Platform } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Communications from 'react-native-communications';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Toast from 'react-native-root-toast';
import Strings from '../constants/strings';
import Colors from '../theme/Color';

// --------------------------------------------------

export default class UIUtils {}

// --------------------------------------------------

const maleAvatarPlaceholder = require('../img/avatar1.png');
const femaleAvatarPlaceholder = require('../img/avatar2.png');

export function getAvatarPlaceholder(gender = 'male') {
  return gender === 'male' ? maleAvatarPlaceholder : femaleAvatarPlaceholder;
}

export function getWallPlaceholder() {
  return require('./img/wall.jpg');
}

export function hidePhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber
    .split('')
    .map((item, index) => {
      if (index < 4) {
        return '*';
      }
      return item;
    })
    .join('');
}

// --------------------------------------------------
// Alert
// --------------------------------------------------

export function showAlert(
  message,
  title = '',
  buttons = [{ text: 'Đóng', style: 'cancel', onPress: () => {} }],
  delayTime = 250,
) {
  setTimeout(() => {
    Alert.alert(title, message, buttons, { cancelable: false });
  }, delayTime);
}

export function showInfoAlert(message, delayTime = 250) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP + (isIphoneX() ? 16 : 0),
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: delayTime,
    opacity: 1,
    backgroundColor: Colors.primary1,
  });
}

export function showQuestionAlert(message, yes, no, onYesPress, onNoPress, delayTime = 250) {
  const buttons = [
    {
      text: no,
      onPress: onNoPress,
    },
    {
      text: yes,
      onPress: onYesPress,
    },
  ];
  showAlert(message, Strings.alert_title, buttons, delayTime);
}

export function showQuestionAlertWithTitle(
  title,
  message,
  yes,
  no,
  onYesPress,
  onNoPress,
  delayTime = 250,
) {
  const buttons = [
    {
      text: no,
      onPress: onNoPress,
    },
    {
      text: yes,
      onPress: onYesPress,
    },
  ];
  showAlert(message, title, buttons, delayTime);
}

export function showQuestionAlertWithTitleAndDestructive(
  title,
  message,
  yes,
  no,
  onYesPress,
  onNoPress,
  delayTime = 250,
) {
  const buttons = [
    {
      text: no,
      onPress: onNoPress,
    },
    {
      text: yes,
      onPress: onYesPress,
      style: Platform.OS === 'ios' ? 'destructive' : 'positive',
    },
  ];
  showAlert(message, title, buttons, delayTime);
}

export function openOSSettings() {
  if (Platform.OS === 'ios') {
    Linking.canOpenURL('app-settings:')
      .then((supported) => {
        return Linking.openURL('app-settings:');
      })
      .catch();
  } else {
    AndroidOpenSettings.appDetailsSettings();
  }
}

export function showAlertForRequestPermission(message) {
  showQuestionAlert(message, 'Đồng ý', 'Đóng', () => {
    openOSSettings();
  });
}

export function call(number) {
  const asynTask = async () => {
    try {
      const value = await AsyncStorage.getItem('first_call');
      if (value === null) {
        showQuestionAlertWithTitle(
          'Gọi mất phí từ số thuê bao của bạn',
          '(Hiện MFast vẫn đang xây dựng tính năng gọi miễn phí, xin lỗi vì sự bất tiện này)',
          'Gọi',
          'Hủy',
          () => {
            Communications.phonecall(number, true);
            AsyncStorage.setItem('first_call', 'true');
          },
        );
      } else {
        Communications.phonecall(number, true);
      }
    } catch (error) {
      // Error saving data
    }
  };
  asynTask();
}

export function callAlert(number, yesCallback, noCallback) {
  const asynTask = async () => {
    try {
      showQuestionAlertWithTitle(
        'Gọi mất phí từ số thuê bao của bạn',
        '',
        'Gọi',
        'Hủy',
        () => {
          Communications.phonecall(number, true);
          if (yesCallback) {
            yesCallback();
          }
        },
        () => {
          if (noCallback) {
            noCallback();
          }
        },
      );
    } catch (error) {
      // Error saving data
    }
  };
  asynTask();
}

function float2int(value) {
  return value | 0; // eslint-disable-line
}

export function correctFontSizeForScreen(size) {
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
  const devRatio = PixelRatio.get();
  const factor = ((screenWidth * devRatio) / 320 + (screenHeight * devRatio) / 640) / 2.0;
  const maxFontDifferFactor = 5; // the maximum pixels of font size we can go up or down
  // console.log("The factor is: "+factor);
  if (factor <= 1) {
    return size - float2int(maxFontDifferFactor * 0.3);
  } else if (factor >= 1 && factor <= 1.6) {
    return size - float2int(maxFontDifferFactor * 0.1);
  } else if (factor >= 1.6 && factor <= 2) {
    return size;
  } else if (factor >= 2 && factor <= 3) {
    return size + float2int(maxFontDifferFactor * 0.65);
  } else if (factor >= 3) {
    return size + float2int(maxFontDifferFactor);
  }
  return size;
}

export function showDevAlert(
  message,
  title = '',
  buttons = [{ text: 'Đóng', style: 'cancel', onPress: () => {} }],
  delayTime = 250,
) {
  if (__DEV__) {
    setTimeout(() => {
      Alert.alert(title, message, buttons, { cancelable: false });
    }, delayTime);
  }
}
