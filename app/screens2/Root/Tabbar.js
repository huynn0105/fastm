import { connect } from 'react-redux';
import { isActiveTabbar } from 'app/redux/actions';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import React, { Component } from 'react';
import MainButton, { MAIN_BUTTON_AREA } from '../../components2/MainTabbarButton/index';
import colors from '../../theme/Color';
import { SH } from '../../constants/styles';
import AppText from '../../componentV3/AppText';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_SIZE = Dimensions.get('window');
export const TOP_MAIN_PADDING = (2.0 / 375) * SCREEN_SIZE.width;
const _ = require('lodash');

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillReceiveProps(props) {
    const oldState = this.props.navigation.state;
    const oldRoute = oldState.routes[oldState.index].routes[0];
    const oldParams = oldRoute.params;
    const wasVisible = !oldParams || oldParams.visible;

    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index].routes[0];
    const newParams = newRoute.params;
    const isVisible = !newParams || newParams.visible;

    if (wasVisible && !isVisible) {
      setTimeout(() => {
        this.setState({
          hidden: true,
        });
        this.props.isActiveTabbar(false);
      }, 0);
    } else if (isVisible && !wasVisible) {
      this.setState({
        hidden: false,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render() {
    if (this.state.hidden) {
      return null;
    }

    return (
      <>
        <View style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 1 }}>
          <BottomTabBar {...this.props} />
        </View>
        <MainButton navigation={this.props.navigation} />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  isActiveTabbar: (active) => dispatch(isActiveTabbar(active)),
});

export default connect(null, mapDispatchToProps)(withSafeAreaInsets(TabBar));

export const BOTTOM_BAR_HEIGHT = SH(66);

const styles = {
  container: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    backgroundColor: '#0000',
  },
};

const BottomTabBar = (props) => {
  const S = StyleSheet.create({
    container: {},
    tabButton: {},
  });

  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
    insets,
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <View
      style={{
        flexDirection: 'row',
        height: BOTTOM_BAR_HEIGHT,
        paddingBottom: SH(6),
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowRadius: 32,
        shadowOpacity: 1,
        elevation: 2,
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
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
      </View>
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const isFirstRoute = routeIndex === 0;
        const isLastRoute = routeIndex === routes?.length - 1;
        const isNextRouteCenter = routeIndex + 1 === routes?.length / 2;

        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <>
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
                    color: isRouteActive ? colors.primary2 : colors.neutral2,
                  }}
                >
                  {getLabelText({ route })}
                </AppText>
              </TouchableOpacity>
            </View>
            {isNextRouteCenter ? <View style={{ width: MAIN_BUTTON_AREA }} /> : null}
          </>
        );
      })}
    </View>
  );
};
