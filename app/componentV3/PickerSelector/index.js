import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#c5c9ce',
    height: height / 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    paddingHorizontal: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  txtHeader: {
    opacity: 0.6,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#24253d',
  },
  itemContainer: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTxt: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: '#24253d',
  },
  touchArea: {
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    margin: 16,
    height: 38,
    padding: 16,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    height: 38,
    textAlign: 'center',
    color: '#24253d',
  },
});

function normalizeString(string) {
  let str = string;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
}

const PickerSelector = ({ data, isVisible, title, placeholder, onPressItem, onCloseModal }) => {
  const textinputRef = useRef(null);

  const [resultList, setResultList] = useState([]);
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    setResultList(data);
  }, [data]);

  const handlerSearchData = useCallback(
    (txtSearch) => {
      if (!data || !txtSearch) return;
      return data.filter((item) => {
        const { value } = item;
        if (value && txtSearch) {
          return (
            value.toLowerCase().includes(txtSearch.toLowerCase()) ||
            normalizeString(value).toLowerCase().includes(normalizeString(txtSearch).toLowerCase())
          );
        }
        return true;
      });
    },
    [data],
  );

  const handlerSearch = useCallback(
    debounce((keyword) => {
      if (keyword) {
        const result = handlerSearchData(keyword);
        setResultList(result);
      } else {
        setResultList(data);
      }
    }, 300),
    [handlerSearchData, textSearch, data],
  );

  const onChangeText = useCallback(
    (value) => {
      setTextSearch(value);
      handlerSearch(value);
    },
    [setTextSearch, handlerSearch],
  );

  const onStaticPressItem = useCallback(
    (item) => {
      if (onPressItem) {
        onPressItem(item);
      }
    },
    [onPressItem],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => onStaticPressItem(item)}>
        <View style={styles.itemContainer}>
          <AppText style={styles.itemTxt}>{item?.value}</AppText>
        </View>
      </TouchableOpacity>
    ),
    [onStaticPressItem],
  );

  const keyExtractor = useCallback((item) => item?.ID, []);

  const onStaticCloseModal = useCallback(() => {
    if (onCloseModal) {
      setTextSearch('');
      onCloseModal();
    }
  }, [onCloseModal, textinputRef]);

  return (
    <Modal
      isVisible={isVisible}
      style={{ padding: 0, margin: 0 }}
      onBackdropPress={onStaticCloseModal}
      onModalHide={onStaticCloseModal}
      avoidKeyboard
    >
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={onStaticCloseModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onStaticCloseModal}>
              <Image source={ICON_PATH.close1} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <AppText style={styles.txtHeader}>{title}</AppText>
            <View style={{ width: 20, height: 20 }} />
          </View>
          <View>
            <View style={styles.inputWrapper}>
              <Image source={ICON_PATH.search1} style={{ width: 18, height: 18 }} />
              <TextInput
                ref={textinputRef}
                autoFocus
                style={styles.inputContainer}
                value={textSearch}
                onChangeText={onChangeText}
                placeholder={placeholder || 'Tìm kiếm'}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholderTextColor="rgba(36,37,61, 0.4)"
              />
              <View style={{ width: 18, height: 18 }} />
            </View>
          </View>
          <FlatList
            data={resultList}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={{ backgroundColor: '#c5c9ce' }}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </Modal>
  );
};

export default PickerSelector;
