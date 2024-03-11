// import { Platform } from 'react-native';
// import { Endpoint } from 'react-native-pjsip';

// import {
//   UPDATE_SIP,
//   CREATE_ACC_SIP,
//   CALL_SIP,
//   TERMINATE_CALL_SIP,
// } from './types';

// const CONFIG_SIP = {
//   name: 'Tu',
//   username: '',
//   domain: '',
//   password: '',
//   proxy: null,
//   transport: null,
//   regServer: null,
//   regTimeout: null, // Default 3600
//   regOnAdd: false,
// };

// export function updateSIP(SIP) {
//   return {
//     type: UPDATE_SIP,
//     payload: SIP,
//   };
// }

// export function createAccSIP(account) {
//   return {
//     type: CREATE_ACC_SIP,
//     payload: account,
//   };
// }

// export function callSIP(call) {
//   return {
//     type: CALL_SIP,
//     payload: call,
//   };
// }

// export function terminateCallSIP(call) {
//   return {
//     type: TERMINATE_CALL_SIP,
//     payload: call,
//   };
// }

// export function initSIP(username, password, domain) {
//   return async (dispatch) => {
//     if (username && username !== '') {
//       const endpoint = new Endpoint();

//       const { settings: endpointSettings, connectivity } = await endpoint.start({
//         service: {
//           ua: Platform.select({ ios: 'RnSIP iOS', android: 'RnSIP Android' }),
//         },
//         network: {
//           useWifi: true,
//           useOtherNetworks: true,
//         },
//       });

//       // Subscribe to endpoint events
//       // endpoint.on('connectivity_changed', (available) => {
//       //   dispatch(onConnectivityChanged(available));
//       // });
//       // endpoint.on('call_received', (call) => {
//       //   dispatch(onCallReceived(call));
//       // });
//       endpoint.on('call_changed', (call) => {
//         dispatch(callSIP(call));
//       });
//       endpoint.on('call_terminated', (call) => {
//         dispatch(onCallSIPTerminated(call));
//       });
//       // endpoint.on('call_screen_locked', (call) => {
//       //   dispatch(onCallScreenLocked(call));
//       // });

//       dispatch(updateSIP({ endpoint, endpointSettings, connectivity }));
//       dispatch(createAccount({ ...CONFIG_SIP, ...{ username, password, domain } }));
//     }
//   };
// }

// export function createAccount(configuration) {
//   return async (dispatch, getState) => {
//     const { endpoint } = getState().sip;
//     const contactUriParams = Platform.select({
//       ios: [
//         ';app-id=com.digitel.appay',
//       ].join(''),
//       android: ';im-type=sip',
//     });

//     const account = await endpoint.createAccount({
//       ...configuration,
//       transport: configuration.transport ? configuration.transport : 'UDP',
//       contactUriParams,
//     });

//     dispatch(createAccSIP(account));

//     return account;
//   };
// }

// export function makeCall(destination, headers) {
//   const options = {
//     headers,
//   };
//   return (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     const account = getState().sip.account;
//     const call = endpoint.makeCall(account, destination, {}, options);
//     dispatch(callSIP(call));
//     return call;
//   };
// }

// export function hangupCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.hangupCall(call);
//   };
// }

// export function declineCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.declineCall(call);
//   };
// }

// export function answerCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.answerCall(call);
//   };
// }

// export function muteCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.muteCall(call);
//   };
// }

// export function unmuteCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.unMuteCall(call);
//   };
// }

// export function holdCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.holdCall(call);
//   };
// }

// export function unholdCall(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.unholdCall(call);
//   };
// }

// export function useSpeaker(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.useSpeaker(call);
//   };
// }

// export function useEarpiece(call) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.useEarpiece(call);
//   };
// }

// export function dtmfCall(call, key) {
//   return async (dispatch, getState) => {
//     const endpoint = getState().sip.endpoint;
//     endpoint.dtmfCall(call, key);
//   };
// }

// /**
//  * Handles call change event.
//  *
//  * @param {Call} call
//  * @returns {Function}
//  */
// export function onCallSIPTerminated(call) {
//   return async (dispatch) => {
//     dispatch(terminateCallSIP(call));
//   };
// }
