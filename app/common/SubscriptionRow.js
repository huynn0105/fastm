/**
 * Copyright (C) SaigonMD, Inc - All Rights Reserved
 * Licensed under the MIT license.
 * Written by Tran Quan <tranquan221b@gmail.com>, Jan 2018
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View, Image, Text,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import { Subscription } from 'app/models';
import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';
import AppText from '../componentV3/AppText';

const _ = require('lodash');

// --------------------------------------------------
// SubscriptionRow
// --------------------------------------------------

class SubscriptionRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.subscription);
  }
  // --------------------------------------------------
  render() {
    const {
      subscription, isArrowHidden,
    } = this.props;
    return (
      <View>
        <KJTouchableOpacity
          onPress={this.onPress}
        >
          <Animatable.View
            style={styles.container}
            animation="fadeIn"
            useNativeDriver
          >
            <View style={styles.rowContainer}>
              <LogoImage
                image={subscription.logoImageURI()}
              />
              <View style={{ width: 8, backgroundColor: '#0000' }} />
              <Body
                name={subscription.roleDetails}
                agentRole={subscription.roleDetails}
                agentRoleStyle={subscription.roleStyle()}
                agentMoney={subscription.totalMoney}
                agentPoint={subscription.totalPointString()}
              />
              <View style={{ width: 4, backgroundColor: '#0000' }} />
              {
                isArrowHidden ? null :
                  <Arrow />
              }
            </View>
          </Animatable.View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const LogoImage = (props) => (
  <KJImage
    style={styles.logoImage}
    source={props.image}
    resizeMode="cover"
  />
);

const Body = (props) => (
  <View style={styles.contentContainer}>
    <AppText
      style={styles.titleText}
      numberOfLines={1}
    >
      {props.name}
    </AppText>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <DetailText
        style={{ flex: 0, marginTop: 6 }}
        title="Doanh số"
        details={props.agentMoney}
      />
      <AppText
        style={{
          alignItems: 'center',
          marginTop: 2,
          fontSize: 16,
          color: '#606060',
        }}
      >
        {' | '}
      </AppText>
      <DetailText
        style={{ flex: 0, marginTop: 6 }}
        title="Điểm"
        details={props.agentPoint}
        isUnitHidden
      />
    </View>
  </View>
);

const DetailText = (props) => (
  <View
    style={[{
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      overflow: 'hidden',
    }, props.style]}
  >
    {
      props.title.length === 0 ? null :
        <AppText
          style={{ fontSize: 12, color: '#666E73' }}
          numberOfLines={1}
        >
          {`${props.title}: `}
        </AppText>
    }
    <AppText
      style={styles.amountTitle}
      numberOfLines={1}
    >
      {`${props.details}`}
    </AppText>
    {
      props.isUnitHidden ? null :
        <View style={{ flexDirection: 'column' }}>
          <AppText style={styles.amountUnit}>
            {' vnđ'}
          </AppText>
        </View>
    }
  </View>
);

const Arrow = () => (
  <Image
    style={{ alignSelf: 'center', width: 12 }}
    source={require('./img/arrow_right1.png')}
    resizeMode="contain"
  />
);

// --------------------------------------------------

SubscriptionRow.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  isArrowHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

SubscriptionRow.defaultProps = {
  isArrowHidden: false,
  onPress: () => { },
};

export default SubscriptionRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 16,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 16,
    marginTop: 2,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#C0C0C0',
    borderWidth: 0.5,
    shadowOffset: { width: 0.0, height: 1 },
    shadowColor: '#808080',
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 2,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    paddingLeft: 2,
    paddingRight: 4,
  },
  logoImage: {
    width: 46,
    height: 46,
    borderRadius: 23.0,
    borderWidth: 0.0,
    backgroundColor: '#0000',
  },
  titleText: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
  },
  amountTitle: {
    color: '#2696E0',
    fontSize: 13,
    fontWeight: '600',
  },
  amountUnit: {
    marginTop: -1,
    color: '#2696E0',
    fontSize: 9,
    fontWeight: '600',
  },
});
