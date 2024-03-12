import { NativeEventEmitter, NativeModules } from 'react-native';
import DigitelClient from '../../network/DigitelClient';
import { Configs, DEEP_LINK_BASE_URL } from '../../constants/configs';
import createStoreFunc from '../../redux/store/store';

const { FlutterModule } = NativeModules;

const eventEmitter = new NativeEventEmitter(FlutterModule);
const _tag = 'FlutterModule:';

var showMTradeCampaign = true;

export const setShowMTradeCampaign = (value) => {
  console.log('bbb-1', value);
  showMTradeCampaign = value;
};

class FlutterService {
  static name = 'Flutter';

  static module = {
    mtrade: {
      name: 'MTrade',
      path: '/mtrade',
    },
    shipper: {
      name: 'Shipper',
      path: '/shipper',
    },
    academy: {
      name: 'Academy',
      path: '/academy',
    },
    mfast: {
      name: 'MFast',
      path: '/mfast',
    },
    chat: {
      name: 'Chat',
      path: '/chat',
    },
  };

  static handleDeeplink(params) {
    switch (params.name) {
      case this.module.mtrade.name:
        this.openMTrade(params);
        break;
      case this.module.shipper.name:
        this.openShipper(params);
        break;
      case this.module.academy.name:
        this.openAcademy(params);
        break;
      case this.module.mfast.name:
        this.openMFast(params);
        break;
      case this.module.chat.name:
        this.openChat(params);
        break;
      case '':
        this.openView(params);
        break;
      default:
        console.log(_tag, 'Module name is not found !!!');
        break;
    }
  }

  static async openView(params) {
    const myUser = createStoreFunc.getState().myUser;
    const app_info = createStoreFunc.getState().appInfo;

    const args = {
      initial_path: this.module.mtrade.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      ekyc_sdk_url: Configs.ekycSdkUrl,
      ekyc_sdk_token: Configs.ekycSdkToken,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      firebase_auth_token: myUser.firebaseToken,
      default_param: DigitelClient.defaultParams,
      filter: params.filter,
      route_path: params.path,
      user_metadata: this.getUserMetaData(),
      app_info: app_info,
      ...this.getDefaultParams(),
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static async openMTrade(params) {
    const myUser = createStoreFunc.getState().myUser;

    const args = {
      initial_path: this.module.mtrade.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      ekyc_sdk_url: Configs.ekycSdkUrl,
      ekyc_sdk_token: Configs.ekycSdkToken,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      firebase_auth_token: myUser.firebaseToken,
      default_param: DigitelClient.defaultParams,
      filter: params.filter,
      route_path: params.path,
      user_metadata: this.getUserMetaData(),
      ...this.getDefaultParams(),
      show_mtrade_campaign: showMTradeCampaign,
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static openShipper(params) {
    const myUser = createStoreFunc.getState().myUser;

    const args = {
      initial_path: this.module.shipper.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      firebase_auth_token: myUser.firebaseToken,
      default_param: DigitelClient.defaultParams,
      route_path: params.path,
      user_metadata: this.getUserMetaData(),
      ...this.getDefaultParams(),
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static openAcademy(params) {
    const args = {
      initial_path: this.module.academy.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      default_param: DigitelClient.defaultParams,
      route_path: params.path,
      user_metadata: this.getUserMetaData(),
      ...this.getDefaultParams(),
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static openChat(params) {
    const myUser = createStoreFunc.getState().myUser;
    const app_info = createStoreFunc.getState().appInfo;

    const args = {
      initial_path: this.module.chat.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      firebase_function_url: Configs.firebaseFunctionsBaseURL,
      firebase_auth_token: myUser.firebaseToken,
      default_param: DigitelClient.defaultParams,
      route_path: params?.path,
      chat_user_id: params?.chatUserId,
      chat_bot_id: params?.chatBotId,
      thread_id: params?.threadId,
      user_metadata: this.getUserMetaData(),
      app_info: app_info,
      ...this.getDefaultParams(),
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static openMFast(params) {
    const user_metadata = createStoreFunc.getState().userMetaData.data;
    const app_info = createStoreFunc.getState().appInfo;

    const args = {
      initial_path: this.module.mfast.path,
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      ekyc_sdk_url: Configs.ekycSdkUrl,
      ekyc_sdk_token: Configs.ekycSdkToken,
      default_param: DigitelClient.defaultParams,
      route_path: params.path,
      app_info: app_info,
      user_metadata: this.getUserMetaData(),
      ...this.getDefaultParams(),
    };
    FlutterModule.startFlutterActivity('initArgs', JSON.stringify(args), true, (text) => {
      console.log(_tag, text);
    });
  }

  static sendEvent(eventName, jsonStringify) {
    try {
      console.log('sendEvent', eventName, '-', jsonStringify);
      FlutterModule.sendEvent(eventName, jsonStringify);
    } catch (error) {
      console.log('flutter sendEvent error: ', error);
    }
  }
  static listenerEvent(eventName, callback) {
    try {
      if (!this.eventListener) {
        this.eventListener = {};
      }
      this.eventListener[eventName] = eventEmitter.addListener(eventName, (event) => {
        callback?.(event);
      });
    } catch (error) {
      console.log('flutter listenerEvent error: ', error);
    }
  }

  static removeListenerEvent(eventName) {
    this.eventListener[eventName].remove();
  }

  static getUserMetaData() {
    const user_metadata = createStoreFunc.getState().userMetaData.data;
    const myUser = createStoreFunc.getState().myUser;
    return {
      userId: myUser?.uid,
      fullName: user_metadata.countryIdName,
      phone: user_metadata.mobilePhone,
      email: user_metadata.email,
      avatar: myUser?.avatarImage,
      nickname: myUser?.fullName,
    };
  }

  static getDefaultParams() {
    const myUser = createStoreFunc.getState().myUser;
    const app_info = createStoreFunc.getState().appInfo;
    const user_metadata = createStoreFunc.getState().userMetaData.data;

    return {
      deep_link_base_url: DEEP_LINK_BASE_URL,
      base_url: Configs.serverURL,
      los_url: Configs.losUrl,
      los_api_key: Configs.losApiKey,
      web_url: Configs.mtradeLandingPageUrl,
      android_google_api_key: Configs.androidGoogleApiKey,
      ios_google_api_key: Configs.iosGoogleApiKey,
      cxgenie_agent_id: Configs.cxgenieAgentID,
      firebase_function_url: Configs.firebaseFunctionsBaseURL,
      firebase_auth_token: myUser.firebaseToken,
      default_param: DigitelClient.defaultParams,
      app_info: app_info,
      user_metadata: this.getUserMetaData(),
    };
  }
}

export default FlutterService;
