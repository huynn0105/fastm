import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import AppText from '../../componentV3/AppText';
class MessageText extends Component {

  onPress = (userID) => {
    if (this.props.onTagPress) {
      this.props.onTagPress(userID);
    }
  }

  splitTextWithTagData = (text, tagDataList) => {
    const arrTextData = [];
    let currentIndex = 0;
    if (tagDataList) {
      for (let i = 0; i < tagDataList.length; i += 1) {
        const tagData = tagDataList[i];
        let subText = text.substring(currentIndex, tagData[0]);
        arrTextData.push([subText, '']);
        subText = text.substring(tagData[0], tagData[1]);
        arrTextData.push([subText, tagData[2]]);
        currentIndex = tagData[1];
      }
    }
    const subText = text.substring(currentIndex, text.length);
    arrTextData.push([subText, '']);
    return arrTextData;
  }

  renderRichInputText = () => {
    const message = this.props.currentMessage.message;

    const arrTextData = this.splitTextWithTagData(message.text, message.tagData);

    return (
      <AppText>
        {
          arrTextData.map(this.renderTextFor)
        }
      </AppText>
    );
  }

  renderTextFor = (textData) => {
    const color = this.props.position === 'left' ? '#0080DC' : '#fff';
    const textStyle = textData[1] !== '' ?
      { fontWeight: '600', color, textDecorationLine: 'underline' }
      : {};
    return (
      <AppText
        style={textStyle}
        onPress={textData[1] !== '' ? () => this.onPress(textData[1]) : null}
      >
        {textData[0]}
      </AppText>
    );
  }

  render() {
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position],
        ]}
      >
        <AppText
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
            this.props.customTextStyle,
          ]}
          childrenProps={{ ...this.props.textProps }}
        >
          {/* {this.props.currentMessage.text} */}
          {this.renderRichInputText()}
        </AppText>
      </View>
    );
  }
}

export default MessageText;

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  customTextStyle: {},
  textProps: {},
  parsePatterns: () => [],
};
