/**
 Help to pick a month base on fromTime to toTime
 a month will be return as a date
*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import moment from 'moment';
import AppText from '../componentV3/AppText';

const MONTH_ITEM_HEIGHT = 44;

// --------------------------------------------------

class MonthPicker extends Component {
  constructor(props) {
    super(props);

    const months = createMonthsTimes(props.fromTime, props.toTime);
    const rows = mapItemsToRows(months);

    this.state = {
      data: rows,
      selectedIndex: 1, // all
    };
  }
  // --------------------------------------------------
  onCancelPress = () => {
    this.props.onCancelPress();
  }
  onFilterPress = () => {
    // get selected item
    let itemIndex = this.state.selectedIndex;
    itemIndex = itemIndex >= 0 ? itemIndex : 0;
    itemIndex = itemIndex <= this.state.data.length - 1 ? itemIndex : this.state.data.length - 1;
    const selectedItem = this.state.data[itemIndex];
    // return
    if (selectedItem.type === 'ITEM') {
      const selectedTime = selectedItem.data;
      this.props.onFilterPress(selectedTime);
    }
    else {
      this.props.onFilterPress(null);
    }
  }
  // --------------------------------------------------
  handleScroll = (event) => {
    const nextY = event.nativeEvent.contentOffset.y;
    this.isScrollingDown = (nextY > this.lastY);
    this.lastY = nextY;

    // Utils.log(`handleScroll: y: ${nextY}`);
  }
  handleScrollRelease = () => {
    // let itemIndex = (this.isScrollingDown) ? 
    //   Math.ceil(this.lastY / MONTH_ITEM_HEIGHT) : 
    //   Math.floor(this.lastY / MONTH_ITEM_HEIGHT);
    let itemIndex = Math.round(this.lastY / MONTH_ITEM_HEIGHT);
    if (this.flatList) {
      if (itemIndex < 0) itemIndex = 0;
      if (itemIndex > this.state.data.length - 3) itemIndex = this.state.data.length - 3;
      this.flatList.scrollToIndex({ index: itemIndex, viewPosition: 0 });
    }

    // Utils.log(`onResponderRelease: index: ${itemIndex}`);

    const selectedIndex = itemIndex + 1;
    this.setState({
      selectedIndex,
    });

    // const item = this.state.data[itemIndex + 1];
    // const itemTitle = item.type === 'ITEM' ? item.data.format('MM/YYYY') : 'WRONG';
    // Utils.log(`onResponderRelease: item: ${itemTitle}`);
  }
  // --------------------------------------------------
  renderMonthItem = (row) => {
    // Utils.log(`render row: ${row.index}`);
    const isSelected = this.state.selectedIndex === row.index;
    const item = row.item;
    
    let title = '';
    if (item.type === 'ALL') {
      title = 'Tất cả';
    } else if (item.type === 'ITEM') {
      title = item.data.format('MM/YYYY');
    }

    let titleStyle = { color: '#808080', fontWeight: '300' };
    if (item.type === 'ALL') {
      titleStyle = styles.filterAllText;
    }
    if (isSelected) {
      titleStyle.color = '#329CE2';
      titleStyle.fontWeight = '600';
    }

    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={this.onPress}
      >
        <View style={[styles.listItem]}>
          <AppText style={titleStyle}>
            {title}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  }
  renderMonthsList() {
    return (
      <FlatList
        ref={o => { this.flatList = o; }}
        style={styles.listContainer}
        data={this.state.data}
        keyExtractor={item => item.key}
        extraData={this.state.selectedIndex}
        renderItem={this.renderMonthItem}
        alwaysBounceVertical={false}
        overScrollMode={'never'}
        scrollEventThrottle={32}
        onScroll={this.handleScroll}
        onResponderRelease={this.handleScrollRelease}
      />
    );
  }
  renderBottomButtons() {
    const filterButtonOpacity = this.state.selectedIndex !== -1 ? 1.0 : 0.85;
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={this.onCancelPress}
        >
          <AppText style={styles.cancelButtonText}>
            {'Hủy'}
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={this.state.selectedIndex === -1}
          style={styles.filterButton}
          onPress={this.onFilterPress}
        >
          <AppText style={[styles.filterButtonText, { opacity: filterButtonOpacity }]}>
            {'Lọc'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }
  renderSelector() {
    return (
      <View style={styles.selectorContainer} pointerEvents="none">
        <AppText style={styles.selectorText}>
          {'Chọn tháng'}
        </AppText>
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>

        {this.renderMonthsList()}

        {this.renderBottomButtons()}
        
        {this.renderSelector()}

      </View>
    );
  }
}

// --------------------------------------------------

function createMonthsTimes(fromTime, toTime) {
  const beginTime = moment(fromTime, 'X');
  const endTime = moment(toTime, 'X');
  const currentTime = beginTime.startOf('month');
  const months = [];
  while (currentTime < endTime) {
    months.push(moment(currentTime));
    currentTime.add(1, 'months');
  }
  return months.reverse();
}

function mapItemsToRows(items) {
  let rows = [];
  rows = items.map((data, index) => (
    {
      key: `ITEM_${index}`,
      type: 'ITEM',
      data,
    }
  ));
  rows.unshift({
    key: 'ALL',
    type: 'ALL',
  });
  rows.unshift({
    key: 'START',
    type: 'EMPTY',
  });
  rows.push({
    key: 'END',
    type: 'EMPTY',
  });
  return rows;
}

// --------------------------------------------------

MonthPicker.propTypes = {
  fromTime: PropTypes.number,
  toTime: PropTypes.number,
  onCancelPress: PropTypes.func,
  onFilterPress: PropTypes.func,
};

MonthPicker.defaultProps = {
  fromTime: moment().add(-12, 'months').unix(),
  toTime: moment().unix(),
  onCancelPress: () => {},
  onFilterPress: () => {},
};

export default MonthPicker;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 128,
    marginBottom: 164,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#0000',
    shadowOpacity: 0.5,
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  selectorContainer: {
    position: 'absolute',
    top: MONTH_ITEM_HEIGHT + 8,
    left: 0,
    right: 0,
    height: MONTH_ITEM_HEIGHT,
    justifyContent: 'center',
    backgroundColor: '#329CE220',
  },
  selectorText: {
    marginLeft: 12,
    color: '#329CE2',
    backgroundColor: '#0000',
  },
  listContainer: {
    flex: 0,
    marginTop: 8,
    marginBottom: 8,
    height: 132,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: MONTH_ITEM_HEIGHT,
    backgroundColor: '#fff',
  },
  normalText: {
    alignSelf: 'center',
    color: '#808080',
    fontSize: 14,
    fontWeight: '300',
  },
  selectedText: {
    alignSelf: 'center',
    color: '#329CE2',
    fontSize: 15,
    fontWeight: '600',
  },
  filterAllText: {
    alignSelf: 'center',
    color: '#808080',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 50,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F2F2F2',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  filterButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  cancelButtonText: {
    color: '#919191',
    fontWeight: '300',
  },
  filterButtonText: {
    color: '#50A9E4',
    fontWeight: '600',
  },
});
