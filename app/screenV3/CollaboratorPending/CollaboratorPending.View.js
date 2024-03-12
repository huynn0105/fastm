import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import CharAvatar from '../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../redux/actions/user';
import { ICON_PATH } from '../../assets/path';
import { getTimeBetween } from '../../utils/dateHelper';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { getListCollaboratorPending } from '../../redux/actions/actionsV3/collaboratorAction';
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import ButtonText from '../../common/ButtonText';
import DigitelClient from '../../network/DigitelClient';
import { showAlert, showInfoAlert } from '../../utils/UIUtils';
import Loading from '../../components2/LoadingComponent';
import { getDefaultAvatar } from '../../utils/userHelper';

const CollaboratorPending = memo((props) => {
  const { navigation } = props;
  const countPending = navigation?.getParam('countPending');
  const onSubtractUserPending = navigation?.getParam('onSubtractUserPending');
  const dispatch = useDispatch();

  const myUser = useSelectorShallow(getMyuserSelector);

  const [count, setCount] = useState(countPending);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [page, setPage] = useState(0);
  const [outOfData, setOutOfData] = useState(false);
  const [isShowModalLoading, setIsShowModalLoading] = useState(false);

  const onRemoveItem = useCallback((ID) => {
    setData((prev) => [...prev]?.filter((it) => it?.ID !== ID));
    setCount((prev) => prev - 1);
    onSubtractUserPending?.();
  }, []);

  const onConfirmCollaborator = useCallback(
    async (ID, action = 'confirm') => {
      try {
        setIsShowModalLoading(true);
        const res = await DigitelClient.confirmCollaboratorPending(ID, action);
        const isSuccess = res?.data?.status;

        if (isSuccess) {
          onRemoveItem?.(ID);
          showInfoAlert(action === 'confirm' ? 'Đã đồng ý mời mời' : 'Đã từ chối lời mời');
        } else {
          showAlert('Thông báo', res?.data?.message);
        }
      } catch (err) {
        showAlert('Thông báo', err?.message);
      } finally {
        setIsShowModalLoading(false);
      }
    },
    [onRemoveItem],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('ConfirmCollaboratorPending', {
              params: {
                item,
                onRemoveItem,
              },
            });
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.infoContainer}>
              {/* <Image source={ICON_PATH.clock4} style={styles.iconPending} /> */}
              <CharAvatar
                style={styles.itemAvatar}
                source={hardFixUrlAvatar(item?.avatarImage)}
                defaultImage={getDefaultAvatar('male')}
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <View style={styles.infoContainer}>
                  <AppText style={styles.itemName} medium>
                    {item?.fullName}
                  </AppText>
                  <View style={styles.dot} />
                  <AppText style={[styles.itemName, { color: Colors.blue3 }]} medium>
                    {item?.level}
                  </AppText>
                </View>
                <View style={[styles.infoContainer, { marginTop: 4 }]}>
                  <AppText style={styles.itemDate}>
                    {getTimeBetween(moment(item?.createdDate).valueOf())}
                  </AppText>
                </View>
              </View>
              <Image source={ICON_PATH.arrow_right} style={styles.iconArrow} />
            </View>
            <AppText style={[styles.itemStatus, { marginTop: 8 }]}>"{item?.note}"</AppText>
            <View style={[styles.infoContainer, { marginTop: 12 }]}>
              <ButtonText
                style={{ flex: 1, marginRight: 12 }}
                title={'Bỏ qua'}
                buttonColor={Colors.primary5}
                borderColor={Colors.gray5}
                titleColor={Colors.gray5}
                onPress={() => onConfirmCollaborator(item?.ID, 'reject')}
              />
              <ButtonText
                style={{ flex: 1 }}
                title={'Đồng ý'}
                onPress={() => onConfirmCollaborator(item?.ID, 'confirm')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [onConfirmCollaborator, onRemoveItem],
  );

  const renderFooter = useCallback(() => {
    if (isLoadMore) {
      return <ActivityIndicator style={{ marginTop: 8 }} />;
    }
    return null;
  }, [isLoadMore]);

  const onGetData = useCallback(
    (isRefreshing) => {
      if (isLoading || outOfData || isLoadMore) return;
      const setLoading = isRefreshing ? setIsLoading : setIsLoadMore;
      let newPage;
      setPage((prevPage) => {
        if (isRefreshing) {
          setOutOfData(false);
          newPage = 1;
        } else {
          newPage = prevPage + 1;
        }
        return newPage;
      });

      setLoading(true);

      dispatch(
        getListCollaboratorPending(myUser?.uid, newPage, (isSuccess, result) => {
          setLoading(false);
          if (isSuccess) {
            setData((prevState) => {
              if (isRefreshing) {
                return result;
              }
              return [...prevState, ...result];
            });
          }
          if (!result?.length) {
            setOutOfData(true);
          }
        }),
      );
    },
    [dispatch, isLoadMore, isLoading, myUser?.uid, outOfData],
  );

  const onLoadMore = useCallback(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    onGetData(true);
  }, []);

  return (
    <View style={styles.container}>
      <AppText style={styles.count}>
        Có{' '}
        <AppText style={styles.count} bold>
          {count}
        </AppText>{' '}
        cộng tác viên chờ bạn xác nhận
      </AppText>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : !data?.length ? (
        <View style={{ alignItems: 'center', marginTop: 36 }}>
          <Image source={ICON_PATH.block} style={{ width: 24, height: 24 }} />
          <AppText style={{ marginTop: 12, fontSize: 14, color: Colors.gray5 }}>
            Không tìm thấy cộng tác viên chờ duyệt nào
          </AppText>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          onEndReached={onLoadMore}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Loading visible={isShowModalLoading} />
    </View>
  );
});

export default CollaboratorPending;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    flex: 1,
    paddingHorizontal: 16,
  },
  count: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 16,
    marginBottom: 12,
  },
  itemContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatar: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
  },
  itemAvatarText: {
    fontSize: 18,
  },
  iconPending: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginRight: 14,
  },
  itemName: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray11,
    marginHorizontal: 6,
  },
  itemStatus: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray1,
  },
  itemDate: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  iconArrow: {
    tintColor: Colors.gray5,
    width: 16,
    height: 16,
  },
});
