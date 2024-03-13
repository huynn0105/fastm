import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, FlatList, TouchableOpacity } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { useSelector } from 'react-redux';
import { ICON_PATH } from '../../../assets/path';
import { prettyMoneyStringWithoutSymbol } from '../../../utils/Utils';

const ListBankOpen = ({ navigation }) => {
  const [selectedBank, setSelectedBank] = useState(0);
  const itemV2 = useSelector((state) => state.shopV2Items);

  const listBank = itemV2.find((item) => item.cat_alias === 'bank');

  const _listBank = listBank?.items.filter((item) => item?.extra_config?.comm > 0);

  if (!_listBank || _listBank.length === 0) {
    return null;
  }
  _listBank.sort((item1, item2) => {
    return item2?.extra_config?.comm - item1?.extra_config?.comm;
  });

  const renderItem = ({ item, index }) => {
    const isSelected = selectedBank === index;
    return (
      <TouchableOpacity
        style={[
          styles.bankBlock,
          {
            marginLeft: index !== 0 ? SW(12) : 0,
            borderWidth: isSelected ? 1 : 0,
            borderColor: Colors.primary2,
            marginTop: SH(8),
            overflow: 'visible',
          },
        ]}
        onPress={() => setSelectedBank(index)}
      >
        {/* <View style={{ marginTop: SH(8) }}> */}

        {isSelected ? (
          <Image
            source={ICON_PATH.checkbox_ac}
            style={[
              styles.selectButtonStyle,
              {
                width: SW(24),
                height: SW(24),
                resizeMode: 'contain',
                tintColor: Colors.primary2,
                borderWidth: 0,
              },
            ]}
          />
        ) : (
          <TouchableOpacity
            style={{
              width: SW(24),
              height: SW(24),
              borderRadius: SW(12),
              borderColor: Colors.gray3,
              borderWidth: 1,
              position: 'absolute',
              top: -SH(6),
              right: -SW(4),
              // zIndex: 999,
              // overflow: 'visible',
              backgroundColor: Colors.primary5,
            }}
            onPress={() => setSelectedBank(index)}
          ></TouchableOpacity>
        )}
        <Image source={{ uri: item?.extra_config?.iconLogo }} style={styles.iconStyle} />
        {/* </View> */}
        <View style={{ marginTop: SH(12) }}>
          <AppText style={styles.baseTextStyle}>Thu nhập</AppText>
          <AppText
            semiBold
            style={{ fontSize: SH(16), lineHeight: SH(22), color: Colors.secondGreen }}
          >
            {_listBank[index]?.extra_config?.comm
              ? `+${prettyMoneyStringWithoutSymbol(_listBank[index]?.extra_config?.comm * 1000)} đ`
              : ''}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };
  const pressOpenBank = (url, title) => {
    navigation.navigate('WebView', {
      url,
      title,
      mode: 0,
    });
  };
  const renderDescBank = (text) => {
    return (
      <View style={styles.rowView}>
        <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
          <Image source={ICON_PATH.check_success} style={styles.smallIconStyle} />
        </View>
        <View style={{ flex: 0.9, marginLeft: SW(12) }}>
          <AppText style={styles.baseTextStyle}>{text}</AppText>
        </View>
      </View>
    );
  };
  return (
    <View style={{ marginTop: 12 }}>
      <View style={{}}>
        <AppText style={styles.headerTextStyle}>
          Ưu đãi khi mở tài khoản ngân hàng trên MFast
        </AppText>
      </View>
      <FlatList
        data={_listBank}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item?.tag_name}
        showsHorizontalScrollIndicator={false}
        style={{}}
      />
      <View style={styles.footerContainer}>
        <View style={{}}>
          {_listBank?.[selectedBank]?.extra_config?.desc?.map((text) => renderDescBank(text))}
        </View>
        <View style={{ marginTop: SH(8) }}>
          <AppText style={[styles.baseTextStyle, { color: Colors.gray2 }]}>
            {`Lưu ý: Thu nhập sẽ được cộng vào ví MFast sau khi mở tài khoản thành công và thoả các điều kiện của ${_listBank[selectedBank].title}, chi tiết`}
            <AppText
              semiBold
              style={{ color: Colors.primary2 }}
              onPress={() =>
                pressOpenBank(
                  `${_listBank[selectedBank]?.url}?tab=tab-1`,
                  _listBank[selectedBank]?.title,
                )
              }
            >{` Xem tại đây >>`}</AppText>
          </AppText>
        </View>
      </View>
      <View style={{ marginTop: SH(16) }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary2,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 24,
          }}
          onPress={() => {
            pressOpenBank(_listBank[selectedBank]?.url, _listBank[selectedBank]?.title);
          }}
        >
          <AppText
            semiBold
            style={{
              fontSize: SH(16),
              lineHeight: SH(22),
              color: Colors.primary5,
              paddingVertical: SH(13),
            }}
          >{`Mở tài khoản ${_listBank[selectedBank].title}`}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseTextStyle: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray1,
  },
  headerTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray2,
  },
  bankBlock: {
    width: SW(110),
    height: SH(110),
    borderRadius: 8,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
  },
  iconStyle: {
    width: '100%',
    height: '100%',
    maxWidth: SW(74),
    maxHeight: SH(32),
    resizeMode: 'contain',
    marginTop: SH(8),
  },
  footerContainer: {
    marginTop: SH(20),
  },
  rowView: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SH(13),
    alignItems: 'center',
  },
  smallIconStyle: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
  },
  selectButtonStyle: {
    width: SW(24),
    height: SW(24),
    borderRadius: SW(12),
    borderColor: Colors.gray3,
    borderWidth: 1,
    position: 'absolute',
    top: -SH(6),
    right: -SW(4),
    // backgroundColor: Colors.primary5,
  },
});

export default ListBankOpen;
