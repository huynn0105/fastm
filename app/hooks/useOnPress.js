import { Linking } from 'react-native';

import { isDeepLink } from '../utils/Utils';

// navigation service
import NavigationService from '../utils/NavigationService';

const useOnPress = ({ action, params }) => {
  if (isDeepLink(action)) {
    Linking.openURL(action);
  } else {
    NavigationService.navigate(action, params);
  }
};

export default useOnPress;
