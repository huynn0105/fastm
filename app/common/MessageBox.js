import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import PropTypes from 'prop-types';
import AppText from '../componentV3/AppText';

const _ = require('lodash');

// --------------------------------------------------

class MessageBox extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onLeftButtonPress = () => {
    this.props.onLeftButtonPress();
  }
  onRightButtonPress = () => {
    this.props.onRightButtonPress();
  }
  // --------------------------------------------------
  render() {
    const {
      style,
      title, titleStyle,
      message, messageStyle,
      time,
      leftButtonTitle, leftButtonTitleStyle,
      rightButtonTitle, rightButtonTitleStyle,
    } = this.props;

    const isLeftButtonVisible = leftButtonTitle === undefined ||
      leftButtonTitle.length === 0;
    const isRightButtonVisible = rightButtonTitle === undefined ||
      rightButtonTitle.length === 0;

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.titleContainer,
        time ?
          { justifyContent: 'space-between' } :
          { justifyContent: 'center' },
        ]}
        >
          <AppText style={[styles.titleText,
          time ?
            {
              alignSelf: 'flex-start',
              textAlign: 'left',
            } :
            {
              alignSelf: 'center',
              textAlign: 'center',
            },
            titleStyle,
          ]}
          >
            {title}
          </AppText>
          {
            time &&
            <AppText style={[styles.timeText, titleStyle]}>
              {time}
            </AppText>
          }
        </View>
        {/* <View style={styles.separatorLine} /> */}
        <AppText style={[styles.messageText,
        time ?
          {
            textAlign: 'left',
          } :
          {
            textAlign: 'center',
          },
          messageStyle]}
        >
          {message}
        </AppText>
        <View style={styles.bottomContainer}>
          {
            isLeftButtonVisible ? null :
              <KJTouchableOpacity
                style={styles.rightButton}
                onPress={this.onLeftButtonPress}
              >
                <AppText style={[styles.leftButtonText, leftButtonTitleStyle]}>
                  {leftButtonTitle}
                </AppText>
              </KJTouchableOpacity>
          }
          {
            isRightButtonVisible ? null :
              <KJTouchableOpacity
                style={styles.rightButton}
                onPress={this.onRightButtonPress}
              >
                <AppText style={[styles.rightButtonText, rightButtonTitleStyle]}>
                  {rightButtonTitle}
                </AppText>
              </KJTouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

// --------------------------------------------------

MessageBox.propTypes = {

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

MessageBox.defaultProps = {
  leftButtonTitle: 'Đóng',
  rightButtonTitle: 'Đồng ý',
  onLeftButtonPress: () => { },
  onRightButtonPress: () => { },
};

export default MessageBox;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: '#fff',
    borderRadius: 4,
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
    color: '#060606',
    fontSize: 14,
    fontWeight: '600',
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
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    color: '#0008',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
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
    color: '#50A9E4',
    fontWeight: '300',
  },
  rightButtonText: {
    color: '#50A9E4',
    fontWeight: '600',
  },
});
