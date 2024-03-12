import { Alert, Image, StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useRef } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { SH, SW } from '../../../constants/styles';
import { Pressable } from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import HTMLView from 'react-native-render-html';
import moment from 'moment';

const TIME_DISABLE = 1000;

const ItemNotification = memo((props) => {
  const { item, onPressFlag, onPressDetail, isHideFlag } = props;

  const disabled = useRef(false);

  const onPress = useCallback(() => {
    onPressDetail?.(item);
  }, [item, onPressDetail]);

  const onPressStar = useCallback(() => {
    if (disabled.current) return;
    disabled.current = true;
    onPressFlag?.(item);
    setTimeout(() => {
      disabled.current = false;
    }, TIME_DISABLE);
  }, [item, onPressFlag]);

  return (
    <>
      {item?.isFirstDay ? (
        <View style={styles.dateContainer}>
          <View style={styles.line} />
          <View style={styles.dateBackground}>
            <AppText style={styles.date}>
              {moment(item?.createTime * 1000).format('DD/MM/YYYY')}
            </AppText>
          </View>
        </View>
      ) : null}
      <Pressable style={styles.container} onPress={onPress}>
        <View style={[styles.avatarContainer, !item?.image && { backgroundColor: Colors.blue5 }]}>
          <Image
            style={styles.avatar}
            source={item?.image ? { uri: item?.image } : ICON_PATH.mfastWhite}
          />
        </View>
        <View style={[styles.contentContainer, !item?.read && { borderColor: Colors.primary2 }]}>
          <View style={styles.contentHeader}>
            <AppText
              medium
              style={[styles.contentTitle, { color: item?.read ? Colors.gray1 : Colors.primary2 }]}
            >
              {item?.title}
            </AppText>
            {isHideFlag ? null : (
              <Pressable style={{ marginHorizontal: 12 }} onPress={onPressStar}>
                <Image
                  style={[
                    styles.contentIcon,
                    { tintColor: item?.flag ? Colors.thirdGreen : Colors.gray13 },
                  ]}
                  source={item?.flag ? ICON_PATH.boldStar : ICON_PATH.outlineStar}
                />
              </Pressable>
            )}
            <Image
              style={styles.contentIcon}
              source={item?.read ? ICON_PATH.checkboxOn : ICON_PATH.checkboxOff}
            />
          </View>
          <View style={styles.contentBody}>
            <HTMLView html={item?.details} />
            <View style={styles.footerContainer}>
              <AppText style={styles.time}>{moment(item?.createTime * 1000).format('LT')}</AppText>
              <View style={styles.row}>
                <AppText style={styles.more}>Khám phá ngay</AppText>
                <Image style={styles.icon} source={ICON_PATH.arrow_right_green} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </>
  );
});

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    marginTop: SH(16),
    flexDirection: 'row',
    marginHorizontal: SW(16),
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: Colors.primary5,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  contentContainer: {
    backgroundColor: Colors.primary5,
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.primary5,
    padding: 12,
  },
  contentTitle: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
  },
  contentBody: {
    marginTop: 8,
  },
  contentIcon: {
    width: 24,
    height: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  time: {
    color: Colors.gray5,
    fontSize: 13,
    lineHeight: 18,
  },
  more: {
    color: Colors.primary2,
    fontSize: 13,
    lineHeight: 18,
  },
  icon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 6,
  },
  dateContainer: {
    marginTop: SH(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SW(16),
  },
  dateBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: Colors.neutral5,
  },
  date: {
    fontSize: 12,
    backgroundColor: Colors.gray4,
    color: Colors.gray5,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    lineHeight: 16,
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray4,
  },
});
