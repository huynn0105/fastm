import React from 'react';
import { View, Animated, Easing } from 'react-native';
import Colors from '../../theme/Color';
import Pie from './components/Pie';

const AnimatedPie = Animated.createAnimatedComponent(Pie);

export default class PieChart extends React.PureComponent {
  state = {
    endAngle: new Animated.Value(0),
    startAngle: new Animated.Value(0),
    outerElevation: new Animated.Value(0),
    indexToFocus: null,
    isLoading: false,
  };

  reset = () =>
    new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(this.state.endAngle, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(this.state.startAngle, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => resolve());
    });

  animate = () =>
    new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(this.state.endAngle, {
          toValue: 4,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(this.state.startAngle, {
          toValue: 2,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]).start(() => resolve());
    });

  focus = (indexToFocus) => {
    Animated.timing(this.state.outerElevation, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      this.setState({ indexToFocus });
      Animated.timing(this.state.outerElevation, {
        toValue: 5,
        duration: 200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start();
    });
  };

  startLoading = () =>
    new Promise((resolve) => {
      this.setState(
        {
          isLoading: true,
        },
        () => {
          this.loopAnimation = Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.endAngle, {
                toValue: 0.35,
                duration: 0,
                useNativeDriver: false,
                easing: Easing.linear,
              }),
              Animated.timing(this.state.startAngle, {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
                easing: Easing.linear,
              }),
              Animated.parallel([
                Animated.timing(this.state.endAngle, {
                  toValue: 2.35,
                  duration: 1500,
                  useNativeDriver: false,
                  easing: Easing.linear,
                }),
                Animated.timing(this.state.startAngle, {
                  toValue: 2,
                  duration: 1500,
                  useNativeDriver: false,
                  easing: Easing.linear,
                }),
              ]),
            ]),
          );
          this.loopAnimation.start(() => resolve());
        },
      );
    });

  stopLoading = () => {
    if (this.loopAnimation) {
      this.loopAnimation.stop();
    }
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const {
      data,
      innerRadius,
      outerRadius,
      padAngle,
      pieStyle,
      containerStyle,
      children,
      valueAccessor,
      sort,
      animate,
    } = this.props;
    const { outerElevation, indexToFocus, endAngle, startAngle, isLoading } = this.state;

    const animEndAngle = endAngle ? Animated.multiply(endAngle, Math.PI) : 0;
    const animStartAngle = startAngle ? Animated.multiply(startAngle, Math.PI) : 0;

    return (
      <View style={containerStyle}>
        {isLoading ? (
          <>
            <AnimatedPie
              pieStyle={pieStyle}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              valueAccessor={valueAccessor}
              sort={sort}
              data={[
                {
                  title: `title-1`,
                  color: Colors.neutral5,
                  value: 100,
                  key: '1',
                },
              ]}
            />
            <View style={{ position: 'absolute' }}>
              <AnimatedPie
                pieStyle={pieStyle}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                valueAccessor={valueAccessor}
                sort={sort}
                startAngle={animStartAngle}
                endAngle={animEndAngle}
                animate
                data={[
                  {
                    title: `title-1`,
                    color: Colors.gray8,
                    value: 100,
                    key: '1',
                  },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <AnimatedPie
              pieStyle={pieStyle}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              startAngle={animStartAngle}
              endAngle={animEndAngle}
              padAngle={padAngle}
              valueAccessor={valueAccessor}
              sort={sort}
              animate={animate}
              elevation={outerElevation}
              indexToFocus={indexToFocus}
              data={data}
            />
            {React.Children.map(
              children,
              (child) => child && React.cloneElement(child, { focus: this.focus, data }),
            )}
          </>
        )}
      </View>
    );
  }
}
