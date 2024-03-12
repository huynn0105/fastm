import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useMemo, useRef } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import { useCallback } from 'react';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { SW } from '../../../constants/styles';
import HTML from 'react-native-render-html';
import { DEEP_LINK_BASE_URL, fonts } from '../../../constants/configs';
import { debounce } from 'lodash';
import Svg from 'react-native-svg';
import { Defs } from 'react-native-svg';
import { LinearGradient } from 'react-native-svg';
import { Stop } from 'react-native-svg';
import { ClipPath } from 'react-native-svg';
import { Path } from 'react-native-svg';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import { Rect } from 'react-native-svg';
import { getDefaultAvatar } from '../../../utils/userHelper';
const HEIGHT_BACKGROUND = 190;

const UserRank = memo((props) => {
  const { star, logo, level, isLoading, userInfo, navigation, userId } = props;

  const bottomSheetRef = useRef();

  const arrayStar = useMemo(() => Array.from({ length: star }, (_, i) => ({ id: i })), [star]);

  const renderStar = useCallback((item) => {
    return <Image source={ICON_PATH.boldStar} style={styles.star} />;
  }, []);

  const onOpenBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.open();
  }, []);

  const openChat = useCallback(
    debounce(
      () => {
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${userId}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [userId],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${userInfo?.user?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [userInfo?.user?.mobilePhone],
  );

  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  const renderItemBottomSheet = useCallback(
    (item, index, _) => {
      const lastIndex = index === _?.length - 1;
      const firstIndex = index === 0;
      const isCurrentUser = Number(userInfo?.rank?.userID || 0) === Number(item?.userID || 0);
      const disabled = !item?.refLevel || isCurrentUser;

      return (
        <>
          <TouchableWithoutFeedback
            disabled={disabled}
            onPress={() => {
              onCloseBottomSheet();
              navigation?.push('Collaborator', { userId: item?.userID });
            }}
          >
            <View
              key={item?.ID}
              style={{
                marginLeft: (index + 1) * 12,
                paddingBottom: 24,
                flexDirection: 'row',
              }}
            >
              {!lastIndex ? (
                <Image
                  source={ICON_PATH.lineCollaborator}
                  style={{ position: 'absolute', width: 12, height: 72, left: -2, bottom: -27 }}
                />
              ) : null}
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: disabled ? Colors.blue6 : Colors.primary5,
                  height: 52,
                  top: -2,
                  left: -2,
                  width: '100%',
                  borderTopLeftRadius: 52 / 2,
                  borderBottomLeftRadius: 52 / 2,
                }}
              />
              <View style={{ marginRight: 12 }}>
                <CharAvatar
                  source={hardFixUrlAvatar(item?.avatarImage)}
                  defaultName={item?.fullName}
                  // defaultImage={getDefaultAvatar()}
                  style={styles.itemAvatar}
                  textStyle={styles.itemAvatarText}
                />
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <AppText
                  medium
                  style={[styles.textLine, { color: Colors.gray1 }]}
                  numberOfLines={1}
                >
                  {item?.fullName}
                </AppText>
                <View style={[styles.infoContainer, { marginBottom: 0 }]}>
                  <AppText semiBold style={[styles.itemText, { color: Colors.blue5 }]}>
                    {item?.title}
                  </AppText>
                  <View style={styles.dot} />
                  <AppText medium style={styles.itemText}>
                    {item?.refLevel ? `Tầng ${item?.refLevel}` : 'Bạn'}
                  </AppText>
                </View>
              </View>
              {!item?.refLevel || isCurrentUser ? null : (
                <Image
                  source={ICON_PATH.arrow_right}
                  style={{ alignSelf: 'center', marginRight: 16 }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </>
      );
    },
    [navigation, onCloseBottomSheet, userInfo?.rank?.userID],
  );

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            top: -140,
          }}
        >
          <Image source={logo} style={{ width: 200, height: 200, bottom: -80 }} />
          <Svg height={HEIGHT_BACKGROUND} width="100%">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={Colors.primary5} stopOpacity="1" />
                <Stop offset="1" stopColor={Colors.neutral5} stopOpacity="1" />
              </LinearGradient>
              <ClipPath id="clip">
                <Path
                  d={`M 0 0 C ${SCREEN_WIDTH / 2} ${
                    SCREEN_WIDTH / 6
                  } ${SCREEN_WIDTH} 0 ${SCREEN_WIDTH} 0 L ${SCREEN_WIDTH} ${HEIGHT_BACKGROUND} L 0 ${HEIGHT_BACKGROUND} Z`}
                />
              </ClipPath>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height={HEIGHT_BACKGROUND}
              fill="url(#grad)"
              clipPath="url(#clip)"
            />
          </Svg>
        </View>
        <View style={styles.safeView}>
          {userInfo ? (
            <View style={styles.infoContainer}>
              <AppText semiBold style={styles.nameLine}>
                {userInfo?.user?.fullName}
              </AppText>
            </View>
          ) : null}
          <View style={styles.rankInfo}>
            <AppText semiBold style={styles.text}>
              {level}
            </AppText>
            {arrayStar?.length ? (
              <>
                <View style={styles.dot} />
                <View style={styles.starContainer}>{arrayStar.map(renderStar)}</View>
              </>
            ) : null}
          </View>
          {userInfo?.initLevel ? (
            <View style={styles.starContainer}>
              <TouchableWithoutFeedback onPress={onOpenBottomSheet}>
                <View
                  style={[
                    styles.rankInfo,
                    {
                      marginTop: 8,
                    },
                  ]}
                >
                  <AppText medium style={styles.textLine}>
                    Tầng {userInfo?.initLevel}
                  </AppText>
                  <Image source={ICON_PATH.sidestep} style={styles.iconLine} />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={openChat}>
                <View
                  style={[
                    styles.rankInfo,
                    {
                      marginTop: 8,
                      marginHorizontal: 24,
                    },
                  ]}
                >
                  <AppText medium style={styles.textLine}>
                    Chat
                  </AppText>
                  <Image
                    source={ICON_PATH.message}
                    style={[styles.iconLine, { tintColor: Colors.primary2 }]}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={openCall}>
                <View
                  style={[
                    styles.rankInfo,
                    {
                      marginTop: 8,
                    },
                  ]}
                >
                  <AppText medium style={styles.textLine}>
                    Gọi
                  </AppText>
                  <Image source={ICON_PATH.outlinePhone} style={styles.iconLine} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}
        </View>
        {isLoading ? (
          <ActivityIndicator color={Colors.gray5} style={{ position: 'absolute', top: 30 }} />
        ) : null}
      </View>

      <BottomActionSheet
        ref={bottomSheetRef}
        headerText={'Chi tiết tầng CTV'}
        render={() => {
          return (
            <View style={{ paddingVertical: 16, backgroundColor: Colors.neutral5, paddingLeft: 6 }}>
              {userInfo?.line?.map(renderItemBottomSheet)}
            </View>
          );
        }}
        canClose={true}
        haveCloseButton={true}
      />
    </>
  );
});

export default UserRank;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: Colors.highLightColor,
    lineHeight: 32,
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray8,
    marginLeft: 8,
    marginRight: 4,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    tintColor: Colors.highLightColor,
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 2,
  },
  image: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: -48,
  },
  safeView: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  infoContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLine: {
    color: Colors.primary2,
    fontSize: 16,
    lineHeight: 22,
  },
  iconLine: {
    width: 24,
    height: 24,
    marginLeft: 4,
  },
  nameLine: {
    fontSize: 18,
    lineHeight: 24,
  },
  itemAvatar: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
  itemText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.blue5,
  },
});
