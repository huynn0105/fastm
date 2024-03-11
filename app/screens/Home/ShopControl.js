import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import colors from '../../constants/colors';

import {
  fetchShopItems,
} from '../../redux/actions';

const SCREEN_SIZE = Dimensions.get('window');

const _ = require('lodash');

class ShopControl extends Component {
  componentDidMount() {
    this.props.fetchShopItems();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  groupItems = (shopItems) => {
    const groupedItems = [];
    let tempArray = [];
    for (let i = 0; i < shopItems.length; i += 1) {
      if (tempArray.length === 3) {
        groupedItems.push(tempArray);
        tempArray = [];
      }
      tempArray.push(shopItems[i]);
    }
    if (tempArray.length > 0) { groupedItems.push(tempArray); }
    return groupedItems;
  }

  renderGroupedItems = (groupedItems, onPressItem) => {
    return (
      groupedItems.map(items => (
        <View style={styles.content}>
          {
            items.map(item => (
              this.renderBuyCardItem(item.icon, item.title, () => { onPressItem(item.title, item.url); })
            ))
          }
        </View>
      ))
    );
  }

  renderBuyCardItem = (img, title, onPress) => {
    if (!img || !title) {
      return this.renderBuyComingCardItem(img, title, onPress);
    }
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={styles.image}
              source={{ uri: img }}
            />
            <Text style={{ fontSize: 13, textAlign: 'center' }}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  renderBuyComingCardItem = () => {
    return (
      <TouchableOpacity style={styles.card}>
        <View>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={[styles.image, { marginBottom: 4, height: '60%', width: '70%' }]}
              source={require('./img/coming.png')}
            />
            <Text style={{ fontSize: 10, textAlign: 'center', color: '#888' }}>
              {'MFast đang xây dựng mặt hàng khác'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      fetchingShopItems,
      shopItems,
      onPressCard,
      onPressItem,
      appInfo,
    } = this.props;

    return (
      <View style={[styles.container]}>
        <View style={[styles.titleContainer]}>
          <Text style={styles.titleText}>
            {this.props.title}
          </Text>
          {
            fetchingShopItems &&
            <ActivityIndicator
              size="small"
              color="#555"
            />
          }
        </View>
        {
          this.renderGroupedItems(this.groupItems(shopItems), onPressItem)
        }
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchShopItems: () => dispatch(fetchShopItems()),
});

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
  fetchingShopItems: state.fetchingShopItems,
  shopItems: state.shopItems,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopControl);

const styles = StyleSheet.create({
  container: {
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 16,
    paddingBottom: 2,
    backgroundColor: colors.navigation_bg,
    overflow: 'hidden',
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
    backgroundColor: colors.navigation_bg,
  },
  titleText: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    fontWeight: '600',
    color: '#7F7F7F',
    backgroundColor: '#0000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.navigation_bg,
    marginBottom: 0,
    height: SCREEN_SIZE.width * 0.325,
  },
  image: {
    marginBottom: 8,
    aspectRatio: 1 / 1,
    resizeMode: 'contain',
    width: SCREEN_SIZE.width / 10,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (SCREEN_SIZE.width - 20 - (17 * 2)) / 3,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
  },
});
