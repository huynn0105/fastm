import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Linking } from 'react-native';
import HTML from 'react-native-render-html';

import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
import { urlify } from '../../utils/Utils';
import { SH, SW } from '../../constants/styles';
import { IMAGE_PATH } from '../../assets/path';

export class SenderMessage extends PureComponent {
  onLinkPress = (href) => {
    Linking.openURL(href);
  };

  render() {
    const {
      containerStyle,
      avatarSource = IMAGE_PATH.logoMFastNew,
      message = '',
      title = '',
      showTitle = true,
    } = this.props;
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <Image
          style={{ width: SW(32), height: SW(32), borderRadius: SW(32) / 2 }}
          source={avatarSource}
          resizeMode="contain"
        />
        <View style={{ marginLeft: SW(12) }}>
          {showTitle ? <AppText style={styles.titleTextStyle}>{title}</AppText> : null}
          {message?.length > 0 ? (
            <View style={styles.messageContainerStyle}>
              <HTML
                textSelectable={true}
                baseFontStyle={{ fontSize: SH(12) }}
                html={message}
                onLinkPress={(evt, href) => {
                  this.onLinkPress(href);
                }}
                tagsStyles={{ ul: { minWidth: (SCREEN_WIDTH * 2) / 3 } }}
              />
            </View>
          ) : null}
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
    paddingBottom: 4,
  },
  messageContainerStyle: {
    maxWidth: SCREEN_WIDTH / 1.42,
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderTopLeftRadius: 0,
  },
  titleTextStyle: {
    ...TextStyles.superSmallText,
    color: '#838383',
    marginBottom: 4,
    fontSize: SH(12),
    lineHeight: SH(16),
  },
  messageTextStyle: {
    ...TextStyles.normalTitle,
    color: Colors.primary4,
    lineHeight: 16,
  },
});

export default SenderMessage;
