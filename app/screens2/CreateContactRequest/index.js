import React, { Component } from 'react';
import { ActivityIndicator, Image, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { ICON_PATH } from '../../assets/path';
import Popup from '../../components/Popup';
import SearchBar from '../../components/SearchBar';
import { Loading } from '../../components2/LoadingComponent';
import AppText from '../../componentV3/AppText';
import CharAvatar from '../../componentV3/CharAvatar';
import { SH, SW } from '../../constants/styles';
import DigitelClient from '../../network/DigitelClient';
import {
  fetchConversationContacts,
  fetchInvitationsRequests,
  resendRequestContact,
  sendRequestContact,
} from '../../redux/actions/conversationContact';
import { hardFixUrlAvatar } from '../../redux/actions/user';
import { openChatWithUser } from '../../submodules/firebase/redux/actions';
import { default as Colors } from '../../theme/Color';
import { showInfoAlert, showQuestionAlert } from '../../utils/UIUtils';
import NavigationBar from './NavigationBar';

class CreateContactRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      keyword: '',
      users: [],
      loading: false,
      userSelected: null,
      isSearched: false,
      textAddFriend: '',
    };
  }

  componentDidMount() {
    if (this.props?.navigation?.state?.params?.params?.referralCode) {
      if (!this?.props?.conversationContacts?.length) {
        this.props.fetchConversationContacts();
      }
      if (
        !this.props?.invitationsRequestsContact?.invitations?.length &&
        !this.props?.invitationsRequestsContact?.sendingRequests?.length
      ) {
        this.props.fetchInvitationsRequests(() => {
          this.searchBarComponent?.onSearchBarChangeText(
            this.props?.navigation?.state?.params?.params?.referralCode,
          );
        });
      } else {
        this.searchBarComponent?.onSearchBarChangeText(
          this.props?.navigation?.state?.params?.params?.referralCode,
        );
      }
    }
    this.searchBarComponent.searchBar.focus();
  }

  onClosePress = () => {
    this.props.navigation.goBack();
  };

  onSearchTextChanged = (keyword = '') => {
    this.setState({ keyword: keyword.trim(), isSearched: false });
  };

  onSendPress = () => {
    this.fetchData();
  };

  fetchData = async () => {
    // Keyboard.dismiss();
    const { conversationContacts, invitationsRequestsContact } = this.props;
    const { keyword } = this.state;
    const invites = invitationsRequestsContact?.sendingRequests || [];
    this.setState({ loading: true, isSearched: true });
    try {
      let arr = await DigitelClient.searchUserByNickname({ keyword });
      if (conversationContacts?.length > 0) {
        arr = arr.map((item) => {
          // EXISTED
          const isExisted = conversationContacts.some(
            (contact) => item.phoneNumber === `0${contact.phone}`,
          );
          let isWaiting = false;
          if (invites?.length > 0) {
            isWaiting = invites.some((contact) => item.phoneNumber === contact.phoneNumber);
          }
          return { ...item, isExisted, isWaiting };
        });
      }
      this.setState({ users: arr });
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { keyword } = this.state;
    if (prevState?.keyword !== keyword && (keyword.length === 5 || keyword.length === 6)) {
      this.fetchData();
    }
  }

  onConfirmSendRequestPress = () => {
    const { userSelected } = this.state;
    this.sendRequestPopupRef.hide();
    setTimeout(() => {
      if (userSelected) {
        this.props.sendRequestContact(
          userSelected?.phoneNumber,
          userSelected?.nickname,
          (success) => {
            if (success) {
              showInfoAlert('Đã gửi kết bạn thành công');
              this.searchBarComponent.onClearSearchPress();
              this.props.navigation.navigate('ContactRequestList');
            } else {
              showInfoAlert('Gửi lời mời kết bạn thất bại');
            }
          },
        );
      }
    }, 500);
  };

  renderNote = () => {
    const { keyword, isSearched } = this.state;
    if (!keyword && !isSearched) {
      return <View />;
    }
    return (
      <View style={{ flex: 1, height: 400, alignItems: 'center', marginTop: SH(32) }}>
        <Image source={ICON_PATH.statusError} style={{ height: SW(56), width: SW(56) }} />
        <AppText
          style={{
            opacity: 0.6,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: '#24253d',
            marginTop: SH(16),
          }}
        >
          {`Mã MFast `}
          <AppText semiBold>{keyword}</AppText>
          {` không tồn tại,\nvui lòng kiểm tra lại`}
        </AppText>
      </View>
    );
  };

  renderWelcome = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 400,
          alignItems: 'center',
          marginTop: SH(40),
        }}
      >
        <AppText
          style={{
            height: 50,
            opacity: 0.6,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: '#656585',
            paddingHorizontal: 40,
          }}
        >
          Nhập đúng mã MFast của đối phương (gồm 5 hoặc 6 chữ số) để gửi lời mời kết bạn
        </AppText>
      </View>
    );
  };

  renderNavigationBar() {
    return <NavigationBar onCancelPress={this.onClosePress} />;
  }

  renderSearchBar() {
    const { isSearching } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          height: 56,
          alignItems: 'center',
        }}
      >
        <SearchBar
          ref={(ref) => {
            this.searchBarComponent = ref;
          }}
          style={{ flex: 1, backgroundColor: '#fff' }}
          containerStyle={{ backgroundColor: '#fff' }}
          inputStyle={{ backgroundColor: '#fff' }}
          loading={isSearching}
          onSearchTextChanged={this.onSearchTextChanged}
          placeholder={'Nhập mã MFast'}
          delayTime={10}
          iconLeft={ICON_PATH.search3}
          iconRight={ICON_PATH.close4}
        />
      </View>
    );
  }

  renderLoading() {
    return (
      <View
        style={{
          flex: 1,
          height: 400,
          alignItems: 'center',
          marginTop: SH(40),
        }}
      >
        <ActivityIndicator
          size={'large'}
          style={{ width: SW(56), height: SW(56) }}
          color={Colors.gray2}
        />
        <AppText
          style={{
            height: 50,
            opacity: 0.6,
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: '#656585',
            paddingHorizontal: 40,
          }}
        >
          Đang kiểm tra, Mã MFast có định dạnh từ 5 hoặc 6 chữ số
        </AppText>
      </View>
    );
  }

  renderPopupSendRequest() {
    return (
      <Popup
        ref={(ref) => {
          this.sendRequestPopupRef = ref;
        }}
        style={{ marginLeft: 0, marginRight: 0 }}
        renderContent={() => {
          return (
            <View>
              <AppText
                style={{
                  fontSize: 15,
                  lineHeight: 18,
                  textAlign: 'center',
                  margin: 16,
                }}
              >
                {'Thêm liên hệ mới'}
              </AppText>
              <AppText
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  textAlign: 'center',
                  color: '#24253dbb',
                  marginLeft: 16,
                  marginRight: 16,
                }}
              >
                {'Bạn đang yêu cầu thêm liên hệ '}
                <AppText
                  style={{
                    fontSize: 15,
                    lineHeight: 18,
                    textAlign: 'center',
                    color: '#24253d',
                    fontWeight: '600',
                    marginTop: 4,
                  }}
                >
                  {this.state.phoneNumber}
                </AppText>
              </AppText>

              <AppText
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  textAlign: 'center',
                  color: '#24253dbb',
                  marginHorizontal: 16,
                  marginBottom: 0,
                }}
              >
                {'Hệ thống sẽ gửi yêu cầu của bạn đến liên hệ này.'}
              </AppText>
            </View>
          );
        }}
        content={this.state.phoneNumber}
        onYesPress={this.onConfirmSendRequestPress}
      />
    );
  }

  renderItemUser = () => {
    const user = this?.state?.users[0];

    return (
      <View style={{ flex: 1, alignItems: 'center', marginTop: SH(32), marginHorizontal: SW(16) }}>
        <CharAvatar
          source={hardFixUrlAvatar(user?.avatar)}
          style={{
            width: SW(100),
            height: SW(100),
            borderRadius: SW(50),
            backgroundColor: Colors.gray1,
          }}
          defaultName={user?.nickname}
          textStyle={{ fontSize: 30, lineHeight: 42 }}
        />
        <AppText
          style={{ color: Colors.gray1, marginTop: SH(12), fontSize: SH(16), lineHeight: SH(22) }}
        >
          {user?.nickname}
        </AppText>
        <AppText
          style={{ color: Colors.gray7, marginTop: SH(4), fontSize: SH(14), lineHeight: SH(20) }}
        >
          Mã MFast - {user?.referralCode}
        </AppText>
        {!user?.isExisted ? (
          <TouchableOpacity
            onPress={() => {
              this.onPressRequest(user);
            }}
            style={{
              width: SW(180),
              height: SH(48),
              borderRadius: SW(24),
              backgroundColor: Colors.primary2,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SH(20),
            }}
          >
            <AppText
              medium
              style={{
                color: Colors.primary5,
                fontSize: SH(16),
                top: SH(1),
              }}
            >
              {user?.isWaiting ? 'Gửi lại kết bạn' : 'Kết bạn ngay'}
            </AppText>
          </TouchableOpacity>
        ) : (
          <AppText
            medium
            style={{
              fontSize: SH(16),
              top: SH(20),
            }}
          >
            {'Đã kết bạn'}
          </AppText>
        )}
      </View>
    );
  };

  onPressRequest = (user) => {
    this.setState({ userSelected: user });
    if (user?.isWaiting) {
      showQuestionAlert(`Bạn muốn gửi lại lời mời tới ${user.nickname}`, 'Đồng ý', 'Để sau', () => {
        this.props.resendRequestContact(user.phoneNumber);
        showInfoAlert('Đã gửi thành công');
      });
    } else {
      if (this.sendRequestPopupRef) this.sendRequestPopupRef.show();
    }
  };

  render() {
    const { fetchingConversationContacts } = this.props;
    const { users, loading, isSearched } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {this.renderSearchBar()}
        {loading
          ? this.renderLoading()
          : isSearched
          ? users.length > 0
            ? this.renderItemUser()
            : this.renderNote()
          : this.renderWelcome()}
        {/* {this.renderLoading()} */}
        {this.renderPopupSendRequest()}
        <Loading visible={fetchingConversationContacts} />
      </View>
    );
  }
}

CreateContactRequest.navigationOptions = () => ({
  title: ' ', // must have a space or navigation will crash
  header: null,
});

const mapStateToProps = (state) => ({
  fetchingConversationContacts: state.fetchingConversationContacts,
  myUser: state.myUser,
  conversationContacts: state.conversationContacts,
  invitationsRequestsContact: state.invitationsRequestsContact,
});

const mapDispatchToProps = (dispatch) => ({
  fetchConversationContacts: (callback) => dispatch(fetchConversationContacts(callback)),
  fetchInvitationsRequests: (callback) => dispatch(fetchInvitationsRequests(callback)),
  sendRequestContact: (phoneNumber, nickname, callback) =>
    dispatch(sendRequestContact(phoneNumber, nickname, callback)),
  resendRequestContact: (phoneNumber, callback) =>
    dispatch(resendRequestContact(phoneNumber, callback)),
  openChatWithUser: (user) => dispatch(openChatWithUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateContactRequest);
