import { Image, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import Colors from '../../../theme/Color';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import ButtonText from '../../../common/ButtonText';
import AppText from '../../../componentV3/AppText';
import { getDefaultAvatar } from '../../../utils/userHelper';
import ViewStatus, { STATUS_ENUM } from '../../../common/ViewStatus';
import { removeSupporter } from '../../../redux/actions/user';
import { useDispatch } from 'react-redux';

const ModalRemoveSupporter = memo((props) => {
  const { onCloseModal, infoUser, onBack } = props;

  const dispatch = useDispatch();

  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const onRemoveSupporter = useCallback(() => {
    setStatus(STATUS_ENUM.LOADING);
    setMessage('');
    dispatch(
      removeSupporter(async (isSuccess, result) => {
        if (isSuccess) {
          setMessage(result || 'Bạn đã trở thành cộng tác viên tự do');
          setStatus(STATUS_ENUM.SUCCESS);
        } else {
          setMessage(result);
          setStatus(STATUS_ENUM.ERROR);
        }
      }),
    );
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {status ? (
        <View style={styles.loading}>
          <ViewStatus
            status={status}
            title={
              status === STATUS_ENUM.LOADING
                ? `Đang kiểm tra điều kiện bỏ người\ndẫn dắt, vui lòng không thoát lúc này`
                : status === STATUS_ENUM.SUCCESS
                ? 'Bỏ người dẫn dắt thành công'
                : 'Rất tiếc, đã có lỗi xảy ra.\nVui lòng kiểm tra và thử lại sau'
            }
            content={status !== STATUS_ENUM.LOADING ? message : ''}
          />
          {status === STATUS_ENUM.ERROR ? (
            <ButtonText
              title={'Đã hiểu và quay lại'}
              onPress={onBack}
              top={24}
              style={{ selfAlign: 'center' }}
            />
          ) : null}
          {status === STATUS_ENUM.SUCCESS ? (
            <ButtonText
              title={'Đóng'}
              onPress={onCloseModal}
              top={24}
              style={{ selfAlign: 'center' }}
            />
          ) : null}
        </View>
      ) : null}
      <View style={styles.boxContainer}>
        <Image style={styles.avatarContainer} source={getDefaultAvatar('male')} />
        <AppText style={[styles.text, { marginTop: 64, textAlign: 'center' }]} medium>
          Xác nhận muốn bỏ{' '}
          <AppText style={[styles.text, { color: Colors.blue3 }]} semiBold>
            “{infoUser?.detail?.fullName}”
          </AppText>{' '}
          không còn là người dẫn dắt của mình
        </AppText>
        <View style={styles.divider} />
        <AppText style={[styles.text, { color: Colors.sixOrange }]} medium>
          Những lưu ý khi bỏ người dẫn dắt
        </AppText>
        <ItemContent
          index={1}
          content={
            <AppText style={styles.textSmall}>
              Bạn sẽ trở thành{' '}
              <AppText style={[styles.textSmall, { color: Colors.sixOrange }]} semiBold>
                cộng tác viên tự do
              </AppText>{' '}
              sau khi bỏ người dẫn dắt
            </AppText>
          }
        />
        <ItemContent
          index={2}
          content={
            <AppText style={styles.textSmall}>
              Các cộng tác viên dưới cấp sẽ{' '}
              <AppText style={[styles.textSmall, { color: Colors.sixOrange }]} semiBold>
                không còn thuộc quyền quản lý của bạn
              </AppText>{' '}
            </AppText>
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonText
          fontSize={16}
          lineHeight={24}
          medium
          title={'Quay lại'}
          height={48}
          onPress={onBack}
          buttonColor={Colors.transparent}
          borderColor={Colors.gray5}
          titleColor={Colors.gray5}
          style={{ flex: 0.5, marginRight: 12 }}
          adjustsFontSizeToFit
        />
        <ButtonText
          fontSize={16}
          lineHeight={24}
          medium
          title={'Bỏ người dẫn dắt'}
          height={48}
          onPress={onRemoveSupporter}
          style={{ flex: 1, paddingHorizontal: 0 }}
        />
      </View>
    </View>
  );
});

export default ModalRemoveSupporter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    padding: 16,
    height: 0.7 * SCREEN_HEIGHT,
    alignItems: 'center',
  },
  loading: {
    marginTop: 16,
    position: 'absolute',
    zIndex: 9,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.neutral5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxContainer: {
    borderRadius: 8,
    width: '100%',
    marginTop: 48,
    backgroundColor: Colors.primary5,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: -32,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    marginHorizontal: 0,
    height: 1,
    backgroundColor: Colors.gray4,
    marginTop: 12,
    marginBottom: 16,
  },
  textSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
});

const ItemContent = memo((props) => {
  const { index, content } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 8,
      }}
    >
      <AppText style={[styles.textSmall, { width: 20 }]}>{index}.</AppText>
      <AppText style={[styles.textSmall, { flex: 1 }]}>{content}</AppText>
    </View>
  );
});
