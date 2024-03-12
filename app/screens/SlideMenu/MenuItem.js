import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

// --------------------------------------------------

class MenuItem extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.item);
  }
  render() {
    const {
      item,
      badge,
      containerStyle,
      iconStyle, 
      titleStyle,
      isSelected,
    } = this.props;

    const backgroundColor = isSelected ? '#80CFFD' : '#0000';
    
    return (
      <View 
        style={[
          styles.container, 
          containerStyle, 
          { backgroundColor },
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          underlayColor="#80CFFD"
          onPress={this.onPress}
        >
          <View style={styles.itemContainer}>
            <Image
              style={[styles.icon, iconStyle]}
              source={item.icon}
              resizeMode={'contain'}
            />
            <Text style={[styles.title, titleStyle]}>
              {item.title}
            </Text>
            {
              badge && badge.length > 0 ?
                <Text style={styles.badge}>
                  {badge}
                </Text>
                : null
            }            
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

// --------------------------------------------------

MenuItem.propTypes = {
  onPress: PropTypes.func,
};

MenuItem.defaultProps = {
  onPress: () => {},
};

export default MenuItem;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#0000',
  },
  itemContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: '#0000',
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: 24,
    marginRight: 20,
  },
  title: {
    fontSize: 15,
    color: '#fff',
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    left: 36,
    top: -2,
    paddingLeft: 5,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#FF503E',
    fontSize: 9,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
