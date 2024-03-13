import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/Color';
import { SH } from '../../constants/styles';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import { SceneMap } from 'react-native-tab-view';
import ListLink from './common/ListLink';
import { useDispatch } from 'react-redux';
import ButtonCountCustomerWaiting from '../Customer/common/ButtonCountCustomerWaiting';
import { CollapsibleHeaderTabView } from '../../componentV3/TabViewCollapsibleHeader';
import { SCREEN_WIDTH } from '../../utils/Utils';
import CustomTabBar from '../Collaborator/components/CustomTabBar';
import StatisticsLink from './common/StatisticsLink';
import BottomActionSheet from '../../components2/BottomActionSheet';

const EDGES = ['right', 'bottom', 'left'];

const AdLink = memo((props) => {
  const { navigation } = props;

  const [routes] = useState([
    { key: 'first', title: 'Danh sách' },
    { key: 'second', title: 'Thống kê' },
  ]);
  const [index, setIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [userGuide, setUserGuide] = useState([]);

  const bottomSheetRef = useRef();
  const listLinkRef = useRef();

  const insets = useSafeAreaInsets();

  const renderScene = useMemo(
    () =>
      SceneMap({
        first: () => <ListLink ref={listLinkRef} index={0} navigation={navigation} />,
        second: () => (
          <StatisticsLink index={1} navigation={navigation} onUserGuideChange={setUserGuide} />
        ),
      }),
    [],
  );

  const renderTabBar = useCallback(
    (tabBarProps) => {
      return (
        <CustomTabBar
          {...tabBarProps}
          index={index}
          containerStyle={{
            marginVertical: 0,
            paddingVertical: 8,
            backgroundColor: Colors.neutral5,
            height: 56,
          }}
        />
      );
    },
    [index],
  );

  const onRefreshList = useCallback(() => {
    listLinkRef?.current?.refreshList();
  }, []);

  const onGoToCreateLink = useCallback(() => {
    navigation.navigate('CreateAdLinkScreen', {
      onRefreshList,
    });
  }, [navigation, onRefreshList]);

  const makeHeaderHeight = useCallback(() => headerHeight, [headerHeight]);

  const renderHeader = useCallback(() => {
    return (
      <View
        style={{ paddingBottom: 8 }}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.buttonAddContainer}>
          <TouchableOpacity
            style={[
              styles.buttonAddContainer,
              { flex: 1, justifyContent: 'flex-start', paddingHorizontal: 16 },
            ]}
            onPress={onGoToCreateLink}
          >
            <Image source={ICON_PATH.addLink} style={styles.iconAdd} />
            <AppText medium style={styles.textAdd}>
              Thêm liên kết
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonAddContainer,
              { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16 },
            ]}
            onPress={() => {
              bottomSheetRef?.current?.open();
            }}
          >
            <AppText medium style={styles.textAdd}>
              Tìm hiểu thêm
            </AppText>
            <Image
              source={ICON_PATH.infoLink}
              style={[styles.iconAdd, { marginRight: 0, marginLeft: 8 }]}
            />
          </TouchableOpacity>
        </View>
        <ButtonCountCustomerWaiting
          isHideWhenNodata
          style={{ marginHorizontal: 16, marginTop: 16 }}
          navigation={navigation}
        />
      </View>
    );
  }, [navigation, onGoToCreateLink]);

  return (
    <SafeAreaView edges={EDGES} style={styles.container}>
      <CollapsibleHeaderTabView
        makeHeaderHeight={makeHeaderHeight}
        renderScrollHeader={renderHeader}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        tabbarHeight={56}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
      <BottomActionSheet
        ref={bottomSheetRef}
        headerText={'Hướng dẫn hữu ích'}
        canClose
        haveCloseButton
        render={() => {
          return (
            <View style={[styles.itemFooterContainer, { paddingBottom: insets.bottom || 16 }]}>
              {userGuide.map((item, idx) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetRef.current?.close();
                      navigation?.navigate('WebView', {
                        mode: 0,
                        title: item?.title,
                        url: item?.url,
                      });
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Image
                      source={{ uri: item?.icon }}
                      style={{ width: 24, height: 24, marginRight: 12 }}
                    />
                    <View style={[styles.itemGuide, !idx && { borderTopWidth: 0 }]}>
                      <AppText medium style={styles.itemGuideText}>
                        {item?.title}
                      </AppText>
                      <Image source={ICON_PATH.arrow_right} style={styles.itemArrow} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
});

export default AdLink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral5,
  },
  buttonAddContainer: {
    height: 48,
    backgroundColor: Colors.primary5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textAdd: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.primary2,
  },
  iconAdd: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  itemFooterContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.neutral5,
  },
  itemGuide: {
    borderTopWidth: 1,
    borderTopColor: `${Colors.neutral3}80`,
    paddingVertical: SH(12),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemGuideText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray5,
    marginRight: 10,
    flex: 1,
  },

  itemArrow: {
    width: 16,
    height: 16,
  },
});
