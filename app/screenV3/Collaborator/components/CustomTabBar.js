import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
const CustomTabBar = memo((props) => {
  return (
    <View style={[styles.container].concat(props?.containerStyle)}>
      <View style={styles.tabBarContainer}>
        {props.navigationState.routes.map((route, i) => {
          const isActive = props?.index === i;

          return (
            <>
              {i > 0 ? <View style={styles.line} /> : null}
              <TouchableOpacity
                key={route?.key}
                style={[styles.tabItem, isActive && { backgroundColor: Colors.action }]}
                onPress={() => {
                  props.jumpTo(route.key);
                  props?.onUpdateTabBarProps?.(props);
                }}
              >
                <AppText
                  semiBold={isActive}
                  medium={!isActive}
                  style={[styles.tabItemTitle, isActive && { color: Colors.primary5 }]}
                >
                  {route.title}
                </AppText>
              </TouchableOpacity>
            </>
          );
        })}
      </View>
    </View>
  );
});

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.primary5,
    borderRadius: 22,
  },
  tabItem: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemTitle: {
    fontSize: 14,
    color: Colors.gray5,
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: Colors.neutral4,
    opacity: 0.6,
  },
});
