import React, { Component } from 'react';
import tracker, { EVENT, ACTION } from '../../tracking';

const componentWithTracker = (WrappedComponent, ComponentID) => {
  return class TrackerComponent extends Component { //eslint-disable-line
    componentDidMount() {
      tracker.addEvent({
        [EVENT.ACTION_ID]: ACTION.OPEN,
        [EVENT.SCREEN_ID]: ComponentID,
      });
    }

    componentWillUnmount() {
      tracker.addEvent({
        [EVENT.ACTION_ID]: ACTION.CLOSE,
        [EVENT.SCREEN_ID]: ComponentID,
      });
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  };
};

export default componentWithTracker;
