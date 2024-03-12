import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import ImageResizer from 'react-native-image-resizer';
import { Header } from 'react-navigation';
import { connect } from 'react-redux';
import { CustomModal } from '../../components/CustomModal';
import { FeedbackChatInput } from '../../components/FeedbackChatInput';
import { FeedbackPending } from '../../components/FeedbackChatInput/FeedbackPending';
import ImagesViewer from '../../components/ImagesViewer';
import ListMessageItem, { MESSAGE_TYPE } from '../../components/MessageItem';
import { STATUS_CODE } from '../../components/RoundedTagButton';
import AppText from '../../componentV3/AppText';
import Loading from '../../componentV3/LoadingModal';
import Strings from '../../constants/strings';
import { SH } from '../../constants/styles';
import DigitelClient from '../../network/DigitelClient';
import {
  createAnOSTicket,
  fetchAllListOSTicket,
  fetchOSTicketTopics,
  fetchThreadByTicketNumber,
  postThread,
  updateThreadByTicketNumber,
} from '../../redux/actions/feedback';
import { uploadVideo } from '../../submodules/firebase/FirebaseStorage';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import ImageUtils from '../../utils/ImageUtils';
import iphone12Helper from '../../utils/iphone12Helper';
import { showAlertForRequestPermission } from '../../utils/UIUtils';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { WelcomeFeedback } from './WelcomeFeedback';

const REDUCE_QUALITY = 85;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

export const SCREEN_MODE = {
  WELCOME: 'Welcome',
  START: 'Start',
  OPEN: 'Open',
  RESOLVED: 'Resolved',
  PENDING: 'Pending',
  CLOSED: 'Closed',
};

class ChatFeedbackScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { title = ' ' } = navigation.state.params;
    return {
      title,
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: Colors.neutral5,
        shadowColor: 'transparent',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        borderBottomWidth: 0,
        marginTop: iphone12Helper() ? 12 : 0,
      },
    };
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEmpty(nextProps.osTicketTopics)) {
      if (prevState.feedbackTypes.length === 0) {
        return {
          ...prevState,
          feedbackTypes: nextProps.osTicketTopics.map((item) => ({ ...item })),
        };
      }
    }
    if (
      nextProps.threadByTicketID &&
      nextProps.threadByTicketID.status &&
      nextProps.threadByTicketID.status !== prevState.currentScreenMode
    ) {
      return { ...prevState, currentScreenMode: nextProps.threadByTicketID.status };
    }
    return prevState;
  }

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.screenMode = navigation.getParam('screenMode', SCREEN_MODE.WELCOME);
    this.ticket = navigation.getParam('ticket', {});
    this.feedbackDetails = navigation.getParam('selectedFeedbackDetails');
    const feedbackMessageDefault = navigation.getParam('messageDefault');
    this.state = {
      currentScreenMode: this.screenMode,
      feedbackTypes: [],
      showModal: false,
      pickedImages: [],
      feedBackMessage: feedbackMessageDefault || '',
      uploadingImage: false,
      isImagesViewerHidden: true,
      beginIndex: 0,
      imageViewerURLs: [],
      videoAttach: [],
      isUploadingVideo: false,
      selectedFeedbackDetails: this.ticket.selectedFeedbackDetails || this.feedbackDetails || '',
    };

    // workaroud for dif key ticket_number ticketNumber
    this.ticket.ticket_number = this.ticket.ticket_number || this.ticket.ticketNumber;
    this.ticket.ticketNumber = this.ticket.ticket_number || this.ticket.ticketNumber;

    this.didAppendBotMessage = false;

    this.updateNavigationTitle(this.ticket.ticket_object || 'Gửi yêu cầu hỗ trợ');
  }

  componentDidMount() {
    this.scrollViewRef.scrollToEnd({ animated: true });
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', () => {
      this.scrollViewRef.scrollToEnd({ animated: true });
    });
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {});
    if (!this.props.osTicketTopics || this.props.osTicketTopics.length === 0) {
      this.props.fetchOSTicketTopics();
    }
    if (!_.isEmpty(this.ticket)) {
      this.props.fetchThreadByTicketNumber(this.ticket.ticket_number);
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.props.updateThreadByTicketNumber([]);
  }

  /*  EVENTS
   */

  onModalSendFeedbackPress = () => {
    this.setState({ showModal: false }, () => {
      setTimeout(() => {
        const { myUser } = this.props;
        const { currentScreenMode, feedbackTypes, feedBackMessage, pickedImages, videoAttach } =
          this.state;
        const _feedbackMessage = feedBackMessage.length > 0 ? feedBackMessage : ' ';
        const { ticket_number } = this.ticket;
        switch (currentScreenMode) {
          case SCREEN_MODE.START:
            this.createAnOSTicket(
              myUser,
              feedbackTypes,
              feedBackMessage,
              pickedImages,
              videoAttach,
            );
            break;
          case SCREEN_MODE.PENDING:
          case SCREEN_MODE.OPEN:
            this.postThread(myUser, ticket_number, _feedbackMessage, pickedImages, videoAttach);
            break;
          default:
            break;
        }
      }, 350);
    });
  };

  onModalDismiss = () => {
    this.setState({ showModal: false });
  };

  onAddPhotoPress = () => {
    this.actionSheetPhoto.show();
  };

  onFeedbackChatInputSendButtonPress = () => {
    this.setState({ showModal: true });
  };
  onFeedbackChatInputChangeText = (text) => {
    this.setState({ feedBackMessage: text });
  };

  onRemovePhotoItemPress = (item, index) => {
    const { pickedImages } = this.state;
    pickedImages.splice(index, 1);
    this.setState({
      pickedImages: [...pickedImages],
    });
  };

  onFeedbackTypeItemPress = (_, index) => {
    const { feedbackTypes } = this.state;
    const updatedFeedbackTypes = feedbackTypes.map((item, itemIndex) => {
      // eslint-disable-next-line no-param-reassign
      item.status = index === itemIndex ? STATUS_CODE.SELECTED : STATUS_CODE.UNSELECTED;
      return item;
    });
    this.updateNavigationTitle(
      updatedFeedbackTypes.filter((type) => type.status === STATUS_CODE.SELECTED)[0].topic_name,
    );
    this.setState({
      feedbackTypes: updatedFeedbackTypes,
      // currentScreenMode: SCREEN_MODE.START,
    });
  };

  openCamera = () => {
    this.pickImagesFromDevice('camera').then((response) => {
      if (response === null) return;

      const { pickedImages } = this.state;
      response.forEach((item) => {
        pickedImages.push(item.uri);
      });
      this.setState({
        pickedImages: [...pickedImages],
      });
    });
  };

  openPhoto = () => {
    this.pickImagesFromDevice('photo').then((response) => {
      if (response === null) return;

      const { pickedImages, videoAttach } = this.state;
      response.forEach((item) => {
        if (item?.mime?.startsWith('video')) {
          videoAttach.push(item.uri);
          this.setState({
            videoAttach: [...videoAttach],
          });
        } else {
          pickedImages.push(item.uri);
          this.setState({
            pickedImages: [...pickedImages],
          });
        }
      });
    });
  };

  onImagePress = (listImages, indexImage) => {
    // this.setState({
    //   previewImageURI: item,
    // });

    this.showImagesViewer(listImages, indexImage);
  };
  onCloseImagePress = () => {
    // this.setState({
    //   previewImageURI: '',
    // });
    this.setState({
      isImagesViewerHidden: true,
    });
  };

  /*  PRIVATE
   */
  showImagesViewer(imageURLs, beginIdx) {
    this.setState({
      isImagesViewerHidden: false,
      beginIndex: beginIdx,
      imageViewerURLs: imageURLs,
    });
  }

  updateNavigationTitle = (title) => {
    const { setParams } = this.props.navigation;
    setParams({ title });
  };

  postThread = (myUser, ticketNumber, feedBackMessage, attachImages = [], attachVideo = '') => {
    if (attachVideo && attachVideo.length > 0) {
      attachImages.push(attachVideo);
    }

    let attach = attachImages.filter((image) => image?.length > 0);
    const bodyData = {
      clientUserMail: `${myUser.uid}@appay.vn`,
      ticketNumber,
      ownerMessageType: 'M',
      message: feedBackMessage,
      attach: attach,
      response: feedBackMessage,
      videoUrl: attachVideo,
    };

    this.props.postThread(bodyData, (response) => {
      if (response.status) {
        this.setState({
          feedBackMessage: '',
          currentScreenMode: SCREEN_MODE.OPEN,
          pickedImages: [],
          videoAttach: [],
        });
        this.props.fetchThreadByTicketNumber(this.ticket.ticket_number);
      }
    });
  };

  createAnOSTicket = (
    myUser,
    feedbackTypes,
    feedBackMessage,
    attachImages = [],
    attachVideo = '',
  ) => {
    if (attachVideo && attachVideo.length > 0) {
      attachImages.push(attachVideo);
    }

    let attach = attachImages.filter((image) => image?.length > 0);
    const findSelectedFeedbackTypes = (item) => {
      return item?.status === STATUS_CODE.SELECTED;
    };
    const _selectedTopic = this.props.navigation.getParam('selectedTopic');
    const selectedFeedbackType = feedbackTypes.find(findSelectedFeedbackTypes) || _selectedTopic;
    // console.log('meo', selectedFeedbackType);
    const bodyData = {
      name: myUser.fullName,
      email: `${myUser.uid}@appay.vn`,
      phone: myUser.mPhoneNumber,
      subject: selectedFeedbackType?.topic_name,
      message: feedBackMessage,
      attach: attach,
      topicID: selectedFeedbackType?.topic_id,
      userID: myUser.uid,
      idNumber: myUser.cmnd,
      selectedFeedbackDetails: this.state.selectedFeedbackDetails,
    };

    this.props.createAnOSTicket(bodyData, (response) => {
      if (response.status) {
        this.setState({
          feedBackMessage: '',
          currentScreenMode: SCREEN_MODE.OPEN,
          pickedImages: [],
          videoAttach: [],
        });
        this.ticket = {
          ticket_number: response.ticketNumber,
          selectedFeedbackDetails: this.state.selectedFeedbackDetails,
          ticket_object: selectedFeedbackType?.topic_name,
        };
        this.props.fetchThreadByTicketNumber(response.ticketNumber);
        this.props.fetchAllListOSTicket();
      } else {
        Alert.alert('Không thể gửi phản hồi. Vui lòng thử lại');
      }
    });
  };

  async pickImagesFromDevice(source) {
    const title = 'Chọn hình ảnh minh hoạ';
    const localImgsPromies = new Promise((resolve, reject) => {
      ImageUtils.pickImage(source, true, title, true, 'any')
        .then((response) => {
          if (response) {
            resolve(response);
          } else if (response === false) {
            showAlertForRequestPermission(
              Platform.OS === 'ios'
                ? Strings.camera_access_error
                : Strings.camera_access_error_android,
            );
            reject();
          }
        })
        .catch(() => {
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? Strings.camera_access_error
              : Strings.camera_access_error_android,
          );
          reject();
        });
    });
    let localImgs = await localImgsPromies;
    console.log('jeeeee', localImgs);

    localImgs = await Promise.all(
      localImgs.map((localImg) => {
        if (localImg?.mime?.startsWith('video') || localImg?.type === 'video') {
          return { type: 'video', uri: localImg.uri };
        } else {
          return ImageResizer.createResizedImage(
            localImg.uri,
            MAX_WIDTH,
            MAX_HEIGHT,
            'JPEG',
            REDUCE_QUALITY,
          );
        }
      }),
    );
    return this.uploadImage(
      localImgs.map((item) => {
        return { uri: item?.uri, type: item?.type };
      }),
    );
  }

  getSelectedTopic = () => {
    return this.state.feedbackTypes.find((item) => item.status === STATUS_CODE.SELECTED);
  };

  uploadImage = async (localURIs) => {
    try {
      this.setState({ uploadingImage: true });
      // const remoteURIsPromises = await Promise.all(
      //   localURIs.map((item) => {
      //     console.log('hello', item);
      //     if (!item.type) {
      //       DigitelClient.uploadImage(item?.uri);
      //     } else {
      //       console.log('upload video o day');
      //     }
      //   }),

      // );

      const remoteURIsPromises = await Promise.all(
        localURIs.map(async (item) => {
          if (item.type !== 'video') {
            return DigitelClient.uploadImage(item?.uri);
            // console.log('path image', path);
            // listAttach.push(path);
            // listAttach.push(path);
          } else {
            this.setState({
              isUploadingVideo: true,
            });
            uploadVideo(
              item.uri,
              (progress) => {},
              null,
              (videoUrl) => {
                this.setState({
                  isUploadingVideo: false,
                  videoAttach: videoUrl,
                });
              },
              null,
            );
            // return
          }
        }),
      );
      return remoteURIsPromises.map((url) => ({ uri: url }));
    } catch (error) {
      throw error;
    } finally {
      this.setState({ uploadingImage: false });
    }
  };

  shouldAppendInstantReply = (ticket) => {
    if (this.didAppendBotMessage) return false;
    if (!ticket || !ticket.threads) return false;
    if (ticket.threads.length <= 1) return false;
    const lastMessageType = ticket.threads[ticket.threads.length - 2].type;
    const appendBotMessage =
      ticket.status === SCREEN_MODE.PENDING && lastMessageType === MESSAGE_TYPE.MY_MESSAGE;
    if (appendBotMessage) this.didAppendBotMessage = true;
    return appendBotMessage;
  };

  createInstantReply(ticket) {
    const time = ticket.threads[ticket.threads.length - 2].createdTimeString;
    return {
      thread_id: '0',
      poster: 'Support Team',
      type: 'R',
      topic: `Hỗ trợ MFAST, ${time}`,
      message:
        'Yêu cầu hỗ trợ của bạn đã được ghi nhận thành công. Một nhân viên chuyên trách sẽ phản hồi cho bạn trong thời gian sớm nhất. Xin cảm ơn. ',
      path: '',
      created_date: new Date().getTime(),
    };
  }

  // RENDER

  renderImagesViewer() {
    const { imageViewerURLs, beginIndex } = this.state;
    return (
      <ImagesViewer
        beginIndex={beginIndex}
        imageURLs={imageViewerURLs}
        onBackPress={this.onCloseImagePress}
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

  onStartFeedback = (feedbackDetails) => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollToEnd({ animated: true });
    }

    this.setState({
      currentScreenMode: SCREEN_MODE.START,
      selectedFeedbackDetails: feedbackDetails,
    });
  };

  renderWelcomeFeedback = (feedbackTypes) => {
    const time = moment().format('hh:mm a');
    const _selectedTopic = this.props.navigation.getParam('selectedTopic');
    const selectedTopic = this.getSelectedTopic() || _selectedTopic;

    const { myUser } = this.props;
    if (!_selectedTopic) {
      return (
        <WelcomeFeedback
          feedbackTypes={feedbackTypes}
          messageTitle={`${time}`}
          message={`Xin chào ${myUser?.fullName}!`}
          onFeedbackTypeItemPress={this.onFeedbackTypeItemPress}
          selectedTopic={selectedTopic}
          onStartFeedback={this.onStartFeedback}
        />
      );
    } else {
      return (
        <WelcomeFeedback
          feedbackTypes={feedbackTypes}
          messageTitle={`${time}`}
          message={`Xin chào ${myUser?.fullName}!`}
          onFeedbackTypeItemPress={this.onFeedbackTypeItemPress}
          selectedTopic={selectedTopic}
          onStartFeedback={this.onStartFeedback}
          clientMessageLocal={this.state.selectedFeedbackDetails}
          mFastMessageLocal={'Vui lòng nhập nội dung về vấn đề mà bạn cần hỗ trợ'}
        />
      );
    }
  };

  renderLocalMessage = () => {
    const { myUser } = this.props;
    const selectedFeedback = this.state.feedbackTypes.find(
      (item) => item.topic_name === this.ticket.ticket_object,
    );
    return (
      <WelcomeFeedback
        feedbackTypes={this.state.feedbackTypes}
        // messageTitle={`${time}`}
        message={`Xin chào ${myUser?.fullName}!`}
        onFeedbackTypeItemPress={() => {}}
        selectedTopic={selectedFeedback}
        onStartFeedback={() => {}}
        disableSelect={true}
        clientMessageLocal={this.state.selectedFeedbackDetails}
        mFastMessageLocal={'Vui lòng nhập nội dung về vấn đề mà bạn cần hỗ trợ'}
      />
    );
    // return null;
  };

  renderListMessage = (threadsByTicketID) => {
    return (
      <ListMessageItem
        messages={threadsByTicketID}
        onImagePress={this.onImagePress}
        isSupportMessage
      />
    );
  };

  renderFeedbackChatInput = () => {
    const { pickedImages, feedBackMessage, uploadingImage, videoAttach } = this.state;

    return (
      <FeedbackChatInput
        pickedImages={pickedImages}
        textInputValue={feedBackMessage}
        onAddPhotoPress={this.onAddPhotoPress}
        onSendButtonPress={this.onModalSendFeedbackPress}
        onRemovePhotoItemPress={this.onRemovePhotoItemPress}
        onChangeText={this.onFeedbackChatInputChangeText}
        uploadingImage={uploadingImage}
        videoAttach={videoAttach}
      />
    );
  };

  renderModal = () => (
    <CustomModal
      isShown={this.state.showModal}
      content={
        <View>
          <AppText
            style={{
              ...TextStyles.heading4,
              textAlign: 'center',
              padding: 16,
              paddingBottom: 0,
              color: '#777',
            }}
          >
            {'Xác nhận gửi yêu cầu hỗ trợ '}
          </AppText>
          <AppText style={{ ...TextStyles.heading4, textAlign: 'center', padding: 16 }}>
            {
              'Nội dung yêu cầu càng rõ ràng, đầy đủ, có kèm hình ảnh liên quan ... sẽ nhận được trả lời càng chính xác.'
            }
          </AppText>
          <AppText
            style={{
              ...TextStyles.heading4,
              textAlign: 'center',
              padding: 16,
              paddingTop: 0,
              paddingBottom: 24,
            }}
          >
            {'Vui lòng xác nhận nội dung đã đầy đủ ?'}
          </AppText>
        </View>
      }
      leftButtonTitle="Kiểm tra lại"
      leftButtonTitleStyle={{ color: Colors.neutral2 }}
      rightButtonTitle="Đồng ý gửi"
      rightButtonTitleStyle={{ color: Colors.primary2 }}
      onTouchOutside={this.onModalDismiss}
      onLeftButtonPress={this.onModalDismiss}
      onRightButtonPress={this.onModalSendFeedbackPress}
    />
  );

  renderContent = (currentScreenMode) => {
    const { feedbackTypes } = this.state;
    const { threadByTicketID } = this.props;
    if (this.shouldAppendInstantReply(threadByTicketID)) {
      threadByTicketID.threads.push(this.createInstantReply(threadByTicketID));
    }
    switch (currentScreenMode) {
      case SCREEN_MODE.WELCOME:
        return this.renderWelcomeFeedback(feedbackTypes);
      case SCREEN_MODE.START:
        return this.renderWelcomeFeedback(feedbackTypes);
      case SCREEN_MODE.OPEN:
      case SCREEN_MODE.RESOLVED:
      case SCREEN_MODE.PENDING:
      case SCREEN_MODE.CLOSED:
        return (
          <View>
            {this.renderLocalMessage()}
            {this.renderListMessage(threadByTicketID.threads || [])}
          </View>
        );
      default:
        return null;
    }
  };

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheetPhoto = o;
        }}
        title={'Chọn hình ảnh minh hoạ'}
        options={['Đóng', 'Chụp hình mới', 'Chọn từ Album']}
        cancelButtonIndex={0}
        onPress={(index) => {
          if (index === 1) {
            this.openCamera();
          } else if (index === 2) {
            this.openPhoto();
          }
        }}
      />
    );
  }

  renderImagePreviewModal() {
    const { previewImageURI } = this.state;
    if (!previewImageURI) return null;
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000c',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onCloseImagePress}
        >
          <Animatable.View animation={'zoomIn'} duration={400}>
            <FastImage
              style={{ width: SCREEN_WIDTH * 0.95, aspectRatio: 3 / 4 }}
              source={{ uri: previewImageURI }}
              resizeMode={'contain'}
            />
          </Animatable.View>
          <Image
            style={{ width: 36, height: 36, marginTop: 42, marginBottom: 16 }}
            source={require('./img/ic_close.png')}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { currentScreenMode, isUploadingVideo } = this.state;

    const showFeedbackChatInput =
      currentScreenMode === SCREEN_MODE.OPEN ||
      currentScreenMode === SCREEN_MODE.START ||
      currentScreenMode === SCREEN_MODE.PENDING;
    const showFeedbackPending =
      // currentScreenMode === SCREEN_MODE.PENDING ||
      currentScreenMode === SCREEN_MODE.CLOSED || currentScreenMode === SCREEN_MODE.RESOLVED;
    const showFullScreenLoading =
      this.props.isFetchingOSTicketTopics ||
      this.props.isCreatingAnOSTicket ||
      this.props.isPostingThread ||
      isUploadingVideo;

    const feedbackPendingMessage =
      currentScreenMode === SCREEN_MODE.CLOSE
        ? 'Vui lòng chờ nhân viên hỗ trợ trả lời, trước khi gửi phản hồi khác.'
        : 'Phản hồi này đã đóng.';
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? Header.HEIGHT + SH(20) : 0}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={(ref) => {
                this.scrollViewRef = ref;
              }}
              style={{ backgroundColor: Colors.neutral5, padding: 16 }}
              onContentSizeChange={() => {
                this.scrollViewRef.scrollToEnd({ animated: true });
              }}
              contentContainerStyle={{ justifyContent: 'center' }}
              keyboardShouldPersistTaps={'handled'}
            >
              {this.renderContent(currentScreenMode)}
              <View style={{ height: SH(32) }} />
            </ScrollView>
            {showFeedbackChatInput && this.renderFeedbackChatInput()}
            {showFeedbackPending && <FeedbackPending message={feedbackPendingMessage} />}
            {this.renderModal()}
          </View>
          {this.renderActionSheet()}
          {this.renderImagesViewerModal()}
          <Loading visible={showFullScreenLoading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  fetchAllListOSTicket,
  fetchOSTicketTopics,
  fetchThreadByTicketNumber,
  createAnOSTicket,
  postThread,
  updateThreadByTicketNumber,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,

  isFetchingOSTicketTopics: state.isFetchingOSTicketTopics,
  osTicketTopics: state.osTicketTopics,

  fetchingThreadByTicketNumber: state.fetchingThreadByTicketNumber,
  threadByTicketID: state.threadByTicketID,

  isCreatingAnOSTicket: state.isCreatingAnOSTicket,
  createAnOSTicketResponse: state.createAnOSTicketResponse,

  isPostingThread: state.isPostingThread,
  postThreadResponse: state.postThreadResponse,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatFeedbackScreen);
