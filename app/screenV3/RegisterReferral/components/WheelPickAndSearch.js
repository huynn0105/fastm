import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import WheelPick from '../../Collaborator/common/WheelPick';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';

const WheelPickAndSearch = memo((props) => {
  const { data, initIdSelected, searchStyle, ...rest } = props;

  const [dataState, setDataState] = useState(data);
  const [initIdSelectedState, setInitIdSelectedState] = useState(initIdSelected);

  const isEqualTextSearch = useCallback((text, text2) => {
    const textFormat = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const text2Format = text2
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    return textFormat?.includes(text2Format) || text2Format?.includes(textFormat);
  }, []);

  const onChangeText = useCallback(
    (text) => {
      if (!text?.length) {
        setDataState(data);
        setInitIdSelectedState(data?.[0]?.id);
        return;
      }
      setDataState((prev) => {
        const newData = data?.filter((item) => isEqualTextSearch(item?.title, text));
        if (prev?.length !== newData?.length) {
          setInitIdSelectedState(newData?.[0]?.id);
        }
        return newData;
      });
    },
    [data, isEqualTextSearch],
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image source={ICON_PATH.search3} style={{ width: 20, height: 20 }} />
        <TextInput
          placeholder="Nhập ký tự kiếm"
          style={styles.input}
          textAlign={'center'}
          onChangeText={onChangeText}
        />
      </View>
      <WheelPick
        data={dataState}
        initIdSelected={initIdSelectedState}
        viewEmpty={
          <View style={styles.emptyContainer}>
            <AppText style={styles.textEmpty}>Không có dữ liệu</AppText>
          </View>
        }
        {...rest}
      />
    </View>
  );
});

export default WheelPickAndSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 24,
    paddingHorizontal: 12,
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.primary5,
  },
  input: {
    marginHorizontal: 12,
    height: 40,
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
  },
  emptyContainer: {
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEmpty: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray5,
    marginTop: 20,
  },
});
