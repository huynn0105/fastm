import React, { PureComponent } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';

const OS_ICON_PATH = {
  ICON_1: ICON_PATH.iconOs1,
  ICON_2: ICON_PATH.iconOs2,
  ICON_3: ICON_PATH.iconOs3,
  ICON_DEFAULT: IMAGE_PATH.logoMFastNew,
};
export class FeedbackItem extends PureComponent {
  renderFeedbackTitle = (title, subTitle, iconPath) => {
    //bull shit code because of BE

    const icon = OS_ICON_PATH[iconPath];

    return (
      //  width workaround for text wraping bug react-native https://github.com/facebook/react-native/issues/1438
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: SW(245) }}>
          <View
            style={{
              width: SW(40),
              height: SW(40),
              borderRadius: SW(20),
              backgroundColor: Colors.backgroundChatScreen,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image source={icon} style={{ width: SW(28), height: SH(28), resizeMode: 'contain' }} />
          </View>
          {title && title !== 'undefined' ? (
            <AppText style={[styles.normalText, { marginLeft: SW(12) }]}>
              {title}
              {subTitle && subTitle?.length > 0 ? <AppText>{` - ${subTitle}`}</AppText> : ''}
            </AppText>
          ) : (
            <AppText style={[styles.normalText, { marginLeft: SW(12) }]}>Yêu cầu hỗ trợ</AppText>
          )}
        </View>

        {/* <AppText
          style={{
            ...TextStyles.normalTitle,
            opacity: 0.6,
            marginLeft: 10,
            marginRight: 4,
            marginTop: 3,
          }}
        >
          {`- ${subTitle}`}
        </AppText> */}
        <View>
          <Image
            source={ICON_PATH.arrow_right}
            style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
          />
        </View>
      </View>
    );
  };

  renderReplies = (replyLabel) => {
    return (
      <View style={{ marginTop: 6 }}>
        <AppText style={{ ...TextStyles.normalTitle, fontWeight: 'bold', color: Colors.primary1 }}>
          {`${replyLabel} Phản hồi`}
        </AppText>
      </View>
    );
  };

  renderDescription = (description) => {
    return (
      <View style={{ marginTop: SH(8) }}>
        <AppText
          style={[
            styles.normalText,
            {
              color: Colors.gray1,
            },
          ]}
        >
          {description}
        </AppText>
      </View>
    );
  };

  renderFooter = (author, time) => {
    return (
      <View style={{ flexDirection: 'row', marginTop: SH(8), justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <AppText
            style={{
              ...TextStyles.normalTitle,
              opacity: 0.6,
            }}
          >
            {author}
          </AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ICON_PATH.clock2}
            style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
          />
          <AppText
            style={{
              ...TextStyles.normalTitle,
              color: Colors.gray2,
              marginLeft: SW(4),
            }}
          >
            {`${time}`}
          </AppText>
        </View>
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      title,
      subTitle,
      replyLabel,
      description,
      onPress,
      poster,
      createdDate,
      iconPath,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          backgroundColor: 'white',
          // padding: 16,
          paddingTop: SH(8),
          paddingBottom: SH(12),
          ...containerStyle,
          borderRadius: 8,
          paddingHorizontal: SW(12),
        }}
        onPress={onPress}
      >
        <View style={{ flex: 1 }}>
          {this.renderFeedbackTitle(title, subTitle, iconPath)}
          <View
            style={{
              width: '100%',
              height: 1.5,
              backgroundColor: Colors.actionBackground,
              marginTop: SH(8),
            }}
          />
          {replyLabel > 0 && this.renderReplies(replyLabel)}
          {this.renderDescription(description)}
          {this.renderFooter(poster, createdDate)}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  normalText: {
    fontSize: SH(13),
    lineHeight: SH(18),
    color: Colors.gray2,
  },
  smallText: {
    fontSize: SH(12),
    lineHeight: SH(16),
    color: Colors.gray2,
  },
});

export default FeedbackItem;
