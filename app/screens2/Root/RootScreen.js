import React, { Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import { checkSystemStatus } from '../../redux/actions';
import MaintainingView from '../../screens/Others/MaintainingView';
import MainScreen from './MainScreen';

class RootScreen extends Component {
  componentDidMount() {
    // if (Platform.OS === 'android') {

    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    // } else {
    //   SplashScreen.hide();
    // }
  }
  render() {
    if (!this.props.systemStatus.available) {
      return <MaintainingView url={this.props.systemStatus.freeze_page} />;
    }

    if (this.props.rootScreen === 'MAIN') {
      return <MainScreen />;
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  rootScreen: state.rootScreen,
  systemStatus: state.systemStatus,
});

const mapDispatchToProps = (dispatch) => ({
  checkSystemStatus: () => dispatch(checkSystemStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
