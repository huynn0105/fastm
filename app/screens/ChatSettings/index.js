
/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Share,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LottieView from 'lottie-react-native';

import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import TextButton from 'app/common/buttons/TextButton';
import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import ImageUtils from 'app/utils/ImageUtils';
import { showInfoAlert, showQuestionAlert } from 'app/utils/UIUtils';
import MemberRow from 'app/components/MemberRow';
import {EndpointJoinGroupMfast} from '../../constants/configs';
import KJButton from 'app/components/common/KJButton';
import TextInputBox from 'app/components/TextInputBox';
import ImagesRow from 'app/components/ChatImages/ImagesRow';
import VideosRow from 'app/components/ChatVideos/VideosRow';
import ImagesViewer from 'app/components/ImagesViewer';
import AppText from '../../componentV3/AppText';

import NavigationBar from './NavigationBar';
import ThreadRow from './ThreadRow';
import TextRow from './TextRow';

import PopupRankUser from '../../components2/PopupRankUser';

import ChatManager from '../../submodules/firebase/manager/ChatManager';
import PopupPasswordGroup from '../../componentV3/PopupPasswordGroup';

import {
  chatImages,
  loadChatImages,
  closeChat,
  openChatWithUser,
  loadChatImagesFromFirebase,
  loadChatVideosFromFirebase,
} from '../../submodules/firebase/redux/actions';

import {
  block,
  unblock,
} from '../../redux/actions';


// --------------------------------------------------

import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'ChatSettings.js';

const _ = require('lodash');

// --------------------------------------------------
// ChatSettings
// --------------------------------------------------

class ChatSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTextInputVisible: false,
      spinnerText: '',
      isSpinnerVisible: false,
      imagesViewerIndex: 0,
      isImagesViewerHidden: true,
      showAvatar: null,
      closeAvatar: true,
      isVisible: false,
      isFavorited: false,
      isNotification: false
    };
  }
  componentDidMount() {
    this.props.loadChatImagesFromFirebase(128);
    this.props.loadChatVideosFromFirebase(12);
    const { thread } = this.props;
    if(thread) {
      this.setState({
        isFavorited: thread.isFavorite,
        isNotification: thread.isNotificationOn,
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onMemberPress = (user) => {
    const userID = user.uid;
    if (userID === this.props.myUser.uid) {
      return;
    }
    const asyncTask = async () => {
      try {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Chat');

        if (this.props.chatThread !== null) {
          this.props.closeChat();
        }

        setTimeout(() => {
          this.props.openChatWithUser(user);
        }, 0);
      } catch (err) {  // eslint-disable-line
      }
    };
    asyncTask();
  }
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onPhotoPress = () => {
    // don't allow update single thread title
    const { thread } = this.props;
		// console.log("TCL: ChatSettings -> onPhotoPress -> thread", thread)
    if (thread.isSingleThread()) {
      this.onPressAvatar({
        _id: thread?.mSingleThreadTargetUser?.uid,
        avatar: thread?.mSingleThreadTargetUser?.avatarImage || '',
        name: thread?.mSingleThreadTargetUser?.fullName || '',
      })
      return;
    }
    // --
    ImageUtils.pickAndUploadImage(
      null, 256, 256,
      (step) => {
        if (step === 'resize') {
          this.showSpinner();
        }
      }, null,
      (step, err) => {
        Utils.warn(`${LOG_TAG}: pickAndUploadImage err: ${step}`, err);
        this.hideSpinner();
        const message = step === 'pick' ? Strings.camera_access_error : Strings.update_thread_error;
        showInfoAlert(message);
      },
      (downloadURL) => {
        if (!downloadURL || downloadURL.length === 0) { return; }
        this.updateThreadMetadata(null, downloadURL);
      },
    );
  }
  onBackgroundPress = () => {
    if (this.actionSheet) {
      this.actionSheet.show();
    }
  }
  onPinMessagePress = () => {
    this.props.navigation.navigate('PinMessage');
  }
  onTitlePress = () => {
    // don't allow update single thread title
    const { thread } = this.props;
    if (thread.isSingleThread()) {
      return;
    }
    // prompt input
    this.showTextInput();
  }
  onNotificationToggle = (isOn) => {
    this.setState({ isNotification: isOn });
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().toggleMyNotificationOnInThread(threadID, isOn);
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onNotificationToggle err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  onFavoriteToggle = (isOn) => {
    this.setState({ isFavorited: isOn });
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().toggleMyFavoriteInThread(threadID, isOn);
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
          return;
        }
      } catch (err) {
        Utils.warn(`${LOG_TAG}: onFavoriteToggle err: ${err}`, err);
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  onBlockToggle = (isOn) => {
    const thread = this.props.thread;
    if (thread.isSingleThread()) {
      const targetUser = thread.getSingleThreadTargetUser();
      if (!isOn) {
        showQuestionAlert(
          `Bạn có muốn bỏ chặn ${thread.titleString()}`, 'Đồng ý', 'Đóng',
          () => {
            this.props.unblock(targetUser.uid);
          },
        );
      }
      else {
        showQuestionAlert(
          `Bạn có muốn chặn ${thread.titleString()}`, 'Đồng ý', 'Đóng',
          () => {
            this.props.block(targetUser.uid);
          },
        );
      }
    }
  }
  onRemoveMemberPress = (member) => {
    this.removeThreadMember(member);
  }
  onAddMemberPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('AddChatMember', { thread });
  }
  onLeavePress = () => {
    showQuestionAlert(
      Strings.leave_thread_confirm, 'Đồng ý', 'Đóng',
      () => {
        this.leaveThread();
      },
    );
  }
  onChatImagePress = (image, index) => {
    this.setState({
      imagesViewerIndex: index,
      isImagesViewerHidden: false,
    });
  }
  onChatVideoPress = () => {
  }
  onImagesViewerBackPress = () => {
    this.setState({
      imagesViewerIndex: 0,
      isImagesViewerHidden: true,
    });
  }

  onViewMoreMemberPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('ChatMembers', { thread });
  }
  onViewMoreImagesPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('ChatImages', { thread });
  }
  onViewMoreVideosPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('ChatVideos', { thread });
  }
  onShareLinkJoinGroupPress = () => {
    const { thread } = this.props;
    Share.share({ message: `${EndpointJoinGroupMfast}/${thread?.uid}` });
  }
  onClosePopup = () => {
    this.setState({ isVisible: false });
  }

  onSetPasswordGroupPress = () => {
    this.setState({ isVisible: true });
  }
  // --------------------------------------------------
  updateThreadBackground(source) {
    ImageUtils.pickAndUploadImage(
      source, 1024, 1024,
      (step) => {
        if (step === 'resize') {
          this.showSpinner();
        }
      }, null,
      (step, err) => {
        Utils.warn(`${LOG_TAG}: pickAndUploadImage err: ${step}`, err);
        this.hideSpinner();
        const message = step === 'pick' ? Strings.camera_access_error : Strings.update_thread_error;
        showInfoAlert(message);
      },
      (downloadURL) => {
        if (!downloadURL || downloadURL.length === 0) { return; }
        this.updateThreadMetadata(null, null, downloadURL);
      },
    );
  }
  removeThreadBackground() {
    this.updateThreadMetadata(null, null, '');
  }
  updateThreadMetadata(title = null, photoImage = null, backgroundImage = null) {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().updateThreadMetadata(threadID, {
          title,
          photoImage,
          backgroundImage,
        });
        this.hideSpinner();
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
        } else {
          showInfoAlert(Strings.update_thread_success);
        }
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  removeThreadMember(member) {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().removeUsersFromGroupThread(threadID, [member]);
        this.hideSpinner();
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
        }
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  }
  leaveThread() {
    this.showSpinner();
    const asyncTask = async () => {
      try {
        const threadID = this.props.thread.uid;
        const result = await ChatManager.shared().leaveGroupThread(threadID);
        this.hideSpinner();
        // error
        if (!result) {
          showInfoAlert(Strings.leave_thread_error);
          return;
        }
        // back to chat
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 250);
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.leave_thread_error);
      }
    };
    asyncTask();
  }
  // --------------------------------------------------
  showTextInput() {
    this.setState({
      isTextInputVisible: true,
    });
  }
  hideTextInput() {
    this.setState({
      isTextInputVisible: false,
    });
  }
  showSpinner(text = 'Đang xử lý') {
    this.setState({
      isSpinnerVisible: true,
      spinnerText: text,
    });
  }
  hideSpinner() {
    this.setState({
      isSpinnerVisible: false,
    });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    return (
      <NavigationBar
        onClosePress={this.onClosePress}
      />
    );
  }
  renderThreadDetails() {
    const { thread } = this.props;
    return (
      <View style={styles.threadDetailsCotainer} key="thread_detail">
        <ThreadRow
          thread={thread}
          onPhotoPress={this.onPhotoPress}
          onTitlePress={this.onTitlePress}
        />
      </View>
    );
  }
  renderSettings() {
    const { thread, blockedThreads, myUser, threadPublicIds } = this.props;
    const {isNotification, isFavorited} = this.state;
    const blocked = blockedThreads.includes(thread.uid);
    const isAdmin = thread.adminID === myUser.uid;
    const isPublicThread = threadPublicIds.some(threadId => threadId === thread?.uid);
    return (
      <View style={styles.settingsContainer} key="thread_settings">
        <View style={styles.sectionHeaderContainer}>
          <AppText style={styles.sectionHeaderText}>
            {'Cài đặt tin nhắn'}
          </AppText>
        </View>
        {((!thread.isSingleThread() && isAdmin && isPublicThread) || 
        (!thread.isSingleThread() && !isPublicThread)) && 
          <TextRow
            title={'Chia sẻ link tham gia nhóm'}
            details={''}
            isArrowHidden={false}
            onPress={this.onShareLinkJoinGroupPress}
          />
        }
        {(!thread.isSingleThread() && thread.adminID === myUser.uid) && 
          <TextRow
            title={'Đặt mật khẩu nhóm'}
            details={''}
            isArrowHidden={false}
            onPress={this.onSetPasswordGroupPress}
          />
        }
        <TextRow
          title={'Hình nền'}
          details={''}
          isArrowHidden={false}
          onPress={this.onBackgroundPress}
        />
        {
          !this.props.thread.isSingleThread() && this.props.thread.adminID === this.props.myUser.uid &&
          <TextRow
            title={'Ghim thông báo'}
            details={''}
            isArrowHidden={false}
            onPress={this.onPinMessagePress}
          />
        }
        <TextRow
          title={'Thông báo'}
          details={''}
          switchValue={isNotification}
          isSwitchHidden={false}
          onSwitchValueChange={this.onNotificationToggle}
        />
        <TextRow
          title={'Thêm vào danh sách yêu thích'}
          details={''}
          switchValue={isFavorited}
          isSwitchHidden={false}
          isSeparatorHidden={!thread.isSingleThread()}
          onSwitchValueChange={this.onFavoriteToggle}
        />
        {
          thread.isSingleThread() &&
          <TextRow
            title={'Chặn trò chuyện'}
            details={''}
            switchValue={blocked}
            isSwitchHidden={false}
            isSeparatorHidden
            onSwitchValueChange={this.onBlockToggle}
          />
        }
      </View>
    );
  }
  renderMembers() {
    // don't render member of single thread
    const { thread, threadPublicIds, myUser } = this.props;
    const isAdmin = thread.adminID === myUser.uid;
    const isHideMembers = threadPublicIds.some(threadId => threadId === thread?.uid);
    if(isHideMembers && !isAdmin) {
      return <View />;
    }
    if (thread.isSingleThread()) { return null; }
    // render
    const members = thread.getMembersArray().reverse();
    if (members.length >= 2) {
      for (let i = 0; i < members.length; i += 1) {
        if (members[i].isMe()) {
          if (i === 1) { break; }
          const temp = members[1];
          members[1] = members[i];
          members[i] = temp;
          break;
        }
      }
      for (let i = 0; i < members.length; i += 1) {
        if (thread.adminID === members[i].uid) {
          if (i === 0) { break; }
          const temp = members[0];
          members[0] = members[i];
          members[i] = temp;
          break;
        }
      }
    }

    const maxSize = 5;
    return (
      <View style={styles.membersContainer} key="thread_members">
        {this.renderMembersSectionHeader()}
        {members.slice(0, maxSize).map(user => this.renderMember(user))}
        {
          members.length > maxSize &&
          <ViewMoreRow
            title="Xem thêm"
            key="load_more_members"
            onPress={this.onViewMoreMemberPress}
          />
        }
      </View>
    );
  }
  renderMembersSectionHeader() {
    const { thread } = this.props;
    const members = thread.getUsersArray();
    return (
      <View style={styles.sectionHeaderContainer} key="thread_members_header">
        <AppText style={styles.sectionHeaderText}>
          {`Thành viên (${members.length})`}
        </AppText>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={this.onAddMemberPress}
        >
          <AppText
            style={{
              fontSize: 12,
              color: '#7f7f7f',
              marginRight: 4,
            }}
          >
            {'Thêm Thành viên'}
          </AppText>
          <KJButton
            containerStyle={{}}
            leftIconSource={require('./img/add_contact.png')}
            leftIconStyle={{ marginLeft: 2 }}
            onPress={this.onAddMemberPress}
          />
        </TouchableOpacity>
      </View>
    );
  }
  renderMember(user) {
    const { myUser, thread } = this.props;
    const isDeleteAble = thread.adminID === myUser.uid && user.uid !== myUser.uid;
    return (
      <MemberRow
        key={user.uid}
        user={user}
        isDeleteButtonHidden={!isDeleteAble}
        onDeletePress={this.onRemoveMemberPress}
        isAdmin={thread.adminID === user.uid}
        onRowPress={this.onMemberPress}
      />
    );
  }
  renderSharedContent() {
    const maxSize = 3;
    return (
      <View style={styles.sharedContentContainer} key="thread_sharecontent">
        <View style={styles.sectionHeaderContainer}>
          <AppText style={styles.sectionHeaderText}>
            {`Hình ảnh chung (${this.props.chatImages.length})`}
          </AppText>
          {
            this.props.isFetchingChatImageMessages &&
            <View
              style={{ width: 16, height: 16 }}
            >
              <LottieView
                style={{ flex: 1, width: 16, height: 16 }}
                source={require('./img/loading.json')}
                autoPlay
                loop
              />
            </View>
          }
        </View>
        <ImagesRow
          images={this.props.chatImages.slice(0, maxSize)}
          onImagePress={this.onChatImagePress}
        />
        {
          this.props.chatImages.length > maxSize &&
          <ViewMoreRow
            title="Xem thêm"
            onPress={this.onViewMoreImagesPress}
          />
        }
      </View>
    );
  }
  renderSharedVideos() {
    const maxSize = 3;
    return (
      <View style={styles.sharedContentContainer}  key="thread_sharevideo">
        <View style={styles.sectionHeaderContainer}>
          <AppText style={styles.sectionHeaderText}>
            {`Video chung (${this.props.chatVideos.length})`}
          </AppText>
          {
            this.props.isFetchingChatVideoMessages &&
            <View
              style={{ width: 16, height: 16 }}
            >
              <LottieView
                style={{ flex: 1, width: 16, height: 16 }}
                source={require('./img/loading.json')}
                autoPlay
                loop
              />
            </View>
          }
        </View>
        <VideosRow
          videos={this.props.chatVideos.slice(0, maxSize)}
          onVideoPress={this.onChatVideoPress}
        />
        {
          this.props.chatVideos.length > maxSize &&
          <ViewMoreRow
            title="Xem thêm"
            onPress={this.onViewMoreVideosPress}
          />
        }
      </View>
    );
  }
  renderCommands() {
    const { thread } = this.props;
    const isLeaveGroupVisible = thread.isGroupThread();
    return (
      <View style={styles.commandsContainer} key="thread_commands">
        {
          !isLeaveGroupVisible ? null :
            <TextRow
              title={'Rời khỏi nhóm'}
              titleStyle={{ color: '#d0021b' }}
              details={''}
              isSeparatorHidden
              onPress={this.onLeavePress}
            />
        }
      </View>
    );
  }
  renderImagesViewer() {
    const imageIndex = this.state.imagesViewerIndex;
    const images = this.props.chatImages;
    const imageURLs = images.map(item => {
      return item.serverImageURL;
    }).filter(item => {
      return item !== undefined && item !== null;
    });
    return (
      <ImagesViewer
        beginIndex={imageIndex}
        imageURLs={imageURLs}
        onBackPress={this.onImagesViewerBackPress}
      />
    );
  }
  renderImagesViewerModal() {
    const { isImagesViewerHidden } = this.state;
    return (
      <Modal
        style={{ margin: 0, padding: 0 }}
        visible={!isImagesViewerHidden}
        useNativeDriver
      >
        {this.renderImagesViewer()}
      </Modal>
    );
  }
  renderTextInputBox() {
    const { isTextInputVisible } = this.state;
    const groupName = this.props.thread.title;
    return (
      <Modal
        isVisible={isTextInputVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropOpacity={0.5}
        avoidKeyboard
        useNativeDriver
      >
        <TextInputBox
          title={'Cập nhật tên nhóm'}
          initInputValue={groupName}
          inputPlaceholder={'Tên nhóm'}
          onYesPress={(text) => {
            const newGroupName = text.trim();
            if (newGroupName.length <= 0) { return; }
            this.hideTextInput();
            setTimeout(() => {
              this.updateThreadMetadata(newGroupName);
            }, 250);
          }}
          onCancelPress={() => {
            this.hideTextInput();
          }}
        />
      </Modal>
    );
  }
  renderActionSheet() {
    return (
      <ActionSheet
        ref={o => { this.actionSheet = o; }}
        options={['Đóng', 'Chụp hình mới', 'Chọn từ Album', 'Bỏ hình nền']}
        cancelButtonIndex={0}
        destructiveButtonIndex={3}
        onPress={(index) => {
          if (index === 1) {
            this.updateThreadBackground('camera');
          } else if (index === 2) {
            this.updateThreadBackground('photo');
          } else if (index === 3) {
            this.removeThreadBackground();
          }
        }}
      />
    );
  }
  renderSpinner() {
    const {
      isSpinnerVisible,
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={isSpinnerVisible}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }

  onPressAvatar = (user) => {
    this.setState({
      showAvatar: user,
      closeAvatar: false,
    });
  }

  onCloseAvatarPress = () => {
    this.setState({
      closeAvatar: true,
    });
    setTimeout(() => {
      this.setState({
        showAvatar: undefined,
      });
    }, 250);
  }

  render() {
    const { thread, appInfo, myUser } = this.props;
    const { closeAvatar, showAvatar, isVisible } = this.state;
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
        >
          {!thread ?  
            (<View style={{ flex: 1}} />) :
            (
              <View style={{ flex: 1, paddingBottom: 100}}>
                {this.renderThreadDetails()}
                {this.renderSettings()}
                {this.renderMembers()}
                {this.renderSharedContent()}
                {this.renderSharedVideos()}
                {this.renderCommands()}
                {this.renderImagesViewerModal()}
                {this.renderTextInputBox()}
                {this.renderActionSheet()}
                {this.renderSpinner()}
            </View>
            )
          }
        </ScrollView>
        {(showAvatar && myUser) && 
          <PopupRankUser
            avatarURI={(showAvatar && showAvatar.avatar !== '') ?
              { uri: showAvatar.avatar } : null}
            name={showAvatar ? showAvatar.name : ''}
            onClosePress={this.onCloseAvatarPress}
            moveIn={showAvatar !== undefined}
            close={closeAvatar}
            user={showAvatar}
            baseReviewUrl={appInfo?.mFastReviewUserUrl}
            uid={ showAvatar._id}
            showChat={myUser.uid !== showAvatar._id}
            accessToken={myUser.accessToken}
            onChatPress={() => {}}
          />
        }
        <PopupPasswordGroup
          thread={thread}
          isVisible={isVisible}
          isRequired={false}
          onClose={this.onClosePopup}
        />
      </View>
    );
  }
}

// --------------------------------------------------

ChatSettings.navigationOptions = () => ({
  title: ' ',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatSettings.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
  myUser: state.myUser,
  thread: state.chatThread,
  chatImages: state.chatImages,
  blockedThreads: state.blockedThreads,
  allThreads: state.allThreads,
  isFetchingChatImageMessages: state.isFetchingChatImageMessages,
  chatVideos: state.chatVideos,
  isFetchingChatVideoMessages: state.isFetchingChatVideoMessages,
  threadPublicIds: state.threadPublicIds,
  
});

const mapDispatchToProps = (dispatch) => ({
  setChatImages: (images) => dispatch(chatImages(images)),
  loadChatImages: (maxImages) => dispatch(loadChatImages(maxImages)),
  block: (userID) => dispatch(block(userID)),
  unblock: (userID) => dispatch(unblock(userID)),
  closeChat: () => dispatch(closeChat()),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
  loadChatImagesFromFirebase: (maxImages) => dispatch(loadChatImagesFromFirebase(maxImages)),
  loadChatVideosFromFirebase: (maxVideos) => dispatch(loadChatVideosFromFirebase(maxVideos)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

const ViewMoreRow = (props) => (
  <View style={styles.viewMoreContainer}>
    <TextButton
      style={styles.viewMoreButton}
      title={props.title}
      titleStyle={styles.viewMoreButtonTitle}
      isArrowHidden
      onPress={props.onPress}
      iconSource={require('./img/next.png')}
    />
  </View>
);
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.separator,
  },
  scrollView: {
    backgroundColor: colors.separator,
  },
  threadDetailsCotainer: {
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  settingsContainer: {
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  membersContainer: {
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  sharedContentContainer: {
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  commandsContainer: {
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: colors.separator,
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 42,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.navigation_bg,
  },
  sectionHeaderText: {
    flex: 1,
    color: '#7f7f7f',
    backgroundColor: colors.navigation_bg,
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: colors.navigation_bg,
  },
  viewMoreButton: {
    marginTop: 0,
  },
  viewMoreButtonTitle: {
    fontWeight: '400',
    color: '#1B94E3',
  },
});
