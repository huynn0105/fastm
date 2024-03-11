import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

import { TextField } from 'react-native-material-textfield';

import AppStyles from '../../constants/styles';
import KJTextButton from '../../common/KJTextButton';
import GenderInputRow from './GenderInputRow';

const _ = require('lodash');

// --------------------------------------------------

class RegisterControl extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  renderIconDropdown = () => {
    const dropdownIcName = '../img/ic_dropDown.png';
    return (
      <View style={{
        position: 'absolute',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
      }}
      >
        <Image
          style={{ paddingBottom: 26 }}
          source={require(dropdownIcName)}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  render() {
    const props = this.props;
    return (
      <View
        style={[{
          flex: 1,
        }]}
      >
        <View style={{ height: 8, backgroundColor: '#0000' }} />
        <TextField
          label="Họ và tên"
          value={props.userInfo.fullName}
          onChangeText={props.onFullNameChangeText}
          labelFontSize={13}
          fontSize={15}
          error={this.props.errorName}
        />
        {/* <GenderInputRow
          title={'Giới tính'}
          gender={props.userInfo.gender}
          onChangeGender={props.onChangeGender}
        /> */}

        <TextField
          label="Số điện thoại"
          value={props.userInfo.phoneNumber}
          onChangeText={props.onPhoneNumberChangeText}
          labelFontSize={13}
          fontSize={15}
          keyboardType={'phone-pad'}
          error={this.props.errorPhone}
        />
        <TextField
          label="CMND"
          value={props.userInfo.cmnd}
          onChangeText={props.onCmndChangeText}
          labelFontSize={13}
          fontSize={15}
          keyboardType={'numeric'}
          error={this.props.errorCmnd}
        />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <View style={{ width: 20 }} />
        </View>
        {/* <RegisterButton
          onPress={() => props.onRegisterPress()}
        />

        <LoginButton
          onPress={() => props.onLoginPress()}
        /> */}
      </View>
    );
  }
}

// --------------------------------------------------

const RegisterButton = (props) => (
  <View
    style={{
      alignSelf: 'center',
      marginTop: 24,
    }}
  >
    <KJTextButton
      buttonStyle={[AppStyles.button]}
      textStyle={[AppStyles.button_text, {
        marginLeft: 24,
        marginRight: 24,
      }]}
      text={'Tiếp tục'}
      onPress={() => {
        props.onPress();
      }}
    />
  </View>
);

const LoginButton = (props) => (
  <View
    style={{
      alignSelf: 'center',
      marginTop: 4,
    }}
  >
    <KJTextButton
      buttonStyle={[AppStyles.button, {
        alignItems: 'flex-start',
        marginTop: 0,
        borderRadius: 0,
        borderColor: '#0000',
      }]}
      textStyle={[AppStyles.button_text, {
        marginLeft: 24,
        marginRight: 24,
        fontSize: 14,
        fontWeight: '400',
        color: '#0097DF',
      }]}
      underlayColor="#0000"
      text={'Đăng nhập'}
      onPress={() => {
        props.onPress();
      }}
      backgroundColor="#0000"
    />
  </View>
);

// --------------------------------------------------

RegisterControl.defaultProps = {
  onOwnerReferralPress: () => { },
  onUserReferralPress: () => { },
};

export default RegisterControl;
