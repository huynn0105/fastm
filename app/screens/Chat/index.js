/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import CharAvatar from 'app/components/CharAvatar';
import KJImage from 'app/components/common/KJImage';
import ImagesViewer from 'app/components/ImagesViewer';
import Strings from 'app/constants/strings';
import ContactsManager, { CONTACTS_EVENTS } from 'app/manager/ContactsManager';
import DigitelClient from 'app/network/DigitelClient';
import {
  ALERT_DELETE_MESS,
  ALERT_RECALL_MESS,
  checkDoneTut,
  markDoneTut,
  TUT_CHAT_EMOJI,
} from 'app/utils/AsyncStorageUtil';
import {
  showAlertForRequestPermission,
  showInfoAlert,
  showQuestionAlertWithTitleAndDestructive,
} from 'app/utils/UIUtils';
// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
import md5 from 'md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert,
  Clipboard,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ActionSheet from 'react-native-actionsheet';
import * as Animatable from 'react-native-animatable';
import { Day, GiftedChat, LoadEarlier } from 'react-native-gifted-chat';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import ViewAvatar from '../../components2/PopupRankUser';
import AppText from '../../componentV3/AppText';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import Loading from '../../componentV3/LoadingModal';
import { DeepLinkPaths, EndpointJoinGroupMfast } from '../../constants/configs';
import { SH } from '../../constants/styles';
import { getPresenceStatusUser } from '../../redux/actions/actionsV3/userMetaData';
import {
  acceptRequestContact,
  fetchConversationContacts,
  fetchInvitationsRequests,
  rejectRequestContact,
} from '../../redux/actions/conversationContact';
import BroadcastManager from '../../submodules/firebase/manager/BroadcastManager';
import { CHAT_EVENTS } from '../../submodules/firebase/manager/ChatCenter';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import ChatUploadManager from '../../submodules/firebase/manager/ChatUploadManager';
import { Message, Thread } from '../../submodules/firebase/model';
import { MESSAGE_TYPES } from '../../submodules/firebase/model/Message';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import {
  chatMessageChange,
  chatNewMessage,
  closeChat,
  loadChatMessages,
  loadChatMessageToID,
  openChatWithUser,
  reloadAllThreadsFromDB,
} from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import ImageUtils from '../../utils/ImageUtils';
import { checkAndRequestPermissionLocation } from '../../utils/LocationUtil';
import CommandActionSheet, { ACTION_ITEMS } from './ActionSheet/CommandActionSheet';
import DisableInputToolbar from './DisableInputToolbar';
import ImagePreview from './ImagePreview';
import MessageAudio from './MessageAudio';
import MessageBubble from './MessageBubble';
import MessageImage from './MessageImage';
import MessageText from './MessageText';
import MessageVideo from './MessageVideo';
import MessageView from './MessageView';
import NavigationBar from './NavigationBar';
import PopupCancelInvitation from './PopupCancelInvitation';
import ReactionDetails from './ReactionDetails';
import ReactionView from './ReactionView';
import RecommendTag from './RecommendTag';
import SendButton from './SendButton';
import Toolbar from './Toolbar';
import WelcomeChat from './WelcomeChat';
import ModalMTradeMessage from '../../screenV3/MTrade/common/ModalMTradeMessage';
import { IMAGE_PATH } from '../../assets/path';
const _ = require('lodash');

const LOG_TAG = 'Chat/index.js';
/* eslint-enable */

// --------------------------------------------------

// type of current showing action sheet
const ACTION_SHEET_MESSAGE_LONG_PRESS = 'ACTION_SHEET_MESSAGE_LONG_PRESS';
const ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE = 'ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE';
const ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION = 'ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION';

// delay update my read time in order not to raise too many events
const UPDATE_MY_READTIME_DELAY = 150;

const SCREEN_SIZE = Dimensions.get('window');

const SPLIT_QUOTED = '>>>';

// --------------------------------------------------
// ChatScreen
// --------------------------------------------------

export const STATE_CONTACTS = {
  NONE: 'NONE',
  FRIEND: 'FRIEND',
  INVITATION: 'INVITATION',
  SENDING_REQUEST: 'SENDING_REQUEST',
};

class ChatScreen extends Component {
  static getSingleThreadTargetUserPresence(thread) {
    if (!thread) return 'offline';
    const user = thread.getSingleThreadTargetUser();
    const presence = user ? ContactsManager.shared().getContactPresenceStatus(user.uid) : null;
    return presence;
  }
  static getSingleThreadTargetUserLastOnline(thread) {
    if (!thread) return 'offline';
    const user = thread.getSingleThreadTargetUser();
    const timeOnline = user ? ContactsManager.shared().getContactLastTimeOnline(user.uid) : null;
    return timeOnline;
  }
  constructor(props) {
    super(props);

    // init
    const { thread } = this.props;
    const singleThreadTargetUserPresence = ChatScreen.getSingleThreadTargetUserPresence(thread);
    const isChatDisabled = thread.isChatDisabled();
    const chatDisabledReason = thread.chatDisabledReason();
    const navParams = this.getNavigationParams();
    this.needJoinGroup = !!navParams?.isJoinByLinkShare;
    // get presence status if contact is not in ContactsManager
    if (singleThreadTargetUserPresence === null) {
      this.updateSingleThreadTargetUserPresence();
    }

    // update state
    this.state = {
      singleThreadTargetUserPresence,
      isChatDisabled,
      isChatBlocked: false,
      chatDisabledReason,
      isImagePreviewHidden: true,
      previewImageURI: '',
      isImagesViewerHidden: true,
      imageViewerURLs: [],
      beginIndex: 0,

      canRenderChat: false,
      canRenderMess: false,
      canRenderUtil: false,
      showAvatar: undefined,
      closeAvatar: true,
      quotedText: null,
      quotedID: null,
      quotedType: null,
      scrollingToQuote: false,

      inputHasText: false,

      bottomReactionView: -1,
      hidingReactionView: false,
      showReactionViewWithActionSheet: false,

      uploadingProgress: {},
      expandingPinnedText: false,

      searchTag: null,

      showingReactionResults: null,
      isVerifiedPws: false,
      password: '',
      isShowError: false,
      // For flow add friend in chat
      stateContact: navParams.initialStateContact || STATE_CONTACTS.FRIEND,
      inviter: navParams.inviter || null,
      isLoadingCallAPI: false,
      isShowPopupCancelInvitation: false,
    };

    this.additionBottomValue = 0;
    this.isKeyboardHide = true;
    this.pendingNewMess = [];

    this.readTime = -1;
    this.unreadMess = [];

    this.didAddQuotedPadding = false;

    this.edittingMesssage = null;

    this.bubbleMessgesYPosition = {};
    this.listViewContentHeight = 0;

    this.newMessage = {
      uid: '',
      readTime: -1,
    };
    this.didCheckNewMess = false;

    this.doneTut = true;

    const asyncTask = async () => {
      this.doneTut = await checkDoneTut(TUT_CHAT_EMOJI);
    };

    this.currentReactionMessage = null;
    this.currentSelectedViewThis = null;

    this.numOfLinesActionSheet = 0;

    this.tagData = [];

    asyncTask();
    ChatUploadManager.shared().progressCallback(this.uploadProgressCallback);
  }
  componentWillMount() {
    // get pre-fill message
    const navParams = this.getNavigationParams();
    if (navParams.message) {
      if (navParams !== '') {
        setTimeout(() => {
          this.renderInputText(navParams.message);
        }, 1000);
      }
    }
  }
  componentDidMount() {
    this.addObservers();

    // keyboard events
    Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide);
    Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide);
    Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow);
    Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow);
    // end

    // read messages
    setTimeout(() => {
      this.updateMyReadTime();
    }, 100);

    this.subs = [
      this.props.navigation.addListener('willFocus', this.componentWillFocus),
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
      this.props.navigation.addListener('willBlur', this.componentWillBlur),
    ];

    setTimeout(() => {
      this.setState(
        {
          canRenderChat: true,
        },
        () => {
          setTimeout(() => {
            this.setState(
              {
                canRenderMess: true,
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    canRenderUtil: true,
                  });
                  if (this.richInputRef) {
                    const messageDefault = this.getNavigationParams()?.messageDefault;
                    this.richInputRef.richTextInputChanged(messageDefault || '');
                  }
                }, 1000);
              },
            );
          }, 50);
        },
      );
    }, 50);

    setTimeout(() => {
      this.scrollToNewMess();
    }, 1500);

    setTimeout(() => {
      if (this.props.thread && this.props.thread.uid !== '-9999') {
        this.checkThreadInfoAndUpdate(this.props.thread);
      }
    }, 1500);

    this.mtradeMessageRef.open({
      image: IMAGE_PATH.mascotLoudspeaker,
      titleColor: Colors.sixOrange,
      title: 'Tính năng đang bảo trì',
      content: 'Tính năng nhắn tin với CTV đang được hoàn thiện!',
      actions: [
        {
          title: 'Quay lại',
          onPress: () => {
            this.props.navigation.goBack();
          },
        },
      ],
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.thread.uid &&
      this.props.thread.uid !== '-9999' &&
      this.props.thread.uid !== prevProps.thread.uid
    ) {
      this.checkThreadInfoAndUpdate(this.props.thread);
      const navParams = this.getNavigationParams();
      if (navParams.textAutoSend) {
        this.checkBlockedThread();
      }
    }
  }

  componentWillUnmount() {
    this.removeObservers();

    // keyboard events
    Keyboard.removeListener('keyboardWillShow', this.onKeyboardWillShow);
    Keyboard.removeListener('keyboardDidShow', this.onKeyboardDidShow);
    Keyboard.removeListener('keyboardDidHide', this.onKeyboardDidHide);
    Keyboard.removeListener('keyboardWillHide', this.onKeyboardWillHide);

    this.subs.forEach((sub) => sub.remove());
    this.cancelTyping();
  }

  componentWillFocus = () => {
    // eslint-disable-line
    if (this.checkBlockedThread) {
      this.checkBlockedThread();
    }
  };

  componentDidFocus = () => {
    if (this.checkBlockedThread) {
      this.checkBlockedThread();
    }
    // this.invokeTut();

    setTimeout(() => {
      this.checkForwardingMessage();
    });
  };

  componentWillBlur() {}

  deleteChatThread = async () => {
    const { thread } = this.props;
    try {
      const threadID = thread.uid;
      const result = await ChatManager.shared().deleteThreadChat(threadID);
      if (!result) {
        showInfoAlert(Strings.update_thread_error);
        return;
      }
    } catch (err) {
      showInfoAlert(Strings.update_thread_error);
    }
  };

  checkThreadInfoAndUpdate = (thread) => {
    const usersDetails = thread.usersDetails;
    if (usersDetails) {
      const userIDs = Object.keys(usersDetails);
      for (let i = 0; i < userIDs.length; i += 1) {
        const userID = userIDs[i];
        if (usersDetails[userID].uid && !usersDetails[userID].fullName) {
          this.updateThreadUserData(thread, usersDetails[userID].uid);
        }
      }
    }
  };

  updateThreadUserData = (thread, userID) => {
    const updateThread = async () => {
      const target = await DigitelClient.getUser(userID);
      if (target) {
        await FirebaseDatabase.updateThreadUserData(thread.uid, target);
      }
    };
    updateThread();
  };

  checkForwardingMessage = () => {
    const navParams = this.getNavigationParams();
    if (navParams.forwardingMessage) {
      if (
        !this.forwardingMessage ||
        navParams.forwardingMessage.uid !== this.forwardingMessage.uid
      ) {
        this.forwardingMessage = navParams.forwardingMessage;
        this.displayForwardMessageText(this.forwardingMessage);
      }
    }
  };

  // --------------------------------------------------
  showRecommendTagWithName = (name) => {
    if (this.state.searchTag !== name) {
      this.setState({
        searchTag: name,
      });
    }
  };

  changedTagData = (tagData) => {
    this.tagData = tagData;
  };

  onNavBarBackPress = () => {
    this.props.navigation.goBack();
  };
  onNavBarTitlePress = () => {
    const { thread } = this.props;
    // don't support chat settings for
    // 1. disabled thread
    if (this.state.isChatDisabled) {
      return;
    }
    // 2. public thread
    if (thread.isPublicThread()) {
      return;
    }
    // open chat settings
    this.props.navigation.navigate('ChatSettings', { thread });
  };
  // Gifted Chat events
  // --------------------------------------------------
  onLoadEarlier = () => {
    // Utils.log(`${LOG_TAG}: onLoadEarlier`);
    if (this.props.isChatMessagesCanLoadMore) {
      this.debounceLoadChatMessages(16);
    }
  };

  loadChatMessages = (numOfMess) => {
    if (!this.props.isFetchMessagesProcessing) {
      this.props.loadChatMessages(numOfMess);
    }
  };

  debounceLoadChatMessages = _.debounce(this.loadChatMessages, 100);

  onSend = (messages = []) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (messages.length === 0) {
          return;
        }
        const text = messages[0].text;

        // edit message
        if (this.edittingMesssage) {
          FirebaseDatabase.editMess(this.edittingMesssage.message, text);
          this.edittingMesssage = null;
        }
        // send message
        else {
          // quote
          if (this.didAddQuotedPadding === true) {
            const { quotedID, quotedText, quotedType } = this.state;
            const pureText = text;
            this.sendMessageQuotedText(
              pureText,
              { quotedID, quotedText, quotedType },
              this.tagData,
            );
            this.addQuoted(null);
            this.tagData = [];
          }
          // normal
          else {
            this.sendMessageText(text, this.tagData);
            this.tagData = [];
          }
        }

        if (Platform.OS === 'ios') {
          setTimeout(() => {
            this.setInputTextState(' ');
            setTimeout(() => {
              this.setInputTextState('');
            });
          }, 5);
        }
      }, 5);
    });
    // cancel typing
    setTimeout(() => {
      this.cancelTyping();
    }, 5);
  };
  onMessageLongPress = (actionSheet, giftedMessage, messageViewRef, messageViewThis) => {
    this.showActionSheet(giftedMessage, ACTION_SHEET_MESSAGE_LONG_PRESS);
    this.showSelectedMessageView(giftedMessage, messageViewRef, messageViewThis);
  };

  onLocationLongPress = (giftedMessage, messageViewRef, messageViewThis) => {
    this.showActionSheet(giftedMessage, ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION);
    this.showSelectedMessageView(giftedMessage, messageViewRef, messageViewThis);
  };

  onMessagePress = (message) => {
    // if (message.text) {
    //   const textSlipt = message.text.replace(/^\s+|\s+$/g, '').split(/\s+/);

    //   const arrayLink = textSlipt.filter((item) => {
    //     const urlRegex = /(\b(https|http)?:\/\/[^\s]+)/g;
    //     return item.match(urlRegex);
    //   });

    //   if (arrayLink.length > 0) {
    //     let openUrl = arrayLink[0]?.trim();
    //     if (openUrl.startsWith(EndpointJoinGroupMfast)) {
    //       const threadID = openUrl.split('/')?.[3];
    //       openUrl = `${DeepLinkPaths.JOIN_GROUP}?threadID=${threadID}`;
    //     }
    //     Linking.openURL(openUrl).catch((error) => {
    //     });
    //   }
    // }
    this.onQuotedPress(message);
    this.showReactionViewForMessageID(message.uid);
  };

  onQuotedPress = (message) => {
    let quotedID = message.message.quotedID;
    // for old prop, will be remove soon
    if (!quotedID) {
      quotedID = message.message.quoteID;
    }

    if (quotedID && !quotedID.includes('forward')) {
      const pressOnQuotedMessage = async () => {
        const isExist = await ChatManager.shared().isMessageExistInThread(
          quotedID,
          this.props.thread.uid,
        );
        if (isExist) {
          this.scrollToQuoteID(quotedID);
        } else {
          showInfoAlert('Tin nhắn đã bị xoá');
        }
      };
      pressOnQuotedMessage();
    }
  };

  onPinMessagePress = () => {
    this.setState({
      expandingPinnedText: !this.state.expandingPinnedText,
    });
  };

  onDeletePinMessagePress = () => {
    showQuestionAlertWithTitleAndDestructive('Xoá thông báo', '', 'Xoá', 'Hủy', () => {
      FirebaseDatabase.pinMessage('', this.props.thread.uid);
    });
  };

  onReactionBtnPress = (reactionBtnRef, message) => {
    Keyboard.dismiss();
    setTimeout(
      () => {
        this.showReactionViewOn(reactionBtnRef, message, false);
      },
      this.isKeyboardHide ? 0 : 350,
    );
  };

  onReactionItemPress = (reaction) => {
    const asyncTask = async () => {
      FirebaseDatabase.reaction(reaction, this.currentReactionMessage);
    };
    asyncTask();
    this.onBackgroundReactionBtnTapped();
    this.actionSheet.cancel();
  };

  onReactionResultsPress = (message) => {
    const reactionRawList = message.reaction;

    const members = this.props.thread.usersDetails;
    const reactionList = Object.keys(reactionRawList).map((key) => {
      return {
        uid: key,
        name: members[key].fullName,
        reaction: reactionRawList[key],
      };
    });

    this.setState({
      showingReactionResults: reactionList,
    });
  };

  onBackgroundReactionBtnTapped = () => {
    if (this.state.hidingReactionView === false) {
      this.setState({
        hidingReactionView: true,
      });
      setTimeout(() => {
        this.setState({
          bottomReactionView: -1,
          hidingReactionView: false,
        });
      }, 200);
    }
    if (this.currentSelectedViewThis) {
      this.currentSelectedViewThis.setIsSelected(false);
      this.currentSelectedViewThis = null;

      this.updateBottomForActionsheet(false);
    }
  };

  onBackgroundReactionDetailsTapped = () => {
    this.setState({
      showingReactionResults: null,
    });
  };

  onMessageImageLongPress = (giftedMessage, messageViewRef, messageViewThis) => {
    this.showActionSheet(giftedMessage, ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE);
    this.showSelectedMessageView(giftedMessage, messageViewRef, messageViewThis);
  };

  onMessageImagePress = (giftedMessage) => {
    const imgMess = this.props.messages.filter((mess) => mess.message.getDisplayImage()).reverse();

    let beginIndex = 0;
    for (let i = 0; i < imgMess.length; i += 1) {
      if (giftedMessage.image.includes(imgMess[i].message.getDisplayImage())) {
        beginIndex = i;
        break;
      }
    }
    this.showImagesViewer(
      imgMess.map((mess) => mess.message.getDisplayImage()),
      beginIndex,
    );
  };
  onAccessoryCameraPress = () => {
    this.pickImage('camera', (imageURIs) => {
      if (!imageURIs) {
        return;
      }
      for (let i = 0; i < imageURIs.length; i += 1) {
        const imageURI = imageURIs[i].uri;
        setTimeout(() => {
          this.sendMessageImage(imageURI)
            .then((messageID) => {
              this.uploadImageForMessage(imageURI, messageID);
            })
            .catch((err) => {
              Utils.warn(`${LOG_TAG}: onAccessoryCameraPress. sendMessageImage: ${err}:`, err);
            });
        }, 200 * i);
      }
    });
  };
  onAccessoryPhotoPress = () => {
    this.pickImage('photo', (imageURIs) => {
      if (!imageURIs) {
        return;
      }
      // this.showImagePreview(imageURI);
      for (let i = 0; i < imageURIs.length; i += 1) {
        setTimeout(() => {
          const imageURI = imageURIs[i].uri;
          Utils.log('imageURI', imageURI);
          if (ImageUtils.isImage(imageURI)) {
            this.sendMessageImage(imageURI)
              .then((messageID) => {
                Utils.log('sendMessageImage', imageURI);
                this.uploadImageForMessage(imageURI, messageID);
              })
              .catch(() => {});
          } else {
            this.sendMessageVideo(imageURI)
              .then((messageID) => {
                this.uploadVideoForMessage(imageURI, messageID);
              })
              .catch(() => {});
          }
        }, 200 * i);
      }
    });
  };
  onToolbarBottomChanged = ({ height, forceUpdate }) => {
    let needDelay = false;
    const needDismissKeyboardToShowToolbar = height !== 0 && this.isKeyboardHide === false;
    if (needDismissKeyboardToShowToolbar) {
      Keyboard.dismiss();
      // android has to wait for keybarod did dismiss
      if (Platform.OS === 'android') {
        needDelay = true;
      }
    }

    // update bottom for android
    if (needDelay) {
      setTimeout(() => {
        this.additionBottomValue = height;
        if (this.giftedChat) {
          this.giftedChat.updateHeight();
        }
      }, 450);
    } else {
      this.additionBottomValue = height;
      // force update in cases don't have keyboard events
      if (forceUpdate && this.giftedChat) {
        this.giftedChat.updateHeight();
      }
    }
  };
  onAccessoryLocationPress = () => {
    Keyboard.dismiss();
    setTimeout(
      () => {
        Alert.alert(
          Strings.alert_title,
          Strings.confirm_send_location,
          [
            {
              text: 'Gửi',
              onPress: () => {
                this.sendMessageLocation();
              },
            },
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      },
      this.isKeyboardHide ? 0 : 350,
    );
  };

  onCloseKeyboardPress = () => {
    if (this.giftedChat) {
      this.giftedChat.focusTextInput();
    }
  };

  onChatBackgroundPressed = () => {
    setTimeout(() => {
      Keyboard.dismiss();
      if (this.toolbarRef) {
        this.toolbarRef.dismiss();
      }
    }, 1);
  };

  // Other events
  // --------------------------------------------------

  onOpenChatWithUser = (user) => {
    const userID = user._id; // eslint-disable-line
    this.props.closeChat();
    const asyncTask = async () => {
      try {
        const target = await DigitelClient.getUser(userID);
        if (target) {
          this.props.navigation.goBack();
          this.props.navigation.navigate('Chat');
          setTimeout(() => {
            this.props.openChatWithUser(target);
          }, 0);
        }
      } catch (err) {
        // eslint-disable-line
      }
    };
    asyncTask();
  };

  onToolbarSendAudio = (audioPath) => {
    this.sendMessageAudio(audioPath)
      .then((messageID) => {
        this.uploadAudioForMessage(audioPath, messageID);
      })
      .catch(() => {
        showInfoAlert('Không thành công');
      });
  };

  onStickerPressed = (uid) => {
    this.sendMessageSticker(uid);
  };
  onEmojiPickerEmojiSelected = (emoji) => {
    this.renderAddTextToInputText(emoji);
  };
  onEmojiPickerKeyboardSelected = () => {
    if (this.giftedChat) {
      this.giftedChat.focusTextInput();
    }
  };
  onEmojiDeletePressed = () => {
    this.renderDeleteInputText();
  };
  onImagePreviewBackPress = () => {
    this.hideImagePreview();
    setTimeout(() => {
      this.onAccessoryPhotoPress();
    }, 500);
  };
  onImagePreviewNextPress = (imageURI) => {
    this.hideImagePreview();
    setTimeout(() => {
      this.sendMessageImage(imageURI)
        .then((messageID) => {
          this.uploadImageForMessage(imageURI, messageID);
        })
        .catch((err) => {
          Utils.warn(`${LOG_TAG}.onAccessoryCameraPress.sendMessageImage err:`, err);
          this.showInfoAlert(Strings.create_message_error);
        });
    }, 500);
  };
  onImagesViewerBackPress = () => {
    this.hideImagesViewer();
  };
  onActionSheetPress = (index) => {
    // Utils.log(`${LOG_TAG} onActionSheetPress:`, index);
    if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS) {
      if (index === 1) {
        this.copyMessageText(this.state.longPressMessage);
      } else if (index === 2) {
        this.quoteMessage(this.state.longPressMessage);
      } else if (index === 3) {
        this.openMessageDetails(this.state.longPressMessage);
      } else if (index === 4) {
        this.onMessageDelete(this.state.longPressMessage);
      } else if (index === 5) {
        this.onMessageRecall(this.state.longPressMessage);
      } else if (index === 6) {
        this.onMessageEdit(this.state.longPressMessage);
      }
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE) {
      if (index === 1) {
        this.saveImage(this.state.longPressMessage);
      } else if (index === 2) {
        this.onMessageDelete(this.state.longPressMessage);
      } else if (index === 3) {
        this.onMessageRecall(this.state.longPressMessage);
      }
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION) {
      if (index === 1) {
        this.onMessageDelete(this.state.longPressMessage);
      } else if (index === 2) {
        this.onMessageRecall(this.state.longPressMessage);
      }
    }
  };

  onActionSheetCustomPress = (item) => {
    // Utils.log(`${LOG_TAG} onActionSheetPress:`, index);
    let action = null;
    switch (item.key) {
      case ACTION_ITEMS.COPY.key:
        action = this.copyMessageText;
        break;
      case ACTION_ITEMS.QUOTE.key:
        action = this.quoteMessage;
        break;
      case ACTION_ITEMS.DETAIL.key:
        action = this.openMessageDetails;
        break;
      case ACTION_ITEMS.DELETE.key:
        action = this.onMessageDelete;
        break;
      case ACTION_ITEMS.RECALL.key:
        action = this.onMessageRecall;
        break;
      case ACTION_ITEMS.EDIT.key:
        action = this.onMessageEdit;
        break;
      case ACTION_ITEMS.DOWNLOAD.key:
        action = this.saveImage;
        break;
      case ACTION_ITEMS.FORWARD.key:
        action = this.forwardMessage;
        break;
      case ACTION_ITEMS.PIN.key:
        action = this.pinMessage;
        break;
      default:
        break;
    }
    setTimeout(() => {
      action(this.state.longPressMessage);
    });
    setTimeout(() => {
      this.onBackgroundReactionBtnTapped();
    }, 200);
  };
  onActionSheetCancel = () => {
    this.onBackgroundReactionBtnTapped();
  };

  // android doesn't have keyboardWillShow
  // listen this event for updating margin, prevent glitching UI
  onFocusCompose = () => {
    if (Platform.OS === 'android') {
      this.onKeyboardDidShow();
    }
  };

  onKeyboardWillShow = () => {
    this.isKeyboardHide = false;
    // this.toolBarHide();
  };
  onKeyboardDidShow = () => {
    this.isKeyboardHide = false;
    if (Platform.OS === 'android') {
      // setTimeout(() => {
      //   this.toolBarHide();
      // }, 200);
    }
  };

  toolBarHide = () => {
    if (this.toolbarRef) {
      this.toolbarRef.hide();
    }
  };

  onKeyboardWillHide = () => {
    this.isKeyboardHide = true;
  };
  onKeyboardDidHide = () => {
    this.isKeyboardHide = true;
  };

  onInputTextChanged = (text) => {
    // _.debounce(() => {
    if (text && this.state.inputHasText === false) {
      this.setState({
        inputHasText: true,
      });
    }
    if (!text && this.state.inputHasText === true) {
      this.setState({
        inputHasText: false,
      });
    }
    if (text) {
      this.throttleStartTyping(true);
    }
    // }, 100)();

    if (this.richInputRef) {
      this.richInputRef.richTextInputChanged(text);
    }
  };

  onPressAvatar = (user) => {
    this.setState({
      showAvatar: user,
      closeAvatar: false,
    });
  };

  onTagPress = (userID) => {
    const taggedUsers = this.props.thread.getMembersArray().filter((user) => {
      return user.uid === userID;
    });

    if (taggedUsers.length > 0) {
      const user = {
        _id: taggedUsers[0].uid,
        avatar: taggedUsers[0].avatarImageURI() ? taggedUsers[0].avatarImageURI().uri : '',
        name: taggedUsers[0].fullName,
      };
      this.setState({
        showAvatar: user,
        closeAvatar: false,
      });
    }
  };

  onCloseAvatarPress = () => {
    this.setState({
      closeAvatar: true,
    });
    setTimeout(() => {
      this.setState({
        showAvatar: undefined,
      });
    }, 250);
  };

  onMessageDelete = (giftedMessage) => {
    const asyncTask = async () => {
      const done = await checkDoneTut(ALERT_DELETE_MESS);
      if (!done) {
        showQuestionAlertWithTitleAndDestructive(
          'Xoá tin nhắn',
          'Sau khi xoá, tin nhắn này sẽ chỉ biến mất trên màn hình chat của bạn nhưng vẫn được hiển thị trên màn hình chat của người khác.',
          'Xoá tin nhắn',
          'Hủy',
          () => {
            FirebaseDatabase.deleteMess(giftedMessage.message);
            markDoneTut(ALERT_DELETE_MESS);
          },
        );
      } else {
        FirebaseDatabase.deleteMess(giftedMessage.message);
      }
    };
    asyncTask();
  };

  onMessageRecall = (giftedMessage) => {
    const asyncTask = async () => {
      const done = await checkDoneTut(ALERT_RECALL_MESS);
      if (!done) {
        showQuestionAlertWithTitleAndDestructive(
          'Thu hồi tin nhắn',
          'Sau khi thu hồi, tin nhắn này sẽ biến mất trên tất cả màn hình chat của bạn và những người khác.',
          'Thu hồi',
          'Hủy',
          () => {
            FirebaseDatabase.recallMess(giftedMessage.message);
            markDoneTut(ALERT_RECALL_MESS);
          },
        );
      } else {
        FirebaseDatabase.recallMess(giftedMessage.message);
      }
    };
    asyncTask();
  };
  onMessageEdit = (giftedMessage) => {
    this.edittingMesssage = giftedMessage;
    this.renderInputText(giftedMessage.message.text);
  };
  scrollingChat = ({ nativeEvent }) => {
    if (this.isCloseToTop(nativeEvent)) this.onLoadEarlier();
  };

  onPressRecommendTag = (user) => {
    this.richInputRef.addTag({ username: `@${user.fullName} `, userID: user.uid });
    this.setState({
      searchTag: null,
    });
  };
  // --------------------------------------------------
  uploadProgressCallback = (progress, threadIDmessageID) => {
    const uploadingProgress = {};
    uploadingProgress[threadIDmessageID] = progress;
    this.setState({
      uploadingProgress: { ...this.state.uploadingProgress, ...uploadingProgress },
    });
  };

  cancelTyping = () => {
    this.throttleStartTyping.cancel();
    this.startTyping(false);
  };

  startTyping = (typing) => {
    if (this.props.thread) {
      FirebaseDatabase.typingInThread(typing, this.props.thread.uid);
    }
  };
  throttleStartTyping = _.throttle(this.startTyping, 4000);

  checkIsGroupAndAdmin = () => {
    return (
      !this.props.thread.isSingleThread() && this.props.thread.adminID === this.props.myUser.uid
    );
  };

  checkBlockedThread() {
    const asyncTask = async () => {
      const blocked = this.props.blockedThreads.includes(this.props.thread.uid);
      if (blocked) {
        this.setState({
          isChatBlocked: true,
          chatDisabledReason: 'Bạn đã chặn người này',
        });
        return;
      }

      const beBlocked = await FirebaseDatabase.checkBeBlocked(this.props.thread.uid);
      if (beBlocked) {
        this.setState({
          isChatBlocked: true,
          chatDisabledReason: 'Bạn đã bị chặn bởi người này',
        });
      }

      if (!blocked && !beBlocked) {
        this.setState(
          {
            isChatBlocked: false,
          },
          () => {
            setTimeout(() => {
              const navParams = this.getNavigationParams();
              if (navParams.textAutoSend) {
                const message = Message.newTextMessage(navParams.textAutoSend);
                navParams?.authorTextAutoSend
                  ? this.sendMessageWithAuthor(message, navParams.authorTextAutoSend)
                  : this.sendMessage(message);
              }
            }, 1500);
          },
        );
      }
    };
    asyncTask();
  }

  getOldestMessage() {
    const n = this.state.giftedMessages.length;
    return n > 0 ? this.state.giftedMessages[n - 1] : null;
  }
  getCurrentLocation(callback) {
    checkAndRequestPermissionLocation(callback);
  }

  getNavigationParams() {
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    ) {
      return this.props.navigation.state.params;
    }
    return {};
  }

  getPhoneNumber() {
    if (!this.props.thread.isSingleThread()) {
      return '';
    }
    const contacts = this.props.allContacts;
    const targetUser = this.props.thread.getSingleThreadTargetUser();
    for (let i = 0; i < contacts.length; i += 1) {
      const contact = contacts[i];
      if (contact.uid === targetUser.uid) {
        return contact.phoneNumber;
      }
    }
    return '';
  }

  bottomOffsetIphoneX = () => {
    return 0;
  };

  additionBottomValueActionSheet = () => {
    return this.actionSheet.height - this.inputComposeHeight();
  };

  inputComposeHeight = () => {
    return 44 + this.bottomOffsetIphoneX();
  };

  updateBottomForActionsheet = (isShowActionSheet) => {
    if (
      isShowActionSheet === false &&
      this.additionBottomValue === this.additionBottomValueActionSheet()
    ) {
      setTimeout(() => {
        this.additionBottomValue = 0;
        if (this.giftedChat) {
          this.giftedChat.updateHeight();
        }
      }, 350);
    }
    if (isShowActionSheet === true) {
      setTimeout(() => {
        this.additionBottomValue = this.additionBottomValueActionSheet();
        if (this.giftedChat) {
          this.giftedChat.updateHeight();
        }
      }, 50);
    }
  };

  addObservers() {
    BroadcastManager.shared().addObserver(
      CHAT_EVENTS.THREAD_CHANGE,
      this,
      this.threadChangeHandler,
    );
    BroadcastManager.shared().addObserver(CHAT_EVENTS.NEW_MESSAGE, this, this.newMessageHandler);
    BroadcastManager.shared().addObserver(
      CHAT_EVENTS.MESSAGE_CHANGE,
      this,
      this.messageChangeHandler,
    );
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().addObserver(presenceEvent, this, this.contactPresenceChangeHandler);
  }
  removeObservers() {
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.THREAD_CHANGE, this);
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.NEW_MESSAGE, this);
    BroadcastManager.shared().removeObserver(CHAT_EVENTS.MESSAGE_CHANGE, this);
    const presenceEvent = CONTACTS_EVENTS.CONTACT_PRESENCE_CHANGE;
    ContactsManager.shared().removeObserver(presenceEvent, this);
  }
  newMessageHandler = (message) => {
    // Utils.log(`${LOG_TAG}:.newMessageHandler:`, message);
    if (this.props.thread && this.props.thread.uid === message.threadID) {
      this.pendingNewMess.unshift(message);
      this.debounceNewMessageHandler();
    }
  };

  updateNewMessageHandler = () => {
    if (this.state.canRenderUtil) {
    }
    setTimeout(() => {
      this.props.chatNewMessage(this.pendingNewMess);
      this.pendingNewMess = [];
      this.updateMyReadTime();
    });
  };

  debounceNewMessageHandler = _.debounce(this.updateNewMessageHandler, 50);

  messageChangeHandler = (message) => {
    // Utils.log(`${LOG_TAG}:.messageChangeHandler:`, message);
    if (this.props.thread && this.props.thread.uid === message.threadID) {
      this.props.chatMessageChange(message);
    }
  };
  threadChangeHandler = (thread) => {
    if (this.state.isChatBlocked) {
      return;
    }
    // Utils.log(`${LOG_TAG}.threadChangeHandler: ${thread.uid}`, thread);
    if (this.props.thread && this.props.thread.uid === thread.uid) {
      const isChatDisabled = thread.isChatDisabled();
      const chatDisabledReason = thread.chatDisabledReason();
      this.setState({
        isChatDisabled,
        chatDisabledReason,
      });
    }
    this.updateSingleThreadTargetUserPresence();
  };
  contactPresenceChangeHandler = (contact) => {
    // Utils.log(`${LOG_TAG}.CONTACT_PRESENCE_CHANGE: ${contact.uid}`, contact);
    const { thread } = this.props;
    if (!thread || thread.uid === EMPTY_THREAD_ID) {
      return;
    }
    // --
    const targetUser = this.props.thread.getSingleThreadTargetUser();
    if (targetUser && targetUser.uid === contact.uid) {
      this.setState({
        singleThreadTargetUserPresence: contact.presenceStatus,
      });
    }
  };
  // --------------------------------------------------
  copyMessageText = (giftedMessage) => {
    const message = giftedMessage.message;
    if (message) {
      Clipboard.setString(message.text);
    }
  };

  quotedContentFrom = (message) => {
    let quotedContent = {};
    if (message) {
      const quotedID = message.uid;
      const quotedType = message.type;
      let quotedText = '';
      switch (quotedType) {
        case MESSAGE_TYPES.IMAGES:
          quotedText = message.getDisplayImage();
          if (quotedText) {
            quotedText += `[[${message.width}-${message.height}`;
          }
          break;
        case MESSAGE_TYPES.VIDEOS:
          quotedText = message.getDisplayVideo();
          break;
        case MESSAGE_TYPES.AUDIOS:
          quotedText = message.getDisplayAudio();
          break;
        case MESSAGE_TYPES.LOCATION:
          quotedText = `${message.location.latitude}-${message.location.longitude}`;
          break;

        default:
          quotedText = message.text;
      }

      quotedContent = { quotedID, quotedType, quotedText };
    }
    return quotedContent;
  };

  quoteMessage = (giftedMessage, isForwarding) => {
    const message = giftedMessage.message;
    if (message) {
      const quotedContent = this.quotedContentFrom(message);
      let quotedID = quotedContent.quotedID;
      const quotedType = quotedContent.quotedType;
      let quotedText = quotedContent.quotedText;
      if (!quotedText) {
        showInfoAlert('Nội dung chưa sẵn dùng, vui lòng thử lại sau');
        return;
      }

      const author = message.authorFullName;
      const time = message.createTimeMoment().format('HH:mm DD/MM');
      quotedText = `${
        isForwarding ? 'Từ: ' : ''
      }${author}, ${time}\n${SPLIT_QUOTED}${quotedText}\n`;
      quotedID = isForwarding ? `forward_${quotedID}` : quotedID;
      this.addQuoted(quotedText, quotedID, quotedType);
    }
  };

  displayForwardMessageText = (giftedMessage) => {
    this.quoteMessage(giftedMessage, true);
  };

  forwardMessage = (giftedMessage) => {
    const message = giftedMessage.message;
    if (message) {
      const quotedContent = this.quotedContentFrom(message);
      const quotedID = quotedContent.quotedID;
      const quotedType = quotedContent.quotedType;
      let quotedText = quotedContent.quotedText;
      if (!quotedText) {
        showInfoAlert('Nội dung chưa sẵn dùng, vui lòng thử lại sau');
        return;
      }

      const author = message.authorFullName;
      const time = message.createTimeMoment().format('HH:mm DD/MM');
      quotedText = `${author}, ${time}\n${SPLIT_QUOTED}${quotedText}\n`;

      const forwardingMessage = Message.newTextMessageAndQuote('', {
        quotedType,
        quotedText,
        quotedID,
      });
      setTimeout(() => {
        this.props.navigation.navigate('ForwardScreen', { forwardingMessage, giftedMessage });
      }, 150);
    }
  };

  pinMessage = (giftedMessage) => {
    const message = giftedMessage.message;
    if (message.text && message.text !== '') {
      const result = FirebaseDatabase.pinMessage(message.text, this.props.thread.uid);
      if (result) {
        showInfoAlert('Ghim thành công');
      }
    }
  };

  openMessageDetails = (giftedMessage) => {
    const message = giftedMessage.message;
    if (message) {
      const members = this.props.thread.getMembersArray();
      const readTimes = this.props.thread.readTimes;
      this.props.navigation.navigate('ChatMessageDetails', { message, members, readTimes });
    }
  };
  saveImage = (giftedMessage) => {
    if (giftedMessage.image !== 'video') {
      const url = giftedMessage.image;
      if (url) {
        showInfoAlert(Strings.saving_image);
        ImageUtils.saveImage(url, 'image')
          .then((doneDownload) => {
            if (doneDownload) {
              showInfoAlert(Strings.saving_image_success);
            }
          })
          .catch(() => {
            showInfoAlert(Strings.saving_image_fail);
          });
      }
    } else {
      const url = giftedMessage.video;
      if (url) {
        showInfoAlert(Strings.saving_image);
        ImageUtils.saveImage(url, 'video')
          .then((doneDownload) => {
            if (doneDownload) {
              showInfoAlert(Strings.saving_image_success);
            }
          })
          .catch(() => {
            showInfoAlert(Strings.saving_image_fail);
          });
      }
    }
  };
  pickImage(source, callback) {
    ImageUtils.pickImage(source, '', true)
      .then((response) => {
        if (response) {
          // const imageURI = response ? response.uri : null;
          callback(response);
        } else if (response === false) {
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? Strings.camera_access_error
              : Strings.camera_access_error_android,
          );
        }
      })
      .catch((err) => {
        Utils.warn(`${LOG_TAG}.pickImage: `, err);
        showAlertForRequestPermission(
          Platform.OS === 'ios' ? Strings.camera_access_error : Strings.camera_access_error_android,
        );
      });
  }
  updateSingleThreadTargetUserPresence() {
    const asyncTask = async () => {
      try {
        const { thread } = this.props;
        const user = thread.getSingleThreadTargetUser();
        const presence = await ChatManager.shared().getUserPresence(user.uid);
        if (presence) {
          const userPresence = presence.presenceStatus ? presence.presenceStatus : 'offline';
          this.setState({
            singleThreadTargetUserPresence: userPresence,
          });
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: update user presence err: ${err}`, err);
      }
    };
    asyncTask();
  }
  updateMyReadTime() {
    this.debounceUpdateMyReadTime();
  }
  updateMyReadTimeDelay = () => {
    const { thread } = this.props;
    if (thread === null || thread.uid === EMPTY_THREAD_ID || thread.isPublicThread()) {
      return;
    }
    const threadID = this.props.thread.uid;
    ChatManager.shared().updateMyReadTimeInThread(threadID);
    // this.readTime = -1;
  };
  debounceUpdateMyReadTime = _.debounce(this.updateMyReadTimeDelay, UPDATE_MY_READTIME_DELAY);
  // --------------------------------------------------
  sendMessageSticker(uid) {
    const message = Message.newStickerMessage(uid);
    this.sendMessage(message);
  }
  sendMessageText(text, tagData) {
    const message = Message.newTextMessage(text, tagData);
    this.sendMessage(message);
  }
  sendMessageQuotedText(text, { quotedType, quotedText, quotedID }, tagData) {
    const message = Message.newTextMessageAndQuote(
      text,
      { quotedType, quotedText, quotedID },
      tagData,
    );
    this.sendMessage(message);
  }
  sendMessageImage(imageURL) {
    const messagePromise = Message.newImagesMessage([imageURL]);
    return messagePromise.then((message) => {
      const messID = this.sendMessage(message);
      return messID;
    });
  }
  sendMessageVideo(videoURL) {
    const messagePromise = Message.newVideosMessage([videoURL]);
    return messagePromise.then((message) => {
      const messID = this.sendMessage(message);
      return messID;
    });
  }
  sendMessageAudio(audioURL) {
    const messagePromise = Message.newAudiosMessage([audioURL]);
    return messagePromise.then((message) => {
      const messID = this.sendMessage(message);
      return messID;
    });
  }

  uploadImageForMessage(imageURI, messageID) {
    const { thread } = this.props;
    const threadID = thread.uid;
    Utils.log('uploadImageForMessage', imageURI);
    const imageID = Message.genImageIDFromImageURI(imageURI);
    Utils.log('uploadImageForMessage 2', imageURI);
    ChatUploadManager.shared().addImageUploadTask(imageURI, imageID, threadID, messageID);
  }
  uploadVideoForMessage(videoURI, messageID) {
    const { thread } = this.props;
    const threadID = thread.uid;
    const videoID = Message.genImageIDFromImageURI(videoURI);
    ChatUploadManager.shared().addVideoUploadTask(videoURI, videoID, threadID, messageID);
  }
  uploadAudioForMessage(audioURI, messageID) {
    const { thread } = this.props;
    const threadID = thread.uid;
    const audioID = Message.genImageIDFromImageURI(audioURI);
    ChatUploadManager.shared().addAudioUploadTask(audioURI, audioID, threadID, messageID);
  }

  sendMessageLocation() {
    this.getCurrentLocation((location) => {
      // error
      if (!location) {
        const message = Strings.location_access_error;
        showAlertForRequestPermission(message);

        return;
      }
      // send location
      const message = Message.newLocationMessage(location);
      this.sendMessage(message);
    });
  }
  sendMessage(message) {
    const asyncTask = async () => {
      try {
        const { thread } = this.props;
        const newMessage = await ChatManager.shared().sendMessage(message, thread.uid);
        return newMessage;
      } catch (err) {
        return null;
      }
    };
    this.updateReadMess();
    return asyncTask();
  }
  sendMessageWithAuthor(message, author) {
    const asyncTask = async () => {
      try {
        console.log('sendMessageWithAuthor', this.state.isChatBlocked);
        const { thread } = this.props;
        const newMessage = await ChatManager.shared().sendMessage(message, thread.uid, author);
        return newMessage;
      } catch (err) {
        return null;
      }
    };
    this.updateReadMess();
    return asyncTask();
  }

  setInputTextState = (text) => {
    // this.giftedChat.setState({ text }, () => {
    //   if (this.giftedChat.textInput) {
    //     this.giftedChat.textInput.setNativeProps({ text });
    //   }
    // });

    setTimeout(() => {
      this.onInputTextChanged(text.trim());
    });
  };
  // HELPERs
  // --------------------------------------------------

  showSelectedMessageView = (giftedMessage, messageViewRef, messageViewThis) => {
    setTimeout(
      () => {
        if (messageViewRef) {
          this.showReactionViewOn(messageViewRef, giftedMessage.message, true);
        }

        if (messageViewThis) {
          messageViewThis.setIsSelected(true);
          this.currentSelectedViewThis = messageViewThis;
        }
      },
      this.isKeyboardHide ? 0 : 350,
    );
  };

  showReactionViewOn = (viewRef, message, showReactionViewWithActionSheet) => {
    viewRef.measure((fx, fy, width, height, px, py) => {
      let y = SCREEN_SIZE.height - py;
      if (y > SCREEN_SIZE.height - 68) {
        y = SCREEN_SIZE.height - 68;
      }

      // scroll for cut off message
      const cutoffMessageHeight = SCREEN_SIZE.height - py - height - this.inputComposeHeight();
      if (cutoffMessageHeight < 0) {
        const positionY = this.getMessagePosition(message.uid);
        this.chatListView.scrollTo({ x: 0, y: positionY - height, animated: true });
      }

      // update bottom margin chatlist
      const isCovered =
        y - height < (showReactionViewWithActionSheet ? this.actionSheet.height : 0);
      if (isCovered) {
        setTimeout(() => {
          this.updateBottomForActionsheet(true);
        });
      }

      // show reaction list view
      const isMine = message.authorID === this.props.myUser.uid;
      if (!isMine) {
        setTimeout(
          () => {
            this.currentReactionMessage = message;
            this.setState({
              bottomReactionView:
                y +
                (isCovered ? this.additionBottomValueActionSheet() : 0) +
                (cutoffMessageHeight < 0 ? -cutoffMessageHeight : 0) +
                2 -
                (Platform.OS === 'ios' ? 0 : 16),
              showReactionViewWithActionSheet,
            });
          },
          isCovered ? 300 : 0,
        );
      }
    });
  };
  showActionSheet(giftedMessage, type) {
    this.setState(
      {
        actionSheetType: type,
        longPressMessage: giftedMessage,
      },
      () => {
        Keyboard.dismiss();
        this.actionSheet.show();
      },
    );
  }
  showImagePreview(imageURI) {
    this.setState({
      isImagePreviewHidden: false,
      previewImageURI: imageURI,
    });
  }
  hideImagePreview() {
    this.setState({ isImagePreviewHidden: true });
  }
  showImagesViewer(imageURLs, beginIdx) {
    this.setState({
      isImagesViewerHidden: false,
      beginIndex: beginIdx,
      imageViewerURLs: imageURLs,
    });
  }
  hideImagesViewer() {
    this.setState({ isImagesViewerHidden: true });
  }
  isEmoji(emojiStr) {
    const emojisArray = emojiStr.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);
    return emojisArray !== null && emojisArray.length > 0;
  }

  isLastMessage(message, messages) {
    if (!messages || messages.length === 0) {
      return false;
    }
    const isLast = message.uid === messages[0].uid;
    // && message.authorID === this.props.myUser.uid);

    return isLast;
  }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 150;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  additionBottom = () => {
    return this.additionBottomValue + (this.didAddQuotedPadding ? 60 : 0);
  };

  getMyReadTime = () => {
    if (this.readTime === -1) {
      const readTimes = this.props.thread.readTimes;
      const members = this.props.thread.getMembersArray();
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].isMe()) {
          this.readTime = readTimes[`user_${members[i].uid}`];
        }
      }
    }
    return this.readTime;
  };

  addMessRef = (ref) => {
    if (ref && ref.props.currentMessage.message.authorID !== this.props.myUser.uid) {
      if (
        this.unreadMess.filter(
          (mess) => mess.props.currentMessage.uid === ref.props.currentMessage.uid,
        ).length === 0
      ) {
        if (!ref.checkCurrentIsRead()) {
          this.unreadMess.push(ref);
        }
      }
    }
  };
  updateReadMess = () => {
    this.unreadMess.forEach((mess) => {
      mess.setState({
        read: true,
      });
    });
    this.unreadMess = [];
  };

  addQuoted = (quoted, quotedID, quotedType) => {
    if (quoted !== null) {
      if (this.didAddQuotedPadding !== true) {
        this.invokeQuoted(quoted, quotedID, quotedType, true);
      }
    } else {
      if (this.didAddQuotedPadding !== false) {
        //eslint-disable-line
        this.invokeQuoted(null, quotedID, quotedType, false);
      }
    }
  };

  removeQuotedPress = () => {
    if (this.didAddQuotedPadding !== false) {
      //eslint-disable-line
      this.invokeQuoted(null, null, null, false);
    }
  };

  invokeQuoted = (quotedText, quotedID, quotedType, add) => {
    this.didAddQuotedPadding = add;
    this.setState(
      {
        quotedText,
        quotedType,
        quotedID,
      },
      () => {
        this.giftedChat.updateHeight();
        if (this.state.quotedText) {
          this.giftedChat.textInput.blur();
          setTimeout(() => {
            this.giftedChat.focusTextInput();
          }, 10);
        } else {
          const text = this.giftedChat.state.text;
          this.giftedChat.resetInputToolbar();
          this.setInputTextState(text);
        }
      },
    );
  };

  inFiveMin = (updateTime) => {
    const currentTime = Math.floor(Date.now());
    return currentTime - updateTime <= 5 * (60 * 1000);
  };

  onLayoutMessageView = (layout, key) => {
    this.bubbleMessgesYPosition[key] = layout.y + layout.height;
  };

  scrollToNewMess = () => {
    if (this.newMessage.uid && this.didCheckNewMess === false) {
      this.setState({ scrollingToQuote: true });
      this.scrollToQuoteID(this.newMessage.uid);
    }
    this.didCheckNewMess = true;
  };

  scrollToQuoteID = (quoteID) => {
    setTimeout(() => {
      const y = this.getQuotePosition(quoteID);
      if (y && this.chatListView) {
        if (this.state.scrollingToQuote) {
          this.setState({ scrollingToQuote: false });
        }
        let scrollY = y - this.chatListView?.scrollProperties?.visibleLength || 0;
        if (scrollY < 0) {
          scrollY = 0;
        }
        this.chatListView.scrollTo({ x: 0, y: scrollY, animated: true });
      } else {
        if (this.state.scrollingToQuote === false) {
          // eslint-disable-line
          this.setState({ scrollingToQuote: true });
          this.props.loadChatMessageToID(quoteID);
          this.checkForScrollToQuote(quoteID);
        }
      }
    }, 5);
  };

  getQuotePosition = (quoteID) => {
    const y = this.bubbleMessgesYPosition[`r_s1_${quoteID}`];
    return y;
  };

  getMessagePosition = (messageID) => {
    const y = this.bubbleMessgesYPosition[`r_s1_${messageID}`];
    return y;
  };

  checkForScrollToQuote = (quoteID) => {
    if (this.state.scrollingToQuote) {
      const y = this.getQuotePosition(quoteID);
      if (y) {
        this.scrollToQuoteID(quoteID);
      } else {
        if (this.chatListView) {
          const scrollOffset = this.chatListView?.scrollProperties;
          const top = scrollOffset?.contentLength || 0 - scrollOffset?.visibleLength || 0;
          this.chatListView.scrollTo({ x: 0, y: top, animated: true });
          setTimeout(() => {
            this.checkForScrollToQuote(quoteID);
          }, 200);
        }
      }
    }
  };

  nameFromID = (userID) => {
    return userID;
  };

  // --------------------------------------------------

  showReactionViewForMessageID = () => {
    // if (y)
  };

  renderChatLoadEarlierFunc = (props) => {
    //eslint-disable-line
    return this.props.isChatMessagesCanLoadMore && this.state.canRenderMess ? (
      <LoadEarlier {...props} label={'Tải tin...'} />
    ) : null;
  };
  renderReadMembers = (props) => {
    const isLast = this.isLastMessage(props.message, this.props.messages);
    if (!isLast) {
      return null;
    }

    // detect read members
    const readMembers = [];
    if (isLast) {
      // check is read
      const readTimes = this.props.thread.readTimes;
      const members = this.props.thread.getMembersArray();
      for (let i = 0; i < members.length; i += 1) {
        if (!members[i].isMe()) {
          const readTime = readTimes[`user_${members[i].uid}`];
          if (readTime && readTime > props.message.createTime) {
            readMembers.push(members[i]);
          }
        }
      }
    }
    return readMembers.length === 0 ? (
      this.renderSent(props)
    ) : (
      <View style={styles.statusReadBG}>{this.renderReadListMemberAvatar(readMembers)}</View>
    );
  };
  renderAvatarChat = (props) => {
    return (
      <Animatable.View animation="fadeIn" duration={500} useNativeDriver>
        <CharAvatar
          avatarStyle={{
            height: 36,
            width: 36,
            borderRadius: 18,
          }}
          source={{ uri: props.currentMessage.user.avatar }}
          defaultName={props.currentMessage.user.name}
          onPress={() => props.onPressAvatar && props.onPressAvatar(props.currentMessage.user)}
        />
      </Animatable.View>
    );
  };

  renderDay = (props) => {
    return (
      <Day
        {...props}
        wrapperStyle={[
          props.wrapperStyle,
          {
            backgroundColor: '#4446',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 12,
          },
        ]}
        textStyle={[props.textStyle, { color: '#fff', fontWeight: '400' }]}
      />
    );
  };

  renderSent = (props) => {
    const isReceived = props.message.isReceived;
    let isSent = true;
    if (props.message.type === MESSAGE_TYPES.IMAGES) {
      if (props.image && !props.image.includes('http')) {
        isSent = false;
      }
    }
    let status = isReceived ? 'Đã nhận' : 'Đã gửi';
    if (!isSent) {
      status = 'Đang gửi';
    }
    return props.message.authorID === this.props.myUser.uid ? (
      <View style={styles.statusSentView}>
        <View style={styles.statusSentBG}>
          <AppText style={styles.statusSent}>{status}</AppText>
        </View>
      </View>
    ) : (
      <View style={{ height: 26 }} />
    );
  };
  renderReadMemberAvatar(user) {
    return (
      <CharAvatar
        avatarStyle={styles.avatarImageRead}
        source={user.avatarImageURI()}
        defaultSource={user.avatarImagePlaceholder()}
        defaultName={user.fullName}
        textStyle={styles.textReadStyle}
      />
    );
  }
  renderReadListMemberAvatar = (members) => {
    const size = 8;
    return (
      <View style={{ flex: 0, flexDirection: 'row' }}>
        {members.length > size && (
          <View style={styles.plusMemberBG}>
            <AppText style={styles.plusMemberTitle}>{+(members.length - size)}</AppText>
          </View>
        )}
        {members.slice(0, size).map((member) => this.renderReadMemberAvatar(member))}
      </View>
    );
  };

  renderMessageBubbleFunc = (props) => {
    const isLastMessage = this.isLastMessage(props.currentMessage.message, this.props.messages);
    const isMine = props.currentMessage.message.authorID === this.props.myUser.uid;
    const readtime = this.getMyReadTime();
    const isSingleThread = this.props.thread.isSingleThread();

    if (this.didCheckNewMess === false && readtime < props.currentMessage.message.createTime) {
      if (
        this.newMessage.readTime > props.currentMessage.message.createTime ||
        this.newMessage.readTime === -1
      ) {
        this.newMessage.readTime = props.currentMessage.message.createTime;
        this.newMessage.uid = props.currentMessage.uid;
      }
    }

    return (
      <MessageBubble
        ref={this.addMessRef}
        {...props}
        isLastMessage={isLastMessage}
        isMine={isMine}
        name={props.currentMessage.user.name}
        currentMessage={props.currentMessage}
        prevMessage={props.previousMessage}
        readtime={readtime}
        onMessagePress={this.onMessagePress}
        onMessageLongPress={this.onMessageLongPress}
        type={props.currentMessage.message.type}
        onReactionBtnPress={this.onReactionBtnPress}
        onReactionResultsPress={this.onReactionResultsPress}
        isSingleThread={isSingleThread}
      />
    );
  };

  renderMessageText = (props) => {
    return props.currentMessage.message.type === MESSAGE_TYPES.TEXT ? (
      <MessageText {...props} onTagPress={this.onTagPress} />
    ) : null;
  };
  renderMessageViewFunc = (props) => {
    const message = props.currentMessage.message;
    let isSelf = true;
    if (message.authorID !== this.props.myUser.uid) {
      isSelf = false;
    }
    return (
      <MessageView {...props} isSelf={isSelf} onLocationLongPress={this.onLocationLongPress} />
    );
  };
  renderMessageImageFunc = (props) => {
    const isMine = props.currentMessage.message.authorID === this.props.myUser.uid;
    const isSingleThread = this.props.thread.isSingleThread();
    const uploadingPercent =
      this.state.uploadingProgress[`${this.props.thread.uid}${props.currentMessage.uid}`];
    return props.currentMessage.image === 'audio' ? (
      <MessageAudio {...props} isMine={isMine} />
    ) : props.currentMessage.image === 'video' ? (
      <MessageVideo
        {...props}
        isMine={isMine}
        isSingleThread={isSingleThread}
        uploadingProgress={uploadingPercent}
      />
    ) : (
      <MessageImage
        {...props}
        isMine={isMine}
        isSingleThread={isSingleThread}
        uploadingProgress={uploadingPercent}
      />
    );
  };
  renderSendButtonFunc = (props) => {
    const { text } = props;
    return text.trim().length > 0 ? (
      <Animatable.View animation={'bounceIn'} useNativeDriver>
        <SendButton {...props} />
      </Animatable.View>
    ) : null;
  };
  // --------------------------------------------------
  renderNavigationBar() {
    const { thread } = this.props;
    const { singleThreadTargetUserPresence } = this.state;
    const phoneNumber = this.getPhoneNumber();
    const user = this.props.thread.getSingleThreadTargetUser();

    // thread may empty when go back
    if (thread === null) {
      return null;
    }
    // ---
    return (
      <NavigationBar
        thread={thread}
        singleThreadTargetUserPresence={singleThreadTargetUserPresence}
        phoneNumber={phoneNumber}
        onBackPress={this.onNavBarBackPress}
        onTitlePress={this.onNavBarTitlePress}
        user={user}
        isSingleThread={this.props.thread.isSingleThread()}
        loading={
          this.props.isFetchMessagesProcessing ||
          this.props.isFetchChatNewMessagesProcessing ||
          this.state.scrollingToQuote
        }
      />
    );
  }
  renderNavigationBarSetPassword = () => {
    const { thread } = this.props;
    return (
      <NavigationBar
        thread={null}
        onBackPress={this.onNavBarBackPress}
        title={thread?.titleString() || ''}
      />
    );
  };

  onComparePws = () => {
    const { thread } = this.props;
    const { password } = this.state;
    const navParams = this.getNavigationParams();
    if (!thread || !password) {
      return;
    }
    const isCompare = thread?.password === md5(password);
    if (isCompare && !!navParams?.isJoinByLinkShare) {
      this.joinGroup();
    }
    this.setState({ isVerifiedPws: isCompare, isShowError: !isCompare });
  };

  joinGroup = async () => {
    const { myUser } = this.props;
    const { thread } = this.props;
    const members = [
      {
        avatar: myUser?.avatarImage,
        fullName: myUser?.fullName,
        phone: myUser?.standardPhoneNumber,
        uid: myUser?.uid,
      },
    ];
    const isJoinByLinkShare = true;
    await ChatManager.shared().addUsersToGroupThread(thread?.uid, members, isJoinByLinkShare);
  };

  renderInputPassword = () => {
    const { password, isShowError } = this.state;
    return (
      <View style={styles.passwordContainer}>
        <AppText style={styles.headerTitle}>Nhập mật khẩu để tham gia nhóm</AppText>
        <TextInput
          autoFocus
          value={password}
          secureTextEntry={false}
          autoCapitalize="none"
          onChangeText={(value) => {
            this.setState({ password: value });
          }}
          style={[
            styles.input,
            isShowError && { borderColor: Colors.accent3, backgroundColor: '#ffeaec' },
          ]}
          autoCorrect={false}
          placeholder="Nhập mật khẩu"
        />
        {isShowError && (
          <View style={styles.errorWrapper}>
            <Image source={require('./img/ic_warning.png')} />
            <AppText style={styles.errorTxt}>Mật khẩu không đúng vui lòng thử lại</AppText>
          </View>
        )}
        <SubmitButton
          label="Xác nhận"
          disabled={password?.length < 5}
          onPress={this.onComparePws}
        />
      </View>
    );
  };

  renderInputText(text) {
    if (this.giftedChat) {
      this.setInputTextState(text);
      this.giftedChat.focusTextInput();
    }
  }
  renderAddTextToInputText(text) {
    this.setInputTextState(this.giftedChat.state.text + text);
  }
  renderDeleteInputText() {
    if (this.giftedChat) {
      const str = this.giftedChat.state.text;
      if (this.isEmoji(str.slice(-2))) {
        this.setInputTextState(str.slice(0, -2));
      } else {
        this.setInputTextState(str.slice(0, -1));
      }
    }
  }

  renderInputToolbar = (inputToolbarProps) => {
    if (
      this.state.stateContact === STATE_CONTACTS.FRIEND ||
      this.state.stateContact === STATE_CONTACTS.NONE
    ) {
      return !this.state.isChatDisabled && !this.state.isChatBlocked
        ? this.renderToolbar(inputToolbarProps, this.state.quotedText, this.state.quotedType)
        : this.renderChatDisableInput();
    } else {
      return null;
    }
  };

  renderToolbar = (inputToolbarProps, quoted, quotedType) => {
    return (
      <Toolbar
        ref={(ref) => {
          this.toolbarRef = ref;
        }}
        inputToolbarProps={inputToolbarProps}
        quoted={quoted}
        messageDefault={this?.navParams?.messageDefault || ''}
        quotedType={quotedType}
        inputHasText={this.state.inputHasText}
        didAddQuotedPadding={this.didAddQuotedPadding}
        removeQuotedPress={this.removeQuotedPress}
        setRichInputRef={(ref) => {
          this.richInputRef = ref;
        }}
        showRecommendTagWithName={this.showRecommendTagWithName}
        changedTagData={this.changedTagData}
        onAccessoryCameraPress={this.onAccessoryCameraPress}
        onAccessoryPhotoPress={this.onAccessoryPhotoPress}
        onAccessoryLocationPress={this.onAccessoryLocationPress}
        onToolbarBottomChanged={this.onToolbarBottomChanged}
        onEmojiPickerEmojiSelected={this.onEmojiPickerEmojiSelected}
        onEmojiPickerKeyboardSelected={this.onEmojiPickerKeyboardSelected}
        onEmojiDeletePressed={this.onEmojiDeletePressed}
        onStickerPressed={this.onStickerPressed}
        onSendAudio={this.onToolbarSendAudio}
      />
    );
  };

  renderChatFooter = () => {
    let typingUsers = '';
    const typingThreadData = this.props.typingThreads[this.props.thread.uid];
    if (typingThreadData && typingThreadData.typing) {
      const userIDList = Object.keys(typingThreadData.typing)
        .filter(
          (userID) => typingThreadData.typing[userID] && userID !== `user_${this.props.myUser.uid}`,
        )
        .map((userID) => this.props.thread.usersDetails[userID].fullName);
      if (userIDList.length >= 2) {
        typingUsers = `${userIDList.length} người`;
      } else if (userIDList.length === 1) {
        const words = userIDList[0].split(' ');
        typingUsers = words.length > 0 ? words[words.length - 1] : '';
      }
    }
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 22,
          flexDirection: 'row',
        }}
      >
        {typingUsers.length > 0 && (
          <View
            style={{
              backgroundColor: '#fffa',
              flex: 0,
            }}
          >
            <AppText
              style={{
                margin: 2,
                color: '#666',
                fontWeight: '300',
                marginLeft: 4,
                marginRight: 4,
              }}
            >
              {`${typingUsers} đang soạn tin`}
            </AppText>
          </View>
        )}
        <View style={{ flex: 1 }} />
      </View>
    );
  };

  renderChat = () => {
    const { isFetchMessagesProcessing, isChatMessagesCanLoadMore, thread, messages, myUser } =
      this.props;
    const { isChatDisabled, chatDisabledReason, canRenderMess } = this.state;
    // --
    const placeholder = isChatDisabled ? chatDisabledReason : 'Nhắn tin...';
    const chatBackgroundImage = thread.backgroundImageURI();

    const bottomOffset = 0;
    // --
    return (
      <View style={styles.chatContainer}>
        {chatBackgroundImage ? (
          <KJImage
            resizeMode={'cover'}
            style={styles.chatBackgroundImage}
            fallbackSource={chatBackgroundImage}
            source={chatBackgroundImage}
          />
        ) : null}
        {/* {messages.length === 0 &&
          isFetchMessagesProcessing === false &&
          thread.getSingleThreadTargetUser() !== null && (
            <StartChatView
              name={thread.titleString()}
              myName={myUser.fullName}
              avatar={thread.getSingleThreadTargetUser().avatarImageURI()}
              myAvatar={myUser.avatarImageURI()}
            />
          )} */}
        <GiftedChat
          ref={(object) => {
            this.giftedChat = object;
          }}
          setRefListView={(ref) => {
            this.chatListView = ref;
          }}
          user={{
            _id: this.props.myUser.uid,
            name: this.props.myUser.fullName,
          }}
          placeholder={placeholder}
          messages={canRenderMess ? messages : []}
          // override `onSend` to send message
          onSend={this.onSend}
          loadEarlier={isChatMessagesCanLoadMore}
          isLoadingEarlier={isFetchMessagesProcessing}
          onLoadEarlier={this.onLoadEarlier}
          onLongPress={this.onMessageLongPress}
          onPress={this.onMessagePress}
          onImagePress={this.onMessageImagePress}
          onImageLongPress={this.onMessageImageLongPress}
          onPressAvatar={this.onPressAvatar}
          onInputTextChanged={this.onInputTextChanged}
          onChatBackgroundPressed={this.onChatBackgroundPressed}
          minInputToolbarHeight={54}
          renderInputToolbar={this.renderInputToolbar}
          renderChatFooter={this.renderChatFooter}
          renderSystemMessage={this.renderMessageViewFunc}
          renderMessageImage={this.renderMessageImageFunc}
          renderCustomView={this.renderMessageViewFunc}
          renderBubble={this.renderMessageBubbleFunc}
          renderMessageText={this.renderMessageText}
          renderSend={this.renderSendButtonFunc}
          renderLoadEarlier={this.renderChatLoadEarlierFunc}
          renderReadMembers={this.renderReadMembers}
          renderAvatar={this.renderAvatarChat}
          renderAvatarOnTop
          renderTime={() => null}
          renderDay={this.renderDay}
          renderRecommendTag={this.renderRecommendTag}
          dateFormat="DD/MM/YYYY"
          // wrapperStyle={{ marginTop: 14, marginBottom: 8 }}

          additionBottom={this.additionBottom}
          // pass to textinput in compose component
          textInputProps={{
            textInputRef: this.getRefTextInput,
            onFocus: this.onFocusCompose,
          }}
          listViewProps={{
            scrollEventThrottle: 400,
            onScroll: this.scrollingChat,
          }}
          bottomOffset={bottomOffset}
          keyboardShouldPersistTaps="handled"
          onLayoutMessageView={this.onLayoutMessageView}
        />
        {this.renderPinMessage()}
      </View>
    );
  };

  renderPinMessage = () => {
    if (this.props.thread.isSingleThread()) {
      return null;
    }

    const pinnedText = this.props.thread.pinnedText;
    return pinnedText && pinnedText !== '' ? (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#E6EBFF',
          flexDirection: this.state.expandingPinnedText ? 'column' : 'row',
          padding: 4,
        }}
      >
        <ScrollView style={{ maxHeight: SCREEN_SIZE.height * 0.7 }}>
          <AppText
            style={{ fontStyle: 'italic', padding: 4, flex: 1, color: '#444' }}
            numberOfLines={this.state.expandingPinnedText ? 0 : 2}
          >
            {pinnedText}
          </AppText>
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {this.state.expandingPinnedText && this.checkIsGroupAndAdmin() && (
            <TouchableOpacity
              style={{
                padding: 4,
                paddingLeft: 8,
                paddingRight: 16,
                paddingTop: 8,
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.onDeletePinMessagePress}
            >
              <AppText
                style={{
                  color: '#d22',
                }}
              >
                {'Xóa'}
              </AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              padding: 4,
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 8,
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.onPinMessagePress}
          >
            <AppText
              style={{
                color: '#39B5FC',
              }}
            >
              {this.state.expandingPinnedText ? 'Thu nhỏ' : 'Xem'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  };

  renderRecommendTag = () => {
    if (this.state.searchTag === null) {
      return null;
    }
    const users = this.props.thread
      .getMembersArray()
      .filter((user) => {
        return (
          user.fullName.toLowerCase().includes(this.state.searchTag.toLowerCase()) &&
          user.uid !== this.props.myUser.uid
        );
      })
      .filter((user) => {
        for (let i = 0; i < this.tagData.length; i += 1) {
          if (this.tagData[i][2] === user.uid) {
            return false;
          }
        }
        return true;
      });
    if (users.length === 0) {
      return null;
    }

    return (
      <Animatable.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#E6EBFF',
          flexDirection: this.state.expandingPinnedText ? 'column' : 'row',
          padding: 4,
        }}
        animation="fadeInUp"
        duration={250}
      >
        <RecommendTag users={users} onPress={this.onPressRecommendTag} />
      </Animatable.View>
    );
  };

  renderReactionItems = () => {
    return (
      this.state.bottomReactionView !== -1 && (
        <Animatable.View
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          animation={this.state.hidingReactionView ? 'fadeOut' : 'fadeIn'}
          duration={250}
          useNativeDriver
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={this.onBackgroundReactionBtnTapped}
          >
            <ReactionView
              style={{
                position: 'absolute',
                bottom: this.state.bottomReactionView,
              }}
              onItemPress={this.onReactionItemPress}
            />
          </TouchableOpacity>
        </Animatable.View>
      )
    );
  };

  renderReactionItemsOnTopActionSheet = () => {
    return (
      this.state.bottomReactionView !== -1 && (
        <Animatable.View
          style={{
            position: 'absolute',
            bottom: this.state.bottomReactionView,
            zIndex: 3000,
          }}
          animation={this.state.hidingReactionView ? 'fadeOut' : 'fadeIn'}
          duration={250}
          useNativeDriver
        >
          <ReactionView onItemPress={this.onReactionItemPress} />
        </Animatable.View>
      )
    );
  };

  renderReactionDetails = (results) => {
    return results ? (
      <Animatable.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#4442',
        }}
        animation={this.state.results ? 'fadeOut' : 'fadeIn'}
        duration={250}
        useNativeDriver
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center' }}
          activeOpacity={1}
          onPress={this.onBackgroundReactionDetailsTapped}
        >
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              left: 0,
              right: 0,
            }}
          >
            <ReactionDetails items={results} />
          </View>
        </TouchableOpacity>
      </Animatable.View>
    ) : null;
  };

  getRefTextInput = (ref) => {
    Utils.warn(`${LOG_TAG} this.textInput ref`, ref);
    this.textInput = ref;
  };
  renderChatDisableInput = () => {
    return <DisableInputToolbar title={this.state.chatDisabledReason} />;
  };
  renderImagePreviewModal() {
    const { isImagePreviewHidden, previewImageURI } = this.state;
    return (
      <Modal style={{ margin: 0, padding: 0 }} visible={!isImagePreviewHidden} useNativeDriver>
        <ImagePreview
          imageURI={previewImageURI}
          onBackPress={this.onImagePreviewBackPress}
          onNextPress={this.onImagePreviewNextPress}
        />
      </Modal>
    );
  }
  renderImagesViewer() {
    const { imageViewerURLs, beginIndex } = this.state;
    return (
      <ImagesViewer
        beginIndex={beginIndex}
        imageURLs={imageViewerURLs}
        onBackPress={this.onImagesViewerBackPress}
      />
    );
  }
  renderImagesViewerModal() {
    const { isImagesViewerHidden } = this.state;
    return (
      <Modal style={{ margin: 0, padding: 0 }} visible={!isImagesViewerHidden} useNativeDriver>
        {this.renderImagesViewer()}
      </Modal>
    );
  }
  renderActionSheet() {
    const options = ['Đóng'];
    if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;
      options.push(Strings.copy_message_text);
      options.push(Strings.quote_message_text);
      options.push(Strings.view_message_details);

      if (message.isRecalled !== true) {
        options.push(Strings.delete);
      }

      if (isMine && message.isRecalled !== true) {
        if (this.inFiveMin(message.updateTime)) {
          options.push(Strings.recall);
          options.push(Strings.edit);
        }
      }
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;
      options.push(Strings.save_image_photo);

      if (message.isRecalled !== true) {
        options.push(Strings.delete);
      }

      if (isMine) {
        if (this.inFiveMin(message.updateTime)) {
          options.push(Strings.recall);
        }
      }
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;

      if (message.isRecalled !== true) {
        options.push(Strings.delete);
      }

      if (isMine) {
        if (this.inFiveMin(message.updateTime)) {
          options.push(Strings.recall);
        }
      }
    }
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        options={options}
        cancelButtonIndex={0}
        onPress={this.onActionSheetPress}
      />
    );
  }

  renderActionSheetCustom = () => {
    const actionItems = [];
    if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;
      actionItems.push(ACTION_ITEMS.COPY);
      actionItems.push(ACTION_ITEMS.QUOTE);
      actionItems.push(ACTION_ITEMS.DETAIL);
      actionItems.push(ACTION_ITEMS.FORWARD);

      if (message.isRecalled !== true) {
        actionItems.push(ACTION_ITEMS.DELETE);
      }

      if (isMine && message.isRecalled !== true) {
        if (this.inFiveMin(message.updateTime)) {
          actionItems.push(ACTION_ITEMS.RECALL);
          actionItems.push(ACTION_ITEMS.EDIT);
        }
      }

      if (this.checkIsGroupAndAdmin()) {
        actionItems.push(ACTION_ITEMS.PIN);
      }
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_IMAGE) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;

      actionItems.push(ACTION_ITEMS.QUOTE);
      actionItems.push(ACTION_ITEMS.FORWARD);
      if (message.type !== MESSAGE_TYPES.AUDIOS) {
        actionItems.push(ACTION_ITEMS.DOWNLOAD);
      }

      if (message.isRecalled !== true) {
        actionItems.push(ACTION_ITEMS.DELETE);
      }

      if (isMine) {
        if (this.inFiveMin(message.updateTime)) {
          actionItems.push(ACTION_ITEMS.RECALL);
        }
      }

      actionItems.push(ACTION_ITEMS.DETAIL);
    } else if (this.state.actionSheetType === ACTION_SHEET_MESSAGE_LONG_PRESS_LOCATION) {
      const message = this.state.longPressMessage.message;
      const isMine = message.authorID === this.props.myUser.uid;

      actionItems.push(ACTION_ITEMS.QUOTE);
      actionItems.push(ACTION_ITEMS.FORWARD);
      if (message.isRecalled !== true) {
        actionItems.push(ACTION_ITEMS.DELETE);
      }

      if (isMine) {
        if (this.inFiveMin(message.updateTime)) {
          actionItems.push(ACTION_ITEMS.RECALL);
        }
      }

      actionItems.push(ACTION_ITEMS.DETAIL);
    }

    this.numOfLinesActionSheet = actionItems.length > 4 ? 2 : 1;

    return (
      <CommandActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        actionItems={actionItems}
        onPress={this.onActionSheetCustomPress}
        onCancelCallback={this.onActionSheetCancel}
      />
    );
  };
  // --------------------------------------------------

  onConfirmInvitation = async () => {
    // setIsLoadingCallAPI(true);
    this.setState({
      isLoadingCallAPI: true,
    });
    const inviter = this.state.inviter;
    const requestList = inviter.child;
    if (requestList.length === 1) {
      this.props.acceptRequestContact(inviter.uid, this.props.myUser.uid, (isSuccess) => {
        if (isSuccess) {
          this.setState({
            stateContact: STATE_CONTACTS.FRIEND,
          });
        }
        this.setState({
          isLoadingCallAPI: false,
        });
      });
    } else {
      try {
        const userList = await DigitelClient.mfFetchUserList();
        if (userList.length === 1) {
          const requestForCurrentUser = requestList.filter(
            (_request) => _request.receiverUID === userList[0].ID,
          );
          if (requestForCurrentUser.length > 0) {
            this.props.acceptRequestContact(
              requestForCurrentUser[0].uid,
              this.props.myUser.uid,
              (isSuccess) => {
                if (isSuccess) {
                  this.setState({
                    stateContact: STATE_CONTACTS.FRIEND,
                  });
                }
                this.setState({
                  isLoadingCallAPI: false,
                });
              },
            );
            return;
          }
        }
      } catch (error) {}
    }
  };
  onShowPopupCancelInvitation = () => {
    this.setState({
      isShowPopupCancelInvitation: true,
    });
  };
  onCancelInvitation = () => {
    this.setState(
      {
        isShowPopupCancelInvitation: false,
      },
      () => {
        setTimeout(async () => {
          this.setState({
            isLoadingCallAPI: true,
          });
          const threadID = this.props?.thread.uid;
          const recipient = this.props.thread.getSingleThreadTargetUser();
          const result = await ChatManager.shared().deleteThreadChat(threadID);
          if (result) {
            this.props.rejectRequestContact(recipient?.uid, (isSuccess) => {
              if (isSuccess) {
                this.props.reloadAllThreadsFromDB();
                this.props.navigation.goBack();
              }
              this.setState({
                isLoadingCallAPI: false,
              });
            });
          }
        }, 500);
      },
    );
  };

  render() {
    const {
      canRenderUtil,
      canRenderChat,
      showAvatar,
      isVerifiedPws,
      stateContact,
      isLoadingCallAPI,
      isShowPopupCancelInvitation,
    } = this.state;
    const { appInfo, myUser, thread, messages } = this.props;
    if (thread && thread?.password && !isVerifiedPws && this.needJoinGroup) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderNavigationBarSetPassword()}
          {this.renderInputPassword()}
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {this.renderNavigationBar()}
        <View style={styles.container}>
          <WelcomeChat
            isShow={
              canRenderChat &&
              thread?.isSingleThread() &&
              (!messages?.length ||
                (messages?.length &&
                  (stateContact === STATE_CONTACTS.INVITATION ||
                    stateContact === STATE_CONTACTS.SENDING_REQUEST)))
            }
            state={stateContact}
            recipient={thread?.getSingleThreadTargetUser()}
            isDistinct={thread?.isSingleThread()}
            onCancel={this.onShowPopupCancelInvitation}
            onConfirm={this.onConfirmInvitation}
            members={thread.mUsersDetailsArray}
          />
          {canRenderChat && this.renderChat()}
          {canRenderUtil && this.renderImagePreviewModal()}
          {canRenderUtil && this.renderImagesViewerModal()}
          {/* {canRenderUtil && this.renderActionSheet()} */}
        </View>
        {canRenderUtil && showAvatar && (
          <ViewAvatar
            avatarURI={showAvatar && showAvatar.avatar !== '' ? { uri: showAvatar.avatar } : null}
            name={showAvatar ? showAvatar.name : ''}
            onClosePress={this.onCloseAvatarPress}
            moveIn={showAvatar !== undefined}
            close={this.state.closeAvatar}
            user={showAvatar}
            baseReviewUrl={appInfo?.mFastReviewUserUrl}
            uid={showAvatar._id}
            accessToken={myUser.accessToken}
            showChat={!thread.isSingleThread() && myUser.uid !== showAvatar._id}
            onChatPress={this.onOpenChatWithUser}
          />
        )}
        {this.renderActionSheetCustom()}
        {this.state.showReactionViewWithActionSheet
          ? this.renderReactionItemsOnTopActionSheet()
          : this.renderReactionItems()}
        {this.renderReactionDetails(this.state.showingReactionResults)}
        <Loading visible={isLoadingCallAPI} />
        <PopupCancelInvitation
          isShow={isShowPopupCancelInvitation}
          onConfirm={this.onCancelInvitation}
          onCancel={() =>
            this.setState({
              isShowPopupCancelInvitation: false,
            })
          }
        />
        <ModalMTradeMessage
          ref={(ref) => {
            this.mtradeMessageRef = ref;
          }}
        />
      </View>
    );
  }
}

// --------------------------------------------------

ChatScreen.navigationOptions = () => ({
  title: 'Chat',
  header: null,
  headerBackTitle: ' ',
  // headerStyle: Styles.navigator_header_no_border,
  // headerTitleStyle: Styles.navigator_header_title,
  // headerTintColor: '#000',
  tabBarVisible: false,
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

const EMPTY_THREAD = new Thread();
const EMPTY_THREAD_ID = '-9999';
EMPTY_THREAD.uid = EMPTY_THREAD_ID;

ChatScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isFetchMessagesProcessing: state.isFetchChatMessagesProcessing,
  isChatMessagesCanLoadMore: state.isChatMessagesCanLoadMore,
  thread: state.chatThread ? state.chatThread : EMPTY_THREAD,
  messages: state.chatMessages,
  allContacts: state.allContacts,
  blockedThreads: state.blockedThreads,
  isFetchChatNewMessagesProcessing: state.isFetchChatNewMessagesProcessing,

  currentScreenName: state.currentScreenName,
  allThreads: state.allThreads,
  typingThreads: state.typingThreads,
  appInfo: state.appInfo,
  userMetaData: state.userMetaData.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadChatMessages: (maxMessages) => dispatch(loadChatMessages(maxMessages)),
  chatNewMessage: (message) => dispatch(chatNewMessage(message)),
  chatMessageChange: (message) => dispatch(chatMessageChange(message)),
  loadChatMessageToID: (quotedID) => dispatch(loadChatMessageToID(quotedID)),
  closeChat: () => dispatch(closeChat()),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  getPresenceStatusUser: (userId, callback) => dispatch(getPresenceStatusUser(userId, callback)),
  fetchConversationContacts: (callback) => dispatch(fetchConversationContacts(callback)),
  fetchInvitationsRequests: (callback) => dispatch(fetchInvitationsRequests(callback)),
  acceptRequestContact: (invitationID, acceptedUserID, callback) =>
    dispatch(acceptRequestContact(invitationID, acceptedUserID, callback)),
  rejectRequestContact: (senderID, callback) => dispatch(rejectRequestContact(senderID, callback)),
  reloadAllThreadsFromDB: () => dispatch(reloadAllThreadsFromDB()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  safeViewContainer: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  chatContainer: {
    flex: 1,
    marginBottom: SH(10),
  },
  chatBackgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  statusSentView: {
    alignItems: 'flex-end',
  },
  statusSentBG: {
    alignItems: 'flex-end',
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 2,
    top: -4,
  },
  statusReadBG: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
    marginBottom: 4,
    height: 22,
    borderRadius: 9,
    backgroundColor: '#0000',
    top: -4,
  },
  statusSent: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
  avatarImageRead: {
    marginLeft: 1,
    width: 20,
    height: 20,
    borderRadius: 20 / 2.0,
    // borderWidth: 1.0,
    borderColor: '#fff4',
    backgroundColor: '#fff',
  },
  textReadStyle: {
    fontSize: 11,
    marginLeft: 1,
    fontWeight: '100',
  },
  plusMemberBG: {
    justifyContent: 'center',
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  plusMemberTitle: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
    marginBottom: 3,
  },
  quotedBackground: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1.0,
    borderColor: '#eee',
  },
  quotedAuthor: {
    fontStyle: 'italic',
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 4,
    height: 16,
  },
  quotedText: {
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
    marginLeft: 12,
    height: 20,
  },
  quotedClose: {
    height: 32,
    width: 32,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barButton: {
    width: 46,
    height: 42,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButton: {
    width: 46,
    paddingLeft: 2,
  },
  cameraButton: {
    // width: 50,
    paddingRight: 0,
  },
  photoButton: {
    // width: 50,
    paddingLeft: 0,
    paddingRight: 0,
  },
  locationButton: {
    // width: 50,
    paddingRight: 8,
  },
  input: {
    marginTop: 14,
    marginBottom: 16,
    width: '100%',
    height: 42,
    borderRadius: 5,
    backgroundColor: '#f3fff0',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Colors.primary2,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  passwordContainer: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary1,
  },
  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  errorTxt: {
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.accent3,
    marginLeft: 6,
  },
});
