import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { fetchShopItems } from '../../redux/actions';
import GridList from '../../components2/GridList';

class ShopControl extends Component {
  componentDidMount() {
    this.props.fetchShopItems();
  }

  render() {
    const { fetchingShopItems, shopItems, onPressItem } = this.props;

    return (
      <View style={{ marginTop: 16 }}>
        <GridList
          navigation={this.props.navigation}
          title={'Dịch vụ mua sắm'}
          items={shopItems}
          loading={fetchingShopItems}
          onPressItem={onPressItem}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchShopItems: () => dispatch(fetchShopItems())
});

const mapStateToProps = (state) => ({
  appInfo: state.appInfo,
  fetchingShopItems: state.fetchingShopItems,
  shopItems: state.shopItems
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopControl);
