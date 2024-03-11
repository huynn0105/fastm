import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';
const _ = require('lodash');

// --------------------------------------------------

class KJProgressHUD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCancelled: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.isHidden === false && nextProps.isHidden === true) {
      this.setState({
        isCancelled: false,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  cancelHUD() {
    this.setState({
      isCancelled: true,
    });
  }
  render() {
    const props = this.props;
    if (this.state.isCancelled || props.isHidden) return null;
    return (
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          this.cancelHUD();
        }}
      >
        <View
          style={[styles.overlay, props.overlayStyle]}
        >
          <View
            style={[styles.hud, props.hudStyle]}
          >
            <ActivityIndicator
              animating
              color={props.indicatorColor}
              size={props.indicatorSize}
            />
            <AppText
              style={[styles.statusText, props.statusTextStyle]}
            >
              {props.statusText}
            </AppText>
            <View
              style={{ height: 12 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}


// --------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0008',
  },
  hud: {
    flex: 0,
    marginLeft: 44,
    marginRight: 44,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#000A',
    borderRadius: 8,
  },
  statusText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});

// --------------------------------------------------

KJProgressHUD.propTypes = {
  isHidden: PropTypes.bool,
  isCancellable: PropTypes.bool,
  indicatorColor: PropTypes.color,
  indicatorSize: PropTypes.string,
  statusText: PropTypes.string,
  overlayStyle: PropTypes.object,
  hudStyle: PropTypes.object,
  statusTextStyle: PropTypes.object,
};

KJProgressHUD.defaultProps = {
  isHidden: false,
  isCancellable: false,
  indicatorColor: '#fff',
  indicatorSize: 'large',
  statusText: 'Đang xử lý...',
};

export default KJProgressHUD;
