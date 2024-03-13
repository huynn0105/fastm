import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import { Subscription } from 'app/models';
import SubscriptionsList from 'app/common/SubscriptionsList';
import TextButton from 'app/common/buttons/TextButton';
import colors from '../../constants/colors';

const _ = require('lodash');

// --------------------------------------------------
// SubscriptionsControl
// --------------------------------------------------

class SubscriptionsControl extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onItemPress = (item) => {
    this.props.onItemPress(item);
  }
  onRegisterPress = () => {
    this.props.onRegisterPress();
  }
  // --------------------------------------------------
  render() {
    const {
      style, title, data,
      extraData, emptyDataText,
      registerTitle, registerButtonTitle,
      // isLastRowSeparatorHidden, isRegisterHidden,
      isGetSubscriptionsProcessing,
    } = this.props;
    // disable register
    const isLastRowSeparatorHidden = true;
    const isRegisterHidden = true;
    // end
    return (
      <Animatable.View
        style={[styles.container, style]}
        testID="test_sub_control"
        animation="fadeIn"
        useNativeDriver
      >
        <Text style={styles.titleText}>
          {title}
          <Text style={styles.titleSubText}>
            {' (Doanh số từ các nghiệp vụ sẽ được cộng vào ví thu nhập tích lũy đầu mỗi tháng)'}
          </Text>
        </Text>
        {
          isGetSubscriptionsProcessing &&
          <ActivityIndicator
            style={styles.headerAccessoryButton}
            animating
            color="#404040"
            size="small"
          />
        }
        <View style={styles.listContainer}>
          <SubscriptionsList
            data={data}
            extraData={extraData}
            emptyDataText={emptyDataText}
            isLastRowSeparatorHidden={isLastRowSeparatorHidden}
            onItemPress={this.onItemPress}
          />
          {
            isRegisterHidden ? null :
              <RegisterRow
                registerTitle={registerTitle}
                registerButtonTitle={registerButtonTitle}
                onPress={this.onRegisterPress}
              />
          }
        </View>
      </Animatable.View>
    );
  }
}

// --------------------------------------------------

const RegisterRow = (props) => (
  <View style={styles.registerContainer}>
    <Text style={styles.registerTitle}>
      {props.registerTitle}
    </Text>
    <TextButton
      style={styles.registerButton}
      title={props.registerButtonTitle}
      titleStyle={{ fontWeight: '600' }}
      onPress={props.onPress}
    />
  </View>
);

// --------------------------------------------------

SubscriptionsControl.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)),
  extraData: PropTypes.bool,
  emptyDataText: PropTypes.string,
  title: PropTypes.string,
  registerTitle: PropTypes.string,
  registerButtonTitle: PropTypes.string,
  // isLastRowSeparatorHidden: PropTypes.bool,
  // isRegisterHidden: PropTypes.bool,
  onItemPress: PropTypes.func,
  onRegisterPress: PropTypes.func,
};

SubscriptionsControl.defaultProps = {
  data: [],
  extraData: true,
  emptyDataText: 'Bạn chưa đăng ký công việc nào',
  registerButtonTitle: 'Đăng ký ngay',
  // isLastRowSeparatorHidden: false,
  // isRegisterHidden: false,
  onItemPress: () => { },
  onRegisterPress: () => { },
};


const mapStateToProps = (state) => ({
  isGetSubscriptionsProcessing: state.isGetSubscriptionsProcessing,
});

export default connect(mapStateToProps, null)(SubscriptionsControl);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.navigation_bg,
  },
  listContainer: {
    marginLeft: 2,
    marginRight: 2,
    marginTop: 4,
    marginBottom: 0,
    backgroundColor: '#0000',
    overflow: 'hidden',
  },
  titleText: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: '#7f7f7f',
    fontSize: 14,
    fontWeight: '800',
    backgroundColor: '#0000',
  },
  titleSubText: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: '#888',
    fontSize: 12,
    fontWeight: '400',
    backgroundColor: '#0000',
  },
  headerAccessoryButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    width: 44,
    height: 36,
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 8,
  },
  registerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  registerTitle: {
    alignSelf: 'center',
    color: '#808080',
    fontSize: 14,
  },
  registerButton: {
    marginTop: 4,
  },
});
