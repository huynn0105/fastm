import { connect } from 'react-redux';
import { Text, Image, View, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PDFView from 'react-native-view-pdf';
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

import { BottomControl } from './BottomControl';
import { CARD_STATUS, CARD_STATUS_INFO, styles } from '../EmployeeCard';
import { renderNavigation } from '../../components/Navigation';
import { showInfoAlert } from '../../utils/UIUtils';
import DigitelClient from '../../network/DigitelClient';
import Button from '../../components/Button';
import AppText from '../../componentV3/AppText';

const SCREEN_WIDTH = Dimensions.get('window').width;

class EmployeeCardDetail extends Component {
  constructor(props) {
    super(props);

    const {
      content,
      cardURL,
      status,
      message,
      note,
      failedNote,
      email,
      title,
      type,
    } = this.props.navigation.state.params;

    this.state = {
      loading: false,
      content,
      cardURL,
      status,
      message,
      note,
      failedNote,
      email,
      title,
      type,
    };

    this.onChangeAvatarPressCallback = this.props.navigation.state.params.onChangeAvatarPress;
  }

  /*  EVENTS
   */

  onBackPress = () => {
    this.props.navigation.goBack();
  };

  onSendEmailPress = () => {
    const { email, type } = this.state;
    this.setState({ loading: true });
    DigitelClient.sendEmailHO(email, type)
      .then(() => {
        showInfoAlert(`Gửi đến ${email} thành công`);
      })
      .catch(() => {
        showInfoAlert(`Gửi đến ${email} không thành công`);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onEmailChanged = (text) => {
    this.setState({ email: text });
  };

  onChangeAvatarPress = () => {
    this.onBackPress();
    setTimeout(() => {
      this.onChangeAvatarPressCallback();
    }, 500);
  };

  /*  PRIVATE
   */

  canShowStatus = (status) => {
    return (
      status === CARD_STATUS.PENDING ||
      status === CARD_STATUS.FAILED ||
      status === CARD_STATUS.SUCCESS
    );
  };

  canUpdateAvatar = (status) => {
    return (
      status === CARD_STATUS.NONE || status === CARD_STATUS.FAILED || status === CARD_STATUS.PENDING
    );
  };

  /*  RENDER
   */

  renderNavigation = (title) => {
    return renderNavigation({ title, onBackPress: this.onBackPress });
  };

  renderDescription = (description) => {
    return (
      <View style={{ margin: 16, marginTop: 0 }}>
        <AppText style={[styles.normalText, { textAlign: 'center' }]}>{description}</AppText>
      </View>
    );
  };

  renderCard = (imageURI) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, height: 478 }}>
          <PDFView
            fadeInDuration={250.0}
            style={{ flex: 1 }}
            resource={imageURI}
            resourceType={'url'}
          />
        </View>
      </View>
    );
  };

  renderUpdateAvatarBtn = (status) => {
    if (!this.canUpdateAvatar(status)) return null;

    return (
      <View style={{ marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title={'Đổi ảnh chân dung khác'}
          image={require('./img/ic_cam.png')}
          onPress={this.onChangeAvatarPress}
        />
      </View>
    );
  };

  renderStatus = (status, message, failedNote) => {
    if (!this.canShowStatus(status)) return null;

    const { icon, color } = CARD_STATUS_INFO[status];

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
        <View
          style={{
            width: SCREEN_WIDTH * 0.7,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <Image
            style={{ height: 22, width: 22, marginRight: 4 }}
            source={icon}
            resizeMode={'center'}
          />
          <AppText
            style={{
              fontSize: 12,
              marginTop: 2,
              textAlign: 'center',
              color,
            }}
          >
            {message}
          </AppText>
        </View>
        {failedNote ? <AppText style={[styles.noteText, { marginTop: 2 }]}>{failedNote}</AppText> : null}
      </View>
    );
  };

  renderNote = (status, note) => {
    let noteView = null;

    const noteForUploadAvatar = () => (
      <View
        style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 16, marginTop: 24 }}
      >
        <AppText style={styles.normalText}>{'Vui lòng thêm hình chân dung tại trang'}</AppText>
        <Button onPress={this.onBackPress} title={'Thông tin nhân viên'} />
      </View>
    );

    const noteForCard = (noteData) =>
      (noteData ? (
        <View style={{ marginBottom: 16, marginLeft: 16 }}>
          <AppText style={styles.normalText}>{'Lưu ý:'}</AppText>
          <AppText style={styles.noteText}>{noteData}</AppText>
        </View>
      ) : null);

    switch (status) {
      case CARD_STATUS.NONE:
        noteView = noteForUploadAvatar();
        break;
      case CARD_STATUS.FAILED:
      case CARD_STATUS.PENDING:
      case CARD_STATUS.SUCCESS:
        noteView = noteForCard(note);
        break;
      default:
        noteView = null;
        break;
    }
    return noteView;
  };

  renderBottomContent = ({ email, status }) => {
    return (
      <BottomControl
        onSendEmailPress={this.onSendEmailPress}
        onEmailChanged={this.onEmailChanged}
        status={status}
        mail={email}
      />
    );
  };

  renderLoading() {
    const { loading } = this.state;
    return (
      <Spinner
        visible={loading}
        textContent={'Đang tải'}
        textStyle={{ marginTop: 4, color: '#FFF' }}
        overlayColor="#00000080"
      />
    );
  }

  render() {
    const { title, content, cardURL, status, message, note, failedNote } = this.state;
    const { email } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#E6EBFF' }}>
        {this.renderNavigation(title)}
        <ScrollView scrollIndicatorInsets={{ right: 0.5 }}>
          <View style={{ flex: 1 }}>
            {this.renderDescription(content)}
            {this.renderCard(cardURL)}
            {this.renderUpdateAvatarBtn(status)}
            {this.renderStatus(status, message, failedNote)}
            {this.renderNote(status, note)}
            {this.renderBottomContent({ email, status })}
            <View style={{ height: Platform.OS === 'ios' ? 200 : 32 }} />
          </View>
        </ScrollView>
        {this.renderLoading()}
      </SafeAreaView>
    );
  }
}

EmployeeCardDetail.navigationOptions = () => {
  return {
    title: ' ',
    header: null,
  };
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmployeeCardDetail);
