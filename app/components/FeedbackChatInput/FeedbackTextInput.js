import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ImageButton from '../../common/buttons/ImageButton';
import { SW } from '../../constants/styles';
import TextStyles from '../../theme/TextStyle';
import { showInfoAlert } from '../../utils/UIUtils';

export class FeedbackTextInput extends PureComponent {
  onSendButtonPress = () => {
    const { textInputValue = '', onSendButtonPress, pickedImages, videoAttach } = this.props;
    if (!textInputValue.trim() && pickedImages?.length === 0 && videoAttach?.length === 0) {
      showInfoAlert('Xin vui lòng nhập nội dung cần hỗ trợ');
      return;
    }
    onSendButtonPress();
  };
  render() {
    const { containerStyle, textInputValue = '', onChangeText, onAddPhotoPress } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          style={{
            flex: 1,
            maxHeight: 150,
            alignSelf: 'stretch',
            paddingTop: 16,
            paddingBottom: 16,
            ...TextStyles.body2,
          }}
          value={textInputValue}
          multiline
          scrollEnabled
          placeholder="Nhập nội dung cần hỗ trợ"
          placeholderTextColor="#cfd3d6"
          keyboardType="default"
          onChangeText={onChangeText}
          autoCompleteType={'off'}
          autoCorrect={false}
        />
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <ImageButton
            style={{ marginLeft: SW(12) }}
            imageStyle={{ width: SW(22), height: SW(22), resizeMode: 'contain' }}
            imageSource={require('./img/ic_image.png')}
            onPress={onAddPhotoPress}
          />
          <ImageButton
            imageStyle={{
              width: SW(26),
              height: SW(26),
              resizeMode: 'contain',
              marginLeft: 16,
            }}
            imageSource={require('./img/ic_send.png')}
            onPress={this.onSendButtonPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#ddd',
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
});

export default FeedbackTextInput;
