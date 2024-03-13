'use strict';

import React, { } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';

import PropTypes from 'prop-types';

// --------------------------------------------------

const NewsRow = (props) => (
  <TouchableHighlight
    onPress={() => {
      if (props.onPress !== undefined) {
        props.onPress();
      }
    }}
    underlayColor='#0008'
  >

    <View style={styles.container}>

      <View style={styles.row} >

        <LogoImage
          image={props.image}
        />
        <View style={{ width: 12 }} />

        <NewsContent
          title={props.title}
          details={props.details}
          time={props.time}
        />
        <View style={{ width: 8 }} />

      </View>

      {
        props.isSeparatorHidden ? null :
        <Seperator />
      }

    </View>

  </TouchableHighlight>
);

// --------------------------------------------------

const LogoImage = (props) => (
  <Image
    style={{
      width: 70,
      height: 80,
      borderRadius: 2.0,
    }}
    source={props.image}
    resizeMode='contain'
  />
);

const NewsContent = (props) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      backgroundColor: '#f000'
    }}
  >
    <Text style={{ marginTop: 4, fontSize: 16, fontWeight: '400' }}>
      {props.title}
    </Text>

    <Text
      style={{ marginTop: 4, fontSize: 14, fontWeight: '300' }}
      numberOfLines={2}
    >
      {props.details}
    </Text>

    <NewsTime
      time={props.time}
    />
  </View>
);

const NewsTime = (props) => (
  <View
    style={{
      flexDirection: 'row',
      marginTop: 4,
    }}
  >
    <Image
      style={{ alignSelf: 'center', width: 12 }}
      source={require('./img/time1.png')}
      resizeMode='contain'
    />
    <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '300' }}>
      {props.time}
    </Text>
  </View>
);

const Seperator = () => (
  <View
    style={{
      height: 1.0,
      marginTop: 12,
      backgroundColor: '#E2E2E2'
    }}
  />
);

// --------------------------------------------------

NewsRow.defaultProps = {
  isSeparatorHidden: false,
};

NewsRow.propTypes = {
  image: PropTypes.object,
  title: PropTypes.string,
  details: PropTypes.string,
  time: PropTypes.string,
  isSeparatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#ffffff',
    borderColor: '#f00',
    borderWidth: 0,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default NewsRow;
