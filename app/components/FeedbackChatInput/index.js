import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { FeedbackTextInput } from './FeedbackTextInput';
import { FeedbackPhotoInput } from './FeedbackPhotoInput';

export class FeedbackChatInput extends PureComponent {
  render() {
    const {
      pickedImages,
      onAddPhotoPress,
      textInputValue,
      onRemovePhotoItemPress,
      onChangeText,
      uploadingImage,
      onSendButtonPress,
      videoAttach,
    } = this.props;
    const showAttachPhoto = (pickedImages && pickedImages.length) || uploadingImage;
    return (
      <View style={{ backgroundColor: 'white' }}>
        <FeedbackTextInput
          textInputValue={textInputValue}
          onChangeText={onChangeText}
          onSendButtonPress={onSendButtonPress}
          onAddPhotoPress={onAddPhotoPress}
          pickedImages={pickedImages}
          videoAttach={videoAttach}
        />
        {showAttachPhoto ? (
          <FeedbackPhotoInput
            pickedImages={pickedImages}
            videoAttach={videoAttach}
            onRemovePhotoItemPress={onRemovePhotoItemPress}
            uploadingImage={uploadingImage}
          />
        ) : null}
      </View>
    );
  }
}

export default FeedbackChatInput;
