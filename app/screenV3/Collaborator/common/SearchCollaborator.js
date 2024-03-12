import { Image, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import { debounce } from 'lodash';
import { SH } from '../../../constants/styles';

const SearchCollaborator = memo((props) => {
  const { onChangeText, value } = props;
  const [text, setText] = useState('');
  const inputRef = useRef();
  const debounceChangeText = debounce((_text) => {
    setText(_text);
    onChangeText(_text);
  }, 1000);

  const onClearInput = useCallback(() => {
    setText('');
    inputRef?.current?.clear();
    onChangeText?.('');
  }, [onChangeText]);

  useEffect(() => {
    setText((prev) => {
      if (value !== prev) {
        inputRef?.current?.setNativeProps({
          text: value,
        });
        return value;
      }
      return prev;
    });
  }, [value]);

  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={ICON_PATH.search3} />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={'Tìm theo Nickname hoặc Số điện thoại'}
        onChangeText={debounceChangeText}
      />
      {text?.length > 0 ? (
        <TouchableWithoutFeedback onPress={onClearInput}>
          <View>
            <Image source={ICON_PATH.close4} style={styles.iconSearch} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
});

export default SearchCollaborator;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 36,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.primary5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    padding: 0,
    paddingLeft: 14,
  },
  iconSearch: { width: 20, height: 20, margin: SH(5) },
});
