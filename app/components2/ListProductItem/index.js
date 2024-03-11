import React, { PureComponent } from 'react';
import { View, FlatList, Image } from 'react-native';
import _ from 'lodash';
import ProductItem, { STATUS } from './ProductItem';
import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';
import { logEvent } from '../../tracking/Firebase';

import {IMAGE_PATH} from '../../assets/path';

// ------- EXAMPLE DATASOURCE ------- //
/**
 * [
 *  {
 *    label: 'Financial Service',
 *    labelStyle: { color:  },
 *    iconSource: require(./img/ic_wth.png),
 *    isSelected: false,
 *    isHighlighted: true
 *  },
 *  { ... },
 *  ...
 * ]
 */

const CONTAINER_WIDTH = SCREEN_WIDTH / 3.5;
export const CONTAINER_HEIGHT = SCREEN_WIDTH / 5.06;

export class ListProductItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nextSelectedIndex: -1,
    };
  }
  componentDidMount() {
    if (this.props.myRef !== null && this.props.myRef !== undefined) {
      this.props.myRef(this);
    }
    this.scrollToSelectedItem();
  }

  scrollToSelectedItem = () => {
    const { dataSource = [] } = this.props;
    if (!_.isEmpty(dataSource)) {
      const selectedIndex = dataSource.indexOf(
        dataSource.find((item) => item.status === STATUS.selected),
      );
      setTimeout(() => {
        this.handleScrollToItem(selectedIndex);
      }, 500);
    }
  };

  onItemPress = (index, item) => {
    logEvent(`press_menu_${item.formKey}`);
    this.handleScrollToItem(index);
    this.setState({
      nextSelectedIndex: index,
    });
    setTimeout(() => {
      this.props.onItemPress(index, item);
    });
  };

  handleScrollToItem = (index) => {
    // this.myFlatList.scrollToIndex({ index, animated: true });
    if (this.myFlatList && this.myFlatList.scrollToOffset) {
      this.myFlatList.scrollToOffset({
        animated: true,
        offset: index * CONTAINER_WIDTH - CONTAINER_WIDTH * 1.1,
      });
    }
  };

  // -------------------------------
  // RENDER METHODS
  // -------------------------------
  renderRightPaddingView = () => (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 9,
      }}
    />
  );
  renderLeftPaddingView = () => (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 12,
        height: 9,
      }}
    />
  );
  renderProductItem = ({ item, index }) => {
    if (!item || !item.label) return this.renderOnGoingItem();
    let status = item.status;
    if (status !== STATUS.highlighted && this.state.nextSelectedIndex !== -1) {
      status = this.state.nextSelectedIndex === index ? STATUS.selected : STATUS.none;
    }
    return (
      <ProductItem
        buttonCotaninerStyle={{ marginLeft: index === 0 ? 12 : 0 }}
        {...item}
        status={status}
        onPress={() => {
          this.onItemPress(index, item);
        }}
      />
    );
  };
  renderOnGoingItem = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={IMAGE_PATH.ongoing} resizeMode={'contain'} />
      </View>
    );
  };
  renderListProductItem = (dataSource) => (
    <FlatList
      ref={(ref) => {
        this.myFlatList = ref;
      }}
      keyExtractor={(item) => item.key}
      extraData={(item) => `${item.label}${item.status}`}
      data={dataSource}
      renderItem={this.renderProductItem}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );

  render() {
    const { dataSource } = this.props;
    const showPaddingViews = dataSource.length > 0 && dataSource[0].status !== STATUS.highlighted;
    return (
      <View style={{ flexDirection: 'row', zIndex: 100, backgroundColor: Colors.neutral5 }}>
        {this.renderListProductItem([...dataSource])}
        {showPaddingViews && this.renderLeftPaddingView()}
        {showPaddingViews && this.renderRightPaddingView()}
      </View>
    );
  }
}

export default ListProductItem;
