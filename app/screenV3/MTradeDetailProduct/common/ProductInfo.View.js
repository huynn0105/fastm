import { Image, View } from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ButtonText from '../../../common/ButtonText';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import { TabView, SceneMap } from 'react-native-tab-view';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';
import { ScrollView } from 'react-native';

const ProductInfo = memo((props) => {
  const { data } = props;

  const initIndex = 0;

  const viewPagerRef = useRef();

  const [index, setIndex] = useState(initIndex);

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    setRoutes(
      data.map((item, idx) => {
        return {
          key: `${idx}`,
          title: item?.title,
          content: item?.content,
        };
      }),
    );
  }, [data]);

  const TabContent = useCallback(
    (item) => () => {
      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 4,
            minHeight: 30,
            backgroundColor: Colors.primary5,
          }}
        >
          <HTMLView html={item?.content} />
        </View>
      );
    },
    [],
  );

  const renderScene = useMemo(() => {
    var screenMap = {};
    routes.map((item) => {
      screenMap[item?.key] = TabContent(item);
    });
    return SceneMap(screenMap);
  }, [TabContent, routes]);

  const onFocusOnTab = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const renderTabBar = useCallback(
    (propsTab) => {
      return (
        <ScrollView
          horizontal
          contentContainerStyle={{ marginHorizontal: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {routes?.map((item, idx) => {
            const isActive = index === idx;
            return (
              <View style={{ alignItems: 'center' }}>
                <ButtonText
                  title={item?.title}
                  onPress={() => {
                    setIndex(idx);
                    viewPagerRef?.current?.setPage(idx);
                  }}
                  height={32}
                  style={{ marginHorizontal: 4, paddingHorizontal: 12 }}
                  buttonColor={isActive ? Colors.primary2 : Colors.primary5}
                  titleColor={isActive ? Colors.primary5 : Colors.gray5}
                  borderColor={isActive ? Colors.primary2 : Colors.primary5}
                />
                {isActive ? (
                  <Image
                    source={ICON_PATH.arrow}
                    style={{
                      width: 47,
                      height: 12,
                    }}
                  />
                ) : null}
              </View>
            );
          })}
        </ScrollView>
      );
    },
    [index, routes],
  );

  useEffect(() => {
    setTimeout(() => {
      viewPagerRef?.current?.setPage(initIndex);
    });
  }, [initIndex]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={onFocusOnTab}
    />
  );
});

export default ProductInfo;
