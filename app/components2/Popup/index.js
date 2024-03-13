import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AppText from '../../componentV3/AppText';
class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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
        <TouchableOpacity style={styles.cancelButton} onPress={this.onCancelPress}>
          <AppText style={styles.cancelButtonText}>{cancelText}</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.yesButton} onPress={this.onYesPress}>
          <AppText style={styles.yesButtonText}>{yesText}</AppText>
        </TouchableOpacity>
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
