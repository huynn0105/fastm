// ...

import { ShareDialog } from 'react-native-fbsdk-next';

const shareLinkContent = {
  contentType: 'link',
  contentUrl: 'https://facebook.com',
  contentDescription: 'Wow, check out this great site!',
};

ShareDialog.canShow(shareLinkContent)
  .then((canShow) => {
    if (canShow) {
      return ShareDialog.show(shareLinkContent);
    }
    return false;
  })
  .then(
    (result) => {
      if (result.isCancelled) {
        console.log('Share cancelled');
      } else {
        console.log(`Share success with postId: ${result.postId}`);
      }
    },
    (error) => {
      console.log(`Share fail with error: ${error}`);
    },
  );
