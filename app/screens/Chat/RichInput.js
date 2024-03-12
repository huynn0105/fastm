import React, { Component } from 'react';
import { View } from 'react-native';
import { InputToolbar } from 'react-native-gifted-chat';
import AppText from '../../componentV3/AppText';
class RichInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      richTextInput: '',
      richTextInputTagData: [],
    };
    this.selectionIndex = 0;
    this.oldSelectedIndex = 0;
  }

  onSelectionChange = ({ nativeEvent: { selection } }) => {
    this.oldSelectedIndex = this.selectionIndex;
    this.selectionIndex = selection.end;
  };

  changedTagData = (tagData) => {
    if (this.props.changedTagData) {
      this.props.changedTagData(tagData);
    }
  };

  invokeShowRecommendTagWithName = (name) => {
    if (this.props.showRecommendTagWithName) {
      this.props.showRecommendTagWithName(name, this.state.richTextInputTagData);
    }
  };

  checkInvokeShowRecommendTag = (newText) => {
    let nameTag = null;
    for (let i = this.selectionIndex; i >= 0; i -= 1) {
      if (newText[i] === '@') {
        if (!this.checkHasTagInIndex(this.selectionIndex - 1)) {
          nameTag = newText.slice(i + 1, this.selectionIndex);
        }
        break;
      }
    }
    this.invokeShowRecommendTagWithName(nameTag);
  };

  checkHasTagInIndex = (index) => {
    for (let i = 0; i < this.state.richTextInputTagData.length; i += 1) {
      const tagData = this.state.richTextInputTagData[i];
      if (tagData[0] < index && index < tagData[1]) {
        return true;
      }
    }
    return false;
  };

  addTag = ({ username, userID }) => {
    const text = this.removeCurrentTag(this.state.richTextInput);
    this.selectionIndex -= this.state.richTextInput.length - text.length;
    const newText = `${text.slice(0, this.selectionIndex)}${username}${text.slice(
      this.selectionIndex,
    )}`;
    const fixNewText = newText.slice(0, newText.length - 1);

    let richTextData = this.tagDataAfterRichTextAdded(
      text,
      fixNewText,
      this.state.richTextInputTagData,
      this.selectionIndex,
    );
    richTextData = [
      ...richTextData,
      [this.selectionIndex, this.selectionIndex + username.length, userID],
    ];
    richTextData = this.sortRichTextData(richTextData);

    this.updateData(newText, richTextData);
  };

  removeCurrentTag = (text) => {
    let updatedText = text;
    for (let i = this.selectionIndex; i >= 0; i -= 1) {
      if (text[i] === '@') {
        updatedText = updatedText.slice(0, i) + updatedText.slice(this.selectionIndex);
        break;
      }
    }
    return updatedText;
  };

  changedRichText = () => {
    return this.state.richTextInput;
  };

  richTextInputChanged = (newText) => {
    if (newText !== this.state.richTextInput) {
      const newTagData = this.deleteTagWithText(newText);
      this.updateText(newText, newTagData);
      setTimeout(() => {
        this.checkInvokeShowRecommendTag(newText);
      });
    }
  };

  deleteTagWithText = (newText) => {
    if (newText.trim() === '') {
      return [];
    }
    const changedIndex = this.changedIndex(this.state.richTextInput, newText);
    let deletedTagIndex = this.checkIfChangedTag(
      this.oldSelectedIndex,
      this.state.richTextInputTagData,
    );
    if (deletedTagIndex === -1) {
      deletedTagIndex = this.checkIfChangedTag(changedIndex, this.state.richTextInputTagData);
    }
    let newTagData = this.state.richTextInputTagData.concat([]);
    if (deletedTagIndex !== -1) {
      newTagData = newTagData.concat([]);
      newTagData.splice(deletedTagIndex, 1);
    }
    return newTagData;
  };

  changedIndex = (oldText, newText) => {
    const shorterText = oldText.length < newText.length ? oldText : newText;
    const changedIndex = newText.length;
    for (let i = 0; i < shorterText.length; i += 1) {
      if (oldText[i] !== newText[i]) {
        return i;
      }
    }
    return changedIndex;
  };

  checkIfChangedTag = (index, tagData) => {
    for (let i = 0; i < tagData.length; i += 1) {
      if (tagData[i][0] < index && index < tagData[i][1]) {
        return i;
      }
    }
    return -1;
  };

  resetData = () => {
    this.updateData('', []);
  };

  updateData = (text, tagData) => {
    this.setState({
      richTextInput: text,
      richTextInputTagData: tagData,
    });
    setTimeout(
      () => {
        this.changedTagData(tagData);
      },
      tagData.length === 0 ? 400 : 0,
    );
  };

  updateText = (newText, tagData) => {
    const richTextData = this.tagDataAfterRichTextAdded(
      this.state.richTextInput,
      newText,
      tagData,
      this.selectionIndex,
    );
    this.updateData(newText, richTextData);
  };

  sortRichTextData = (tagData) => {
    return tagData.sort((data1, data2) => {
      return data1[0] - data2[0];
    });
  };

  tagDataAfterRichTextAdded = (oldText, newText, tagData, oldCursor) => {
    const addedTextLength = newText.length - oldText.length;
    const updatedTagData = tagData;
    const forAdd = addedTextLength > 0 ? 1 : 0;
    for (let i = 0; i < tagData.length; i += 1) {
      if (oldCursor <= tagData[i][0] + forAdd) {
        updatedTagData[i] = [
          tagData[i][0] + addedTextLength,
          tagData[i][1] + addedTextLength,
          tagData[i][2],
        ];
      }
    }

    return updatedTagData;
  };

  renderRichInputText = () => {
    const text = this.state.richTextInput;
    const arrTextData = [];

    let currentIndex = 0;
    for (let i = 0; i < this.state.richTextInputTagData.length; i += 1) {
      const tagData = this.state.richTextInputTagData[i];
      let subText = text.substring(currentIndex, tagData[0]);
      arrTextData.push([subText, '']);
      subText = text.substring(tagData[0], tagData[1]);
      arrTextData.push([subText, 'tag']);
      currentIndex = tagData[1];
    }
    const subText = text.substring(currentIndex, text.length);
    arrTextData.push([subText, '']);

    return <AppText>{arrTextData.map(this.renderTextFor)}</AppText>;
  };

  renderTextFor = (textData) => {
    return (
      <AppText style={textData[1] === 'tag' ? { color: '#1E90FF' } : {}}>{textData[0]}</AppText>
    );
  };

  render() {
    const { inputToolbarProps } = this.props;
    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
        <InputToolbar
          {...inputToolbarProps}
          containerStyle={{
            borderTopWidth: 0,
          }}
          textInputStyle={{
            marginLeft: 0,
            textAlignVertical: 'center',
            fontSize: 15,
            lineHeight: 18,
          }}
          renderRichText={this.renderRichInputText}
          changedRichText={this.changedRichText}
          textInputProps={{
            ...inputToolbarProps.textInputProps,
            onSelectionChange: this.onSelectionChange,
            blurOnSubmit: false,
          }}
        />
      </View>
    );
  }
}

export default RichInput;
