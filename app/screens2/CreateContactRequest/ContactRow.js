import CharAvatar from 'app/components/CharAvatar';
import KJTouchableHighlight from 'app/components/common/KJTouchableHighlight';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../../componentV3/AppText';
import colors from '../../theme/Color';


const _ = require('lodash');

const ROW_PADDING_LEFT = 20;
const ROW_PADDING_RIGHT = 20;
const AVATAR_SIZE = 46;
const AVATAR_CONTENT_SPACING = 10;

class ContactRow extends PureComponent {
  renderAvatar() {
    const { user } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <CharAvatar
          avatarStyle={styles.avatarImage}
          source={{ uri: user.avatar || '' }}
          defaultName={user.nickname}
        />
      </View>
    );
  }
  renderContent() {
    const { user } = this.props;
    return <AppText style={styles.titleText}>{`${user.nickname}`}</AppText>;
  }
  renderButton() {
    const { user } = this.props;
    if (user?.isExisted) {
      return (
        <View>
          <AppText>Đã kết bạn</AppText>
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={this.onStaticPressRequest}>
        <View style={styles.btn}>
          <AppText style={styles.titleBtn}>{user?.isWaiting ? 'Gửi lại' : 'Kết bạn'}</AppText>
        </View>
      </TouchableOpacity>
    );
  }

  onStaticPressRequest = () => {
    const { onPressRequest, user } = this.props;
    if (onPressRequest) {
      onPressRequest(user);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <KJTouchableHighlight
            touchableHighlightProps={{
              underlayColor: '#2228',
            }}
          >
            <View style={styles.rowContainer}>
              {this.renderAvatar()}
              {this.renderContent()}
              {this.renderButton()}
            </View>
          </KJTouchableHighlight>
        </View>
      </View>
    );
  }
}

export default ContactRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    alignItems: 'stretch',
    alignContent: 'stretch',
    backgroundColor: colors.neutral5,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_RIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral5,
  },
  avatarContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#fff0',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: '#fff',
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#fff',
    backgroundColor: '#ff0',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E1',
    marginLeft: AVATAR_SIZE + AVATAR_CONTENT_SPACING + ROW_PADDING_LEFT,
    marginRight: 0,
  },
  callWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: ROW_PADDING_LEFT,
    paddingRight: ROW_PADDING_LEFT,
    height: AVATAR_SIZE + 2 * 12,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.gradient5b,
    borderRadius: 16,
  },
  titleBtn: {
    fontSize: 13,
    color: '#fff',
  },
});
