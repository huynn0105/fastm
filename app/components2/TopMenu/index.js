import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
const SCREEN_SIZE = Dimensions.get('window');
const _ = require('lodash');


class TopMenu extends Component {

  state = {
    leftPositionOfSelectedView: new Animated.Value(0.1),
    scaleXOfSelectedView: new Animated.Value(1),
    selectedIndex: 0,
  }

  componentDidMount() {
    this.onTabTapped(this.props.selectedIndex);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onTabTapped = (tab) => {
    if (this.movingView === true || this.state.selectedIndex === tab) {
      return;
    }
    this.movingView = true;
    this.selectTab(tab);
    setTimeout(() => {
      this.movingView = false;
      if (this.props.onTabTapped !== undefined) {
        this.props.onTabTapped(tab);
      }
    }, 500);
  }

  movingView = false;

  calLeftPositionForIndex = (index) => {
    const numOfBtn = this.props.dataButtons.length;
    const widthOfSelectedView = SCREEN_SIZE.width / numOfBtn;
    return widthOfSelectedView * index;
  }

  movingSelectedView(left, tab) {
    const scaleX = 1.15 + ((Math.abs(this.state.selectedIndex - tab)) / 3);

    Animated.parallel([
      Animated.timing(this.state.leftPositionOfSelectedView, {
        toValue: left,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(this.state.scaleXOfSelectedView, {
          toValue: scaleX,
          delay: 50,
          duration: 150,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.scaleXOfSelectedView, {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }
  selectTab = (tab) => {
    const left = this.calLeftPositionForIndex(tab);
    this.movingSelectedView(left, tab);
    if (tab !== this.state.selectedIndex) {
      this.setState({ selectedIndex: tab });
    }
  }

  renderButton = (title, tag, selected, unread) => {
    return (
      <TouchableOpacity
        key={tag}
        style={styles.touchable}
        onPressIn={() => { this.onTabTapped(tag); }}
        testID={`animated_tab_${tag}`}
      >
        <View style={styles.button}>
          <AppText style={
            selected ?
              styles.selectedTitle
              : styles.title
          }
          >
            {title}
          </AppText>
          {
            unread > 0 &&
            <AppText style={
              selected ?
                styles.selectedTitle
                : styles.title
            }
            >
              {` (${unread})`}
            </AppText>
          }
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { style, dataButtons } = this.props;

    // if (selectedIndex !== this.state.selectedIndex) {
    //   this.selectTab(selectedIndex);
    // }

    return (
      <View style={[styles.container, style]}>
        <View style={styles.buttonContainer}>
          {
            dataButtons.map((data) =>
              this.renderButton(data.title, data.tag, data.tag === this.state.selectedIndex, data.unread))
          }
        </View>
        <Animated.View
          style={[styles.selectedView, {
            transform: [{
              translateX: this.state.leftPositionOfSelectedView,
            }, {
              scaleX: this.state.scaleXOfSelectedView,
            },
            ],
            width: `${(1.0 / dataButtons.length) * 100}%`,
          }]}
        />
        <View style={styles.bottomLine} />
      </View>
    );
  }
}

TopMenu.contextTypes = {
  onTabTapped: PropTypes.func,
  dataButtons: PropTypes.array,
  selectedIndex: PropTypes.number,
};

TopMenu.defaultProps = {
  dataButtons: [],
  selectedIndex: 0,
};

export default TopMenu;

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: '#fff',
  },
  bottomLine: {
    height: 0.5,
    backgroundColor: '#0004',
  },
  buttonContainer: {
    height: 58,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  touchable: {
    flex: 0.25,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  imageContainter: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#0006',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
  },
  selectedTitle: {
    color: Colors.primary2,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
  },
  selectedView: {
    marginTop: 4,
    height: 1,
    backgroundColor: Colors.primary2,
    // opacity: 0.5,
  },
  badge: {
    paddingLeft: Platform.OS === 'ios' ? 5 : 4,
    paddingRight: Platform.OS === 'ios' ? 4 : 4,
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    paddingBottom: Platform.OS === 'ios' ? 2 : 0,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
    zIndex: 2,
    marginLeft: 4,
  },
});
