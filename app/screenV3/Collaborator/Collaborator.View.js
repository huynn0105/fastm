import {
  Animated,
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SH } from '../../constants/styles';
import Colors from '../../theme/Color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserInfo from './common/UserInfo';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { SceneMap, TabView } from 'react-native-tab-view';
import CustomTabBar from './components/CustomTabBar';
import OverviewTab from './components/OverviewTab';
import CollaboratorTab from './components/CollaboratorTab';
import { DEVICE_EVENT_EMITTER } from '../../constants/keys';
import CommunityTab from './components/CommunityTab';
import { openLogin } from '../../redux/actions/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import {
  setCurrentIndex,
  setTabIndexCollaborator,
} from '../../redux/actions/actionsV3/collaboratorAction';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';
import DigitelClient from '../../network/DigitelClient';
import LoginRequire from '../../components2/LoginRequire';
import Svg from 'react-native-svg';
import { Defs } from 'react-native-svg';
import { Stop } from 'react-native-svg';
import { Ellipse } from 'react-native-svg';
import { Rect } from 'react-native-svg';
import { LinearGradient } from 'react-native-svg';
import { BOTTOM_BAR_HEIGHT } from '../../screens2/Root/Tabbar';
import { openAccountIdentification } from '../../redux/actions/actionsV3/navigationAction';
import WebViewScreen, { WebViewScreenMode } from '../../screens2/Others/WebViewScreen';
import { SafeAreaView } from '@react-navigation/native';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';

const Collaborator = memo((props) => {
  const { navigation } = props;

  const insets = useSafeAreaInsets();
  const spaceTop = useMemo(() => insets?.top, [insets?.top]);

  const dispatch = useDispatch();
  const myUser = useSelectorShallow(getMyuserSelector);
  const appInfo = useSelectorShallow(getAppInforSelector);

  const url = appInfo?.incomeTabUrl;

  if (!myUser?.isLoggedIn) {
    return (
      <LoginRequire
        onPress={() => dispatch(openLogin())}
        image={IMAGE_PATH.mascot10Point}
        imageSize={156}
        marginTop={-80}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.neutral5,
        paddingTop: spaceTop,
        paddingBottom: 70,
      }}
    >
      <WebViewScreen
        navigation={navigation}
        params={{ url }}
        isSafeView={true}
        mode={WebViewScreenMode.NORMAL}
        needReloadForLogin
      />
    </SafeAreaView>
  );
});

export default Collaborator;

/// TODO: in-app LegendaryView
// const Collaborator = memo((props) => {
//   const { navigation } = props;

//   const userId = navigation.getParam('userId');

//   const dispatch = useDispatch();

//   const myUser = useSelectorShallow(getMyuserSelector);
//   console.log(`\u001B[34m -> file: Collaborator.View.js:52 -> myUser:`, myUser);

//   const hierInfoUser = useSelector((state) => state?.collaboratorReducer?.hierInfoUser);
//   const tabIndex = useSelector((state) => state?.collaboratorReducer?.tabIndex);

//   const userMetaData = useSelectorShallow(getUserMetaDataSelector);

//   const insets = useSafeAreaInsets();

//   const spaceTop = useMemo(() => insets?.top + SH(12), [insets?.top]);

//   const scrollViewRef = useRef();
//   const overviewRef = useRef();
//   const collaboratorRef = useRef();
//   const communityRef = useRef();

//   const scrollViewOffset = useRef(0);

//   const contentsOffset = useRef({});

//   const tabBarOffset = useRef(0);

//   const dataLoadMore = useRef({
//     height: 0,
//     isLoadMore: false,
//   });

//   const propsTabBar = useRef(null);

//   const [index, setIndex] = useState(userId ? 0 : tabIndex);

//   const [dataCollaboratorLeave, setDataCollaboratorLeave] = useState({});

//   const [isActiveSecondTabBar, setIsActiveSecondTabBar] = useState(false);

//   const scrollYAnimated = useRef(new Animated.Value(0)).current;

//   const [routes] = useState(
//     userId
//       ? [
//           { key: 'first', title: 'Tổng quan' },
//           { key: 'third', title: 'Cộng đồng' },
//         ]
//       : [
//           { key: 'first', title: 'Tổng quan' },
//           { key: 'second', title: 'Cộng tác viên' },
//           { key: 'third', title: 'Cộng đồng' },
//         ],
//   );

//   const handleOnLayoutContent = useCallback((event, key) => {
//     contentsOffset.current[key] = event?.nativeEvent?.layout?.y + tabBarOffset?.current;
//   }, []);

//   const FirstRoute = useCallback(() => {
//     return (
//       <View key={'1'}>
//         <OverviewTab
//           ref={overviewRef}
//           index={0}
//           userId={userId}
//           navigation={navigation}
//           onLayoutContent={handleOnLayoutContent}
//         />
//       </View>
//     );
//   }, [handleOnLayoutContent, navigation, userId]);

//   const SecondRoute = useCallback(
//     () => (
//       <View key={'2'}>
//         <CollaboratorTab
//           ref={collaboratorRef}
//           index={1}
//           userId={userId}
//           navigation={navigation}
//           // collaboratorLeave={dataCollaboratorLeave}
//         />
//       </View>
//     ),
//     [navigation, userId],
//   );

//   const ThirdRoute = useCallback(
//     () => (
//       <View key={'3'}>
//         <CommunityTab
//           ref={communityRef}
//           index={userId ? 1 : 2}
//           userId={userId}
//           navigation={navigation}
//         />
//       </View>
//     ),
//     [navigation, userId],
//   );

//   const renderScene = useMemo(
//     () =>
//       SceneMap({
//         first: FirstRoute,
//         second: SecondRoute,
//         third: ThirdRoute,
//       }),
//     [FirstRoute, SecondRoute, ThirdRoute],
//   );

//   const updateUserInfo = useCallback((_userInfo) => {
//     overviewRef?.current?.onUserInfoChange(_userInfo);
//     collaboratorRef?.current?.onUserInfoChange(_userInfo);
//     communityRef?.current?.onUserInfoChange(_userInfo);
//   }, []);

//   const updateTabIndex = useCallback((i) => {
//     overviewRef?.current?.onTabIndexChange(i);
//     collaboratorRef?.current?.onTabIndexChange(i);
//     communityRef?.current?.onTabIndexChange(i);
//   }, []);

//   const onChangeIndex = useCallback(
//     (i) => {
//       setIndex(i);
//       updateTabIndex(i);
//     },
//     [updateTabIndex],
//   );

//   const renderTabBar = useCallback(
//     (_props) => {
//       if (!propsTabBar.current) {
//         propsTabBar.current = _props;
//       }
//       if (!_props) {
//         return null;
//       }

//       return <CustomTabBar {..._props} index={index} />;
//     },
//     [index],
//   );

//   const handleLoadMoreList = useCallback(
//     (event) => {
//       if (index === 0) return;
//       const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

//       const paddingToBottom = 150;
//       const isLoadMore =
//         layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
//       if (isLoadMore !== dataLoadMore?.current?.isLoadMore && isLoadMore) {
//         dataLoadMore.current.isLoadMore = isLoadMore;
//         DeviceEventEmitter.emit(
//           index === 1
//             ? DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR
//             : index === 2
//             ? DEVICE_EVENT_EMITTER.HANDLE_LOAD_MORE_LIST_COLLABORATOR_REVIEW
//             : null,
//         );
//       }
//     },
//     [index],
//   );

//   const onScroll = useCallback(
//     (event) => {
//       scrollViewOffset.current = event.nativeEvent.contentOffset.y;
//       handleLoadMoreList(event);
//     },
//     [handleLoadMoreList],
//   );

//   const onContentSizeChange = useCallback(
//     (w, h) => {
//       if (index === 0 || dataLoadMore.current.height === h) return;
//       dataLoadMore.current.height = h;
//       dataLoadMore.current.isLoadMore = false;
//     },
//     [index],
//   );

//   const onLayoutTabView = useCallback(
//     (event) => {
//       tabBarOffset.current = event.nativeEvent.layout.y - spaceTop / 2;
//       setIsActiveSecondTabBar(true);
//     },
//     [spaceTop],
//   );

//   const onPressContent = useCallback(
//     (key) => {
//       setIndex((prev) => {
//         if (prev !== 0) {
//           setTimeout(() => {
//             scrollViewRef?.current?.scrollTo({
//               y: contentsOffset?.current?.[key] || 0,
//             });
//           }, 500);
//           dispatch(setCurrentIndex(0));
//           updateTabIndex(0);
//           return 0;
//         }
//         scrollViewRef?.current?.scrollTo({
//           y: contentsOffset?.current?.[key] || 0,
//         });
//         updateTabIndex(prev);
//         return prev;
//       });
//     },
//     [dispatch, updateTabIndex],
//   );

//   const onRefresh = useCallback(() => {
//     getDataCollaboratorLeave();
//     DeviceEventEmitter.emit(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH);
//   }, []);

//   const getDataCollaboratorLeave = useCallback(async () => {
//     try {
//       const res = await DigitelClient.getCollaboratorLeave();
//       if (res?.data?.data) {
//         setDataCollaboratorLeave(res?.data?.data);
//         collaboratorRef?.current?.updateDataCollaboratorLeave(res?.data?.data);
//       }
//     } catch (err) {}
//   }, []);

//   const onGetUserInfo = useCallback(
//     (value) => {
//       updateUserInfo(value);
//       setIndex((prevIndex) => {
//         updateTabIndex(prevIndex);
//         return prevIndex;
//       });
//     },
//     [updateTabIndex, updateUserInfo],
//   );

//   useEffect(() => {
//     if (hierInfoUser && !userId) {
//       updateUserInfo(hierInfoUser);
//     }
//   }, [hierInfoUser, updateUserInfo, userId]);

//   const currentIndexRx = useSelector((state) => state?.collaboratorReducer?.currentIndex);

//   useEffect(() => {
//     dispatch(setCurrentIndex(0));
//     requestAnimationFrame(() => {
//       setIndex((prevIndex) => {
//         updateTabIndex(prevIndex);
//         return prevIndex;
//       });
//       updateUserInfo(userId ? null : hierInfoUser);
//     });
//     return () => {
//       dispatch(setCurrentIndex(currentIndexRx));
//     };
//   }, []);

//   useEffect(() => {
//     if (userMetaData?.isCTVConfirmed) {
//       getDataCollaboratorLeave();
//     }
//   }, [getDataCollaboratorLeave, userMetaData?.isCTVConfirmed]);

//   useEffect(() => {
//     if (userId) return;
//     dispatch(setTabIndexCollaborator(index));
//   }, [dispatch, index, userId]);

//   if (!myUser?.isLoggedIn) {
//     return (
//       <LoginRequire
//         onPress={() => dispatch(openLogin())}
//         image={IMAGE_PATH.mascotCollaborator}
//         imageSize={172}
//         title={
//           <AppText
//             medium
//             style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 16 }}
//           >
//             Đăng nhập để cùng bước đi trên con đường{'\n'}trở thành{' '}
//             <AppText bold style={{ fontSize: 16, lineHeight: 24, color: Colors.blue3 }}>
//               Huyền Thoại MFast
//             </AppText>
//           </AppText>
//         }
//         renderHeader={() => (
//           <View
//             style={{
//               paddingTop: insets.top,
//             }}
//           >
//             <View
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 48 / 2,
//                 backgroundColor: Colors.primary5,
//                 marginTop: 12,
//                 marginBottom: 60,
//                 marginRight: 12,
//                 alignSelf: 'flex-end',
//               }}
//             />
//             <Svg height="190" width="100%">
//               <Defs>
//                 <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
//                   <Stop offset="0" stopColor={Colors.primary5} stopOpacity="1" />
//                   <Stop offset="1" stopColor={Colors.neutral5} stopOpacity="1" />
//                 </LinearGradient>
//               </Defs>
//               <Rect x="0" y="0" width="100%" height="190" fill="url(#grad)" />
//               <Ellipse cx="50%" cy="-25" rx="60%" ry="50" fill={Colors.neutral5} />
//             </Svg>
//           </View>
//         )}
//       />
//     );
//   }

//   return (
//     <>
//       <KeyboardAvoidingView style={styles.body}>
//         <ScrollView
//           ref={scrollViewRef}
//           onContentSizeChange={onContentSizeChange}
//           refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
//           onScroll={Animated.event(
//             [
//               {
//                 nativeEvent: {
//                   contentOffset: {
//                     y: scrollYAnimated,
//                   },
//                 },
//               },
//             ],
//             {
//               useNativeDriver: false,
//               listener: onScroll,
//             },
//           )}
//           scrollEventThrottle={10}
//           contentContainerStyle={[
//             styles.container,
//             { paddingTop: spaceTop, paddingBottom: BOTTOM_BAR_HEIGHT },
//           ]}
//           showsVerticalScrollIndicator={false}
//           nestedScrollEnabled
//         >
//           <UserInfo
//             myUser={myUser}
//             userId={userId}
//             onGetInfo={onGetUserInfo}
//             navigation={navigation}
//             onPressContent={onPressContent}
//             initUser={!userId ? hierInfoUser : {}}
//             isVerify={userMetaData?.isCTVConfirmed}
//             collaboratorLeave={dataCollaboratorLeave}
//           />

//           {Object.keys(userMetaData)?.length === 0 ? null : userMetaData?.isCTVConfirmed ? (
//             <View
//               style={{
//                 paddingHorizontal: 16,
//               }}
//               onLayout={onLayoutTabView}
//             >
//               <TabView
//                 navigationState={{ index, routes }}
//                 renderScene={renderScene}
//                 onIndexChange={onChangeIndex}
//                 renderTabBar={renderTabBar}
//                 swipeEnabled={false}
//               />
//             </View>
//           ) : (
//             <View
//               style={{
//                 alignSelf: 'center',
//                 marginTop: 40,
//                 marginHorizontal: 8,
//                 alignItems: 'center',
//                 paddingHorizontal: 16,
//               }}
//             >
//               <Image source={IMAGE_PATH.eKYC} />
//               <AppText
//                 bold
//                 style={{
//                   textAlign: 'center',
//                   fontSize: 14,
//                   lineHeight: 20,
//                   color: Colors.sixRed,
//                   marginTop: 16,
//                 }}
//               >
//                 Bạn chưa định danh tài khoản.
//               </AppText>
//               <AppText
//                 style={{
//                   textAlign: 'center',
//                   fontSize: 13,
//                   lineHeight: 18,
//                   color: '#3c3c53',
//                   marginTop: 8,
//                 }}
//               >
//                 Thông tin định danh giúp bảo vệ tài khoản, rút tiền và được mở các tính năng, nghiệp
//                 vụ bán hàng nâng cao
//               </AppText>
//               <TouchableOpacity
//                 onPress={() => {
//                   dispatch(openAccountIdentification(navigation.navigate));
//                 }}
//                 style={{
//                   backgroundColor: Colors.primary2,
//                   height: 48,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   paddingHorizontal: 24,
//                   borderRadius: 24,
//                   marginTop: 16,
//                 }}
//               >
//                 <AppText
//                   style={{
//                     color: Colors.primary5,
//                     fontSize: 16,
//                     lineHeight: 22,
//                     textAlign: 'center',
//                   }}
//                 >
//                   Định danh ngay
//                 </AppText>
//               </TouchableOpacity>
//             </View>
//           )}
//         </ScrollView>
//         {isActiveSecondTabBar ? (
//           <Animated.View
//             style={{
//               width: '100%',
//               height: 40 + spaceTop,
//               position: 'absolute',
//               top: 0,
//               backgroundColor: Colors.neutral5,
//               alignItems: 'center',
//               justifyContent: 'center',
//               paddingTop: scrollYAnimated.interpolate({
//                 inputRange: [
//                   0,
//                   tabBarOffset.current - 10,
//                   tabBarOffset.current,
//                   tabBarOffset.current,
//                 ],
//                 outputRange: [spaceTop, spaceTop, spaceTop / 2, spaceTop / 2],
//               }),
//               opacity: scrollYAnimated.interpolate({
//                 inputRange: [
//                   0,
//                   tabBarOffset.current - 10,
//                   tabBarOffset.current,
//                   tabBarOffset.current,
//                 ],
//                 outputRange: [0, 0, 1, 1],
//               }),
//               zIndex: scrollYAnimated.interpolate({
//                 inputRange: [
//                   0,
//                   tabBarOffset.current - 10,
//                   tabBarOffset.current,
//                   tabBarOffset.current,
//                 ],
//                 outputRange: [-1, 0, 0, 1],
//               }),
//             }}
//           >
//             {renderTabBar(propsTabBar.current)}
//           </Animated.View>
//         ) : null}
//       </KeyboardAvoidingView>
//     </>
//   );
// });

// export default Collaborator;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: Colors.neutral5,
//   },
//   body: {
//     flex: 1,
//     backgroundColor: Colors.neutral5,
//   },
// });
