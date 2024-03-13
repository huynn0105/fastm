import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { forwardRef, memo, useImperativeHandle, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import ListDetailChart from '../../Collaborator/common/ListDetailChart';
import { useSelector } from 'react-redux';
import { IMAGE_PATH } from '../../../assets/path';
import Indicator from '../../../componentV3/Indicator/Indicator';
import { HPageViewHoc } from '../../../componentV3/HeadTabView';

const HScrollView = HPageViewHoc(ScrollView);

const StatisticsIncome = memo(
  forwardRef((props, ref) => {
    const { index, onPressItem } = props;

    const appInfo = useSelector((state) => state.appInfo);

    const insets = useSafeAreaInsets();
    const [data, setData] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    useImperativeHandle(ref, () => ({
      setData,
      setIsEmpty,
    }));

    const containerStyle = useMemo(
      () => [styles.container, { marginBottom: insets.bottom }],
      [insets.bottom],
    );

    return (
      <HScrollView index={index} showsVerticalScrollIndicator={false} style={containerStyle}>
        <AppText semiBold style={styles.title}>
          Thống kê thu nhập trong tháng
        </AppText>
        <View style={styles.listContainer}>
          {isEmpty ? (
            <>
              <Image
                source={IMAGE_PATH.mascotSleep}
                style={{ width: 120, height: 120, alignSelf: 'center' }}
              />
              <AppText
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: Colors.gray5,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                Chưa phát sinh thu nhập trong tháng
              </AppText>
            </>
          ) : data?.length ? (
            <ListDetailChart data={data} unit={'đ'} disabledHightLight onPressItem={onPressItem} />
          ) : (
            <Indicator style={{ alignSelf: 'center' }} />
          )}
        </View>
        {isEmpty ? null : (
          <>
            <AppText semiBold style={[styles.title, { marginTop: 24 }]}>
              Quy định về sử dụng thu nhập trên MFast:
            </AppText>
            <View style={styles.contentContainer}>
              <View style={styles.row}>
                <AppText style={styles.text}>{`-  `}</AppText>
                <AppText style={[styles.text, { flex: 1 }]}>
                  <AppText bold style={[styles.text, { color: Colors.orange8 }]}>
                    Các ngày trong tháng:
                  </AppText>{' '}
                  có thể rút tiền hoặc mua sắm từ số dư khả dụng bất cứ lúc nào.
                </AppText>
              </View>
              <View style={[styles.row, { marginTop: 12 }]}>
                <AppText style={styles.text}>{`-  `}</AppText>
                <View>
                  <AppText style={[styles.text, { flex: 1 }]}>
                    <AppText bold style={[styles.text, { color: Colors.orange8 }]}>
                      Ngày cuối cùng của tháng:
                    </AppText>{' '}
                    không tự thao thác rút tiền, mua sắm. MFast sẽ tự động chuyển tiền về tài khoản
                    ngân hàng ưu tiên, với quy định như sau:
                  </AppText>
                  <View style={[styles.row, { marginTop: 8 }]}>
                    <AppText style={styles.text}>{`+  `}</AppText>
                    <AppText style={[styles.text, { flex: 1 }]}>
                      {'Nếu tổng thu nhập < 2 triệu: thanh toán toàn bộ '}
                      <AppText bold style={[styles.text, { color: Colors.orange8 }]}>
                        {`[số dư khả dụng + thuế TNCN tạm giữ]`}
                      </AppText>
                    </AppText>
                  </View>
                  <View style={[styles.row, { marginTop: 8 }]}>
                    <AppText style={styles.text}>{`+  `}</AppText>
                    <AppText style={[styles.text, { flex: 1 }]}>
                      {'Nếu tổng thu nhập >= 2 triệu: thanh toán '}
                      <AppText bold style={[styles.text, { color: Colors.orange8 }]}>
                        {`[số dư khả dụng]`}
                      </AppText>
                    </AppText>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      appInfo?.taxAdjustmentUrl && Linking.openURL(appInfo?.taxAdjustmentUrl)
                    }
                  >
                    <View
                      style={{
                        marginTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: `${Colors.primary5}90`,
                        paddingTop: 12,
                      }}
                    >
                      <AppText style={styles.text}>
                        Xem quy định tính thuế TNCN trên MFast >>
                      </AppText>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </>
        )}
      </HScrollView>
    );
  }),
);

export default StatisticsIncome;

const styles = StyleSheet.create({
  container: { margin: 0, padding: 0, paddingHorizontal: 16 },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  listContainer: {
    backgroundColor: Colors.primary5,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  contentContainer: {
    backgroundColor: Colors.blue3,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.primary5,
  },
});
