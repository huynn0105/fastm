import WebRTC from 'react-native-webrtc';
import io from 'socket.io-client';

/* eslint-disable */
import Utils, { getDeviceTrackingInfo } from 'app/utils/Utils';
const LOG_TAG = 'DigitelClient.js';
/* eslint-enable */

const configuration = {
  iceServers: [{
    url: 'turn:103.20.151.83:3478',
    username: 'user',
    credential: 'password',
  }],
};

const SIGNALING_SERVER = 'http://103.20.151.83:4443';

const VIDEO = {
  minWidth: 480 / 2, // Provide your own width, height and frame rate here
  minHeight: 640 / 2,
  minFrameRate: 1,
  // maxWidth: 480 / 1.5, // Provide your own width, height and frame rate here
  // maxHeight: 640 / 1.5,
  maxFrameRate: 14,
};

function logError(error) {
  console.log('logError', error);
}

window.navigator.userAgent = 'react-native';

export default class SignalingService {
  socket = null;
  onFriendLeftCallback = null;
  onFriendConnectedCallback = null;
  onDataChannelMessageCallback = null;
  peerConnections = {}; // map of {socketId: socket.io id, RTCPeerConnection}

  localStream = null;
  friends = null; // list of {socketId, name}
  me;

  connectSignaling = () => {
    this.socket = io.connect(SIGNALING_SERVER, { transports: ['websocket'] });

    this.socket.on('exchange', (data) => {
      this.exchange(data);
    });

    this.socket.on('leave', (socketId) => {
      this.leave(socketId);
    });

    this.socket.on('connect', (data) => { // eslint-disable-line
    });

    this.socket.on('join', (friend) => {
      this.friends.push(friend);
    });
  }

  disconnect = () => {
    this.socket.disconnect();
  }

  createPeerConnection = (friend, isOffer, onDataChannelMessage) => { // eslint-disable-line
    const socketId = friend.socketId;
    const retVal = new WebRTC.RTCPeerConnection(configuration);

    this.peerConnections[socketId] = retVal;

    retVal.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('exchange', { to: socketId, candidate: event.candidate });
      }
    };

    const createOffer = () => {
      retVal.createOffer((desc) => {
        retVal.setLocalDescription(desc, () => {
          this.socket.emit('exchange', { to: socketId, sdp: retVal.localDescription });
        }, logError);
      }, logError);
    };

    retVal.onnegotiationneeded = () => {
      if (isOffer) {
        createOffer();
      }
    };

    retVal.oniceconnectionstatechange = (event) => {
      if (event.target.iceConnectionState === 'connected') {
        createDataChannel();
      }
    };

    retVal.onsignalingstatechange = (event) => { // eslint-disable-line
    };

    retVal.onaddstream = (event) => {
      Utils.warn(`${LOG_TAG} onaddstream: `);
      if (this.onFriendConnectedCallback != null) {
        this.onFriendConnectedCallback(socketId, event.stream);
      }
    };

    retVal.addStream(this.localStream);

    const createDataChannel = () => {
      if (retVal.textDataChannel) {
        return;
      }
      const dataChannel = retVal.createDataChannel('text');

      dataChannel.onerror = (error) => {
        console.log('dataChannel.onerror', error);
      };

      dataChannel.onmessage = (event) => {
        console.log('dataChadnnel.onmessage:', event.data);
        if (this.onDataChannelMessageCallback != null) {
          this.onDataChannelMessageCallback(JSON.parse(event.data));
        }
      };

      dataChannel.onopen = () => {
        console.log('dataChannel.onopen');
      };

      dataChannel.onclose = () => {
        console.log('dataChannel.onclose');
      };

      retVal.textDataChannel = dataChannel;
    };

    return retVal;
  }

  exchange = (data) => {
    const fromId = data.from;
    let pc;
    if (fromId in this.peerConnections) {
      pc = this.peerConnections[fromId];
    } else {
      let friend = this.friends.filter((mfriend) => mfriend.socketId === fromId)[0];
      if (friend == null) {
        friend = {
          socketId: fromId,
          name: '',
        };
      }
      pc = this.createPeerConnection(friend, false);
    }

    if (data.sdp) {
      pc.setRemoteDescription(new WebRTC.RTCSessionDescription(data.sdp), () => {
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer((desc) => {
            pc.setLocalDescription(desc, () => {
              this.socket.emit('exchange', { to: fromId, sdp: pc.localDescription });
            }, logError);
          }, logError);
        }
      }, logError);
    } else {
      pc.addIceCandidate(new WebRTC.RTCIceCandidate(data.candidate));
    }
  }

  leave = (socketId) => {
    const pc = this.peerConnections[socketId];
    if (pc) {
      pc.close();
      delete this.peerConnections[socketId];
    }
    if (this.onFriendLeftCallback != null) {
      this.onFriendLeftCallback(socketId);
    }
  }


  //------------------------------------------------------------------------------
  //  Utils

  countFriends = (roomId, callback) => {
    this.socket.emit('count', roomId, (count) => {
      callback(count);
    });
  }

  switchCamera = () => {
    const tracks = this.localStream.getTracks();
    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      if (!track.remote && track.kind === 'video') {
        track._switchCamera(); // eslint-disable-line
      }
    }
  }

  onOffCamera = () => {
    const tracks = this.localStream.getTracks();
    // --- you might want to check is it an audio or video
    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      if (!track.remote && track.kind === 'video') {
        track.enabled = !track.enabled; // eslint-disable-line
        return track.enabled;
      }
    }
    return true;
  }

  onOffAudio = () => {
    const tracks = this.localStream.getTracks();
    // --- you might want to check is it an audio or video
    for (let i = 0; i < tracks.length; i += 1) {
      const track = tracks[i];
      if (!track.remote && track.kind === 'audio') {
        track.enabled = !track.enabled; // eslint-disable-line
        return track.enabled;
      }
    }
    return true;
  }

  //------------------------------------------------------------------------------
  // Services

  getLocalStream = (isFront, callback) => {
    WebRTC.MediaStreamTrack.getSources(sourceInfos => {
      Utils.warn(`${LOG_TAG} sourceInfos: `, sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i += 1) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'video' && sourceInfo.facing === (isFront ? 'front' : 'back')) {
          videoSourceId = sourceInfo.id;
        }
      }
      WebRTC.getUserMedia({
        audio: true,
        video: {
          mandatory: VIDEO,
          facingMode: (isFront ? 'user' : 'environment'),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : []),
        },
        // video: false,
      }, (stream) => {
        this.localStream = stream;
        callback(stream);
      }, (error) => {
        console.log('Get LocalStream Fail: ', error);
      });
    });
  }

  broadcastMessage = (message) => {
    for (let i = 0; i < this.peerConnections.length; i += 1) {
      const key = this.peerConnections[i];
      const pc = this.peerConnections[key];
      pc.textDataChannel.send(JSON.stringify(message));
    }
  }

  /**
   *
   * callbacks: {
   *    joined: function of () => {},
   *    friendConnected: (socketId, stream) => {},
   *    friendLeft: (socketId) => {},
   *    dataChannelMessage: (message) => {}
   * }
   *
   */
  join = (roomId, name, callbacks) => {
    Utils.warn(`${LOG_TAG} join: `, roomId, name);
    this.onFriendLeftCallback = callbacks.friendLeft;
    this.onFriendConnectedCallback = callbacks.friendConnected;
    this.onDataChannelMessageCallback = callbacks.dataChannelMessage;
    this.socket.emit('join', { roomId, name }, (result) => {
      this.friends = result;
      Utils.warn(`${LOG_TAG} join: `, roomId, name);
      this.friends.forEach((friend) => {
        this.createPeerConnection(friend, true);
      });
      if (callbacks.joined != null) {
        this.me = {
          socketId: this.socket.id,
          name,
        };
        callbacks.joined();
      }
    });
  }

  release = () => {
    Object.keys(this.peerConnections).forEach(key => {
      this.peerConnections[key].close();
    });
    this.localStream.getTracks().forEach(t => t.stop());
    this.localStream.release();
    this.localStream = null;
  }
}
