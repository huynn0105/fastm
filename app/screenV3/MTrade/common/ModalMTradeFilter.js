import { Dimensions, Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Modal from 'react-native-modal';
import { SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import ItemFilter from '../components/ItemFilter';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import ButtonText from '../../../common/ButtonText';
import { useDispatch, useSelector } from 'react-redux';
import { getListMTradeFilter } from '../../../redux/actions/actionsV3/mtradeAction';
import { FlatList } from 'react-native';
import { SCREEN_HEIGHT } from '../../../utils/Utils';

const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 70;

const ModalMTradeFilter = memo(
  forwardRef((props, ref) => {
    const { onResetFilter, onSubmitFilter } = props;

    const [visible, setVisible] = useState(false);

    const [filterSelected, setFilterSelected] = useState({});

    const listMTradeFilter = useSelector((state) => state?.mtradeReducer?.listMTradeFilter);

    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const open = useCallback((filter = {}) => {
      setFilterSelected(filter);
      setVisible(true);
    }, []);
    const close = useCallback(() => {
      setVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const onChangeFilter = useCallback((id, values) => {
      setFilterSelected((prev) => ({ ...prev, [id]: values }));
    }, []);
    const _onResetFilter = useCallback(() => {
      setFilterSelected({});
      onResetFilter?.();
    }, [onResetFilter]);
    const _onSubmitFilter = useCallback(() => {
      onSubmitFilter?.(filterSelected);
    }, [filterSelected, onSubmitFilter]);

    const renderHeader = useCallback(() => {
      return (
        <View
          style={[
            styles.headerContainer,
            { height: HEADER_HEIGHT + insets?.top, paddingTop: insets?.top },
          ]}
        >
          <AppText style={styles.header} medium>
            Bộ lọc MTrade
          </AppText>
          <TouchableWithoutFeedback onPress={close}>
            <View style={styles.buttonClose}>
              <Image source={ICON_PATH.close1} style={styles.close} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }, [close, insets?.top]);

    const renderFooter = useCallback(() => {
      return (
        <View style={[styles.footerContainer, { height: FOOTER_HEIGHT + insets?.bottom }]}>
          <ButtonText
            title={'Thiết lập lại'}
            height={50}
            fontSize={16}
            medium
            lineHeight={24}
            buttonColor={Colors.primary5}
            borderColor={Colors.gray5}
            titleColor={Colors.gray5}
            width={SW(145)}
            onPress={_onResetFilter}
          />
          <ButtonText
            title={'Áp dụng'}
            height={50}
            fontSize={16}
            medium
            lineHeight={24}
            width={SW(145)}
            onPress={_onSubmitFilter}
          />
        </View>
      );
    }, [insets?.bottom, _onResetFilter, _onSubmitFilter]);

    const renderItemFilter = useCallback(
      (_) => {
        return (
          <ItemFilter
            {..._}
            filterSelected={filterSelected?.[_?.item?.keyword]}
            onChangeFilter={onChangeFilter}
            renderSubFilter={(subFilter) => {
              return (
                <ItemFilter
                  item={subFilter}
                  filterSelected={filterSelected?.[subFilter?.keyword]}
                  onChangeFilter={onChangeFilter}
                />
              );
            }}
          />
        );
      },
      [filterSelected, onChangeFilter],
    );

    const renderStatusBarBackground = useCallback(() => {
      return (
        <View
          style={{
            height: insets?.top,
            width: '100%',
            backgroundColor: Colors.neutral5,
            position: 'absolute',
            top: 0,
          }}
        />
      );
    }, [insets?.top]);

    useEffect(() => {
      dispatch(getListMTradeFilter());
    }, [dispatch]);

    return (
      <Modal
        isVisible={visible}
        style={styles.container}
        backdropColor={'rgb(10, 10, 40)'}
        backdropOpacity={0.9}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={close}
        deviceHeight="100%"
      >
        <View style={styles.bodyContainer}>
          {renderHeader()}
          <View
            style={{
              // flex: 1,
              height: SCREEN_HEIGHT - insets.bottom - insets.top - HEADER_HEIGHT - FOOTER_HEIGHT,
              backgroundColor: Colors.neutral5,
            }}
          >
            <KeyboardAwareFlatList
              data={listMTradeFilter}
              renderItem={renderItemFilter}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              enableOnAndroid
            />
          </View>

          {renderFooter()}
        </View>

        {/* {renderStatusBarBackground()} */}
      </Modal>
    );
  }),
);

export default ModalMTradeFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: 'flex-end',
    height: SCREEN_HEIGHT,
  },
  bodyContainer: {
    height: '100%',
    width: SW(335),
    backgroundColor: Colors.primary5,
  },
  headerContainer: {
    backgroundColor: Colors.primary5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
  },
  header: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
  },
  buttonClose: {
    padding: 16,
  },
  close: {
    width: 18,
    height: 18,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  footerContainer: {
    backgroundColor: Colors.primary5,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

const MOCKING_DATA = [
  {
    id: '1',
    title: 'Theo danh mục',
    type: 'MULTI_SELECT',
    data: [
      {
        id: '1.1',
        title: 'Tất cả',
      },
      {
        id: '1.2',
        title: 'Điện thoại',
      },
      {
        id: '1.3',
        title: 'Tablet',
      },
      {
        id: '1.4',
        title: 'Tai nghe',
      },
      {
        id: '1.5',
        title: 'Mẹ & Bé',
      },
      {
        id: '1.6',
        title: 'Giáo dục',
      },
    ],
  },
  {
    id: '2',
    title: 'Thương hiệu',
    type: 'MULTI_SELECT',
    data: [
      {
        id: '2.1',
        title: 'OPPO',
      },
      {
        id: '2.2',
        title: 'APPLE',
      },
      {
        id: '2.3',
        title: 'Kangaroo',
      },
      {
        id: '2.4',
        title: 'GotIt',
      },
    ],
  },
  {
    id: '3',
    title: 'Khoảng giá',
    type: 'SINGLE_SELECT',
    inputs: [
      {
        placeholder: 'Giá tối thiểu',
        keyboardType: 'numeric',
        index: 0,
      },
      {
        placeholder: 'Giá tối đa',
        keyboardType: 'numeric',
        index: 1,
      },
    ],
    data: [
      {
        id: '3.1',
        title: '1-3tr',
      },
      {
        id: '3.2',
        title: '3-5tr',
      },
      {
        id: '3.3',
        title: '5-10tr',
      },
      {
        id: '3.4',
        title: 'Trên 10tr',
      },
    ],
  },
  {
    id: '4',
    title: 'Phương thức thanh toán',
    type: 'MULTI_SELECT',
    data: [
      {
        id: '4.1',
        title: 'Trả ngay',
      },
      {
        id: '4.2',
        title: 'Trả chậm 0% lãi suất',
      },
      {
        id: '4.3',
        title: 'Trả chậm có lãi suất',
      },
    ],
  },
];
