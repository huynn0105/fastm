import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';

const EditNickname = memo((props) => {
  const { insetBottom, value, onEditNickname } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [nickname, setNickname] = useState(value);
  const [isError, setIsError] = useState(false);

  const containerStyle = useMemo(
    () => [styles.container, { paddingBottom: insetBottom + SH(100) }],
    [insetBottom],
  );
  const inputStyle = useMemo(
    () => [
      styles.input,
      { borderColor: isError ? Colors.sixRed : isFocused ? Colors.primary2 : Colors.gray4 },
    ],
    [isError, isFocused],
  );

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const onChangeText = useCallback((text) => {
    setNickname(text?.trim());
  }, []);

  const onSubmitEditing = useCallback(() => {
    if (!isError) {
      onEditNickname?.(nickname);
    }
  }, [isError, nickname, onEditNickname]);

  useEffect(() => {
    setIsError((prev) => {
      const regEx = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      const isErrorTemp =
        !(nickname?.length >= 5 && nickname?.length <= 20) || regEx.test(nickname);
      if (isErrorTemp !== prev) return isErrorTemp;
      return prev;
    });
  }, [nickname]);

  return (
    <View style={containerStyle}>
      <TextInput
        style={inputStyle}
        placeholder={'Nhập nickname'}
        maxLength={20}
        onFocus={onFocus}
        onBlur={onBlur}
        value={nickname}
        onChangeText={onChangeText}
        autoFocus
        onSubmitEditing={onSubmitEditing}
      />
      <AppText style={styles.text}>
        Nickname này sẽ dùng thay cho tên của bạn tại tất cả những nơi hiển thị và tìm kiếm trên
        MFast.
      </AppText>
      <AppText style={[styles.text, { marginTop: 12 }]}>
        {'Lưu ý, nickname '}
        <AppText style={[styles.text, { color: Colors.blue3 }]} semiBold>
          không được bao gồm khoảng trằng,
        </AppText>
        {' và '}
        <AppText style={[styles.text, { color: Colors.blue3 }]} semiBold>
          độ dài từ 5 đến 20 ký tự.
        </AppText>
      </AppText>
    </View>
  );
});

export default EditNickname;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    padding: 0,
    borderWidth: 1,
    height: 48,
    borderRadius: 32,
    backgroundColor: Colors.primary5,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.gray5,
    marginTop: 20,
  },
});
