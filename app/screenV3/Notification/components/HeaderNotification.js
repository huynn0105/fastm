import { DeviceEventEmitter, Image, Platform, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../theme/Color';
import { SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { Pressable } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { readAllNotification } from '../../../redux/actions/actionsV3/notificationAction';
import { useDispatch } from 'react-redux';

const HeaderNotification = memo((props) => {
  const { navigation, category } = props;

  const insets = useSafeAreaInsets();
  const actionSheetRef = useRef();
  const dispatch = useDispatch();

  const onGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const onGoNotificationSetting = useCallback(() => {
    navigation.navigate('NotificationSetting');
  }, [navigation]);

  const onOpenActionSheet = useCallback(() => {
    actionSheetRef?.current?.show();
  }, []);

  const onActionSheetPress = useCallback(
    (index) => {
      if (index === 1) {
        DeviceEventEmitter.emit('unread_notification', false);
      } else if (index === 2) {
        DeviceEventEmitter.emit('unread_notification', true);
      } else if (index === 3) {
        dispatch(readAllNotification(category));
      }
    },
    [category, dispatch],
  );

  const renderActionSheet = () => {
    const options = ['Đóng'];
    options.push('Xem tất cả tin');
    options.push('Xem tin chưa đọc');
    options.push('Đánh dấu đã đọc tất cả');
    return (
      <ActionSheet
        ref={actionSheetRef}
        options={options}
        cancelButtonIndex={0}
        onPress={onActionSheetPress}
      />
    );
  };

  return (
    <View style={[styles.container, Platform.OS === 'ios' && { paddingTop: insets?.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.row}>
          <Pressable onPress={onGoBack}>
            <Image source={ICON_PATH.back} style={styles.headerBackIcon} />
          </Pressable>
          <AppText semiBold style={styles.headerTitle}>
            Trung tâm tin tức
          </AppText>
        </View>
        <View style={styles.row}>
          <Pressable style={{ marginRight: SW(20) }} onPress={onOpenActionSheet}>
            <Image source={ICON_PATH.more} style={styles.headerIcon} />
          </Pressable>
          <Pressable onPress={onGoNotificationSetting}>
            <Image source={ICON_PATH.setting} style={styles.headerIcon} />
          </Pressable>
        </View>
      </View>
      {renderActionSheet()}
    </View>
  );
});

export default HeaderNotification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SW(16),
    height: 48,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    marginHorizontal: 16,
  },
  headerBackIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
