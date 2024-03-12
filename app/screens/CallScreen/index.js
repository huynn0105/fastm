// // @flow

// import React, { Component } from 'react';
// import { connect } from 'react-redux';

// import { View, Text, StyleSheet, Animated, Easing, Dimensions, Platform } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import InCallManager from 'react-native-incall-manager';

// import firebase from 'react-native-firebase';

// import Strings from 'app/constants/strings';
// import CharAvatar from 'app/components/CharAvatar';
// import { User } from 'app/models';
// import { showInfoAlert, callAlert } from 'app/utils/UIUtils';

// import {
//   muteCall,
//   unmuteCall,
//   useSpeaker,
//   useEarpiece,
//   hangupCall,
//   dtmfCall,
// } from 'app/redux/actions';

// import ActionButton, { ACTION_TYPE } from './ActionButton';
// import Keypad from './Keypad';

// import colors from '../../constants/colors';
// import Call from '../../../node_modules/react-native-pjsip/src/Call';

// const _ = require('lodash');

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// const AVATAR_WIDTH = 120;

// type Props = {
//   user: ?User,
//   call: Call,
//   navigation: any,
//   sip: any,
//   mute: Function,
//   unmute: Function,
//   speaker: Function,
//   unspeaker: Function,
//   hangupCall: Function,
//   dtmfCall: Function,
// }

// type State = {
//   call: Call,
//   muted: boolean,
//   speaker: boolean,
//   duration: string,
//   activeHangupButton: boolean,
//   calling: boolean,
//   inCall: boolean,
//   showKeypad: boolean,
//   topMarginStatus: Animated.Value,
//   translateXHangup: Animated.Value,

//   showActionCallButtions: boolean,
//   showActionKeypadButtion: boolean,
// }

// class CallScreen extends Component<Props, State> {
//   static navigationOptions = () => ({
//     title: 'Chat',
//     header: null,
//     headerBackTitle: ' ',
//     headerTintColor: '#000',
//     tabBarVisible: false,
//   });

//   static defaultProps = {
//     user: null,
//   };

//   statusText: Text; // eslint-disable-line
//   timer: any; // eslint-disable-line

//   constructor(props: Props) {
//     super(props);

//     let { call } = this.props.sip;

//     if (call instanceof Promise) {
//       call.then(this.onInitializationResponse, this.onInitializationError);
//       call = null;
//     }

//     this.state = {
//       call,
//       muted: false,
//       speaker: false,
//       duration: '00:00',
//       activeHangupButton: true,
//       calling: false,
//       inCall: false,
//       showKeypad: false,

//       topMarginStatus: new Animated.Value(0),
//       translateXHangup: new Animated.Value(-1 * ((66 / 2) + 18)),

//       showActionCallButtions: true,
//       showActionKeypadButtion: false,
//     };
//   }

//   componentDidMount() {
//     InCallManager.start();
//     this.startTimer();

//     fetch('https://google.com')
//       .catch(() => {
//         showInfoAlert('Chưa có kết nối, kiểm tra kết nối của bạn');
//       });

//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.call) {
//       this.setState({
//         call: nextProps.call,
//       });
//     }
//     if (nextProps.call && nextProps.call.getState && nextProps.call.getState() === 'PJSIP_INV_STATE_DISCONNECTED') {
//       this.onCallEnd(nextProps.call);
//     }
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
//   }

//   componentWillUnmount() {
//     InCallManager.stop();
//     if (this.timer) {
//       clearInterval(this.timer);
//     }

//     if (this.state.call) {
//       this.props.hangupCall(this.state.call);
//     }

//     setTimeout(() => {
//       showInfoAlert('Đã kết thúc cuộc gọi');
//     }, 100);
//   }

//   startTimer = () => { // eslint-disable-line
//     const timer = setInterval(() => {
//       this.onTick();
//     }, 1000);

//     this.timer = timer;
//   }

//   isCalling = () => {
//     return this.props.call && this.props.call.getState && this.props.call.getState() !== 'PJSIP_INV_STATE_DISCONNECTED'
//   }

//   onInitializationResponse = (call) => {
//     this.setState({
//       call,
//     });
//   }

//   onTick = () => {
//     if (this.state.call && this.state.call.getState && this.state.call.getFormattedConnectDuration) {
//       const duration = this.state.call.getFormattedConnectDuration();
//       if (this.state.call.getState() === 'PJSIP_INV_STATE_CONFIRMED') {
//         this.setState({
//           duration,

//         });
//       }
//     }

//     if (this.state.call && this.state.call.getState) {
//       if (this.state.call.getState() === 'PJSIP_INV_STATE_EARLY') {
//         this.setState({
//           calling: true,
//         });
//       }
//       else if (this.state.call.getState() === 'PJSIP_INV_STATE_CALLING') {
//         this.setState({
//           calling: true,
//         });
//       }
//       else if (this.state.call.getState() === 'PJSIP_INV_STATE_CONFIRMED') {
//         this.setState({
//           inCall: true,
//           calling: true,
//         });
//       }
//     }
//     // switch (call.getState()) {
//     // case 'PJSIP_INV_STATE_NULL':
//     // case 'PJSIP_INV_STATE_CALLING':
//     // case 'PJSIP_INV_STATE_EARLY':
//     // case 'PJSIP_INV_STATE_CONNECTING':
//     // case 'PJSIP_INV_STATE_CONFIRMED':
//     //   return calculateDimensionsForActiveCall(props)
//     // case 'PJSIP_INV_STATE_INCOMING':
//     //   return calculateDimensionsForIncomingCall(props)
//     // case 'PJSIP_INV_STATE_DISCONNECTED':
//     //   return calculateDimensionsForTerminatedCall(props)
//     // }
//   }

//   onInitializationError(reason: Object) {  // eslint-disable-line
//     // console.log('onInitializationError');
//     // console.log(reason);
//   }

//   onCallHangup = () => {
//     this.props.hangupCall(this.state.call);
//     setTimeout(() => {
//       this.props.navigation.goBack();
//     }, 1000);
//   }

//   onCallAnswer = () => {
//   }

//   onCallRedirect = () => {
//   }

//   onCallChatPress = () => {
//   }

//   onCallMutePress = (muted: boolean) => {
//     this.setState({
//       muted,
//     });
//     muted ? this.props.mute(this.state.call) : this.props.unmute(this.state.call); // eslint-disable-line
//   }

//   onCallSpeakerPress = (speaker: boolean) => {
//     this.setState({
//       speaker,
//     });
//     speaker ? this.props.speaker(this.state.call) : this.props.unspeaker(this.state.call); // eslint-disable-line
//   }

//   onCallEarpiecePress = () => {
//   }

//   onCallTransferPress = () => {
//   }

//   onCallTransferClosePress = () => {
//   }

//   onCallDtmfPress = () => {
//   }

//   onCallHoldPress = () => {
//   }

//   onCallUnHoldPress = () => {
//   }

//   onCallAddPress = () => {
//     // TODO: Put local call on hold while typing digits
//   }

//   onCallAddClosePress = () => {
//   }

//   onCallRedirectPress = () => {
//   }

//   onCallRedirectClosePress = () => {
//   }

//   onIncomingCallAnswer = () => {
//   }

//   onIncomingCallDecline = () => {
//   }

//   onShowKeypadPress = () => {

//     this.setState({
//       showKeypad: !this.state.showKeypad,
//     }, () => {
//       Animated.parallel([
//         Animated.timing(this.state.topMarginStatus, {
//           toValue: this.state.showKeypad ? -32 : 0,
//           duration: 250,
//           easing: Easing.inOut(Easing.quad),
//           delay: 50,
//           useNativeDriver: true,
//         }),
//         Animated.timing(this.state.translateXHangup, {
//           toValue: this.state.showKeypad ? screenWidth / 11 : -1 * ((66 / 2) + 18),
//           duration: 200,
//           easing: Easing.inOut(Easing.quad),
//           delay: 100,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     });

//   }

//   onKeyPress = (key) => {
//     this.props.dtmfCall(this.state.call, key);
//   }

//   onCallEnd = (call) => { // eslint-disable-line
//     this.setState({
//       duration: 'Đã kết thúc cuộc gọi',
//       activeHangupButton: false,
//     });

//     setTimeout(() => {
//       this.props.navigation.goBack();
//     }, 1000);
//   }

//   onCallPhonePress = () => {
//     callAlert('0899909789', () => {
//       this.onCallHangup();
//     });
//   }

//   isCallSupport = (user) => {
//     return user.phoneNumber === Strings.app_support;
//   }

//   renderCallTarget = (user: User) => {
//     const { showKeypad } = this.state;
//     return (
//       <Animated.View
//         style={[styles.targetContainer, {
//           transform: [
//             {
//               translateY: this.state.topMarginStatus,
//             },
//           ],
//         }]}
//       >
//         <Text
//           style={styles.callStatus}
//         >
//           {
//             this.state.duration !== '00:00' ?  // eslint-disable-line
//               this.state.duration
//               : (this.state.calling ? 'Đang gọi...' : 'Đang kết nối...')
//           }
//         </Text>
//         {
//           <Animatable.View
//             style={{ alignItems: 'center' }}
//             duration={250}
//             animation={showKeypad ? 'fadeOut' : 'fadeIn'}
//             useNativeDriver
//           >
//             <Text style={styles.phone}>
//               {user.phoneNumber}
//             </Text>
//             <Text style={styles.name}>
//               {user.fullName}
//             </Text>
//             <View>
//               {
//                 this.isCalling() &&
//                 <Animatable.View
//                   style={{
//                     width: AVATAR_WIDTH,
//                     height: AVATAR_WIDTH,
//                     position: 'absolute',
//                     backgroundColor: '#0000',
//                     borderRadius: AVATAR_WIDTH / 2,
//                     borderColor: '#68bb0b',
//                     borderWidth: 1,
//                   }}
//                   animation="zoomFadeOut"
//                   duration={2000}
//                   easing="ease-out"
//                   iterationCount="infinite"
//                 />
//               }
//               {
//                 this.isCalling() &&
//                 <Animatable.View
//                   style={{
//                     width: AVATAR_WIDTH,
//                     height: AVATAR_WIDTH,
//                     position: 'absolute',
//                     backgroundColor: '#0000',
//                     borderRadius: AVATAR_WIDTH / 2,
//                     borderColor: '#68bb0b',
//                     borderWidth: 1,
//                   }}
//                   delay={500}
//                   animation="zoomFadeOut"
//                   duration={2000}
//                   easing="ease-out"
//                   iterationCount="infinite"
//                 />
//               }
//               <CharAvatar
//                 avatarStyle={styles.avatarImage}
//                 source={user.avatarImageURI() || user.avatar}
//                 defaultName={user.fullName}
//                 textStyle={{
//                   color: '#fff',
//                   fontSize: 52,
//                 }}
//               />
//             </View>
//             {
//               this.isCallSupport(user) &&
//               <Text
//                 style={{
//                   marginTop: 32,
//                   width: screenWidth * 0.8,
//                   color: '#555',
//                   textAlign: 'center',
//                   fontSize: 14,
//                   lineHeight: 20,
//                 }}
//                 numberOfLines={10}
//               >
//                 <Text>
//                   {'Chất lượng cuộc gọi phụ thuộc vào mạng internet của bạn, bấm gọi đến số'}
//                 </Text>
//                 <Text
//                   style={{ color: '#0080DC' }}
//                   onPress={this.onCallPhonePress}
//                 >
//                   {' 0899909789 '}
//                 </Text>
//                 <Text>
//                   {'nếu chất lượng không ổn định '}
//                 </Text>
//               </Text>
//             }
//           </Animatable.View>
//         }
//       </Animated.View>
//     );
//   }

//   renderKeypad = () => {
//     const { showKeypad } = this.state;
//     return (
//       <Animatable.View
//         style={styles.keypadContainer}
//         duration={300}
//         animation={showKeypad ? 'zoomIn' : 'zoomOut'}
//         useNativeDriver
//         pointerEvents={showKeypad ? 'auto' : 'none'}
//       >
//         <Keypad onKeyPress={this.onKeyPress} style={styles.keypad} />
//       </Animatable.View>
//     );
//   }

//   renderBottomControl = () => {
//     const { showKeypad, showActionCallButtions, showActionKeypadButtion } = this.state;
//     return (
//       <View style={styles.bottomControl}>
//         {
//           <Animatable.View
//             style={[
//               styles.rowBottomControl,
//               showActionCallButtions ? {} : { height: 0 },
//             ]}
//             duration={300}
//             animation={showKeypad ? 'fadeOut' : 'fadeIn'}
//             useNativeDriver
//             onAnimationEnd={() => {
//               if (showKeypad) {
//                 this.setState({
//                   showActionCallButtions: false,
//                 });
//               }
//             }}
//             onAnimationBegin={() => {
//               if (!showKeypad) {
//                 this.setState({
//                   showActionCallButtions: true,
//                 });
//               }
//             }}
//           >
//             <ActionButton
//               active={this.state.inCall}
//               selected={this.state.muted}
//               onPress={this.onCallMutePress}
//               type={ACTION_TYPE.MUTE}
//             />
//             <ActionButton
//               active={this.state.inCall}
//               selected={false}
//               onPress={this.onShowKeypadPress}
//               type={ACTION_TYPE.KEYPAD}
//             />
//             <ActionButton
//               active={this.state.calling}
//               selected={this.state.speaker}
//               onPress={this.onCallSpeakerPress}
//               type={ACTION_TYPE.SPEAKER}
//             />
//           </Animatable.View>
//         }
//         <View style={styles.rowBottomControlSecond}>
//           <Animatable.View
//             style={[
//               {
//                 overflow: 'hidden',
//               },
//               showActionKeypadButtion ? {} : { height: 0 },
//               {
//                 transform: [
//                   {
//                     translateX: -1 * (screenWidth / 10),
//                   },
//                 ],
//               },
//             ]}
//             duration={300}
//             animation={showKeypad ? 'fadeIn' : 'fadeOut'}
//             useNativeDriver

//             onAnimationEnd={() => {
//               if (!showKeypad) {
//                 this.setState({
//                   showActionKeypadButtion: false,
//                 });
//               }
//             }}
//             onAnimationBegin={() => {
//               if (showKeypad) {
//                 this.setState({
//                   showActionKeypadButtion: true,
//                 });
//               }
//             }}
//           >
//             <ActionButton
//               active={this.state.activeHangupButton}
//               selected={false}
//               onPress={this.onShowKeypadPress}
//               type={ACTION_TYPE.BACK_KEYPAD}
//             />
//           </Animatable.View>
//           <Animated.View
//             style={[
//               {
//                 overflow: 'hidden',
//               },
//               {
//                 transform: [
//                   {
//                     translateX: this.state.translateXHangup,
//                   },
//                 ],
//               },
//             ]}
//           >
//             <ActionButton
//               active={this.state.activeHangupButton}
//               selected={false}
//               onPress={this.onCallHangup}
//               type={ACTION_TYPE.END_CALL}
//             />
//           </Animated.View>
//         </View>
//       </View>
//     );
//   }

//   render() {
//     const { user } = this.props.navigation.state.params;

//     // if (!call) {
//     // return this.renderCallWait();
//     // }

//     // if (this.props.isScreenLocked === true) {
//     //   return (
//     //     <View style={{ flex: 1, backgroundColor: '#000' }} />
//     //   );
//     // }

//     return (
//       <View style={styles.container}>
//         {this.renderCallTarget(user)}
//         {this.renderKeypad()}
//         {this.renderBottomControl()}
//       </View>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   sip: state.sip,
//   call: state.sip.call,
// });

// const mapDispatchToProps = (dispatch) => ({
//   mute: (call) => dispatch(muteCall(call)),
//   unmute: (call) => dispatch(unmuteCall(call)),
//   speaker: (call) => dispatch(useSpeaker(call)),
//   unspeaker: (call) => dispatch(useEarpiece(call)),
//   hangupCall: (call) => dispatch(hangupCall(call)),
//   dtmfCall: (call, key) => dispatch(dtmfCall(call, key)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(CallScreen);

// const styles = StyleSheet.create({
//   errorContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   errorText: {
//     color: '#FFF',
//   },

//   container: {
//     flex: 1,
//     backgroundColor: colors.navigation_bg,
//   },

//   targetContainer: {
//     marginTop: (Platform.OS === 'ios' && screenHeight > 667) ? 80 : 20,
//     backgroundColor: colors.navigation_bg,
//     alignItems: 'center',
//   },

//   name: {
//     color: '#555',
//     fontSize: 16,
//     marginTop: 8,
//     marginBottom: 32,
//   },

//   phone: {
//     color: '#555',
//     fontSize: 26,
//     // fontWeight: 'bold',
//     marginTop: 16,
//   },

//   callStatus: {
//     color: '#3338',
//     fontSize: 13,
//   },

//   avatarImage: {
//     width: AVATAR_WIDTH,
//     height: AVATAR_WIDTH,
//     borderRadius: AVATAR_WIDTH / 2.0,
//     borderWidth: 1.0,
//     borderColor: '#fff',
//     // marginTop: 32,
//     // marginBottom: 4,
//   },

//   bottomControl: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 4,
//   },
//   rowBottomControl: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginBottom: 12,
//     overflow: 'hidden',
//     marginLeft: 18,
//     marginRight: 18,
//   },
//   rowBottomControlSecond: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//     overflow: 'hidden',
//   },

//   inactiveButton: {
//   },
//   activeButton: {
//   },

//   keypadContainer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 90,
//     top: 50,
//     backgroundColor: '#0000',
//   },

//   keypad: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f000',
//   },
// });
