import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Linking,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';
import MapView from 'react-native-maps';

import { Message } from '../../../submodules/firebase/model';

// --------------------------------------------------

/* eslint-disable */
import Utils from 'app/utils/Utils';
const LOG_TAG = 'LocationMessageView.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');
const MAP_WIDTH = SCREEN_SIZE.width / 2;
const MAP_HEIGHT = MAP_WIDTH * 0.75;

const _ = require('lodash');

// --------------------------------------------------
// LocationMessageView.js
// --------------------------------------------------

class LocationMessageView extends Component {
  // temporary disabled to consider on performance
  // --
  // shouldComponentUpdate(nextProps) {
  //   if (
  //     this.props.message.uid !== nextProps.message.uid &&
  //     this.props.message.location.latitude !== nextProps.message.location.latitude &&
  //     this.props.message.location.longitude !== nextProps.message.location.longitude
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
  // --

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    const { message } = this.props;
    const lat = message.location.latitude;
    const lon = message.location.longitude;
    const url = Platform.select({
      ios: `http://maps.apple.com/?q=${lat},${lon}`,
      android: `http://maps.google.com/?q=${lat},${lon}`,
    });
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
      return false;
    }).catch(err => {
      Utils.log(`${LOG_TAG} open map err:`, err);
    });
  }
  onLongPress = () => {
    if (this.props.onLocationLongPress) {
      this.props.onLocationLongPress(
        this.props.message,
        this.messageViewRef,
        this,
      );
    }
  }

  setIsSelected = (selected) => {
    this.setState({
      isSelected: selected,
    });
  }

  checkIsSelected = () => {
    return this.state.isSelected;
  }

  render() {
    const { message } = this.props;
    const lat = message.location.latitude;
    const lon = message.location.longitude;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
        onLongPress={this.onLongPress}
      >
        <View
          ref={ref => { this.messageViewRef = ref; }}
          style={[
            styles.mapViewContainer,
            this.checkIsSelected() ? styles.selectedBubble : {},
          ]}
          onLayout={() => { }}
        >
          <MapView
            style={styles.mapView}
            region={{
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          />
          {/* work around for tapping in iOS  */}
          <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
        </View>
      </TouchableOpacity>
    );
  }
}

// --------------------------------------------------

LocationMessageView.defaultProps = {
  message: {},
};

LocationMessageView.propTypes = {
  message: PropTypes.instanceOf(Message),
};

export default LocationMessageView;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  mapViewContainer: {
    borderRadius: Platform.OS === 'ios' ? 14 : 7,
    margin: 1,
    overflow: 'hidden',
    borderColor: '#0000',
    borderWidth: 1,
  },
  mapView: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
  selectedBubble: {
    borderColor: '#ff9900',
    borderWidth: 1,
  },
});
