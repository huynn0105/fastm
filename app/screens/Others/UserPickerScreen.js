/**
 * Help to pick a user
 * There're two mode: 'owner' & 'user' which make the screen load users from different source
 */
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppStyles from 'app/constants/styles';

import { getOwners, getUsers } from '../../redux/actions';

import KJImage from 'app/components/common/KJImage';
import KJTextButton from '../../common/KJTextButton';
import KJTouchableOpacity from '../../common/KJTouchableOpacity';

import Utils from '../../utils/Utils'; // eslint-disable-line
import { getAvatarPlaceholder, hidePhoneNumber } from '../../utils/UIUtils';

const _ = require('lodash');
const removeDiacritics = require('diacritics').remove;

// --------------------------------------------------

const LOG_TAG = '7777: UserPickerScreen.js'; // eslint-disable-line

class UserPickerScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      searchText: '',
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.reloadData();
    }, 0);
  }
  componentWillReceiveProps(nextProps) {
    // get data
    let data = [];
    if (
      nextProps.getUsersResponse && nextProps.getUsersResponse.data
    ) {
      data = nextProps.getUsersResponse.data;
      const users = data.map(item => {
        const fullNameNoDiacritics = removeDiacritics(item.fullName);
        const hiddenMobilePhone = hidePhoneNumber(item.mobilePhone);
        return { ...item, fullNameNoDiacritics, hiddenMobilePhone };
      });
      this.setState({
        users,
      });
    }
    // update state
    if (this.props.registerReferral === false && nextProps.registerReferral) {
      if (this.inputText) {
        this.inputText.focus();
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  // --------------------------------------------------
  onUserSelect = (user) => {
    // Utils.log(`${LOG_TAG} onUserSelect: `, user);
    this.props.onPickUser(user);
  }
  onCancelPress = () => {
    this.props.onCancel();
  }
  onSearchInputChangeText = (text) => {
    // Utils.log(`${LOG_TAG} onSearchInputChangeText ${text}`);
    this.debounceSetSearchText(text);
  }
  onRegisterPress = () => {
    if (this.props.selectedUser && this.props.selectedUser !== null) {
      this.props.onRegisterPress();
    }
  }
  // --------------------------------------------------
  getUsers() {
    const users = this.state.users;
    return users;
  }
  getUsersPlaceholderText() {
    const placeholderText = 'Chọn người đã giới thiệu và hướng dẫn bạn tham gia MFast, nếu không có vui lòng bấm\n';
    return placeholderText;
  }
  setSearchText = (text) => {
    let keySearch = text;
    if (keySearch === '') {
      keySearch = 'nokey123AS324ASF24234as234';
    }
    this.setState({
      searchText: keySearch,
    }, () => {
      this.reloadData();
    });
  }
  debounceSetSearchText = _.debounce(this.setSearchText, 500);
  reloadData = () => {
    const keySearch = this.state.searchText;
    if (this.props.pickerMode === 'owner') {
      // const selectedRef = this.props.selectedRef;
      // const selectedRefID = selectedRef ? selectedRef.subscriptionID : '';
      // this.props.getOwners(selectedRefID, keySearch);
    } else {
      this.props.onUnPickUser();
      this.props.getUsers(keySearch);
    }
  }
  // --------------------------------------------------
  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <Image
          style={styles.searchIcon}
          source={require('./img/magnifyingGlass.png')}
          resizeMode="contain"
        />
        <TextInput
          ref={o => { this.inputText = o; }}
          style={styles.searchInput}
          autoFocus={false}
          autoCorrect={false}
          placeholder="Tìm theo họ tên hoặc số ĐT"
          placeholderTextColor="#808080"
          onChangeText={this.onSearchInputChangeText}
          onSubmitEditing={this.onSearchInoutSubmitEditing}
        />
      </View>
    );
  }
  renderUsersList() {
    const data = this.getUsers();
    const placeholderText = this.getUsersPlaceholderText();
    return (
      data.length === 0 ?
        <View style={styles.emptyContainer}>
          <Text
            style={styles.emptyText}
          >
            {placeholderText}
          </Text>
          <View />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <KJTouchableOpacity
              onPress={this.props.onRegisterWithSkipRefPress}
              activeOpacity={0.65}
            >
              <Text style={[styles.skipText, { textDecorationLine: 'underline' }]}>
                Bỏ qua
              </Text>
            </KJTouchableOpacity>
            <Text style={styles.skipText}>
              {' và hoàn tất đăng kí.'}
            </Text>
          </View>
        </View>
        :
        <FlatList
          // onRefresh={() => this.reloadData()}
          // refreshing={isRefreshing}
          data={data}
          extraData={this.state.searchText}
          keyExtractor={item => item.uid}
          renderItem={(row) => this.renderUserItem(row.item)}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'on-drag'}
        />
    );
  }
  renderUserItem(user) {
    let isSelected = false;
    if (this.props.selectedUser) {
      isSelected = this.props.selectedUser.subscriptionID === user.subscriptionID;
    }
    return (
      <KJTouchableOpacity
        onPress={() => this.onUserSelect(user)}
        activeOpacity={0.65}
      >
        <View style={styles.userItem}>
          <View style={styles.userItemRow}>
            {
              user.avatarImage && user.avatarImage.length > 0 ?
                <KJImage
                  style={styles.userAvatar}
                  source={{ uri: user.avatarImage }}
                  resizeMode={'cover'}
                />
                :
                <Image
                  style={styles.userAvatar}
                  source={getAvatarPlaceholder(user.sex)}
                  resizeMode={'cover'}
                />
            }
            <View style={styles.userItemContent}>
              <Text style={[styles.userNameText, isSelected ? { fontWeight: '800' } : {}]}>
                {`${user.fullName}`}
              </Text>
              <Text style={[styles.userPhoneText, isSelected ? { fontWeight: '800' } : {}]}>
                {user.hiddenMobilePhone}
              </Text>
            </View>
            {
              <View>
                <KJTouchableOpacity
                  style={[styles.removeButton, styles.checkboxContainer, { flexDirection: 'row' }]}
                  onPress={() => this.onUserSelect(user)}
                >
                  <Text style={[styles.titleText, { marginTop: 6, marginRight: 6 }]}>
                    {isSelected ? 'Đã chọn' : 'Chọn'}
                  </Text>
                  <Image
                    style={styles.imageCheckbox}
                    source={isSelected ? require('./img/checked.png') : require('./img/uncheck.png')}
                  />
                </KJTouchableOpacity>
              </View>
            }
          </View>
        </View>
      </KJTouchableOpacity>
    );
  }
  // --------------------------------------------------
  renderBottomActions = () => {
    const selected = this.props.selectedUser && this.props.selectedUser !== null;
    return (
      <View style={styles.bottomContainer}>
        {/* <KJTextButton
          buttonStyle={[AppStyles.button, {
            alignItems: 'flex-start',
            marginTop: 0,
            borderColor: '#0000',
          }]}
          textStyle={[AppStyles.button_text, {
            marginLeft: 16,
            marginRight: 16,
            fontSize: 14,
            fontWeight: '400',
            color: '#444',
          }]}
          text={'Bỏ qua'}
          onPress={this.props.onRegisterWithSkipRefPress}
          backgroundColor="#0000"
        /> */}
        <KJTextButton
          buttonStyle={[AppStyles.button, {
            alignItems: 'flex-start',
            marginTop: 0,
            borderColor: '#0000',
          }]}
          textStyle={[AppStyles.button_text, {
            marginLeft: 16,
            marginRight: 16,
            fontSize: 14,
            fontWeight: '400',
            color: '#fff',
          }]}
          text={'Hoàn tất'}
          onPress={this.onRegisterPress}
          backgroundColor={selected ? '' : '#bababa'}
        />
        <KJTextButton
          buttonStyle={[AppStyles.button, {
            alignItems: 'flex-start',
            marginTop: 0,
            borderRadius: 0,
            borderColor: '#0000',
          }]}
          textStyle={[AppStyles.button_text, {
            marginLeft: 24,
            marginRight: 24,
            fontSize: 14,
            fontWeight: '400',
            color: '#0097DF',
          }]}
          underlayColor="#0000"
          text={'Đăng nhập'}
          onPress={() => {
            this.props.onLoginPress();
          }}
          backgroundColor="#0000"
        />
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.titleText}>
            Chọn người giới thiệu (nếu có)
          </Text>
          {this.renderHeader()}
          {this.renderUsersList()}
          {
            this.props.isGetUsersProcessing &&
            <LoadingScreen />
          }
          {/* {this.renderBottomActions()} */}
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

UserPickerScreen.propTypes = {
  pickerMode: PropTypes.string,
  onPickUser: PropTypes.func,
  onCancel: PropTypes.func,
};

UserPickerScreen.defaultProps = {
  pickerMode: 'owner',
  onPickUser: () => { },
  onCancel: () => { },
};

// --------------------------------------------------
// react-redux
// --------------------------------------------------

UserPickerScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isGetOwnersProcessing: state.isGetOwnersProcessing,
  getOwnersResponse: state.getOwnersResponse,
  isGetUsersProcessing: state.isGetUsersProcessing,
  getUsersResponse: state.getUsersResponse,
});

const mapDispatchToProps = (dispatch) => ({
  getOwners: (referralID, keySearch) => dispatch(getOwners(referralID, keySearch)),
  getUsers: (keySearch) => dispatch(getUsers(keySearch)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPickerScreen);

const LoadingScreen = () => (
  <Animatable.View
    style={styles.loadingContainer}
    animation={'fadeIn'}
    duration={250}
  >
    <View
      style={styles.loadingBorder}
    >
      <ActivityIndicator
        animating
        color={'#39B5FC'}
        size={'small'}
      />
      <Text
        style={{ marginTop: 8, color: '#0080DC' }}
      >
        Đang tải
      </Text>
    </View>
  </Animatable.View>
);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 16,
    marginBottom: 0,
    overflow: 'hidden',
  },
  headerContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#eee',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 12,
    backgroundColor: '#fff8',
    color: '#0008',
    marginBottom: 8,
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginRight: 4,
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff0',
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 8,
    marginRight: 8,
    height: 40,
  },
  cancelButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginLeft: 4,
    backgroundColor: '#f000',
  },
  cancelButtonText: {
    marginLeft: 12,
    marginRight: 12,
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  userItemRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userItemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  userAvatar: {
    width: 40,
    height: 40,
    marginBottom: 4,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 0.0,
    borderColor: '#39B5FC',
    backgroundColor: '#fff',
  },
  userNameText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '200',
    color: '#202020',
    backgroundColor: '#0000',
  },
  userPhoneText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '200',
    color: '#202020',
    backgroundColor: '#0000',
  },
  checkboxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  imageCheckbox: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  removeButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  removeButtonTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#f00',
    backgroundColor: '#0000',
  },
  separator: {
    height: 1.0,
    marginTop: 4,
    backgroundColor: '#E2E2E2',
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    // paddingLeft: 12,
    // paddingRight: 12,
    // backgroundColor: '#E6EBFF',
  },
  emptyText: {
    flex: 0,
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#808080',
    textAlign: 'center',
  },
  skipText: {
    alignSelf: 'center',
    marginTop: 2,
    paddingBottom: 28,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  bottomContainer: {
    height: 56,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000',
    // marginRight: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4',
  },
  loadingBorder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0',
  },
});
