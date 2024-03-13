import { Text, View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import React, { PureComponent } from 'react';

import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
export class Loading extends PureComponent {
  render() {
    const { containerStyle, visible, hideLogo } = this.props;
    return (
      <Modal
        animationType={this.props.animation}
        supportedOrientations={['landscape', 'portrait']}
        transparent
        visible={visible}
      >
        <View style={[styles.container, containerStyle]}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 1,
            }}
          >
            <ActivityIndicator
              size="large"
              color={Colors.primary2}
              style={{ width: 36, height: 36, marginTop: 26 }}
            />
            <AppText style={{ color: Colors.primary2, marginTop: 12 }}>{'Đang tải...'}</AppText>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.9)',
  },
});

export default Loading;
