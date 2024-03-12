import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import HTMLView from 'react-native-render-html';
import * as Animatable from 'react-native-animatable';
import Swipeout from 'react-native-swipeout';

import { NOTIFICATION_CATEGORIES } from '../../submodules/firebase/model/Notification';
import Colors from '../../theme/Color';
import CharAvatar from '../../components/CharAvatar';

import { isPhoneX } from '../../utils/Utils';

const TOP_IPHONEX_PADDING = isPhoneX() ? 14 : 0;

const SCREEN_SIZE = Dimensions.get('window');
const REMOVE_DURATION = 350;
const AUTO_REMOVE_DURATION = 4000;

class NotiRow extends PureComponent {
  constructor(props) {
    super(props);

    this.timer = null;
    const notification = this.props.notification;
    this.autoRemove(notification);
  }

  componentWillUnmount() {
    this.clearAutoRemoveTimer();
  }

  onCancelPress = (direction = null) => {
    if (this.props.onCancelPress) {
      this.removeWithDirectionAnimation(() => {
        this.props.onCancelPress(this.props.notification);
      }, direction);
    }
  };
  onDetailPress = () => {
    if (this.props.onDetailPress) {
      this.removeWithAnimation(() => {
        this.props.onDetailPress(this.props.notification);
      }, 200);
    }
  };
  onPress = () => {
    if (this.props.onPress) {
      this.removeWithAnimation(() => {
        this.props.onPress(this.props.notification);
      });
    }
  };

  clearAutoRemoveTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  autoRemove = (notification) => {
    if (notification.category === NOTIFICATION_CATEGORIES.CHAT) {
      this.clearAutoRemoveTimer();
      this.timer = setTimeout(() => {
        this.onCancelPress();
      }, AUTO_REMOVE_DURATION);
    }
  };

  removeWithAnimation = (completionCallback, duration) => {
    const aniDuration = duration || REMOVE_DURATION;
    if (this.containViewRef) {
      this.containViewRef.fadeOut(aniDuration);
      setTimeout(() => {
        completionCallback();
      }, aniDuration);
    } else {
      completionCallback();
    }
  };

  removeWithDirectionAnimation = (completionCallback, direction, duration) => {
    if (direction === 'left' || direction === 'right') {
      const aniDuration = duration || REMOVE_DURATION;
      if (this.containViewRef) {
        if (direction === 'left') {
          this.containViewRef.fadeOutRight(aniDuration);
        } else {
          this.containViewRef.fadeOutLeft(aniDuration);
        }

        setTimeout(() => {
          completionCallback();
        }, aniDuration);
      } else {
        completionCallback();
      }
    } else {
      this.removeWithAnimation(completionCallback, duration);
    }
  };

  onStaticPressExtendsListNotification = () => {
    const { onPressExtendsListNotification } = this.props;
    if (onPressExtendsListNotification) {
      onPressExtendsListNotification();
    }
  };

  render() {
    const {
      image,
      name,
      title,
      content,
      contentHTML,
      hasAction,
      index,
      canPressRow,
      isExpend,
      unreadNumberColpand,
    } = this.props;
    const ContentView = canPressRow ? TouchableOpacity : View;
    const swipeoutBtns = [
      {
        text: ' ',
        backgroundColor: '#0000',
      },
    ];

    return (
      <Animatable.View
        ref={(ref) => {
          this.containViewRef = ref;
        }}
        duration={REMOVE_DURATION}
        animation={hasAction ? 'zoomIn' : 'pulse'}
        useNativeDriver
      >
        <Swipeout
          right={swipeoutBtns}
          left={swipeoutBtns}
          backgroundColor={'#0000'}
          onOpen={(sectionID, rowId, direction) => {
            if (direction) {
              this.onCancelPress(direction);
            }
          }}
        >
          <ContentView
            activeOpacity={0.8}
            style={[
              styles.rowContainer,
              !isExpend && { marginBottom: 50 },
              index === 0 && Platform.OS === 'ios' ? { marginTop: 20 + TOP_IPHONEX_PADDING } : {},
            ]}
            onPress={this.onPress}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.rowContent}>
                <CharAvatar avatarStyle={styles.icon} source={image} defaultName={name} />
                <Text style={styles.unreadTitle}>{title}</Text>
              </View>
              {contentHTML ? (
                <View style={styles.htmlViewContent}>
                  <HTMLView
                    html={contentHTML}
                    tagsStyles={{
                      b: { margin: 0 },
                      p: { margin: 0 },
                      h1: { margin: 0 },
                      h2: { margin: 0 },
                      h3: { margin: 0 },
                      h4: { margin: 0 },
                      h6: { margin: 0 },
                      span: { margin: 0 },
                    }}
                  />
                </View>
              ) : null}
              {content ? (
                <Text style={styles.textViewContent} numberOfLines={2}>
                  {content}
                </Text>
              ) : null}
              {hasAction && (
                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <TouchableOpacity style={{ paddingRight: 16 }} onPress={this.onCancelPress}>
                    <Text style={{ fontWeight: '500' }}>{'Bỏ qua'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingLeft: 16 }} onPress={this.onDetailPress}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ color: Colors.primary2, fontWeight: '600' }}>
                        {'Xem chi tiết'}
                      </Text>
                      <Image source={require('./img/ic_next.png')} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ContentView>
          {!isExpend && (
            <View
              style={{
                zIndex: -1,
                marginHorizontal: 32,
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 20,
                height: 60,
                left: 0,
                right: 0,
                shadowColor: 'rgba(35, 58, 149, 0.25)',
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowRadius: 10,
                shadowOpacity: 1,
                paddingBottom: 6,
                borderRadius: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                onPress={this.onStaticPressExtendsListNotification}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    fontStyle: 'normal',
                    letterSpacing: 0,
                    textAlign: 'center',
                    color: Colors.primary2,
                    marginRight: 10,
                  }}
                >
                  {`Còn ${unreadNumberColpand} thông báo mới khác chưa đọc`}
                </Text>
                <Image source={require('./img/ic_add.png')} />
              </TouchableOpacity>
            </View>
          )}
        </Swipeout>
      </Animatable.View>
    );
  }
}

export default NotiRow;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowOffset: { width: 0.0, height: 12 },
    shadowColor: 'rgba(35, 58, 149, 0.25)',
    shadowOpacity: 0.7,
    shadowRadius: 3.5,
    backgroundColor: '#fff',
    elevation: 4,
  },
  rowContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
  },
  unreadTitle: {
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: 'left',
    flex: 1,
  },
  text: {
    color: '#333',
    fontSize: 13,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 8,
    textAlign: 'left',
  },
  htmlViewContent: {
    paddingRight: 8,
    paddingLeft: 8,
    marginTop: 0,
    width: SCREEN_SIZE.width - 10 * 2 - 10 * 2 - 36,
  },
  textViewContent: {
    paddingRight: 8,
    paddingLeft: 8,
    marginTop: 0,
    width: SCREEN_SIZE.width - 10 * 2 - 10 * 2 - 36,
  },
});
