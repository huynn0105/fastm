import {
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import ButtonText from '../../../common/ButtonText';
import DigitelClient from '../../../network/DigitelClient';
import ViewStatus, { STATUS_ENUM } from '../../../common/ViewStatus';

const ModalRequestSupporter = memo((props) => {
  const { item, onCloseModal, onSuccess } = props;
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSendRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await DigitelClient.sendRequestSupporter(item?.toUserID, text);
      if (res?.data?.status) {
        DeviceEventEmitter.emit('GET_SUPPORTER_WAITING');
        onSuccess?.(item);
      } else {
        setError(res?.data?.message);
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  }, [item, onSuccess, text]);

  return (
    <View style={styles.container}>
      {isLoading || error ? (
        <ViewStatus
          status={isLoading ? STATUS_ENUM.LOADING : STATUS_ENUM.ERROR}
          title={
            isLoading
              ? 'Hệ thống đang xử lý,\nvui lòng không thoát lúc này'
              : 'Thay đổi người dẫn dắt thất bại thất bại'
          }
          content={isLoading ? '' : error}
        />
      ) : (
        <ScrollView>
          <CharAvatar
            style={styles.avatar}
            textStyle={{ fontSize: 30 }}
            defaultImage={ICON_PATH.defaultAvatar}
            source={hardFixUrlAvatar(item?.avatarImage)}
          />
          <AppText medium style={styles.text}>
            {item?.sub_title}
          </AppText>
          <AppText style={styles.titleInput}>Gửi 1 lời nhắn để giới thiệu về bạn:</AppText>
          <TextInput
            style={styles.input}
            multiline
            onChangeText={setText}
            value={text}
            placeholder={'Nhập lời nhắn'}
          />
          <View style={styles.noteContainer}>
            <Image source={ICON_PATH.note3} style={styles.iconNote} />
            <AppText style={[styles.textNote, { flex: 1 }]}>
              <AppText semiBold style={[styles.textNote, { color: Colors.sixRed }]}>
                Khi thay đổi người dẫn dắt
              </AppText>
              , tức chuyển qua cộng đồng mới, những người bên dưới bạn{' '}
              <AppText semiBold style={[styles.textNote, { color: Colors.sixRed }]}>
                sẽ ở lại cộng đồng cũ và không còn chung nhánh với bạn nữa.
              </AppText>
            </AppText>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonText
              title={'Quay lại'}
              height={50}
              width={125}
              buttonColor={Colors.neutral5}
              titleColor={Colors.gray5}
              borderColor={Colors.gray5}
              fontSize={16}
              lineHeight={24}
              onPress={onCloseModal}
            />
            <ButtonText
              title={'Xác nhận'}
              height={50}
              width={125}
              fontSize={16}
              lineHeight={24}
              buttonColor={Colors.primary2}
              borderColor={Colors.primary2}
              onPress={onSendRequest}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
});

export default ModalRequestSupporter;

const styles = StyleSheet.create({
  container: {
    height: 0.8 * SCREEN_HEIGHT,
    backgroundColor: Colors.neutral5,
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray1,
    textAlign: 'center',
    marginTop: 16,
  },
  titleInput: {
    color: Colors.gray5,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    marginTop: 8,
    height: 84,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  noteContainer: {
    borderRadius: 8,
    backgroundColor: '#fbdada',
    flexDirection: 'row',
    padding: 12,
    marginTop: 16,
  },
  iconNote: {
    width: 24,
    height: 24,
    marginRight: 8,
    tintColor: Colors.sixRed,
  },
  textNote: {
    color: Colors.gray1,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 24,
  },
});
