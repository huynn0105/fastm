import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import moment from 'moment/min/moment-with-locales';
import AppText from '../../componentV3/AppText';
// --------------------------------------------------
// DateInputRow
// --------------------------------------------------

class DateInputRow extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      date: props.date,
    };
  }
  // --------------------------------------------------
  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== undefined) {
      this.setState({
        date: nextProps.date,
      });
    }
  }
  // --------------------------------------------------
  onPress = () => {
    this.props.onPress();
  }
  // --------------------------------------------------
  render() {
    const {
      title,
      containerStyle, titleStyle, dateStyle,
      isHighlight,
      isSeperatorHidden,
    } = this.props;

    const {
      date,
    } = this.state;

    const dateString = date ? moment(date, 'X').format('DD/MM/YYYY') : '\t/\t/';

    const separatorColor = isHighlight ? '#39B5FC' : '#E9E9E9';

    return (
      <View style={[styles.container, containerStyle]}>

        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onPress}
        >
          <AppText style={[styles.titleText, titleStyle]}>
            {title}
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onPress}
        >
          <AppText style={[styles.date, dateStyle]}>
            {dateString}
          </AppText>
        </TouchableOpacity>

        {
          isSeperatorHidden ? null :
            <View
              style={[styles.separator, {
                backgroundColor: separatorColor,
              }]}
            />
        }

      </View>
    );
  }
}

// --------------------------------------------------

DateInputRow.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.number,
  isSeperatorHidden: PropTypes.bool,
  onPress: PropTypes.func,
};

DateInputRow.defaultProps = {
  isSeperatorHidden: false,
  onPress: () => { },
};

export default DateInputRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    paddingTop: 12,
    backgroundColor: '#f000',
  },
  title: {
    fontSize: 12,
    color: '#7f7f7f',
  },
  date: {
    paddingTop: 13,
    fontSize: 14,
    color: '#202020',
  },
  separator: {
    height: 1,
    marginTop: 2,
  },
});

