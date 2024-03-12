import {
  StyleSheet,
} from 'react-native';
import colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fefefe',
  },
  subscriptionsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  notificationsContainer: {
    flex: 0,
    paddingLeft: 16,
    paddingRight: 16,
  },
  newsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  sectionSeparatorWhite: {
    marginTop: 6,
    height: 4,
    backgroundColor: colors.navigation_bg,
  },
  sectionSeparator: {
    flex: 0,
    height: 8,
    backgroundColor: '#eee',
  },
  menuButton: {
    width: 64,
    height: 64,
    paddingTop: 0,
    paddingBottom: 20,
    paddingLeft: 8,
    paddingRight: 20,
  },
  inboxButton: {
    width: 64,
    height: 64,
    paddingTop: 0,
    paddingBottom: 20,
    paddingLeft: 4,
    paddingRight: 24,
  },
  mailButton: {
    width: 64,
    height: 64,
    paddingTop: 0,
    paddingBottom: 20,
    // paddingLeft: 24,
    paddingRight: 14,
  },
});

// --------------------------------------------------
// prev version

/*
import Colors from 'app/constants/colors';
import { isPhoneX } from 'app/utils/Utils';
const SCREEN_SIZE = Dimensions.get('window');
const IS_PHONE_X = isPhoneX();
const IPHONE_X_OFFSET = IS_PHONE_X ? 12 : 0;
*/

/*
userHeaderContainer: {
  width: SCREEN_SIZE.width,
  height: 188,
  paddingTop: 32 + IPHONE_X_OFFSET,
  paddingBottom: 0,
},
balanceInfoContainer: {
  marginTop: -44,
  marginLeft: 36,
  marginRight: 36,
  borderRadius: 4,
  borderWidth: 0,
  borderColor: Colors.app_theme,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0.5 },
  shadowOpacity: 0.2,
  shadowRadius: 1,
  elevation: 8,
},
*/

// end
// --------------------------------------------------
