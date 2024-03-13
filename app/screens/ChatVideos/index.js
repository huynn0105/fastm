
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

import Spinner from 'react-native-loading-spinner-overlay';

import Styles from 'app/constants/styles';
import VideosRow from 'app/components/ChatVideos/VideosRow';
import AppText from '../../componentV3/AppText';
import NavigationBar from './NavigationBar';

import {
  chatVideos,
  loadChatVideosFromFirebase,
} from '../../submodules/firebase/redux/actions';

import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// ChatVideos
// --------------------------------------------------

class ChatVideos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinnerText: '',
      isSpinnerVisible: false,
      videosViewerIndex: 0,
      isVideosViewerHidden: true,
    };
  }
  componentDidMount() {
    // this.props.loadChatVideosFromFirebase(128);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  componentWillUnmount() {
    // disabled -> will make videos viewer render err
    // this.props.setChatVideos([]);
  }
  // --------------------------------------------------
  onClosePress = () => {
    this.props.navigation.goBack();
  }
  onChatVideoPress = (video, index) => {
  }
  onVideosViewerBackPress = () => {
    this.setState({
      videosViewerIndex: 0,
      isVideosViewerHidden: true,
    });
  }

  onViewMoreVideosPress = () => {
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
          videos={this.props.chatVideos}
          onVideoPress={this.onChatVideoPress}
        />
      </View>
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
          {/* {this.renderVideosViewerModal()} */}
          {this.renderSpinner()}
        </ScrollView>
      </View>
    );
  }
}

// --------------------------------------------------

ChatVideos.navigationOptions = () => ({
  title: 'Hình ảnh chung',
  header: null,
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

ChatVideos.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  thread: state.chatThread,
  chatVideos: state.chatVideos,
  isFetchingChatVideoMessages: state.isFetchingChatVideoMessages,
});

const mapDispatchToProps = (dispatch) => ({
  setChatVideos: (videos) => dispatch(chatVideos(videos)),
  loadChatVideosFromFirebase: (maxVideos) => dispatch(loadChatVideosFromFirebase(maxVideos)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatVideos);

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
