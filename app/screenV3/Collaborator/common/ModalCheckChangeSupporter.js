import { Linking, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Colors from '../../../theme/Color';
import { SCREEN_HEIGHT } from '../../../utils/Utils';
import ViewStatus, { STATUS_ENUM } from '../../../common/ViewStatus';
import DigitelClient from '../../../network/DigitelClient';
import ButtonText from '../../../common/ButtonText';
import AppText from '../../../componentV3/AppText';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';

const ModalCheckChangeSupporter = memo((props) => {
  const { onNextHandle, onCloseModal, onBack, isChange } = props;

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState('');

  const [data, setData] = useState();

  const isData = useMemo(() => Object.keys(data || {})?.length, [data]);

  const onCheckChangeSupporter = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await DigitelClient.checkHasChangeSupporter();

      if (res?.data?.status) {
        onNextHandle?.();
      } else {
        setError(
          'Bạn chỉ được bỏ hoặc thay đổi người dẫn dắt khi thoả một trong các điều kiện sau:',
        );
        setData(res?.data?.data);

        setIsLoading(false);
      }
    } catch (err) {
      setError(err?.message);
      setIsLoading(false);
    }
  }, [onNextHandle]);

  const onOpenUrlDetail = useCallback(() => {
    onCloseModal?.();
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${data?.detail_link}&title=${'Người dẫn dắt'}`,
    );
  }, [data?.detail_link, onCloseModal]);

  useEffect(() => {
    onCheckChangeSupporter();
  }, [onCheckChangeSupporter]);

  return (
    <View style={styles.container}>
      <ViewStatus
        status={isLoading ? STATUS_ENUM.LOADING : STATUS_ENUM.ERROR}
        title={
          isLoading
            ? `Đang kiểm tra điều kiện ${
                isChange ? 'thay đổi' : 'bỏ'
              } người\ndẫn dắt, vui lòng không thoát lúc này`
            : isData
            ? `Không thỏa điều kiện ${isChange ? 'thay đổi' : 'bỏ'} người dẫn dắt`
            : 'Rất tiếc, đã có lỗi xảy ra.\nVui lòng kiểm tra và thử lại sau'
        }
        content={isLoading ? '' : error}
        style={styles.loading}
      />
      {isData ? (
        <>
          <View style={styles.boxContainer}>
            <View style={styles.titleContainer}>
              <AppText style={styles.title} semiBold>
                ĐIỀU KIỆN
              </AppText>
              <AppText style={[styles.title, { color: Colors.sixOrange }]} semiBold>
                THỰC TẾ CỦA BẠN
              </AppText>
            </View>
            <View style={styles.contentContainer}>
              <ItemContent id={'error_comm'} data={data?.error_comm} index={1} />
              <ItemContent id={'error_app'} data={data?.error_app} index={2} />
              <ItemContent id={'error_login'} data={data?.error_login} index={3} />
            </View>
          </View>
          <AppText style={{ fontSize: 16, lineHeight: 24, marginTop: 16 }}>
            Chi tiết quy định và điều kiện,{' '}
            <AppText
              style={{ fontSize: 16, lineHeight: 24, color: Colors.primary2 }}
              bold
              onPress={onOpenUrlDetail}
            >
              xem tại đây >>
            </AppText>
          </AppText>
          <ButtonText title={'Đã hiểu và quay lại'} onPress={onBack} top={16} />
        </>
      ) : null}
    </View>
  );
});

export default ModalCheckChangeSupporter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral5,
    padding: 16,
    height: 0.8 * SCREEN_HEIGHT,
    alignItems: 'center',
  },
  loading: {
    marginTop: 16,
  },
  boxContainer: {
    borderWidth: 1,
    borderColor: Colors.primary5,
    borderRadius: 8,
    width: '100%',
    marginTop: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 34,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  contentContainer: {
    backgroundColor: Colors.primary5,
  },
  content: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray1,
  },
});

const ItemContent = memo((props) => {
  const { index, data } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: index > 1 ? Colors.gray4 : Colors.transparent,
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <HTMLView html={data?.condition} />
      </View>
      <AppText
        style={[
          styles.content,
          {
            color: Colors.sixOrange,
          },
        ]}
        bold
      >
        {data?.current_time} ngày
      </AppText>
    </View>
  );
});
