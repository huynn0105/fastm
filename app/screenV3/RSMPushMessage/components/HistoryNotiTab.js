import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ICON_PATH, IMAGE_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import ItemHistoryPush from '../common/ItemHistoryPush';
import { styles } from '../RSMPushMessage.style';

const MONTH = moment().month() + 1;

const HistoryNotiTab = ({ listNotis, onBackToSendNoti, onGoToDetail }) => {
  const [month, setMonth] = useState(MONTH);
  const [data, setData] = useState(listNotis);

  const renderItem = useCallback(
    ({ item, index }) => {
      return <ItemHistoryPush item={item} index={index} onGoToDetail={onGoToDetail} />;
    },
    [onGoToDetail],
  );
  const getKeyExtractor = useCallback((item) => {
    return item?.ID;
  }, []);

  useEffect(() => {
    const newData = listNotis
      ?.filter((item) => moment(item?.processFininshed).month() + 1 === month)
      .reverse();
    setData(newData);
  }, [month, listNotis]);

  const onNextMonth = useCallback(() => {
    setMonth((prev) => prev + 1);
  }, []);
  const onPreviousMonth = useCallback(() => {
    setMonth((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const renderHeader = useCallback(() => {
    const isThisMonth = month === MONTH;
    const isFirstMonth = month === 1;
    return (
      <View style={[styles.rowView, { marginTop: SH(16), alignSelf: 'center' }]}>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <TouchableWithoutFeedback onPress={onPreviousMonth}>
            <View style={[styles.containerHeaderButton, { opacity: isFirstMonth ? 0.4 : 1 }]}>
              <Image source={ICON_PATH.back} style={styles.iconHeaderButton} />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <AppText style={styles.bigText}>
            {isThisMonth ? 'Tháng hiện tại' : `Tháng ${month}`}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableWithoutFeedback disabled={isThisMonth} onPress={onNextMonth}>
            <View style={[styles.containerHeaderButton, { opacity: isThisMonth ? 0.4 : 1 }]}>
              <Image source={ICON_PATH.arrow_right} style={styles.iconHeaderButton} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }, [month, onNextMonth, onPreviousMonth]);

  const renderListHeader = useCallback(() => {
    return (
      <View style={{ marginTop: SH(18), marginBottom: SH(8) }}>
        <AppText style={commonStyle.mediumText}>Danh sách thông báo đã gửi</AppText>
      </View>
    );
  }, []);
  const renderListEmpty = useCallback(() => {
    return (
      <View style={{ marginTop: SH(30) }}>
        <View style={{ alignItems: 'center' }}>
          <Image source={IMAGE_PATH.nullSearch} style={{ width: SW(120), height: SH(90) }} />
          <AppText style={[commonStyle.mediumText, { color: Colors.gray5 }]}>
            Hiện tại chưa ghi nhận lượt gửi thông báo nào
          </AppText>
        </View>
        <TouchableOpacity
          style={[styles.confirmButtonView, { marginTop: SH(22) }]}
          onPress={onBackToSendNoti}
        >
          <AppText style={[commonStyle.mediumText, { color: Colors.primary5 }]}>
            Gửi thông báo ngay
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }, [onBackToSendNoti]);

  return (
    <View style={{ paddingHorizontal: SW(16) }}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={getKeyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={{ paddingBottom: SH(100) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HistoryNotiTab;
