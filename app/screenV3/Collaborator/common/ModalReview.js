import { Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import AppText from '../../../componentV3/AppText';
import Rating from './Rating';
import { ICON_PATH } from '../../../assets/path';
import { useKeyboard } from '@react-native-community/hooks';
import ButtonText from '../../../common/ButtonText';
import ViewStatus, { STATUS_ENUM } from '../../../common/ViewStatus';
import { useDispatch } from 'react-redux';
import { getRatingUser, ratingUser } from '../../../redux/actions/actionsV3/collaboratorAction';
import { SCREEN_HEIGHT } from '../../../utils/Utils';

const ModalReview = memo((props) => {
  const { infoUser, titleRating, myUser, onCloseModal } = props;

  const dispatch = useDispatch();

  const [star, setStar] = useState(0);

  const [state, setState] = useState('');

  const [comment, setComment] = useState('');

  const [error, setError] = useState('');

  const [isFocused, setIsFocused] = useState(false);

  const onRating = useCallback(() => {
    setState(STATUS_ENUM.LOADING);
    dispatch(
      ratingUser(
        myUser?.uid,
        infoUser?.detail?.toUserID,
        star,
        comment,
        (isSuccess, result, err) => {
          if (isSuccess) {
            setState(STATUS_ENUM.SUCCESS);
            setTimeout(() => {
              onCloseModal?.();
            }, 1500);
          } else {
            setState(STATUS_ENUM.ERROR);
            setError(err);
          }
        },
      ),
    );
  }, [comment, dispatch, infoUser?.detail?.toUserID, myUser?.uid, onCloseModal, star]);

  const { keyboardShown } = useKeyboard();

  const getPrevReview = useCallback(() => {
    dispatch(
      getRatingUser(myUser?.uid, infoUser?.detail?.toUserID, (isSuccess, result) => {
        if (isSuccess) {
          setStar((pev) => pev || result?.rating);
          setComment((pev) => pev || result?.comment);
        }
      }),
    );
  }, [dispatch, infoUser?.detail?.toUserID, myUser?.uid]);

  useEffect(() => {
    if (!infoUser?.detail?.toUserID) return;
    getPrevReview();
  }, [getPrevReview, infoUser?.detail?.toUserID]);

  return (
    <>
      {state ? (
        <View style={styles?.loadingContainer}>
          <ViewStatus
            status={state}
            title={
              state === STATUS_ENUM.LOADING
                ? 'Hệ thống đang xử lý,\nvui lòng không thoát lúc này'
                : state === STATUS_ENUM.SUCCESS
                ? 'Đánh giá thành công'
                : 'Đánh giá thất bại'
            }
            content={
              state === STATUS_ENUM.ERROR
                ? error || 'Rất tiếc, đã có lỗi xảy ra.\nVui lòng kiểm tra và thử lại sau'
                : ''
            }
          />
          {state === STATUS_ENUM.ERROR ? (
            <ButtonText onPress={onRating} title={'Thử lại'} top={20} height={48} />
          ) : null}
        </View>
      ) : (
        <View
          style={[
            styles.container,
            Platform.OS === 'android' &&
              keyboardShown && {
                height: 0.5 * SCREEN_HEIGHT,
              },
          ]}
        >
          <CharAvatar
            style={styles.avatar}
            defaultName={infoUser?.detail?.fullName}
            source={hardFixUrlAvatar(infoUser?.detail?.avatarImage)}
            textStyle={styles.avatarText}
          />
          <AppText semiBold style={styles.name}>
            {infoUser?.detail?.fullName}
          </AppText>
          <Rating
            star={star}
            size={32}
            space={8}
            style={styles.rating}
            iconInActive={ICON_PATH.outlineStar}
            colorInActive={Colors.gray8}
            onPress={setStar}
          />
          <AppText
            semiBold={!!star}
            style={[star ? styles.ratingDescription : styles.description, { height: 22 }]}
          >
            {star ? titleRating?.[`${star}`] || '' : 'Chạm vào dấu sao để đánh giá'}
          </AppText>
          <View
            style={[
              styles.inputContainer,
              { borderColor: isFocused ? Colors.primary2 : Colors.primary5 },
            ]}
          >
            <TextInput
              style={styles.input}
              multiline
              placeholder="Nhập nhận xét (nếu có)"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={comment}
              onChangeText={setComment}
            />
          </View>
          <ButtonText
            onPress={onRating}
            disabled={!star}
            title={'Hoàn thành'}
            buttonColor={star ? Colors.primary2 : Colors.neutral3}
            titleColor={star ? Colors.primary5 : Colors.gray5}
            top={20}
            height={48}
          />
          <View style={styles.box}>
            <Image source={ICON_PATH.note3} style={{ marginRight: 8 }} />
            <AppText style={styles.boxText}>
              Đánh giá của bạn rất quan trọng trong việc nâng cao chất lượng dẫn dắt. Vui lòng phản
              ánh{' '}
              <AppText style={[styles.boxText, { color: Colors.blue3 }]} bold>
                trung thực
              </AppText>{' '}
              và{' '}
              <AppText style={[styles.boxText, { color: Colors.blue3 }]} bold>
                chi tiết
              </AppText>
              .
            </AppText>
          </View>
        </View>
      )}
    </>
  );
});

export default ModalReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    paddingTop: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 0.8 * SCREEN_HEIGHT,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.gray1,
  },
  rating: {
    marginTop: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
    marginTop: 16,
  },
  ratingDescription: {
    marginTop: 16,
    color: Colors.blue5,
    fontSize: 16,
    lineHeight: 22,
  },
  input: {
    fontSize: 14,
    flex: 1,
    textAlignVertical: 'top',
    padding: 0,
  },
  inputContainer: {
    height: 64,
    backgroundColor: Colors.primary5,
    width: '100%',
    borderRadius: 8,
    marginTop: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary5,
  },
  loadingContainer: {
    backgroundColor: Colors.neutral5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  box: {
    backgroundColor: Colors.blue6,
    borderRadius: 8,
    marginTop: 24,
    padding: 12,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  boxText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
});
