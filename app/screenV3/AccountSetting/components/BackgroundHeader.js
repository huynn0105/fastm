import { Animated, Image, Share, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { MFConfigs } from '../../../constants/configs';
import { useSelector } from 'react-redux';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import HomeActionSheet, { ITEM_IDS } from '../../Home/HomeActionSheet';

const BackgroundHeader = memo((props) => {
  const { scrollY, rankLevel, isVerifiedAccount, myUser, navigation } = props;

  const actionSheetRef = useRef();

  const appInfo = useSelector((state) => state?.appInfo);
  const invitationInfo = useSelector((state) => state?.invitationInfo);

  const referralCode = useMemo(() => myUser?.referralCode, [myUser?.referralCode]);

  const headerHeight = useMemo(() => 56, []);

  const containerStyle = useMemo(
    () => [
      {
        height: Animated.subtract(headerHeight, scrollY),
      },
    ],
    [headerHeight, scrollY],
  );

  const onCopy = useCallback(() => {
    if (!isVerifiedAccount) return;
    actionSheetRef.current?.open();
  }, [isVerifiedAccount]);

  const onBottomSheetItemPress = useCallback(
    (itemID) => {
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
      invitationInfo,
      navigation,
    ],
  );

  return (
    <>
      <Animated.View style={[styles.container, containerStyle]}>
        <LinearGradient
          colors={['rgb(31, 114, 255)', 'rgb(40, 34, 200)']}
          style={styles.linearGradient}
        />
      </Animated.View>
      <Animated.View style={[styles.container, containerStyle, { zIndex: 999 }]}>
        {myUser?.isLoggedIn ? (
          <View style={styles.infoContainer}>
            <AppText semiBold style={styles.text}>
              {rankLevel ? (
                <>
                  <AppText style={styles.title}>Xin chào!</AppText>
                  {'\n'}
                  {rankLevel}
                </>
              ) : null}
            </AppText>
            <TouchableWithoutFeedback onPress={onCopy}>
              <AppText
                semiBold
                style={[
                  styles.text,
                  {
                    textAlign: 'right',
                  },
                ]}
              >
                {referralCode ? (
                  <>
                    <AppText style={styles.title}>Mã MFast</AppText>
                    {'\n'}
                    <AppText
                      semiBold
                      style={[
                        styles.text,
                        {
                          opacity: isVerifiedAccount ? 1 : 0.5,
                        },
                      ]}
                    >
                      {referralCode}
                    </AppText>
                  </>
                ) : null}
              </AppText>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <Image source={ICON_PATH.mfastLogoName} style={styles.brandLogoName} />
        )}
      </Animated.View>
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
              initStep={2}
              hideBack
            />
          </View>
        )}
      />
    </>
  );
});

export default BackgroundHeader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },

  brandLogoName: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 86,
    height: 24,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    width: '100%',
    // backgroundColor: 'red',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.primary5,
    opacity: 0.7,
    letterSpacing: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary5,
    letterSpacing: 0.5,
  },
});
