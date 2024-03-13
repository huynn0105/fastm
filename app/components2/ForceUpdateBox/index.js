import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import PropTypes from 'prop-types';
import AppText from '../../componentV3/AppText';

import { IMAGE_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import { SH } from '../../constants/styles';

const _ = require('lodash');

// --------------------------------------------------

class ForceUpdateBox extends PureComponent {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  // }

  onLeftButtonPress = () => {
    this.props.onLeftButtonPress();
  };
  onRightButtonPress = () => {
    this.props.onRightButtonPress();
  };

  renderTitle = () => {
    const { isForceToUpdate, version, title, time, titleStyle } = this.props;
    if (isForceToUpdate) {
      return (
        <AppText style={styles.txtForceTitle}>
          MFast đã có phiên bản mới <AppText style={{ fontWeight: 'bold' }}>{version}</AppText> trên
          cửa hàng ứng dụng với nhiều tính năng mới và nâng cao trải nghiệm người dùng.
        </AppText>
      );
    }
    return (
      <AppText
        style={[
          styles.titleText,
          time
            ? {
                alignSelf: 'flex-start',
                textAlign: 'left',
              }
            : {
                alignSelf: 'center',
                textAlign: 'center',
              },
          titleStyle,
        ]}
      >
        {title}
      </AppText>
    );
  };

  renderMessage = () => {
    const { isForceToUpdate, time, message, messageStyle } = this.props;
    if (isForceToUpdate) {
      return <View />;
    }
    return (
      <AppText
        style={[
          styles.messageText,
          time
            ? {
                textAlign: 'left',
              }
            : {
                textAlign: 'center',
              },
          messageStyle,
        ]}
      >
        {message}
      </AppText>
    );
  };
  // --------------------------------------------------
  render() {
    const {
      style,
      titleStyle,
      time,
      leftButtonTitle,
      leftButtonTitleStyle,
      rightButtonTitle,
      rightButtonTitleStyle,
    } = this.props;

    const isLeftButtonVisible = leftButtonTitle === undefined || leftButtonTitle.length === 0;
    const isRightButtonVisible = rightButtonTitle === undefined || rightButtonTitle.length === 0;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.logoForceStyle}>
          <Image source={IMAGE_PATH.updateImage} style={{ width: 100, height: 100 }} />
        </View>
        <View
          style={[
            styles.titleContainer,
            time ? { justifyContent: 'space-between' } : { justifyContent: 'center' },
          ]}
        >
          {this.renderTitle()}
          {time && <AppText style={[styles.timeText, titleStyle]}>{time}</AppText>}
          {this.renderMessage()}
        </View>
        <View style={styles.bottomContainer}>
          {isLeftButtonVisible ? null : (
            <KJTouchableOpacity style={styles.rightButton} onPress={this.onLeftButtonPress}>
              <AppText style={[styles.leftButtonText, leftButtonTitleStyle]}>
                {leftButtonTitle}
              </AppText>
            </KJTouchableOpacity>
          )}
          {isRightButtonVisible ? null : (
            <KJTouchableOpacity style={styles.rightButton} onPress={this.onRightButtonPress}>
              <AppText style={[styles.rightButtonText, rightButtonTitleStyle]}>
                {rightButtonTitle}
              </AppText>
            </KJTouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

ForceUpdateBox.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  leftButtonTitle: PropTypes.string,
  rightButtonTitle: PropTypes.string,

  titleStyle: Text.propTypes.style,
  messageStyle: Text.propTypes.style,
  leftButtonTitleStyle: Text.propTypes.style,
  rightButtonTitleStyle: Text.propTypes.style,

  onLeftButtonPress: PropTypes.func,
  onRightButtonPress: PropTypes.func,
};

ForceUpdateBox.defaultProps = {
  leftButtonTitle: 'Đóng',
  rightButtonTitle: 'Đồng ý',
  onLeftButtonPress: () => {},
  onRightButtonPress: () => {},
};

export default ForceUpdateBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0,
    borderColor: '#0000',
    shadowOpacity: 0.5,
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  separatorLine: {
    height: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
    backgroundColor: '#F2F2F2',
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 0,
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  titleText: {
    alignSelf: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 18,
    color: Colors.gray1,
    fontSize: SH(15),
    textAlign: 'center',
  },
  timeText: {
    alignSelf: 'flex-end',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
    color: '#0008',
    fontSize: 10,
    textAlign: 'right',
  },
  messageText: {
    // marginTop: 16,
    marginHorizontal: 16,
    color: '#6B6B81',
    fontSize: SH(13),
    fontWeight: '300',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#F2F2F2',
  },
  leftButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  rightButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  leftButtonText: {
    fontSize: SH(14),
    color: Colors.gray1,
  },
  rightButtonText: {
    color: Colors.primary2,
    fontSize: SH(16),
  },
  logoForceStyle: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  txtForceTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#24253d',
    textAlign: 'center',
    marginHorizontal: 16,
  },
});
