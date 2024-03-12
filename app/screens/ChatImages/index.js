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
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LottieView from 'lottie-react-native';

import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import { showInfoAlert } from 'app/utils/UIUtils';
import Styles from 'app/constants/styles';
import Strings from 'app/constants/strings';
import ImageUtils from 'app/utils/ImageUtils';
import ImagesRow from 'app/components/ChatImages/ImagesRow';
import ImagesViewer from 'app/components/ImagesViewer';
import AppText from '../../componentV3/AppText';

import NavigationBar from './NavigationBar';

import {
  chatImages,
  loadChatImagesFromFirebase,
} from '../../submodules/firebase/redux/actions';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = 'ChatImages.js';
/* eslint-enable */

const _ = require('lodash');

// --------------------------------------------------
// ChatImages
// --------------------------------------------------

class ChatImages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinnerText: '',
      isSpinnerVisible: false,
      imagesViewerIndex: 0,
      isImagesViewerHidden: true,
    };
  }
  componentDidMount() {
    // this.props.loadChatImagesFromFirebase(128);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    // disabled -> will make images viewer render err
    // this.props.setChatImages([]);
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onPhotoPress = () => {
    // don't allow update single thread title
    const { thread } = this.props;
    if (thread.isSingleThread()) {
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
  onChatImagePress = (image, index) => {
    this.setState({
      imagesViewerIndex: index,
      isImagesViewerHidden: false,
    });
  }
  onImagesViewerBackPress = () => {
    this.setState({
      imagesViewerIndex: 0,
      isImagesViewerHidden: true,
    });
  }

  onViewMoreImagesPress = () => {
    const { thread } = this.props;
    this.props.navigation.navigate('ChatMembers', { thread });
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
  renderSharedContent() {
    return (
      <View style={styles.sharedContentContainer}>
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
          images={this.props.chatImages}
          onImagePress={this.onChatImagePress}
        />
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
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavigationBar()}
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
        >
          {this.renderSharedContent()}
          {/* {this.renderCommands()} */}
          {this.renderImagesViewerModal()}
          {this.renderSpinner()}
        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

ChatImages.navigationOptions = () => ({
  title: 'Hình ảnh chung',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatImages.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  thread: state.chatThread,
  chatImages: state.chatImages,
  isFetchingChatImageMessages: state.isFetchingChatImageMessages,
});

const mapDispatchToProps = (dispatch) => ({
  setChatImages: (images) => dispatch(chatImages(images)),
  loadChatImagesFromFirebase: (maxImages) => dispatch(loadChatImagesFromFirebase(maxImages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatImages);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navigation_bg,
  },
  scrollView: {
    flex: 1,
  },
  sharedContentContainer: {
    flex: 0,
    paddingTop: 12,
    backgroundColor: colors.separator,
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 4,
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
});
