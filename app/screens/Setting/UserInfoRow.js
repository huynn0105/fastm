import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import KJTouchableOpacity from '../../common/KJTouchableOpacity';
import UserAvatar from '../Home/UserAvatar';
import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------

class UserInfoRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress();
  }
  onAccessoryPress = () => {
    this.props.onPress();
  }

  renderAvatar = (userInfo) => {
    return (
      <View
        style={{
          marginTop: 58,
          paddingRight: 15,
        }}
      >
        <UserAvatar
          user={userInfo}
          avatarStyle={{
            borderColor: colors.app_theme,
          }}
          onAvatarPress={this.onPress}
        />
      </View>
    );
  }

  renderRowInfo = (icon, title) => {
    return (
      <View style={{
        flexDirection: 'row',
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2,
      }}
      >
        <Image
          style={{
            width: 12,
            height: 12,
            marginRight: 6,
          }}
          source={icon}
          resizeMode="contain"
        />
        <Text style={{
          fontSize: 12,
          opacity: 0.8,
        }}
        >
          {title}
        </Text >

      </View >
    );
  }

  renderInfoUser = (userInfo) => {
    return (
      <View style={{
        flex: 1,
        paddingTop: 2,
        paddingBottom: 0,
      }}
      >
        <Text style={{
          fontSize: 17,
          paddingBottom: 4,
        }}
        >
          {userInfo.fullName}
        </Text >
        {this.renderRowInfo(
          require('./img/phoneNumber.png'),
          userInfo.phoneNumber,
        )
        }
        {this.renderRowInfo(
          require('./img/history.png'),
          `Tham gia: ${userInfo.createTimeAgoString()}`,
        )}
      </View >
    );
  }
  // --------------------------------------------------
  render() {
    const {
      userInfo,
    } = this.props;

    return (
      <View style={[styles.row]}>
        <KJTouchableOpacity
          testID="test_UserInfoRow"
          onPress={this.onPress}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            {this.renderAvatar(userInfo)}
            {this.renderInfoUser(userInfo)}

            <Accessory onPress={this.onAccessoryPress} />
          </View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

const Accessory = (props) => (
  <KJTouchableOpacity
    style={{
      justifyContent: 'center',
    }}
    onPress={props.onPress}
  >
    <Image
      style={{
        width: 8,
      }}
      source={require('./img/combinedShape.png')}
      resizeMode="contain"
    />
  </KJTouchableOpacity>
);

// --------------------------------------------------

UserInfoRow.propTypes = {
  onPress: PropTypes.func,
};

UserInfoRow.defaultProps = {
  onPress: () => { },
};


const mapStateToProps = (state) => ({
  userInfo: state.myUser,
});

export default connect(mapStateToProps)(UserInfoRow);

// --------------------------------------------------
const styles = StyleSheet.create({
  row: {
    flex: 0,
    paddingLeft: 20,
    paddingRight: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.navigation_bg,
  },
});
