import {
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SH } from '../../constants/styles';
import AppText from '../AppText';
import Colors from '../../theme/Color';
import { IMAGE_PATH } from '../../assets/path';
import { AsyncStorageKeys } from '../../constants/keys';
import { MAX_HEIGHT_HEADER } from '../../screenV3/Home';

const STEP = ['finance', 'merchandise', 'bank', 'insurance'];
const DATA = {
  finance: {
    image: IMAGE_PATH.userGuide1,
    title: `Hé lô bạn hiền, đây là nơi giúp\nbạn đáp ứng mọi nhu cầu về tài chính\ncủa khách hàng.`,
    desc: 'Chạm vào màn hình để tiếp tục',
  },
  merchandise: {
    image: IMAGE_PATH.userGuide4,
    title: `Tiếp theo, đây là nơi bạn giúp\nkhách hàng mua hàng với chính sách\ntrả chậm 0% lãi suất và\nnhận thu nhập hấp dẫn.`,
    desc: 'Chạm vào màn hình để tiếp tục',
  },
  bank: {
    image: IMAGE_PATH.userGuide2,
    title: `Xuống một chút là nơi bạn hỗ trợ\nkhách hàng có nhu cầu mở tài khoản\nngân hàng, ví điện tử của các\ntổ chức uy tín hàng đầu.`,
    desc: 'Chạm vào màn hình để tiếp tục',
  },
  insurance: {
    image: IMAGE_PATH.userGuide3,
    title: `Còn dưới đây là các sản phẩm\nbảo hiểm hữu ích, giúp khách hàng bảo vệ\nbản thân, tài sản trước các rủi ro\nhàng ngày.`,
    desc: (
      <AppText
        style={{ fontSize: 14, lineHeight: 20, color: Colors.primary5, textAlign: 'center' }}
        medium
      >
        Chạm vào màn hình để trở thành đại lý tài chính{'\n'}
        <AppText style={{ fontSize: 14, lineHeight: 20, color: '#00c28e' }} bold>
          tất cả-trong-một
        </AppText>{' '}
        cùng MFast.
      </AppText>
    ),
  },
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ModalUserGuide = memo(
  forwardRef((props, ref) => {
    const { onScrollTo, navigation, offsetStartList, paddingTop, isFirstLogin, onEndUserGuide } =
      props;

    const [measureSections, setMeasureSections] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const [heightTop, setHeightTop] = useState(0);
    const [heightCenter, setHeightCenter] = useState(0);
    const indexStep = useRef(0);

    const data = useRef({});

    const isUpdate = measureSections?.[STEP?.[indexStep.current]]?.y;

    const onNextStep = useCallback(
      async (isNext = true) => {
        const newIndex = indexStep.current + (isNext ? 1 : 0);
        const newMeasure = measureSections[STEP[newIndex]];

        if (newMeasure && isFirstLogin) {
          if (!isNext && !newIndex) {
            setIsVisible(true);
            navigation.navigate('Home');
          }

          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              100,
              LayoutAnimation.Types.easeInEaseOut,
              LayoutAnimation.Properties.opacity,
            ),
          );

          onScrollTo(newMeasure?.y + MAX_HEIGHT_HEADER - paddingTop + 5);
          setHeightTop(offsetStartList);
          setHeightCenter(newMeasure?.height);
          indexStep.current = newIndex;
          data.current = DATA[STEP[newIndex]];
        } else {
          onEndUserGuide();
          onScrollTo(0);
          setIsVisible(false);
          AsyncStorage.setItem(AsyncStorageKeys.USER_GUIDE, 'true');
        }
      },
      [
        isFirstLogin,
        measureSections,
        navigation,
        offsetStartList,
        onEndUserGuide,
        onScrollTo,
        paddingTop,
      ],
    );

    useEffect(() => {
      if (isFirstLogin) {
        onNextStep(false);
      }
    }, [isUpdate, onNextStep, isFirstLogin]);

    useImperativeHandle(ref, () => ({ setMeasureSections }));

    if (!isVisible) return null;

    return (
      <Modal
        isVisible={isVisible}
        animationInTiming={1}
        animationOutTiming={1}
        style={styles.container}
        backdropOpacity={0}
      >
        <TouchableWithoutFeedback onPress={onNextStep}>
          <View style={styles.container}>
            <View
              style={{
                backgroundColor: 'rgba(10, 10, 40, 0.9)',
                height: heightTop || 0,
                justifyContent: 'center',
                paddingHorizontal: 16,
              }}
            >
              <AppText
                medium
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: Colors.primary5,
                }}
              >
                {data?.current?.title}
              </AppText>
              <Image
                source={data?.current?.image}
                style={{
                  position: 'absolute',
                  right: indexStep.current ? 16 : 72,
                  bottom: -30,
                  width: SH(164),
                  height: SH(164),
                }}
              />
            </View>
            <View
              style={{
                height: heightCenter || 0,
              }}
            />
            <View
              style={{
                backgroundColor: 'rgba(10, 10, 40, 0.9)',
                flex: 1,
                alignItems: 'center',
                paddingTop: 30,
              }}
            >
              <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.primary5 }} medium>
                {data?.current?.desc}
              </AppText>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }),
);

export default ModalUserGuide;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    justifyContent: 'flex-start',
    flex: 1,
  },
});
