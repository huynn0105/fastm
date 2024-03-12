import React, { PureComponent } from 'react';
import { View, Image, Animated, StyleSheet } from 'react-native';
import ImageButton from '../../components2/ImageButton/index';
import LinkButton from '../LinkButton';

import {ICON_PATH, IMAGE_PATH} from '../../assets/path';

export default class LoginToolbar extends PureComponent {
  renderRightButton = () => (
    <LinkButton
      containerStyle={[styles.button, { right: 16 }]}
      textStyle={this.props.rightButtonTextStyle}
      text={this.props.rightButtonTitle}
      disabled={this.props.disabledRightButton}
      onPress={this.props.onRightButtonPress}
    />
  );

  render() {
    const { containerStyle, onToolbarBackPress, showRightButton } = this.props;

    return (
      <Animated.View style={{ ...styles.toolbar, containerStyle }}>
        <ImageButton
          style={{ ...styles.button, left: 8 }}
          imageStyle={{ width: 32, height: 32 }}
          imageSource={ICON_PATH.back}
          onPress={onToolbarBackPress}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Image
            style={{ alignSelf: 'center' }}
            source={IMAGE_PATH.mfast_logo_verti}
            resizeMode="contain"
          />
        </View>
        {showRightButton ? this.renderRightButton() : null}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    position: 'absolute',
    zIndex: 1
  }
});
