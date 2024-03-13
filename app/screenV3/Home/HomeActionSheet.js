import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import React, { PureComponent } from 'react';

import Colors from '../../theme/Color';
import { Share } from 'react-native';
import { logEvent } from '../../tracking/Firebase';
import AppText from '../../componentV3/AppText';
import { ICON_PATH, IMAGE_PATH } from '../../assets/path';
import QRCode from 'react-native-qrcode-svg';
import ButtonText from '../../common/ButtonText';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';

export const stylesActionSheet = StyleSheet.create({
  smallTextStyle: {
    fontSize: 13,
    lineHeight: 18,
  },
  iconStyle: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
});

export const ITEM_IDS = {
  COLLABORATORS: 'COLLABORATORS',
  ADD_REFERRAL: 'ADD_REFERRAL',
  INSTALL_LINK: 'INSTALL_LINK',
  INTRODUCTION: 'INTRODUCTION',
  QR_CODE: 'QR_CODE',
  COMMISSION: 'COMMISSION',
  REF_CODE: 'REF_CODE',
  RSM_PUSH_MESSAGE: 'RSM_PUSH_MESSAGE',

  INVITE_USER: 'INVITE_USER',
  POLICY_COLLABORATOR: 'POLICY_COLLABORATOR',
  INFO_COLLABORATOR: 'INFO_COLLABORATOR',
  COLLABORATOR_LEAVE: 'COLLABORATOR_LEAVE',
};

class HomeActionSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: props?.initStep || 0,
    };
  }
  onClosePress = () => {
    this.setState({
      step: 0,
    });
    this.props.onClosePress();
  };
  onItemPress = (itemID) => {
    if (this.props.onItemPress) {
      this.props.onItemPress(itemID);
    }
  };
  onReferralCodePress = () => {
    this.openShareDialog(this.props.user.referralCode);
  };
  openShareDialog = (content) => {
    logEvent('press_share_CTV_link');
    Share.share({
      message: content,
    });
  };
  backButton = () => {
    this.setState({
      step: this.state.step === 1 ? 2 : 0,
    });
  };

  onCopyReferralCode = () => {
    this.props?.onClosePress();
    Linking.openURL(`${DEEP_LINK_BASE_URL}://copy/?text=${this.props?.user?.referralCode}`);
  };

  renderTitle = () => {
    return (
      <View style={{}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
          }}
        >
          <AppText
            style={{
              textAlign: 'center',
              fontSize: 16,
              lineHeight: 22,
              color: Colors.primary4,
            }}
          >
            {this.state.step === 0
              ? 'Tiện ích và hỗ trợ'
              : this.state.step === 1
              ? 'Mã QRCode cài đặt MFast'
              : this.state.step === 2
              ? 'Mời người khác tham gia'
              : 'Tính năng mới trên MFast'}
          </AppText>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 24,
            height: 24,
            padding: 3,
            right: 8,
            top: 14,
          }}
          onPress={this.onClosePress}
        >
          <Image style={{ width: 18, height: 18 }} source={require('./img/ic_close.png')} />
        </TouchableOpacity>
        {this.state.step > 0 ? (
          <TouchableOpacity
            disabled={this?.props?.hideBack && this.state.step === 2}
            style={{
              position: 'absolute',
              width: 24,
              height: 24,
              padding: 3,
              left: 8,
              top: 14,
              opacity: this?.props?.hideBack && this.state.step === 2 ? 0 : 1,
            }}
            onPress={this.backButton}
          >
            <Image style={{ width: 18, height: 18 }} source={ICON_PATH.back} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  renderDescription = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          paddingVertical: 16,
          paddingHorizontal: 16,
          backgroundColor: '#221db0',
          alignItems: 'center',
        }}
        onPress={() => {
          this.onItemPress(ITEM_IDS.INFO_COLLABORATOR);
        }}
      >
        <Image
          style={[stylesActionSheet.iconStyle, { tintColor: Colors.primary5 }]}
          source={ICON_PATH.energy}
        />
        <View
          style={{
            justifyContent: 'center',
            marginHorizontal: 16,
          }}
        >
          <AppText medium style={[styles.itemTitle, { color: Colors.primary5 }]}>
            {'Tìm hiểu về con đường Huyền Thoại'}
          </AppText>
        </View>
        <Image
          style={{
            position: 'absolute',
            right: 16,
            tintColor: Colors.primary5,
            top: 26,
            width: 16,
            height: 16,
          }}
          source={ICON_PATH.arrow_right}
        />
      </TouchableOpacity>
    );
  };
  renderQRCode = () => {
    return (
      <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
        <View style={{ marginVertical: 16 }}>
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: Colors.gray1,
              textAlign: 'center',
            }}
          >
            Dùng điện thoại của khách hàng quét mã QRCode này để dẫn tới link cài đặt có chứa mã
            MFast của bạn.
          </AppText>
        </View>
        <View
          style={{
            width: 240,
            height: 240,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary5,
          }}
        >
          <QRCode
            color="#231eaf"
            value={`https://mfast.vn/cai-dat/${this.props.user.referralCode}?utm_source=mfast_app&utm_medium=referral_link`}
            size={202}
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: Colors.gray5,
              textAlign: 'center',
            }}
          >
            Quét bằng
            <AppText
              semiBold
              style={{ fontSize: 14, lineHeight: 20, color: Colors.highLightColor }}
            >
              {` ứng dụng Zalo `}
            </AppText>
            hoặc
            <AppText
              semiBold
              style={{ fontSize: 14, lineHeight: 20, color: Colors.highLightColor }}
            >
              {` Camera thường đối với điện thoại iPhone`}
            </AppText>
            .
          </AppText>
        </View>
      </View>
    );
  };
  renderItem = (item, index) => {
    const { collaboratorLeave } = this.props;
    if (item?.uid === ITEM_IDS.COLLABORATOR_LEAVE && Object.keys(collaboratorLeave)?.length === 0) {
      return null;
    }
    return (
      <TouchableOpacity
        key={item?.uid}
        onPress={() => {
          if (item?.uid === ITEM_IDS.QR_CODE) {
            this.setState({
              step: 1,
            });
          } else if (item?.uid === ITEM_IDS.INVITE_USER) {
            this.setState({
              step: 2,
            });
          } else {
            this.onItemPress(item.uid);
          }
        }}
      >
        {index > 0 ? (
          <View style={{ backgroundColor: '#3331', height: 1, marginHorizontal: 16 }} />
        ) : null}
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        >
          <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={item.icon} />
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              marginLeft: 12,
            }}
          >
            <AppText medium style={styles.itemTitle}>
              {item.title}
              {item?.uid === ITEM_IDS?.REF_CODE ? (
                <AppText
                  style={[styles.itemTitle, { color: Colors?.primary2, marginRight: 20 }]}
                  bold
                >
                  {this.props?.user?.referralCode}
                </AppText>
              ) : null}
            </AppText>
            {item?.descriptionComponent ? (
              <View style={{ flex: 1, marginTop: 4 }}>
                {item?.descriptionComponent?.(
                  item?.uid === ITEM_IDS.COLLABORATOR_LEAVE ? collaboratorLeave : null,
                )}
              </View>
            ) : null}
          </View>
          <Image
            style={{ position: 'absolute', right: 16, top: 20, width: 16, height: 16 }}
            source={ICON_PATH.arrow_right}
          />
        </View>
        {item?.detailComponent ? (
          <View style={{ flex: 1, marginTop: 8, marginBottom: 16, marginHorizontal: 16 }}>
            {item?.detailComponent?.(
              item?.uid === ITEM_IDS.COLLABORATOR_LEAVE ? collaboratorLeave : null,
            )}
          </View>
        ) : (
          <View style={{ marginBottom: 16 }} />
        )}
      </TouchableOpacity>
    );
  };
  renderItems = (items) => {
    return items?.map(this.renderItem);
  };

  render() {
    return (
      <View style={{ marginBottom: 16 }}>
        {this.renderTitle()}
        <View style={{ backgroundColor: Colors.actionBackground, paddingBottom: 40 }}>
          {this.state.step === 0 ? (
            <View>
              {this.renderDescription()}
              {this.renderItems(this.props.itemRender)}
            </View>
          ) : this.state.step === 1 ? (
            this.renderQRCode()
          ) : this.state.step === 2 ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: '#221db0',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <AppText medium style={[styles.itemTitle, { color: Colors.blue6 }]}>
                  {`Mã MFast của bạn là:   ${this.props?.user?.referralCode}`}
                </AppText>
                <TouchableWithoutFeedback onPress={this.onCopyReferralCode}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <AppText
                      style={{ fontSize: 14, lineHeight: 20, color: Colors.blue6, marginRight: 4 }}
                    >
                      Copy
                    </AppText>
                    <Image source={ICON_PATH.copy3} style={{ width: 24, height: 24 }} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <AppText style={styles.description}>
                Ba cách để mời Cộng tác viên tham gia cộng đồng của bạn
              </AppText>
              {this.renderItems(ITEMS)}
            </View>
          ) : (
            <View>
              <Image source={IMAGE_PATH.bannerLegend} style={{ width: '100%' }} />
              <View style={{ marginHorizontal: 16 }}>
                <AppText medium style={[styles.itemTitle, { marginTop: 16 }]}>
                  MFast có gì mới hôm nay?
                </AppText>
                <AppText semiBold style={[styles.itemTitle, { marginTop: 16 }]}>
                  Thay đổi cách tính thu nhập gián tiếp áp dụng cho tất cả người dùng và sản phẩm có
                  trên MFast, chi tiết như sau:
                </AppText>
                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                  <Image style={stylesActionSheet.iconStyle} source={ICON_PATH.iconsRank} />
                  <View
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 16,
                    }}
                  >
                    <AppText medium style={[styles.itemTitle, { color: Colors.gray1 }]}>
                      Phân loại
                      <AppText style={[styles.itemTitle, { color: Colors.sixOrange }]}>
                        {' '}
                        Danh hiệu{' '}
                      </AppText>
                      của từng người dựa trên năng suất hoạt động trên MFast
                    </AppText>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 16 }}>
                  <Image style={stylesActionSheet.iconStyle} source={ICON_PATH.iconsBonus} />
                  <View
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 16,
                    }}
                  >
                    <AppText medium style={[styles.itemTitle, { color: Colors.gray1 }]}>
                      Phạm vi thu nhập gián tiếp nhận được tăng từ Cộng tác viên trực tiếp (tầng 1)
                      lên tới
                      <AppText style={[styles.itemTitle, { color: Colors.sixOrange }]}>
                        {' '}
                        Sáu tầng cộng tác viên
                      </AppText>
                    </AppText>
                  </View>
                </View>
                <ButtonText
                  onPress={() => {
                    this.onItemPress(ITEM_IDS.INFO_COLLABORATOR);
                  }}
                  title={'Tìm hiều thêm'}
                  top={20}
                  fontSize={16}
                  lineHeight={22}
                  medium
                ></ButtonText>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default HomeActionSheet;

const styles = StyleSheet.create({
  description: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.gray1,
  },
  itemContent: {
    fontSize: 13,
    lineHeight: 18,
  },
});

const ITEMS = [
  {
    uid: ITEM_IDS.REF_CODE,
    title: (
      <AppText medium style={styles.itemTitle}>
        {'Mời tham gia thông qua nhập mã\nMFast: '}
      </AppText>
    ),
    descriptionComponent: () => (
      <AppText style={[styles.itemContent, { color: Colors.gray5 }]}>
        Cộng tác viên
        <AppText semiBold style={[styles.itemContent, { color: Colors.sixOrange }]}>
          {' '}
          sử dụng mã trên
        </AppText>{' '}
        để chọn bạn làm người hướng dẫn trong lần đầu đăng nhập vào MFast
      </AppText>
    ),
    icon: ICON_PATH.code,
  },
  {
    uid: ITEM_IDS.INSTALL_LINK,
    title: 'Mời tham gia bằng liên kết tiếp thị',
    descriptionComponent: () => (
      <AppText style={[stylesActionSheet.smallTextStyle, { color: Colors.gray5 }]}>
        Cộng tác viên
        <AppText semiBold style={[stylesActionSheet.smallTextStyle, { color: Colors.sixOrange }]}>
          {' '}
          truy cập vào link bạn gửi
        </AppText>{' '}
        để tải MFast sẽ mặc định được ghi nhận là cộng tác viên của bạn
      </AppText>
    ),
    icon: ICON_PATH.download2,
  },
  {
    uid: ITEM_IDS.QR_CODE,
    title: 'Gửi mã QRCode cài đặt MFast',
    descriptionComponent: () => (
      <AppText style={[stylesActionSheet.smallTextStyle, { color: Colors.gray5 }]}>
        Dùng điện thoại của cộng tác viên
        <AppText semiBold style={[stylesActionSheet.smallTextStyle, { color: Colors.sixOrange }]}>
          {' '}
          quét mã QRCode này
        </AppText>{' '}
        để dẫn tới link cài đặt trên
      </AppText>
    ),
    icon: ICON_PATH.QRcode,
  },
];
