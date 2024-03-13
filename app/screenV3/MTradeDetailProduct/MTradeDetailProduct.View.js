import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

import { View, ScrollView, Linking, Image } from 'react-native';
import styles from './MTradeDetailProduct.styles';
import LoadingModal from '../../componentV3/LoadingModal';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import BannerMTrade from '../MTrade/common/BannerMTrade';
import ProductInfo from './common/ProductInfo.View';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  addMTradeCard,
  getMTradeCode,
  getMTradeDetailProduct,
  getMTradeDetailProductByAttribute,
} from '../../redux/actions/actionsV3/mtradeAction';
import ItemAttribute from './common/ItemAttribute';
import { formatNumber, isDeepLink, SCREEN_WIDTH } from '../../utils/Utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ItemContest from './common/ItemContest';
import { isArray } from 'lodash';
import ModalImageProduct from './common/ModalImageProduct';
import ModalMTradeMessage from '../MTrade/common/ModalMTradeMessage';
import { IMAGE_PATH } from '../../assets/path';
import { homeNavigate } from '../../redux/actions/navigation';

const MTradeDetailProduct = (props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const imageProductRef = useRef();
  const mtradeMessageRef = useRef();

  const productDefault = useMemo(
    () => navigation?.state?.params?.product,
    [navigation?.state?.params?.product],
  );

  const mtradeCode = useSelector((state) => state?.mtradeReducer?.mtradeCode);
  const urlMPL = useSelector((state) => state?.appInfo?.urlMPL);
  const location = useSelector((state) => state?.mtradeReducer?.location);

  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState(productDefault);
  const [detailProduct, setDetailProduct] = useState({});

  const [options, setOptions] = useState([]);

  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isLoadingSKU, setIsLoadingSKU] = useState(false);

  const isDisabledButton = useMemo(() => {
    const disabled = isLoadingSKU || !detailProduct?.sku;

    return disabled;
  }, [detailProduct?.sku, isLoadingSKU]);

  const images = useMemo(
    () =>
      detailProduct?.productImg?.length
        ? detailProduct?.productImg?.map((url) => ({ url }))
        : product?.productImg?.length
        ? product?.productImg?.map((url) => ({ url }))
        : [{ url: productDefault?.image }],
    [detailProduct?.productImg, product?.productImg, productDefault?.image],
  );

  const onGetDetailProductData = useCallback(
    (option, oldOption) => {
      setIsLoadingSKU(true);
      const payload = { productID: product?.productID, option };
      dispatch(
        getMTradeDetailProductByAttribute(payload, (isSuccess, result) => {
          if (isSuccess) {
            setDetailProduct(result);
          } else {
            setOptions(oldOption);
          }
          setIsLoadingSKU(false);
        }),
      );
    },
    [dispatch, product?.productID],
  );

  const onPressItemAttribute = useCallback(
    (item, subItem) => {
      setOptions((prevState) => {
        let newState = [...prevState];
        newState = newState.filter((_item) => {
          return _item[0] != item?.value;
        });
        newState = [[item?.value, subItem?.value], ...newState];
        onGetDetailProductData(newState, prevState);
        return newState;
      });
    },
    [onGetDetailProductData],
  );

  const renderItemAttribute = useCallback(
    (item, index) => {
      const valueSelected = options?.find((_item) => _item[0] == item?.value)?.[1];
      return (
        <ItemAttribute
          key={index}
          item={item}
          valueSelected={valueSelected}
          onPressItem={onPressItemAttribute}
        />
      );
    },
    [onPressItemAttribute, options],
  );

  const renderItemContest = useCallback((item, index) => {
    return <ItemContest key={index} item={item} />;
  }, []);

  const onPressBanner = useCallback((item, index) => {
    imageProductRef?.current?.open(index);
  }, []);

  const showMessageRegisterMTradeCode = useCallback(
    (result) => {
      mtradeMessageRef?.current?.open({
        image: IMAGE_PATH.mascotStudy,
        titleColor: Colors.sixOrange,
        title: 'Chưa thể bán hàng lúc này',
        content:
          result ||
          mtradeCode?.message ||
          'Rất tiếc, bạn chưa được cấp nghiệp vụ bán hàng cho các dòng sản phẩm này.',
        actions: [
          {
            title: 'Đăng ký nghiệp vụ ngay',
            onPress: () => {
              const url = mtradeCode?.url;
              mtradeMessageRef?.current?.close();
              requestAnimationFrame(() => {
                if (url) {
                  if (isDeepLink(mtradeCode?.url)) {
                    Linking.openURL(url);
                  } else {
                    dispatch(
                      homeNavigate('WebView', { mode: 0, title: 'Ứng tuyển nghiệp vụ', url }),
                    );
                  }
                }
              });
            },
          },
        ],
      });
    },
    [dispatch, mtradeCode?.message, mtradeCode?.url],
  );

  const showMessageDuplicateCard = useCallback(() => {
    mtradeMessageRef?.current?.open({
      image: IMAGE_PATH.mascotLoudspeaker,
      titleColor: Colors.blue3,
      title: 'Sản phẩm đã có trong giỏ hàng',
      content:
        mtradeCode?.message ||
        'Vui lòng truy cập vào giỏ hàng để tiến hành thanh toán trả ngay cho sản phẩm này',
      actions: [
        {
          title: 'Quay lại',
          type: 'cancel',
          onPress: () => {
            mtradeMessageRef?.current?.close();
          },
        },
        {
          title: 'Xem giỏ hàng',
          onPress: () => {
            mtradeMessageRef?.current?.close();
            requestAnimationFrame(() => {
              navigation?.navigate('MTradeCard');
            });
          },
        },
      ],
    });
  }, [mtradeCode?.message, navigation]);

  const showMessageError = useCallback(
    (message, onPress = () => mtradeMessageRef?.current?.close()) => {
      mtradeMessageRef?.current?.open({
        image: IMAGE_PATH.mascotError,
        titleColor: Colors.sixRed,
        title: 'Đã xảy ra lỗi',
        content: message || 'Đã xảy ra lỗi, vui lòng thử lại',
        actions: [
          {
            title: 'Quay lại',
            type: 'cancel',
            onPress: onPress,
          },
        ],
      });
    },
    [],
  );

  const renderContentSuccess = useCallback(
    (item) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              width: 87,
              height: 87,
              borderRadius: 8,
              backgroundColor: Colors.neutral5,
              padding: 10,
              marginRight: 16,
            }}
          >
            <Image style={{ flex: 1 }} source={{ uri: item?.image }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
              {item?.name}
            </AppText>

            {product?.attribute?.map((_item) => {
              const valueSelected = options?.find((it) => it[0] == _item?.value)?.[1];

              return (
                <AppText
                  style={{ fontSize: 13, lineHeight: 18, color: Colors.gray5, marginTop: 4 }}
                >
                  {_item?.name}:
                  <AppText
                    style={{ fontSize: 13, lineHeight: 18, color: Colors.gray1 }}
                  >{`   ${valueSelected}`}</AppText>
                </AppText>
              );
            })}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <AppText style={{ fontSize: 16, lineHeight: 22, color: Colors.gray1 }} medium>
                {formatNumber(item?.price)} đ
              </AppText>
              {item?.comparePrice ? (
                <AppText
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    color: Colors.gray5,
                    textDecorationLine: 'line-through',
                  }}
                >
                  {formatNumber(item?.comparePrice)} đ
                </AppText>
              ) : null}
            </View>
          </View>
        </View>
      );
    },
    [options, product?.attribute],
  );

  const showMessageSuccess = useCallback(
    (item, onPress = () => mtradeMessageRef?.current?.close()) => {
      mtradeMessageRef?.current?.open({
        image: IMAGE_PATH.mascotSuccess,
        titleColor: Colors.green5,
        title: 'Sản phẩm đã được thêm vào giỏ hàng chỉ chờ bạn thanh toán',
        renderContent: () => renderContentSuccess(item),
        actions: [
          {
            title: 'Quay lại',
            type: 'cancel',
            onPress: () => {
              mtradeMessageRef?.current?.close();
            },
          },
          {
            title: 'Xem giỏ hàng',
            onPress: () => {
              mtradeMessageRef?.current?.close();
              requestAnimationFrame(() => {
                navigation?.navigate('MTradeCard');
              });
            },
          },
        ],
      });
    },
    [navigation, renderContentSuccess],
  );

  const onAddCard = useCallback(() => {
    const payload = {
      productID: product?.productID,
      quantity: 1,
      sku: detailProduct?.sku,
      code: product?.code,
      provinceCode: location,
    };

    setIsShowLoading(true);
    dispatch(
      addMTradeCard(payload, (isSuccess, result, errorCode) => {
        if (isSuccess) {
          showMessageSuccess(result);
        } else {
          switch (errorCode) {
            case 'projectCode':
              showMessageRegisterMTradeCode(result);
              break;
            case 'duplication':
              showMessageDuplicateCard(result);
              break;
            default:
              showMessageError(result);
          }
        }
        setIsShowLoading(false);
      }),
    );
  }, [
    product?.productID,
    product?.code,
    detailProduct?.sku,
    location,
    dispatch,
    showMessageSuccess,
    showMessageRegisterMTradeCode,
    showMessageDuplicateCard,
    showMessageError,
  ]);

  const onPayNow = useCallback(() => {
    if (mtradeCode?.status) {
      onAddCard();
    } else {
      showMessageRegisterMTradeCode();
    }
  }, [mtradeCode?.status, onAddCard, showMessageRegisterMTradeCode]);

  const onPayLater = useCallback(() => {
    console.log(`\u001B[34m -> file: MTradeDetailProduct.View.js:340 -> mtradeCode:`, mtradeCode);
    if (mtradeCode?.status) {
      const url = `${urlMPL}/profile?productID=${product?.productID}&sku=${detailProduct?.sku}`;
      navigation?.navigate('WebView', {
        mode: 0,
        title: 'Bán hàng trả chậm',
        url,
      });
    } else {
      showMessageRegisterMTradeCode();
    }
  }, [
    detailProduct?.sku,
    mtradeCode?.status,
    navigation,
    product?.productID,
    showMessageRegisterMTradeCode,
    urlMPL,
  ]);

  const onGetData = useCallback(() => {
    setIsShowLoading(true);
    dispatch(
      getMTradeDetailProduct(productDefault?.code, (isSuccess, result) => {
        if (isSuccess) {
          if (result?.detailProduct) {
            if (result?.detailProduct?.option) {
              setOptions(result?.detailProduct?.option);
              delete result.detailProduct.option;
            }
            setDetailProduct(result?.detailProduct);
            delete result.detailProduct;
          }
          setProduct((prevState) => ({ ...prevState, ...result }));
        } else {
          showMessageError(result, () => {
            navigation?.goBack();
          });
        }
        setIsShowLoading(false);
      }),
    );
  }, [dispatch, navigation, productDefault?.code, showMessageError]);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    let subscription;
    if (!mtradeCode?.status) {
      subscription = navigation.addListener('didFocus', () => {
        dispatch(getMTradeCode());
      });
    }
    return () => {
      subscription?.remove();
    };
  }, [dispatch, mtradeCode?.status, navigation]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.wrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <BannerMTrade
            data={images}
            onPressItem={onPressBanner}
            sliderHeight={SCREEN_WIDTH}
            itemHeight={SCREEN_WIDTH}
          />
          {product?.name ? (
            <AppText semiBold style={styles.titleText}>
              {product?.name}
            </AppText>
          ) : null}
          {product?.descShort ? (
            <AppText style={styles.discriptionText}>{product?.descShort}</AppText>
          ) : null}
          {isArray(product?.contest) ? product?.contest?.map(renderItemContest) : null}
          <DashedHorizontal size={2} color={Colors.gray4} style={styles.dash} />
          {isArray(product?.attribute) ? product?.attribute?.map(renderItemAttribute) : null}
          <DashedHorizontal size={2} color={Colors.gray4} style={styles.dash} />
          <View style={styles.costWrapper}>
            <View style={styles.priceWrapper}>
              <AppText style={styles.infoTitle}>Giá bán</AppText>
              <AppText bold style={styles.priceValue}>
                {formatNumber(detailProduct?.price || product?.price)} đ
              </AppText>
              {product?.comparePrice ? (
                <AppText style={styles.originalPrice}>
                  {formatNumber(product?.comparePrice)} đ
                </AppText>
              ) : null}
            </View>
            <View style={styles.columnDivider}></View>
            <View style={styles.commissionWrapper}>
              <AppText style={styles.infoTitle}>Thu nhập bán hàng</AppText>
              {detailProduct?.payLater || product?.payLater ? (
                <AppText bold style={styles.commissionValue}>
                  {formatNumber(
                    detailProduct?.payLater?.comm?.value || product?.payLater?.comm?.value,
                  )}
                  {detailProduct?.payLater?.comm?.currency || product?.payLater?.comm?.currency}{' '}
                  <AppText semiBold>khi trả chậm</AppText>
                </AppText>
              ) : null}
              {detailProduct?.payNow || product?.payNow ? (
                <AppText bold style={styles.commissionValue}>
                  {formatNumber(detailProduct?.payNow?.comm?.value || product?.payNow?.comm?.value)}
                  {detailProduct?.payNow?.comm?.currency || product?.payNow?.comm?.currency}{' '}
                  <AppText semiBold>khi trả ngay</AppText>
                </AppText>
              ) : null}
            </View>
          </View>
          {product?.payLater ? (
            <View style={styles.paylaterWrapper}>
              <View style={styles.paylaterTimeWrapper}>
                <AppText style={styles.infoTitle}>Thời hạn trả chậm</AppText>
                <AppText bold style={styles.paylaterTimeValue}>
                  {product?.payLater?.tenorMin === product?.payLater?.tenorMax
                    ? product?.payLater?.tenorMax
                    : `${product?.payLater?.tenorMin} - ${product?.payLater?.tenorMax}`}{' '}
                  tháng
                </AppText>
              </View>
              <View style={{ width: 6 }}></View>
              <View style={styles.interestRateWrapper}>
                <AppText style={styles.infoTitle}>Lãi suất trả chậm</AppText>
                <AppText bold style={styles.interestRateValue}>
                  {formatNumber(product?.payLater?.interestRate)}% / năm
                </AppText>
              </View>
            </View>
          ) : null}
          <DashedHorizontal size={2} color={Colors.gray4} style={styles.dash} />
          <ProductInfo data={product?.description || []} />
        </View>
      </ScrollView>
      <View style={[styles.buttonWrapper, { paddingBottom: insets?.bottom || 10 }]}>
        {detailProduct?.product_invalid || product?.product_invalid ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <AppText style={{ color: Colors.primary5, opacity: 0.8 }}>
              {detailProduct?.quantity == '0' ? 'Sản phẩm hết hàng' : 'Sản phẩm đang tạm ngưng bán'}
            </AppText>
          </View>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <SubmitButton
                label={'Trả ngay'}
                customStyle={styles.buttonPayNow}
                labelStyle={styles.buttonPayNowLabel}
                onPress={onPayNow}
                disabled={isDisabledButton || !product?.payNow?.comm}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <SubmitButton
                label={'Trả chậm'}
                customStyle={styles.buttonPayLater}
                labelStyle={styles.buttonPayLaterLabel}
                disableLabelStyle={styles.disable}
                onPress={onPayLater}
                disabled={isDisabledButton || !product?.payLater?.comm}
              />
            </View>
          </>
        )}
      </View>
      <ModalImageProduct ref={imageProductRef} images={images} />
      <ModalMTradeMessage ref={mtradeMessageRef} />
      <LoadingModal visible={isShowLoading} />
    </View>
  );
};

export default MTradeDetailProduct;
