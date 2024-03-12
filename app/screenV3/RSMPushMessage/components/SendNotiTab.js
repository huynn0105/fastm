import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { Header } from 'react-navigation';
import { ICON_PATH } from '../../../assets/path';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import { useActions } from '../../../hooks/useActions';
import Colors from '../../../theme/Color';
import { showInfoAlert } from '../../../utils/UIUtils';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import FilterButton from '../common/FilterButton';
import InputSearch from '../common/InputSearch';
import ListCTV from '../common/ListCTV';
import ListSearch from '../common/ListSearch';
import ViewModalDelete from '../common/ViewModalDelete';
import { styles } from '../RSMPushMessage.style';
import ViewBottomSheetListCTV from './../common/ViewBottomSheetListCTV';
import { searchCTVs, setListCTVs } from '../../../redux/actions/actionsV3/userConfigs';
import { debounce } from 'lodash';
import { STATUS_RSM } from '../RSMPushMessage.constant';

const SendNotiTab = ({
  params,
  listCTV,
  deleteCTVs,
  addCTVs,
  condition,
  onSendMessage,
  getConditionFilter,
  unSelectUser,
  selectUser,
  myUser,
  onLoadMore,
  totalLength,
  listIdUnselected,
}) => {
  const bottomSheetRef = useRef(null);

  const [message, setMessage] = useState('');
  const inputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalDelete2, setShowModalDelete2] = useState(false);
  const [showModalDelete3, setShowModalDelete3] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [listSearch, setListSearch] = useState([]);
  const [idDelete, setIdDelete] = useState(-1);
  const [filterCondition, setFilterCondition] = useState({});
  const [isCallAPISearch, setIsCallAPISearch] = useState(false);

  const sendNoti = useCallback(() => {
    const listUser = [];
    listCTV?.map((ctv) => {
      listUser.push(ctv);
    });
    if (listUser.length > 0) {
      Keyboard.dismiss();
      onSendMessage(listUser, message?.trim(), filterCondition, () => {
        setMessage('');
      });
    } else {
      showInfoAlert('Chưa chọn cộng tác viên');
    }
  }, [filterCondition, listCTV, message, onSendMessage]);

  const onChangeText = (text) => {
    setMessage(text);
  };

  const checkDisableButton = useCallback(() => {
    return !message;
  }, [message]);

  const getListSearchCTV = debounce((text, filterConditionParams) => {
    if (text) {
      const filterParams = {};

      const { typeRSM, statusRSM, topRSM } = filterConditionParams;

      if (typeRSM?.length === 0 && statusRSM?.length === 0) {
        actions.setListCTVs([]);
        setIsCallAPISearch(false);
        return;
      }
      if (typeRSM !== 'all') {
        filterParams.depth = typeRSM > 7 ? 7 : typeRSM;
      }
      if (statusRSM && statusRSM !== STATUS_RSM.ALL) {
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
      }
      filterParams.search = text;

      actions.searchCTVs(filterParams, (isSuccess, data) => {
        if (isSuccess) {
          setListSearch(data);
        } else {
          setListSearch([]);
        }
        setIsCallAPISearch(false);
      });
    } else {
      setListSearch([]);
      setIsCallAPISearch(false);
    }
  }, 1500);

  const callApiSearchCTVDebounce = useRef(debounce(getListSearchCTV, 1000));

  const onChangeKeyword = (text) => {
    setIsCallAPISearch(true);
    setKeyword(text);
    callApiSearchCTVDebounce?.current(text, filterCondition);
  };

  const actions = useActions({
    searchCTVs,
    setListCTVs,
  });

  const renderModalInput = () => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.modalView} onPress={closeModal}>
        <View style={{ marginTop: SH(16) }}>
          <View style={styles.searchIconPosition}>
            <Image source={ICON_PATH.search1} style={styles.searchIcon} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <TextInput
              ref={inputRef}
              placeholder={'Tìm theo nickname, mã MFast CTV'}
              placeholderTextColor={Colors.gray5}
              style={styles.textInput}
              value={keyword}
              onChangeText={onChangeKeyword}
              // autoFocus
            />
            <TouchableOpacity style={{ position: 'absolute', right: SW(12) }} onPress={clearInput}>
              <Image source={ICON_PATH.close4} style={{ width: SH(24), height: SH(24) }} />
            </TouchableOpacity>
          </View>
          {keyword?.length ? (
            <View style={styles.searchCTVContainer}>
              {isCallAPISearch || listSearch?.length === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  {isCallAPISearch ? (
                    <Image
                      source={ICON_PATH.loadingSpinner}
                      style={{ width: SH(24), height: SH(24) }}
                    />
                  ) : (
                    <Image source={ICON_PATH.iconNull} style={{ width: SH(24), height: SH(24) }} />
                  )}
                  <AppText
                    style={[commonStyle.commonText, { color: Colors.gray5, marginTop: SH(8) }]}
                  >
                    {isCallAPISearch
                      ? 'Đang tìm kiếm cộng tác viên'
                      : 'Không tìm thấy cộng tác viên'}
                  </AppText>
                </View>
              ) : (
                renderListFilter()
              )}
            </View>
          ) : null}
        </View>
        <Modal isVisible={showModalDelete} onBackdropPress={() => setShowModalDelete(false)}>
          <ViewModalDelete
            userDelete={listCTV?.find((ctv) => ctv?.ID === idDelete)}
            onDelete={onDeleteUser}
            onCancel={closeModalDelete}
          />
        </Modal>
      </TouchableOpacity>
    );
  };
  const unSelectUserID = useCallback((id) => {
    setShowModalDelete(true);
    setIdDelete(id);
  }, []);

  const selectUserID = useCallback(
    (id) => {
      selectUser(id);
    },
    [selectUser],
  );

  const onDeleteUser = useCallback(
    (_idDelete) => {
      unSelectUser(_idDelete);
      closeModalDelete();
      setShowModalDelete2(false);
      setShowModalDelete3(false);
    },
    [closeModalDelete, unSelectUser],
  );
  const closeModalDelete = useCallback(() => {
    setShowModalDelete(false);
  }, []);

  const renderListFilter = useCallback(() => {
    return (
      <ListSearch
        listSearch={listSearch}
        onUnselect={unSelectUserID}
        onSelect={selectUserID}
        listIdUnselected={listIdUnselected}
      />
    );
  }, [listIdUnselected, listSearch, selectUserID, unSelectUserID]);

  const _onStartSearch = () => {
    setShowModal(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  };
  const closeModal = () => {
    setShowModal(false);
    Keyboard.dismiss();
  };

  const renderListCTVs = useCallback(() => {
    const listCtvWithoutUnselect = listCTV?.filter((ctv) => !listIdUnselected.includes(ctv?.ID));
    if (listCtvWithoutUnselect?.length === 0) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: SH(24) }}>
          <Image source={ICON_PATH.iconNull} style={styles.icon} />
          <AppText style={styles.textNull}>Chưa có cộng tác viên nào được chọn</AppText>
        </View>
      );
    }
    return (
      <ListCTV
        listCTV={listCtvWithoutUnselect}
        onDelete={(userDeleteId) => {
          setIdDelete(userDeleteId);
          setShowModalDelete2(true);
        }}
        isShowAll={totalLength > 10}
        onShowAll={() => {
          bottomSheetRef?.current?.open();
        }}
        totalLength={totalLength}
      />
    );
  }, [listCTV, listIdUnselected, totalLength]);
  const clearInput = () => {
    setKeyword('');
  };

  const onGetConditionFilter = useCallback(
    (typeRSM, statusRSM, topRSM) => {
      setFilterCondition({ typeRSM, statusRSM, topRSM });
      getConditionFilter(typeRSM, statusRSM, topRSM);
      setKeyword('');
    },
    [getConditionFilter],
  );

  const onHandleLoadMore = useCallback(() => {
    onLoadMore(filterCondition);
  }, [filterCondition, onLoadMore]);

  const onCloseBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);

  const renderBottomSheetView = useCallback(() => {
    const listCtvWithoutUnselect = listCTV?.filter((ctv) => !listIdUnselected.includes(ctv?.ID));
    return (
      <View
        style={{
          paddingBottom: getBottomSpace(),
          paddingHorizontal: SW(16),
        }}
      >
        <ViewBottomSheetListCTV
          totalLength={totalLength}
          listCTV={listCtvWithoutUnselect}
          onDelete={(id) => {
            setShowModalDelete3(true);
            setIdDelete(id);
          }}
          onLoadMore={onHandleLoadMore}
        />
        <TouchableOpacity
          onPress={onCloseBottomSheet}
          style={{
            width: '100%',
            height: SH(46),
            backgroundColor: Colors.primary2,
            borderRadius: SH(27),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText medium style={{ fontSize: SH(14), lineHeight: SH(18), color: Colors.primary5 }}>
            Quay lại
          </AppText>
        </TouchableOpacity>
        <Modal isVisible={showModalDelete3} onBackdropPress={() => setShowModalDelete3(false)}>
          <ViewModalDelete
            userDelete={listCTV?.find((ctv) => ctv?.ID === idDelete)}
            onDelete={onDeleteUser}
            onCancel={() => setShowModalDelete3(false)}
          />
        </Modal>
      </View>
    );
  }, [
    listCTV,
    totalLength,
    onHandleLoadMore,
    showModalDelete3,
    onDeleteUser,
    idDelete,
    listIdUnselected,
    onCloseBottomSheet,
  ]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView
        extraHeight={SH(250)}
        keyboardShouldPersistTaps={'always'}
        // enableOnAndroid
        contentContainerStyle={{
          height: SCREEN_HEIGHT - Header.HEIGHT - getBottomSpace() - SH(30),
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.paddingView}>
                <AppText
                  style={commonStyle.commonText}
                >{`Danh sách ${totalLength} CTV muốn gửi thông báo`}</AppText>
                <InputSearch
                  onStartSearch={_onStartSearch}
                  keyword={keyword}
                  setKeyword={clearInput}
                />
                <FilterButton onSubmitCondition={onGetConditionFilter} />
                {renderListCTVs()}
              </View>
            </View>
            <View
              style={[
                styles.messageViewContainer,
                { position: 'absolute', bottom: 0, right: 0, left: 0 },
              ]}
            >
              <View style={styles.containerTitleMessage}>
                <AppText style={[commonStyle.mediumText, { color: Colors.primary5, opacity: 0.7 }]}>
                  Nội dung thông báo
                </AppText>
              </View>

              <TextInput
                style={styles.messageInputContainer}
                multiline={true}
                placeholder="Nhập nội dung"
                placeholderTextColor={Colors.gray5}
                value={message}
                onChangeText={onChangeText}
              />

              <View style={styles.containerSubmitButton}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: checkDisableButton() ? Colors.neutral3 : Colors.primary2 },
                  ]}
                  onPress={sendNoti}
                  disabled={checkDisableButton()}
                >
                  <AppText style={styles.textSubmitButton}>Gửi thông báo</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
      {/* </View> */}
      <Modal
        isVisible={showModal}
        onBackdropPress={closeModal}
        animationInTiming={500}
        animationOutTiming={500}
      >
        {renderModalInput()}
      </Modal>

      <Modal isVisible={showModalDelete2} onBackdropPress={() => setShowModalDelete2(false)}>
        <ViewModalDelete
          userDelete={listCTV?.find((ctv) => ctv?.ID === idDelete)}
          onDelete={onDeleteUser}
          onCancel={() => setShowModalDelete2(false)}
        />
      </Modal>
      <BottomActionSheet
        ref={(ref) => (bottomSheetRef.current = ref)}
        headerText={'Cộng tác viên đã chọn'}
        haveCloseButton={true}
        render={renderBottomSheetView}
      />
    </View>
  );
};

export default SendNotiTab;
