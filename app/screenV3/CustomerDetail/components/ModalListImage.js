import {
  FlatList,
  Image,
  LayoutAnimation,
  Share,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { getTimeBetween } from '../../../utils/dateHelper';
import { SH, SW } from '../../../constants/styles';
import { ICON_PATH } from '../../../assets/path';
import BottomActionSheet from '../../../components2/BottomActionSheet';
import moment from 'moment';
import { IS_ANDROID, SCREEN_WIDTH } from '../../../utils/Utils';
import ImageUtils from '../../../utils/ImageUtils';
import { showAlert, showDevAlert } from '../../../utils/UIUtils';
import Indicator from '../../../componentV3/Indicator/Indicator';
import AutoHeightImage from '../../../componentV3/AutoHeightImage/AutoHeightImage';
import FastImage from 'react-native-fast-image';

const ModalListImage = memo(
  forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    const [listImage, setListImage] = useState([]);
    const [imageSelect, setImageSelect] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const bottomSheet = useRef();

    const renderImage = useCallback((image, index, images) => {
      const isShowFullWidth = images?.length <= 1;
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            setImageSelect(image);
          }}
        >
          <View
            style={[
              {
                width: isShowFullWidth ? '100%' : '50%',
                height: isShowFullWidth ? 228 : 112,
                marginTop: 8,
              },
              !isShowFullWidth && {
                paddingLeft: index % 2 === 0 ? 0 : 4,
                paddingRight: index % 2 === 0 ? 4 : 0,
              },
            ]}
          >
            <FastImage
              source={{ uri: image }}
              style={{
                flex: 1,
                borderRadius: 8,
                backgroundColor: Colors.gray4,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }, []);

    const renderItem = useCallback(
      ({ item }) => {
        return (
          <>
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
              {getTimeBetween(moment(item?.date).valueOf())}
            </AppText>
            <View
              style={{ flexWrap: 'wrap', marginTop: 4, marginBottom: 24, flexDirection: 'row' }}
            >
              {item?.image?.map(renderImage)}
            </View>
          </>
        );
      },
      [renderImage],
    );
    const keyExtractor = useCallback((item) => {
      return item?.id;
    }, []);

    useImperativeHandle(ref, () => ({
      ...bottomSheet.current,
      open: (_listImage, _imageSelected) => {
        setListImage(_listImage);
        setImageSelect(_imageSelected);
        bottomSheet?.current?.open();
      },
    }));

    return (
      <BottomActionSheet
        ref={bottomSheet}
        render={() => (
          <>
            <HeaderBottomSheet
              title={imageSelect ? imageSelect?.split('/').pop() : 'Hình ảnh hồ sơ đi kèm'}
              iconRight={ICON_PATH.close1}
              iconLeft={imageSelect && ICON_PATH.arrowLeft}
              onPressLeft={() => setImageSelect()}
              onPressRight={() => {
                bottomSheet?.current?.close();
              }}
            />

            <View
              style={[
                styles.container,
                {
                  paddingBottom: insets.bottom,
                },
                imageSelect && { position: 'absolute', zIndex: -10, opacity: 0 },
              ]}
            >
              <FlatList
                data={listImage}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
              />
            </View>
            {imageSelect ? (
              <View
                style={{
                  width: '100%',
                  backgroundColor: Colors.neutral5,
                  zIndex: 999,
                }}
              >
                <AutoHeightImage
                  source={{
                    uri: imageSelect,
                  }}
                  style={{
                    borderRadius: 8,
                    margin: 24,
                  }}
                  maxHeight={SH(600)}
                  width={SCREEN_WIDTH - 24 * 2}
                />
                <View
                  style={{
                    backgroundColor: Colors.primary5,
                    paddingBottom: insets.bottom + 12,
                    flexDirection: 'row',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    paddingTop: 12,
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Share.share(
                        IS_ANDROID
                          ? {
                              title: 'Hình ảnh',
                              message: imageSelect,
                            }
                          : {
                              url: imageSelect,
                            },
                      );
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                      }}
                    >
                      <Image
                        source={ICON_PATH.send}
                        style={{ width: 28, height: 28, marginRight: 4 }}
                      />

                      <AppText
                        style={{ fontSize: 16, lineHeight: 22, color: Colors.primary2 }}
                        medium
                      >
                        Chia sẻ
                      </AppText>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setIsLoading(true);
                      ImageUtils.mSaveToCameraRoll(imageSelect)
                        .then((doneDownload) => {
                          showAlert('Lưu hình thành công');
                        })
                        .catch((error) => {
                          showAlert('Lưu hình thất bại');
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                      }}
                    >
                      <View>
                        <Image
                          source={ICON_PATH.download3}
                          style={{ width: 28, height: 28, marginRight: 4 }}
                        />
                        {isLoading ? (
                          <View
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: Colors.primary5,
                            }}
                          >
                            <Indicator color={Colors.primary2} />
                          </View>
                        ) : null}
                      </View>
                      <AppText
                        style={{ fontSize: 16, lineHeight: 22, color: Colors.primary2 }}
                        medium
                      >
                        Tải về máy
                      </AppText>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            ) : null}
          </>
        )}
        canClose={true}
        avoidKeyboard
        haveCloseButton
      />
    );
  }),
);

export default ModalListImage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: 16,
    paddingHorizontal: 16,
    height: SH(600),
  },
});

const HeaderBottomSheet = ({ title, onPressLeft, iconLeft, onPressRight, iconRight }) => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 46,
        overflow: 'hidden',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        flexDirection: 'row',
      }}
    >
      <TouchableOpacity
        style={{
          width: SW(48),
          paddingLeft: SW(16),
        }}
        onPress={onPressLeft}
      >
        <Image
          source={iconLeft}
          style={{
            width: SW(22),
            height: SH(22),
            resizeMode: 'contain',
            // backgroundColor: 'blue',
          }}
        />
      </TouchableOpacity>
      <AppText
        medium
        style={{
          color: Colors.gray2,
          fontSize: 14,
          lineHeight: 20,
          maxWidth: SW(220),
        }}
        numberOfLines={1}
        ellipsizeMode={'middle'}
      >
        {title}
      </AppText>
      <TouchableOpacity
        style={{ opacity: iconRight ? 1 : 0, paddingHorizontal: SW(16), width: SW(48) }}
        onPress={onPressRight}
      >
        {iconRight ? (
          <Image
            source={iconRight}
            style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
