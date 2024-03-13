import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect } from 'react';
import HeaderSection from '../common/HeaderSection';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import { useState } from 'react';
import LegendaryChart from '../common/LegendaryChart';
import { getLegendaryChart } from '../../../redux/actions/actionsV3/collaboratorAction';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../utils/Utils';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';
import { DEVICE_EVENT_EMITTER } from '../../../constants/keys';

const LegendaryContent = memo((props) => {
  const { myUser, userId, userInfo, onLayout, gender } = props;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const legendChart = useSelector((state) => state?.collaboratorReducer?.legendChart);

  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({
    amountCollaborator: [0, 0, 0, 0, 0, 0, 0],
    detail: {
      FIX_RSA: {
        active: '#f58b14',
        amount: [],
        background: '#fdecd8',
        ratioLine: [],
        title: '',
      },
      FIX_RSM: {
        active: '#005fff',
        amount: [],
        background: '#eaeef6',
        ratioLine: [],
        title: '',
      },
      KPI_RSA: {
        active: '#f58b14',
        amount: [],
        background: '#fdecd8',
        ratioLine: [],
        title: '',
      },
      KPI_RSM: {
        active: '#005fff',
        amount: [],
        background: '#eaeef6',
        ratioLine: [],
        title: '',
      },
      VAR_RSA: {
        active: '#f58b14',
        amount: [],
        background: '#fdecd8',
        ratioLine: [],
        title: '',
      },
      VAR_RSM: {
        active: '#005fff',
        amount: [],
        background: '#eaeef6',
        ratioLine: [],
        title: '',
      },
      earning_user: {
        active: '#858598',
        amount: [],
        background: '#f2f2f2',
        ratioLine: [],
        title: '',
      },
      head: {
        active: '#6e418b',
        amount: [],
        background: '#ece4f1',
        ratioLine: [],
        title: '',
      },
    },
  });

  const onGetData = useCallback(() => {
    if (!userId && !myUser?.uid) return;
    setIsLoading(true);
    dispatch(
      getLegendaryChart(userId || myUser?.uid, moment().format('YYYY-MM'), (isSuccess, result) => {
        setIsLoading(false);
        if (isSuccess) {
          setData(result);
        }
      }),
    );
  }, [dispatch, myUser?.uid, userId]);

  const onOpenLink = useCallback(() => {
    Linking.openURL(
      `${DEEP_LINK_BASE_URL}://open?view=webview&url=${data?.url_post}&title=${data?.title}`,
    );
  }, [data?.title, data?.url_post]);

  const onOpenModal = useCallback(() => {
    setIsVisible(true);
  }, []);
  const onHideModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    onGetData();
  }, [onGetData]);

  useEffect(() => {
    if (!userId) {
      if (Object?.keys(legendChart)?.length) {
        setIsLoading(false);
        setData(legendChart);
      } else {
        setIsLoading(true);
      }
    }
  }, [legendChart, userId]);

  useEffect(() => {
    DeviceEventEmitter.addListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);

    return () => {
      DeviceEventEmitter.removeListener(DEVICE_EVENT_EMITTER.COLLABORATOR_REFRESH, onGetData);
    };
  }, [onGetData]);

  return (
    <>
      <HeaderSection
        title={`${userId ? userInfo?.user?.fullName || '' : 'Bạn'} đang ở đâu?`}
        onLayout={onLayout}
        keyLayout={'LegendaryContent'}
      />
      <View style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <AppText style={styles.cardTitle} bold>
            Con đường Huyền Thoại
          </AppText>

          <TouchableWithoutFeedback disabled={isLoading} onPress={onOpenModal}>
            <Image
              source={ICON_PATH.full}
              style={[styles.iconFull, { tintColor: isLoading ? Colors.gray5 : Colors.primary2 }]}
            />
          </TouchableWithoutFeedback>
        </View>

        <LegendaryChart data={data} userId={userId} isLoading={isLoading} gender={gender} />
        <View style={styles.commissionContainer}>
          <AppText style={styles.commissionTitle}>Tổng thu nhập</AppText>
          <AppText bold style={styles.commission}>
            {formatNumber(data?.commission)} đ
          </AppText>
        </View>
        {data?.url_post ? (
          <TouchableOpacity onPress={onOpenLink} style={styles.tipsContainer}>
            <AppText style={styles.tipsTitle} medium>
              Tìm hiểu về con đường Huyền Thoại
            </AppText>
            <Image source={ICON_PATH.arrow_right} style={styles.tipsIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Modal isVisible={isVisible} style={styles.modalContainer}>
        <View
          style={{
            width: SCREEN_HEIGHT,
            height: SCREEN_WIDTH,
            backgroundColor: Colors.primary5,
            paddingLeft: insets.top,
            paddingRight: insets.bottom,
            paddingVertical: 16,
            transform: [
              {
                rotate: '90deg',
              },
            ],
          }}
        >
          <LegendaryChart
            data={data}
            horizontal
            userId={userId}
            isLoading={isLoading}
            gender={gender}
          />
          <TouchableOpacity style={styles.buttonCloseModal} onPress={onHideModal}>
            <Image source={ICON_PATH.closeSquare} style={styles.iconCloseModal} />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
});

export default LegendaryContent;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.primary5,
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 32,
    paddingVertical: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.blue5,
  },
  iconFull: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  lineVertical: {
    width: 1,
    height: 16,
    backgroundColor: Colors.gray4,
    marginHorizontal: 8,
  },
  type: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray8,
  },
  commissionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 84,
    marginTop: 10,
  },
  commissionTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  commission: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray1,
    marginRight: 16,
  },
  tipsContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.blue6,
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 18,
  },
  tipsTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.action,
  },
  tipsIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.action,
    resizeMode: 'contain',
  },
  modalContainer: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCloseModal: {
    position: 'absolute',
    right: 32,
    top: 24,
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCloseModal: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
