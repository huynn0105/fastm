import {
  FlatList,
  Image,
  LayoutAnimation,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import AppText from '../AppText';
import Colors from '../../theme/Color';
import FastImage from 'react-native-fast-image';
import { ICON_PATH } from '../../assets/path';
import { isDeepLink, IS_IOS, SCREEN_HEIGHT } from '../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { homeNavigate, openLogin } from '../../redux/actions/navigation';
import { getParams } from '../../utils/getParams';
import { SH, SW } from '../../constants/styles';
import SearchInput from '../SearchInput/SearchInput';
import { useKeyboard } from '@react-native-community/hooks';
import { MainButtonPath } from '../../components2/MainTabbarButton';

const ListReferralProduct = memo((props) => {
  const { onCloseModal, customer, navigation, onPressProduct, ...rest } = props;
  const dispatch = useDispatch();
  const keyboard = useKeyboard();

  const listMainProduct = useSelector((state) => state?.mtradeReducer?.listMainProduct);
  const isLoggedIn = useSelector((state) => state?.myUser?.isLoggedIn);

  const [product, setProduct] = useState({});
  const [textSearchProduct, setTextSearchProduct] = useState('');

  const isSameText = useCallback((text1, text2) => {
    const text1Lower = text1
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const text2Lower = text2
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return text1Lower.includes(text2Lower) || text2Lower.includes(text1Lower);
  }, []);

  const listProduct = useMemo(() => {
    let list;
    if (textSearchProduct?.length) {
      list = product?.data?.filter(
        (item) =>
          (item?.projectName && isSameText(item?.projectName, textSearchProduct)) ||
          (item?.projectDescription && isSameText(item?.projectDescription, textSearchProduct)),
      );
    } else {
      list = product?.data?.slice(0, 4);
    }

    return list || [];
  }, [isSameText, product?.data, textSearchProduct]);

  const isProductDetail = useMemo(() => product && Object.keys(product)?.length > 0, [product]);

  const onClearProduct = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        100,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setTextSearchProduct('');
    setProduct({});
  }, []);

  const renderListEmpty = useCallback(() => {
    if (listProduct?.length) return null;
    return (
      <View style={styles.listEmptyContainer}>
        <Image style={styles.listEmptyIcon} source={ICON_PATH.block} />
        <AppText style={styles.listEmptyText}>{'Không tìm thấy sản phẩm'}</AppText>
      </View>
    );
  }, [listProduct?.length]);

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{
          height: 48,
          backgroundColor: '#fff',
          width: '100%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText medium style={{ fontSize: 16, lineHeight: 22, color: Colors.gray5 }}>
          {product?.requirementTitle || 'Khách hàng của bạn cần gì?'}
        </AppText>
        {isProductDetail ? (
          <TouchableWithoutFeedback onPress={onClearProduct}>
            <View style={styles.buttonBackContainer}>
              <Image style={styles.headerIcon} source={ICON_PATH.arrowLeft} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        <TouchableWithoutFeedback onPress={onCloseModal}>
          <View style={styles.buttonPathContainer}>
            <MainButtonPath />
            <Image
              source={ICON_PATH.arrow_down}
              style={{
                position: 'absolute',
                width: 14,
                height: 14,
                resizeMode: 'contain',
                top: 3,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [isProductDetail, onClearProduct, onCloseModal, product?.requirementTitle]);

  const keyExtractor = useCallback((item) => item?.id || item?.ID, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            let dataRequirements;

            if (customer?.requirements?.length) {
              dataRequirements = customer?.requirements?.find(
                (it) => it?.requirementID === item?.requirementID,
              );
            } else if (item?.requirementURL) {
              dataRequirements = {
                requirementID: item?.requirementID,
                requirementURL: item?.requirementURL,
                requirementTitle: item?.requirementTitle,
              };
            }

            if (dataRequirements) {
              onCloseModal?.();
              if (isDeepLink(dataRequirements?.requirementURL)) {
                if (isLoggedIn || dataRequirements?.requirementID == 2) {
                  Linking.openURL(dataRequirements?.requirementURL);
                } else {
                  dispatch(openLogin());
                }
              } else {
                dispatch(
                  homeNavigate('WebView', {
                    mode: 0,
                    title: dataRequirements?.requirementTitle,
                    url: dataRequirements?.requirementURL,
                  }),
                );
              }
            } else {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  100,
                  LayoutAnimation.Types.easeInEaseOut,
                  LayoutAnimation.Properties.opacity,
                ),
              );
              setProduct(item);
            }
          }}
        >
          <View style={styles.itemDefaultContainer}>
            <Image
              resizeMode="contain"
              source={{ uri: item?.requirementImage }}
              style={{ width: 32, height: 32 }}
            />
            <AppText medium style={styles.itemDefaultTitle}>
              {item?.requirementTitle}
            </AppText>
            <Image source={ICON_PATH.arrow_down} style={styles.iconArrow} />
            {index ? <View style={styles.line} /> : null}
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [dispatch, isLoggedIn, onCloseModal],
  );

  const onPressItem = useCallback(
    (item) => {
      if (item?.link_share) {
        Share.share({
          message: `Xin chào, vui lòng vào liên kết sau để tải và cài đặt ${item?.projectName} ${item?.link_share}`,
          title: item?.name,
        });
      } else if (item?.linkWebView || item?.webviewURL) {
        onPressProduct?.();
        let params;
        if (customer) {
          params = getParams({
            fullName: customer?.fullName,
            idNumber: customer?.idNumber,
            mobilePhone: customer?.mobilePhone,
            districtID: customer?.district,
            pcli_id: customer?.ID,
            accept_term: '1',
          });
        }
        console.log(`\u001B[34m -> file: ListReferralProduct.js:183 -> params:`, params);

        const url = item?.linkWebView || item?.webviewURL;

        navigation?.navigate('WebView', {
          mode: 0,
          url: `${url}${params ? `${url?.includes('?') ? '&' : '?'}${params}` : ''}`,
          title: item?.projectDescription,
        });
      }
      //   onSaveItemToHistory(item);
    },
    [customer, navigation, onPressProduct],
  );

  const renderItemProduct = useCallback(
    ({ item, index }) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            onPressItem(item);
          }}
        >
          <View style={styles.itemPlContainer}>
            <Image source={{ uri: item?.iconURL }} style={styles.itemPlIcon} />
            <AppText style={styles.itemPlTitle}>{item?.projectDescription}</AppText>
            <Image source={ICON_PATH.arrow_down} style={styles.iconArrow} />
            {index ? <View style={styles.lineProduct} /> : null}
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [onPressItem],
  );

  return (
    <View
      style={[
        {
          flexGrow: 1,
        },
        isProductDetail
          ? {
              height:
                (keyboard.keyboardShown && IS_IOS ? keyboard.keyboardHeight : 0) +
                (IS_IOS ? SCREEN_HEIGHT * 0.42 : SCREEN_HEIGHT * 0.44),
              paddingBottom: keyboard.keyboardShown && IS_IOS ? keyboard.keyboardHeight : 0,
            }
          : { maxHeight: SCREEN_HEIGHT * 0.4 },
      ]}
    >
      {renderHeader()}
      {isProductDetail ? (
        <View style={styles?.listProductContainer}>
          <FlatList
            {...rest}
            data={listProduct}
            keyExtractor={keyExtractor}
            renderItem={renderItemProduct}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderListEmpty}
          />
          <View style={styles.inputSearch}>
            <SearchInput onChangeText={setTextSearchProduct} placeholder={'Tìm sản phẩm khác'} />
          </View>
        </View>
      ) : (
        <FlatList
          {...rest}
          data={listMainProduct}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
});

export default ListReferralProduct;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 30,
  },
  itemDefaultContainer: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemDefaultTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary2,
    lineHeight: 22,
    marginLeft: 16,
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
    // width: SW(343),
    top: -0.5,
    height: 1,
    backgroundColor: Colors.primary5,
    position: 'absolute',
    left: 64,
    right: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.primary3,
  },
  buttonPathContainer: {
    position: 'absolute',
    top: -15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBackContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  itemPlContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
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
  lineProduct: {
    top: -0.5,
    height: 1,
    left: 0,
    right: 0,
    backgroundColor: Colors.gray4,
    position: 'absolute',
  },
  listProductContainer: {
    flex: 1,
    paddingBottom: 30,
  },
  inputSearch: {
    height: 44,
    marginTop: 2,
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
});
