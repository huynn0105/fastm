'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

const moment = require('moment');

// --------------------------------------------------

class DateInputRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.date,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== undefined) {
      this.setState({
        date: nextProps.date
      });
    }
  }
  render() {
    const props = this.props;
    const dateString = this.state.date !== undefined ?
      moment(this.state.date).format('DD/MM/YYYY') :
      '\t/\t/';
    return (
      <View
        style={[{
          marginTop: 2,
          paddingTop: 12,
          backgroundColor: '#f000',
        }, props.style]}
      >

        <Text
          style={[{
            fontSize: 12,
            color: '#7f7f7f'
          }, props.titleStyle]}
        >
          {props.title}
        </Text>

        <TouchableOpacity
          onPress={() => props.onPress()}
        >
          <Text
            style={[{
              paddingTop: 13,
              fontSize: 14,
              color: '#202020'
            }, props.dateStyle]}
          >
            {dateString}
          </Text>
        </TouchableOpacity>
        {
          props.isSeperatorHidden ?
          null :
          <View
            style={{
              height: 1,
              marginTop: 2,
              backgroundColor: props.isHighlight ? '#39B5FC' : '#E9E9E9'
            }}
          />
        }
      </View>
    );
  }
}

// --------------------------------------------------

DateInputRow.propTypes = {
  title: PropTypes.string.isRequired,
  isSeperatorHidden: PropTypes.bool,
  onChangeDate: PropTypes.func,
};

DateInputRow.defaultProps = {
  isSeperatorHidden: false,
  onPress: (date) => console.log('DateInputRow. change date', date),
};

export default DateInputRow;
