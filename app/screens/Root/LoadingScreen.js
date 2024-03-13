import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

class LoadingScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logoImage}
          source={require('./img/logo.png')}
          resizeMode={'contain'}
        />
        <View style={{ height: 32 }} />
        <ActivityIndicator
          animating
          color={'#39B5FC'}
          size={'small'}
        />
        <View style={{ height: 128 }} />
        <Image
          style={styles.bottomImage}
          source={require('./img/wave.png')}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    marginLeft: 64,
    marginRight: 64,
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingIndicator: {
    position: 'absolute',
    bottom: 20,
  },
});

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = (dispatch) => {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
