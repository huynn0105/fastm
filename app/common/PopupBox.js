import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../theme/Color';
import PropTypes from 'prop-types';

import HTMLView from 'react-native-render-html';
import ScalableImage from 'react-native-scalable-image';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');
const BANNER_IMAGE_WIDTH = SCREEN_SIZE.width - 40 - 37;

// test
// const TEST_POPUP = {
//   postID: '1',
//   postContent: 'Yiruma, my very best wishes to you always....',
//   webURL: 'https://google.com',
//   postImage: 'https://about.canva.com/wp-content/uploads/sites/3/2017/02/birthday_banner.png',
// };
// end

// --------------------------------------------------
// PopupBox.js
// --------------------------------------------------

const _ = require('lodash');

class PopupBox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onCancelPress = () => {
    this.props.onCancelPress();
  };
  onYesPress = () => {
    this.props.onYesPress(this.props.popup);
  };
  // --------------------------------------------------
  renderBanner() {
    const { popup } = this.props;
    if (!popup.postImage) {
      return <View />;
    }
    return (
      <ScalableImage
        width={BANNER_IMAGE_WIDTH}
        style={styles.bannerImage}
        source={{ uri: popup.postImage }}
      />
    );
  }
  renderContent() {
    const { popup } = this.props;
    return <HTMLView html={popup.postContent} paragraphBreak={'\n'} lineBreak={'\n'} />;
  }
  renderButtons() {
    const { popup } = this.props;

    return (
      <View style={styles.bottomContainer}>
        <KJTouchableOpacity style={styles.cancelButton} onPress={this.onCancelPress}>
          <AppText style={styles.cancelButtonText}>{popup?.leftButtonTitle || 'Để sau'}</AppText>
        </KJTouchableOpacity>
        <KJTouchableOpacity style={styles.yesButton} onPress={this.onYesPress}>
          <AppText style={styles.yesButtonText}>
            {popup?.rightButtonTitle || 'Khám phá ngay'}
          </AppText>
        </KJTouchableOpacity>
      </View>
    );
  }
  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderBanner()}
        {this.renderContent()}
        {this.renderButtons()}
      </View>
    );
  }
}

// --------------------------------------------------

PopupBox.propTypes = {
  popup: PropTypes.object, // eslint-disable-line
  onCancelPress: PropTypes.func,
  onYesPress: PropTypes.func,
};

PopupBox.defaultProps = {
  popup: {},
  onCancelPress: () => {},
  onYesPress: () => {},
};

export default PopupBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#0000',
    shadowOpacity: 0.5,
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F2F2F2',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  cancelButtonText: {
    color: '#606060',
    fontWeight: '600',
  },
  yesButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  yesButtonText: {
    color: Colors.primary2,
    fontWeight: '600',
  },
});
