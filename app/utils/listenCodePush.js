import { Alert } from 'react-native';
import CodePush from 'react-native-code-push';
// import LoadingModal from '../components/Loading';
import BroadcastManager from '../submodules/firebase/manager/BroadcastManager';
export const listenCodePush = () => {
  setTimeout(() => {
    BroadcastManager.shared().notifyObservers('show_popup_force_logout');
  }, 6000);

  CodePush.checkForUpdate().then((update) => {
    console.log('hello', update);
    if (update?.isMandatory) {
      Alert.alert('Update app', 'Do you want to update instantly?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              //   LoadingModal.show('Loading ...');
            }, 50);
            CodePush?.sync({ installMode: CodePush.InstallMode.IMMEDIATE }, (status) => {
              console.log('status la gi', status);
              switch (status) {
                case CodePush.SyncStatus.UPDATE_INSTALLED:
                case CodePush.SyncStatus.UNKNOWN_ERROR:
                  //   LoadingModal.hide();
                  break;
              }
            });
          },
        },
      ]);
    } else {
      return;
    }
  });
};
