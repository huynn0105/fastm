import { Alert, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DigitelClient from '../../../network/DigitelClient';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import CharAvatar from '../../../componentV3/CharAvatar';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import Rating from '../../Collaborator/common/Rating';
import ListLoading from '../../../componentV3/ListComponents/ListLoading';
import ListEmpty from '../../../componentV3/ListComponents/ListEmpty';

const DEBOUNCE_TIME = 1000;

const ListSupporter = memo((props) => {
  const {
    onPressSelectItem,
    itemSelected,
    filters,
    onPressItem,
    isAutoSelect,
    isReadyCallApi,
    ...rest
  } = props;

  const isDebouncing = useRef(false);
  const timeout = useRef();
  const currentFilters = useRef(filters);

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isCallApi, setIsCallApi] = useState(false);

  const renderItem = useCallback(
    ({ item }) => {
      const isChecked = itemSelected?.toUserID === item?.toUserID;

      return (
        <Item
          item={item}
          onPressSelect={onPressSelectItem}
          onPress={onPressItem}
          isChecked={isChecked}
          isHideNumStar
        />
      );
    },
    [itemSelected?.toUserID, onPressItem, onPressSelectItem],
  );

  const onGetData = useCallback(async () => {
    try {
      if (!Object.keys(currentFilters.current)?.length || !isReadyCallApi) return;
      const body = currentFilters.current;
      if (typeof body?.text !== undefined && body?.text === '') {
        setData([]);
        return;
      }
      setIsCallApi(true);
      const res = await DigitelClient.getListSupporter(body);
      if (res?.data?.status) {
        if (isAutoSelect) {
          onPressSelectItem?.(res?.data?.data?.[0]);
        }
        setData(res?.data?.data);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [isAutoSelect, isReadyCallApi, onPressSelectItem]);

  const onGetDataDebounce = useCallback(() => {
    if (!isDebouncing?.current) {
      isDebouncing.current = true;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        onGetData();
        isDebouncing.current = false;
        clearTimeout(timeout.current);
      }, DEBOUNCE_TIME);
    }
  }, [onGetData]);

  useEffect(() => {
    currentFilters.current = filters;
    setIsLoading(true);
    if (currentFilters.current?.text) {
      onGetDataDebounce();
    } else {
      onGetData();
    }
  }, [filters, onGetData, onGetDataDebounce]);

  if (
    typeof filters?.text !== 'undefined' &&
    (!filters?.text?.length || (!isLoading && !data?.length && !isCallApi))
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ListLoading title={'Đang tìm kiếm'} />
      ) : !data?.length ? (
        <ListEmpty title={'Không tìm thấy người dẫn dắt '} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          {...rest}
        />
      )}
    </View>
  );
});

export default ListSupporter;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

const Item = memo((props) => {
  const { item, isChecked, onPress, onPressSelect, isHideNumStar } = props;
  const { avatarImage, fullName, title, avgRating, district } = item;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress?.(item);
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.primary5,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <CharAvatar
          source={hardFixUrlAvatar(avatarImage)}
          defaultName={fullName}
          style={{ width: 40, height: 40, borderRadius: 64 / 2 }}
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 12,
              flexWrap: 'wrap',
            }}
          >
            <AppText style={{ fontSize: 14, lineHeight: 20, color: Colors.gray1 }}>
              {fullName}
            </AppText>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 4,
                backgroundColor: Colors.gray5,
                marginHorizontal: 8,
              }}
            />
            <AppText semiBold style={{ fontSize: 14, lineHeight: 20, color: Colors.blue3 }}>
              {title}
            </AppText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {district ? (
              <AppText
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  top: 1,
                  marginRight: 5,
                  color: Colors.gray5,
                }}
              >
                {district}
              </AppText>
            ) : (
              <>
                {isHideNumStar ? null : (
                  <AppText
                    semiBold
                    style={{ fontSize: 13, lineHeight: 18, top: 1, marginRight: 5 }}
                  >
                    {avgRating}
                  </AppText>
                )}
                <Rating
                  star={Number(avgRating)}
                  size={16}
                  space={0}
                  style={styles.rating}
                  colorInActive={Colors.neutral4}
                />
              </>
            )}
          </View>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            onPressSelect?.(item);
          }}
        >
          <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
            {isChecked ? (
              <AppText
                style={{ fontSize: 13, lineHeight: 18, color: Colors.primary2, marginRight: 4 }}
              >
                Chọn
              </AppText>
            ) : null}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 24 / 2,
                borderWidth: 2,
                borderColor: isChecked ? Colors.primary2 : Colors.neutral3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isChecked ? (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 15 / 2,
                    backgroundColor: Colors.primary2,
                  }}
                ></View>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
});
