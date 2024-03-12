import { Image, Share, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useRef, useState } from 'react';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import HomeActionSheet, { ITEM_IDS } from '../../Home/HomeActionSheet';
import {
  LIST_CTV_FUNCTION,
  LIST_CTV_FUNCTION_WITHOUT_RSM,
} from '../../AccountSetting/AccountSetting.constant';
import { MFConfigs } from '../../../constants/configs';
import { useDispatch, useSelector } from 'react-redux';
import { openLogin } from '../../../redux/actions/navigation';
import { getDefaultAvatar } from '../../../utils/userHelper';

const HeaderCollaborator = memo((props) => {
  const { avatar, userId, navigation, myUser, isVerify, collaboratorLeave } = props;

  const actionSheetRef = useRef();

  const dispatch = useDispatch();
  const invitationInfo = useSelector((state) => state?.invitationInfo);
  const appInfo = useSelector((state) => state?.appInfo);

  const onGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const onBottomSheetItemPress = useCallback(
    (itemID) => {
      if (!myUser.isLoggedIn) {
        dispatch(openLogin());
        return;
      }
      const invitation = invitationInfo;

      requestAnimationFrame(async () => {
        switch (itemID) {
          case ITEM_IDS.COLLABORATORS:
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            setTimeout(() => {
              navigation.navigate('Collaborator');
            }, 100);

            break;
          case ITEM_IDS.COLLABORATOR_LEAVE:
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            setTimeout(() => {
              navigation.navigate('CollaboratorLeaveScreen');
            }, 100);

            break;
          case ITEM_IDS.INSTALL_LINK:
            try {
              await Share.share({
                message: invitation.CTV_text,
              });
            } catch (error) {
              if (__DEV__) {
                console.log('error', error);
              }
            }

            break;
          case ITEM_IDS.INTRODUCTION:
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            setTimeout(() => {
              navigation.navigate('WebView', {
                mode: 0,
                title: 'Hướng dẫn chi tiết',
                url: appInfo?.introductionUrl,
              });
            }, 100);

            break;
          case ITEM_IDS.COMMISSION: {
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            setTimeout(() => {
              navigation.navigate('WebView', {
                mode: 0,
                title: 'Chính sách',
                url: MFConfigs.policyIndirect,
              });
            }, 100);

            break;
          }
          case ITEM_IDS.RSM_PUSH_MESSAGE: {
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            setTimeout(() => {
              navigation.navigate('RSMPushMessage');
            }, 100);

            break;
          }
          case ITEM_IDS.REF_CODE:
            try {
              await Share.share({
                message: invitation.CTV_text2,
              });
            } catch (error) {
              if (__DEV__) {
                console.log('error', error);
              }
            }
            break;
          case ITEM_IDS.POLICY_COLLABORATOR:
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            navigation.navigate('WebView', {
              mode: 0,
              title: 'Quy định',
              url: appInfo?.urlRuleCobllabNewModel,
            });
            break;
          case ITEM_IDS.INFO_COLLABORATOR:
            if (actionSheetRef.current) {
              actionSheetRef.current.close();
            }
            navigation.navigate('WebView', {
              mode: 0,
              title: 'Con đường huyền thoại',
              url: appInfo?.urlInfoNewModel,
            });
            break;
          default:
            break;
        }
      });
    },
    [
      appInfo?.introductionUrl,
      appInfo?.urlInfoNewModel,
      appInfo?.urlRuleCobllabNewModel,
      dispatch,
      invitationInfo,
      myUser.isLoggedIn,
      navigation,
    ],
  );

  const onPressAvatar = useCallback(() => {
    if (!userId?.length && !userId) {
      navigation?.navigate('AccountSettingScreen');
    }
  }, [navigation, userId]);

  return (
    <>
      <View style={styles.headerContainer}>
        {userId?.length || userId ? (
          <TouchableWithoutFeedback onPress={onGoBack}>
            <View style={styles.headerMoreButton}>
              <Image source={ICON_PATH.back2} style={styles.headerMoreImage} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <CharAvatar
          style={styles.avatar}
          defaultImage={getDefaultAvatar()}
          source={avatar}
          onPress={onPressAvatar}
        />
        {!userId?.length && !userId ? (
          <TouchableWithoutFeedback
            onPress={() => {
              actionSheetRef?.current?.open();
            }}
            disabled={!isVerify}
          >
            <View style={styles.headerMoreButton}>
              <Image
                source={ICON_PATH.moreSquare}
                style={[styles.headerMoreImage, { tintColor: isVerify ? undefined : Colors.gray8 }]}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      <BottomActionSheet
        ref={actionSheetRef}
        render={() => (
          <View>
            <HomeActionSheet
              onClosePress={() => {
                actionSheetRef?.current?.close();
              }}
              onItemPress={onBottomSheetItemPress}
              user={myUser}
              itemRender={myUser?.useRsmPush ? LIST_CTV_FUNCTION : LIST_CTV_FUNCTION_WITHOUT_RSM}
              collaboratorLeave={collaboratorLeave}
            />
          </View>
        )}
      />
    </>
  );
});

export default HeaderCollaborator;

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 999,
    backgroundColor: Colors.transparent,
  },
  headerMoreButton: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMoreImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
