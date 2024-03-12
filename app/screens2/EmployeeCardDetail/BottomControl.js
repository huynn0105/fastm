import { TextField } from 'react-native-material-textfield';
import { View, TouchableOpacity, Text } from 'react-native';
import React from 'react';

import { showQuestionAlert, showQuestionAlertWithTitle } from '../../utils/UIUtils';
import { CARD_STATUS } from '../EmployeeCard';
import AppText from '../../componentV3/AppText';
export class BottomControl extends React.Component {
  renderEmailInput({ mail, onEmailChanged }) {
    return (
      <View
        style={{
          height: 64,
          margin: 16,
          marginTop: 0,
        }}
      >
        <TextField
          label="Email"
          value={mail}
          onChangeText={onEmailChanged}
          labelFontSize={13}
          fontSize={15}
          labelHeight={20}
        />
      </View>
    );
  }
  renderFinishedAction({ onSendEmailPress }) {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TouchableOpacity
            style={{
              height: 46,
              backgroundColor: '#00aeef',
              borderRadius: 23,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onSendEmailPress}
          >
            <AppText
              style={{
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
                color: '#ffffff',
                marginLeft: 16,
                marginRight: 16,
              }}
            >
              {'Gửi thẻ về Email trên'}
            </AppText>
          </TouchableOpacity>
        </View>
        <AppText
          style={{
            fontSize: 14,
            textAlign: 'center',
            color: '#24253d',
            margin: 32,
          }}
        >
          {'Bấm “Gửi thẻ về Email trên” và tự đi in thẻ nhân viên của mình'}
        </AppText>
      </View>
    );
  }
  renderFinishContent = () => {
    const { mail, onSendEmailPress, onEmailChanged } = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: 'white',
        }}
      >
        {this.renderEmailInput({ mail, onEmailChanged })}
        {this.renderFinishedAction({ onSendEmailPress })}
      </View>
    );
  };
  render() {
    const { status } = this.props;
    const isSuccessed = status === CARD_STATUS.SUCCESS;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: '#fff',
        }}
      >
        {isSuccessed ? this.renderFinishContent() : null}
      </View>
    );
  }
}
