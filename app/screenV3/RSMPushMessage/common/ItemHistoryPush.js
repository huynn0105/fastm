import moment from 'moment';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { LIST_STATUS_RSM, LIST_TYPE_RSM, STATUS_RSM, TOP_GVM } from '../RSMPushMessage.constant';
import { styles } from '../RSMPushMessage.style';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ItemHistoryPush = ({ item, index, onGoToDetail, isShowFullMessage }) => {
  const renderDot = useCallback(() => {
    return <View style={styles.dotView} />;
  }, []);

  const getContentNoti = useCallback((content) => {
    try {
      const _content = JSON.parse(content);
      return _content?.notification?.body;
    } catch (error) {
      if (__DEV__) {
        console.log('23', error);
      }
    }
  }, []);
  const renderStatus = useCallback((status) => {
    const labelStatus = status ? 'Hoàn tất' : 'Đang gửi';
    const textColor = status ? Colors.secondGreen : '#f4870b';
    return (
      <View style={{ marginLeft: SW(4) }}>
        <AppText semiBold style={[commonStyle.commonText, { color: textColor }]} numberOfLines={2}>
          {labelStatus}
        </AppText>
      </View>
    );
  }, []);
  const renderTime = useCallback((time) => {
    const date = moment(time);
    return date.format('HH:mm DD/MM/YYYY');
  }, []);

  const onPressDetail = useCallback(() => {
    onGoToDetail(item);
  }, [item, onGoToDetail]);

  // remember to improve cho nay.

  const filterCondition = JSON.parse(item?.request)?.data?.filterCondition;

  let type = 'Tất cả';
  if (filterCondition?.typeRSM && filterCondition?.typeRSM !== 'all') {
    type = LIST_TYPE_RSM?.find((it) => `${it.value}` === `${filterCondition?.typeRSM}`)?.label;
  }

  let statusRSM = '';
  if (filterCondition?.statusRSM && filterCondition?.statusRSM !== STATUS_RSM.ALL) {
    statusRSM = LIST_STATUS_RSM?.find(
      (it) => `${it.value}` === `${filterCondition?.statusRSM}`,
    )?.label;
  }

  let top = '';
  if (filterCondition?.topRSM && filterCondition?.topRSM !== '0') {
    top = TOP_GVM?.find((it) => `${it.value}` === `${filterCondition?.topRSM}`)?.label;
  }
  return (
    <View style={styles.containerItemHistory}>
      <View style={[styles.rowView, { justifyContent: 'space-between' }]}>
        <AppText style={[commonStyle.commonTexLIST_STATUS_RSMt, { color: Colors.gray5 }]}>
          Đối tượng gửi:
        </AppText>
        <AppText bold style={[commonStyle.commonTexLIST_STATUS_RSMt, { color: Colors.gray5 }]}>
          ID: {item?.notify_id} - Đã gửi {JSON.parse(item?.users_arr)?.length || 0} CTV
        </AppText>
      </View>
      <View style={[styles.rowView, { marginTop: SH(4), marginBottom: SH(8) }]}>
        <AppText>{`${type}`}</AppText>
        {statusRSM?.length ? renderDot() : null}
        <AppText>{`${statusRSM} `}</AppText>
        {top?.length ? renderDot() : null}
        <AppText>{`${top} `}</AppText>
      </View>
      <AppText style={[commonStyle.commonText, { color: Colors.gray5 }]}>Nội dung gửi:</AppText>
      <View style={styles.containerContentNoti}>
        {isShowFullMessage ? (
          <AppText style={commonStyle.commonText}>{getContentNoti(item?.request)}</AppText>
        ) : (
          <AppText style={commonStyle.commonText} numberOfLines={2}>
            {getContentNoti(item?.request)}
          </AppText>
        )}

        {!isShowFullMessage ? (
          <TouchableOpacity
            onPress={onPressDetail}
            style={{
              alignSelf: 'flex-end',
              marginTop: SH(4),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <AppText
              style={[commonStyle.commonText, { color: Colors.action, marginRight: SW(2) }]}
              numberOfLines={2}
            >
              Chi tiết
            </AppText>
            <Fontisto name="angle-right" size={SW(10)} color={Colors.action} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.containerFooterItemHistory}>
        <View style={styles.rowView}>
          <AppText style={[commonStyle.commonText, { color: Colors.gray5 }]}>Trạng thái:</AppText>
          {renderStatus(item?.status)}
        </View>
        <AppText style={[commonStyle.commonText, { color: Colors.gray5 }]}>
          Lúc {renderTime(item?.processFininshed)}
        </AppText>
      </View>
    </View>
  );
};

export default ItemHistoryPush;
