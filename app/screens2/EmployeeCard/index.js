import { connect } from 'react-redux';
import { SafeAreaView, ScrollView } from 'react-navigation';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import PDFView from 'react-native-view-pdf';
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

import { capturePhoto, pickPhoto } from '../CustomPhotoPicker';
import { renderNavigation } from '../../components/Navigation';
import { showInfoAlert, showQuestionAlert } from '../../utils/UIUtils';
import Button from '../../components/Button';
import DigitelClient from '../../network/DigitelClient';
import AppText from '../../componentV3/AppText';
// {
//   "status": true,
//   "data": {
//     "card_status": "PENDING",
//     "card_status_string": "Hìnệt và cập nhật trạng thái từ 1 - 2 ngày làm việc",
//     "userID": "123456",
//     "role": "DSA1",
//     "branch": "TL Cao Ph\u01bUP Tr\u1ea7n \u0110\u1ee9c Minh - ASM Phan Thanh Vinh",
//     "sample_path": "abc.jpg",
//     "project": [
//       {
//         "card_type": "MC"
//         "title": "Th\u1ebb b\u00e1n h\u00e0ng MCredit - m\u1eabu MFast",
//         "content": "D\u00f9 doanh c\u1ee7a MFast",
//         "code": "DGP123456",
//         "path": "fe.pdf",
//         "note": "- In trên giấy A4, thẻ có kích cỡ là 86 x 54mmấy cứng",
//       },
//     ]

//     "in_projects" : [
//        { "FE Credit" : "123"}, {"FE Credit 2" : "123 2"}
//     ],
//     "can_in_projects": { text: "Đăng kí thêm 3 dự án khác", url: "", title: ""},
//     "note": "- Hình chụp chân dung phải rõ mặt\n-- Hình không qua chỉnh sửa",
//     "failed_reason": "Hình không rõ mmặt",
//     "avatar_url": ""
//   }
// }

export const CARD_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
};

export const CARD_STATUS_INFO = {
  PENDING: { icon: require('./img/ic_pending.png'), color: '#d66100' },
  FAILED: { icon: require('./img/ic_failed.png'), color: '#bc0f23' },
  SUCCESS: { icon: require('./img/ic_success.png'), color: '#00863d' },
};

const SCREEN_WIDTH = Dimensions.get('window').width;

class EmployeeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSampleImage: false,
      loading: false,
      info: {},
      imageURI: '',
    };
  }

  componentDidMount() {
    this.fetchCardInfo();
  }

  /*  EVENTS
   */

  onBackPress = () => {
    this.props.navigation.goBack();
  };
  onLinkPress = (url, title) => {
    this.props.navigation.navigate('WebView', { url, title, mode: 0 });
  };
  onAvatarSamplePress = () => {
    this.setState({ showSampleImage: true });
  };
  onCloseAvatarSamplePress = () => {
    this.setState({ showSampleImage: false });
  };
  onChangeAvatarPress = () => {
    this.actionSheet.show();
  };
  onCardPress = (project) => {
    const { info } = this.state;
    const { myUser } = this.props;
    const note = this.formatEnterChar(project.note);
    this.props.navigation.navigate('EmployeeCardDetail', {
      content: project.content,
      cardURL: project.path,
      status: info.card_status,
      message: info.card_status_string,
      note,
      failedNote: info.failed_reason,
      email: myUser.email,
      title: project.title,
      type: project.card_type,
      onChangeAvatarPress: this.onChangeAvatarPress,
    });
  };

  onImgChangeRequestButtonPress = () => {
    if (!this.canSubmbitButton()) return;
    showQuestionAlert(
      'Bạn chỉ có thể yêu cầu đổi hình chân dung 1 LẦN DUY NHẤT\nBạn có muốn đổi không?',
      'Đồng ý',
      'Để sau',
      async () => {
        this.setState({ loading: true });
        try {
          const result = await DigitelClient.requestProcessCard();
          if (!result) throw Error();
          this.fetchCardInfo();
        } catch (err) {
          showInfoAlert('Yêu cầu thất bại');
        } finally {
          this.setState({ loading: false });
        }
      },
    );
  };

  /*  API
   */

  fetchCardInfo = async () => {
    this.setState({ loading: true });
    try {
      const info = await DigitelClient.fetchEmployeeCard();
      this.setState({ info });
    } catch (error) {
      showInfoAlert('Tải thông tin thẻ không thành công');
    } finally {
      this.setState({ loading: false });
    }
  };

  uploadAvatar = async (imageURI) => {
    this.setState({ loading: true });
    try {
      const uploadResut = await DigitelClient.saveEmployeeCard(imageURI);
      if (!uploadResut) throw Error();
      this.fetchCardInfo();
    } catch (error) {
      showInfoAlert('Upload hình thất bại, bạn vui lòng  thử lại');
    } finally {
      this.setState({ loading: false });
    }
  };

  /*  PRIVATE
   */

  formatEnterChar = (text) => (text ? text.replace(/\\n/g, '\n') : '');

  openCamera = () => {
    capturePhoto({
      navigation: this.props.navigation,
      title: 'Chụp hình chân dung',
      detail: '(Di chuyển chân dung vào giữa khung chụp)',
      width: 300,
      height: 400,
      callback: this.handleCaptureAvatar,
    });
  };
  openPhoto = () => {
    pickPhoto({
      title: 'Điều chỉnh chân dung vào giữa khung',
      width: 300,
      height: 400,
      callback: (image) => {
        this.handleCaptureAvatar(image);
      },
    });
  };

  handleCaptureAvatar = async ({ uri }) => {
    this.setState({
      imageURI: uri,
    });
    this.uploadAvatar(uri);
  };

  canUpdateAvatar = (status) => {
    return (
      status === CARD_STATUS.NONE || status === CARD_STATUS.FAILED || status === CARD_STATUS.PENDING
    );
  };

  canShowStatus = (status) => {
    return (
      status === CARD_STATUS.PENDING ||
      status === CARD_STATUS.FAILED ||
      status === CARD_STATUS.SUCCESS
    );
  };

  canShowImgChangeRequestButton = (status, isChanged) => {
    return !isChanged && status === CARD_STATUS.SUCCESS;
  };
  canSubmbitButton = () => {
    return true; // this.state.imageURI;
  };

  existAvatar = (status) => {
    return status !== CARD_STATUS.NONE;
  };

  /*  RENDER
   */

  renderNavigation = () => {
    return renderNavigation({ onBackPress: this.onBackPress, title: 'Thông tin nhân viên' });
  };
  renderUserInfoSection = (level, branch) => {
    if (!level || !branch) return null;
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <AppText style={styles.normalText}>{'Cấp bậc hiện tại:  '}</AppText>
          <AppText style={styles.boldText}>{level}</AppText>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <AppText style={styles.normalText}>{'Nhánh:  '}</AppText>
          <AppText style={styles.boldText}>{branch}</AppText>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#d8d8d8',
            marginTop: 12,
            marginBottom: 12,
          }}
        />
      </View>
    );
  };

  renderInProjectsSection = (projects, canInProject) => {
    if (!projects || !canInProject) return null;

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <AppText style={styles.normalText}>{'Dự án tham gia:  '}</AppText>
          <View style={{ alignItems: 'flex-start' }}>
            {Object.keys(projects).map((projectKey) => (
              <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                <AppText style={styles.boldText}>{projectKey}</AppText>
                <AppText style={styles.normalText}>{' - mã code: '}</AppText>
                <AppText style={styles.boldText}>{projects[projectKey]}</AppText>
              </View>
            ))}
            <Button
              title={canInProject.text}
              onPress={() => this.onLinkPress(canInProject.url, canInProject.title)}
            />
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#d8d8d8',
            marginTop: 12,
            marginBottom: 12,
          }}
        />
      </View>
    );
  };

  renderAvatarSection = (note, avatar, status) => {
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 20 }}>
            <AppText style={styles.normalText}>
              {'Hình thẻ chân dung (Sử dụng để làm thẻ nhân viên, cấp code và thư giới thiệu, ….)'}
            </AppText>
            <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 2 }}>
              <AppText style={styles.normalText}>{'Yêu cầu hình ('}</AppText>
              <Button title={'Bấm xem mẫu'} onPress={this.onAvatarSamplePress} />
              <AppText style={styles.normalText}>{')'}</AppText>
            </View>
            <AppText style={styles.noteText}>{note}</AppText>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
           {!!avatar && <FastImage
              style={{
                width: 80,
                height: 107,
                borderWidth: 1,
                borderColor: '#009fdb',
                marginBottom: 8,
              }}
              source={avatar ? { uri: avatar } : require('./img/ic_user.png')}
              resizeMode={avatar ? 'contain' : 'center'}
            />}
            {this.canUpdateAvatar(status) ? (
              <Button
                title={this.existAvatar(status) ? 'Đổi hình' : 'Thêm hình'}
                image={require('./img/ic_cam.png')}
                onPress={this.onChangeAvatarPress}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  renderStatus = (status, message, failedNote) => {
    if (!this.canShowStatus(status)) return null;

    const { icon, color } = CARD_STATUS_INFO[status];

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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

  renderImgChangeRequestButton = (status, isChanged) => {
    if (!this.canShowImgChangeRequestButton(status, isChanged)) return null;
    const enable = this.canSubmbitButton();

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 18 }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 46,
            width: 180,
            borderRadius: 23,
            backgroundColor: enable ? '#009fdb' : '#cfd3d6',
          }}
          onPress={this.onImgChangeRequestButtonPress}
        >
          <AppText
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: enable ? 'white' : '#24253d55',
            }}
          >
            {'Yêu cầu đổi hình thẻ'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  renderCardList = (projects) => {
    if (!projects || projects.length === 0) {
      return (
        <View
          style={{
            marginBototm: 32,
            marginTop: 28,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppText style={[styles.normalText, { marginBottom: 8, marginTop: 32, color: '#222', fontSize: 14 }]}>
            {'Bạn chưa có hình thẻ'}
          </AppText>
          <Button
            title={'Cập nhật hình thẻ'}
            image={require('./img/ic_cam.png')}
            onPress={this.onChangeAvatarPress}
          />
        </View>
      );
    }

    return (
      <View style={{ marginBototm: 32, marginTop: 28 }}>
        <AppText style={[styles.normalText, { marginLeft: 16 }]}>
          {'Bấm từng thẻ dưới đây để tải về Email.'}
        </AppText>
        <ScrollView style={{ padding: 16 }} horizontal>
          {projects.map(this.renderCard)}
        </ScrollView>
      </View>
    );
  };

  renderCard = (project) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            marginBottom: 8,
          }}
          onPress={() => this.onCardPress(project)}
        >
          <View style={{ width: 260, height: 414, marginBottom: 12 }}>
            <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1 }}
              resource={`${project.path}`}
              resourceType={'url'}
            />
          </View>
          <Button title={project.title} />
        </TouchableOpacity>
      </View>
    );
  };

  renderSamplePhoto = (url) => {
    const { showSampleImage } = this.state;
    if (!showSampleImage) return null;
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#000a',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onCloseAvatarSamplePress}
        >
          {!!url && <FastImage
            style={{ width: SCREEN_WIDTH * 0.8, aspectRatio: 3 / 4 }}
            source={{ uri: url }}
          />}
          <Image
            style={{ width: 36, height: 36, marginTop: 42, marginBottom: 16 }}
            source={require('./img/ic_close.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => {
          this.actionSheet = o;
        }}
        title={'Chọn ảnh chân dung'}
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
    const { info, imageURI } = this.state;
    const {
      card_status: status,
      card_status_string: message,
      role: level,
      branch,
      in_projects: projects,
      can_in_projects: canInProject,
      note: noteData,
      failed_reason: failedNote,
      sample_path: sampleAvatar,
      avatar_url: avatar,
      project,
      is_changed: isChanged,
    } = info;
    const note = this.formatEnterChar(noteData);

    return (
      <SafeAreaView style={{ backgroundColor: '#E6EBFF' }}>
        {this.renderNavigation()}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            {this.renderUserInfoSection(level, branch)}
            {this.renderInProjectsSection(projects, canInProject)}
            {this.renderAvatarSection(note, imageURI || avatar, status)}
          </View>
          {this.renderImgChangeRequestButton(status, isChanged)}
          {this.renderStatus(status, message, failedNote)}
          {this.renderCardList(project)}
        </ScrollView>
        {this.renderSamplePhoto(sampleAvatar)}
        {this.renderActionSheet()}
        {this.renderLoading()}
      </SafeAreaView>
    );
  }
}

EmployeeCard.navigationOptions = () => {
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
)(EmployeeCard);

export const styles = {
  normalText: { opacity: 0.7, fontSize: 12, color: '#24253d', flexShrink: 1, lineHeight: 20 },
  boldText: { fontSize: 12, fontWeight: 'bold', color: '#24253d', flexShrink: 1, lineHeight: 20 },
  noteText: { fontSize: 12, color: '#bc0f23', flexShrink: 1, lineHeight: 20 },
};
