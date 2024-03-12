import { Image, StyleSheet, Text, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import Modal from 'react-native-modal';
import Colors from '../../../theme/Color';
import { IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import DashedHorizontal from '../../../componentV3/DashedHorizontal/DashedHorizontal';
import ButtonText from '../../../common/ButtonText';

const ModalMTradeMessage = memo(
  forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState({});

    const close = useCallback(() => {
      setIsVisible(false);
      setData({});
    }, []);

    const open = useCallback(
      ({
        image = IMAGE_PATH.mascotSuccess,
        title = '',
        content = '',
        titleColor = Colors.green5,
        renderContent = null,
        actions = [{ title: 'Quay lại', type: 'cancel', onPress: close }],
      }) => {
        setData({
          image,
          title,
          content,
          titleColor,
          renderContent,
          actions,
        });
        setIsVisible(true);
      },
      [close],
    );

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const renderButton = useCallback((item, index) => {
      const titleColor = Colors.primary5;
      const buttonColor = item?.type === 'cancel' ? Colors.transparent : Colors.primary2;
      const borderColor = item?.type === 'cancel' ? Colors.primary5 : Colors.primary2;

      return (
        <ButtonText
          onPress={item?.onPress}
          key={index}
          title={item?.title}
          height={50}
          titleColor={titleColor}
          buttonColor={buttonColor}
          borderColor={borderColor}
          fontSize={16}
          lineHeight={24}
        />
      );
    }, []);

    return (
      <Modal
        isVisible={isVisible}
        style={styles.container}
        backdropColor={'rgb(10, 10, 40)'}
        backdropOpacity={0.9}
        deviceHeight="100%"
      >
        <View style={styles.modalContainer}>
          <Image source={data?.image} style={styles.image} />
          <AppText semiBold style={[styles.title, { color: data?.titleColor }]}>
            {data?.title}
          </AppText>
          <View style={styles.dashContainer}>
            <DashedHorizontal />
          </View>
          {data?.renderContent ? (
            data?.renderContent?.()
          ) : (
            <AppText style={styles.content}>{data?.content}</AppText>
          )}
        </View>
        <View style={styles.buttonContainer}>{data?.actions?.map(renderButton)}</View>
      </Modal>
    );
  }),
);

export default ModalMTradeMessage;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    justifyContent: 'center',
  },
  modalContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.primary5,
    borderRadius: 16,
    padding: 16,
    paddingTop: 84,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
  },
  dashContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  image: {
    width: 116,
    height: 116,
    position: 'absolute',
    alignSelf: 'center',
    top: -44,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 24,
    marginHorizontal: 16,
  },
});
