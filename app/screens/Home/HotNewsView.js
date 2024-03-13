import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import KJTouchableOpacity from '../../common/KJTouchableOpacity';

import KJImage from 'app/components/common/KJImage';
import colors from '../../constants/colors';

const _ = require('lodash');

class HotNewsView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  render1stItem = (news, onPress) => {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(news)}>
        <View style={{ flex: 1, marginBottom: 6 }}>
          <KJImage
            style={styles.host1stImage}
            source={news.imageURI()}
            resizeMode="cover"
            borderRadius={2}
          />
          <View style={styles.host1Content} >
            <Text style={styles.host1stTitle} >
              {news.title}
            </Text>
            <View style={{ flexDirection: 'row' }} >
              <Image source={require('./img/clock_shadow.png')} />
              <Text style={styles.host1stTime} >
                {news.createTimeAgoString()}
              </Text>
              <Image />
            </View>
          </View>
        </View >
      </TouchableOpacity>
    );
  }

  renderSub1Item = (news, onPress) => {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => onPress(news)}>
        <View>
          <KJImage
            style={styles.host2rdImage}
            source={news.imageURI()}
            resizeMode="cover"
            borderRadius={2}
          />
          <Text style={styles.host2rdTitle} numberOfLines={2} >
            {news.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Image source={require('./img/time1.png')} />
            <Text style={styles.host2rdTime} >
              {news.createTimeAgoString()}
            </Text>
            <Image />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render23Item = (data, onPress) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: (Dimensions.get('window').width - 8 - 32) / 2,
        }}
      >
        {data.length >= 2 && this.renderSub1Item(data[1], onPress)}
        <View style={{ marginLeft: 8 }} />
        {data.length >= 3 && this.renderSub1Item(data[2], onPress)}
      </View>
    );

  }

  render() {
    const {
      title,
      data,
      onPress,
    } = this.props;

    return (
      <View>
        <View
          style={{
            backgroundColor: colors.navigation_bg,
          }}
        >
          <Text style={styles.titleText}>
            {title}
          </Text>
        </View>
        {data.length > 0 && this.render1stItem(data[0], onPress)}
        {this.render23Item(data, onPress)}
      </View>
    );
  }
}

export default HotNewsView;

const styles = StyleSheet.create({
  titleText: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#7F7F7F',
    backgroundColor: '#0000',
  },
  host1stImage: {
    flex: 1,
    width: Dimensions.get('window').width - 32,
    height: (Dimensions.get('window').width - 32) * (200 / 382),
    marginTop: 4,
  },
  host1Content: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'flex-end',
    width: Dimensions.get('window').width - 32,
    height: (Dimensions.get('window').width - 32) * (200 / 382),
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  host1stTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#0009',
    paddingRight: 4,
  },
  host1stTime: {
    marginRight: 4,
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    textShadowRadius: 3,
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#0009',
    paddingRight: 4,
  },
  host2rdImage: {
    flex: 1,
    width: (Dimensions.get('window').width - 8 - 32) / 2,
    height: ((Dimensions.get('window').width - 8 - 32) / 2) * (96 / 186),
  },
  host2rdTitle: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 8,
  },
  host2rdTime: {
    marginLeft: 4,
    color: '#0008',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
