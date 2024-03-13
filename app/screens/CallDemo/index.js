import React, { Component } from 'react';
import { Text, TouchableHighlight, View, TextInput } from 'react-native';
import Styles from 'app/constants/styles';

// import { showQuestionAlert } from 'app/utils/UIUtils';
// import InCallManager from 'react-native-incall-manager';

// import Thumbnails from './components/Thumbnails.js';
// import FullScreenVideo from './components/FullScreenVideo.js';
// import styles from './style/app.js';

// import SignalingService from './services.js';

// const VIDEO_CONFERENCE_ROOM = 'video_conference';

// const SELF_STREAM_ID = 'self_stream_id';

// /* eslint-disable */
// import Utils, { getDeviceTrackingInfo } from 'app/utils/Utils';
// const LOG_TAG = 'DigitelClient.js';
/* eslint-enable */


export default class CallDemo extends Component {


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     activeStreamId: null,
  //     streams: [], // list of (id, url: friend Stream URL). Id = socketId
  //     joinState: 'ready', // joining, joined
  //     name: 'appay',
  //     numInRoom: 0,
  //     onSpeaker: false,
  //     onMic: true,
  //     onCam: true,
  //   };
  // }

  // componentWillMount() {
  //   const asyncTask = async () => {
  //     this.webRTCServices = new SignalingService();
  //     this.webRTCServices.connectSignaling();
  //   };
  //   asyncTask();
  // }

  // componentDidMount() {
  //   this.webRTCServices.getLocalStream(true, (stream) => {
  //     this.setState({
  //       activeStreamId: SELF_STREAM_ID,
  //       streams: [{
  //         id: SELF_STREAM_ID,
  //         url: stream.toURL(),
  //       }],
  //     });
  //   });

  //   this.webRTCServices.countFriends(VIDEO_CONFERENCE_ROOM, (count) => {
  //     this.setState({
  //       numInRoom: count,
  //     });
  //   });
  // }

  // componentWillUnmount() {
  //   InCallManager.stop();
  //   this.webRTCServices.disconnect();
  //   this.webRTCServices.release();
  // }

  // onOffSpeaker = () => {
  //   const speaker = !this.state.onSpeaker;
  //   InCallManager.setForceSpeakerphoneOn(speaker);
  //   this.setState({
  //     onSpeaker: speaker,
  //   });
  // }

  // onOffMic = () => {
  //   const enable = this.webRTCServices.onOffAudio();
  //   this.setState({
  //     onMic: enable,
  //   });
  // }

  // onOffCam = () => {
  //   const enable = this.webRTCServices.onOffCamera();
  //   this.setState({
  //     onCam: enable,
  //   });
  // }

  // handleSetActive(streamId) {
  //   this.setState({
  //     activeStreamId: streamId,
  //   });
  // }

  // handleJoinClick() {
  //   showQuestionAlert(
  //     'Gọi VIDEO ?', 'VIDEO', 'Đóng',
  //     () => {
  //       if (this.state.name.length === 0 || this.state.joinState !== 'ready') {
  //         return;
  //       }
  //       this.setState({
  //         joinState: 'joining',
  //       });
  //       const callbacks = {
  //         joined: this.handleJoined.bind(this),
  //         friendConnected: this.handleFriendConnected.bind(this),
  //         friendLeft: this.handleFriendLeft.bind(this),
  //         dataChannelMessage: this.handleDataChannelMessage.bind(this),
  //       };
  //       this.webRTCServices.join(VIDEO_CONFERENCE_ROOM, this.state.name, callbacks);
  //     },
  //   );

  // }

  // //----------------------------------------------------------------------------
  // //  WebRTC service callbacks

  // handleJoined() {
  //   Utils.warn(`${LOG_TAG} joined: `);

  //   InCallManager.start({ media: 'audio' });
  //   InCallManager.setForceSpeakerphoneOn(this.state.speaker);

  //   this.setState({
  //     joinState: 'joined',
  //   });
  // }

  // handleFriendLeft(socketId) {
  //   const newState = {
  //     streams: this.state.streams.filter(stream => stream.id !== socketId),
  //   };

  //   if (this.state.activeStreamId === socketId) {
  //     newState.activeStreamId = newState.streams[0].id;
  //   }
  //   this.setState(newState);
  // }

  // handleFriendConnected(socketId, stream) {
  //   Utils.warn(`${LOG_TAG} handleFriendConnected join: `, socketId, stream);
  //   this.setState({
  //     streams: [
  //       ...this.state.streams,
  //       {
  //         id: socketId,
  //         url: stream.toURL(),
  //       },
  //     ],
  //   });
  // }

  // handleDataChannelMessage() {
  // }

  // renderJoinContainer() {
  //   if (this.state.joinState !== 'joined') {
  //     return (
  //       <View style={styles.joinContainer}>
  //         <Text style={styles.joinLabel}>Local signaling, STUN, TURN server</Text>
  //         <Text style={styles.joinLabel}>
  //           {`People in room >= ${this.state.numInRoom}`}
  //         </Text>
  //         <TextInput
  //           style={styles.joinName}
  //           placeholder={'Enter your name'}
  //           placeholderTextColor={'#888'}
  //           onChangeText={(name) => this.setState({ name })}
  //           value={this.state.name}
  //         />
  //         <TouchableHighlight
  //           style={styles.joinButton}
  //           onPress={this.handleJoinClick.bind(this)} // eslint-disable-line
  //         >
  //           <Text style={styles.joinButtonText}>{this.state.joinState === 'ready' ? 'Gọi VIDEO' : 'Joining...'}</Text>
  //         </TouchableHighlight>
  //       </View>
  //     );
  //   }
  //   return null;
  // }


  // render() {
  //   const activeStreamResult = this.state.streams.filter(stream => stream.id === this.state.activeStreamId);
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.backgroundOverlay} />
  //       {
  //         this.state.joinState === 'joined' ?
  //           <Thumbnails
  //             streams={this.state.streams}
  //             setActive={this.handleSetActive.bind(this)} // eslint-disable-line
  //             activeStreamId={this.state.activeStreamId}
  //           />
  //           :
  //           null
  //       }
  //       {
  //         this.state.joinState === 'joined' ?
  //           <FullScreenVideo streamURL={
  //             activeStreamResult.length > 0 ? activeStreamResult[0].url : null
  //           }
  //           />
  //           : null
  //       }
  //       {
  //         this.state.joinState === 'joined' ?
  //           <View style={{
  //             position: 'absolute',
  //             bottom: 4,
  //             left: 8,
  //           }}
  //           >
  //             <TouchableHighlight
  //               style={[styles.joinButton, {
  //                 bottom: 2,
  //               }]}
  //               onPress={
  //                 this.onOffMic
  //               } // eslint-disable-line
  //             >
  //               <Text style={styles.joinButtonText}>{`${this.state.onMic} Mic`}</Text>
  //             </TouchableHighlight>
  //             <TouchableHighlight
  //               style={[styles.joinButton, {
  //                 bottom: 2,
  //               }]}
  //               onPress={
  //                 this.onOffCam
  //               } // eslint-disable-line
  //             >
  //               <Text style={styles.joinButtonText}>{`${this.state.onCam} Cam`}</Text>
  //             </TouchableHighlight>
  //           </View>
  //           : null
  //       }
  //       {
  //         this.state.joinState === 'joined' ?
  //           <View style={{
  //             position: 'absolute',
  //             bottom: 4,
  //             right: 8,
  //           }}
  //           >
  //             <TouchableHighlight
  //               style={[styles.joinButton, {
  //               }]}
  //               onPress={this.onOffSpeaker}
  //             >
  //               <Text style={styles.joinButtonText}>{`${this.state.onSpeaker} Speaker`}</Text>
  //             </TouchableHighlight>
  //             <TouchableHighlight
  //               style={[styles.joinButton, {
  //                 bottom: 2,
  //               }]}
  //               onPress={
  //                 this.webRTCServices.switchCamera
  //               } // eslint-disable-line
  //             >
  //               <Text style={styles.joinButtonText}>Switch cam</Text>
  //             </TouchableHighlight>
  //           </View>
  //           : null
  //       }
  //       {this.renderJoinContainer()}
  //     </View>
  //   );
  // }
}

CallDemo.navigationOptions = () => ({
  title: 'Demo VIDEO',
  headerBackTitle: ' ',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarVisible: false,
});
