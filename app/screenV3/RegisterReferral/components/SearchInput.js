import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { memo, useState } from 'react';
import Colors from '../../../theme/Color';
import { useCallback } from 'react';

const SearchInput = memo((props) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <View style={[styles.container, { borderColor: isFocused ? Colors.primary2 : Colors.gray4 }]}>
      <TextInput
        style={styles.input}
        placeholder={'Tìm theo nickname hoặc mã MFast'}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    </View>
  );
});

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: Colors.primary5,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.gray4,
  },
  input: {
    flex: 1,
    padding: 0,
    textAlign: 'center',
    fontSize: 16,
  },
});
