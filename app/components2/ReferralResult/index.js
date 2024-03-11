import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import CharAvatar from '../../components/CharAvatar';
import TextStyles from '../../theme/TextStyle';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import { SH, SW } from '../../constants/styles';
export default class ReferralResult extends PureComponent {
  _renderLoadingView = () => (
    <View style={styles.boxContainer}>
      <ActivityIndicator color={Colors.actionBackground} size={'small'} />
      <AppText style={[styles.smallTextStyle, { opacity: 0.6 }]}>{'Đang tìm kiếm'}</AppText>
    </View>
  );

  _renderUserReferral = () => {
    const { userAvatarUrl, userName, userPhoneNumber, onReferralResultPress, mFastCode } =
      this.props;
    return (
      <TouchableOpacity activeOpacity={0.2} onPress={onReferralResultPress}>
        <View style={{ ...styles.referralContainer }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CharAvatar
              avatarStyle={{ width: SW(48), height: SW(48), borderRadius: SW(24) }}
              source={{ uri: userAvatarUrl }}
            />
            <View style={{ marginLeft: SW(12) }}>
              <AppText medium style={styles.regularText}>
                {userName}
              </AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText style={[styles.smallTextStyle, { opacity: 0.6 }]}>Mã MFast:</AppText>
                <AppText
                  bold
                  style={[styles.smallTextStyle, { opacity: 1 }]}
                >{`  ${mFastCode}`}</AppText>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <AppText style={[styles.smallTextStyle, { opacity: 0.6 }]}>{'Chọn'}</AppText>
            <View
              style={{
                width: SW(24),
                height: SW(24),
                borderRadius: SW(12),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.primary2,
                marginLeft: SW(8),
              }}
            >
              <Image
                source={ICON_PATH.check_success}
                style={{
                  width: SW(14),
                  height: SW(14),
                  resizeMode: 'contain',

                  tintColor: Colors.primary5,
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderEmptyView = () => (
    <View style={styles.boxContainer}>
      <AppText style={[styles.smallTextStyle, { opacity: 0.6 }]}>{'Không tìm thấy'}</AppText>
    </View>
  );

  _renderSearchResult = () => {
    const { hasNoData } = this.props;
    return hasNoData ? this._renderEmptyView() : this._renderUserReferral();
  };

  render() {
    const { containerStyle, isLoading } = this.props;
    return (
      <View style={{ ...styles.container, ...containerStyle }}>
        {isLoading ? this._renderLoadingView() : this._renderSearchResult()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
  },
  referralContainer: {
    // marginHorizontal: SW(16),
    flexDirection: 'row',
    borderRadius: 8,
    minHeight: SH(80),
    backgroundColor: Colors.highLightColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SW(16),
  },
  text: {
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.6,
  },
  smallTextStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.primary5,
    // opacity: 0.6
  },
  regularText: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.primary5,
  },
  boxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.highLightColor,
    minHeight: SH(80),
    borderRadius: 8,
  },
});
