import React, { Component } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  Animated,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Animatable from 'react-native-animatable';
import SideSwipe from 'react-native-sideswipe';
import PageControl from 'react-native-page-control';
import HTMLView from 'react-native-htmlview';

import AppStyles from 'app/constants/styles';
import KJTextButton from 'app/common/KJTextButton';
import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

import UserAppsLightControl from './UserAppsLightControl';
import DelModControl from './DelModControl';


/* eslint-disable */
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');
const SCROLL_WIDTH = SCREEN_SIZE.width - (32 + 28 + 16);

const FIRST_CAROUSEL_KEY = 'FIRST_CAROUSEL_KEY';

const _ = require('lodash');

class ContentViewTabUser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      showGuideCarousel: false,
    };

    this.textRotateRightVisible = false;
    this.textRotateLeftVisible = true;
    this.animationTemp = new Animated.Value(1);

    this.endindCarouselScrolling = false;
  }

  componentDidMount() {
    this.checkShowGuideCarousel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  checkShowGuideCarousel = () => { // eslint-disable-line
    const asyncTask = async () => {
      const value = await AsyncStorage.getItem(FIRST_CAROUSEL_KEY);
      if (value === null) {
        this.setState({
          showGuideCarousel: true,
        });
      }
    };
    asyncTask();
  }

  didScrollCarousel = () => {
    if (this.state.showGuideCarousel === true) {
      AsyncStorage.setItem(FIRST_CAROUSEL_KEY, 'true');
      this.setState({
        showGuideCarousel: false,
      });
    }
  }

  moveInFrom = (index) => {  // eslint-disable-line
    if (this.handleViewRef) {
      if (index < this.props.selectedIndex) {
        // for first time
        if (index === -1) {
          this.handleViewRef.fadeIn(250);
        }
        else {
          this.handleViewRef.slideInRight(250);
        }
      }
      else {
        this.handleViewRef.slideInLeft(250);
      }
    }
  }
  moveOutFor = () => {
    this.handleViewRef.fadeOut(10);
  }

  onItemInfoPress = (item) => {
    this.props.onSubscriptionLightPress(item);
  }

  onRefPress = (item) => {
    this.props.onRefSubLightPress(item);
  }

  onTextRotatePress = () => {
    const index = this.state.currentIndex;
    this.setState({
      currentIndex: index === 0 ? 1 : 0,
    }, () => {
      this.endindCarouselScrolling = true;
      if (this.state.showGuideCarousel) {
        this.didScrollCarousel();
      }
    });
  }

  handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    if (x > 20 && x < SCROLL_WIDTH - 20) {
      setTimeout(() => {
        this.showRotateTextLeft(false);
        this.showRotateTextRight(false);
      }, 0);
    }
    else if (x <= 20) {
      setTimeout(() => {
        this.showRotateTextLeft(true);
        this.showRotateTextRight(false);
      }, 0);
    }
    else {
      setTimeout(() => {
        this.showRotateTextLeft(false);
        this.showRotateTextRight(true);
      }, 0);
    }

    if (!this.endindCarouselScrolling && this.props.onScrollingChild) {
      this.props.onScrollingChild(true);
    }
  }

  indexCarouselChanged = (index) => {
    this.endindCarouselScrolling = true;
    if (this.props.onScrollingChild) {
      this.props.onScrollingChild(false);
    }
    setTimeout(() => {
      this.setState({ currentIndex: index });
    }, 250);
    setTimeout(() => {
      this.endindCarouselScrolling = false;
    }, 500);

    if (index !== 0) {
      if (this.state.showGuideCarousel) {
        this.didScrollCarousel();
      }
    }
  }

  showRotateTextLeft = (visible) => {
    this.textRotateLeftVisible = this.showRotateText(
      this.textRotateLeft,
      this.textRotateLeftVisible,
      visible,
    );
  }

  showRotateTextRight = (visible) => {
    this.textRotateRightVisible = this.showRotateText(
      this.textRotateRight,
      this.textRotateRightVisible,
      visible,
    );
  }

  showRotateText = (text, textVisible, visible) => {
    if (text && textVisible !== visible) {
      visible ? text.fadeIn() : text.fadeOut(); // eslint-disable-line
    }
    return visible;
  }

  renderGuideCarousel = () => {
    return (
      <Animatable.View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 100,
        }}
        animation="fadeOutLeft"
        iterationCount="infinite"
        duration={2000}
        easing="ease-out"
        useNativeDriver
        pointerEvents="none"
      >
        <KJImage
          style={{
            width: 82,
            height: 80,
          }}
          source={require('./img/swipeUp.png')}
        />
      </Animatable.View>
    );
  }

  renderCarousel = () => {
    const { showGuideCarousel } = this.state;
    const subs = this.props.subscriptions;

    return (
      <View style={[
        {
          width: this.props.isActive ? SCREEN_SIZE.width : 0,
          marginTop: 12,
          paddingBottom: 24,
        }]}
      >
        <SideSwipe
          index={this.state.currentIndex}
          itemWidth={SCROLL_WIDTH}
          data={subs}
          threshold={100}
          useNativeDriver
          onIndexChange={this.indexCarouselChanged}
          handleScroll={this.handleScroll}
          useVelocityForIndex
          shouldCapture={({ dx }: GestureState) => {
            return Math.abs(dx) > 2;
          }}
          renderItem={({ itemIndex, item }) => { // eslint-disable-line
            return this.renderItemCarousel(item, itemIndex);
          }}
          parentScrolling={this.props.parentScrolling}
        />
        <PageControl
          style={{ position: 'absolute', left: 0, right: 0, bottom: 4 }}
          numberOfPages={2}
          currentPage={this.state.currentIndex}
          hidesForSinglePage
          pageIndicatorTintColor="#cacaca"
          currentPageIndicatorTintColor="#636363"
          indicatorStyle={{ borderRadius: 4 }}
          currentIndicatorStyle={{ borderRadius: 4 }}
          indicatorSize={{ width: 8, height: 8 }}
          onPageIndicatorPress={this.onItemTap}
        />
        {
          showGuideCarousel &&
          this.renderGuideCarousel()
        }
      </View>
    );
  }

  renderItemCarousel = (item, index) => {
    return (
      <View
        style={[styles.itemContainer, {
          marginLeft: index === 0 ? 15 : 16,
          marginRight: index === 1 ? 16 : 0,
          paddingLeft: 4,
          paddingRight: 4,
        }]}
      >
        <Text style={styles.titleContainerBalance}>
          {item.label}
        </Text>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceItem}>
            <Text style={styles.text}>
              {item.commission.label}
            </Text>
            <Text style={styles.balanceVnd}>
              {item.commission.value}
            </Text>
          </View>
          <View style={styles.verticalSeparator} />
          <View style={styles.balanceItem}>
            <Text style={styles.text}>
              {item.point.label}
            </Text>
            <Text style={styles.balanceScore}>
              {item.point.value}
            </Text>
          </View>
        </View>
        {
          <View style={{ marginLeft: 4, marginRight: 4 }}>
            <HTMLView
              value={`<p>${item.description}</p>`}
              stylesheet={htmlStyles}
            />
          </View>
        }
        <KJTextButton
          buttonStyle={[AppStyles.button, {
            alignItems: 'flex-start',
            marginTop: 0,
            borderColor: '#0000',
          }]}
          textStyle={[AppStyles.button_text, {
            marginLeft: 16,
            marginRight: 16,
            fontSize: 14,
            fontWeight: '400',
            color: '#fff',
          }]}
          text={index === 0 ? 'Giới thiệu KH' : 'Giới thiệu CTV'}
          radientColor={index === 0 ? [] : ['#94d422', '#429321']}
          onPress={() => this.onRefPress(item)}
        />
        {
          <Animatable.View
            ref={ref => {
              if (index === 0) {
                this.textRotateRight = ref;
              }
              else { this.textRotateLeft = ref; }
            }
            }
            style={[index === 0 ? styles.textRotateRightContainer : styles.textRotateLeftContainer]}
            animation={index === 0 ? 'fadeOut' : ''}
            useNativeDriver
          >
            <KJTouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.onTextRotatePress}
            >
              <KJImage
                source={index === 0 ? require('./img/blueExpand.png') : require('./img/greenExpand.png')}
                style={{ width: 32, height: 180, marginBottom: 16, marginTop: 16 }}
                resizeMode="contain"
              />
            </KJTouchableOpacity>
          </Animatable.View>
        }
      </View>
    );
  }

  renderItemInfo = (item) => {
    return (
      <KJTouchableOpacity
        key={item.label}
        onPress={() => this.onItemInfoPress(item)}
      >
        <View style={styles.infoRow}>
          <KJImage
            style={styles.infoImage}
            resizeMode="contain"
            source={{ uri: item.img }}
          />
          <Text style={styles.infoTitle}>
            {item.label}
          </Text>
          <KJImage
            style={styles.infoIconMore}
            source={require('./img/grayArrow.png')}
          />
        </View>
      </KJTouchableOpacity>
    );
  }

  renderItems = () => {
    const subs = this.props.subscriptions;
    return (
      <View style={{ flexDirection: 'row', flex: 1, marginBottom: 42 }}>
        {
          subs && subs.length > 0 &&
          this.renderSubItems(subs[0].list, subs[0].newsList, this.state.currentIndex === 0)
        }
        {
          subs && subs.length > 1 &&
          this.renderSubItems(subs[1].list, subs[1].newsList, this.state.currentIndex === 1)
        }
      </View>
    );
  }

  renderSubItems = (items1, items2, active) => {
    return (
      <Animatable.View
        ref={ref => { this.handleViewRef = ref; }}
        style={[
          {
            // work on android
            width: active ? SCREEN_SIZE.width : 0,
            position: active ? 'relative' : 'absolute',
            overflow: 'hidden',
            // work on ios
            display: active ? 'flex' : 'none',
          },
          this.props.styles]}
        animation={this.state.currentIndex === 0 ? 'slideInLeft' : 'slideInRight'}
        duration={350}
        useNativeDriver
      >
        <View style={styles.spaceView} />
        {
          items1.map(item => {
            return this.renderItemInfo(item);
          })
        }
        <View style={styles.spaceView} />
        {
          items2.map(item => {
            return this.renderItemInfo(item);
          })
        }
      </Animatable.View>
    );
  }

  render() {
    const userAppListData = this.props.userAppListData;
    const userAppLightListData = this.props.userAppLightListData;
    return (
      <Animatable.View
        ref={ref => { this.handleViewRef = ref; }}
        style={[
          {
            // work on android
            width: this.props.isActive ? SCREEN_SIZE.width : 0,
            // position: this.props.isActive ? 'relative' : 'absolute',
            // work on ios
            display: this.props.isActive ? 'flex' : 'none',
          },
          this.props.styles]}
        // animation="fadeOut"
        useNativeDriver
      >
        {
          (this.props.delMod && this.props.delMod.title) ?
            <DelModControl
              delMod={this.props.delMod}
              onItemPress={this.props.onDelModPress}
            />
            : null
        }
        {
          (userAppListData.length > 0 || userAppLightListData.length > 0) ?
            <UserAppsLightControl
              data={userAppListData}
              extraData={userAppListData}
              onItemPress={this.props.onUserAppPress}
              showTitle={false}
              userAppItemStyle={styles.userAppItemStyle}
              style={styles.userAppContainer}
              lightData={userAppLightListData}
              onItemLightPress={this.props.onUserAppLightPress}
            />
            : null
        }
        {
          <View style={styles.sectionSeparatorWhite} />
        }
        {
          this.props.subscriptions && this.props.subscriptions.length > 0 &&
          this.renderCarousel()
        }
        {
          this.props.subscriptions && this.props.subscriptions.length > 0 &&
          this.renderItems()
        }
        {
          this.props.isGettingUserAppLightList &&
          <ActivityIndicator
            style={styles.headerAccessoryButton}
            animating
            color="#404040"
            size="small"
          />
        }
      </Animatable.View>
    );
  }
}

export default ContentViewTabUser;

const styles = StyleSheet.create({
  userAppItemStyle: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 0,
    borderColor: '#0000',
    borderWidth: 0,
    shadowOffset: { width: 0.0, height: 0.0 },
    shadowColor: '#0000',
    shadowOpacity: 0.0,
    shadowRadius: 0,
    elevation: 0,
  },
  userAppContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
    marginTop: 6,
  },
  itemContainer: {
    flex: 1,
    width: SCREEN_SIZE.width - 32 - 28,
    height: 216,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#d0d0d0',
    borderWidth: 1,
  },
  titleContainerBalance: {
    fontSize: 14,
    color: '#0008',
    fontWeight: 'bold',
  },
  balanceContainer: {
    flex: 0,
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  balanceItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    color: '#0008',
  },
  textBold: {
    fontSize: 12,
    color: '#0008',
    fontWeight: 'bold',
  },
  textRotateRightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  textRotateRight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0663c8',
  },
  textRotateLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  textRotateLeft: {
    fontSize: 13,
    fontWeight: '600',
    color: '#429321',
  },
  balanceVnd: {
    fontSize: 15,
    color: '#4286f4',
    fontWeight: 'bold',
    marginTop: 6,
  },
  balanceScore: {
    fontSize: 15,
    color: '#d88604',
    fontWeight: 'bold',
    marginTop: 6,
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: '#e8e8e8',
  },
  description: {
    fontSize: 12,
    color: '#0008',
    marginBottom: 16,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },

  spaceView: {
    height: 12,
    backgroundColor: '#fff0',
  },

  infoRow: {
    flexDirection: 'row',
    height: 66,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  infoImage: {
    width: 46,
    height: 46,
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 14,
  },
  infoTitle: {
    flex: 1,
    fontSize: 14,
    color: '#0e0e0e',
    marginTop: 5,
    marginBottom: 5,
  },
  infoIconMore: {
    width: 11,
    height: 19,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  headerAccessoryButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 8,
  },
});

const htmlStyles = StyleSheet.create({
  strong: {
    fontSize: 12,
    color: '#0008',
    fontWeight: 'bold',
  },
  p: {
    fontSize: 12,
    color: '#0008',
    marginBottom: 16,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
});
