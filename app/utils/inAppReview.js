import Rate, { AndroidMarket } from 'react-native-rate';

const funcInAppReview = (funcCallBack) => {
    const options = {
      AppleAppID:"1494079210",
      GooglePackageName:"com.digipay.mfast",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: false,
    }
    Rate.rate(options, (success, error) => {
      if(typeof funcCallBack === 'function') {
        funcCallBack({ success });
      }
    })
}

export default funcInAppReview;