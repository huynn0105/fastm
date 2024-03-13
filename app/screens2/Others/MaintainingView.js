import React, { PureComponent } from 'react';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';

import { checkSystemStatus } from '../../redux/actions';

class MaintainingView extends PureComponent {
  constructor(props) {
    super(props);

    this.needCheckSystemStatus = true;
    this.timerSystemStatus = null;
  }

  componentDidMount() {
    this.checkSystemStatus();
  }

  componentWillUnmount() {
    if (this.timerSystemStatus) {
      console.log('clearTimeout');
      clearTimeout(this.timerSystemStatus);
    }
    this.needCheckSystemStatus = false;
  }

  checkSystemStatus() {
    if (this.needCheckSystemStatus) {
      this.timerSystemStatus = setTimeout(() => {
        this.props.checkSystemStatus();
        console.log('checkSystemStatus');
        this.checkSystemStatus();
      }, 5000);
    }
  }

  render() {
    const { url } = this.props;
    return (
      <WebView
        style={{ backgroundColor: '#E6EBFF' }}
        source={{ uri: url }}
        scalesPageToFit
        dataDetectorTypes={'none'}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  checkSystemStatus: () => dispatch(checkSystemStatus()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaintainingView);
