import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonCheckBox from '../../Customer/common/ButtonCheckBox';
import { useSelector } from 'react-redux';
import { TAB_TYPE } from '../../Customer/Customer.constants';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import ListCheckBoxBottomSheet from '../../Customer/common/ListCheckBox';

const HeaderCustomerDetail = memo((props) => {
  const { onChangeFilter, filter, onDelete, goToTrash, isCustomerTrash } = props;
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isVisibleModalDelete, setIsVisibleModalDelete] = useState(false);

  const countCustomer = useSelector(
    (state) =>
      state?.customerReducer?.totalNum[isCustomerTrash ? TAB_TYPE.TRASH : TAB_TYPE.PAGE] || 0,
  );

  const listLinkCustomer = useSelector(
    (state) =>
      state?.customerReducer?.listFilterCustomer?.find((item) => item?.key === TAB_TYPE.PAGE)
        ?.projects,
  );

  const onOpenModal = useCallback(() => {
    setIsVisibleModal(true);
  }, []);

  const onHideModal = useCallback(() => {
    setIsVisibleModal(false);
  }, []);

  const onOpenModalDelete = useCallback(() => {
    setIsVisibleModalDelete(true);
  }, []);

  const onHideModalDelete = useCallback(() => {
    setIsVisibleModalDelete(false);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity disabled={isCustomerTrash} style={styles.row} onPress={onOpenModal}>
        {isCustomerTrash ? (
          <>
            <AppText style={[styles.text, { color: Colors.gray5 }]}>
              Có{' '}
              <AppText semiBold style={[styles.text, { color: Colors.gray1 }]}>
                {countCustomer}
              </AppText>{' '}
              khách trong danh sách bỏ qua
            </AppText>
          </>
        ) : (
          <>
            <View>
              <Image
                source={ICON_PATH.iconFilter}
                style={[
                  styles.icon,
                  {
                    tintColor: Colors.primary2,
                  },
                ]}
              />
            </View>
            <AppText style={styles.text}>
              {/* {filter?.source === 'all'
                ? 'Tất cả'
                : filter?.source === 'me'
                ? 'Của tôi'
                : 'Được giới thiệu'}{' '} */}
              Chưa phân loại ({countCustomer || 0} khách)
            </AppText>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onOpenModalDelete} style={styles.row}>
        <AppText style={[styles.text, { color: Colors.sixRed }]}>Làm trống</AppText>
        <View>
          <Image source={ICON_PATH.trash2} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={isVisibleModal}
        style={styles.modalContainer}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}
        onBackdropPress={onHideModal}
      >
        <ModalFilter
          listLinkCustomer={listLinkCustomer}
          filter={filter}
          onChangeFilter={onChangeFilter}
          onCloseModal={onHideModal}
          goToTrash={goToTrash}
        />
      </Modal>
      <Modal
        isVisible={isVisibleModalDelete}
        animationOutTiming={1}
        animationInTiming={1}
        onBackdropPress={onHideModalDelete}
      >
        <ModalDelete
          isClearTrash={isCustomerTrash}
          onCloseModal={onHideModalDelete}
          onDelete={onDelete}
        />
      </Modal>
    </View>
  );
});

export default HeaderCustomerDetail;

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: '100%',
    backgroundColor: Colors.primary5,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.primary2,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 0,
    margin: 0,
    justifyContent: 'flex-start',
  },
  itemModalContainer: {
    backgroundColor: Colors.primary5,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 48,
    borderWidth: 1,
    borderColor: Colors.gray5,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  radioIcon: {
    width: 24,
    height: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  radioText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
});

const ModalFilter = memo((props) => {
  const { listLinkCustomer, filter: mainFilter, onChangeFilter, onCloseModal, goToTrash } = props;

  const idsSelected = useRef([]);

  const [data, setData] = useState(listLinkCustomer);

  const [filter, setFilter] = useState(mainFilter);

  const listFilterSource = useMemo(
    () =>
      [
        { id: '1', label: 'Tất cả', value: 'all' },
        { id: '2', label: 'Của tôi', value: 'me' },
        { id: '3', label: 'Được giới thiệu', value: 'other' },
      ].map((it) => {
        if (it?.value === filter?.source) {
          return {
            ...it,
            isSelected: true,
          };
        } else if (it?.isSelected) {
          return {
            ...it,
            isSelected: false,
          };
        } else {
          return it;
        }
      }),
    [filter?.source],
  );

  const listFilterLink = useMemo(
    () =>
      data?.map((it) => {
        if (filter?.page_qc?.includes(it?.id)) {
          return {
            ...it,
            isSelected: true,
          };
        } else if (it?.isSelected) {
          return {
            ...it,
            isSelected: false,
          };
        } else {
          return it;
        }
      }),
    [data, filter?.page_qc],
  );

  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef();

  const onOpenBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.open('Lọc theo liên kết tiếp thị');
  }, []);
  const onHideBottomSheet = useCallback(() => {
    bottomSheetRef?.current?.close();
  }, []);
  const onCheckboxSelected = useCallback((ids) => {
    idsSelected.current = ids;
  }, []);
  const onConfirmCheckbox = useCallback(() => {
    setData((prevState = []) => {
      const ids = [];
      const newData = [...prevState]?.map((it) => {
        if (idsSelected?.current?.includes(it?.id)) {
          ids.push(it?.id);
          return {
            ...it,
            isSelected: true,
          };
        } else if (it?.isSelected) {
          return {
            ...it,
            isSelected: false,
          };
        } else {
          return it;
        }
      });
      setFilter((prevStateFilter) => ({ ...prevStateFilter, page_qc: ids }));
      return newData;
    });
    onHideBottomSheet();
  }, [onHideBottomSheet]);

  const onPressRemoveFilter = useCallback(() => {
    const initFilter = {
      source: 'all',
      page_qc: [],
    };
    setFilter(initFilter);
    onChangeFilter?.(initFilter);
    onCloseModal?.();
  }, [onChangeFilter, onCloseModal]);
  const onPressFilter = useCallback(() => {
    onChangeFilter(filter);
    onCloseModal?.();
  }, [filter, onChangeFilter, onCloseModal]);

  const numLinkFilter = useMemo(
    () => listFilterLink?.filter((it) => it?.isSelected)?.length,
    [listFilterLink],
  );

  return (
    <>
      <View style={[styles.itemModalContainer, { paddingTop: insets?.top }]}>
        {/* <AppText style={[styles.modalTitle, { marginTop: 20 }]}>Nguồn khách hàng</AppText>
        <ListCheckBox
          data={listFilterSource}
          onChangeValue={(value) => {
            setFilter?.((prevState) => ({ ...prevState, source: value }));
          }}
        /> */}
        <AppText style={[styles.modalTitle, { marginTop: 20 }]}>Link quảng cáo</AppText>
        <ButtonCheckBox
          onPress={onOpenBottomSheet}
          placeholder={'Chọn liên kết tiếp thị'}
          value={numLinkFilter ? `Đã chọn ${numLinkFilter} link quảng cáo` : ''}
          style={{ marginHorizontal: 0, marginTop: 8 }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onPressRemoveFilter}>
            <AppText style={styles.buttonText}>Bỏ lọc</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { borderColor: Colors.primary2, backgroundColor: Colors.primary2 },
            ]}
            onPress={onPressFilter}
          >
            <AppText style={[styles.buttonText, { color: Colors.primary5 }]}>
              Lọc khách hàng
            </AppText>
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            onCloseModal?.();
            goToTrash?.();
          }}
        >
          <View
            style={{
              marginTop: 16,
              borderTopWidth: 1,
              borderTopColor: 'rgb(224, 224, 224)',
              paddingTop: 12,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <AppText medium style={{ fontSize: 16, lineHeight: 22 }}>
                Danh sách đã bỏ qua
              </AppText>
              <Image source={ICON_PATH.arrow_right} style={{ width: 16, height: 16 }} />
            </View>
            <AppText
              style={{ fontSize: 13, lineHeight: 18, marginTop: 4, color: 'rgb(107, 107, 129)' }}
            >
              Khách hàng trong danh sách bỏ qua sẽ
              <AppText
                semiBold
                style={{ fontSize: 13, lineHeight: 18, color: 'rgb(245, 139, 20)' }}
              >
                {' '}
                tự động xoá hoàn toàn
              </AppText>{' '}
              sau mỗi 30 ngày
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => (
          <ListCheckBoxBottomSheet
            title={'liên kết tiếp thị'}
            data={listFilterLink}
            onCheckboxSelected={onCheckboxSelected}
          />
        )}
        canClose={true}
        haveCloseButton={true}
        backdropColor={'transparent'}
        onPressDone={onConfirmCheckbox}
      />
    </>
  );
});

const ModalDelete = memo((props) => {
  const { onCloseModal, onDelete, isClearTrash } = props;
  const [isDelete, setIsDelete] = useState(false);

  const renderRadioButton = useCallback(
    (label, value, note) => {
      const isSelected = isDelete === value;
      const disabled = false;
      return (
        <>
          <TouchableOpacity
            onPress={() => setIsDelete(value)}
            style={{
              flexDirection: 'row',
              marginTop: 8,
            }}
          >
            <View
              style={[
                styles.radioIcon,
                {},
                {
                  borderColor: Colors.neutral4,
                },
                isSelected
                  ? { borderColor: Colors.primary2 }
                  : disabled && {
                      backgroundColor: Colors.neutral4,
                    },
              ]}
            >
              {isSelected ? (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 15,
                    backgroundColor: Colors.primary2,
                    position: 'absolute',
                  }}
                />
              ) : null}
            </View>
            <AppText
              style={[styles.radioText, { color: isSelected ? Colors.gray1 : Colors.gray5 }]}
            >
              {label}
            </AppText>
          </TouchableOpacity>
          <AppText
            italic
            style={{ fontSize: 14, lineHeight: 20, color: '#f58b14', marginLeft: 36 }}
          >
            {note}
          </AppText>
        </>
      );
    },
    [isDelete],
  );

  return (
    <View
      style={{
        backgroundColor: Colors.primary5,
        borderRadius: 16,
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Image
        source={ICON_PATH.trash4}
        style={{
          width: 56,
          height: 56,
          resizeMode: 'contain',
          marginTop: 20,
        }}
      />
      <AppText
        semiBold
        style={{ fontSize: 16, lineHeight: 22, color: Colors.sixRed, marginTop: 12 }}
      >
        {isClearTrash ? 'Làm trống thùng rác' : 'Làm trống tệp chưa phân loại'}
      </AppText>
      <View style={{ width: '100%', paddingHorizontal: 16, marginTop: 12 }}>
        {isClearTrash ? (
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: Colors.gray5,
              textAlign: 'center',
            }}
          >
            Lưu ý: dữ liệu sẽ không thể khôi phục sau khi bấm “Xóa ngay”
          </AppText>
        ) : (
          <>
            <AppText style={{ fontSize: 14, lineHeight: 20 }}>Chọn phương thức làm trống</AppText>
            {renderRadioButton(
              'Chuyển vào Thùng rác',
              false,
              'Dữ liệu được xóa tự động sau 30 ngày',
            )}
            {renderRadioButton('Xóa vĩnh viễn', true, 'Dữ liệu được xóa ngay lập tức')}
            <AppText
              style={{
                fontSize: 14,
                lineHeight: 20,
                color: Colors.gray1,
                marginTop: 16,
              }}
            >
              Lưu ý: các khách hàng đã được
              <AppText semiBold> phân loại là tiềm năng</AppText> sẽ không bị ảnh hưởng
            </AppText>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: '#eaeef6', marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => {
            onCloseModal();
            onDelete(isDelete);
          }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 50 }}
        >
          <AppText medium style={{ fontSize: 14, lineHeight: 20, color: '#e93535' }}>
            Xóa ngay
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCloseModal}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 50 }}
        >
          <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.primary2 }}>
            Quay lại
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
});
