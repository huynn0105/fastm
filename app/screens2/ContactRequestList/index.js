import React, { Component } from 'react';
import { Dimensions, Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { FlatList } from 'react-navigation';
import { connect } from 'react-redux';
import CharAvatar from '../../components/CharAvatar';
import CustomPopup from '../../components2/CustomPopup';
import { Loading } from '../../components2/LoadingComponent';
import AppText from '../../componentV3/AppText';
import colors from '../../constants/colors';
import DigitelClient from '../../network/DigitelClient';
import {
  acceptRequestContact,
  cancelRequestContact,
  fetchInvitationsRequests,
  rejectRequestContact,
  resendRequestContact
} from '../../redux/actions/conversationContact';
import { updateTimeAgoString } from '../../submodules/firebase/utils/Utils';
import Colors from '../../theme/Color';
import { showQuestionAlert } from '../../utils/UIUtils';
import AccountList from './AccountList';

const TABS = {
  INVITATION: 0,
  SENDING_REQUEST: 1,
};

const MENU = [
  { title: 'Lời mời kết bạn', tag: TABS.INVITATION, unread: 0 },
  { title: 'Đang gửi', tag: TABS.SENDING_REQUEST, unread: 0 },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

class ContactRequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: TABS.INVITATION, item: MENU[0] },
        { key: TABS.SENDING_REQUEST, item: MENU[1] },
      ],
      currentInvitationList: [],
      userList: [],
      loading: false,
      accepting: {},
    };
    this.isUnmounting = false;
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // #region EVENTS

  onBackPress = () => {
    this.isUnmounting = true;
    this.props.navigation.goBack();
  };
  onAcceptInvivationPress = async (request) => {
    const requestList = request.child;

    if (requestList.length === 1) {
      this.popupAccept(request);
    } else {
      this.setState({ loading: true });
      try {
        const userList = await DigitelClient.mfFetchUserList();
        if (userList.length === 1) {
          const requestForCurrentUser = requestList.filter(
            (_request) => _request.receiverUID === userList[0].ID,
          );
          if (requestForCurrentUser.length > 0) {
            this.popupAccept(requestForCurrentUser[0]);
            return;
          }
        }

        const invitingUserList = [];
        for (let index = 0; index < userList.length; index += 1) {
          const user = userList[index];
          for (let j = 0; j < requestList.length; j += 1) {
            const invitation = requestList[j];
            if (invitation.receiverUID === user.ID) {
              invitingUserList.push(user);
              break;
            }
          }
        }
        if (invitingUserList.length > 0) {
          this.setState({ userList: invitingUserList, currentInvitationList: requestList }, () => {
            this.userListSheetRef.open();
          });
        }
      } finally {
        this.setState({ loading: false });
      }
    }
  };
  onRejectInvitationPress = (request) => {
    showQuestionAlert(
      `Bạn từ chối lời mời của ${request.fullName}, người gửi lời mời sẽ không biết bạn đã từ chối`,
      'Đồng ý',
      'Để sau',
      () => {
        this.props.rejectRequestContact(request.senderID);
      },
    );
  };
  onResendRequestPress = (request) => {
    showQuestionAlert(
      `Bạn muốn gửi lại lời mời tới ${request.nickname || request.phoneNumber}`,
      'Đồng ý',
      'Để sau',
      () => {
        this.props.resendRequestContact(request.phoneNumber);
      },
    );
  };
  onCancelSendingRequestPress = (request) => {
    showQuestionAlert(
      `Bạn muốn rút lại lời mời tới ${request.nickname || request.phoneNumber}`,
      'Đồng ý',
      'Để sau',
      () => {
        this.props.cancelRequestContact(request.phoneNumber);
      },
    );
  };
  onUserRowPress = (selectedInvitation) => {
    this.setState({ accepting: { ...this.state.accepting, [selectedInvitation.uid]: true } });
    this.props.acceptRequestContact(
      selectedInvitation.uid,
      selectedInvitation.receiverUID,
      (success) => {
        if (success) {
          const currentInvitationList = [...this.state.currentInvitationList];
          for (let index = 0; index < currentInvitationList.length; index += 1) {
            const invitation = currentInvitationList[index];
            if (invitation.uid === selectedInvitation.uid) {
              invitation.accepted = true;
            }
          }
          this.setState({ currentInvitationList });
        }
        this.setState({ accepting: { ...this.state.accepting, [selectedInvitation.uid]: false } });
      },
    );
  };

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // #region METHOD

  popupAccept = (request) => {
    showQuestionAlert(`Bạn chấp nhận lời mời của ${request.fullName}`, 'Đồng ý', 'Để sau', () => {
      this.props.acceptRequestContact(request.uid, this.props.myUser.uid);
    });
  };

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // #region RENDER

  renderEmptyList = (message = '') => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.neutral5,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 64,
        }}
      >
        <Image
          style={{ width: 24, height: 24, marginBottom: 16 }}
          source={require('./img/ic_empty.png')}
        />
        <AppText
          style={{
            opacity: 0.6,
            fontSize: 14,
            textAlign: 'center',
            color: '#222',
          }}
        >
          {message}
        </AppText>
      </View>
    );
  };

  renderRequestRow = ({ request, okText, cancelText, okCallback, cancelCallback }) => {
    // message: 'Chào bạn, hãy chấp nhận lời mời của mình nhé!!!',
    // fullName: 'le anh tuuu',
    // avatar:
    //   'https://firebasestorage.googleapis.com/v0/b/digitelprod.appspot.com/o/images%2Fprofile_avatar%2F27929_1547811100.jpg?alt=media&token=0191cea6-bd16-42fc-af0e-2e6720f30e3b',
    // sendingTime: 1570174247577,
    // uid: '-LqKfP7_GppI-OD2r_iq',
    const { avatar, fullName, message, sendingTime } = request;
    return (
      <View style={{ flexDirection: 'row', padding: 16, backgroundColor: Colors.neutral5 }}>
        <CharAvatar
          avatarStyle={{ width: 40, height: 40 }}
          source={avatar ? { uri: avatar } : ''}
          defaultName={fullName}
        />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <AppText style={{ opacity: 1, fontSize: 14, color: '#222', fontWeight: '600' }}>
              {fullName}
            </AppText>
            <AppText style={{ opacity: 0.6, fontSize: 12, color: '#222' }}>
              {updateTimeAgoString(sendingTime)}
            </AppText>
          </View>
          <AppText style={{ opacity: 1, fontSize: 12, color: '#222' }}>{message}</AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ padding: 12, paddingBottom: 0, paddingRight: 12 }}
              onPress={cancelCallback}
            >
              <AppText style={{ fontSize: 14, color: '#222', opacity: 0.8, fontWeight: '500' }}>
                {cancelText}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 8, paddingBottom: 0 }} onPress={okCallback}>
              <AppText style={{ fontSize: 14, color: Colors.primary2, fontWeight: '500' }}>
                {okText}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 16,
            right: 16,
            height: 1,
            backgroundColor: '#eee',
          }}
        />
      </View>
    );
  };

  renderUnknowRequestRow = ({ request, okText, cancelText, okCallback, cancelCallback }) => {
    const { phoneNumber, message, sendingTime, nickname } = request;
    return (
      <View style={{ flexDirection: 'row', padding: 16, backgroundColor: Colors.neutral5 }}>
        <CharAvatar avatarStyle={{ width: 40, height: 40 }} source={''} defaultName={'?....'} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <AppText style={{ opacity: 1, fontSize: 14, color: '#222', fontWeight: '600' }}>
              {nickname || phoneNumber}
            </AppText>
            <AppText style={{ opacity: 0.6, fontSize: 12, color: '#222' }}>
              {updateTimeAgoString(sendingTime)}
            </AppText>
          </View>
          <AppText style={{ opacity: 1, fontSize: 12, color: '#222' }}>{message}</AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ padding: 12, paddingBottom: 0, paddingRight: 12 }}
              onPress={cancelCallback}
            >
              <AppText style={{ fontSize: 14, color: '#222', opacity: 0.8, fontWeight: '500' }}>
                {cancelText}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 8, paddingBottom: 0 }} onPress={okCallback}>
              <AppText style={{ fontSize: 14, color: colors.app_theme_darker, fontWeight: '500' }}>
                {okText}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 16,
            right: 16,
            height: 1,
            backgroundColor: '#eee',
          }}
        />
      </View>
    );
  };

  renderInvitationRow = (request) => {
    return this.renderRequestRow({
      request,
      okText: 'Chấp nhận',
      okCallback: () => this.onAcceptInvivationPress(request),
      cancelText: 'Từ chối',
      cancelCallback: () => this.onRejectInvitationPress(request),
    });
  };

  renderSendingRequestRow = (request) => {
    const { phoneNumber } = request;
    return phoneNumber
      ? this.renderUnknowRequestRow({
          request,
          okText: 'Gửi lại',
          okCallback: () => this.onResendRequestPress(request),
          cancelText: 'Hủy yêu cầu',
          cancelCallback: () => this.onCancelSendingRequestPress(request),
        })
      : this.renderRequestRow({
          request,
          okText: 'Gửi lại',
          okCallback: () => this.onResendRequestPress(request),
          cancelText: 'Hủy yêu cầu',
          cancelCallback: () => this.onCancelSendingRequestPress(request),
        });
  };

  renderInvitationList = (invitationList = []) => {
    return invitationList.length !== 0 ? (
      <FlatList
        style={{ backgroundColor: Colors.neutral5 }}
        data={invitationList}
        keyExtractor={(item) => item.uid}
        renderItem={(row) => {
          const isLastRow = row.index === invitationList.length - 1;
          return this.renderInvitationRow(row.item, isLastRow);
        }}
      />
    ) : (
      this.renderEmptyList('Chưa có lời mời kết bạn nào ')
    );
  };
  renderSendingRequestList = (sendingRequestList = []) => {
    return sendingRequestList.length !== 0 ? (
      <FlatList
        style={{ backgroundColor: Colors.neutral5 }}
        data={sendingRequestList}
        keyExtractor={(item) => item.uid}
        renderItem={(row) => {
          const isLastRow = row.index === sendingRequestList.length - 1;
          return this.renderSendingRequestRow(row.item, isLastRow);
        }}
      />
    ) : (
      this.renderEmptyList('Bạn chưa gửi yêu cầu kết bạn nào')
    );
  };

  renderMenu = (props) => {
    const { invitationsRequestsContact } = this.props;
    const pendingInvitation = invitationsRequestsContact.invitations.length;
    const sendingRequest = invitationsRequestsContact.sendingRequests.length;
    return (
      <TabBar
        {...props}
        style={{ backgroundColor: '#fff' }}
        indicatorStyle={{ backgroundColor: Colors.primary2, height: 1 }}
        renderLabel={({ route, focused }) => {
          const badgeNumber = route.key === TABS.INVITATION ? pendingInvitation : sendingRequest;
          const badgeNumberString = badgeNumber && badgeNumber > 0 ? ` (${badgeNumber})` : '';
          return (
            <AppText
              style={{
                color: focused ? Colors.primary2 : '#0006',
                fontSize: 14,
                textAlign: 'center',
                fontWeight: '400',
              }}
            >
              {`${route.item.title}${badgeNumberString}`}
            </AppText>
          );
        }}
      />
    );
  };
  renderScene = ({ route }) => {
    const { invitationsRequestsContact } = this.props;

    const pendingInvitations = invitationsRequestsContact.invitations.sort(
      (a, b) => b.sendingTime - a.sendingTime,
    );

    const sendingRequests = invitationsRequestsContact.sendingRequests.sort(
      (a, b) => b.sendingTime - a.sendingTime,
    );

    switch (route.key) {
      case TABS.INVITATION:
        return this.renderInvitationList(pendingInvitations);
      case TABS.SENDING_REQUEST:
        return this.renderSendingRequestList(sendingRequests);
      default:
        return null;
    }
  };
  renderContent = () => {
    return (
      <TabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderMenu}
        onIndexChange={(index) => this.setState({ index })}
        initialLayout={{ width: SCREEN_WIDTH }}
      />
    );
  };

  renderNavigationBar() {
    return (
      <View
        style={{
          marginLeft: 0,
          marginRight: 0,
          height: 46,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AppText
          style={{
            opacity: 0.8,
            fontSize: 16,
            textAlign: 'center',
            color: '#222',
          }}
        >
          {'Danh sách các yêu cầu kết bạn'}
        </AppText>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 8,
            bottom: 0,
            padding: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.onBackPress}
        >
          <Image style={{ width: 24, height: 24 }} source={require('./img/ic_back.png')} />
        </TouchableOpacity>
      </View>
    );
  }

  renderAcceptList = () => {
    const { currentInvitationList, userList, accepting } = this.state;
    return (
      <CustomPopup
        ref={(ref) => {
          this.userListSheetRef = ref;
        }}
        render={() => (
          <AccountList
            invitations={currentInvitationList}
            users={userList}
            onUserRowPress={this.onUserRowPress}
            accepting={accepting}
          />
        )}
        position={'BOTTOM'}
        canClose
      />
    );
  };

  render() {
    const { fetchingConversationContacts } = this.props;
    const { loading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.renderNavigationBar()}
        {this.renderContent()}
        {/* <Spinner
          visible={fetchingConversationContacts && this.isUnmounting === false}
          textContent={'Đang xử lí...'}
          textStyle={{ fontWeight: '400', color: '#fff' }}
          overlayColor="#0003"
          size="small"
        /> */}
        {this.renderAcceptList()}
        <Loading visible={fetchingConversationContacts || loading} />
      </SafeAreaView>
    );
  }
}

ContactRequestList.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  fetchingConversationContacts: state.fetchingConversationContacts,
  invitationsRequestsContact: state.invitationsRequestsContact,
});

const mapDispatchToProps = {
  fetchInvitationsRequests,
  acceptRequestContact,
  cancelRequestContact,
  rejectRequestContact,
  resendRequestContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactRequestList);
