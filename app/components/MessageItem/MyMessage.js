import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Linking } from 'react-native';
import HTML from 'react-native-render-html';

import Colors from '../../theme/Color';
import { SCREEN_WIDTH } from '../../utils/Utils';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
import { urlify } from '../../utils/Utils';

export class MyMessage extends PureComponent {
  onLinkPress = (href) => {
    Linking.openURL(href);
  };

  render() {
    const { containerStyle, message, title, showTitle } = this.props;

    const parseMessage = urlify(message);

    return (
      <View style={[styles.containerStyle, containerStyle]}>
        {showTitle && <AppText style={styles.titleTextStyle}>{title}</AppText>}
        {message !== ' ' ? (
          <View style={[styles.messageContainerStyle, styles.messageTextStyle]}>
            <HTML
              textSelectable={true}
              baseFontStyle={{ fontSize: 14, lineHeight: 20, color: '#fff' }}
              html={parseMessage}
              onLinkPress={(evt, href) => {
                this.onLinkPress(href);
              }}
              tagsStyles={{ ul: { minWidth: (SCREEN_WIDTH * 2) / 3 } }}
            />
          </View>
        ) : null}

        {/* Using TextInput in order to user can select the message to copy to clipboard */}
        {/* <TextInput
          style={[styles.messageContainerStyle, styles.messageTextStyle]}
          value={message}
          multiline
          enabled={false}
          editable={false}
          scrollEnabled={false}
          autoFocus={false}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    alignItems: 'flex-end',
    paddingTop: 4,
    paddingBottom: 4,
  },
  messageContainerStyle: {
    maxWidth: SCREEN_WIDTH / 1.42,
    padding: 8,
    backgroundColor: Colors.primary2,
    borderRadius: 10,
    borderTopRightRadius: 0,
  },
  titleTextStyle: {
    ...TextStyles.superSmallText,
    color: '#838383',
    marginBottom: 4,
  },
  messageTextStyle: {
    ...TextStyles.heading4,
    color: Colors.primary5,
  },
});

export default MyMessage;
