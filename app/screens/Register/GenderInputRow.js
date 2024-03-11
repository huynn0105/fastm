import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';
import KJTouchableOpacity from 'app/components/common/KJTouchableOpacity';

class GenderInputRow extends PureComponent {
  constructor(props) {
    super(props);

    const defaultGender = props.gender !== undefined ? props.gender : undefined;

    this.state = {
      gender: defaultGender,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.gender !== undefined) {
      this.setState({
        gender: nextProps.gender,
      });
    }
  }
  render() {
    const props = this.props;
    return (
      <View
        style={[{
          marginTop: 24,
          backgroundColor: '#f000',
          flexDirection: 'row',
          alignItems: 'center',
        }, props.style]}
      >
        <Text
          style={[{
            flex: 0.3,
            fontSize: 15,
            color: '#777b',
          }, props.titleStyle]}
        >
          {props.title}
        </Text>
        <GenderButton
          style={{ flex: 0.3 }}
          title={'Nam'}
          isHighlight={this.state.gender === 'male'}
          onPress={() => {
            this.setState({
              gender: 'male',
            });
            props.onChangeGender('male');
          }}
        />
        <GenderButton
          style={{ flex: 0.3 }}
          title={'Nữ'}
          isHighlight={this.state.gender === 'female'}
          onPress={() => {
            this.setState({
              gender: 'female',
            });
            props.onChangeGender('female');
          }}
        />
      </View>
    );
  }
}

const GenderButton = (props) => (
  <View
    style={[{
    }, props.style]}
  >
    <KJTouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={props.onPress}
    >
      <Image
        style={{ width: 22, height: 22, marginLeft: 8, marginRight: 8 }}
        source={props.isHighlight ? require('./img/checked.png') : require('./img/uncheck.png')}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 14,
          color: props.isHighlight ? '#222' : '#2228',
        }}
      >
        {props.title}
      </Text>
    </KJTouchableOpacity>
  </View>
);

GenderInputRow.propTypes = {
  title: PropTypes.string.isRequired,
  isSeperatorHidden: PropTypes.bool,
  onChangeGender: PropTypes.func,
};

GenderInputRow.defaultProps = {
  isSeperatorHidden: false,
  onChangeGender: (gender) => console.log('GenderInputRow. change gender', gender),
};

export default GenderInputRow;
