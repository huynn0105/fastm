import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, View, Platform, Linking } from 'react-native';
import iphone12Helper from '../../utils/iphone12Helper';
// import { fetchShopItems, fetchFinancialServices } from '../../redux/actions';
import { DEEP_LINK_BASE_URL } from '../../constants/configs';

import GridList from '../../components2/GridList';
import Colors from '../../theme/Color';
// import HeaderSection from '../Home/HeaderSection';

export const SECTION_ID = {
  HELP: 'HELP',
  SHOP: 'SHOP',
  SERVICE: 'SERVICE',
};

class ServicesScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.params = this.props.navigation.state.params;
  }

  onPressItem = (item) => {
    const onHelpPress = this.params?.onHelpPress;
    const { navigation } = this.props;
    if (typeof onHelpPress === 'function') {
      onHelpPress(item);
    } else {
      const { url, title } = item;
      if (url.startsWith(DEEP_LINK_BASE_URL)) {
        Linking.openURL(url);
      } else {
        navigation.push('WebView', { mode: 0, title, url });
      }
    }
  };

  renderContent = () => {
    const { shopV2Items } = this.props;
    if (!shopV2Items && shopV2Items.length === 0) return null;

    const firstSection = this.params.firstSection;
    const data = [
      ...shopV2Items.filter((item) => item.cat_alias === firstSection),
      ...shopV2Items.filter((item) => item.cat_alias !== firstSection),
    ];

    return (
      <View>
        {data.map((item) =>
          this.renderContentSection(item.cat_title, item.items, this.onPressItem),
        )}
      </View>
    );
  };

  renderContentSection = (title, data, onPress) => {
    return (
      <View style={{ marginTop: 16 }}>
        <GridList
          title={title}
          items={data}
          // loading={fetchingShopItems}
          navigation={this.props.navigation}
          onPressItem={onPress}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ backgroundColor: Colors.neutral5, flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {this.renderContent()}
          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

ServicesScreen.navigationOptions = () => {
  return {
    title: 'Tất cả dịch vụ', // must have a space or navigation will crash
    headerTintColor: '#000',
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: Colors.neutral5,
      marginLeft: Platform.OS === 'ios' ? 6 : 0,
      marginRight: Platform.OS === 'ios' ? 6 : 0,
      elevation: 0,
      marginTop: iphone12Helper() ? 12 : 0,
    },
  };
};

const mapStateToProps = (state) => ({
  // fetchingShopItems: state.fetchingShopItems,
  shopV2Items: state.shopV2Items,
  // financialServiceItems: state.financialServiceItems,
  // fetchingFinancialServiceItems: state.fetchingFinancialServiceItems,
  // toolItems: state.toolItems,
});

const mapDispatchToProps = (dispatch) => ({
  // fetchShopItems: () => dispatch(fetchShopItems()),
  // fetchFinancialServices: () => dispatch(fetchFinancialServices()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServicesScreen);
