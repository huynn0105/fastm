import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import DigitelClient from '../../../network/DigitelClient';
import { debounce } from 'lodash';
import { Linking } from 'react-native';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import Indicator from '../../../componentV3/Indicator/Indicator';
import ListEmpty from '../../../componentV3/ListComponents/ListEmpty';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ItemList from './ItemList';
import ItemListNotWorking from './ItemListNotWorking';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import ModalMTradeMessage from '../../MTrade/common/ModalMTradeMessage';
import AnimatedLottieView from 'lottie-react-native';

const ListCollaboratorLeave = memo((props) => {
  const { type, renderFilter, filters, navigation } = props;

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [outOfData, setOutOfData] = useState(false);

  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [userIDsDelete, setUserIDsDelete] = useState([]);

  const page = useRef(0);
  const mtradeMessageRef = useRef();

  const onDeleteCollaborator = useCallback(() => {
    const payload = {};
    if (isDeleteAll) {
      payload.all = isDeleteAll;
    } else {
      payload.collaborators = userIDsDelete;
    }
    setIsLoadingDelete(true);
    DigitelClient.deleteCollaborator(payload)
      .then((res) => {
        if (res.data?.status) {
          setIsDeleteAll(false);
          setUserIDsDelete([]);
          onRefresh();
          if (res.data.type === 'waiting') {
            mtradeMessageRef.current.open({
              image: IMAGE_PATH.mascotWait2,
              titleColor: Colors.blue3,
              title: 'Đang xóa cộng tác viên',
              content: res.data?.message || 'Đang xóa cộng tác viên',
              actions: [
                {
                  title: 'Đã hiểu và quay lại',
                  onPress: () => {
                    mtradeMessageRef.current.close();
                  },
                },
              ],
            });
          } else {
            mtradeMessageRef.current.open({
              image: IMAGE_PATH.mascotSuccess,
              titleColor: Colors.green5,
              title: 'Thành công!!!',
              content: res.data?.message || 'Xoá cộng tác viên thành công',
              actions: [
                {
                  title: 'Quay lại',
                  onPress: () => {
                    mtradeMessageRef.current.close();
                  },
                  type: 'cancel',
                },
              ],
            });
          }
        } else {
          mtradeMessageRef.current.open({
            image: IMAGE_PATH.mascotError,
            titleColor: Colors.sixRed,
            title: 'Thất bại!!!',
            content: `Xoá CTV không thành công "${res.data?.message}"`,
            actions: [
              {
                title: 'Quay lại',
                onPress: () => {
                  mtradeMessageRef.current.close();
                },
                type: 'cancel',
              },
            ],
          });
        }
      })
      .catch((error) => {
        mtradeMessageRef.current.open({
          image: IMAGE_PATH.mascotError,
          titleColor: Colors.sixRed,
          title: 'Thất bại!!!',
          content: `Xoá CTV không thành công "${error?.message}"`,
          actions: [
            {
              title: 'Quay lại',
              onPress: () => {
                mtradeMessageRef.current.close();
              },
              type: 'cancel',
            },
          ],
        });
      })
      .finally(() => {
        setIsLoadingDelete(false);
      });
  }, [isDeleteAll, onRefresh, userIDsDelete]);

  const onConfirmDelete = useCallback(() => {
    let title = '';

    if (isDeleteAll) {
      title = `Xác nhận xóa tất cả cộng tác viên`;
    } else if (userIDsDelete.length === 1) {
      title = `Xác nhận xóa CTV ${
        data?.find((item) => item?.userID === userIDsDelete[0])?.fullName
      }`;
    } else {
      title = `Xác nhận xóa ${userIDsDelete.length} cộng tác viên`;
    }

    mtradeMessageRef.current.open({
      image: IMAGE_PATH.mascotWait,
      titleColor: Colors.sixOrange,
      title: title,
      content:
        'Thông tin, quyền lợi từ cộng tác viên đã xóa sẽ không thể khôi phục. Vui lòng kiểm tra kĩ trước khi tiếp tục.',
      actions: [
        {
          title: 'Xóa CTV',
          onPress: () => {
            mtradeMessageRef.current.close();
            onDeleteCollaborator();
          },
          type: 'cancel',
        },
        {
          title: 'Kiểm tra lại',
          onPress: () => {
            mtradeMessageRef.current.close();
          },
        },
      ],
    });
  }, [data, isDeleteAll, onDeleteCollaborator, userIDsDelete]);

  const renderInfoRemove = useCallback(() => {
    const isDisabled = !userIDsDelete.length && !isDeleteAll;
    return (
      <View style={{ marginTop: 4, marginBottom: 10 }}>
        <AppText style={[styles.headerText, { color: Colors.gray5 }]}>
          (Lưu ý: chỉ những{' '}
          <AppText semiBold style={[styles.headerText, { color: Colors.sixRed }]}>
            CTV tầng 1
          </AppText>{' '}
          và không truy cập MFast từ{' '}
          <AppText semiBold style={[styles.headerText, { color: Colors.sixRed }]}>
            60 ngày liên tiếp
          </AppText>{' '}
          trở lên mới có thể xóa)
        </AppText>
        <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckBoxSquare
              style={{ marginTop: 0 }}
              checkboxStyle={{ marginRight: 8 }}
              label={'Chọn tất cả'}
              isTextSmall
              isSelected={isDeleteAll}
              onChangeValue={(v) => {
                setUserIDsDelete([]);
                setIsDeleteAll(v);
              }}
            />
          </View>
          <TouchableOpacity
            disabled={isDisabled}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onConfirmDelete}
          >
            <AppText
              semiBold
              style={{
                color: isDisabled ? Colors.neutral3 : Colors.sixRed,
                marginRight: 8,
                fontSize: 14,
                lineHeight: 20,
                marginTop: 1,
              }}
            >
              Xóa CTV
            </AppText>
            {isDisabled ? (
              <Image
                source={ICON_PATH.trash3}
                style={{ width: 24, height: 24, tintColor: Colors.neutral3 }}
              />
            ) : (
              <Image source={ICON_PATH.trash3} style={{ width: 24, height: 24 }} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [isDeleteAll, onConfirmDelete, userIDsDelete.length]);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <AppText style={styles.headerText}>
          Danh sách
          <AppText bold style={styles.headerText}>
            {` ${total || 0} `}
          </AppText>
          {type === 'can_remove'
            ? 'cộng tác viên có thể xoá'
            : type === 'working'
            ? 'cộng tác viên có hoạt động'
            : 'cộng tác viên có thể rời đi'}
        </AppText>
        {type === 'working' || type === 'can_remove' ? null : renderFilter?.()}
        {type === 'can_remove' ? renderInfoRemove?.() : null}
      </View>
    );
  }, [renderFilter, renderInfoRemove, total, type]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <Indicator style={{ marginTop: 8 }} />;
    } else if (outOfData && data?.length) {
      return (
        <View style={styles.footerContainer}>
          <AppText style={[styles.footerText, { marginLeft: 0 }]}>Đã tải hết CTV</AppText>
        </View>
      );
    }
    return null;
  }, [data?.length, isLoadingMore, outOfData]);

  const openChat = useCallback(
    debounce(
      (item) => {
        Linking.openURL(`${DEEP_LINK_BASE_URL}://chat/single?userID=${item?.userID}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  const openCall = useCallback(
    debounce(
      (item) => {
        Linking.openURL(`tel:${item?.phone}`);
      },
      1000,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  const onOpenCollaborator = useCallback(
    (item) => {
      navigation?.push('Collaborator', { userId: item?.userID });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return <ItemList {...{ item, index, openChat, openCall, onOpenCollaborator, type }} />;
    },
    [onOpenCollaborator, openCall, openChat, type],
  );

  const onSelect = useCallback((isSelected, userID) => {
    setUserIDsDelete((prevState) => {
      let newState: String[] = [...prevState];
      const isExist = newState.findIndex((item) => item === userID) !== -1;

      if (isSelected) {
        if (isExist) {
          return prevState;
        }

        newState.push(userID);
      } else {
        if (!isExist) {
          return prevState;
        }
        newState = newState.filter((item) => item !== userID);
      }
      setIsDeleteAll(false);
      return newState;
    });
  }, []);

  const renderItemNotWorking = useCallback(
    ({ item, index }) => {
      return (
        <ItemListNotWorking
          {...{ item, index, openChat, openCall, onOpenCollaborator, type, isDeleteAll, onSelect }}
        />
      );
    },
    [isDeleteAll, onOpenCollaborator, onSelect, openCall, openChat, type],
  );

  const onGetData = useCallback(
    (isRefresh) => {
      let setStateLoading = isRefresh ? setIsLoading : setIsLoadingMore;
      setStateLoading((prevState) => {
        if (prevState) return prevState;
        if (isRefresh) {
          page.current = 1;
          setOutOfData(false);
        } else {
          page.current = page.current + 1;
        }
        DigitelClient.getListCollaboratorLeave({
          type,
          ...filters,
          page: page.current,
        })
          .then((res) => {
            const list = res?.data?.data?.data || [];
            setData((prevListState) => (isRefresh ? list : [...prevListState, ...list]));
            setTotal(() => res?.data?.data?.total);

            if (!list?.length) {
              setOutOfData(true);
            }
          })
          .finally(() => {
            setStateLoading(false);
          });

        return true;
      });
    },
    [filters, type],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return <Indicator style={{ marginTop: 24 }} />;
    }
    return <ListEmpty title={'Không tìm thấy cộng tác viên nào'} style={{ marginTop: 24 }} />;
  }, [isLoading]);

  const onEndReached = useCallback(() => {
    if (outOfData) return;
    onGetData();
  }, [onGetData, outOfData]);

  const onRefresh = useCallback(() => {
    setIsDeleteAll(false);
    onGetData(true);
  }, [onGetData]);

  useEffect(() => {
    onGetData(true);
  }, [onGetData]);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={isLoading ? [] : data}
        renderItem={type === 'can_remove' ? renderItemNotWorking : renderItem}
        ListHeaderComponent={renderHeader}
        initialNumToRender={10}
        windowSize={10}
        refreshing={isLoading}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmpty}
        style={styles.listContainer}
        onEndReached={onEndReached}
        ListFooterComponent={renderFooter}
      />
      <ModalMTradeMessage ref={mtradeMessageRef} />
      {isLoadingDelete ? (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 220,
              height: 120,
              backgroundColor: '#0a0a0a66',
              borderRadius: 16,
            }}
          >
            <AnimatedLottieView
              style={{ width: 64, height: 64 }}
              source={ICON_PATH.loadingLottie}
              autoPlay
              loop
            />
          </View>
        </View>
      ) : null}
    </View>
  );
});

export default ListCollaboratorLeave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary5,
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  headerText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  listContainer: {
    paddingBottom: 70,
    height: 500,
    flex: 1,
  },
  footerContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray5,
    marginLeft: 8,
    lineHeight: 20,
  },
});
