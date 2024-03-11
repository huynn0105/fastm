import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import { TAB_TYPE, getImage } from '../../Customer/Customer.constants';
import { SH, SW } from '../../../constants/styles';
import AppText from '../../../componentV3/AppText';
import { getNumberDayBetween } from '../../../utils/dateHelper';
import moment from 'moment';

const ProjectItem = memo(({ item, index, isItemFirstList, isItemLastList, onPress }) => {
  const color =
    item?.status === '1'
      ? Colors.thirdGreen
      : item?.status === '0'
      ? Colors.fiveOrange
      : item?.status === '2'
      ? Colors.fiveRed
      : Colors.primary2;
  const iconState =
    item?.status === '1'
      ? ICON_PATH.tick3
      : item?.status === '0'
      ? ICON_PATH.clock3
      : item?.status === '2'
      ? ICON_PATH.close5
      : ICON_PATH.edit2;

  return (
    <TouchableWithoutFeedback>
      <View>
        <TouchableOpacity
          disabled={!item?.url_detail}
          activeOpacity={0.9}
          onPress={onPress}
          style={[
            styles.row,
            {
              paddingHorizontal: SW(16),
              top: -1,
            },
            isItemLastList && {
              borderBottomLeftRadius: SH(12),
              borderBottomRightRadius: SH(12),
              overflow: 'hidden',
            },
          ]}
        >
          <View
            style={[
              styles.itemImageContainer,
              { alignSelf: 'flex-start', marginTop: isItemFirstList ? 8 : 12 },
            ]}
          >
            <Image style={styles.itemImage} source={{ uri: getImage(item) }} />
            <View
              style={[
                styles.itemIconState,
                {
                  backgroundColor: color,
                },
              ]}
            >
              <Image style={{ width: '85%', height: '85%' }} source={iconState} />
            </View>
          </View>
          <View
            style={[
              styles.itemInfo,
              isItemLastList && { paddingBottom: 16 },
              isItemFirstList && { paddingTop: 8 },
              !isItemFirstList && index > 0 && { borderTopWidth: 1, borderTopColor: Colors.gray4 },
            ]}
          >
            <View style={styles.row}>
              {item?.type !== TAB_TYPE.PAGE ? (
                <AppText style={styles.itemTitle} numberOfLines={1}>
                  {item?.projectName || item?.link_label}
                </AppText>
              ) : null}
              {item?.projectDescription ? (
                <>
                  <View style={styles.dot} />
                  <AppText style={[styles.itemTitle, { flex: 1 }]} numberOfLines={1}>
                    {item?.projectDescription}
                  </AppText>
                </>
              ) : null}
            </View>
            {item?.customer_label ? (
              <AppText
                style={[styles.text, { marginTop: item?.type === TAB_TYPE.PAGE ? 0 : SH(4) }]}
              >
                {'Link quảng cáo\n'}
                <AppText style={[styles.itemTextState, { color: Colors.gray1 }]} medium>
                  {item?.customer_label}
                </AppText>
              </AppText>
            ) : null}
            <AppText
              medium={isItemFirstList}
              style={[
                isItemFirstList ? styles.itemTextState : styles.textValue,
                { color, marginTop: SH(4), flex: 0 },
              ]}
            >
              {item?.need
                ? item?.statusText || item?.status_text
                : item?.lastProcessText ||
                  item?.status_text ||
                  (item?.status === '1'
                    ? 'Thành công'
                    : item?.status === '0'
                    ? 'Đang xử lý'
                    : 'Đã từ chối')}
            </AppText>
            <AppText style={[styles.text, { alignSelf: 'flex-start' }]}>
              {getNumberDayBetween(moment(item?.updatedDate || item?.created_at).valueOf())}
            </AppText>
          </View>
          {item?.url_detail ? (
            <Image
              source={ICON_PATH.arrow_right}
              style={[
                styles.iconSmall,
                {
                  marginLeft: SW(12),
                },
              ]}
              tintColor={Colors.primary3}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ProjectItem;

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.gray5,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.highLightColor,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
    marginRight: SW(8),
  },
  iconSmall: {
    width: SW(14),
    height: SH(14),
    resizeMode: 'contain',
  },
  textValue: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
    flex: 1,
  },
  itemImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.neutral5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: { width: '60%', height: '60%', resizeMode: 'contain', alignSelf: 'center' },
  itemIconState: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: SW(4),
    height: SW(4),
    borderRadius: SW(2),
    backgroundColor: Colors.neutral3,
    marginHorizontal: SW(6),
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemInfo: {
    justifyContent: 'space-between',
    marginLeft: SW(16),
    flex: 1,
    paddingVertical: 12,
  },
  itemTextState: {
    fontSize: 16,
    lineHeight: 22,
  },
});
