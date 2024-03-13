import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import PropTypes from 'prop-types';

import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

const _ = require('lodash');

// --------------------------------------------------
// UserAppLightRow
// --------------------------------------------------

class UserAppLightRow extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.userApp);
  };
  // --------------------------------------------------
  render() {
    const { userApp, isArrowHidden, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <KJTouchableOpacity onPress={this.onPress}>
          <View style={styles.rowContainer}>
            <LogoImage />
            <View style={{ width: 8, backgroundColor: '#0000' }} />
            <Body userApp={userApp} />
            <View style={{ width: 4, backgroundColor: '#0000' }} />
            {isArrowHidden ? null : <Arrow />}
          </View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const LogoImage = () => (
  <KJImage style={styles.logoImage} source={require('./img/user_app.png')} resizeMode="cover" />
);

const Body = (props) => (
  <View style={styles.contentContainer}>
    <Text style={styles.titleText} numberOfLines={1}>
      {props.userApp.title}
    </Text>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <DetailTextTenure
        style={{ flex: 0, marginTop: 6 }}
        title="Kì thanh toán"
        details={props.userApp.tenure}
        detailsTotal={props.userApp.tenureTotal}
        isUnitHidden
      />
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <DetailText
        style={{ flex: 0, marginTop: 6 }}
        title="Ngày thanh toán"
        details={props.userApp.expDateTime}
        isUnitHiddem
        color={'#d0021b'}
      />
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
    >
      <DetailText
        style={{ flex: 0, marginTop: 6, marginBottom: 6 }}
        title="Số tiền cần thanh toán"
        details={props.userApp.requestPrettyAmount()}
        isUnitHidden
        color={'#000'}
      />
    </View>
  </View>
);

const DetailText = (props) => (
  <View
    style={[
      {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden'
      },
      props.style
    ]}
  >
    {props.title.length === 0 ? null : (
      <Text style={styles.labelTitle} numberOfLines={1}>
        {`${props.title}: `}
      </Text>
    )}
    <Text style={[styles.amountTitle, props.color ? { color: props.color } : {}]} numberOfLines={1}>
      {`${props.details}`}
    </Text>
    {props.isUnitHidden ? null : (
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.amountUnit}>{props.unit}</Text>
      </View>
    )}
  </View>
);

const DetailTextTenure = (props) => (
  <View
    style={[
      {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: 'hidden'
      },
      props.style
    ]}
  >
    {props.title.length === 0 ? null : (
      <Text style={styles.labelTitle} numberOfLines={1}>
        {`${props.title}: `}
      </Text>
    )}
    <Text style={[styles.amountTitle, { color: '#000' }]} numberOfLines={1}>
      {`${props.details}`}
      <Text style={[styles.amountTitle, { color: '#666' }]} numberOfLines={1}>
        {`/${props.detailsTotal}`}
      </Text>
    </Text>
  </View>
);

const Arrow = () => (
  <Image
    style={{ alignSelf: 'center', width: 12 }}
    source={require('./img/grayArrow.png')}
    resizeMode="contain"
  />
);

// --------------------------------------------------

UserAppLightRow.propTypes = {
  isArrowHidden: PropTypes.bool,
  onPress: PropTypes.func
};

UserAppLightRow.defaultProps = {
  isArrowHidden: false,
  onPress: () => {}
};

export default UserAppLightRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    paddingLeft: 2,
    paddingRight: 4
  },
  logoImage: {
    width: 46,
    height: 46,
    borderRadius: 23.0,
    borderWidth: 0.0,
    backgroundColor: '#0000',
    alignSelf: 'center'
  },
  titleText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600'
  },
  labelTitle: {
    fontSize: 11,
    color: '#666E73'
  },
  amountTitle: {
    color: '#2696E0',
    fontSize: 12,
    fontWeight: '600'
  },
  amountUnit: {
    marginTop: -1,
    color: '#2696E0',
    fontSize: 9,
    fontWeight: '600'
  }
});
