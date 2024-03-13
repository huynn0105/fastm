
import React, { Component } from 'react';
import {
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';

import { Thread } from '../../submodules/firebase/model';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import { showInfoAlert } from '../../utils/UIUtils';

import NavigationBar from './NavigationBar';

const EMPTY_THREAD = new Thread();

class PinMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  onPinMessagePress = () => {
    const pinMessage = async () => {
      const result = await FirebaseDatabase.pinMessage(this.state.text, this.props.thread.uid);
      if (result) {
        this.props.navigation.goBack();
        showInfoAlert('Ghim thành công');
      }
    };
    pinMessage();
  }

  onClosePress = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View>
        <NavigationBar
          onClosePress={this.onClosePress}
          onPinMessagePress={this.onPinMessagePress}
        />
        <TextInput
          style={{
            margin: 16,
            // height: '50%',
          }}
          ref={ref => { this.textInput = ref; }}
          onChangeText={(text) => this.setState({ text })}
          placeholder={'Nội dung thông báo sẽ được ghim lên đầu cuộc trò chuyện'}
          placeholderTextColor={'#ccc'}
          value={this.state.text}
          numberOfLines={0}
          multiline
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  thread: state.chatThread ? state.chatThread : EMPTY_THREAD,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PinMessage);
