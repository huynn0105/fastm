import React, { Component } from 'react';
import {
  StyleSheet,
  View, Image, Text,
} from 'react-native';

import PropTypes from 'prop-types';

import KJImage from 'app/components/common/KJImage';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

const _ = require('lodash');

// --------------------------------------------------
// BadLoansRow
// --------------------------------------------------

class BadLoansRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onPress = () => {
    this.props.onPress(this.props.badLoans);
  }
  // --------------------------------------------------
  render() {
    const {
      badLoans, isArrowHidden,
    } = this.props;
    return (
      <View style={styles.container}>
        <KJTouchableOpacity
          onPress={this.onPress}
          activeOpacity={0.65}
        >
          <View style={styles.rowContainer}>
            <LogoImage />
            <View style={{ width: 8, backgroundColor: '#0000' }} />
            <Body badLoans={badLoans} />
            <View style={{ width: 4, backgroundColor: '#0000' }} />
            {
              isArrowHidden ? null :
                <Arrow />
            }
          </View>
        </KJTouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

const LogoImage = () => (
  <KJImage
    style={styles.logoImage}
    source={require('./img/badloans.png')}
    resizeMode="cover"
  />
);

const Body = (props) => (
  <View style={styles.contentContainer}>
    <DetailText
      title={`${props.badLoans.label_1}: `}
      value={props.badLoans.del30}
      isOVer={props.badLoans.isOver()}
    />
    <Text style={styles.labelTitle}>
      {props.badLoans.label_2}
    </Text>
    <View
      style={{ flexDirection: 'row' }}
    >
      <Text style={styles.labelTitleGray}>
        {`${props.badLoans.label_3}: `}
      </Text>
      <Text style={styles.labelTitleValue}>
        {props.badLoans.date}
      </Text>
    </View>
  </View>
);

const DetailText = (props) => (
  <View
    style={[{
      flex: 0,
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden',
      flexDirection: 'row',
    }, props.style]}
  >
    <Text style={{ fontSize: 12, marginRight: 8, top: 3 }}>
      {
        `${props.title}`
      }
    </Text>
    <Text
      style={props.isOVer ? styles.badLoanOverText : styles.badLoanText}
    >
      {
        `${props.value} %`
      }
    </Text>
  </View>
);

const Arrow = () => (
  <Image
    style={{ alignSelf: 'center', width: 12 }}
    source={require('./img/arrow_right2.png')}
    resizeMode="contain"
  />
);

// --------------------------------------------------

BadLoansRow.propTypes = {
  isArrowHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

BadLoansRow.defaultProps = {
  isArrowHidden: false,
  onPress: () => { },
};

export default BadLoansRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 12,
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
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    alignSelf: 'center',
  },
  labelTitle: {
    fontSize: 10,
    color: '#b20016',
    marginTop: 4,
    marginBottom: 6,
  },
  labelTitleGray: {
    fontSize: 12,
    color: '#666E73',
    marginRight: 8,
  },
  labelTitleValue: {
    fontSize: 12,
    color: '#000d',
  },
  badLoanOverText: {
    fontSize: 20,
    color: '#b80319',
    fontWeight: '500',
  },
  badLoanText: {
    fontSize: 20,
    color: '#1b94e3',
    fontWeight: '500',
  },
});
