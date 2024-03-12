import React, { PureComponent } from 'react';
import { Text, Image, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import DatabaseManager from '../manager/DatabaseManager';
import AppText from '../componentV3/AppText';

const _ = require('lodash');

class ChatNotificationIcon extends PureComponent {
  render() {
    const { allThreads, focused } = this.props;
    const icon = focused ? require('./img/ic_chat1.png') : require('./img/ic_chat.png');
    let totalUnReadMessages = 0;
    if (allThreads?.length > 0) {
      allThreads.forEach((thread) => {
        if (thread?.isNotificationOn) {
          const unReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(thread?.uid);
          totalUnReadMessages += unReadMessages;
        }
      });
    }

    // below is an example notification icon absolutely positioned
    return (
      <View
        style={{
          zIndex: 0,
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <View
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 2,
            paddingBottom: 2,
            overflow: 'hidden',
          }}
        >
          <Image source={icon} style={styles.icon} resizeMode={'contain'} />
          {totalUnReadMessages > 0 ? (
            <AppText style={styles.badge}>{totalUnReadMessages}</AppText>
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  allThreads: state?.allThreads || [],
});

export default connect(mapStateToProps, null)(ChatNotificationIcon);

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    paddingLeft: Platform.OS === 'ios' ? 5 : 4,
    paddingRight: Platform.OS === 'ios' ? 4.5 : 4,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
    top: Platform.OS === 'ios' ? 0 : 2,
    right: Platform.OS === 'ios' ? 0 : 0,
    zIndex: 2,
  },
});
