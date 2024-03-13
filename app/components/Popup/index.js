import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Modal from 'react-native-modal';

import PropTypes from 'prop-types';

import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../../componentV3/AppText';

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

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onCancelPress = () => {
    this.props.onCancelPress();
    this.hide();
  };
  onYesPress = () => {
    this.props.onYesPress(this.props.content);
  };

  show = () => {
    this.setState({ visible: true });
  };
  hide = () => {
    this.setState({ visible: false });
  };
  // --------------------------------------------------
  renderContent() {
    return this.props.renderContent();
  }
  renderButtons() {
    const { cancelText = 'Hủy', yesText = 'Đồng ý' } = this.props;
    return (
      <View style={styles.bottomContainer}>
        <KJTouchableOpacity style={styles.cancelButton} onPress={this.onCancelPress}>
          <AppText style={styles.cancelButtonText}>{cancelText}</AppText>
        </KJTouchableOpacity>
        <KJTouchableOpacity style={styles.yesButton} onPress={this.onYesPress}>
          <AppText style={styles.yesButtonText}>{yesText}</AppText>
        </KJTouchableOpacity>
      </View>
    );
  }
  render() {
    const { style } = this.props;
    const { visible } = this.state;
    return (
      <Modal isVisible={visible} useNativeDriver animationIn="zoomIn" animationOut="zoomOut">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.container, style]}>
            {this.renderContent()}
            {this.renderButtons()}
          </View>
          <View style={{ height: 44 }} />
        </View>
      </Modal>
    );
  }
}

// --------------------------------------------------

Popup.propTypes = {
  content: PropTypes.object, // eslint-disable-line
  onCancelPress: PropTypes.func,
  onYesPress: PropTypes.func,
};

Popup.defaultProps = {
  content: {},
  onCancelPress: () => {},
  onYesPress: () => {},
};

export default Popup;

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
    paddingTop: 26,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
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
    color: '#50A9E4',
    fontWeight: '600',
  },
});
