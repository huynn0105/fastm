import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import { getDefaultAvatar } from '../../../utils/userHelper';
import AppText from '../../../componentV3/AppText';
import { ICON_PATH } from '../../../assets/path';
import { TouchableOpacity } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { SW } from '../../../constants/styles';
import CheckBoxSquare from '../../../componentV3/CheckBoxSquare';

const ItemListNotWorking = memo(
  ({ item, index, openChat, openCall, type, onOpenCollaborator, isDeleteAll, onSelect }) => {
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const onCloseTooltip = useCallback(() => {
      setToolTipVisible(false);
    }, []);
    const onOpenTooltip = useCallback(() => {
      setToolTipVisible(true);
    }, []);

    const onChangeValue = useCallback(
      (v) => {
        onSelect?.(v, item?.userID);
        setIsDelete(v);
      },
      [item?.userID, onSelect],
    );

    useEffect(() => {
      if (!isDeleteAll) {
        setIsDelete(false);
      }
    }, [isDeleteAll]);

    return (
      <TouchableWithoutFeedback onPress={() => onOpenCollaborator(item)}>
        <View
          style={[
            styles.itemContainer,
            {
              borderTopWidth: 1,
              borderTopColor: Colors.gray4,
              alignItems: 'center',
            },
          ]}
        >
          <CheckBoxSquare
            value={isDeleteAll || isDelete}
            style={{ marginTop: 0 }}
            onChangeValue={onChangeValue}
            disabled={isDeleteAll}
          />
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              paddingVertical: 6,
            }}
          >
            <CharAvatar
              source={hardFixUrlAvatar(item?.avatar)}
              defaultImage={getDefaultAvatar('male')}
              style={{ width: 48, height: 48, borderRadius: 48 / 2 }}
            />
            <View style={{ flex: 1, paddingTop: 4, top: -2 }}>
              <View style={[styles.itemContactContainer, {}]}>
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
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 10,
                      }}
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
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.gray5,
                        }}
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
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.gray5,
                        }}
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
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.blue3,
                        }}
                      >
                        {item?.info?.not_open_app}
                      </AppText>
                      <AppText
                        medium
                        style={{
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 4,
                          color: Colors.gray5,
                        }}
                      >
                        ngày không mở ứng dụng MFast
                      </AppText>
                    </View>
                  </>
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
                  </View>
                </TouchableWithoutFeedback>
              </Tooltip>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

export default ItemListNotWorking;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
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
