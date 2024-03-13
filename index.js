/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { LogBox } from 'react-native';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './app/App.js';
import messaging from '@react-native-firebase/messaging';
import { Notification } from './app/submodules/firebase/model';
import { NOTIFICATION_TYPES } from './app/submodules/firebase/model/Notification';
import FlutterService from './app/screenV3/Home/FlutterService';

const onBackgroundNotification = async (payload) => {
  const notification = Notification.objectFromNotificationPayload(payload);
  if (!notification?.extraData) {
    notification.extraData = JSON.parse(notification?.extraDataJSON);
  }

  if (notification?.type == NOTIFICATION_TYPES.OPEN_VIEW) {
    if (notification?.extraData?.action?.length > 0) {
      FlutterService.sendEvent('notification', JSON.stringify(notification?.extraData));
    }
  }
};

messaging().setBackgroundMessageHandler(onBackgroundNotification);

const logBoxInit = () => {
  //! disable warning LogBox
  LogBox.ignoreLogs([
    'VirtualizedLists should never be nested',
    'Require cycle: node_modules',
    'Calling `getNode()`',
    'Animated: useNativeDriver was not specified.',
    'Warning: componentWillReceiveProps has been renamed',
    'Warning: componentWillMount has been renamed',
    'Non-serializable values were found in the navigation state',
    'Sending onAnimatedValueUpdate with no listeners registered.',
    'Setting a timer',
    'Calling getNode()',
    'EventEmitter.removeListener',
    'ColorPropType will be removed from React Native',
    'Require cycle',
    'PointPropType',
    'source.uri should not be an empty string',
  ]);
};
logBoxInit();

AppRegistry.registerComponent(appName, () => App);

// Register background handler
