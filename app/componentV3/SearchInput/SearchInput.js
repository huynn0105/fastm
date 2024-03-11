import { Image, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Colors from '../../theme/Color';
import { ICON_PATH } from '../../assets/path';
import { SH } from '../../constants/styles';

const SearchInput = memo(
  forwardRef((props, ref) => {
    const {
      containerStyle,
      style,
      onFocus,
      onBlur,
      onChangeText,
      value,
      editable = true,
      onSubmitEditing,
      ...rest
    } = props;

    const [text, setText] = useState(value);
    const [isFocusInput, setIsFocusInput] = useState(false);
    const inputRef = useRef();

    const onInputFocus = useCallback(() => {
      setIsFocusInput(true);
      onFocus?.();
    }, [onFocus]);
    const onInputBlur = useCallback(() => {
      setIsFocusInput(false);
      onBlur?.();
    }, [onBlur]);
    const _onChangeText = useCallback(
      (_text) => {
        setText(_text);
        onChangeText?.(_text);
      },
      [onChangeText],
    );
    const onClearInput = useCallback(() => {
      _onChangeText('');
      inputRef?.current?.clear();
    }, [_onChangeText]);

    const _onSubmitEditing = useCallback(() => {
      onSubmitEditing?.(text);
    }, [onSubmitEditing, text]);

    useImperativeHandle(ref, () => inputRef);

    useEffect(() => {
      setText(value);
    }, [value]);

    return (
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocusInput ? Colors.primary2 : Colors.primary5,
          },
        ].concat(containerStyle)}
      >
        <Image source={ICON_PATH.search3} style={styles.iconSearch} />
        <TextInput
          {...rest}
          value={text}
          ref={inputRef}
          style={[styles.input].concat(style)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onChangeText={_onChangeText}
          editable={editable}
          autoCorrect={false}
          onSubmitEditing={_onSubmitEditing}
        />
        {(text?.length > 0 || value?.length > 0) && editable ? (
          <TouchableWithoutFeedback onPress={onClearInput}>
            <View>
              <Image source={ICON_PATH.close4} style={{ width: 20, height: 20, margin: 5 }} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }),
);

export default SearchInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.primary5,
    paddingLeft: 12,
    paddingRight: 6,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 14,
    height: 44,
  },
  iconSearch: {
    width: 20,
    height: 20,
    tintColor: Colors.gray5,
    marginRight: 12,
  },
});
