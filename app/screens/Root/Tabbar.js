import React, { Component } from 'react';
import { connect } from 'react-redux';

import { BottomTabBar } from 'react-navigation-tabs';

import * as Animatable from 'react-native-animatable';

import {
  isActiveTabbar,
} from 'app/redux/actions';

const _ = require('lodash');

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // offset: new Animated.Value(0.01),
      // hidden: false,
    };
  }

  componentWillReceiveProps(props) {
    const oldState = this.props.navigation.state;
    const oldRoute = oldState.routes[oldState.index].routes[0];
    const oldParams = oldRoute.params;
    const wasVisible = !oldParams || oldParams.visible;

    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index].routes[0];
    const newParams = newRoute.params;
    const isVisible = !newParams || newParams.visible;

    if (wasVisible && !isVisible) {
      setTimeout(() => {
        this.view.slideOutDown(500);
        this.setState({
          hidden: true,
        });
        this.props.isActiveTabbar(false);
      }, 0)
    } else if (isVisible && !wasVisible) {
      this.view.slideInUp(500).then(() => {
        this.setState({
          hidden: false,
        });
        this.props.isActiveTabbar(true);
      });
    }

    // if (wasVisible && !isVisible) {
    //   Animated.timing(this.state.offset, {
    //     toValue: TAB_BAR_OFFSET,
    //     duration: 200,
    //     useNativeDriver: true,
    //   }).start();
    //   this.setState({
    //     hidden: true,
    //   });
    // } else if (isVisible && !wasVisible) {
    //   Animated.timing(this.state.offset, {
    //     toValue: 0,
    //     duration: 200,
    //     useNativeDriver: true,
    //   }).start(() => {
    //     this.setState({
    //       hidden: false,
    //     });
    //   });
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    return (
      // <BottomTabBar
      //   {...this.props}
      //   style={[styles.container, {
      //     transform: [{
      //       translateY: this.state.offset,
      //     }],
      //     position: this.state.hidden ? 'absolute' : 'relative',
      //   }]}
      // />
      <Animatable.View
        ref={ref => { this.view = ref; }}
        style={[styles.container, {
          position: this.state.hidden ? 'absolute' : 'relative',
        }]}
        useNativeDriver
      >
        <BottomTabBar
          {...this.props}
        />
      </Animatable.View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  isActiveTabbar: (active) => dispatch(isActiveTabbar(active)),
});

export default connect(null, mapDispatchToProps)(TabBar);

const styles = {
  container: {
    overflow: 'hidden',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  // overView: {
  //   position: 'absolute',
  //   height: 60,
  //   width: 600,
  //   flex: 1,
  //   backgroundColor: '#0008',
  // },
};
