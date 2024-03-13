import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Linking,
} from 'react-native';
import HTML from 'react-native-render-html';
import _ from 'lodash';

import CustomButton, { BUTTON_SIZE } from '../CustomButton';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import LinkButton from '../LinkButton/index';
import { CircleImageButton } from '../CircleImageButton';
import { CustomTextField } from '../CustomTextField';
import GroupCheckBox from '../GroupCheckBox';
import ImageButton from '../ImageButton';
import { checkRestrict } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';

// const INSURANCE_ID = {
//   GLOBAL_CARE: 'Global Care',
//   BSH: 'BSH Ticket',
//   BSH: 'BSH Ticket',
// };

const GroupInsuranceItem = (props) => {
  const { checkBoxItems, onPress } = props;
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
      }}
    >
      {checkBoxItems.map((item, index) => {
        const icon = item.isSelected
          ? require('./img/ic_check.png')
          : require('./img/ic_empty_circle.png');

        return (
          <TouchableOpacity
            activeOpacity={0.2}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              onPress(index);
            }}
          >
            <Image style={{ width: 24, height: 24 }} source={icon} resizeMode="cover" />
            <Image
              style={{ marginLeft: 8, width: 40, height: 26 }}
              source={{ uri: item.logo }}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const FeatureItem = ({ label, imageSource, hideDivineLine, onPress }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', paddingTop: 12, paddingBottom: 12, alignItems: 'center' }}
      onPress={onPress}
    >
      <Image style={{ width: 26, height: 26 }} source={imageSource} resizeMode="contain" />
      <AppText style={{ ...TextStyles.heading3, marginLeft: 17, fontSize: 14 }}>{label}</AppText>
      {!hideDivineLine ? (
        <View
          style={{
            width: '100%',
            height: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: Colors.neutral5,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const BSHResultItem = ({ textStyle, title, onPress }) => {
  return (
    <TouchableOpacity
      style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }}
      onPress={onPress}
    >
      <AppText style={{ ...TextStyles.heading3, ...textStyle }}>{title}</AppText>
    </TouchableOpacity>
  );
};

export const INSURANCE_FORM_MODE = {
  GLOBAL_CARE: 'GB',
  BSH: 'BSH',
};

class InsuranceCustomerForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formMode: props.initialFormMode || INSURANCE_FORM_MODE.GLOBAL_CARE,

      showErrorFullNameTextInput: false,
      showErrorPhoneNumberTextInput: false,
      showErrorCitizenIDTextInput: false,
      selectedItemIndex: 0,
      selectedBSHIndex: 0,
      showBSHSearchResult: false,
      bshSerialInputValue: '',
      showBSHSerialInputClearButton: false,
    };

    this.fullNameTextInputValue = '';
    this.phoneNumberTextInputValue = '';
    this.citizenIDTextInputValue = '';

    this.phoneNumberTextInputRef = undefined;
    this.fullNameTextInputRef = undefined;
    this.citizenIDTextInputRef = undefined;
  }

  componentDidMount() {
    if (this.props.onRef !== null) {
      this.props.onRef(this);
    }
  }

  // -----------------------------------------
  // EVENT HANDLER METHODS
  // -----------------------------------------

  onInsuranceBrandItemPress = (index) => {
    // const { insuranceBrandItems } = this.state;
    // if (insuranceBrandItems[index].isSelected) return;
    // this.handleOnInsuranceBrandItemPress(insuranceBrandItems, index);
    this.setState({ selectedItemIndex: index });
  };

  onChangeFullNameText = (text) => {
    this.fullNameTextInputValue = text;
    this.setState({
      showErrorFullNameTextInput: false,
    });
  };
  onChangePhoneNumberText = (text) => {
    this.phoneNumberTextInputValue = text;
    this.setState({
      showErrorPhoneNumberTextInput: false,
    });
  };
  onChangeCitizenIDText = (text) => {
    this.citizenIDTextInputValue = text;
    this.setState({
      showErrorCitizenIDTextInput: false,
    });
  };
  onInsuranceCompanyItemPress = (item, index) => {
    this.props.onPartnerItemPress(item, index);
  };

  onSelectedTypePress = (index) => {
    this.setState({ selectedBSHIndex: index });
  };

  onBSHSeriInputChangeText = (text) => {
    const { onBSHSeriInputChangeText } = this.props;
    this.setState({
      showBSHSerialInputClearButton: text.length > 0,
      showBSHSearchResult: text.length > 0,
      bshSerialInputValue: text,
    });
    onBSHSeriInputChangeText(text);
  };

  onClearBSHSeriInputPress = () => {
    this.setState({
      showBSHSerialInputClearButton: false,
      bshSerialInputValue: '',
      showBSHSearchResult: false,
    });
  };

  onBSHResultItemPress = (index) => {
    const { bshListSearchResult } = this.props;
    const resultItem = bshListSearchResult[index];
    this.navigateToWebView({
      mode: 0,
      title: 'BSH Ticket',
      url: resultItem.link,
    });
  };

  onGlobalCareFeatureItemPress = (title, url) => {
    this.navigateToWebView({ mode: 0, title, url });
  };

  onGlobalCareMainButtonPress = (url) => {
    this.navigateToWebView({
      mode: 0,
      title: 'Chi tiết sản phẩm',
      url,
    });
  };
  onSecondButtonPress = (data) => {
    this.navigateToWebView({
      mode: 0,
      title: data.title,
      url: data.secondButtonURL,
    });
  };

  navigateToWebView = (webViewParamsObj) => {
    this.props.navigation.navigate('WebView', webViewParamsObj);
  };

  // -----------------------------------------
  // COMMON METHODS
  // -----------------------------------------
  getFullNameTextInputValue = () => {
    return this.fullNameTextInputValue;
  };
  getPhoneNumberTextInputValue = () => {
    return this.phoneNumberTextInputValue;
  };
  getCitizenIDTextInputValue = () => {
    return this.citizenIDTextInputValue;
  };
  showErrorFullNameTextInput = (isShown, message) => {
    this.setState({
      showErrorFullNameTextInput: isShown,
      errorFullNaneMessage: message,
    });
  };
  showErrorPhoneNumberTextInput = (isShown, message) => {
    this.setState({
      showErrorPhoneNumberTextInput: isShown,
      errorPhoneNumberMessage: message,
    });
  };
  showErrorCitizenIDTextInput = (isShown, message) => {
    this.setState({
      showErrorCitizenIDTextInput: isShown,
      errorCitizenIDMessage: message,
    });
  };
  blurAllTextInput = () => {
    this.fullNameTextInputRef.blur();
    this.phoneNumberTextInputRef.blur();
    this.citizenIDTextInputRef.blur();
  };
  validateFormPolicy = () => {
    return this.formPolicyRef.validateFormPolicy();
  };

  checkRestrict = (prefix = '', disable = []) => {
    return disable.map((i) => i.toUpperCase()).includes(prefix.toUpperCase())
      ? prefix.toUpperCase()
      : '';
  };

  // -----------------------------------------
  // RENDER METHODS
  // -----------------------------------------

  renderInsuranceBrandPickerSection = (listPartner = []) => {
    const selectedItem = this.state.selectedItemIndex;
    const insuranceBrandItems = listPartner.map((item, index) => ({
      id: item.label,
      label: item.label,
      isSelected: selectedItem === index,
      logo: item.imageUrl,
    }));

    return (
      <View
        style={{
          marginTop: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <GroupInsuranceItem
          checkBoxItems={insuranceBrandItems}
          onPress={this.onInsuranceBrandItemPress}
        />
      </View>
    );
  };

  // ---- Global Care ---- //
  renderGlobalCareFormTitle = (formTitle, title) => {
    const { onGlobalCareFormTitleLinkPress } = this.props;
    return (
      <View style={{ marginLeft: 12, marginRight: 12 }}>
        <HTML
          html={formTitle}
          onLinkPress={(event, href) => {
            this.navigateToWebView({ mode: 0, title, url: href });
          }}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
        />
      </View>
    );
  };
  renderFullNameTextInput = () => {
    const { showErrorFullNameTextInput, errorFullNaneMessage } = this.state;
    const { onFocusFullNameTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.fullNameTextInputRef = ref;
        }}
        autoCapitalize={'words'}
        containerStyle={{ marginTop: -12, marginBottom: 20 }}
        textFieldLabel={'Nhập họ và tên KH'}
        showError={showErrorFullNameTextInput}
        errorMessage={errorFullNaneMessage}
        onChangeTextFieldText={this.onChangeFullNameText}
        onTextFieldFocus={onFocusFullNameTextInput}
      />
    );
  };
  renderCitizenIdTextInput = () => {
    const { showErrorCitizenIDTextInput, errorCitizenIDMessage } = this.state;
    const { onFocusCitizenIdTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.citizenIDTextInputRef = ref;
        }}
        containerStyle={{ flex: 1, marginRight: 11 }}
        textFieldLabel={'CMND / CCCD'}
        showError={showErrorCitizenIDTextInput}
        errorMessage={errorCitizenIDMessage}
        onChangeTextFieldText={this.onChangeCitizenIDText}
        onTextFieldFocus={onFocusCitizenIdTextInput}
      />
    );
  };
  renderPhoneNumberTextInput = () => {
    const { showErrorPhoneNumberTextInput, errorPhoneNumberMessage } = this.state;
    const { onFocusPhoneNumberTextInput } = this.props;
    return (
      <CustomTextField
        textFieldRef={(ref) => {
          this.phoneNumberTextInputRef = ref;
        }}
        containerStyle={{ flex: 1, marginLeft: 11 }}
        textFieldLabel={'Số điện thoại'}
        showError={showErrorPhoneNumberTextInput}
        errorMessage={errorPhoneNumberMessage}
        keyboardType={'phone-pad'}
        onChangeTextFieldText={this.onChangePhoneNumberText}
        onTextFieldFocus={onFocusPhoneNumberTextInput}
      />
    );
  };
  renderLinkButton = (data) => {
    if (!data.title) {
      data.title = 'Quản lý';
    }
    return (
      <LinkButton
        text={'Quản lý'}
        textStyle={{ ...TextStyles.heading4, color: Colors.primary2 }}
        onPress={() => this.onSecondButtonPress(data)}
      />
    );
  };
  renderGlobalCareSubmitButton = (globalCareData) => (
    <CustomButton
      sizeType={BUTTON_SIZE.REGULAR}
      title={'Chi tiết sản phẩm'}
      rightIcon={require('./img/ic_arrow_point_to_right.png')}
      onPress={() => {
        this.onGlobalCareMainButtonPress(globalCareData.mainButtonURL);
      }}
    />
  );
  renderDescriptionText = () => {
    const { formFooterDescription } = this.props;
    return (
      <View>
        <HTML html={formFooterDescription} />
      </View>
    );
  };
  renderInsuranceCompanyItem = ({ item, index }) => (
    <CircleImageButton
      borderWidth={0.5}
      borderColor={index % 2 === 0 ? Colors.primary2 : Colors.primary1}
      imageSize={46}
      imageSource={{ uri: item.imageUrl }}
      label={item.label}
      textStyle={{ marginTop: 7, opacity: 0.6, ...TextStyles.normalTitle }}
      onPress={() => {
        this.onInsuranceCompanyItemPress(item, index);
      }}
    />
  );
  renderListInsuranceCompany = (partnerDataSource) => (
    <FlatList
      style={{ marginBottom: 20 }}
      data={partnerDataSource.items}
      renderItem={this.renderInsuranceCompanyItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
  renderListProductItemSection = (
    globalCareProductItems,
    sectionTitle = 'Sản phẩm bảo hiểm nổi bật',
  ) => {
    const { insuranceCommonUrl } = this.props;
    if (!globalCareProductItems) return null;
    return (
      <View style={{ marginTop: 4, marginBottom: 20 }}>
        <AppText style={{ ...TextStyles.caption2, opacity: 0.6, marginBottom: 20, marginTop: 12 }}>
          {sectionTitle}
        </AppText>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, right: 0 }}
          onPress={() => {
            this.navigateToWebView({ mode: 0, title: 'Bảo hiểm', url: insuranceCommonUrl });
          }}
        >
          <AppText
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              fontStyle: 'normal',
              color: '#009fdb',
              marginBottom: 17,
              marginTop: 12,
            }}
          >
            {'Xem tất cả sp'}
          </AppText>
        </TouchableOpacity>
        {globalCareProductItems.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.2}
              style={{ marginTop: index === 0 ? 0 : 16 }}
              onPress={() => {
                this.onGlobalCareFeatureItemPress(item.title, item.featureUrl);
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 32, marginTop: 2 }}>
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={{ uri: item.iconURL }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <AppText
                    style={{
                      ...TextStyles.button1,
                      lineHeight: 18,
                      fontSize: 16,
                      color: item.textColor,
                      marginBottom: 8,
                      paddingRight: 50,
                    }}
                  >
                    {item.title}
                  </AppText>
                  <HTML
                    containerStyle={{ paddingRight: 50 }}
                    baseFontStyle={{ lineHeight: 16 }}
                    html={item.description}
                  />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    justifyContent: 'center',
                  }}
                >
                  <Image source={require('./img/ic_arrow.png')} resizeMode="contain" />
                </View>
              </View>
              {index < globalCareProductItems.length - 1 ? (
                <View
                  style={{
                    marginTop: 16,
                    height: 1,
                    width: '100%',
                    backgroundColor: Colors.neutral5,
                  }}
                />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  renderFormGlobalCare = (globalCareData, containerStyle) => {
    const { myUser = {} } = this.props;
    if (_.isEmpty(globalCareData) || _.isEmpty(globalCareData.items)) return null;
    // const { policyHTMLContent, navigation, policyDetailsUrl } = this.props;
    // const { formMode } = this.state;
    // const containerStyle =
    //   formMode === INSURANCE_FORM_MODE.GLOBAL_CARE
    //     ? { position: 'relative', opacity: 1, zIndex: 1 }
    //     : { position: 'absolute', opacity: 0, zIndex: 0 };
    const formTitleHTML = globalCareData.formTitleHTML;
    const title = globalCareData.title;
    const globalCareProductItems = globalCareData.items;
    return (
      <View style={{ ...containerStyle }}>
        {/* {this.renderGlobalCareFormTitle(formTitleHTML, title)} */}
        {/* {this.renderFullNameTextInput()}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          {this.renderCitizenIdTextInput()}
          {this.renderPhoneNumberTextInput()}
        </View>
        {policyHTMLContent && (
          <FormPolicy
            navigation={navigation}
            formPolicyRef={(ref) => {
              this.formPolicyRef = ref;
            }}
            policyHTMLContent={policyHTMLContent}
            onSelectPolicyCheckBox={(isSelected) => {}}
            policyURL={policyDetailsUrl}
          />
        )}
        <View style={styles.buttonContainer}>
          {this.renderGlobalCareLinkButton()}
          {this.renderGlobalCareSubmitButton()}
        </View> */}
        {this.renderListProductItemSection(globalCareProductItems)}
        {/* <View style={styles.buttonContainer}>
          {globalCareData.secondButtonURL ? this.renderLinkButton(globalCareData) : null}
          {this.renderGlobalCareSubmitButton(globalCareData)}
        </View> */}
        {checkRestrict(myUser.prefix, globalCareData.disable)
          ? this.renderRestrictButton(myUser, globalCareData)
          : null}
      </View>
    );
  };

  // ---- BSH ---- //
  renderBSHListSearchResultItem = (bshListSearchResult) => {
    return (
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        {bshListSearchResult.map((item, index) => {
          return (
            <BSHResultItem
              title={item.ticket_serial}
              textStyle={{ color: item.color }}
              onPress={() => {
                this.onBSHResultItemPress(index);
              }}
            />
          );
        })}
      </ScrollView>
    );
  };
  renderBSHListSearchResultEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <Image style={{ width: 24, height: 24 }} source={require('./img/ic_null.png')} />
        <AppText style={{ ...TextStyles.caption2, marginTop: 8, textAlign: 'center' }}>
          {'Không có số Seri này trong các quyển bảo hiểm của bạn'}
        </AppText>
      </View>
    );
  };
  renderBSHSearchResult = () => {
    const { bshListSearchResult = [] } = this.props;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('./img/ic_rect.png')} />
        <View style={styles.bshSearchResultContainer}>
          {!_.isEmpty(bshListSearchResult)
            ? this.renderBSHListSearchResultItem(bshListSearchResult)
            : this.renderBSHListSearchResultEmpty()}
        </View>
      </View>
    );
  };
  renderSeriInputSection = () => {
    const { showBSHSearchResult, bshSerialInputValue, showBSHSerialInputClearButton } = this.state;
    return (
      <View style={{ marginTop: 6 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, fontSize: 12 }}>
          {'Tìm số Seri của Phiếu bảo hiểm'}
        </AppText>
        <View style={styles.serialTextInputSection}>
          <AppText style={{ ...TextStyles.normalTitle, color: `${Colors.primary4}44` }}>
            {'AA19/'}
          </AppText>
          <TextInput
            style={styles.serialTextInput}
            value={bshSerialInputValue}
            placeholder="Nhập số phiếu"
            keyboardType="number-pad"
            onChangeText={this.onBSHSeriInputChangeText}
          />
          {showBSHSerialInputClearButton ? (
            <ImageButton
              style={{ position: 'absolute', right: 16, top: '50%', bottom: '50%' }}
              imageSource={require('./img/ic_clear.png')}
              onPress={this.onClearBSHSeriInputPress}
            />
          ) : null}
        </View>
        {showBSHSearchResult ? this.renderBSHSearchResult() : null}
      </View>
    );
  };
  renderListFeaturesSection = (typeData) => {
    const items = typeData.listFeatures.map((item) => ({
      label: item.title,
      imageSource: item.iconURL,
      url: item.featureURL,
    }));
    return (
      <View style={{ marginTop: 10 }}>
        <AppText style={{ ...TextStyles.heading4, opacity: 0.6, fontSize: 12 }}>
          {'Danh sách chức năng'}
        </AppText>
        {items.map((item, index) => {
          return (
            <FeatureItem
              label={item.label}
              imageSource={{ uri: item.imageSource }}
              hideDivineLine={index === items.length - 1}
              onPress={() => this.navigateToWebView({ mode: 0, title: item.label, url: item.url })}
            />
          );
        })}
      </View>
    );
  };
  renderBSHFormTitle = (typeData) => {
    const { formTitleHTML } = typeData;
    return (
      <View style={{ marginTop: 0, marginLeft: 12, marginRight: 12 }}>
        <HTML
          html={formTitleHTML}
          onLinkPress={(event, href) => {
            this.navigateToWebView({ mode: 0, title: typeData.title, url: href });
          }}
          tagsStyles={{ a: { textDecorationLine: 'none' } }}
        />
      </View>
    );
  };
  renderBSHSubmitButtonSection = (typeData) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <CustomButton
          sizeType={BUTTON_SIZE.REGULAR}
          title={'Chi tiết sản phẩm'}
          rightIcon={require('./img/ic_arrow_point_to_right.png')}
          onPress={() =>
            this.navigateToWebView({
              mode: 0,
              title: 'Chi tiết sản phẩm',
              url: typeData.mainButtonURL,
            })
          }
        />
      </View>
    );
  };
  renderFormBSH = (bshData, containerStyle) => {
    const { myUser = {} } = this.props;
    if (!bshData.listInsuranceType || bshData.listInsuranceType.length === 0) return null;

    const { formMode, selectedBSHIndex } = this.state;

    // const containerStyle =
    //   formMode === INSURANCE_FORM_MODE.BSH
    //     ? { position: 'relative', opacity: 1, zIndex: 1 }
    //     : { position: 'absolute', opacity: 0, zIndex: 0 };

    const typeData = bshData.listInsuranceType[selectedBSHIndex];
    const listFeature = typeData.listFeatures;

    return (
      <View style={[containerStyle]}>
        {this.renderRolePicker(bshData)}
        {this.renderBSHFormTitle(typeData)}
        {typeData.canSearch ? this.renderSeriInputSection() : null}
        {typeData.id === 'wholesale' ? this.renderListFeaturesSection(typeData) : null}
        {typeData.id === 'retail'
          ? this.renderListProductItemSection(listFeature, 'Sản phẩm BSH')
          : null}
        <View style={styles.buttonContainer}>
          {typeData.secondButtonURL ? this.renderLinkButton(typeData) : null}
          {this.renderBSHSubmitButtonSection(typeData)}
        </View>
        {checkRestrict(myUser.prefix, bshData.disable)
          ? this.renderRestrictButton(myUser, bshData)
          : null}
      </View>
    );
  };
  renderRestrictButton = (myUser, data) => {
    return (
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            const restrict = checkRestrict(myUser.prefix, data.disable);
            this.props.onRestrictPress(restrict);
          }}
        />
      </View>
    );
  };

  renderRolePicker = (bshData) => {
    const { selectedBSHIndex } = this.state;
    const { listInsuranceType } = bshData;
    const items = listInsuranceType.map((type) => ({
      ...type,
      label: type.title,
      isSelected: false,
    }));
    if (items.length > 0) {
      items[0].isSelected = true;
    }

    if (items.length === 1) return null;

    return (
      <View>
        <AppText style={{ ...TextStyles.normalTitle, opacity: 0.6, marginTop: 17, marginBottom: 0 }}>
          {'Chọn hình thức mua'}
        </AppText>
        <GroupCheckBox
          containerStyle={{ marginTop: 8 }}
          checkBoxItems={items}
          selectedIndex={selectedBSHIndex}
          onPress={this.onSelectedTypePress}
        />
      </View>
    );
  };

  renderPartner = (partner, index) => {
    const containerStyle =
      index === this.state.selectedItemIndex
        ? { position: 'relative', opacity: 1, zIndex: 1 }
        : { position: 'absolute', opacity: 0, zIndex: 0 };
    // return partner.items
    //   ? this.renderFormGlobalCare(partner, containerStyle)
    //   : this.renderFormBSH(partner, containerStyle);
    return this.renderFormGlobalCare(partner, containerStyle);
  };

  render() {
    const { data = [], status } = this.props;
    const containerStyle = status === 1 ? styles.formStatusSelected : styles.formStatusNone;
    const items = data.listPartner ? data.listPartner.items : [];
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        {/* {this.renderInsuranceBrandPickerSection(data.listPartner ? data.listPartner.items : [])} */}
        <View>{items ? items.map(this.renderPartner) : null}</View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 16,
    paddingRight: 16,
    // paddingBottom: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  serialTextInputSection: {
    marginTop: 8,
    borderRadius: 25,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary5,
    shadowColor: 'rgba(0, 130, 224, 0.2)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.neutral4,
    flexDirection: 'row',
  },
  serialTextInput: {
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    height: 50,
    padding: 16,
    marginLeft: 42,
    flex: 1,
    ...TextStyles.heading3,
    lineHeight: 20,
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
  bshSearchResultContainer: {
    width: '100%',
    height: 200,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: 'rgba(0, 130, 224, 0.2)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default InsuranceCustomerForm;
