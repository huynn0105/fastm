import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useSelector,
  useImperativeHandle,
} from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { fonts } from '../../../constants/configs';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import BroadcastManager from '../../../submodules/firebase/manager/BroadcastManager';
import { isIphoneX } from 'react-native-iphone-x-helper';
import isIphone12 from '../../../utils/iphone12Helper';
import { SEARCH_HEIGHT } from '../constants';
import createStoreFunc from '../../../redux/store/store';

const SearchBar = React.forwardRef((params, ref) => {
  const {
    onCloseSearchView,
    onGetKeyword,
    inputKeyword,
    isVisibleHomeSearchScreen,
    opacitySearchBar,
    widthSearchBar,
    onFocusInput,
    onResetKeyword,
    zIndexCloseButton,
    isLoggedIn,
  } = params;
  const [keyword, setKeyWord] = useState(inputKeyword);
  const [isFocus, setIsFocus] = useState(false);
  const opacityButton = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clearInput() {
      setKeyWord('');
    },
    getInput() {
      return keyword;
    },
  }));

  /// ChatBot
  const showChatBot = createStoreFunc.getState().appInfo?.highlightChatBot?.showChatBot === true;

  useEffect(() => {
    BroadcastManager.shared().addObserver('close_search', SearchBar, () => {
      // this.onCloseSearchView();
      onCloseInput();
    });
  }, []);
  useEffect(() => {
    onGetKeyword(keyword);
  }, [keyword]);
  const _onFocusInput = () => {
    onFocusInput();
    setTimeout(() => {
      setIsFocus(true);
      Animated.timing(opacityButton, {
        toValue: 1,

        duration: 500,
      }).start(() => {});
    }, 100);
  };
  const onCloseInput = () => {
    Animated.timing(opacityButton, {
      toValue: 0,
      duration: 100,
    }).start();
    setTimeout(() => {
      onCloseSearchView();
      setIsFocus(false);
    }, 200);
    inputRef?.current?.blur();
  };
  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: SEARCH_HEIGHT,
          zIndex: 9,
        },
      ]}
    >
      <Animated.View
        style={{
          width: SW(isLoggedIn ? (isVisibleHomeSearchScreen ? 290 : showChatBot ? 220 : 260) : 290),
          marginLeft: SW(16),
          useNativeDriver: true,
          opacity: opacitySearchBar,
          height: SEARCH_HEIGHT,
          justifyContent: 'center',
        }}
      >
        <View style={styles.placeholderView}>
          <Image source={ICON_PATH.search1} style={{ tintColor: Colors.primary5 }} />
        </View>
        <TextInput
          style={[
            styles.inputStyle,
            {
              paddingRight: SW(36),
              justifyContent: 'center',
              overflow: 'scroll',
            },
          ]}
          value={keyword}
          ref={(ref) => (inputRef.current = ref)}
          onChangeText={(text) => setKeyWord(text)}
          placeholder="Tìm kiếm"
          placeholderTextColor={'#9BC3FB'}
          onFocus={_onFocusInput}
          numberOfLines={1}
        />
        {keyword?.length > 0 ? (
          <View
            style={{
              position: 'absolute',
              right: SW(8),
              top: SH(8),
              zIndex: 99999999,
            }}
          >
            <TouchableWithoutFeedback onPress={onResetKeyword}>
              <Image
                source={ICON_PATH.close4}
                style={{ width: SW(20), height: SH(20), resizeMode: 'contain' }}
              />
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          right: SW(16),
          opacity: opacityButton,
          zIndex: zIndexCloseButton,
        }}
      >
        <TouchableOpacity
          style={{ height: SH(48), justifyContent: 'center' }}
          onPress={onCloseInput}
        >
          <AppText
            medium
            style={{
              color: Colors.primary5,
              fontSize: SH(14),
              lineHeight: SH(22),
              paddingHorizontal: SW(4),
            }}
          >
            Đóng
          </AppText>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  inputStyle: {
    padding: 0,
    backgroundColor: '#d6e5ff3d',
    height: SEARCH_HEIGHT,
    borderRadius: SH(22),
    paddingLeft: SW(44),
    // alignSelf: 'center',
    color: Colors.primary5,
    fontSize: SH(14),
    lineHeight: SH(16),
    fontFamily: fonts.regular,
    // height: '100%',
    // height: Platform.OS === 'ios' ? SH(36) : SH(46),
    // zIndex: 999999,
  },
  container: {
    justifyContent: 'center',
    // alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  placeholderView: {
    position: 'absolute',
    left: SW(12),
    alignSelf: 'center',
    // top: Platform.OS === 'ios' ? (isIphone12() || isIphoneX() ? SH(10) : SH(6)) : SH(12),
    zIndex: 99999,
    // backgroundColor: 'red',
  },
  placeholderText: {
    opacity: 0.5,
    color: Colors.primary5,
    marginLeft: SW(14),
  },
});

export default SearchBar;
