'use strict';

import React, { } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';

import PropTypes from 'prop-types';

// --------------------------------------------------

const SubscriptionRow = (props) => (
  <TouchableHighlight
    onPress={() => {
      if (props.onPress !== undefined) {
        props.onPress();
      }
    }}
    underlayColor='#0008'
  >
    <View style={styles.container}>

      <View style={styles.row}>

        <FeatureImage
          image={props.image}
        />
        <View style={{ width: 8 }} />

        <SubscriptionRowContent
          name={props.name}
          agentRole={props.agentRole}
          agentMoney={props.agentMoney}
          agentPoint={props.agentPoint}
        />

        <View style={{ width: 6 }} />

        <IndicatorIcon />

      </View>

      {
        props.isSeparatorHidden ? null :
        <Seperator />
      }

    </View>
  </TouchableHighlight>
);

// --------------------------------------------------

const FeatureImage = (props) => (
  <Image
    style={{
      width: 63,
      height: 82,
      borderRadius: 2.0
    }}
    source={props.image}
    resizeMode='contain'
  />
);

const SubscriptionRowContent = (props) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      backgroundColor: '#f000'
    }}
  >
    <Text style={{ marginTop: 0, fontSize: 16, fontWeight: '600' }}>
      {props.name}
    </Text>

    <DetailText
      style={{ marginTop: 6 }}
      title='Vai trò'
      details={props.agentRole}
    />

    <DetailText
      style={{ marginTop: 5 }}
      title='Doanh số tạm tính'
      details={props.agentMoney}
    />

    <DetailText
      style={{ marginTop: 5 }}
      title='Điểm tạm tính'
      details={props.agentPoint}
    />

  </View>
);

const DetailText = (props) => (
  <View
    style={[{
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#f000',
    }, props.style]}
  >

    <Text style={{ fontSize: 12, color: '#666E73' }}>
      {`${props.title}: `}
    </Text>

    <Text style={{ fontSize: 14, color: '#101010' }}>
      {`${props.details}`}
    </Text>

  </View>
);

const IndicatorIcon = () => (
  <Image
    style={{ alignSelf: 'center', width: 12 }}
    source={require('./img/arrow_right1.png')}
    resizeMode='contain'
  />
);

const Seperator = () => (
  <View
    style={{
      height: 1.0,
      marginTop: 12,
      backgroundColor: '#E2E2E2'
    }}
  />
);

// --------------------------------------------------

SubscriptionRow.defaultProps = {
  isSeparatorHidden: false,
};

SubscriptionRow.propTypes = {
  image: PropTypes.object,
  name: PropTypes.string,
  isSeparatorHidden: PropTypes.bool,
  agentRole: PropTypes.string,
  agentMoney: PropTypes.string,
  agentPoint: PropTypes.string,
  onPress: PropTypes.func,
};

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 12,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});

export default SubscriptionRow;
