import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  // LayoutAnimation,
  Linking,
  Platform,
  Share,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
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
import BottomActionSheet from '../../components2/BottomActionSheet';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';
import { useKeyboard } from '@react-native-community/hooks';
import ListReferralProduct from '../ListReferralProduct/ListReferralProduct';
import { showDevAlert } from '../../utils/UIUtils';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const BottomSheetReferral = memo(
  forwardRef((props, ref) => {
    const { navigation } = props;

    const [customer, setCustomer] = useState({});

    const { keyboardHeight } = useKeyboard();
    const keyboardHeightRef = useRef(0);

    const bottomSheetRef = useRef();
    const isOpenWhenFocus = useRef(false);

    const open = useCallback((customerProps = {}) => {
      setCustomer(customerProps);
      bottomSheetRef?.current?.open();
    }, []);
    const close = useCallback(() => {
      bottomSheetRef?.current?.close();
      isOpenWhenFocus.current = false;
    }, []);

    const onCloseModal = useCallback(() => {
      bottomSheetRef?.current?.close();
    }, []);
    const onPressProduct = useCallback(() => {
      bottomSheetRef?.current?.close();
      isOpenWhenFocus.current = true;
    }, []);

    const renderBottomSheet = useCallback(() => {
      return (
        <View style={styles?.container}>
          <ListReferralProduct
            onCloseModal={onCloseModal}
            onPressProduct={onPressProduct}
            navigation={navigation}
            customer={customer}
          />
        </View>
      );
    }, [customer, navigation, onCloseModal, onPressProduct]);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    useEffect(() => {
      if (keyboardHeight > 0) {
        keyboardHeightRef.current = keyboardHeight;
      }
    }, [keyboardHeight]);

    useEffect(() => {
      const checkOpenBottomSheet = () => {
        if (isOpenWhenFocus.current) {
          bottomSheetRef?.current?.open();
          isOpenWhenFocus.current = false;
        }
      };

      const onFocusSubscribe = props?.navigation?.addListener('didFocus', checkOpenBottomSheet);
      return () => {
        onFocusSubscribe?.remove();
      };
    }, [props?.navigation]);

    return <BottomActionSheet ref={bottomSheetRef} render={renderBottomSheet} />;
  }),
);

export default BottomSheetReferral;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemDefaultContainer: {
    width: '100%',
    height: 72,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemDefaultIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary5,
    borderRadius: 48 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDefaultTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.gray1,
    lineHeight: 22,
    marginLeft: 12,
  },
  iconArrow: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  line: {
    width: SW(343),
    top: -0.5,
    height: 1,
    marginHorizontal: 16,
    backgroundColor: Colors.gray4,
    position: 'absolute',
  },
  headerContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary5,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
    flex: 1,
    textAlign: 'center',
  },
  headerSideContainer: {
    width: 24,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.primary3,
  },
  listContainer: {
    marginHorizontal: 16,
  },
  inputContainer: {
    marginHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    marginTop: 6,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 44,
    padding: 0,
  },
  iconSearch: {
    width: 20,
    height: 20,
    tintColor: Colors.gray5,
    marginRight: 12,
  },
  itemPlContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPlIcon: {
    width: 52,
    height: 32,
    resizeMode: 'contain',
    marginRight: 16,
  },
  itemPlTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
    flex: 1,
  },
  listHeaderContainer: {},
  listHeaderTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 20,
  },
  listEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  listEmptyIcon: {
    width: SW(24),
    height: SH(24),
    resizeMode: 'contain',
  },
  listEmptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
    marginTop: 12,
  },
  itemHistoryContainer: {
    width: '25%',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  itemHistoryTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    marginTop: 8,
  },
});
