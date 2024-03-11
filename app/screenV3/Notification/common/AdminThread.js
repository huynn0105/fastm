import { StyleSheet, View } from 'react-native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { SceneMap, TabView } from 'react-native-tab-view';
import SystemThread from '../../../models/SystemThread';
import ListNotification from '../components/ListNotification';
import FilterNotification from '../components/FilterNotification';
import Colors from '../../../theme/Color';
import { TAB_TYPE } from '../Notification.constants';

const AdminThread = memo((props) => {
  const { navigation, isUnread } = props;
  const thread = props?.thread || SystemThread.adminThread();
  const initIndex = useMemo(() => Number(props?.initIndex || 0) || 0, [props?.initIndex]);

  const category = useMemo(() => thread?.type, [thread?.type]);

  const [index, setIndex] = useState(initIndex);
  const [keyword, setKeyword] = useState('');

  const onResetFilters = useCallback(() => {
    setKeyword('');
  }, []);

  const [routes] = useState([
    { key: TAB_TYPE.ALL },
    { key: TAB_TYPE.FLAG },
    { key: TAB_TYPE.FINANCIAL },
    { key: TAB_TYPE.AFFILIATE },
    { key: TAB_TYPE.INSURANCE },
    { key: TAB_TYPE.COMPETE },
    { key: TAB_TYPE.OTHER },
  ]);

  const renderScene = useMemo(
    () =>
      SceneMap({
        [TAB_TYPE.ALL]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.ALL]}
            category={category}
            type={TAB_TYPE.ALL}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.FLAG]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.FLAG]}
            category={category}
            type={TAB_TYPE.FLAG}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.FINANCIAL]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.FINANCIAL]}
            category={category}
            type={TAB_TYPE.FINANCIAL}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.AFFILIATE]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.AFFILIATE]}
            category={category}
            type={TAB_TYPE.AFFILIATE}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.INSURANCE]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.INSURANCE]}
            category={category}
            type={TAB_TYPE.INSURANCE}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.COMPETE]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.INSURANCE]}
            category={category}
            type={TAB_TYPE.COMPETE}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
        [TAB_TYPE.OTHER]: () => (
          <ListNotification
            // filter={filters[TAB_TYPE.OTHER]}
            category={category}
            type={TAB_TYPE.OTHER}
            keyword={keyword}
            navigation={navigation}
            isUnread={isUnread}
          />
        ),
      }),
    [category, isUnread, keyword, navigation],
  );

  const renderTabBar = useCallback((propsTabBar) => {
    setIndex(propsTabBar.navigationState.index);
    return null;
  }, []);

  return (
    <>
      <View style={styles.container}>
        <FilterNotification
          onChangeIndex={setIndex}
          // filters={filters}
          onResetFilters={onResetFilters}
          // onChangeFilter={onChangeFilter}
          onChangeKeySearch={setKeyword}
          keyword={keyword}
          parentIndex={index}
          category={category}
        />
        {/* <View style={styles.container}> */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
          lazy
        />
        {/* </View> */}
      </View>
    </>
  );
});

export default AdminThread;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
