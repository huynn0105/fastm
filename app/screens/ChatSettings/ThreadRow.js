import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import CharAvatar from 'app/components/CharAvatar';
import Styles from '../../constants/styles';
import KJButton from '../../components/common/KJButton';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
import colors from '../../constants/colors';
const LOG_TAG = '7777: ThreadRow.js';
/* eslint-enable */

const PHOTO_SIZE = 60;

const _ = require('lodash');

// --------------------------------------------------
// ThreadRow
// --------------------------------------------------

class ThreadRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }
  onTitlePress = () => {
    this.props.onTitlePress(this.props.thread);
  }
  onPhotoPress = () => {
    this.props.onPhotoPress(this.props.thread);
  }
  // --------------------------------------------------
  renderPhoto() {
    const { thread } = this.props;
    return (
      <View>
        <CharAvatar
          avatarStyle={styles.photoImage}
          source={thread.photoImageURI()}
          defaultSource={thread.photoImagePlaceholder()}
          defaultName={thread.titleString()}
          textStyle={styles.charAvatarStyle}
        />
        <TouchableOpacity
          style={Styles.button_overlay}
          onPress={this.onPhotoPress}
        />
      </View>
    );
  }
  renderContent() {
    const { thread } = this.props;
    return (
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <AppText
            style={styles.titleText}
            numberOfLines={3}
          >
            {`${thread.titleString()}`}
          </AppText>
          {
            thread.isSingleThread() ? null :
              <KJButton
                containerStyle={styles.editButton}
                leftIconSource={require('./img/edit.png')}
                leftIconStyle={{ width: 24, height: 24 }}
                onPress={this.onTitlePress}
              />
          }
        </View>
        {
          thread.isSingleThread() ? null :
            <AppText style={styles.statusText}>
              {`${thread.statusString()}`}
            </AppText>
        }
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {this.renderPhoto()}
          {this.renderContent()}
        </View>
      </View>
    );
  }
}

ThreadRow.defaultProps = {
  onTitlePress: () => { },
  onPhotoPress: () => { },
};

export default ThreadRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.navigation_bg,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f000',
  },
  photoImage: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2.0,
    borderWidth: 1.0,
    borderColor: colors.navigation_bg,
    backgroundColor: colors.navigation_bg,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f000',
  },
  titleText: {
    flex: 0,
    marginRight: 28,
    fontSize: 17,
    fontWeight: '400',
    color: '#24253d',
    backgroundColor: '#f000',
  },
  editButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    right: -10,
    top: -12,
    backgroundColor: '#f000',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#7f7f7f',
    marginTop: 6,
  },
  charAvatarStyle: {
    fontSize: 20,
    fontWeight: '500',
  },
});
