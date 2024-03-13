import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Modal from 'react-native-modal';

import {
  readNews,
} from '../../redux/actions';

import Styles from '../../constants/styles';
import DatabaseManager from '../../manager/DatabaseManager';
import DigitelClient from '../../network/DigitelClient';
import ImageViewer from '../others/ImageViewer';

import NewsHeader from './NewsHeader';
import RelatedNewsControl from './RelatedNewsControl';

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: NewsDetailsScreen.js';
/* eslint-enable */

// --------------------------------------------------
// NewsDetailsScreen
// --------------------------------------------------

class NewsDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      news: this.props.navigation.state.params.news,
      isImageViewerHidden: true,
    };
  }
  componentDidMount() {
    this.reloadData();
  }
  // --------------------------------------------------
  onNewsPress = (news) => {
    this.setState({
      news,
    });
    setTimeout(() => {
      this.reloadData();
    }, 250);
    setTimeout(() => {
      if (this.scrollView) {
        this.scrollView.scrollTo(0, 0);
      }
    }, 500);
  }
  onNewsImagePress = () => {
    this.showImageViewer();
  }
  showImageViewer() {
    this.setState({
      isImageViewerHidden: false,
    });
  }
  hideImageViewer() {
    this.setState({
      isImageViewerHidden: true,
    });
  }
  // --------------------------------------------------
  reloadData() {
    const newsID = this.state.news.uid;
    const categoryID = this.state.news.categoryID;
    const results = DatabaseManager.shared().findRelatedNews(newsID, categoryID);
    const relatedNews = results.slice(0, 5);
    this.setState({
      relatedNews,
    });
    DigitelClient.readNews(newsID);
  }
  // --------------------------------------------------
  renderImageViewer() {
    return (
      <Modal 
        style={styles.imageViewerModal}
        isVisible={!this.state.isImageViewerHidden}
      >
        <ImageViewer
          imageUri={this.state.news.image}
          onClosePress={() => this.hideImageViewer()}
        />
      </Modal>
    );
  }
  render() {
    const news = this.state.news;
    return (
      <View style={styles.container}>
        <ScrollView
          ref={o => { this.scrollView = o; }}
          style={{ flex: 1 }}
        >
          <NewsHeader
            news={news}
            onImagePress={this.onNewsImagePress}
          />
          <View
            style={styles.separator}
          />
          <RelatedNewsControl
            title={'Tin tức liên quan'}
            data={this.state.relatedNews}
            onItemPress={this.onNewsPress}
          />
        </ScrollView>
        {this.renderImageViewer()}
      </View>
    );
  }
}

// --------------------------------------------------

NewsDetailsScreen.propsTypes = {
  onNewsImagePress: PropTypes.func,
};

NewsDetailsScreen.defaultProps = {
  onNewsImagePress: () => {},
};

NewsDetailsScreen.navigationOptions = () => ({
  title: 'Thông báo',
  headerStyle: Styles.navigator_header_no_border,
  headerTitleStyle: Styles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

NewsDetailsScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
  readNews: (news) => dispatch(readNews(news)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetailsScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#FBFBFB',
  },
  separator: {
    flex: 1,
    height: 0,
    backgroundColor: '#FBFBFB',
  },
  imageViewerModal: {
    margin: 0,
    padding: 0,
  },
});
