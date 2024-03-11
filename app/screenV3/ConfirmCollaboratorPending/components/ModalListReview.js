import {
  Alert,
  DeviceEventEmitter,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useRef } from 'react';
import Colors from '../../../theme/Color';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import SectionHeader from '../../AccountSetting/components/SectionHeader';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { debounce } from 'lodash';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import ListCollaboratorReview from '../../Collaborator/common/ListCollaboratorReview';
import { getDefaultAvatar } from '../../../utils/userHelper';

const ModalListReview = memo((props) => {
  const { data, onCloseModal, initCategory, user } = props;

  const dataLoadMore = useRef({
    height: 0,
    isLoadMore: false,
  });
  const refLoadMore = useRef();
  const scrollViewRef = useRef();

  const openChat = useCallback(
    debounce(
      () => {
        onCloseModal?.();
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${user?.userID}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [user?.userID],
  );

  const openCall = useCallback(
    debounce(
      () => {
        Linking.openURL(`tel:${user?.mobilePhone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [user?.mobilePhone],
  );

  const handleLoadMoreList = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const paddingToBottom = 150;
    const isLoadMore =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    if (isLoadMore !== dataLoadMore?.current?.isLoadMore && isLoadMore) {
      dataLoadMore.current.isLoadMore = isLoadMore;
      refLoadMore?.current?.();
    }
  }, []);

  const onContentSizeChange = useCallback((w, h) => {
    if (dataLoadMore.current.height === h) return;
    // if (Platform.OS === 'android') {

    if (h < 0.8 * SCREEN_HEIGHT) {
      refLoadMore?.current?.();
    }
    // }
    dataLoadMore.current.height = h;
    dataLoadMore.current.isLoadMore = false;
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
        onScroll={handleLoadMoreList}
        style={styles.listContainer}
      >
        <View style={styles.row}>
          <CharAvatar
            style={styles.avatar}
            source={hardFixUrlAvatar(data?.infoUserSp?.detail?.avatarImage)}
            textStyle={{ fontSize: 22 }}
            defaultImage={getDefaultAvatar('male')}
          />
          <View style={[styles.infoContainer, { justifyContent: 'center' }]}>
            <View style={[styles.row, { alignItems: 'center' }]}>
              <View style={{ flex: 1 }}>
                <AppText semiBold style={styles.name}>
                  {user?.fullName}
                </AppText>

                <AppText semiBold style={styles.rank}>
                  {user?.level}
                </AppText>
              </View>
              <View style={styles.row}>
                <TouchableWithoutFeedback onPress={openCall}>
                  <Image source={ICON_PATH.calling2} style={styles.icon} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={openChat}>
                  <Image
                    source={ICON_PATH.message2}
                    style={[
                      styles.icon,
                      {
                        marginLeft: 20,
                      },
                    ]}
                  />
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
        <ListCollaboratorReview
          tab={data?.tab}
          skill={data?.skill}
          userId={user?.userID}
          scrollEnabled
          style={{ marginTop: 8 }}
          initCategory={initCategory}
          headerView={<View style={{ marginTop: 8 }} />}
          callbackFuncLoadMore={(onLoadMore) => (refLoadMore.current = onLoadMore)}
          onCloseModal={onCloseModal}
        />
      </ScrollView>
    </View>
  );
});

export default ModalListReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    padding: 16,
    height: 0.75 * SCREEN_HEIGHT,
  },
  listContainer: {},
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
  },
  row: {
    flexDirection: 'row',
  },
  box: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.gray1,
  },
  rank: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.blue3,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary2,
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
});
