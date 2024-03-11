import React, { Component } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AppText from '../../../componentV3/AppText';

const SCREEN_SIZE = Dimensions.get('window');
const MAX_ITEM_IN_LINE = 4;
const ITEM_WIDTH = SCREEN_SIZE.width / MAX_ITEM_IN_LINE - 8;

export const ACTION_ITEMS = {
  COPY: {
    title: 'Sao chép',
    image: require('./img/copy.png'),
    key: 'COPY',
  },
  FORWARD: {
    title: 'Chuyển tiếp',
    image: require('./img/forward.png'),
    key: 'FORWARD',
  },
  EDIT: {
    title: 'Chỉnh sửa',
    image: require('./img/edit.png'),
    key: 'EDIT',
  },
  QUOTE: {
    title: 'Trích dẫn',
    image: require('./img/quote.png'),
    key: 'QUOTE',
  },
  DETAIL: {
    title: 'Chi tiết',
    image: require('./img/detail.png'),
    key: 'DETAIL',
  },
  DELETE: {
    title: 'Xóa',
    image: require('./img/delete.png'),
    key: 'DELETE',
  },
  RECALL: {
    title: 'Thu hồi',
    image: require('./img/recall.png'),
    key: 'RECALL',
  },
  DOWNLOAD: {
    title: 'Tải xuống',
    image: require('./img/download.png'),
    key: 'DOWNLOAD',
  },
  PIN: {
    title: 'Ghim',
    image: require('./img/pinned.png'),
    key: 'PIN',
  },
};

class CommandActionSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: false,
      remove: true,
    };
    this.height = 0;
  }

  onPressBackground = () => {
    if (this.state.showing) {
      this.setState({
        showing: false,
      });

      setTimeout(() => {
        this.setState({
          remove: true,
        });
      }, 400);

      if (this.props.onCancelCallback) {
        this.props.onCancelCallback();
      }
    }
  };

  onItemPress = (item) => {
    this.onPressBackground();
    setTimeout(() => {
      if (this.props.onPress) {
        this.props.onPress(item);
      }
    }, 400);
  };

  setContentHeight = (height) => {
    this.height = height;
  };

  show() {
    this.setState({
      showing: true,
      remove: false,
    });
  }

  cancel() {
    if (this.state.showing) {
      this.setState({
        showing: false,
      });

      setTimeout(() => {
        this.setState({
          remove: true,
        });
      }, 200);
    }
  }

  render() {
    const { actionItems } = this.props;
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: this.state.remove ? -1000 : 1000,
        }}
        activeOpacity={1}
        onPressIn={this.onPressBackground}
      >
        <Animatable.View
          style={{
            flex: 1,
          }}
          animation={this.state.showing ? 'fadeIn' : 'fadeOut'}
          delay={this.state.showing ? 0 : 200}
          duration={200}
          useNativeDriver
        >
          <ActionSheetContent
            setContentHeight={this.setContentHeight}
            items={actionItems}
            callback={this.onItemPress}
            showing={this.state.showing}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default CommandActionSheet;

const ActionSheetContent = ({ items, callback, showing, setContentHeight }) => {
  const maxItemInLine =
    items.length % MAX_ITEM_IN_LINE === 1 || items.length < MAX_ITEM_IN_LINE
      ? MAX_ITEM_IN_LINE - 1
      : MAX_ITEM_IN_LINE;

  const groupItemToLines = (paramItems, paramMaxItemInLine) => {
    const numOfLines = Math.ceil(paramItems.length / paramMaxItemInLine);
    const resultLines = [];
    for (let i = 0; i < numOfLines; i += 1) {
      const line = [];
      for (let j = 0; j < paramMaxItemInLine; j += 1) {
        const index = i * paramMaxItemInLine + j;
        if (index < paramItems.length) {
          line.push(paramItems[index]);
        } else {
          break;
        }
      }
      resultLines.push(line);
    }
    return resultLines;
  };

  const onItemPress = (item) => {
    if (callback) {
      callback(item);
    }
  };

  const padding =
    maxItemInLine !== MAX_ITEM_IN_LINE
      ? (SCREEN_SIZE.width - ITEM_WIDTH * MAX_ITEM_IN_LINE) / maxItemInLine
      : 0;

  return (
    <Animatable.View
      onLayout={(event) => {
        setContentHeight(event.nativeEvent.layout.height);
      }}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 4,
        shadowOffset: { width: 0.0, height: -1.0 },
        shadowColor: '#808080',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4,
      }}
      animation={showing ? 'slideInUp' : 'slideOutDown'}
      duration={200}
      delay={showing ? 100 : 0}
      useNativeDriver
    >
      {groupItemToLines(items, maxItemInLine).map((line) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {line.map((item) => (
            <ActionButton
              title={item.title}
              image={item.image}
              onPress={() => onItemPress(item)}
              padding={padding}
            />
          ))}
        </View>
      ))}
    </Animatable.View>
  );
};

const ActionButton = ({ title, image, onPress, padding }) => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: padding,
      paddingRight: padding,
    }}
  >
    <TouchableOpacity
      style={{
        width: ITEM_WIDTH,
        height: ITEM_WIDTH * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 4,
        paddingTop: 4,
      }}
      activeOpacity={0.2}
      onPress={onPress}
    >
      <Image style={{ width: 30, height: 24 }} source={image} resizeMode={'contain'} />
      <AppText
        style={{
          marginTop: 10,
          fontSize: 12,
          color: '#222',
        }}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  </View>
);
