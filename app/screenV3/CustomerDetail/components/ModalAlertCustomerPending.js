import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import Modal from 'react-native-modal';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { fonts } from '../../../constants/configs';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';
import { TAB_TYPE } from '../../Customer/Customer.constants';

const ModalAlertCustomerPending = memo(
  forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState(TAB_TYPE.PRIORITY);
    const [isChecked, setIsChecked] = useState(false);

    const open = useCallback((_type) => {
      setIsVisible(true);
      setType(_type);
      setIsChecked(false);
    }, []);

    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    const onCancel = useCallback(() => {
      close();
      props?.onCancel?.();
    }, [close, props]);
    const onConfirm = useCallback(() => {
      close();
      props?.onConfirm?.(type, isChecked);
    }, [close, isChecked, props, type]);

    useImperativeHandle(ref, () => ({ open, close }));

    return (
      <Modal isVisible={isVisible} style={styles.container}>
        <View style={styles.modalContainer}>
          <Image
            source={type === TAB_TYPE.PRIORITY ? ICON_PATH.saleman : ICON_PATH.trash2}
            style={styles.icon}
          />
          {type === TAB_TYPE.PRIORITY ? (
            <AppText style={styles.desc}>
              Khách hàng sẽ được phân loại vào tệp{'\n'}
              <AppText style={styles.descBold}>TIỀM NĂNG</AppText> trong danh sách khách hàng.
            </AppText>
          ) : (
            <AppText style={styles.desc}>
              Khách hàng sẽ được đưa vào{' '}
              <AppText style={[styles.descBold, { color: Colors.sixRed }]}>
                Danh sách bỏ qua
              </AppText>
              , và tự động xoá sau 30 ngày
            </AppText>
          )}
          <CheckBoxSquare
            label={'Đã hiểu và không nhắc lại'}
            textColor={Colors.gray1}
            onChangeValue={setIsChecked}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <AppText style={[styles.buttonText, { color: Colors.gray5 }]} medium>
                Xem lại
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <AppText style={[styles.buttonText, { color: Colors.primary2 }]} semiBold>
                Xác nhận
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }),
);

export default ModalAlertCustomerPending;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
  },
  modalContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    margin: 16,
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginHorizontal: 16,
    color: Colors.gray5,
    marginBottom: 4,
  },
  descBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.bold,
  },
  buttonContainer: {
    marginTop: 24,
    height: 50,
    backgroundColor: '#eaeef6',
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
