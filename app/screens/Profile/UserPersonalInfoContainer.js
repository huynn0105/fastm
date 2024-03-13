import React, { Component } from 'react';
import { View } from 'react-native';

import PropTypes from 'prop-types';

import { User } from '../../models';

import InfoRow from './InfoRow';
import Colors from '../../theme/Color';

const _ = require('lodash');

// --------------------------------------------------

class UserPersonalInfoContainer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  render() {
    const { user, hideFieldFullName } = this.props;
    const emptyString = '---';
    const emptyTitleStyle = { color: Colors.primary4 };
    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
        }}
      >
        <InfoRow
          title={'Số CMND/ CCCD/ CCQĐ'}
          details={_.isEmpty(user.cmnd) ? emptyString : user.cmnd}
          titleStyle={_.isEmpty(user.cmnd) && emptyTitleStyle}
        />

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <InfoRow
            containerStyle={{ flex: 0.5, marginRight: 16 }}
            title={'Ngày cấp'}
            details={
              _.isEmpty(user.cmndIssuedDateString()) ? emptyString : user.cmndIssuedDateString()
            }
            titleStyle={user.cmndIssuedDateString() === '---' && emptyTitleStyle}
          />
          <View style={{ width: 16 }} />
          <InfoRow
            containerStyle={{ flex: 0.5, marginLeft: 16 }}
            title={'Nơi cấp'}
            details={
              user.cmndIssuedPlaceString() === ' ' ? emptyString : user.cmndIssuedPlaceString()
            }
            titleStyle={user.cmndIssuedPlaceString() === ' ' && emptyTitleStyle}
          />
        </View>
        {hideFieldFullName ? null : (
          <InfoRow
            containerStyle={{  }}
            title={'Họ và tên đầy đủ'}
            details={_.isEmpty(user.fullName) ? emptyString : user.fullName}
            titleStyle={_.isEmpty(user.fullName) && emptyTitleStyle}
          />
        )}

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <InfoRow
            containerStyle={{ flex: 0.5, marginRight: 16 }}
            title={'Ngày sinh'}
            details={_.isEmpty(user.dateOfBirthString()) ? emptyString : user.dateOfBirthString()}
            titleStyle={user.dateOfBirthString() === '---' && emptyTitleStyle}
          />
          <View style={{ width: 16 }} />
          <InfoRow
            containerStyle={{ flex: 0.5, marginLeft: 16 }}
            title={'Giới tính'}
            details={user.genderString()}
            titleStyle={user.genderString() === '---' && emptyTitleStyle}
          />
        </View>

        {/* <InfoRow
          title={'Điện thoại'}
          details={_.isEmpty(user.phoneNumber) ? emptyString : user.phoneNumber}
        /> */}

        <InfoRow
          title={'Email'}
          details={_.isEmpty(user.email) ? emptyString : user.email}
          titleStyle={_.isEmpty(user.email) && emptyTitleStyle}
        />

        <InfoRow
          title={'Địa chỉ thường trú'}
          details={_.isEmpty(user.address) ? emptyString : user.address}
          titleStyle={_.isEmpty(user.address) && emptyTitleStyle}
        />
      </View>
    );
  }
}

// --------------------------------------------------

UserPersonalInfoContainer.propTypes = {
  user: PropTypes.instanceOf(User),
};

UserPersonalInfoContainer.defaultProps = {};

export default UserPersonalInfoContainer;
