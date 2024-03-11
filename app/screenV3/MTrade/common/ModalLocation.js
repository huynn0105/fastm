import { FlatList, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Modal from 'react-native-modal';
import ButtonText from '../../../common/ButtonText';
import Colors from '../../../theme/Color';
import { SW } from '../../../constants/styles';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setMTradeLocation } from '../../../redux/actions/actionsV3/mtradeAction';
import PickerSelector from '../../../componentV3/PickerSelector';

const ITEM_HEIGHT = 45;

const ModalLocation = memo(
  forwardRef((props, ref) => {
    const { onSubmitLocation } = props;

    const dispatch = useDispatch();

    const listMTradeLocation = useSelector((state) => state?.mtradeReducer?.listMTradeLocation);

    const location = useSelector((state) => state?.mtradeReducer?.location);

    const [locationActive, setLocationActive] = useState(location);

    const locationTitle = useMemo(
      () => listMTradeLocation?.find((item) => item?.code == locationActive)?.name || '',
      [listMTradeLocation, locationActive],
    );

    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleListLocation, setVisibleListLocation] = useState(false);

    const isLoadingButton = useMemo(
      () => isLoading || !listMTradeLocation?.length,
      [isLoading, listMTradeLocation?.length],
    );

    const open = useCallback(() => {
      setLocationActive(location);
      setVisible(true);
      setIsLoading(false);
    }, [location]);
    const close = useCallback(() => {
      setVisible(false);
      setVisibleListLocation(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const showListLocation = useCallback(() => {
      setVisibleListLocation(true);
    }, []);
    const hideListLocation = useCallback(() => {
      setVisibleListLocation(false);
    }, []);
    const onSelectedLocation = useCallback(
      (item) => {
        setLocationActive(item?.code);
        hideListLocation();
      },
      [hideListLocation],
    );

    const onConfirm = useCallback(() => {
      setIsLoading(true);
      dispatch(
        setMTradeLocation(locationActive, (isSuccess) => {
          setIsLoading(false);
          if (isSuccess) {
            onSubmitLocation?.(locationActive);
            close();
          }
        }),
      );
    }, [close, dispatch, locationActive, onSubmitLocation]);

    useEffect(() => {
      setLocationActive(location);
    }, [location]);

    return (
      <Modal
        isVisible={visible}
        style={styles.container}
        backdropColor={'rgb(10, 10, 40)'}
        backdropOpacity={0.9}
        deviceHeight="100%"
      >
        <View style={styles.bodyContainer}>
          <Image source={IMAGE_PATH.mascotFindLocation} style={styles.mascot} />
          <AppText semiBold style={styles.title}>
            Khu vực giao hàng
          </AppText>
          <TouchableWithoutFeedback onPress={showListLocation}>
            <View style={styles.locationContainer}>
              <Image source={ICON_PATH.marker} style={styles.marker} />
              <AppText style={[styles.location, !locationTitle && { color: Colors.gray5 }]} medium>
                - {locationTitle || 'Nhấn để chọn'} -
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <AppText style={styles.desc}>
            Chọn khu vực để đảm bảo thời gian nhận hàng được nhanh nhất.
          </AppText>
        </View>
        <View style={styles.buttonContainer}>
          {!listMTradeLocation?.length ? null : (
            <ButtonText
              title={'Quay lại'}
              onPress={close}
              fontSize={16}
              height={50}
              lineHeight={24}
              buttonColor={Colors.transparent}
              borderColor={Colors.primary5}
              disabled={isLoadingButton}
            />
          )}
          <ButtonText
            title={'Hoàn tất'}
            onPress={onConfirm}
            medium
            fontSize={16}
            height={50}
            lineHeight={24}
            disabled={isLoadingButton}
            isLoading={isLoadingButton}
          />
        </View>
        <PickerSelector
          title={'Chọn khu vực'}
          data={listMTradeLocation?.map((it) => ({ ...it, value: it?.name, ID: it?.code }))}
          onPressItem={onSelectedLocation}
          onCloseModal={hideListLocation}
          isVisible={visibleListLocation}
        />
      </Modal>
    );
  }),
);

export default ModalLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: 'center',
  },
  bodyContainer: {
    width: SW(343),
    borderRadius: 16,
    backgroundColor: Colors.primary5,
    marginBottom: 20,
  },
  mascot: {
    width: 140,
    height: 140,
    position: 'absolute',
    top: -48,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 104,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.blue3,
  },
  locationContainer: {
    height: 40,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 24,
    backgroundColor: Colors.neutral5,
  },
  location: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  marker: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 12,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 20,
  },
  listContainer: {
    marginTop: 104,
    height: 150,
    marginBottom: 20,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral5,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: SW(343),
    justifyContent: 'space-evenly',
  },
});
