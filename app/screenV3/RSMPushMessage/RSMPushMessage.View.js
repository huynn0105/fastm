import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TabBar, TabBarItem, TabView } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../../componentV3/AppText';
import Loading from '../../componentV3/LoadingModal';
import { fonts } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';
import { useActions } from '../../hooks/useActions';
import DigitelClient from '../../network/DigitelClient';
import {
  getListCTV,
  getListSendMassMessage,
  sendMassMessage,
  setListCTVs,
} from '../../redux/actions/actionsV3/userConfigs';
import {
  acceptRequestContact,
  fetchInvitationsRequests,
} from '../../redux/actions/conversationContact';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import createStoreFunc from '../../redux/store/store';
import ChatManager from '../../submodules/firebase/manager/ChatManager';
import { Message } from '../../submodules/firebase/model';
import { NOTIFICATION_TYPES } from '../../submodules/firebase/model/Notification';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import FirebaseFunctions from '../../submodules/firebase/network/FirebaseFunctions';
import { reloadAllThreadsFromDB } from '../../submodules/firebase/redux/actions';
import Colors from '../../theme/Color';
import { showQuestionAlert } from '../../utils/UIUtils';
import StatusPopup from './common/StatusPopup';
import HistoryNotiTab from './components/HistoryNotiTab';
import SendNotiTab from './components/SendNotiTab';
import { STATUS_RSM } from './RSMPushMessage.constant';

const TABS = {
  SEND_NOTI: 0,
  HISTORY_NOTI: 1,
};

const MENU = [
  { title: 'Gửi thông báo', tag: TABS.SEND_NOTI },
  { title: 'Lịch sử gửi', tag: TABS.HISTORY_NOTI },
];

export const TYPE_MODAL = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  WARNING2: 'WARNING2',
  LIMIT_SEND: 'LIMIT_SEND',
};

let listUserIdResend = null;
let payloadResend = null;
let onSuccessResend = null;

const RSMPushMessage = ({ navigation, props }) => {
  const myUser = useSelector(getMyuserSelector);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: TABS.SEND_NOTI, item: MENU[0] },
    { key: TABS.HISTORY_NOTI, item: MENU[1] },
  ]);

  const [page, setPage] = useState(0);

  const [typeModal, setTypeModal] = useState(TYPE_MODAL.LOADING);

  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef(null);

  const listCTVs = useSelector((state) => state.userConfigs.listCTVs);

  const listNotis = useSelector((state) => state.userConfigs.listNotis);

  const disabledPushRSM = useMemo(() => {
    const latestPushRSM = listNotis[listNotis?.length - 1];
    const dayLatestPushRSM = moment(latestPushRSM?.processFininshed, 'YYYY-MM-DD HH:mm:ss').format(
      'DD-MM-YYYY',
    );
    const now = moment().format('DD-MM-YYYY');

    return dayLatestPushRSM === now;
  }, [listNotis]);

  const [listBelowCTV, setListBelowCTV] = useState(listCTVs);

  const [listIdUnselected, setListIdUnselected] = useState([]);

  const [totalLength, setTotalLength] = useState(0);

  const actions = useActions({
    getListCTV,
    setListCTVs,
    sendMassMessage,
    getListSendMassMessage,
  });

  useEffect(() => {
    actions.getListSendMassMessage();
  }, [actions]);

  useEffect(() => {
    setListBelowCTV(listCTVs);
  }, [listCTVs]);

  const onUnselectItem = useCallback((id) => {
    setListIdUnselected((prevState) => [...prevState, id]);
  }, []);

  const onSelectItem = useCallback((id) => {
    setListIdUnselected((prevState) => prevState.filter((item) => item !== id));
  }, []);

  const cacheDataResend = useCallback((listUserId, payload, filterCondition, onSuccess) => {
    if (listUserId.length > 0) {
      listUserIdResend = listUserId;
    }
    if (payload) {
      payloadResend = payload;
    }
    if (onSuccess) {
      onSuccessResend = onSuccess;
    }
  }, []);

  const sendMessage = useCallback(
    async (_, payload, filterCondition, onSuccess) => {
      if (disabledPushRSM) {
        setTypeModal(TYPE_MODAL.LIMIT_SEND);
        modalRef?.current?.openModal();
        return;
      }

      setTypeModal(TYPE_MODAL.LOADING);
      modalRef?.current?.openModal();
      let listUser = [];
      setListBelowCTV((prev) => {
        listUser = prev;
        return prev;
      });

      if (listUser?.length < totalLength) {
        onLoadMore(filterCondition, () =>
          sendMessage(listUser, payload, filterCondition, onSuccess),
        );
        return;
      }

      const listUserId = listUser
        ?.filter((user) => !listIdUnselected?.includes(user?.ID) && user?.ID !== myUser?.uid)
        ?.map((user) => user.ID);

      setTypeModal(TYPE_MODAL.LOADING);
      const _payload = {
        userIDs: listUserId,
        // userIDs: ['2049610046'],
        data: {
          notification: {
            title: `Thông báo từ RSM ${myUser?.fullName}`,
            body: payload,
            sound: 'default',
          },
          data: {
            type: NOTIFICATION_TYPES.CHAT_MESSAGE,
            category: 'admin',
            filterCondition,
            extra_data: {
              title: `Thông báo từ RSM ${myUser?.fullName}`,
              body: payload,
              screen_title: '',
              url: '',
              img_url: '',
              tags: '',
              user: myUser,
            },
          },
        },
      };
      actions.sendMassMessage(_payload, (notifyId) => {
        if (notifyId) {
          actions.getListSendMassMessage();
          setTypeModal(TYPE_MODAL.SUCCESS);
          listUserIdResend = null;
          payloadResend = null;
          onSuccessResend = null;
          onSuccess && onSuccess();
        } else {
          cacheDataResend(listUser, payload, filterCondition, onSuccess);
          setTypeModal(TYPE_MODAL.ERROR);
        }
      });
    },
    [actions, cacheDataResend, disabledPushRSM, listIdUnselected, myUser, onLoadMore, totalLength],
  );

  const switchToHistory = useCallback(() => {
    setIndex(1);
  }, []);

  const _getConditionFilter = useCallback(
    (typeRSM, statusRSM, topRSM, newPage = 1, callback) => {
      const filterParams = {};

      if (typeRSM?.length === 0 && statusRSM?.length === 0) {
        actions.setListCTVs([], true);
        setTotalLength(0);
        setListIdUnselected([]);
        return;
      }

      if (typeRSM !== 'all') {
        filterParams.depth = typeRSM > 7 ? 7 : typeRSM;
      }
      if (statusRSM !== STATUS_RSM.ALL) {
        if (statusRSM === STATUS_RSM.ONLINE) {
          filterParams.ctv_type = 'active';
        }
        if (statusRSM === STATUS_RSM.GMV_EXIST) {
          filterParams.has_comm = 1;
        }
        if (statusRSM === STATUS_RSM.PL_GVM_EXIST) {
          filterParams.is_pl = 1;
        }
        if (statusRSM === STATUS_RSM.INS_GVM_EXIST) {
          filterParams.is_ins = 1;
        }
        if (statusRSM === STATUS_RSM.DAA_GVM_EXIST) {
          filterParams.is_daa = 1;
        }
      }
      if (topRSM !== 0) {
        filterParams.top = topRSM;
      } else {
        filterParams.page = newPage;
      }
      setTimeout(() => {
        !callback && setIsLoading(true);
      }, 500);

      actions.getListCTV(filterParams, (isSuccess, length) => {
        if (isSuccess) {
          setPage(newPage);
          typeof length === 'number' && setTotalLength(length);
        }
        callback && callback();

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    },
    [actions],
  );

  const onGoToDetail = useCallback(
    (data) => {
      navigation?.navigate('RSMDetailMessage', {
        data,
      });
    },
    [navigation],
  );

  const onGoToListCTV = useCallback(() => {
    navigation?.popToTop();
    navigation?.navigate('CollaboratorTab');
  }, [navigation]);

  const onLoadMore = useCallback(
    ({ typeRSM, statusRSM, topRSM }, callback) => {
      setPage((prevPage) => {
        const newPage = prevPage + 1;
        _getConditionFilter(typeRSM, statusRSM, topRSM, newPage, callback);
        return prevPage;
      });
    },
    [_getConditionFilter],
  );

  const renderSendNotiTab = useCallback(() => {
    return (
      <View style={{ flex: 1 }}>
        <SendNotiTab
          listCTV={listBelowCTV}
          deleteCTVs={onUnselectItem}
          onSendMessage={sendMessage}
          getConditionFilter={_getConditionFilter}
          unSelectUser={onUnselectItem}
          selectUser={onSelectItem}
          myUser={myUser}
          onLoadMore={onLoadMore}
          totalLength={totalLength - listIdUnselected?.length}
          listIdUnselected={listIdUnselected}
        />
        <StatusPopup
          ref={modalRef}
          type={typeModal}
          goToHistory={switchToHistory}
          onGoToListCTV={onGoToListCTV}
          onResendMessage={() => sendMessage(listUserIdResend, payloadResend, onSuccessResend)}
        />
      </View>
    );
  }, [
    _getConditionFilter,
    listBelowCTV,
    listIdUnselected,
    myUser,
    onGoToListCTV,
    onLoadMore,
    onSelectItem,
    onUnselectItem,
    sendMessage,
    switchToHistory,
    totalLength,
    typeModal,
  ]);
  const renderHistoryTab = useCallback(() => {
    return (
      <View>
        <HistoryNotiTab
          listNotis={listNotis}
          onBackToSendNoti={switchToSendNoti}
          onGoToDetail={onGoToDetail}
        />
      </View>
    );
  }, [listNotis, onGoToDetail, switchToSendNoti]);
  const switchToSendNoti = useCallback(() => {
    setIndex(0);
  }, []);

  const renderMenu = (propsTabBar) => {
    return (
      <TabBar
        {...propsTabBar}
        style={{
          backgroundColor: Colors.actionBackground,
        }}
        activeColor={Colors.primary2}
        inactiveColor={Colors.gray5}
        indicatorStyle={{ backgroundColor: Colors.primary2 }}
        renderTabBarItem={(propsTabBarItem) => {
          return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <TabBarItem
                {...propsTabBarItem}
                renderLabel={({ focused, route }) => {
                  return (
                    <View>
                      <AppText
                        style={{
                          color: focused ? Colors.primary2 : Colors.gray5,
                          fontSize: SH(14),
                          lineHeight: SH(20),
                          textAlign: 'center',
                          fontFamily: focused ? fonts.bold : fonts.medium,
                          borderWidth: 1,
                          borderColor: 'transparent',
                        }}
                      >
                        {route?.item?.title}
                      </AppText>
                    </View>
                  );
                }}
              />
              {propsTabBarItem.key > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    width: SW(1),
                    height: SH(20),
                    backgroundColor: Colors.neutral4,
                    left: 0,
                  }}
                />
              ) : null}
            </View>
          );
        }}
      />
    );
  };

  const renderScene = useCallback(
    ({ route }) => {
      switch (route.key) {
        case TABS.SEND_NOTI:
          return renderSendNotiTab();
        case TABS.HISTORY_NOTI:
          return renderHistoryTab();
        default:
          return <View />;
      }
    },
    [renderHistoryTab, renderSendNotiTab],
  );
  const onFocusOnTab = (index) => {
    setIndex(index);
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.actionBackground }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderMenu}
        onIndexChange={onFocusOnTab}
        swipeEnabled={false}
      />
      <Loading visible={isLoading} />
    </View>
  );
};

export default RSMPushMessage;
