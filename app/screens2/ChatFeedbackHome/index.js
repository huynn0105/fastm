import React, { Component } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import AppText from '../../componentV3/AppText';
import { fonts } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import {
  fetchAllListOSTicket,
  fetchListOSTicket,
  TICKETS_STATUS,
} from '../../redux/actions/feedback';
import { openLogin } from '../../redux/actions/navigation';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import iphone12Helper from '../../utils/iphone12Helper';
import { SCREEN_MODE } from '../ChatFeedback';
import { ListFeedback } from './ListFeedback';

class ChatFeedbackHome extends Component {
  static navigationOptions = {
    title: 'Trung tâm hỗ trợ',
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
    },
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabViewNavigation: {
        index: 0,
        routes: [
          { key: 'all', title: 'Tất cả', type: TICKETS_STATUS.ALL },
          { key: 'pending', title: 'Chờ trả lời', type: TICKETS_STATUS.PENDING },
          { key: 'responded', title: 'Đã trả lời', type: TICKETS_STATUS.RESPONDED },
          { key: 'closed', title: 'Đã đóng', type: TICKETS_STATUS.CLOSED },
        ],
      },
    };

    this.paging = {
      [TICKETS_STATUS.ALL]: 1,
      [TICKETS_STATUS.RESPONDED]: 1,
      [TICKETS_STATUS.PENDING]: 1,
    };

    this.checkAndOpenTickerDetail();
    this.subs = [this.props.navigation.addListener('didFocus', this.componentDidFocus)];
  }

  componentDidMount() {
    this.props.fetchAllListOSTicket();
  }

  componentDidFocus = () => {
    if (!this.props.isFetchingListOSTicketByUserID) {
      this.fetchAllListOSTicket();
    }
  };

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  /*  EVENTS
   */

  onSendFeedbackButtonPress = () => {
    const { myUser } = this.props;
    if (myUser && myUser.isLoggedIn) {
      this.props.navigation.navigate('ChatFeedback', { screenMode: SCREEN_MODE.WELCOME });
    } else {
      this.props.openLogin();
    }
  };

  onFeedbackItemPress = (item) => {
    this.props.navigation.navigate('ChatFeedback', {
      screenMode: item.status,
      ticket: item,
    });
  };

  onListFeedbackRefresh = () => {
    this.fetchAllListOSTicket();
  };

  onLoadMorePress = (type) => {
    this.fetchListOSTicket(type);
  };

  /*  ACTIONS
   */

  fetchListOSTicket = (type) => {
    this.updatePaging(type);
    this.props.fetchListOSTicket(type, this.paging[type]);
  };

  fetchAllListOSTicket = () => {
    this.props.fetchAllListOSTicket();
    this.resetPaging();
  };

  /*  PRIVATE
   */

  checkAndOpenTickerDetail = () => {
    if (this.props.navigation.state.params) {
      const ticket = this.props.navigation.state.params.ticket;
      if (ticket) {
        setTimeout(() => {
          this.onFeedbackItemPress(ticket);
        }, 200);
      }
    }
  };

  filterFeedbacskByStatus = (feedbacks, status) => {
    return feedbacks.filter((item) => item.isAnswered === status);
  };

  updatePaging = (type) => {
    const { isFetchingListOSTicketByUserID } = this.props;
    if (isFetchingListOSTicketByUserID) return;
    this.paging[type] = this.paging[type] + 1;
  };

  resetPaging = () => {
    this.paging = {
      [TICKETS_STATUS.ALL]: 1,
      [TICKETS_STATUS.RESPONDED]: 1,
      [TICKETS_STATUS.PENDING]: 1,
    };
  };

  /*  RENDER
   */

  renderSendFeedbackButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingTop: SH(13),
          paddingHorizontal: SW(16),
          paddingBottom: SH(16),
          alignItems: 'center',
        }}
        onPress={this.onSendFeedbackButtonPress}
      >
        <Image
          source={require('./img/ic_add.png')}
          style={{ width: SW(24), height: SH(24), resizeMode: 'contain', marginRight: SW(16) }}
        />
        <AppText style={{ fontSize: SH(16), lineHeight: SH(19), color: Colors.primary2 }}>
          {'Tạo yêu cầu hỗ trợ mới'}
        </AppText>
      </TouchableOpacity>
    );
  };

  renderListFeedbackTitle = () => (
    <View>
      <AppText
        style={{
          paddingLeft: SW(16),
          paddingTop: SH(18),
          // paddingTop: 12,

          ...TextStyles.heading4,
          fontSize: SH(14),
          lineHeight: SH(20),
          color: Colors.primary4,
          opacity: 0.6,
        }}
      >
        {'Danh sách yêu cầu hỗ trợ'}
      </AppText>
    </View>
  );

  renderTabView = () => {
    const { listOSTicketByUserID = {}, isFetchingListOSTicketByUserID } = this.props;
    const { myUser } = this.props;
    return (
      <TabView
        navigationState={this.state.tabViewNavigation}
        renderScene={({ route }) => (
          <ListFeedback
            feedbacks={listOSTicketByUserID[route.type] || []}
            onFeedbackItemPress={this.onFeedbackItemPress}
            onListFeedbackRefresh={this.onListFeedbackRefresh}
            isRefreshing={isFetchingListOSTicketByUserID > 0}
            type={route.type}
            onLoadMorePress={this.onLoadMorePress}
            onPressCreateRequest={this.onSendFeedbackButtonPress}
            myUser={myUser}
          />
        )}
        renderTabBar={this.renderCustomTabBar}
        onIndexChange={(index) =>
          this.setState({ tabViewNavigation: { ...this.state.tabViewNavigation, index } })
        }
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    );
  };

  renderTabViewHeader = (props) => {
    const { totalListOSTicketByUserID } = this.props;
    const ticketNumberString = (number) => (number ? `${number} ` : '0 ');
    return (
      <View>
        {/* <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: '#ddd',
          }}
        /> */}
        <TabBar
          {...props}
          renderLabel={({ route, focused }) => (
            <View
              style={{
                // minWidth: SW(94),
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: focused ? Colors.primary2 : Colors.primary5,
                borderRadius: 18,
              }}
            >
              <AppText
                // numberOfLines={1}

                style={{
                  color: focused ? Colors.primary5 : '#777',
                  paddingHorizontal: SW(12),
                  paddingVertical: SH(7),
                  fontSize: SH(13),
                  lineHeight: SH(20),
                  fontFamily: focused ? fonts.bold : fonts.medium,
                }}
              >
                {`${ticketNumberString(totalListOSTicketByUserID[route.type])}${route.title}`}
              </AppText>
              {/* <View
                style={{ height: SH(32), width: 1, backgroundColor: '#cfd3d6', opacity: 0.6 }}
              /> */}
            </View>
          )}
          // indicatorStyle={{ backgroundColor: 'transparent', height: 0 }}
          renderIndicator={() => {
            return null;
          }}
          style={{ backgroundColor: '#0000', height: SH(40) }}
        />
      </View>
    );
  };

  handlePressTabView = (index) => {
    this.setState({
      tabViewNavigation: { ...this.state.tabViewNavigation, index },
    });
  };

  renderItemTabBar = ({ item, index }) => {
    const { totalListOSTicketByUserID } = this.props;
    const ticketNumberString = (number) => (number ? `${number} ` : '0 ');
    const { tabViewNavigation } = this.state;
    const isFocused = index === tabViewNavigation.index;

    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          backgroundColor: isFocused ? Colors.primary2 : Colors.primary5,
          borderRadius: 18,
          marginLeft: index === 0 ? 0 : SW(8),
        }}
        onPress={() => this.handlePressTabView(index)}
      >
        <AppText
          style={{
            paddingHorizontal: SW(12),
            paddingVertical: SH(7),
            color: isFocused ? Colors.primary5 : Colors.gray2,
          }}
          bold
        >
          {`${ticketNumberString(totalListOSTicketByUserID[item.type])}`}
          <AppText>{item.title}</AppText>
        </AppText>
      </TouchableOpacity>
    );
  };
  renderCustomTabBar = (props) => {
    const { navigationState } = props;
    return (
      <FlatList
        data={navigationState.routes}
        renderItem={this.renderItemTabBar}
        keyExtractor={(item) => item.key}
        horizontal={true}
        style={{
          maxHeight: SH(32),
          marginHorizontal: SW(16),
          marginTop: SH(14),
          marginBottom: SH(16),
        }}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral5 }}>
        {/* {this.renderSendFeedbackButton()} */}
        {this.renderListFeedbackTitle()}
        {/* {} */}
        {/* {this.renderCustomTabBar()} */}
        {this.renderTabView()}
      </SafeAreaView>
    );
  }
}

ChatFeedbackHome.navigationOptions = (navigation) => {
  return {
    title: 'Hỗ trợ',
    headerTintColor: '#000',
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

const mapStateToProps = (state) => ({
  myUser: state.myUser,

  listOSTicketByUserID: state.listOSTicketByUserID,
  totalListOSTicketByUserID: state.totalListOSTicketByUserID,
  isFetchingListOSTicketByUserID: state.isFetchingListOSTicketByUserID,
});

const mapDispatchToProps = {
  fetchAllListOSTicket,
  fetchListOSTicket,
  openLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatFeedbackHome);
