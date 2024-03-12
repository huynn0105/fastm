import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton, { BUTTON_SIZE } from '../CustomButton/index';
import CharAvatar from '../../components/CharAvatar';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import { prettyMoneyStringWithoutSymbol, prettyNumberString } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';

export class YourWorkCard extends PureComponent {
  renderLeftCircleIcon = leftCircleIcon => (
    <CharAvatar source={leftCircleIcon} avatarStyle={{ backgroundColor: Colors.neutral5 }} />
  );

  //  RENDER WORK INFO
  renderWorkTitleRow = cardTitle => <AppText style={{ ...TextStyles.button2 }}>{cardTitle}</AppText>;

  renderRevenueRow = (revenue = 'N/A') => {
    const formattedRevenue = prettyMoneyStringWithoutSymbol(revenue);
    return (
      <View style={styles.detailsContainer}>
        <AppText style={styles.rowLabel}>{'Doanh số:'}</AppText>
        <View style={{ flexDirection: 'row' }}>
          <AppText style={{ ...styles.number, color: Colors.primary1 }}>{formattedRevenue}</AppText>
          <AppTextText style={{ ...TextStyles.superSmallText, ...styles.subNumber }}>{'vnđ'}</AppTextText>
        </View>
      </View>
    );
  };

  renderPointRow = (point = 'N/A') => {
    const formattedPoint = prettyNumberString(point);
    return (
      <View style={{ ...styles.detailsContainer, marginTop: 4 }}>
        <AppText style={styles.rowLabel}>{'Điểm:'}</AppText>
        <AppText style={{ ...styles.number, color: Colors.primary2 }}>{formattedPoint}</AppText>
      </View>
    );
  };

  renderWorkInfo = (cardTitle, revenue, point) => (
    <View style={{ marginLeft: 17 }}>
      {this.renderWorkTitleRow(cardTitle)}
      {this.renderRevenueRow(revenue)}
      {this.renderPointRow(point)}
    </View>
  );

  renderWorkInfoSection = (leftIcon, cardTitle, revenue, point) => (
    <View style={{ flexDirection: 'row' }}>
      {this.renderLeftCircleIcon(leftIcon)}
      {this.renderWorkInfo(cardTitle, revenue, point)}
    </View>
  );
  //  END OF RENDER WORK INFO

  renderButton = (buttonTitle, buttonColor, onButtonPress) => (
    <CustomButton
      title={buttonTitle}
      sizeType={BUTTON_SIZE.SMALL}
      containerStyle={{ marginTop: 16 }}
      buttonColor={buttonColor}
      buttonStyle={{ width: 203 }}
      onPress={onButtonPress}
    />
  );

  renderArrowIcon = () => (
    <View style={{ position: 'absolute', right: 8, top: 37 }}>
      <Image
        source={require('../UserInfo/img/ic_next.png')}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />
    </View>
  );

  render() {
    const {
      containerStyle,
      cardTitle,
      leftIcon,
      revenue,
      point,
      // buttons
      buttonTitle,
      buttonColor,
      isShownButton,
      onButtonPress,
      onCardPress
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.2}
        style={{ ...styles.container, ...containerStyle }}
        onPress={onCardPress}
      >
        {this.renderWorkInfoSection(leftIcon, cardTitle, revenue, point)}
        {isShownButton ? this.renderButton(buttonTitle, buttonColor, onButtonPress) : null}
        {/* Absolute arrow icon */}
        {this.renderArrowIcon()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingBottom: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowRadius: 64,
    shadowOpacity: 1,
    elevation: 3
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  rowLabel: {
    ...TextStyles.superSmallText,
    width: 50,
    opacity: 0.6
  },
  number: {
    ...TextStyles.heading3,
    marginLeft: 8
  },
  subNumber: {
    alignSelf: 'flex-start',
    marginLeft: 4,
    color: Colors.primary1
  }
});

export default YourWorkCard;
