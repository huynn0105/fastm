/* eslint-disable react/no-unused-state */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import HTML from 'react-native-render-html';
import isEmpty from 'lodash/isEmpty';
import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import LinkButton from '../LinkButton/index';
import ImageButton from '../../common/buttons/ImageButton';
import { BouncingButton } from '../BouncingButton/index';
import { isPhoneNumberValid, prettyMoneyStringWithoutSymbol, SCREEN_WIDTH } from '../../utils/Utils';
import CarrierCheckBoxItem2 from './CarrierCheckBoxItem2';
import LocalStorageUtil from '../../utils/LocalStorageUtil';
import { SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM } from '../../screens2/Home/CustomerFormContainer/CustomerFormContainerEnums';
import { Loading } from '../LoadingComponent';
import FastImage from 'react-native-fast-image';
import { MobileCardItem } from './MobileCardItem';
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
      style={{ flexDirection: 'row', alignItems: 'center', ...props.style, backgroundColor: '#fff' }}
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

class MobileCardFormAndTopupForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { numberPickerValue, mobileCard } = props;
    this.state = {
      showErrorListScratchCardSection: false,
      isEmailCheckBoxSelected: false,
      numberPickerValue,
      selectedTelephoneCardIndex: -1,
      idSelectedBox: null,
      selectedAmountIndex: 0,
      errorMessage: '',
      showWarningMessage: false,
      showPhoneInputErrorMessage: false,
      showClearTextButton: false,
      phone: '',
      selectedCarrierIndex: mobileCard?.selectedIndex,
    };
    this.selectCarrierScrollViewRef = undefined;
    this.telephoneCardFlatListRef = undefined;
  }

  componentDidMount() {
    const { mobileCard, topup, initSelectedId } = this.props;
    if (this.props.onRef !== null && this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
    if(initSelectedId) {
      this.setState({ idSelectedBox: initSelectedId })
    }
    this.loadSelectedCarrierIndexFromLocalStorage(); 
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


  loadSelectedCarrierIndexFromLocalStorage = async () => {
    try {
      const responseValue = await LocalStorageUtil.retrieveDataAsyncStorage(
        SAVE_INDEX_OF_SELECTED_CARRIER_CHECK_BOX_ITEM,
      );
      if(responseValue && parseInt(responseValue) > -1) {
        this.onCarrierCheckBoxItemPress(parseInt(responseValue));
      }
    } catch (error) {
      // console.log('loadSelectedCarrierIndexFromLocalStorage failed: ', error.message);
    }
  };

  scrollToSelectedCarrierCheckBoxItemIndex = (index) => {
      setTimeout(() => {
        if (this.selectCarrierScrollViewRef !== undefined) {
            this.selectCarrierScrollViewRef.scrollTo({
              x: index * (SCREEN_WIDTH / 3.9) - (SCREEN_WIDTH / 3.9) * 1.1,
              animated: true,
            });
        }
      }, 420);
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
  onPressSelectedBox = (idSelected) => {
    const { idSelectedBox } = this.state;
    let exId = idSelected;
    if(idSelectedBox === idSelected) {
      exId = null
    }
    this.setState({ idSelectedBox: exId });
  }

  onPressSelectedTopup = () => {
    const { topup } = this.props;
    if(topup) {
      this.setState({ idSelectedBox: topup?.id });
    }
  }

  onChangePhoneInputText = (text) => {
    this.setState({
      phone: text,
      showPhoneInputErrorMessage: false,
      showClearTextButton: text.length !== 0,
    });
  };

  onClearTextInputPress = () => {
    this.setState({
      phone: '',
    });
  };

  onMobileCardMainButtonPress = () => {
    const { selectedCarrierIndex } = this.state;
    const { mobileCard, onMobileCardMainButtonPress } = this.props;
    const { isEmailCheckBoxSelected, numberPickerValue, selectedTelephoneCardIndex } = this.state;
    const data = mobileCard?.items?.[selectedCarrierIndex];
    if (isEmpty(data)) {
      this.setState({ showErrorListScratchCardSection: true });
      return;
    }
    const selectedTelephoneCard = data?.listRouting?.[selectedTelephoneCardIndex];
    if (isEmpty(selectedTelephoneCard)) {
      this.setState({ showErrorListScratchCardSection: true });
      return;
    }
    const telcoAlias = data?.extraData?.telcoAlias;
    if (isEmpty(telcoAlias)) {
      this.setState({ showErrorListScratchCardSection: true });
      return;
    }
    onMobileCardMainButtonPress({
      isEmailCheckBoxSelected,
      numberPickerValue,
      selectedTelephoneCard,
      telcoAlias
    });
  };


  onTopupMainButtonPress = () => {
    const {
      selectedCarrierIndex,
      selectedAmountIndex,
      phone,
    } = this.state;

    const { topup } = this.props;
    const selectedCarrier = topup?.items?.[selectedCarrierIndex];
    const selectedAmount = topup?.amount?.[selectedAmountIndex];
    if (isPhoneNumberValid(phone) && selectedCarrier && selectedAmount) {
      this.props.onTopupMainButtonPress({ selectedCarrier, selectedAmount, phone });
    } else {
      this.setState({
        showPhoneInputErrorMessage: true,
      });
    }
  };

  onMobileCardSecondButtonPress = () => {
    this.props.onMobileCardSecondButtonPress();
  }

  onTopupSecondButtonPress = () => {
    this.props.onTopupSecondButtonPress();
  }

  onCarrierCheckBoxItemPress = (index) => {
    this.setState({ selectedCarrierIndex: index });
    this.scrollToSelectedCarrierCheckBoxItemIndex(index);
    this.saveIndexOfSelectedCarrierCheckBoxItem(index);
  };

  onMobileCardAmountItemPress = (index) => {
    this.setState({ selectedAmountIndex:index });
    this.scrollToSelectedAmountItemIndex(index);
  };


  scrollToSelectedAmountItemIndex = (index) => {
    if (this.telephoneCardFlatListRef && this.telephoneCardFlatListRef.scrollTo) {
      this.telephoneCardFlatListRef.scrollTo({
        x: index * TELEPHONE_CARD_ITEM_WIDTH - TELEPHONE_CARD_ITEM_WIDTH * 1.1,
        animated: true,
      });
    }
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

  getsourceIconRight = (actived, isChildren) => {
    let iconRight = require('./img/icon_next.png')
    if(!isChildren) return iconRight;
    if(!actived) {
        iconRight = require('./img/ic_plus.png')
    } else {
        iconRight = require('./img/ic_collapse.png')
    }
    return iconRight;
  }

  renderSelectionForm = (data, actived) => {
    const { topup } = this.props;
    const title = data?.id === topup?.id ? 'Nạp tiền ĐT' : 'Mua thẻ ĐT'
    return (
      <View style={styles.wrapperItem}>
        <TouchableOpacity onPress={() => this.onPressSelectedBox(data?.id)}>
          <View style={styles.containerItem}>
            <View style={{}}>
              {data.iconUrl ?
                <Image
                  source={{uri: data.iconUrl}}
                  style={{
                    width: 32,
                    aspectRatio: 56 / 56
                  }}
                /> :
                <View
                  style={{
                    width: 32,
                    aspectRatio: 56 / 56
                  }}
                />
              }
            </View>
            <View style={{ flex: 1, marginHorizontal: 16  }}>
                <HTML
                  html={data?.formTitleHTML}
                  onLinkPress={(obj, href) => {
                    this.navigateToWebView({ mode: 0, title, url: href });
                  }}
                  tagsStyles={{
                    a: { textDecorationLine: 'none' },
                    b: { margin: 0 },
                    p: { margin: 0 },
                    h1: { margin: 0 },
                    h2: { margin: 0 },
                    h3: { margin: 0 },
                    h4: { margin: 0 },
                    h6: { margin: 0 },
                    span: { margin: 0 },
                  }}
                />
                <HTML
                  html={data?.descriptionHTML}
                  onLinkPress={(obj, href) => {
                    this.navigateToWebView({ mode: 0, title, url: href });
                  }}
                  tagsStyles={{
                    a: { textDecorationLine: 'none' },
                    b: { margin: 0 },
                    p: { margin: 0 },
                    h1: { margin: 0 },
                    h2: { margin: 0 },
                    h3: { margin: 0 },
                    h4: { margin: 0 },
                    h6: { margin: 0 },
                    span: { margin: 0 },
                  }}
                />
            </View>
            <View style={{ justifyContent: 'center', height: '100%' }}>
                <Image
                  source={this.getsourceIconRight(actived, !isEmpty(data))}
                  style={{
                    width: 20,
                    height: 20
                  }}
                />
            </View>
          </View>
        </TouchableOpacity>
        {actived && this.renderChild()}
      </View>
    )
  }

  renderSmallPaddingView = (style) => <View style={style} />;

  renderSelectCarrierSection = () => {
    const { idSelectedBox, selectedCarrierIndex } = this.state;
    const { mobileCard, topup } = this.props;
    const data = idSelectedBox === mobileCard?.id ? mobileCard : topup;
    if(isEmpty(data)) return <View />;
    return (
      <View style={{ marginLeft: -10, marginRight: -10, marginTop: 4 }}>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6, marginLeft: 10 }}>
          {'Chọn nhà mạng'}
        </AppText>
        <ScrollView
          ref={(ref) => {
            this.selectCarrierScrollViewRef = ref;
          }}
          style={{ marginTop: 8, paddingBottom: 16, flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {data.items.map((item, index) => {
            return (
              <CarrierCheckBoxItem2
                key={item?.label}
                containerStyle={{
                  marginRight: 8,
                  marginLeft: index === 0 ? 10 : 0,
                }}
                label={item.label || item.name}
                description={item.description}
                isSelected={selectedCarrierIndex === index}
                imageSource={{ uri: item.imageUrl }}
                onPress={() => {
                  this.onCarrierCheckBoxItemPress(index);
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };
  renderTelephoneCardItem = ({ item, index }) => {
    const { selectedTelephoneCardIndex } = this.state;

    const isSelected = selectedTelephoneCardIndex > -1 && selectedTelephoneCardIndex === index;

    const containerBGColor = isSelected ? Colors.primary2 : '#E6EBFF';
    const totalPriceTextColor = isSelected ? Colors.primary5 : Colors.primary4;
    const discountedPriceTextColor = isSelected ? Colors.primary5 : Colors.primary4;
    const totalPrice = prettyMoneyStringWithoutSymbol(item.price);
    const calculatedDiscountedPrice = item.price - (item.price * item.discount) / 100;
    const discountedPrice = prettyMoneyStringWithoutSymbol(calculatedDiscountedPrice);

    return (
      <TelephoneCardItem
        containerStyle={{
          width: TELEPHONE_CARD_ITEM_WIDTH,
          marginLeft: index === 0 ? 10 : 0,
          marginRight: 10,
          backgroundColor: containerBGColor,
          borderWidth: 0.5,
          borderColor: Colors.neutral4,
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
  renderErrorMessage = (label, marginLeft) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
          marginLeft: marginLeft || 0,
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
    const { showErrorListScratchCardSection, selectedCarrierIndex } = this.state;
    const { idSelectedBox } = this.state;
    const { mobileCard, topup } = this.props;
    if(idSelectedBox === mobileCard?.id) {
      const data = mobileCard?.items?.[selectedCarrierIndex]?.listRouting || [];
      if(isEmpty(data)) return <View />;
      return (
        <View style={{ marginRight: -10, marginLeft: -10 }}>
          <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6, marginLeft: 10 }}>
            {'Mệnh giá thẻ'}
          </AppText>
          {showErrorListScratchCardSection && this.renderErrorMessage('Bạn chưa chọn mệnh giá thẻ', 16)}
          <FlatList
            ref={(ref) => {
              this.telephoneCardFlatListRef = ref;
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            renderItem={this.renderTelephoneCardItem}
            extraData={this.state}
          />
        </View>
      );
    }
    const { selectedAmountIndex } = this.state;
    const listAmount = topup?.amount || [];
    if(isEmpty(listAmount)) return <View />;
    return (
      <View style={{ marginRight: -10, marginLeft: -10 }}>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6, marginLeft: 10 }}>
            {'Số tiền muốn nạp'}
        </AppText>
        <ScrollView
          ref={(ref) => {
            this.telephoneCardFlatListRef = ref;
          }}
          style={{ marginTop: 8 }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          <View style={{ flexDirection: 'row' }}>
            {listAmount.map((item, index) => (
              <MobileCardItem
                containerStyle={{
                  marginLeft: index === 0 ? 10 : 10,
                  width: SCREEN_WIDTH / 4.37,
                  marginRight: index === listAmount.length - 1 ? 10 : 0,
                  borderWidth: 0.5,
                  borderColor: Colors.neutral4,
                }}
                key={index.toString()}
                index={index}
                isSelected={selectedAmountIndex === index}
                totalPrice={prettyMoneyStringWithoutSymbol(item.ori_price)}
                discountedPrice={prettyMoneyStringWithoutSymbol(item.price)}
                onPress={this.onMobileCardAmountItemPress}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    )
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
    const emailCheckBoxStyle = email ? {} : {  };
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
  renderTopupSecondLinkButton = () => (
    <LinkButton
      text={'Quản lý'}
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      onPress={this.onTopupSecondButtonPress}
    />
  );
  renderMobileCardSecondLinkButton = () => (
    <LinkButton
      text={'Quản lý'}
      textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
      onPress={this.onMobileCardSecondButtonPress}
    />
  );
  renderSubmitMobileCardButton = (maintenance) => (
    <CustomButton
      disabled={!isEmpty(maintenance)}
      sizeType={BUTTON_SIZE.REGULAR}
      title={'Mua mã thẻ cào'}
      rightIcon={!maintenance ? require('./img/ic_arrow_point_to_right.png') : null}
      onPress={this.onMobileCardMainButtonPress}
    />
  );

  renderSubmitTopupButton = (maintenance) => (
    <CustomButton
      disabled={!isEmpty(maintenance)}
      sizeType={BUTTON_SIZE.REGULAR}
      title={`Nạp tiền ĐT T. Trước`}
      rightIcon={!maintenance ? require('./img/ic_arrow_point_to_right.png') : null}
      onPress={this.onTopupMainButtonPress}
    />
  );

  renderButtonSection = (maintenance) => {
    const { idSelectedBox } = this.state;
    const { topup, mobileCard } = this.props;
    const isTopup = idSelectedBox === topup?.id;
    return (
      <View style={styles.buttonContainer}>
        {(isTopup && topup?.secondButtonURL) ? this.renderTopupSecondLinkButton() : null}
        {(!isTopup && mobileCard?.secondButtonURL)  ? this.renderMobileCardSecondLinkButton() : null}
        {isTopup ?
          this.renderSubmitTopupButton(maintenance) :
          this.renderSubmitMobileCardButton(maintenance)
        }
      </View>
    );
  };

  renderMaintenanceMobileCard = () => {
    const { maintenanceData } = this.props;
    const dbMaintain = maintenanceData?.mobile_card;
    let message = '';
    let image = '';
    if (dbMaintain && dbMaintain.status === false) {
      message = dbMaintain.message;
      image = dbMaintain.image;
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


  renderMaintenanceTopup = () => {
    const { maintenanceData } = this.props;
    const dbMaintain = maintenanceData?.prepaid;
    let message = '';
    let image = '';
    if (dbMaintain && dbMaintain.status === false) {
      message = dbMaintain.message;
      image = dbMaintain.image;
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

  renderMaintenance = () => {
    const { idSelectedBox } = this.state;
    const { mobileCard } = this.props;
    return idSelectedBox === mobileCard?.id ? this.renderMaintenanceMobileCard() : this.renderMaintenanceTopup();
  }

  renderInputPhoneNumberSection = () => {
    const {
      phone,
      showPhoneInputErrorMessage,
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
          <AppText style={styles.topUpPlanText}>{`TRẢ TRƯỚC`}</AppText>
        </View>
        {showPhoneInputErrorMessage ? this.renderErrorMessage('Nhập số điện thoại Trả trước muốn nạp tiền') : null}
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
        <AppText style={styles.warningMessageText}>
          {'Cảnh báo: '}
          <AppText style={{ color: Colors.accent3, opacity: 1 }}>{'Không áp dụng '}</AppText>
          <AppText>{'chung với các chương trình khuyến mãi khác của nhà mạng'}</AppText>
        </AppText>
      </View>
    );
  };


  renderSectionInformation = () => {
    const { idSelectedBox } = this.state;
    const { topup } = this.props;
    if(idSelectedBox === topup?.id)
    return (
      <View>
        {this.renderInputPhoneNumberSection()}
      </View>
    )
    return (
      <View>
        {this.renderNumberPickerSection()}
        {this.renderEmailSection()}
      </View>
    )
  }

  renderChild = () => {
    const maintenance = this.renderMaintenance();
    // test 
    // const maintenance = false;
    return (
      <View style={{ backgroundColor: 'rgb(224, 255, 216)', borderRadius: 6, padding: 10, marginTop: 10 }}>
        {
         maintenance ? maintenance : 
          <View>
            {this.renderSelectCarrierSection()}
            {this.renderListTelephoneCardSection()}
            {this.renderSectionInformation()}
         </View> 
        }
        {this.renderButtonSection(maintenance)}
      </View>
    )
  }

  render() {
    const { status, topup, mobileCard, showLoading } = this.props;
    const { idSelectedBox } = this.state;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.container, containerStyle]}>
          {topup && this.renderSelectionForm(topup, idSelectedBox === topup?.id)}
          {mobileCard && (
            <View>
              <View 
                style={{
                  width: '100%',
                  height: 0.5,
                  backgroundColor: Colors.neutral4,
                }}
              />
              {this.renderSelectionForm(mobileCard, idSelectedBox === mobileCard?.id)}
            </View>
          )}
        </View>
        <Loading visible={showLoading} />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#fff',
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
  warningMessageText: {
    marginTop: 12,
    ...TextStyles.normalTitle,
    color: Colors.neutral3,
    marginBottom: 4,
    textAlign: 'center',
  },
  topUpPlanText: {
    ...TextStyles.normalTitle,
    opacity: 1,
    color: Colors.accent3,
    fontWeight: 'bold',
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
  wrapperItem: {
    marginVertical: 16,
  },
  containerItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
  },
});

MobileCardFormAndTopupForm.defaultProps = {
  numberPickerValue: 1,
  numberPickerMin: 1,
  numberPickerMax: 3,
};

export default MobileCardFormAndTopupForm;
