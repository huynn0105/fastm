import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import { BOTTOM_BAR_HEIGHT, TOP_MAIN_PADDING } from './Tabbar';
import { SH } from '../../constants/styles';
import AppText from '../../componentV3/AppText';
import Colors from '../../theme/Color';

const TabBarMTrade = memo((props) => {
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <>
      <View style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            height: BOTTOM_BAR_HEIGHT,
            paddingBottom: SH(6),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowRadius: 32,
            shadowOpacity: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: -TOP_MAIN_PADDING,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: TOP_MAIN_PADDING,
                left: 0,
                right: 0,
                bottom: 0,
                elevation: 3,
                shadowColor: '#000',
                backgroundColor: '#ffffff',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
          </View>
          {routes.map((route, routeIndex) => {
            const isRouteActive = routeIndex === activeRouteIndex;
            const isFirstRoute = routeIndex === 0;
            const isLastRoute = routeIndex === routes?.length - 1;

            const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

            return (
              <View
                key={routeIndex}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  borderTopLeftRadius: isFirstRoute ? 20 : 0,
                  borderTopRightRadius: isLastRoute ? 20 : 0,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
              >
                <TouchableOpacity
                  key={routeIndex}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    onTabPress({ route });
                  }}
                  onLongPress={() => {
                    onTabLongPress({ route });
                  }}
                  accessibilityLabel={getAccessibilityLabel({ route })}
                >
                  <View style={{ width: 24, height: 24 }}>
                    {renderIcon({ route, focused: isRouteActive, tintColor })}
                  </View>

                  <AppText
                    style={{
                      marginTop: 4,
                      height: 14,
                      fontSize: 10,
                      lineHeight: 14,
                      letterSpacing: 0,
                      textAlign: 'center',
                      color: isRouteActive ? Colors.primary2 : Colors.neutral2,
                    }}
                  >
                    {getLabelText({ route })}
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
});

export default TabBarMTrade;
