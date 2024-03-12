import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

/* eslint-disable */
import Utils from '../../utils/Utils';
import { updateAppInfo } from '../../redux/actions/general';
const LOG_TAG = '7777: InfoView.js';
/* eslint-enable */

// --------------------------------------------------
// AppayInfo
// --------------------------------------------------

class AppayInfo extends Component {
  onItemPress = (item) => {
    this.props.onItemPress(item);
  }
  // --------------------------------------------------
  renderItem(item) {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onItemPress(item)}
        >
          <View style={[styles.itemContainer, { height: this.props.itemHeight }]}>
            <Image
              style={styles.itemIcon}
              source={item.icon}
              resizeMode={'contain'}
            />
            <Text style={styles.itemTitle}>
              {item.title}
            </Text>
            <Text style={styles.itemDetails}>
              {item.details}
            </Text>
            <Image
              style={styles.itemAccesory}
              source={require('./img/arrow_right.png')}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderWorkingTime() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Image
          style={styles.itemIcon}
          source={require('./img/time.png')}
          resizeMode={'contain'}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <Text 
            style={{
              fontSize: 14,
              color: '#B4E1FB',
              backgroundColor: '#0000',
            }}
          >
            {'Giờ làm việc:'}
          </Text>
          <Text 
            style={{
              marginTop: 8,
              fontSize: 14,
              color: '#fff',
              backgroundColor: '#0000',
            }}
          >
            {`${this.props.appInfo.workingHourLine1}\n${this.props.appInfo.workingHourLine2}`}
          </Text>
        </View>
      </View>
    );
  }
  // --------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.title}>
          {'Trung tâm hỗ trợ'}
        </Text> */}
        <View style={{ height: 8, backgroundColor: '#0000' }} />
        {this.renderItem({
          type: 1,
          title: 'Hotline:',
          details: this.props.appInfo.contactPhoneNumberPretty,
          icon: require('./img/call.png'),
        })}
        {this.renderItem({
          type: 2,
          title: 'Email:',
          details: this.props.appInfo.contactEmail,
          icon: require('./img/email.png'),
        })}
        {this.renderItem({
          type: 3,
          title: 'Zalo:',
          details: this.props.appInfo.zaloFanpageText,
          icon: require('./img/zalo.png'),
        })}
        {this.renderWorkingTime()}
      </View>
    );
  }
}

// --------------------------------------------------

AppayInfo.propTypes = {
  onItemPress: PropTypes.func,
};

AppayInfo.defaultProps = {
  onItemPress: () => { },
};

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
});

export default connect(mapStateToProps)(AppayInfo);

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 0,
    paddingLeft: 20,
    paddingRight: 24,
    paddingTop: 0,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#B4E1FB',
  },
  title: {
    marginTop: 16,
    marginBottom: 12,
    color: '#B4E1FB',
  },
  itemContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#f000',
  },
  itemIcon: {
    flex: 0,
    width: 16,
    height: 16,
    marginLeft: 4,
    marginRight: 12,
  },
  itemTitle: {
    flex: 0,
    width: 52,
    marginRight: 8,
    fontSize: 14,
    color: '#B4E1FB',
    backgroundColor: '#0000',
  },
  itemDetails: {
    flex: 1.0,
    marginRight: 8,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#0000',
  },
  itemAccesory: {
    width: 8,
    height: 12,
  },
});
