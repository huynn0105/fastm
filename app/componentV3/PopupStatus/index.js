import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import { TYPE_MODAL } from '../../screenV3/RSMPushMessage/RSMPushMessage.View';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const PopupStatus = memo(
  forwardRef((props, ref) => {
    const [data, setData] = useState(props);

    useEffect(() => {
      setData(props);
    }, [props]);

    const [isVisible, setIsVisible] = useState(false);

    const open = useCallback((params) => {
      if (params) {
        setData(params);
      }
      setIsVisible(true);
    }, []);

    const close = useCallback(() => {
      setIsVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const renderImage = useMemo(() => {
      switch (data?.type) {
        case TYPE_MODAL.SUCCESS: {
          return (
            <Image
              source={ICON_PATH.statusSuccess}
              style={styles.imageStyle}
              resizeMode={'contain'}
            />
          );
        }
        case TYPE_MODAL.WARNING: {
          return (
            <Image source={ICON_PATH.warning2} style={styles.imageStyle} resizeMode={'contain'} />
          );
        }
        case TYPE_MODAL.WARNING2: {
          return (
            <Image source={ICON_PATH.iconBell2} style={styles.imageStyle} resizeMode={'contain'} />
          );
        }
        case TYPE_MODAL.LOADING: {
          return (
            <Image
              source={ICON_PATH.loadingSpinner}
              style={styles.imageStyle}
              resizeMode={'contain'}
            />
          );
        }
        default: {
          return (
            <Image
              source={ICON_PATH.statusError}
              style={styles.imageStyle}
              resizeMode={'contain'}
            />
          );
        }
      }
    }, [data?.type]);

    const titleColor = useMemo(() => {
      switch (data?.type) {
        case TYPE_MODAL.SUCCESS: {
          return Colors.success;
        }
        case TYPE_MODAL.WARNING: {
          return Colors.fiveOrange;
        }
        case TYPE_MODAL.WARNING2: {
          return Colors.highLightColor;
        }
        default: {
          return Colors.fifthRed;
        }
      }
    }, [data?.type]);
    return (
      <Modal isVisible={isVisible}>
        <View style={styles.backgroundPopup}>
          {renderImage}
          <View
            style={{
              marginBottom: SH(20),
              marginTop: SH(16),
              paddingHorizontal: SW(16),
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {data?.type === TYPE_MODAL.LOADING ? null : (
              <AppText
                semiBold
                style={[styles.headerPopupTextStyle, { color: titleColor, marginBottom: SH(12) }]}
              >
                {data?.title}
              </AppText>
            )}
            <AppText style={[styles.popupTextStyle, { textAlign: 'center' }]}>
              {data?.content}
            </AppText>
            {data?.renderSubContent ? data?.renderSubContent : null}
          </View>
          {data?.type === TYPE_MODAL.LOADING ? null : (
            <View style={styles.bottomButtonContainer}>
              {!data?.titleButtonLeft && !data?.onPressLeft ? null : (
                <TouchableOpacity style={styles.buttonStyle} onPress={data?.onPressLeft}>
                  <AppText style={styles.popupTextStyle}>{data?.titleButtonLeft}</AppText>
                </TouchableOpacity>
              )}
              {!data?.titleButtonRight && !data?.onPressRight ? null : (
                <TouchableOpacity style={styles.buttonStyle} onPress={data?.onPressRight}>
                  <AppText semiBold style={[styles.popupTextStyle, { color: Colors.primary2 }]}>
                    {data?.titleButtonRight}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
    );
  }),
);

export default PopupStatus;

const styles = StyleSheet.create({
  backgroundPopup: {
    backgroundColor: Colors.primary5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    minHeight: SH(212),
  },
  headerPopupTextStyle: {
    color: Colors.gray1,
    fontSize: SH(16),
    lineHeight: SH(22),
    textAlign: 'center',
  },
  popupTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(22),
    color: Colors.gray1,
  },
  imageStyle: {
    height: SH(48),
    width: SW(188),
    marginTop: SH(20),
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d6dcf7',
    height: SH(53),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIconStyle: {
    width: SW(56),
    height: SH(56),
  },
  deleteIconPosition: {
    position: 'absolute',
    right: SW(18),
    top: SH(13),
    zIndex: 1,
  },
});
