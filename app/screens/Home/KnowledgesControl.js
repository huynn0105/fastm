import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

import PropTypes from 'prop-types';

import { Knowledge } from 'app/models';

import colors from '../../constants/colors';

const _ = require('lodash');

const SCREEN_SIZE = Dimensions.get('window');
// --------------------------------------------------
// KnowledgesControl
// --------------------------------------------------

class KnowledgesControl extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  onItemPress = (item) => {
    this.props.onItemPress({ title: item.title, url: item.detailsURL });
  }

  onShortItemPress = () => {
    this.props.onItemPress({ openKnowledge: true });
  }

  renderShortList = () => {
    const imageWidth = SCREEN_SIZE.width - (16 * 2);
    return (
      <View style={styles.shortListItem}>
        <TouchableOpacity activeOpacity={0.2} onPress={this.onShortItemPress}>
          <Image
            style={{
              marginTop: 8,
              width: imageWidth,
              height: (imageWidth * 160) / 382,
            }}
            source={require('./img/portal.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderHeaderImage = () => {
    return (
      <View>
        <Image
          style={{
            flex: 0,
            paddingTop: 4,
            paddingBottom: 4,
            width: '100%',
          }}
          source={require('./img/knowledge_header.png')}
        />
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 16,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        >
          <Text style={{
            fontSize: 24,
            fontWeight: '500',
            color: '#424d6c',
            marginBottom: 16,
          }}
          >
            {'WELCOME!!!'}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 20,
            textAlign: 'right',
            color: '#424d6c',
          }}
          >
            {'Cổng Thông Tin Sản Phẩm\n & Chính Sách MFast'}
          </Text>
        </View>
      </View>
    );
  }

  renderKnowledgeRow = (item, onPress) => {
    return (
      <TouchableOpacity
        style={{
          width: '100%',
        }}
        onPress={() => { onPress(item); }}
      >
        <View style={{
          justifyContent: 'center',
          height: 127,
          backgroundColor: '#ffffff',
          borderRadius: 10,
          marginBottom: 12,

          shadowOpacity: 0.3,
          shadowColor: '#0004',
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 4,
          elevation: 2,
          marginLeft: 10,
          marginRight: 10,

        }}
        >
          <View style={{ flexDirection: 'row', height: 60, alignItems: 'center' }}>
            <Image
              style={{
                width: 36,
                height: 36,
                margin: 12,
              }}
              source={{ uri: item.image }}
            />
            <Text style={{
              flex: 1,
              fontSize: 17,
              fontWeight: '500',
              color: '#424d6c',
            }}
            >
              {item.title}
            </Text>
            <Image
              style={{
                opacity: 0.7,
                width: 16,
                height: 24,
                marginRight: 10,
              }}
              resizeMode="contain"
              source={require('./img/detail.png')}
            />
          </View>
          <View style={{ marginLeft: 12, marginRight: 12, height: 1, backgroundColor: '#8882' }} />
          <View style={{ margin: 12 }}>
            <Text
              style={{
                opacity: 0.8,
                fontSize: 14,
                lineHeight: 20,
                color: '#424d6c',
              }}
              numberOfLines={2}
            >
              {item.details}
            </Text>
          </View>
        </View >
      </TouchableOpacity>
    );
  }

  renderKnowledgeList = (itemList, extraData, onPress) => {
    return (
      <View style={{
        marginTop: 10,
        marginBottom: 32,
      }}
      >
        {
          itemList.length > 0
            ? <FlatList
              data={itemList}
              extraData={extraData}
              keyExtractor={item => item.uid}
              renderItem={(row) => {
                return this.renderKnowledgeRow(row.item, onPress);
              }}
            />
            : this.renderEmptyList()
        }
      </View>
    );
  }

  renderEmptyList = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 0, fontSize: 16, color: '#555', margin: 8, textAlign: 'center' }}>
          {'Bạn đã đọc tất cả kiến thức'}
        </Text>
      </View>
    );
  }

  renderContent = (itemList, extraData, onPress) => {
    return (
      <View style={{
      }}
      >
        {/* {this.renderHeaderImage()} */}
        {this.renderKnowledgeList(itemList, extraData, onPress)}
      </View>
    );
  }


  // --------------------------------------------------
  render() {

    const {
      style, viewMode,
      title,
      extraData,
    } = this.props;

    const data = this.props.data.sort((a, b) => {
      return (a.createTime < b.createTime) ? 1 : -1;
    });

    const containerOverrideStyle = viewMode === 'short' ?
      {} : styles.containerOverride;
    const listOverrideStyle = viewMode === 'short' ?
      {} : styles.listContainerOverride;
    const titleOverrideStyle = viewMode === 'short' ?
      {} : styles.titleContainerOverride;

    return (
      <View style={[styles.container, style, containerOverrideStyle]}>
        <View style={[styles.titleContainer, titleOverrideStyle]}>
          <Text style={styles.titleText}>
            {title}
          </Text>
        </View>
        <View style={[styles.listContainer, listOverrideStyle]}>
          {
            viewMode === 'short'
              ? this.renderShortList(data)
              : this.renderContent(data, extraData, this.onItemPress)

          }
        </View>
      </View>
    );
  }
}


KnowledgesControl.propTypes = {
  viewMode: PropTypes.oneOf(['short', 'full']),
  data: PropTypes.arrayOf(PropTypes.instanceOf(Knowledge)),
  extraData: PropTypes.number,
  title: PropTypes.string,
  onItemPress: PropTypes.func,
  onMorePress: PropTypes.func,
  onViewMorePress: PropTypes.func,
};

KnowledgesControl.defaultProps = {
  viewMode: 'short',
  data: [],
  extraData: 0,
  title: 'Kiến thức',
  onItemPress: () => { },
  onMorePress: () => { },
  onViewMorePress: () => { },
};

export default KnowledgesControl;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 0,
    backgroundColor: colors.navigation_bg,
    // overflow: 'hidden',
  },
  containerOverride: {
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  listContainer: {
    marginTop: -4,
    marginBottom: 0,
    backgroundColor: '#fff0',
    // overflow: 'hidden',
  },
  listContainerOverride: {
    // borderColor: '#0000',
    // shadowColor: '#0000',
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: '#fff0',
  },
  titleContainerOverride: {
    // paddingTop: 20,
    // paddingBottom: 4,
    // paddingLeft: 8,
    // paddingRight: 8,
  },
  titleText: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#7F7F7F',
    backgroundColor: '#0000',
  },
  moreButton: {
    flex: 0,
    flexDirection: 'row',
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f7f7f',
  },
  moreButtonIcon: {
    alignSelf: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  viewMoreContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#f000',
  },
  viewMoreButton: {
    marginTop: 0,
    marginBottom: 0,
  },
  viewMoreButtonTitle: {
    fontWeight: '400',
    color: '#1B94E3',
  },
  shortListItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff0',
    marginBottom: 8,
  },
});
