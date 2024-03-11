// @flow

import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

let settings = { service: Platform.OS === 'ios' ? 'com.digitel.mfast' : 'com.digipay.mfast' };
export default class KeychainWrapper {
  static async setToken(username, password) {
    try {
      if (username && password) {
        await Keychain.setGenericPassword(username, password, settings);
      } else {
        await Keychain.resetGenericPassword(settings);

        //test
      }
    } catch (error) {
      //
    }
  }

  static async getToken() {
    try {
      const credentials = await Keychain.getGenericPassword(settings);
      if (credentials) {
        return credentials?.password || 'notoken';
      }
      return 'notoken';
    } catch (error) {
      return 'notoken';
      //
    }
  }
}
