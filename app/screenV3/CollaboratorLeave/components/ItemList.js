import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { getDefaultAvatar } from '../../../utils/userHelper';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { TouchableOpacity } from 'react-native';
import { getTimeBetween } from '../../../utils/dateHelper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SW } from '../../../constants/styles';
import { IS_IOS } from '../../../utils/Utils';

const ItemList = memo(({ item, index, openChat, openCall, type, onOpenCollaborator }) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const onCloseTooltip = useCallback(() => {
    setToolTipVisible(false);
  }, []);
  const onOpenTooltip = useCallback(() => {
    setToolTipVisible(true);
  }, []);

  const remainingDaysDeleteAccount = useMemo(() => {
    const countdown = moment(item?.requestDeleteDate).diff(moment(), 'second');
    var days = Math.floor(countdown / 24 / 60 / 60);

    return days;
  }, [item?.requestDeleteDate]);

  return (
    <TouchableWithoutFeedback onPress={() => onOpenCollaborator(item)}>
      <View
        style={[
          styles.itemContainer,
          index ? { borderTopWidth: 1, borderTopColor: Colors.gray4 } : { marginTop: 10 },
        ]}
      >
        <CharAvatar
          source={hardFixUrlAvatar(item?.avatar)}
          defaultImage={getDefaultAvatar('male')}
          style={{ marginTop: 16 }}
        />
        <View style={{ flex: 1, marginTop: 4 }}>
          <View style={styles.itemContactContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <AppText style={styles.itemText}>{item?.fullName}</AppText>
              <Image source={ICON_PATH.arrow_right} style={styles.itemIconArrow} />
            </View>
            <View style={{ flexDirection: 'row', height: 30, alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={1}
                style={{ padding: 11 }}
                onPress={() => openChat(item)}
              >
                <Image
                  source={ICON_PATH.message}
                  style={[
                    styles.itemIcon,
                    {
                      tintColor: Colors.primary2,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={{ padding: 11, paddingRight: 0 }}
                onPress={() => openCall(item)}
              >
                <Image source={ICON_PATH.outlinePhone} style={styles.itemIcon} />
              </TouchableOpacity>
            </View>
          </View>
          {type === 'departed' ? (
            <AppText
              style={{ marginHorizontal: 12, fontSize: 13, lineHeight: 18, color: Colors.sixRed }}
            >
              Đã rời đi
              <AppText
                style={{
                  marginHorizontal: 12,
                  fontSize: 13,
                  lineHeight: 18,
                  color: Colors.gray5,
                }}
              >{` - ${getTimeBetween(moment(item?.leaveTime))}`}</AppText>
            </AppText>
          ) : (
            <Tooltip
              isVisible={toolTipVisible}
              disableShadow
              contentStyle={{
                paddingHorizontal: 16,
                borderRadius: 8,
                width: SW(343),
              }}
              placement="top"
              content={
                type === 'working' ? (
                  <>
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                      <Image style={{ width: 28, height: 28 }} source={ICON_PATH.activity} />
                      <AppText
                        bold
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.purple,
                          flex: 1,
                        }}
                      >
                        {item?.info?.count_app}
                        <AppText
                          medium={IS_IOS}
                          style={{
                            fontSize: 16,
                            lineHeight: 24,
                            marginLeft: 4,
                            color: Colors.gray5,
                          }}
                        >
                          {' hồ sơ khách hàng được CTV này khởi tạo trên MFast'}
                        </AppText>
                      </AppText>
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
                    >
                      <Image style={{ width: 28, height: 28 }} source={ICON_PATH.outlineAdd} />
                      <AppText
                        bold
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.sixOrange,
                        }}
                      >
                        {item?.info?.not_work}
                      </AppText>
                      <AppText
                        medium
                        style={{ fontSize: 16, lineHeight: 24, marginLeft: 4, color: Colors.gray5 }}
                      >
                        ngày không làm việc
                      </AppText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderTopColor: Colors.gray4,
                      }}
                    >
                      <Image style={{ width: 28, height: 28 }} source={ICON_PATH.outlineMoney} />
                      <AppText
                        bold
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.thirdGreen,
                        }}
                      >
                        {item?.info?.not_income}
                      </AppText>
                      <AppText
                        medium
                        style={{ fontSize: 16, lineHeight: 24, marginLeft: 4, color: Colors.gray5 }}
                      >
                        ngày không phát sinh thu nhập
                      </AppText>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderTopColor: Colors.gray4,
                      }}
                    >
                      <Image style={{ width: 28, height: 28 }} source={ICON_PATH.outlineOut} />
                      <AppText
                        bold
                        style={{ fontSize: 16, lineHeight: 24, marginLeft: 4, color: Colors.blue3 }}
                      >
                        {item?.info?.not_open_app}
                      </AppText>
                      <AppText
                        medium
                        style={{ fontSize: 16, lineHeight: 24, marginLeft: 4, color: Colors.gray5 }}
                      >
                        ngày không mở ứng dụng MFast
                      </AppText>
                    </View>
                  </>
                )
              }
              backgroundColor={'rgba(10, 10, 40, 0.85)'}
              onClose={onCloseTooltip}
            >
              <TouchableWithoutFeedback onPress={onOpenTooltip}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.primary5,
                    alignSelf: 'flex-start',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  {type === 'working' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 25 }}>
                      <Image style={styles.itemIcon} source={ICON_PATH.activity} />
                      <AppText
                        style={{
                          fontSize: 13,
                          lineHeight: 18,
                          marginLeft: 4,
                          color: Colors.purple,
                        }}
                      >
                        {item?.info?.count_app}
                      </AppText>
                    </View>
                  ) : (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 25 }}>
                        <Image style={styles.itemIcon} source={ICON_PATH.outlineAdd} />
                        <AppText
                          style={{
                            fontSize: 13,
                            lineHeight: 18,
                            marginLeft: 4,
                            color: Colors.sixOrange,
                          }}
                        >
                          {item?.info?.not_work}
                        </AppText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 25 }}>
                        <Image style={styles.itemIcon} source={ICON_PATH.outlineMoney} />
                        <AppText
                          style={{
                            fontSize: 13,
                            lineHeight: 18,
                            marginLeft: 4,
                            color: Colors.thirdGreen,
                          }}
                        >
                          {item?.info?.not_income}
                        </AppText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.itemIcon} source={ICON_PATH.outlineOut} />
                        <AppText
                          style={{
                            fontSize: 13,
                            lineHeight: 18,
                            marginLeft: 4,
                            color: Colors.blue3,
                          }}
                        >
                          {item?.info?.not_open_app}
                        </AppText>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Tooltip>
          )}
          {item?.requestDelete ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                marginBottom: 10,
                marginLeft: 12,
                marginTop: 6,
              }}
            >
              <Image source={ICON_PATH.trash2} style={{ width: 20, height: 20 }} />
              <AppText
                semiBold
                style={{ ontSize: 13, lineHeight: 18, marginLeft: 4, color: Colors.sixRed }}
              >
                Hủy tài khoản sau {remainingDaysDeleteAccount} ngày
              </AppText>
            </View>
          ) : (
            <View style={{ height: 6 }} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default ItemList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    // height: 70,
    // alignItems: 'center',
    marginHorizontal: 16,
  },
  itemContactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 12,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray1,
  },
  itemIconArrow: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginLeft: 7,
  },
  itemIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
