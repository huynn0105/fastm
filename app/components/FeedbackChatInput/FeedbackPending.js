import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
export class FeedbackPending extends PureComponent {
  render() {
    const { containerStyle, message } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={{ paddingTop: 16, paddingBottom: 16, flex: 9 }}>
          <AppText style={{ ...TextStyles.body2, color: '#777' }}>{message}</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <Image
            imageStyle={{ width: 32, height: 32 }}
            source={require('./img/ic_disabled_send_button.png')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral4,
    backgroundColor: 'white',
  },
});
export default FeedbackPending;
