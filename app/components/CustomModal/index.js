import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { ReactNativeModal } from 'react-native-modal';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
export class CustomModal extends PureComponent {
  render() {
    const {
      isShown,
      content,
      onTouchOutside,
      leftButtonTitle,
      leftButtonTitleStyle,
      rightButtonTitle,
      rightButtonTitleStyle,
      onLeftButtonPress,
      onRightButtonPress,
    } = this.props;
    return (
      <ReactNativeModal
        isVisible={isShown}
        useNativeDriver
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={onTouchOutside}
      >
        <View
          style={{
            width: '100%',
            marginLeft: 16,
            marginRight: 16,
            backgroundColor: 'white',
            alignSelf: 'center',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {content}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.neutral5,
            }}
          >
            <TouchableOpacity style={styles.modalButton} onPress={onLeftButtonPress}>
              <AppText
                style={{ ...TextStyles.heading4, color: Colors.neutral2, ...leftButtonTitleStyle }}
              >
                {leftButtonTitle}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={onRightButtonPress}>
              <AppText
                style={{ ...TextStyles.heading4, color: Colors.primary2, ...rightButtonTitleStyle }}
              >
                {rightButtonTitle}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ReactNativeModal>
    );
  }
}

const styles = StyleSheet.create({
  modalButton: {
    flex: 1,
    width: '100%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomModal;
