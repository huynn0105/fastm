/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

/**
 * Navigation Params:
 * - members: list of User, create group thread with a pre-filled list of User
 */

import KJImage from 'app/components/common/KJImage';
import MemberRow from 'app/components/MemberRow';
import Strings from 'app/constants/strings';
import Styles from 'app/constants/styles';
import { showAlertForRequestPermission, showInfoAlert } from 'app/utils/UIUtils';
// --------------------------------------------------
/* eslint-disable */
import Utils from 'app/utils/Utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Alert, Image, Keyboard, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import AppText from '../../componentV3/AppText';
import colors from '../../constants/colors';
import { uploadImage } from '../../submodules/firebase/FirebaseStorage';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import NavigationBar from './NavigationBar';








 const LOG_TAG = 'CreateGroupChatStep2.js';
 /* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// CreateGroupChatStep2.js
// --------------------------------------------------

class CreateGroupChatStep2 extends Component {
  constructor(props) {
    super(props);

    let members = [];
    if (this.props.navigation) {
      members = this.props.navigation.state.params.members.slice();
      members.unshift(this.props.myUser);
    }

    this.state = {
      isSpinnerVisible: false,
      spinnerText: 'Đang xử lý',
      members,
      emptyGroupName: false,
      imageURI: '',
    };
    this.groupName = '';
  }

  componentDidMount = () => {
    if (this.nameInput) {
      this.nameInput.focus();
    }
  };
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

   pickImage(type) {  // eslint-disable-line
    const title = type === 'avatar' ? 'Cập nhật hình đại điện' : 'Cập nhật hình nền';
    return new Promise((resolve, reject) => {
      const ImagePicker = require('react-native-image-picker');
      const options = {
        title,
        cancelButtonTitle: 'Đóng',
        takePhotoButtonTitle: 'Chụp hình mới',
        chooseFromLibraryButtonTitle: 'Chọn từ Album',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.error) {
          showAlertForRequestPermission(
            Platform.OS === 'ios'
              ? Strings.camera_access_error
              : Strings.camera_access_error_android,
          );

          reject(response.error);
        } else if (response.didCancel) {
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }

  // --------------------------------------------------
  onCancelPress = () => {
    Keyboard.dismiss();
    this.props.navigation.goBack();
  };
  onDonePress = () => {
    if (this.groupName.trim() === '') {
      this.setState({
        emptyGroupName: true,
      });
      if (this.nameInput) {
        this.nameInput.focus();
      }
      return;
    }

    Keyboard.dismiss();
    if (this.state.members.length > 1) {
      this.showSpinner();
      this.createGroupChat();
    }
  };
  onNameTextChange = (text) => {
    this.groupName = text;
  };
  onAvatarPress = () => {
    this.showSpinner();
    this.pickImage('avatar')
      .then((response) => {
        // user cancel
        if (response === null) {
          return;
        }
        // resize image & upload
        // Image.getSize(response.uri, (width, height) => {
        this.resizeImage(response.uri, 216, 216)
          .then((imageURI) => {
            this.setState({
              imageURI,
            });
            this.hideSpinner();
          })
          .catch(() => {
            this.hideSpinner();
          });
        // });
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} pickImage error: `, error);
        this.hideSpinner();
      });
  };
  resizeImage(fileURI, width = 256, height = 256) {
    return ImageResizer.createResizedImage(fileURI, width, height, 'JPEG', 80)
       .then((response) => { // eslint-disable-line
        // Utils.log(`${LOG_TAG} resizeImage: `, response);
        return response.uri;
      })
      .catch((error) => {
        Utils.warn(`${LOG_TAG} resizeImage error: `, error);
        return Promise.reject(error);
      });
  }
  createGroupChat = () => {
    // add me to memebers as well
    const members = this.state.members.map((item) => Object.assign({}, item));
    // request
    const asyncTask = async () => {
      try {
        const newThread = await ChatManager.shared().createGroupThread(members, {});
        // wait for spinner hide & check

        if (newThread) {
          showInfoAlert('Đã tạo thành công');
          this.setState({
            spinnerText: 'Đang cập nhật thông tin...',
          });

          if (this.state.imageURI !== '') {
            uploadImage(
              this.state.imageURI,
              undefined,
              () => {
                showInfoAlert(Strings.create_thread_error);
                this.hideSpinner();
              },
              (imageURL) => {
                this.updateThreadMetadata(newThread, this.groupName, imageURL);
              },
            );
          } else {
            this.updateThreadMetadata(newThread, this.groupName);
          }
        } else {
          this.hideSpinner();
          showInfoAlert(Strings.create_thread_error);
        }
      } catch (err) {
        // error
        this.hideSpinner();
        this.showAlert(Strings.unknown_error);
      }
    };
    asyncTask();
  };

  updateThreadMetadata = (thread, title = null, photoImage = null, backgroundImage = null) => {
    const asyncTask = async () => {
      try {
        const threadID = thread.uid;
        const result = await ChatManager.shared().updateThreadMetadata(threadID, {
          title,
          photoImage,
          backgroundImage,
        });
        this.hideSpinner();
        if (!result) {
          showInfoAlert(Strings.update_thread_error);
        } else {
          // showInfoAlert(Strings.update_thread_success);

          setTimeout(() => {
            this.props.navigation.goBack();
            this.props.navigation.popToTop();
          }, 250);
        }
      } catch (err) {
        this.hideSpinner();
        showInfoAlert(Strings.update_thread_error);
      }
    };
    asyncTask();
  };

  // --------------------------------------------------
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
  showAlert(message) {
    Alert.alert(Strings.alert_title, message, [{ text: 'Đóng' }], { cancelable: false });
  }
  // --------------------------------------------------
  renderNavigationBar() {
    const isDoneButtonEnable = this.state.members.length > 0;
    return (
      <NavigationBar
        onCancelPress={this.onCancelPress}
        onDonePress={this.onDonePress}
        isDoneButtonEnable={isDoneButtonEnable}
      />
    );
  }
  renderGroupInfo = () => {
    return (
      <View style={styles.groupContainer}>
        {this.renderAvatar()}
        {this.renderInputName()}
      </View>
    );
  };
  renderAvatar = () => {
    return (
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={this.onAvatarPress}>
          <View style={{ flex: 0 }}>
            <KJImage
              style={styles.avatarIcon}
              source={
                this.state.imageURI === ''
                  ? require('./img/group.png')
                  : { uri: this.state.imageURI }
              }
              resizeMode="cover"
            />
            <KJImage
              style={styles.editIcon}
              source={require('./img/pencil.png')}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  renderInputName = () => {
    return (
      <View style={styles.inputNameContainer}>
        <TextInput
          ref={(o) => {
            this.nameInput = o;
          }}
          style={styles.textInput}
          underlineColorAndroid="#0000"
          onChangeText={this.onNameTextChange}
          // onSubmitEditing={this.onNameTextSubmitEditing}
          placeholder="Nhập tên nhóm"
          placeholderTextColor="#878787"
          maxLength={36}
          testID="input_pass"
          autoCorrect={false}
        />
        <View
          style={[
            styles.inputNameBottomLine,
            this.state.emptyGroupName ? { backgroundColor: 'red' } : {},
          ]}
        />
      </View>
    );
  };
  renderMembers = () => {
    const { members } = this.state;
    return (
      <View style={styles.membersContainer}>
        {this.renderMembersSectionHeader()}
        <ScrollView>{members.map((user, index) => this.renderMember(user, index))}</ScrollView>
      </View>
    );
  };
  renderMembersSectionHeader = () => {
    const { members } = this.state;
    return (
      <View style={styles.sectionHeaderContainer}>
        <AppText style={styles.sectionHeaderText}>{`Thành viên (${members.length})`}</AppText>
      </View>
    );
  };
  renderMember(user, index) {
    return (
      <MemberRow
        key={user.uid}
        user={user}
        isDeleteButtonHidden
        onDeletePress={this.onRemoveMemberPress}
        isAdmin={index === 0}
      />
    );
  }
  render() {
    const { isSpinnerVisible, spinnerText } = this.state;
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        {this.renderGroupInfo()}
        {this.renderMembers()}
        <Spinner
          visible={isSpinnerVisible}
          textContent={spinnerText}
          textStyle={{ marginTop: 4, color: '#fff' }}
          overlayColor="#00000080"
        />
      </View>
    );
  }
}

// --------------------------------------------------

CreateGroupChatStep2.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ tintColor }) => (
    <Image source={require('../img/tab_contacts.png')} style={[styles.icon, { tintColor }]} />
  ),
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

CreateGroupChatStep2.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChatStep2);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.container_background,
  },
  avatarContainer: {
    flex: 0,
    marginTop: 12,
    backgroundColor: '#0000',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff0',
  },
  editIcon: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    bottom: 0,
    right: 0,
  },
  inputNameContainer: {
    flex: 0,
    height: 60,
  },
  textInput: {
    fontSize: 16,
    height: Platform.OS === 'ios' ? 32 : 42,
    marginTop: 8,
    color: '#202020',
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  inputNameBottomLine: {
    height: 1,
    backgroundColor: '#006ff1',
    marginLeft: 20,
    marginRight: 20,
  },
  membersContainer: {
    flex: 1,
    marginTop: 12,
    backgroundColor: colors.container_background,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.container_background,
  },
  sectionHeaderText: {
    flex: 1,
    color: '#7f7f7f',
    backgroundColor: colors.container_background,
    fontSize: 14,
    fontWeight: '600',
  },
});
