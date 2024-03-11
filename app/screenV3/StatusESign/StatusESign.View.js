import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import DashedHorizontal from '../../componentV3/DashedHorizontal/DashedHorizontal';
import ButtonText from '../../common/ButtonText';
import { IMAGE_PATH } from '../../assets/path';
import HTMLView from '../../componentV3/HTMLView/HTMLView';

const isHtml = (str) => {
  return /<[a-z][\s\S]*>/i.test(str);
};

const StatusESign = memo((props) => {
  const { navigation } = props;

  const status = useMemo(
    () => navigation?.state?.params?.params?.status,
    [navigation?.state?.params?.params?.status],
  );
  const message = useMemo(
    () => navigation?.state?.params?.params?.message,
    [navigation?.state?.params?.params?.message],
  );
  const onRetry = useMemo(
    () => navigation?.state?.params?.params?.onRetry,
    [navigation?.state?.params?.params?.onRetry],
  );

  const onPopToTop = useCallback(() => {
    navigation?.popToTop();
    navigation?.navigate('Home');
  }, [navigation]);

  const onPop = useCallback(() => {
    navigation?.pop();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <Image
          source={status === 'SUCCESS' ? IMAGE_PATH.mascotSuccess : IMAGE_PATH.mascotError}
          style={styles.mascot}
        />
        <AppText
          style={[styles.title, { color: status === 'SUCCESS' ? Colors.green5 : Colors.sixRed }]}
          semiBold
        >
          {status === 'SUCCESS'
            ? 'Ký hợp đồng đại lý bảo hiểm\nthành công'
            : 'Ký hợp đồng đại lý bảo hiểm\nthất bại'}
        </AppText>
        <DashedHorizontal style={styles.dashed} color={Colors.gray4} size={2} />
        {isHtml(message) ? (
          <HTMLView html={message} />
        ) : status === 'SUCCESS' ? (
          <AppText style={styles.desc}>
            Chúc mừng bạn đã được{' '}
            <AppText style={[styles.desc, { color: Colors.green5 }]} bold>
              giảm 5% thuế thu nhập cá nhân
            </AppText>{' '}
            từ thu nhập của các dự án bảo hiểm tính từ thời điểm hiện tại.
          </AppText>
        ) : (
          <AppText style={styles.desc}>{message}</AppText>
        )}
      </View>
      {status === 'SUCCESS' ? (
        <ButtonText
          onPress={onPopToTop}
          title={'Về trang chủ MFast'}
          top={24}
          height={50}
          fontSize={16}
          lineHeight={24}
          medium
          style={styles.button}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <ButtonText
            onPress={onPop}
            title={'Hủy bỏ'}
            top={24}
            height={50}
            fontSize={16}
            lineHeight={24}
            medium
            style={[styles.button, { marginRight: 20 }]}
            buttonColor={Colors.neutral5}
            borderColor={Colors.gray5}
            titleColor={Colors.gray5}
          />
          <ButtonText
            onPress={onRetry}
            title={'Ký lại ngay'}
            top={24}
            height={50}
            fontSize={16}
            lineHeight={24}
            medium
            style={styles.button}
          />
        </View>
      )}
    </View>
  );
});

export default StatusESign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  boxContainer: {
    backgroundColor: Colors.primary5,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 72,
  },
  title: {
    marginTop: 76,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
    color: Colors.green5,
  },
  dashed: { alignSelf: 'center', position: 'relative', marginVertical: 12 },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  button: {
    alignSelf: 'center',
  },
  mascot: {
    width: 140,
    height: 140,
    position: 'absolute',
    alignSelf: 'center',
    top: -56,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
