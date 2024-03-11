import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

import AttachedImage from './AttachedImage';
import { showInfoAlert, showQuestionAlertWithTitle } from '../../utils/UIUtils';
import { uploadImage } from '../../submodules/firebase/FirebaseStorage';
import DigitelClient from '../../network/DigitelClient';

import KJTextButton from '../../common/KJTextButton';
import Styles from '../../constants/styles';

const sha1 = require('sha1');

const INPUT_ERR = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  NULL_CONTENT: 'NULL_CONTENT',
};

const UPLOAD_ERR = {
  IMAGE: 'IMAGE',
  API: 'API',
};

class ReportScreen extends Component {

  constructor(props) {
    super(props);

    this.email = '';
    if (this.props.navigation) {
      this.email = this.props.navigation.state.params.email;
    }

    this.state = {
      spinnerText: '',
    };

    this.content = '';
    this.imageList = [];
  }

  onSendPress = () => {
    if (this.validateInput(this.email, this.content)) {
      showQuestionAlertWithTitle(
        'Gửi phản hồi',
        `Chúng tôi sẽ trả lời vào email \n ${this.email}`, 'Gửi', 'Đóng',
        () => {
          this.sendReport(this.email, this.content, this.imageList);
        },
      );
    }
  }

  async sendReport(email, content, imageList) {
    this.displaySpinner('Đang xử lí');
    try {
      const remoteImageList = await this.uploadImages(imageList);
      await DigitelClient.feedBack({ email, content, images: remoteImageList });
      this.handleSuccessSent();
    }
    catch (err) {
      this.displayError(err);
    }
    finally {
      this.displaySpinner('');
    }
  }

  attachedImageChanged = (imageList) => {
    this.imageList = imageList;
  }

  uploadImages(imageList) {
    const uploadPromises = [];

    for (let i = 0; i < imageList.length; i += 1) {
      const imageFile = imageList[i].uri;
      const imageName = imageFile.replace(/^.*[\\/]/, '');
      const imageID = sha1(imageName);

      uploadPromises.push(new Promise((resolve, reject) => {
        uploadImage(
          imageFile,
          () => { },
          // error
          () => { reject(UPLOAD_ERR.IMAGE); },
          // success
          (url) => { resolve(url); },
          imageID,
        );
      }));
    }
    return Promise.all(uploadPromises);
  }

  validateInput(email, content) {
    let valid = true;
    try {
      if (!this.isValidEmail(email)) throw INPUT_ERR.INVALID_EMAIL; // eslint-disable-line
      if (!content || content === '') throw INPUT_ERR.NULL_CONTENT; // eslint-disable-line
    }
    catch (err) {
      this.displayError(err);
      valid = false;
    }
    return valid;
  }

  displayError(err) {
    if (err === INPUT_ERR.INVALID_EMAIL) { showInfoAlert('Email không hợp lệ'); }
    else if (err === INPUT_ERR.NULL_CONTENT) { showInfoAlert('Hãy vui lòng nhập dung phản hồi'); }
    else if (err === UPLOAD_ERR.IMAGE) { showInfoAlert('Upload ảnh thất bại'); }
    else { showInfoAlert('Có lỗi xảy ra, xin bạn vui lòng thử lại'); }
  }

  displaySuccess() {
    showInfoAlert('Cảm ơn bạn đã gửi phản hồi về cho MFast');
  }

  displaySpinner(text) {
    this.setState({
      spinnerText: text,
    });
  }

  handleSuccessSent() {
    this.props.navigation.goBack();
    this.displaySuccess();
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return re.test(String(email).toLowerCase());
  }

  renderDescription() {
    return (
      <Text style={{ marginTop: 8 }}>
        {'Gửi phản hồi về cho chúng tôi nếu cần hỗ trợ'}
      </Text>
    );
  }

  renderEmailInput() {
    return (
      <View style={{ marginTop: 16 }}>
        <Text style={{
          fontStyle: 'italic',
          fontSize: 12,
          color: '#0008',
        }}
        >
          {'MFast sẽ gửi câu trả lời vào email này'}
        </Text>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#e5e5e5',
          marginTop: 10,
          height: 36,
        }}
        >
          <TextInput
            ref={ref => { this.emailInput = ref; }}
            style={{
              flex: 1,
              fontSize: 14,
              padding: 10,
            }}
            keyboardType={'email-address'}
            placeholder="Nhập email"
            placeholderTextColor="#8888"
            autoCorrect={false}
            onChangeText={(text) => { this.email = text; }}
            defaultValue={this.email}
          />
        </View>
      </View>
    );
  }

  renderContentInput() {
    return (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        marginTop: 16,
        height: 96,
      }}
      >
        <TextInput
          ref={ref => { this.contentInput = ref; }}
          style={{
            flex: 1,
            fontSize: 14,
            padding: 10,
          }}
          placeholder="Nhập nội dung phản hồi"
          placeholderTextColor="#8888"
          autoCorrect={false}
          multiline
          onChangeText={(text) => { this.content = text; }}
        />
      </View>
    );
  }

  renderAttachedImageInput() {
    return (
      <View style={{ marginTop: 16 }}>
        <Text style={{
          fontStyle: 'italic',
          fontSize: 12,
          color: '#0008',
        }}
        >
          {'Tải hình lên từ thư viện (tối đa 6 hình) (nếu có)'}
        </Text>
        <View style={{ marginTop: 8 }}>
          <AttachedImage attachedImageChanged={this.attachedImageChanged} />
        </View>
      </View>
    );
  }

  renderSendButton() {
    return (
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <View style={{ width: 120 }}>
          <KJTextButton
            buttonStyle={[Styles.button]}
            textStyle={[Styles.button_text, { marginLeft: 26, marginRight: 30 }]}
            text={' Gửi '}
            onPress={this.onSendPress}
          />
        </View>
      </View>
    );
  }

  renderSpinner() {
    const {
      spinnerText,
    } = this.state;
    return (
      <Spinner
        visible={!!spinnerText}
        textContent={spinnerText}
        textStyle={{ marginTop: 4, color: '#fff' }}
        overlayColor="#00000080"
      />
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1, height: '100%', backgroundColor: '#E6EBFF' }}
        overScrollMode={'always'}
        keyboardShouldPersistTaps={'handled'}
      >
        <View style={{
          padding: 16,
          flex: 1,
          backgroundColor: '#E6EBFF',
        }}
        >
          {this.renderDescription()}
          {this.renderEmailInput()}
          {this.renderContentInput()}
          {this.renderAttachedImageInput()}
          {this.renderSendButton()}
          {this.renderSpinner()}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

ReportScreen.navigationOptions = () => ({
  title: 'Gửi phản hồi về MFast',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

export default ReportScreen;
