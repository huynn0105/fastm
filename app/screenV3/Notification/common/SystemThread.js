import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';

import colors from '../../../constants/colors';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import ListNotification from '../components/ListNotification';
import { TAB_TYPE } from '../Notification.constants';

const SystemThread = memo((props) => {
  const { isUnread, thread, navigation } = props;

  return (
    <View style={styles.container}>
      <ListNotification
        category={thread.type}
        type={TAB_TYPE.ALL}
        navigation={navigation}
        isUnread={isUnread}
        isHideFlag={true}
      />
    </View>
  );
});

export default SystemThread;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatBackgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  statusSentView: {
    alignItems: 'flex-end',
  },
  statusSentBG: {
    alignItems: 'flex-end',
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 2,
    top: -4,
  },
  statusReadBG: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 8,
    marginBottom: 4,
    height: 22,
    borderRadius: 9,
    backgroundColor: '#0000',
    top: -4,
  },
  statusSent: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
  avatarImageRead: {
    marginLeft: 1,
    width: 20,
    height: 20,
    borderRadius: 20 / 2.0,
    // borderWidth: 1.0,
    borderColor: '#fff4',
    backgroundColor: '#fff',
  },
  textReadStyle: {
    fontSize: 11,
    marginLeft: 1,
    fontWeight: '100',
  },
  plusMemberBG: {
    justifyContent: 'center',
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0003',
    paddingTop: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  plusMemberTitle: {
    color: '#fff',
    fontSize: 10,
    paddingLeft: 4,
    paddingRight: 4,
    marginBottom: 3,
  },
  messBottom: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.app_theme_darker,
  },
  emptyDataContainer: {
    marginTop: SCREEN_HEIGHT / 4,
    // height: SCREEN_HEIGHT * 0.8,
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNewMessageAlert: {
    position: 'absolute',
    height: 38,
    left: 0,
    right: 0,
    bottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchNewMessageAlert: {
    flex: 0,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 38 / 2.0,
    borderWidth: 1.0,
    borderColor: `${colors.app_theme_darker}aa`,
  },
  textNewMessageAlert: {
    marginRight: 16,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '200',
    color: colors.app_theme_darker,
  },
});
