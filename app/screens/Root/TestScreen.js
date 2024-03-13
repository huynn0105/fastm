import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// --------------------------------------------------
// TestScreen
// --------------------------------------------------

class TestScreen extends Component {
  render() {
    
    return (
      <View style={styles.container}>
        <Text>
          {'TestScreen / UI'}
        </Text>
      </View>
    );
  }
}

// --------------------------------------------------
// react-redux
// --------------------------------------------------

TestScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TestScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#E6EBFF',
  },
});
