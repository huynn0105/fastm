import {
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import CharAvatar from '../../componentV3/CharAvatar';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import { useSelector } from 'react-redux';
import ButtonText from '../../common/ButtonText';
import { getDefaultAvatar } from '../../utils/userHelper';
import Rating from '../Collaborator/common/Rating';
import BottomActionSheet from '../../components2/BottomActionSheet';
import ModalListReview from './components/ModalListReview';
import DigitelClient from '../../network/DigitelClient';
import Indicator from '../../componentV3/Indicator/Indicator';
import Loading from '../../components2/LoadingComponent';
import { showAlert, showInfoAlert } from '../../utils/UIUtils';
import { hardFixUrlAvatar } from '../../redux/actions/user';
import { getTimeBetween } from '../../utils/dateHelper';
import moment from 'moment';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ConfirmCollaboratorPending = memo((props) => {
  const { navigation } = props;
  const params = navigation?.getParam('params');
  const filterRating = useSelector((state) => state?.collaboratorReducer?.filterRating);
  const bottomSheetRef = useRef();

  const item = useMemo(() => params?.item || {}, [params?.item]);
  const ID = useMemo(() => params?.ID || item?.ID || '', [params?.ID]);
  const [data, setData] = useState({ ID, ...item });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalLoading, setIsShowModalLoading] = useState(false);

  const onGetData = useCallback(async () => {
    try {
      if (ID) {
        setIsLoading(true);
        const res = await DigitelClient.getDetailCollaboratorPending(ID);

        if (res?.data?.status) {
          if (res?.data?.data?.length) {
            const newItem = res?.data?.data?.[0] || [];
            setData((prev) => {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  200,
                  LayoutAnimation.Types.easeInEaseOut,
                  LayoutAnimation.Properties.opacity,
                ),
              );
              return {
                ...prev,
                ...newItem,
              };
            });
          } else {
            showAlert('Yêu cầu đã được duyệt hoặc đã bị thu hồi', 'Thông báo', [
              {
                text: 'Quay lại',
                onPress: () => {
                  navigation?.goBack();
                },
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.log('\u001B[36m -> file: ConfirmCollaboratorPending.js:42 -> err', err);
    } finally {
      setIsLoading(false);
    }
  }, [ID]);

  const onConfirmCollaborator = useCallback(
    (action = 'confirm') =>
      async () => {
        try {
          setIsShowModalLoading(true);
          const res = await DigitelClient.confirmCollaboratorPending(ID, action);
          const isSuccess = res?.data?.status;

          if (isSuccess) {
            params?.onRemoveItem?.(ID);
            navigation?.goBack();
            showInfoAlert(action === 'confirm' ? 'Đã đồng ý mời mời' : 'Đã từ chối lời mời');
          } else {
            showAlert(res?.data?.message, 'Thông báo');
          }
        } catch (err) {
          showAlert(err?.message, 'Thông báo');
        } finally {
          setIsShowModalLoading(false);
        }
      },
    [ID],
  );

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  return (
    <View style={styles.container}>
      <CharAvatar
        source={hardFixUrlAvatar(data?.avatarImage)}
        style={styles.avatar}
        defaultImage={getDefaultAvatar('male')}
      />
      <View style={[styles.row, { justifyContent: 'center', marginTop: 12 }]}>
        <AppText style={styles.name} semiBold>
          {data?.fullName}
        </AppText>
        {data?.level ? (
          <>
            <View style={[styles.dot, { marginHorizontal: 8 }]} />
            <AppText style={[styles.name, { color: Colors.blue3 }]} semiBold>
              {data?.level}
            </AppText>
          </>
        ) : null}
      </View>
      <AppText style={[styles.date, { textAlign: 'center', marginTop: 2 }]}>
        Tham gia:{' '}
        {data?.year > 0 || data?.month > 0 || data?.day
          ? `${data?.year > 0 ? `${data?.year} năm, ` : ''}${
              data?.month > 0 ? `${data?.month} tháng, ` : ''
            }${data?.day} ngày trước`
          : getTimeBetween(moment(data?.createdDateUser, 'YYYY-MM-DD HH:mm:ss'))}
      </AppText>
      <View style={[styles.boxContainer, !data?.lastRating?.length && { marginTop: 40 }]}>
        {isLoading ? (
          <Indicator color={Colors.blue7} />
        ) : data?.lastRating?.ID ? (
          <>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <AppText style={[styles.date, { color: Colors.blue7 }]}>
                Đánh giá gần nhất về {data?.fullName}
              </AppText>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef?.current?.open('Đánh giá về cộng tác viên');
                }}
                style={styles.row}
              >
                <AppText style={[styles.date, { color: Colors.blue7, opacity: 0.7 }]}>
                  Xem thêm
                </AppText>
                <Image source={ICON_PATH.arrow_right} style={styles.iconArrow} />
              </TouchableOpacity>
            </View>

            <View style={[styles.line, { marginVertical: 12 }]} />
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Rating space={2} star={data?.lastRating?.rating} />
              <View style={[styles.row, { flex: 1, marginLeft: 12 }]}>
                <AppText
                  style={[styles.date, { color: Colors.blue7, flex: 1, textAlign: 'right' }]}
                  numberOfLines={1}
                >
                  {data?.lastRating?.fullName}
                </AppText>
                <AppText style={[styles.date, { color: Colors.blue7, textAlign: 'right' }]}>
                  {' - '}
                  {getTimeBetween(moment(data?.lastRating?.createdDate))}
                </AppText>
              </View>
            </View>
            <AppText style={[styles.date, { color: Colors.blue7, marginTop: 8 }]} medium>
              Xử lý tốt, nhiệt tình, muốn được hỗ trợ tiếp
            </AppText>
          </>
        ) : (
          <>
            <Image
              source={IMAGE_PATH.mascotFindCard}
              style={{
                position: 'absolute',
                width: 104,
                height: 104,
                top: -32,
                alignSelf: 'center',
              }}
            />
            <AppText
              style={[styles.date, { color: Colors.blue7, marginTop: 68, textAlign: 'center' }]}
            >
              Chưa có đánh giá về {data?.fullName}
            </AppText>
          </>
        )}
      </View>
      <AppText style={[styles.date, { marginTop: 24 }]}>Lời nhắn của {data?.fullName}</AppText>
      <View style={[styles.boxContainer, { backgroundColor: Colors.primary5, marginTop: 8 }]}>
        <AppText style={[styles.date, { color: Colors.gray1 }]}>{data?.note}</AppText>
      </View>
      {isLoading ? null : (
        <View style={[styles.row, { marginTop: 24 }]}>
          <ButtonText
            style={{ flex: 1, marginRight: 12 }}
            title={'Bỏ qua'}
            buttonColor={Colors.neutral5}
            borderColor={Colors.gray5}
            titleColor={Colors.gray5}
            height={50}
            fontSize={16}
            lineHeight={24}
            medium
            onPress={onConfirmCollaborator('reject')}
          />
          <ButtonText
            style={{ flex: 1 }}
            title={'Đồng ý'}
            height={50}
            fontSize={16}
            lineHeight={24}
            medium
            onPress={onConfirmCollaborator('confirm')}
          />
        </View>
      )}
      <BottomActionSheet
        ref={bottomSheetRef}
        render={() => <ModalListReview data={filterRating} user={data} />}
        canClose={true}
        haveCloseButton={true}
        avoidKeyboard={false}
        headerTextStyle={{
          textAlign: 'center',
        }}
      />
      <Loading visible={isShowModalLoading} />
    </View>
  );
});
export default ConfirmCollaboratorPending;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    flex: 1,
    paddingHorizontal: 16,
  },
  avatar: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 96 / 2,
    marginTop: 16,
  },
  name: {
    fontSize: 18,
    lineHeight: 26,
    color: Colors.gray1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4 / 2,
    backgroundColor: Colors.gray8,
  },
  date: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  boxContainer: {
    borderRadius: 8,
    backgroundColor: Colors.blue3,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  iconArrow: { width: 16, height: 16, tintColor: Colors.primary5, marginLeft: 6 },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.blue7,
  },
});
