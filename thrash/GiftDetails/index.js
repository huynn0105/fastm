import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import HTMLView from 'react-native-htmlview';
import ScalableImage from 'react-native-scalable-image';

import AppStyles from '../../constants/styles';
import AppColors from '../../constants/colors';
import AppStrings from '../../constants/strings';
import ImageViewer from '../others/ImageViewer';

import { fetchMyUser, redeemGift } from '../../redux/actions';

import KJTextButton from '../../common/KJTextButton';
import MessageBox from '../../common/MessageBox';
import RedeemsCounterText from '../../common/RedeemsCounterText';

// --------------------------------------------------

/* eslint-disable */
import Utils from '../../utils/Utils';
const LOG_TAG = '7777: GiftDetailsScreen.js';
/* eslint-enable */

const SCREEN_SIZE = Dimensions.get('window');
const HEADER_IMAGE_WIDTH = SCREEN_SIZE.width;

// --------------------------------------------------
// GiftDetailsScreen
// --------------------------------------------------

class GiftDetailsScreen extends Component {
  constructor(props) {
    super(props);

    if (this.props.navigation !== undefined) {
      this.state = {
        gift: this.props.navigation.state.params.gift,
        isMessageBoxVisible: false,
        messageBoxType: 'redeemConfirm',
        isImageViewerHidden: true,
      };
    }
  }
  componentDidUpdate(prevProps) {
    this.handleRedeemResponse(prevProps);
  }
  // --------------------------------------------------
  onRedeemPress = () => {
    this.showRedeemConfirmMessageBox();
  }
  onGiftImagePress = () => {
    this.showImageViewer();
  }
  // --------------------------------------------------
  handleRedeemResponse(prevProps) {
    // status unchanged
    const isRedeemStatusChange = 
      this.props.redeemGiftResponse.status !== prevProps.redeemGiftResponse.status;
    if (!isRedeemStatusChange) return;
    // status changed
    const redeemStatus = this.props.response.status;
    const message = this.props.response.message;
    if (redeemStatus) {
      // success
      setTimeout(() => {
        this.props.fetchMyUser();
        this.showRedeemSuccessMessageBox(message);
      }, 250);
    } else {
      // error
      setTimeout(() => {
        Alert.alert(
          AppStrings.app_name,
          message,
          [
            { text: 'OK', onPress: null },
          ],
          { cancelable: false },
        );
      }, 250);
    }
  }
  redeemGift() {
    this.closeMessageBox();
    setTimeout(() => {
      const giftID = this.state.gift.uid;
      this.props.redeemGift(giftID);
    }, 500);
  }
  showRedeemConfirmMessageBox() {
    this.setState({
      isMessageBoxVisible: true,
      messageBoxType: 'redeemConfirm',
      extraMessage: '',
    });
  }
  showRedeemSuccessMessageBox(message) {
    this.setState({
      isMessageBoxVisible: true,
      messageBoxType: 'redeemSuccess',
      extraMessage: message,
    });
  }
  closeMessageBox() {
    this.setState({
      isMessageBoxVisible: false,
    });
  }
  showImageViewer() {
    this.setState({
      isImageViewerHidden: false,
    });
  }
  hideImageViewer() {
    this.setState({
      isImageViewerHidden: true,
    });
  }
  // --------------------------------------------------
  renderGiftImage() {
    const {
      gift,
    } = this.state;
    return (
      <TouchableOpacity
        onPress={this.onGiftImagePress}
      >
        <ScalableImage
          width={HEADER_IMAGE_WIDTH}
          style={styles.headerImage}
          source={gift.imageURI()}
        />
      </TouchableOpacity>
    );
  }
  renderGiftContent() {
    const {
      gift,
    } = this.state;
    Utils.log(`${LOG_TAG} html content: ${gift.htmlContent}`);
    return (
      <View style={styles.bodyContainer}>
        
        <Text style={styles.titleText}>
          {gift.title}
        </Text>
        
        <View style={styles.infoContainer}>
          
          <Text style={styles.redeemPointsText}>
            {`Điểm quy đổi: ${gift.redeemPointsString()}`}
          </Text>
          
          <View style={{ width: 20 }} />
          <RedeemsCounterText count={gift.totalRedeems} />
          
          <View style={{ width: 12 }} />
          <Text style={styles.totalLeftsText}>
            {`Còn lại: ${gift.totalLefts}`}
          </Text>

        </View>
        
        <Text style={styles.detailsText}>
          {gift.details}
        </Text>
        
        <HTMLView
          style={styles.contentText}
          value={gift.htmlContent}
          paragraphBreak={'\n'}
          lineBreak={'\n'}
        />

      </View>
    );
  }
  renderRedeem() {
    const {
      gift,
    } = this.state;
    
    const isRedeemEnable = this.props.myUser.totalPoint >= gift.redeemPoints;
    const redeemButtonBackgroundColor = isRedeemEnable ? AppColors.button_background : '#BABABA';
    
    return (
      <View style={{ paddingBottom: 24, backgroundColor: '#fff' }}>
        <KJTextButton
          disabled={!isRedeemEnable}
          buttonStyle={[
            AppStyles.button, styles.redeemButton,
          ]}
          textStyle={[AppStyles.button_text, { marginLeft: 12, marginRight: 12 }]}
          text={'Đổi quà'}
          onPress={this.onRedeemPress}
          backgroundColor={redeemButtonBackgroundColor}
        />
        {
          isRedeemEnable ? null :
            <Text style={styles.waringText}>
              {AppStrings.redeem_not_enough_points}
            </Text>
        }
      </View>
    );
  }
  renderImageViewer() {
    return (
      <Modal
        style={{ margin: 0, padding: 0 }}
        isVisible={!this.state.isImageViewerHidden}
      >
        <ImageViewer
          imageUri={this.state.gift.image}
          onClosePress={() => this.hideImageViewer()}
        />
      </Modal>
    );
  }
  // --------------------------------------------------
  render() {
    const {
      isMessageBoxVisible,
      messageBoxType,
      extraMessage,
    } = this.state;
    const {
      isRedeemGiftProcessing,
    } = this.props;

    return (
      <ScrollView
        ref={o => { this.scrollView = o; }}
        style={styles.scrollView}
      >
        {this.renderGiftImage()}
        {this.renderGiftContent()}
        {this.renderRedeem()}

        {this.renderImageViewer()}
        
        <MessageBoxModal
          isVisible={isMessageBoxVisible}
          messageBoxType={messageBoxType}
          extraMessage={extraMessage}
          onCancelPress={() => this.closeMessageBox()}
          onConfirmPress={() => this.redeemGift()}
        />

        <Spinner
          visible={isRedeemGiftProcessing}
          textContent=""
          textStyle={{ color: '#FFF' }}
          overlayColor="#00000080"
        />
        
      </ScrollView>
    );
  }
}

const MessageBoxModal = (props) => (
  <Modal isVisible={props.isVisible}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {
        props.messageBoxType === 'redeemConfirm' ?
        <RedeemConfirmMessageBox
          title={'Bạn có chắc muốn đổi quà tặng này?'}
          message={'Số điểm tương ứng sẽ được trừ trực tiếp vào điểm tích lũy của bạn'}
          onCancelPress={() => props.onCancelPress()}
          onConfirmPress={() => props.onConfirmPress()}
        />
        :
        <RedeemSuccessMessageBox
          title={`Đổi quà thành công\n${props.extraMessage}`}
          message={'Số điểm tương ứng sẽ được trừ trực tiếp vào điểm tích lũy của bạn'}
          onCancelPress={() => props.onCancelPress()}
        />
      }
      <View style={{ height: 44 }} />
    </View>
  </Modal>
);

const RedeemSuccessMessageBox = (props) => (
  <MessageBox
    title={props.title}
    titleStyle={{ color: '#000', fontWeight: '400' }}
    message={props.message}
    messageStyle={{ color: '#808080', fontWeight: '300' }}
    leftButtonTitle={''}
    rightButtonTitle={'Tiếp tục'}
    onRightButtonPress={() => props.onCancelPress()}
  />
);

const RedeemConfirmMessageBox = (props) => (
  <MessageBox
    title={props.title}
    titleStyle={{ color: '#000', fontWeight: '400' }}
    message={props.message}
    messageStyle={{ color: '#808080', fontWeight: '300' }}
    leftButtonTitle={'Hủy'}
    leftButtonTitleStyle={{ color: '#8D8D8D' }}
    onLeftButtonPress={() => props.onCancelPress()}
    rightButtonTitle={'Đồng ý'}
    rightButtonTitleStyle={{ color: '#2A98E0' }}
    onRightButtonPress={() => props.onConfirmPress()}
  />
);

// --------------------------------------------------

GiftDetailsScreen.navigationOptions = () => ({
  title: 'Chi tiết quà tặng',
  headerStyle: AppStyles.navigator_header_no_border,
  headerTitleStyle: AppStyles.navigator_header_title,
  headerTintColor: '#000',
});

// --------------------------------------------------
// react-redux
// --------------------------------------------------

GiftDetailsScreen.contextTypes = {
  store: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  myUser: state.myUser,
  isRedeemGiftProcessing: state.isRedeemGiftProcessing,
  redeemGiftResponse: state.redeemGiftResponse,
});

const mapDispatchToProps = (dispatch) => ({
  fetchMyUser: () => dispatch(fetchMyUser()),
  redeemGift: (giftID) => dispatch(redeemGift(giftID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GiftDetailsScreen);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#E6EBFF',
  },
  scrollView: {
    flex: 1,
  },
  bodyContainer: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  headerImage: {
    flex: 0,
  },
  titleText: {
    color: AppColors.text_black1,
    fontSize: 22,
  },
  detailsText: {
    marginTop: 12,
    color: AppColors.text_black2,
    fontSize: 14,
  },
  contentText: {
    marginTop: 12,
    color: AppColors.text_black2,
    fontSize: 14,
  },
  waringText: {
    alignSelf: 'center',
    marginTop: 16,
    color: AppColors.text_black2,
    fontSize: 14,
    textAlign: 'center',
  },
  redeemPointsText: {
    color: '#1477F3',
    fontSize: 13,
  },
  totalLeftsText: {
    color: AppColors.text_black2,
    fontSize: 12,
  },
  redeemButton: {
    alignSelf: 'center',
    marginTop: 20,
    width: 128,
    height: 36,
  },
});
