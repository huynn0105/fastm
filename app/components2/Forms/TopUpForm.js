/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import HTML from 'react-native-render-html';
import _ from 'lodash';

import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import LinkButton from '../LinkButton';
import { MobileCardItem } from './MobileCardItem';
import {
  SCREEN_WIDTH,
  isPhoneNumberValid,
  prettyMoneyStringWithoutSymbol,
} from '../../utils/Utils';
import { CarrierCheckBoxItem } from './CarrierCheckBoxItem';
import ImageButton from '../../common/buttons/ImageButton';
import { Loading } from '../LoadingComponent';
import FastImage from 'react-native-fast-image';
import AppText from '../../componentV3/AppText';

const GroupCheckBox = (props) => {
  const { containerStyle, checkBoxItems, onPress } = props;
  return (
    <View style={{ flexDirection: 'row', ...containerStyle }}>
      {checkBoxItems.map((item, index) => {
        const icon = item.isSelected
          ? require('./img/ic_check.png')
          : require('./img/ic_empty_circle.png');
        let selectionTextStyle;

        if (item.isSelected === undefined || item.isSelected === null) {
          selectionTextStyle = {
            ...TextStyles.heading3,
            fontWeight: 'normal',
            fontSize: 16,
            opacity: 0.8,
          };
        } else {
          selectionTextStyle = item.isSelected
            ? { ...TextStyles.heading3, fontSize: 16, fontWeight: 'bold', opacity: 1 }
            : { ...TextStyles.heading3, fontSize: 16, fontWeight: 'normal', opacity: 0.6 };
        }
        return (
          <TouchableOpacity
            activeOpacity={0.2}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 41 }}
            onPress={() => {
              onPress(index);
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Image style={{ width: 24, height: 24 }} source={icon} resizeMode="cover" />
            <AppText style={{ marginLeft: 6, ...selectionTextStyle }}>{item.label}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MIN_HEIGHT = 130;
const PRE_PAYMENT_FORM_HEIGHT = 560;
const POST_PAYMENT_FORM_HEIGHT = 520;

const TOP_UP_PLAN_ID = {
  PRE_PAYMENT: 'prepaid',
  PAY_LATER: 'postpaid',
};

const TELEPHONE_CARD_ITEM_WIDTH = SCREEN_WIDTH / 4.37;

export class TopUpForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animatedHeightValue: new Animated.Value(MIN_HEIGHT),
      animatedOpacity: new Animated.Value(0),
      minHeight: 0,
      expanded: false,
      checkBoxItems: [
        {
          id: TOP_UP_PLAN_ID.PRE_PAYMENT,
          label: 'Trả trước',
        },
        {
          id: TOP_UP_PLAN_ID.PAY_LATER,
          label: 'Trả sau',
        },
      ],
      selectedTopUpPlanID: undefined,
      selectedPrePaidCarrierIndex: 0,
      selectedPostPaidCarrierIndex: 0,
      selectedPrePaidAmountIndex: 0,
      selectedPostPaidAmountIndex: 0,
      topUpPlanText: '',
      topUpPlanButtonText: '',
      errorMessage: '',
      showWarningMessage: false,
      showPhoneInputErrorMessage: false,
      showClearTextButton: false,
      phone: '',
    };
  }

  componentDidMount() {
    if (this.props.onRef !== null && this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
  }

  expandEntireForm = () => {
    // const totalHeight = this.state.maxHeight + this.state.minHeight + 70;
    const { selectedTopUpPlanID } = this.state;
    const totalHeight =
      selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
        ? PRE_PAYMENT_FORM_HEIGHT
        : POST_PAYMENT_FORM_HEIGHT;
    this.state.animatedHeightValue.setValue(this.state.minHeight);
    Animated.spring(this.state.animatedHeightValue, {
      toValue: totalHeight,
      duration: 500,
    }).start();
    setTimeout(() => {
      Animated.timing(this.state.animatedOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, 150);
  };

  animateFormHeight = () => {
    const { selectedTopUpPlanID } = this.state;
    Animated.spring(this.state.animatedHeightValue, {
      toValue:
        selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
          ? PRE_PAYMENT_FORM_HEIGHT
          : POST_PAYMENT_FORM_HEIGHT,
      duration: 500,
    }).start();
  };

  getSelectedTopUpPlanData(data, selectedTopUpPlanID) {
    return data.listPartner.items.filter((item) => {
      return item.value === selectedTopUpPlanID;
    })[0];
  }

  scrollToSelectedCarrierCheckBoxItemIndex = (index) => {
    if (this.selectCarrierScrollViewRef) {
      setTimeout(() => {
        if (this.selectCarrierScrollViewRef && this.selectCarrierScrollViewRef.scrollTo) {
          this.selectCarrierScrollViewRef.scrollTo({
            x: index * (SCREEN_WIDTH / 3.9) - (SCREEN_WIDTH / 3.9) * 1.1,
            animated: true,
          });
        }
      }, 420);
    }
  };

  scrollToSelectedAmountItemIndex = (index) => {
    if (this.telephoneCardFlatListRef && this.telephoneCardFlatListRef.scrollTo) {
      this.telephoneCardFlatListRef.scrollTo({
        x: index * TELEPHONE_CARD_ITEM_WIDTH - TELEPHONE_CARD_ITEM_WIDTH * 1.1,
        animated: true,
      });
    }
  };

  onMobileCardAmountItemPress = (index) => {
    this.setState((prevState) => ({
      selectedPrePaidAmountIndex:
        prevState.selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
          ? index
          : prevState.selectedPrePaidCarrierIndex,
      selectedPostPaidAmountIndex:
        prevState.selectedTopUpPlanID === TOP_UP_PLAN_ID.PAY_LATER
          ? index
          : prevState.selectedPostPaidAmountIndex,
    }));
    this.scrollToSelectedAmountItemIndex(index);
  };

  onCarrierCheckBoxItemPress = (index) => {
    this.setState((prevState) => ({
      selectedPrePaidCarrierIndex:
        prevState.selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
          ? index
          : prevState.selectedPrePaidCarrierIndex,
      selectedPostPaidCarrierIndex:
        prevState.selectedTopUpPlanID === TOP_UP_PLAN_ID.PAY_LATER
          ? index
          : prevState.selectedPostPaidCarrierIndex,
    }));
    this.scrollToSelectedCarrierCheckBoxItemIndex(index);
  };

  onGroupCheckBoxItemPress = (index) => {
    if (!this.state.expanded) this.expandEntireForm();
    this.setState(
      (prevState) => ({
        checkBoxItems: prevState.checkBoxItems.map((item, itemIndex) => {
          item.isSelected = index === itemIndex;
          return item;
        }),
        selectedTopUpPlanID: prevState.checkBoxItems[index].id,
        expanded: true,
        topUpPlanText: prevState.checkBoxItems[index].label,
        topUpPlanButtonText:
          prevState.checkBoxItems[index].id === TOP_UP_PLAN_ID.PRE_PAYMENT ? 'T. Trước' : 'T. Sau',
        showWarningMessage: prevState.checkBoxItems[index].id === TOP_UP_PLAN_ID.PRE_PAYMENT,
        errorMessage:
          prevState.checkBoxItems[index].id === TOP_UP_PLAN_ID.PRE_PAYMENT
            ? 'Nhập số điện thoại Trả trước muốn nạp tiền'
            : 'Nhập số điện thoại Trả sau muốn nạp tiền',
      }),
      () => {
        const {
          selectedTopUpPlanID,
          selectedPrePaidCarrierIndex,
          selectedPostPaidCarrierIndex,
          selectedPrePaidAmountIndex,
          selectedPostPaidAmountIndex,
        } = this.state;
        const selectedCarrierIndex =
          selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
            ? selectedPrePaidCarrierIndex
            : selectedPostPaidCarrierIndex;
        const selectedAmountIndex =
          selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
            ? selectedPrePaidAmountIndex
            : selectedPostPaidAmountIndex;
        setTimeout(() => {
          this.scrollToSelectedCarrierCheckBoxItemIndex(selectedCarrierIndex);
          this.scrollToSelectedAmountItemIndex(selectedAmountIndex);
        }, 700);
        this.animateFormHeight();
      },
    );
  };

  onChangePhoneInputText = (text) => {
    this.setState({
      phone: text,
      showPhoneInputErrorMessage: false,
      showClearTextButton: text.length !== 0,
    });
  };

  onMainButtonPress = () => {
    const {
      selectedTopUpPlanID,
      selectedPrePaidCarrierIndex,
      selectedPostPaidCarrierIndex,
      selectedPrePaidAmountIndex,
      selectedPostPaidAmountIndex,
      phone,
    } = this.state;

    const { data } = this.props;

    const selectedCarrierIndex =
      selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
        ? selectedPrePaidCarrierIndex
        : selectedPostPaidCarrierIndex;
    const selectedAmountIndex =
      selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
        ? selectedPrePaidAmountIndex
        : selectedPostPaidAmountIndex;

    const topUpPlanData = this.getSelectedTopUpPlanData(data, selectedTopUpPlanID);
    const selectedCarrier = topUpPlanData.telco[selectedCarrierIndex];
    const selectedAmount = topUpPlanData.amount[selectedAmountIndex];

    if (isPhoneNumberValid(phone)) {
      this.props.onMainButtonPress({ selectedTopUpPlanID, selectedCarrier, selectedAmount, phone });
    } else {
      this.setState({
        showPhoneInputErrorMessage: true,
      });
    }
  };

  onClearTextInputPress = () => {
    this.setState({
      phone: '',
    });
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  renderFormTitle = () => {
    const { data } = this.props;
    const formTitle = data.formTitleHTML;
    return (
      <View
        style={{
          marginTop: -2,
          marginBottom: -2,
        }}
      >
        <HTML
          html={formTitle}
          onLinkPress={(obj, href) => {
            this.navigateToWebView({ mode: 0, title: 'Tìm hiểu thêm', url: href });
          }}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
        />
      </View>
    );
  };

  renderPickTopUpPlanSection = () => {
    const { checkBoxItems } = this.state;
    return (
      <View>
        <AppText style={{ ...TextStyles.caption2, opacity: 0.6, marginBottom: 4 }}>
          {'Nạp tiền cho Thuê bao'}
        </AppText>
        <GroupCheckBox
          containerStyle={{ marginTop: 8 }}
          checkBoxItems={checkBoxItems}
          onPress={this.onGroupCheckBoxItemPress}
        />
      </View>
    );
  };

  renderSmallPaddingView = (style) => <View style={style} />;

  renderPickCarrierSection = () => {
    const {
      selectedTopUpPlanID,
      selectedPrePaidCarrierIndex,
      selectedPostPaidCarrierIndex,
    } = this.state;
    const { data } = this.props;
    if (!selectedTopUpPlanID) {
      return null;
    }
    const topUpPlanData = this.getSelectedTopUpPlanData(data, selectedTopUpPlanID);
    const listCarrier = topUpPlanData.telco;
    const selectedCarrierIndex =
      selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
        ? selectedPrePaidCarrierIndex
        : selectedPostPaidCarrierIndex;
    return (
      <View style={{ marginTop: 16, marginLeft: -16, marginRight: -16 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, marginBottom: 4, marginLeft: 16 }}>
          {'Chọn nhà mạng'}
        </AppText>
        <ScrollView
          ref={(ref) => {
            this.selectCarrierScrollViewRef = ref;
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          <View style={{ flexDirection: 'row' }}>
            {listCarrier.map((item, index) => (
              <CarrierCheckBoxItem
                containerStyle={{ marginRight: 19, marginLeft: index === 0 ? 16 : 0 }}
                label={item.name}
                index={index}
                isSelected={selectedCarrierIndex === index}
                imageSource={{ uri: item.imageUrl }}
                onPress={this.onCarrierCheckBoxItemPress}
              />
            ))}
          </View>
        </ScrollView>
        {this.renderSmallPaddingView(styles.leftSmallPaddingView)}
        {this.renderSmallPaddingView(styles.rightSmallPaddingView)}
      </View>
    );
  };

  renderPickPriceSection = () => {
    const {
      selectedTopUpPlanID,
      selectedPrePaidAmountIndex,
      selectedPostPaidAmountIndex,
    } = this.state;
    const { data } = this.props;
    if (!selectedTopUpPlanID) {
      return null;
    }
    const topUpPlanData = this.getSelectedTopUpPlanData(data, selectedTopUpPlanID);
    const listAmount = topUpPlanData.amount;
    const selectedAmountIndex =
      selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT
        ? selectedPrePaidAmountIndex
        : selectedPostPaidAmountIndex;
    return (
      <View style={{ marginTop: 16, marginRight: -16, marginLeft: -16 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, marginBottom: 4, marginLeft: 16 }}>
          {'Số tiền muốn nạp'}
        </AppText>
        <ScrollView
          ref={(ref) => {
            this.telephoneCardFlatListRef = ref;
          }}
          style={{ marginTop: 4 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          <View style={{ flexDirection: 'row' }}>
            {listAmount.map((item, index) => (
              <MobileCardItem
                containerStyle={{
                  marginLeft: index === 0 ? 16 : 10,
                  width: SCREEN_WIDTH / 4.37,
                  marginRight: index === listAmount.length - 1 ? 16 : 0,
                }}
                index={index}
                isSelected={selectedAmountIndex === index}
                totalPrice={prettyMoneyStringWithoutSymbol(item.ori_price)}
                discountedPrice={prettyMoneyStringWithoutSymbol(item.price)}
                onPress={this.onMobileCardAmountItemPress}
              />
            ))}
          </View>
        </ScrollView>
        {this.renderSmallPaddingView(styles.leftSmallPaddingView)}
        {this.renderSmallPaddingView(styles.rightSmallPaddingView)}
      </View>
    );
  };

  renderErrorMessage = () => {
    const { errorMessage } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: 5,
        }}
      >
        <Image style={{ width: 18, height: 18 }} source={require('./img/ic_warning.png')} />
        <AppText
          style={{
            marginLeft: 4,
            ...TextStyles.normalTitle,
            color: Colors.accent3,
          }}
        >
          {errorMessage}
        </AppText>
      </View>
    );
  };

  renderInputPhoneNumberSection = () => {
    const {
      phone,
      showPhoneInputErrorMessage,
      showWarningMessage,
      showClearTextButton,
    } = this.state;
    return (
      <View style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <AppText
            style={{
              ...TextStyles.caption2,
              fontWeight: 'normal',
              opacity: 0.6,
              marginBottom: showPhoneInputErrorMessage ? 4 : 8,
            }}
          >
            {'SĐT thuê bao '}
          </AppText>
          <AppText style={styles.topUpPlanText}>{`${this.state.topUpPlanText.toUpperCase()}`}</AppText>
        </View>
        {showPhoneInputErrorMessage ? this.renderErrorMessage() : null}
        <View style={{ marginTop: 3 }}>
          <View
            style={[
              styles.phoneInputWrapper,
              {
                borderColor: showPhoneInputErrorMessage ? Colors.accent3 : Colors.neutral4,
              },
            ]}
          >
            <TextInput
              style={styles.phoneInput}
              value={phone}
              placeholder="Nhập số điện thoại"
              placeholderTextColor={`${Colors.primary4}44`}
              keyboardType="number-pad"
              onChangeText={this.onChangePhoneInputText}
            />
          </View>
          {showClearTextButton ? (
            <ImageButton
              style={{ position: 'absolute', right: 8, top: '50%', bottom: '50%' }}
              imageSource={
                !showPhoneInputErrorMessage
                  ? require('./img/ic_clear.png')
                  : require('./img/ic_clear_error.png')
              }
              onPress={this.onClearTextInputPress}
            />
          ) : null}
        </View>
        {showWarningMessage ? (
          <AppText style={{ ...styles.warningMessageText, opacity: showWarningMessage ? 1 : 0 }}>
            {'Cảnh báo: '}
            <AppText style={{ color: Colors.accent3, opacity: 1 }}>{'Không áp dụng '}</AppText>
            <AppText>{'chung với các chương trình khuyến mãi khác của nhà mạng'}</AppText>
          </AppText>
        ) : null}
      </View>
    );
  };

  renderLinkButton = (onSecondButtonPress) => (
    <LinkButton
      text={'Quản lý'}
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      onPress={onSecondButtonPress}
    />
  );
  renderSubmitButton = (maintenance) => (
    <CustomButton
      disabled={maintenance}
      sizeType={BUTTON_SIZE.REGULAR}
      title={`Nạp tiền ĐT ${this.state.topUpPlanButtonText}`}
      rightIcon={!maintenance ? require('./img/ic_arrow_point_to_right.png') : null}
      onPress={this.onMainButtonPress}
    />
  );
  renderButtonSection = (maintenance) => {
    const { onSecondButtonPress, data } = this.props;
    return (
      <View style={styles.buttonContainer}>
        {data.secondButtonURL ? this.renderLinkButton(onSecondButtonPress) : null}
        {this.renderSubmitButton(maintenance)}
      </View>
    );
  };

  renderMaintenance = (topupServiceStatus = {}) => {
    const { selectedTopUpPlanID, expanded } = this.state;

    if (!expanded) return null;

    const isPrePay = selectedTopUpPlanID === TOP_UP_PLAN_ID.PRE_PAYMENT;

    let message = '';
    let image = '';
    if (isPrePay && topupServiceStatus.prepaid && topupServiceStatus.prepaid.status === false) {
      message = topupServiceStatus.prepaid.message;
      image = topupServiceStatus.prepaid.image;
    } else if (
      !isPrePay &&
      topupServiceStatus.postpaid &&
      topupServiceStatus.postpaid.status === false
    ) {
      message = topupServiceStatus.postpaid.message;
      image = topupServiceStatus.postpaid.image;
    }

    return image ? (
      <View style={{ marginTop: 32, marginBottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        <FastImage
          style={{ width: SCREEN_WIDTH * 0.4, aspectRatio: 1 }}
          resizeMode={'contain'}
          source={{ uri: image }}
        />
        <AppText
          style={{
            opacity: 0.8,
            fontSize: 13,
            lineHeight: 18,
            textAlign: 'center',
            color: '#24253d',
            width: SCREEN_WIDTH * 0.6,
            marginTop: 16,
          }}
        >
          {message}
        </AppText>
      </View>
    ) : null;
  };

  render() {
    const { status, showLoading, maintenanceData } = this.props;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;

    const maintenance = this.renderMaintenance(maintenanceData);

    return (
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          { height: maintenance ? 440 : this.state.animatedHeightValue },
        ]}
      >
        <View>
          {this.renderFormTitle()}
          {this.renderPickTopUpPlanSection()}
        </View>
        {/* opacity: this.state.expanded ? 1 : 0 */}
        <Animated.View style={{ opacity: this.state.animatedOpacity }}>
          {maintenance || this.renderPickCarrierSection()}
          {!maintenance ? this.renderPickPriceSection() : null}
          {!maintenance ? this.renderInputPhoneNumberSection() : null}
          {this.renderButtonSection(maintenance)}
        </Animated.View>
        <Loading visible={showLoading} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
    // marginBottom: 16,
  },
  phoneInputWrapper: {
    borderRadius: 4,
    backgroundColor: Colors.primary5,
    borderWidth: 0.5,
    borderColor: Colors.neutral4,
  },
  phoneInput: {
    padding: 14,
    paddingTop: Platform.OS === 'android' ? 10 : 14,
    paddingBottom: Platform.OS === 'android' ? 10 : 14,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    ...TextStyles.heading3,
    lineHeight: 20,
    fontSize: 16,
  },
  formStatusNone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    opacity: 0,
    zIndex: -999,
  },
  formStatusSelected: {
    position: 'relative',
    opacity: 1,
    zIndex: 999,
  },
  leftSmallPaddingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 2,
    height: '100%',
    backgroundColor: 'white',
  },
  rightSmallPaddingView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 2,
    height: '100%',
    backgroundColor: 'white',
  },
  warningMessageText: {
    marginTop: 12,
    ...TextStyles.normalTitle,
    color: Colors.neutral3,
    marginBottom: 4,
    textAlign: 'center',
  },
  topUpPlanText: {
    ...TextStyles.caption2,
    opacity: 1,
    color: Colors.accent3,
    fontWeight: 'bold',
  },
});

export default TopUpForm;
