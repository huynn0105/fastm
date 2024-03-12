import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { formatNumber } from '../../../utils/Utils';
import ListLoading from '../../../componentV3/ListComponents/ListLoading';

const InfoCommission = memo((props) => {
  const { direct = 0, indirect = 0, isLoading, style } = props;

  return (
    <View style={[styles.container].concat(style)}>
      <View style={styles.boxContainer}>
        <AppText style={styles.boxTitle}>Thu nhập trực tiếp</AppText>
        <View style={styles.contentContainer}>
          <Image source={ICON_PATH.commission} style={styles.icon} />
          <AppText style={styles.content} semiBold>
            {formatNumber(direct)} đ
          </AppText>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.boxContainer}>
        <AppText style={styles.boxTitle}>Thu nhập gián tiếp</AppText>
        <View style={styles.contentContainer}>
          <Image source={ICON_PATH.commissionUser} style={styles.icon} />
          <AppText style={[styles.content, { color: Colors.blue3 }]} semiBold>
            {formatNumber(indirect)} đ
          </AppText>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ListLoading
            title={'Đang tải dữ liệu'}
            style={{ marginTop: 0 }}
            titleStyle={{ marginVertical: 0, marginTop: 12 }}
          />
        </View>
      ) : null}
    </View>
  );
});

export default InfoCommission;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    backgroundColor: Colors.primary5,
    borderRadius: 8,
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  boxContainer: {
    flex: 1,
  },
  boxTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  divider: {
    width: 1,
    height: '100%',
    marginHorizontal: 20,
    backgroundColor: Colors.neutral5,
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: 'center',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 6,
    color: Colors.green6,
  },
  icon: {
    width: 28,
    height: 28,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary5,
    top: 12,
    left: 16,
    right: 16,
  },
});
