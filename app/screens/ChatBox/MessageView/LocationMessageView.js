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
  render() {
    const { message } = this.props;
    const lat = message.location.latitude;
    const lon = message.location.longitude;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
      >
        <View style={styles.mapViewContainer}>
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
  },
  mapView: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
});
