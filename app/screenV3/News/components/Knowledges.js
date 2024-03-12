import React, { memo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import get from 'lodash/get';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import { ScrollView } from 'react-navigation';
import { fonts } from '../../../constants/configs';

const TYPE_LIST = {
  BANNER: 'BANNER',
  HEADER: 'HEADER',
  ITEM: 'ITEM',
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Knowledges = ({ isRefreshing, onRefresh, knowledges, onItemPress }) => {
  const renderKnowledgeRow = ({ item, index }) => {
    const isLastIndex = index === listItem.length - 1;
    const isFirstIndex = index === 0;

    return (
      <Item
        item={item}
        index={index}
        isLastIndex={isLastIndex}
        isFirstIndex={isFirstIndex}
        onItemPress={onItemPress}
      />
    );
  };

  const renderImportantItem = ({ item, index }) => {
    const isLastIndex = index === listBanner.length - 1;
    return (
      <TouchableOpacity onPress={() => onItemPress(item)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: SW(16),
            paddingVertical: SH(12),
          }}
        >
          {item?.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: SW(32), height: SH(32), resizeMode: 'contain' }}
            />
          ) : (
            <View style={{ width: SW(32), height: SH(32) }} />
          )}
          <AppText
            medium
            style={{
              flex: 1,
              marginLeft: SW(16),
              fontSize: SH(16),
              color: Colors.primary4,
              lineHeight: SH(19),
            }}
          >
            {item?.title}
          </AppText>
          <Image source={ICON_PATH.arrow_right} style={{ with: SW(16), height: SH(16) }} />
        </View>
        {isLastIndex ? null : (
          <View
            style={{
              height: 1,
              backgroundColor: 'rgb(196,199,216)',
              width: SW(343),
              alignSelf: 'center',
              opacity: 0.3,
            }}
          ></View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHeader = (item) => {
    return (
      <View style={styles.headerContainer}>
        <AppText style={styles.headerTitle} semiBold>
          {item?.title || 'Danh sách kiến thức'}
        </AppText>
      </View>
    );
  };

  const listBanner = knowledges.filter((item) => item.type === 'BANNER');
  const listItem = knowledges.filter((item) => item.type !== 'BANNER' && item?.type !== 'HEADER');
  const itemHeader = knowledges.find((item) => item.type === 'HEADER');

  const renderImportantList = () => {
    return (
      <View>
        <FlatList
          data={listBanner}
          renderItem={renderImportantItem}
          keyExtractor={(item, index) => item.id || index.toString()}
          style={{ backgroundColor: Colors.primary5 }}
        />
        <View>{renderHeader(itemHeader)}</View>
      </View>
    );
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      {renderImportantList()}
      <FlatList
        // ListHeaderComponent={renderImportantList}
        data={listItem}
        renderItem={renderKnowledgeRow}
        keyExtractor={(item, index) => item.id || index.toString()}
        refreshControl={
          <RefreshControl
            style={{ backgroundColor: 'trasparent' }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.neutral4}
          />
        }
        style={{
          marginHorizontal: 16,
          borderRadius: 8,
          // borderWidth: 1,
          // borderColor: 'rgb(196,199,216)',
          // backgroundColor: Colors.primary5,
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});

export default Knowledges;

const Item = memo(
  ({ item, index, isLastIndex, isFirstIndex, onItemPress, isParentExtend, isChild }) => {
    const [isExtend, setIsExtend] = useState(false);

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            if (item?.extend?.length) {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  200,
                  LayoutAnimation.Types.easeInEaseOut,
                  LayoutAnimation.Properties.opacity,
                ),
              );
              setIsExtend((prev) => {
                const newState = !prev;
                return newState;
              });
            } else {
              onItemPress(item);
            }
          }}
          style={{
            backgroundColor: Colors.primary5,
            marginTop: isFirstIndex || isChild ? 0 : 16,
            borderRadius: 8,
            borderBottomLeftRadius: isExtend ? 0 : 8,
            borderBottomRightRadius: isExtend ? 0 : 8,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 16,
              paddingVertical: isChild ? 4 : 12,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 32,
                    height: 32,
                  }}
                />
              ) : (
                <View style={{ height: 32 }} />
              )}
              <AppText
                style={[
                  {
                    flex: 1,
                    marginLeft: 16,
                  },
                  !isChild
                    ? {
                        fontSize: 16,
                        lineHeight: 24,
                        color: Colors.gray1,
                        fontFamily: fonts.medium,
                      }
                    : {
                        fontSize: 14,
                        lineHeight: 20,
                        color: isExtend
                          ? Colors.primary2
                          : isParentExtend
                          ? Colors.gray1
                          : Colors.gray5,
                        fontFamily: isExtend ? fonts.semiBold : fonts.regular,
                      },
                ]}
                numberOfLines={2}
              >
                {item?.title}
              </AppText>
              <Image
                source={ICON_PATH.arrow_right}
                style={{
                  with: 16,
                  height: 16,
                  transform: [{ rotate: isExtend ? '90deg' : '0deg' }],
                }}
              />
            </View>
            {/* <ItemDetail onPress={this.onPress} details={item.ackDescription} /> */}
          </View>
          {(isChild && !isLastIndex) || (!isChild && isExtend) ? (
            <View
              style={{
                height: 1,
                left: isChild && isExtend ? 48 : item.imageUrl ? 64 : 32,
                right: 16,
                backgroundColor: Colors.gray4,
                alignSelf: 'center',
                position: 'absolute',
                bottom: 0,
              }}
            />
          ) : null}
        </TouchableOpacity>
        {isExtend ? (
          <View
            style={{
              paddingLeft: isChild ? 16 : 32,
              paddingBottom: 4,
              // backgroundColor: !isChildExtend && isExtend ? Colors.neutral5 : Colors.primary5,
              backgroundColor: Colors.primary5,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            {item?.extend?.map((_item, _index, data) => {
              const _isLastIndex = data?.length - 1 === _index;
              const _isFirstIndex = _index === 0;
              return (
                <Item
                  item={_item}
                  index={_index}
                  isLastIndex={_isLastIndex}
                  isFirstIndex={_isFirstIndex}
                  onItemPress={onItemPress}
                  isParentExtend={isExtend && isChild}
                  isChild
                />
              );
            })}
            <View
              style={{
                position: 'absolute',
                width: 2,
                backgroundColor: Colors.gray4,
                // backgroundColor: 'red',
                left: 31,
                top: 0,
                bottom: 16,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  left: -10 / 2 + 2 / 2,
                  top: -10 / 2,
                  borderRadius: 10 / 2,
                  backgroundColor: Colors.gray4,
                  // backgroundColor: 'red',
                }}
              />
            </View>
            {isChild ? (
              <View
                style={{
                  height: 1,
                  left: 31,
                  right: 16,
                  backgroundColor: Colors.gray4,
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                }}
              />
            ) : null}
          </View>
        ) : null}
      </>
    );
  },
);
