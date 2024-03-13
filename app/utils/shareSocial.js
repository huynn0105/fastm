// import { postToWallByApp } from 'react-native-zalo-kit';
import { ShareDialog } from 'react-native-fbsdk-next';

/*
    feedData = {
        message,
        link: url,
        linkTitle: url,
        linkSource: url,
        linkDesc: url,
        linkThumb: [url],
        others: {},
        appName: 'MFast',
    };
*/

export const shareNewFeedZalo = async (feedData) => {
  // try {
  //   const data = await postToWallByApp(feedData);
  //   return data;
  // } catch (error) {
  //   return null;
  //   // console.log(error.message)
  // }
};

/*
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: url,
      contentDescription: message || '',
    };
*/
export const shareNewFeedFacebook = async (shareLinkContent) => {
  try {
    const isShow = await ShareDialog.canShow(shareLinkContent);
    if (isShow) {
      const result = await ShareDialog.show(shareLinkContent);
      if (!result) return null;
      if (result.isCancelled) {
        return null;
      }
      return { ...result, success: true };
    }
    return null;
  } catch (error) {
    return null;
    // console.log(error.message)
  }
};
