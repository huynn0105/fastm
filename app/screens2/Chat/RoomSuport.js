import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';

import Colors from '../../theme/Color';
import ThreadRow from './ThreadRowRoom';
import DatabaseManager from '../../manager/DatabaseManager';
import AppText from '../../componentV3/AppText';

const RoomSuport = ({ onPressSupportTicket, data, onPress, onLongPress }) => {
  const renderHeader = useCallback(() => {
    return <AppText style={styles.txtHeaderList}>Phòng hỗ trợ theo dự án</AppText>;
  }, []);

  const renderItem = useCallback(({ item }) => {
    const lastMessage = DatabaseManager.shared().getLastMessageInThread(item.uid);
    const totalUnReadMessages = DatabaseManager.shared().countUnReadMessagesInThread(item.uid);

    return (
      <ThreadRow
        thread={item}
        lastMessage={lastMessage}
        totalUnReadMessages={totalUnReadMessages}
        isSeparatorHidden={false}
        onPress={onPress}
        onLongPress={onLongPress}
        lastUpdated={item.updateTimeAgoString()}
      />
    );
  }, []);

  const itemSeparatorThreadsItem = () => (
    <View
      style={{
        // marginVertical: 8,
        marginLeft: 86,
        marginRight: 16,
      }}
    >
      <View
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          height: 0.5,
        }}
      />
    </View>
  );

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../img/img_building.png')} />
        <AppText style={styles.txtIndicator}>
          Phòng hỗ trợ riêng cho từng dự án sẽ sớm được ra mắt!
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPressSupportTicket}>
        <View style={styles.header}>
          <Image source={require('./img/ic_support.png')} />
          <AppText style={styles.txtHeader}>Gửi yêu cầu hỗ trợ riêng</AppText>
          <Image source={require('./img/ic_next.png')} />
        </View>
      </TouchableOpacity>
      <FlatList
        data={data || []}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={itemSeparatorThreadsItem}
        keyExtractor={(item) => item?.uid}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
};

export default RoomSuport;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.actionBackground,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(224, 255, 221)',
  },
  txtHeader: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  txtHeaderList: {
    opacity: 0.6,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtIndicator: {
    paddingTop: 16,
    paddingHorizontal: 20,
    opacity: 0.8,
    color: Colors.primary4,
  },
});
