/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import HTML from 'react-native-render-html';
import _ from 'lodash';

import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import LinkButton from '../LinkButton/index';
import ImageButton from '../../common/buttons/ImageButton';
import { BouncingButton } from '../BouncingButton/index';
import { prettyMoneyStringWithoutSymbol, SCREEN_WIDTH } from '../../utils/Utils';
import { CarrierCheckBoxItem } from './CarrierCheckBoxItem';
import CustomTextInput from '../CustomTextInput';
import LocalStorageUtil from '../../utils/LocalStorageUtil';
import { SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM } from '../../screens2/Home/CustomerFormContainer/CustomerFormContainerEnums';
import { Loading } from '../LoadingComponent';
import FastImage from 'react-native-fast-image';
import AppText from '../../componentV3/AppText';

const NumberPicker = (props) => {
  const { value, min, max, minusIconStyle, plusIconStyle, onMinusPress, onPlusPress } = props;
  const opacityMinusIcon = value === min ? { opacity: 0.4 } : { opacity: 1 };
  const opacityAddIcon = value === max ? { opacity: 0.4 } : { opacity: 1 };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ImageButton
        imageStyle={{ ...opacityMinusIcon, ...minusIconStyle }}
        imageSource={require('./img/ic_minus.png')}
        onPress={onMinusPress}
      />
      <AppText style={{ marginLeft: 24, marginRight: 24, ...TextStyles.heading2 }}>{value}</AppText>
      <ImageButton
        imageStyle={{ ...opacityAddIcon, ...plusIconStyle }}
        imageSource={require('./img/ic_add.png')}
        onPress={onPlusPress}
      />
    </View>
  );
};
const TelephoneCardItem = (props) => {
  const {
    containerStyle,
    totalPriceTextStyle,
    discountedPriceTextStyle,
    totalPrice,
    discountedPrice,
    isSelected,
    onPress,
  } = props;
  return (
    <BouncingButton style={{ ...styles.mobileCardItem, ...containerStyle }} onPress={onPress}>
      <AppText style={{ ...TextStyles.heading3, ...totalPriceTextStyle }}>{totalPrice}</AppText>
      <AppText
        style={{
          ...TextStyles.normalTitle,
          opacity: isSelected ? 1 : 0.6,
          ...discountedPriceTextStyle,
        }}
      >
        {discountedPrice}
      </AppText>
    </BouncingButton>
  );
};
const EmailCheckBox = (props) => {
  const { isSelected, onPress, disabled } = props;
  const tickIcon = isSelected
    ? require('./img/ic_check.png')
    : require('./img/ic_empty_circle.png');
  const Button = disabled ? View : TouchableOpacity;
  return (
    <Button
      style={{ flexDirection: 'row', alignItems: 'center', ...props.style }}
      onPress={onPress}
    >
      <Image style={{ width: 24, height: 24 }} source={tickIcon} resizeMode="cover" />
      <AppText style={{ marginLeft: 6, ...TextStyles.normalTitle }}>
        {'Gửi thông tin thẻ cào về Email trên'}
      </AppText>
    </Button>
  );
};

const TELEPHONE_CARD_ITEM_WIDTH = SCREEN_WIDTH / 4.37;

class MobileCardForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { numberPickerValue } = props;
    this.state = {
      showErrorListScratchCardSection: false,
      isEmailCheckBoxSelected: false,
      numberPickerValue,
      selectedTelephoneCardIndex: -1,
    };
    this.selectCarrierScrollViewRef = undefined;
    this.telephoneCardFlatListRef = undefined;
  }

  componentDidMount() {
    if (this.props.onRef !== null && this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
  }

  saveIndexOfSelectedCarrierCheckBoxItem = async (index) => {
    try {
      const savedIndex = JSON.stringify(index);
      if (savedIndex) {
        await LocalStorageUtil.saveDataAsyncStorage(
          savedIndex,
          SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM,
        );
      }
    } catch (error) {}
  };

  scrollToSelectedCarrierCheckBoxItemIndex = (index) => {
    if (this.selectCarrierScrollViewRef !== undefined) {
      setTimeout(() => {
        this.selectCarrierScrollViewRef.scrollTo({
          x: index * (SCREEN_WIDTH / 3.9) - (SCREEN_WIDTH / 3.9) * 1.1,
          animated: true,
        });
      }, 420);
    }
  };

  scrollToSelectedTelephoneCardItemIndex = (index) => {
    if (this.telephoneCardFlatListRef !== undefined) {
      this.telephoneCardFlatListRef.scrollToOffset({
        offset: index * TELEPHONE_CARD_ITEM_WIDTH - TELEPHONE_CARD_ITEM_WIDTH * 1.1,
        animated: true,
      });
    }
  };

  // -----------------------------------------
  // EVENT HANDLER METHODS
  // -----------------------------------------

  onMainButtonPress = () => {
    const { onMainButtonPress, selectedCarrier } = this.props;
    const { isEmailCheckBoxSelected, numberPickerValue, selectedTelephoneCardIndex } = this.state;
    const selectedTelephoneCard = selectedCarrier.listRouting[selectedTelephoneCardIndex];

    if (_.isEmpty(selectedTelephoneCard)) {
      this.setState({
        showErrorListScratchCardSection: true,
      });
      return;
    }

    onMainButtonPress({
      isEmailCheckBoxSelected,
      numberPickerValue,
      selectedTelephoneCard,
    });
  };

  onSecondButtonPress = () => {
    this.props.onSecondButtonPress();
  };

  onCarrierCheckBoxItemPress = (index) => {
    const { onCarrierCheckBoxItemPress } = this.props;
    this.scrollToSelectedCarrierCheckBoxItemIndex(index);
    this.saveIndexOfSelectedCarrierCheckBoxItem(index);
    onCarrierCheckBoxItemPress(index);
  };

  onTelephoneCardItemPress = (index) => {
    this.scrollToSelectedTelephoneCardItemIndex(index);
    this.setState({ selectedTelephoneCardIndex: index, showErrorListScratchCardSection: false });
  };
  onEmailCheckBoxPress = () => {
    const { isEmailCheckBoxSelected } = this.state;
    this.setState({ isEmailCheckBoxSelected: !isEmailCheckBoxSelected });
  };
  onNumberPickerMinusPress = () => {
    const { numberPickerMin } = this.props;
    const { numberPickerValue } = this.state;
    if (numberPickerValue > numberPickerMin) {
      this.setState({
        numberPickerValue: numberPickerValue - 1,
      });
    }
  };
  onNumberPickerPlusPress = () => {
    const { numberPickerMax } = this.props;
    const { numberPickerValue } = this.state;
    if (numberPickerValue < numberPickerMax) {
      this.setState({
        numberPickerValue: numberPickerValue + 1,
      });
    }
  };
  onUpdateEmailPress = () => {
    // navigate to email update screen
    this.props.onUpdateEmailPress();
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------
  renderFormTitle = () => {
    const { formTitle } = this.props;
    return (
      <View style={{ marginTop: -2 }}>
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
  renderSmallPaddingView = (style) => <View style={style} />;
  renderSelectCarrierSection = () => {
    const { listCarrier } = this.props;
    return (
      <View style={{ marginLeft: -16, marginRight: -16 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, marginLeft: 16 }}>
          {'Chọn nhà mạng'}
        </AppText>
        <ScrollView
          ref={(ref) => {
            this.selectCarrierScrollViewRef = ref;
          }}
          style={{ marginTop: 4, paddingBottom: 16, backgroundColor: 'white' }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {listCarrier.items.map((item, index) => {
            return (
              <CarrierCheckBoxItem
                containerStyle={{
                  marginRight: 8,
                  marginLeft: index === 0 ? 16 : 0,
                }}
                label={item.label}
                isSelected={listCarrier.selectedIndex === index}
                imageSource={{ uri: item.imageUrl }}
                onPress={() => {
                  this.onCarrierCheckBoxItemPress(index);
                }}
              />
            );
          })}
        </ScrollView>
        {this.renderSmallPaddingView(styles.leftSmallPaddingView)}
        {this.renderSmallPaddingView(styles.rightSmallPaddingView)}
      </View>
    );
  };
  renderTelephoneCardItem = ({ item, index }) => {
    const { selectedTelephoneCardIndex } = this.state;

    const isSelected = selectedTelephoneCardIndex > -1 && selectedTelephoneCardIndex === index;

    const containerBGColor = isSelected ? Colors.primary2 : Colors.neutral5;
    const totalPriceTextColor = isSelected ? Colors.primary5 : Colors.primary4;
    const discountedPriceTextColor = isSelected ? Colors.primary5 : Colors.primary4;
    const totalPrice = prettyMoneyStringWithoutSymbol(item.price);
    const calculatedDiscountedPrice = item.price - (item.price * item.discount) / 100;
    const discountedPrice = prettyMoneyStringWithoutSymbol(calculatedDiscountedPrice);

    return (
      <TelephoneCardItem
        containerStyle={{
          width: TELEPHONE_CARD_ITEM_WIDTH,
          marginLeft: index === 0 ? 16 : 0,
          marginRight: 10,
          backgroundColor: containerBGColor,
        }}
        totalPriceTextStyle={{ color: totalPriceTextColor }}
        discountedPriceTextStyle={{ color: discountedPriceTextColor }}
        index={index}
        totalPrice={totalPrice}
        discountedPrice={discountedPrice}
        isSelected={isSelected}
        onPress={() => this.onTelephoneCardItemPress(index)}
      />
    );
  };
  renderErrorMessage = (label) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          marginLeft: 16,
          marginTop: 4,
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
          {label}
        </AppText>
      </View>
    );
  };
  renderListTelephoneCardSection = () => {
    const { selectedCarrier } = this.props;
    const { showErrorListScratchCardSection } = this.state;
    return (
      <View style={{ marginRight: -16, marginLeft: -16 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, marginLeft: 16 }}>
          {'Mệnh giá thẻ'}
        </AppText>
        {showErrorListScratchCardSection && this.renderErrorMessage('Bạn chưa chọn mệnh giá thẻ')}
        <FlatList
          ref={(ref) => {
            this.telephoneCardFlatListRef = ref;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={selectedCarrier.listRouting}
          renderItem={this.renderTelephoneCardItem}
          extraData={this.state}
        />
        {this.renderSmallPaddingView(styles.leftSmallPaddingView)}
        {this.renderSmallPaddingView(styles.rightSmallPaddingView)}
      </View>
    );
  };
  renderNumberPickerSection = () => {
    const { numberPickerMin, numberPickerMax } = this.props;
    const { numberPickerValue } = this.state;
    return (
      <View style={styles.numberPickerContainer}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6 }}>{'Số lượng (Tối đa 3 thẻ)'}</AppText>
        <NumberPicker
          value={numberPickerValue}
          min={numberPickerMin}
          max={numberPickerMax}
          onMinusPress={this.onNumberPickerMinusPress}
          onPlusPress={this.onNumberPickerPlusPress}
        />
      </View>
    );
  };
  renderEmailSection = () => {
    const { isEmailCheckBoxSelected } = this.state;
    const { email } = this.props;
    const emailCheckBoxStyle = email ? {} : { opacity: 0.3 };
    const disabledEmailCheckBox = !email;
    return (
      <View style={styles.emailContainer}>
        {email ? (
          <View>
            <AppText style={{ marginBottom: 8, ...TextStyles.heading4, opacity: 0.6 }}>{email}</AppText>
            <View style={styles.emailCheckBoxDivider} />
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={{ marginBottom: 8 }}
              activeOpacity={0.2}
              onPress={this.onUpdateEmailPress}
            >
              <AppText style={{ ...TextStyles.heading4, color: Colors.primary2 }}>
                {'Cập nhật Email ngay'}
              </AppText>
            </TouchableOpacity>
            <View style={styles.emailCheckBoxDivider} />
          </View>
        )}
        <EmailCheckBox
          style={emailCheckBoxStyle}
          isSelected={isEmailCheckBoxSelected}
          onPress={this.onEmailCheckBoxPress}
          disabled={disabledEmailCheckBox}
        />
      </View>
    );
  };
  renderLinkButton = () => (
    <LinkButton
      text={'Quản lý'}
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      onPress={this.onSecondButtonPress}
    />
  );
  renderSubmitButton = (maintenance) => (
    <CustomButton
      disabled={maintenance}
      sizeType={BUTTON_SIZE.REGULAR}
      title={'Mua mã thẻ cào'}
      rightIcon={!maintenance ? require('./img/ic_arrow_point_to_right.png') : null}
      onPress={this.onMainButtonPress}
    />
  );
  renderButtonSection = (maintenance) => {
    const { data } = this.props;
    return (
      <View style={styles.buttonContainer}>
        {data.secondButtonURL ? this.renderLinkButton() : null}
        {this.renderSubmitButton(maintenance)}
      </View>
    );
  };

  renderMaintenance = (topupServiceStatus) => {
    let message = '';
    let image = '';
    if (topupServiceStatus.mobile_card && topupServiceStatus.mobile_card.status === false) {
      message = topupServiceStatus.mobile_card.message;
      image = topupServiceStatus.mobile_card.image;
    }

    return image ? (
      <View style={{ marginTop: 32, marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={[styles.container, containerStyle]}>
        {maintenance}
        {!maintenance ? this.renderFormTitle() : null}
        {!maintenance ? this.renderSelectCarrierSection() : null}
        {!maintenance ? this.renderListTelephoneCardSection() : null}
        {!maintenance ? this.renderNumberPickerSection() : null}
        {!maintenance ? this.renderEmailSection() : null}
        {this.renderButtonSection(maintenance)}
        {<Loading visible={showLoading} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    borderRadius: 6,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
  },
  formTitle: {
    marginBottom: 20,
    paddingLeft: 28,
    paddingRight: 28,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0.4,
    color: 'rgba(36, 37, 61, 0.6)',
  },
  label: {
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: Colors.primary4,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  carrierBox: {
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.primary2,
    marginTop: 12,
  },
  mobileCardItem: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 2,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberPickerContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emailContainer: {
    marginTop: 16,
    backgroundColor: Colors.neutral5,
    // marginLeft: 12,
    // marginRight: 12,
    borderRadius: 4,
    // padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  emailCheckBoxDivider: {
    marginBottom: 16,
    width: '100%',
    height: 1,
    alignSelf: 'center',
    backgroundColor: Colors.neutral3,
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
});

MobileCardForm.defaultProps = {
  numberPickerValue: 1,
  numberPickerMin: 1,
  numberPickerMax: 3,
};

export default MobileCardForm;
