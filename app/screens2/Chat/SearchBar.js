import React, { forwardRef } from 'react';
import { ActivityIndicator, Image, StyleSheet, TextInput, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const SearchBarChat = forwardRef((props, ref) => {
  const { onSearchTextChanged, placeholder, onFocusing, loading, style } = props;
  return (
    <View
      style={[
        {
          height: SH(40),
          // marginRight: 55,
          marginLeft: SW(16),
          alignItems: 'center',
          backgroundColor: Colors.primary5,
          flexDirection: 'row',
          borderRadius: SW(20),
          flex: 1,
        },
        style,
      ]}
    >
      <Image source={ICON_PATH.search3} style={{ marginHorizontal: SW(14) }} />
      <TextInput
        ref={ref}
        style={{ flex: 1, fontSize: SH(14), lineHeight: SH(16) }}
        placeholder={placeholder}
        onChangeText={onSearchTextChanged}
        onFocus={onFocusing}
      />
      {loading && (
        <ActivityIndicator
          animating
          color="#404040"
          size="small"
          style={{ position: 'absolute', right: SW(12) }}
        />
      )}
    </View>
  );
});

export default SearchBarChat;

const styles = StyleSheet.create({});
