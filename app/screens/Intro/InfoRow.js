import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import KJTouchableOpacity from '../../common/KJTouchableOpacity';

// --------------------------------------------------

class InfoRow extends PureComponent {
  onPress = () => {
    this.props.onPress();
  }
  onAccessoryPress = () => {
    this.props.onAccessoryPress();
  }
  // --------------------------------------------------
  render() {
    const {
      title, subtitle, details,
      style, titleStyle, subtitleStyle, detailsStyle,
      isArrowHidden, isSeperatorHidden,
    } = this.props;

    return (
      <View style={[styles.row, style]}>
        <KJTouchableOpacity
          onPress={this.onPress}
        >
        <View
          style={[styles.container]}
        >
          <View 
            style={{
              flex: 1, 
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
            }}
          >
            <Text
              style={[styles.title, titleStyle]}
            >
              {title}
            </Text>
            {
              !subtitle || subtitle.length === 0 ? null :
              <Text
                style={[styles.subtitle, subtitleStyle]}
              >
                {subtitle}
              </Text>
            }
          </View>
          <Text
            style={[styles.details, detailsStyle]}
          >
            {details}
          </Text>
          {
            isArrowHidden ? null
            : <Accessory onPress={this.onAccessoryPress} />
          }
        </View>
        {
          isSeperatorHidden ? null :
          <Seperator />
        }
        </KJTouchableOpacity>
      </View>
    );
  }
}

const Accessory = (props) => (
  <KJTouchableOpacity
    style={{
      width: 44,
    }}
    onPress={props.onPress}
  >
    <Image
      style={{
        width: 8,
        marginLeft: 36,
      }}
      source={require('./img/arrow_right.png')}
      resizeMode="contain"
    />
  </KJTouchableOpacity>
);

const Seperator = () => (
  <View
    style={{
      height: 1,
      marginTop: 0,
      backgroundColor: '#E9E9E9',
    }}
  />
);

// --------------------------------------------------

InfoRow.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  details: PropTypes.string,
  titleStyle: Text.propTypes.style,
  detailsStyle: Text.propTypes.style,
  isArrowHidden: PropTypes.bool,
  isSeperatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
  onAccessoryPress: PropTypes.func,
};

InfoRow.defaultProps = {
  title: '',
  subtitle: '',
  isSeperatorHidden: false,
  isArrowHidden: true,
  onPress: () => {},
  onAccessoryPress: () => {},
};

export default InfoRow;

// --------------------------------------------------
const styles = StyleSheet.create({
  row: {
    flex: 0,
  },
  container: {
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'flex-start',    
    alignItems: 'center',    
  },
  title: {
    flex: 0,
    fontSize: 14,
    color: '#101010',
  },
  subtitle: {
    flex: 0,
    marginTop: 4,
    fontSize: 12,
    color: '#606060',
  },
  details: {
    flex: 0,
    marginLeft: 4,
    fontSize: 14,
    color: '#7F7F7F',
  },
});
