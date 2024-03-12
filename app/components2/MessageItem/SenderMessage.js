import React, { PureComponent } from 'react';
import { Text, View, TextInput, StyleSheet, Image } from 'react-native';
import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
export class SenderMessage extends PureComponent {
  render() {
    const {
      containerStyle,
      avatarSource = require('./img/ic_mfast_circle_log.png'),
      message,
      title,
      showTitle = true
    } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <Image
          style={{ width: 32, height: 32, borderRadius: 32 / 2 }}
          source={avatarSource}
          resizeMode="stretch"
        />
        <View style={{ marginLeft: 6 }}>
          {showTitle && <AppText style={styles.titleTextStyle}>{title}</AppText>}
          <TextInput
            style={[styles.messageContainerStyle, styles.messageTextStyle]}
            value={message}
            multiline
            enabled={false}
            editable={false}
            scrollEnabled={false}
            autoFocus={false}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4
  },
  messageContainerStyle: {
    maxWidth: SCREEN_WIDTH / 1.42,
    padding: 14,
    paddingTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderTopLeftRadius: 0
  },
  titleTextStyle: {
    ...TextStyles.superSmallText,
    color: '#838383',
    marginBottom: 4
  },
  messageTextStyle: {
    ...TextStyles.normalTitle,
    color: Colors.primary4
  }
});

export default SenderMessage;
