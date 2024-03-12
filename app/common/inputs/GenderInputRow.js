/**
 * Overwrite styles: containerStyle, titleStyle,
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Colors from '../../theme/Color';

import AppText from '../../componentV3/AppText';

// --------------------------------------------------
// GenderInputRow
// --------------------------------------------------

class GenderInputRow extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      gender: props.gender,
    };
  }
  // --------------------------------------------------
  componentWillReceiveProps(nextProps) {
    if (nextProps.gender !== undefined) {
      this.setState({
        gender: nextProps.gender,
      });
    }
  }
  // --------------------------------------------------
  onGenderMalePress = () => {
    this.setState({
      gender: 'male',
    });
    this.props.onChangeGender('male');
  }
  onGenderFemalePress = () => {
    this.setState({
      gender: 'female',
    });
    this.props.onChangeGender('female');
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle, titleStyle,
      title,
      isSeperatorHidden,
    } = this.props;
    return (
      <View
        style={[styles.container, containerStyle]}
      >
        <AppText 
          style={[styles.title, titleStyle]}
        >
          {title}
        </AppText>
        <View
          style={styles.rowContainer}
        >
          <GenderButton
            containerStyle={{ flex: 0.5 }}
            title={'Nam'}
            isHighlight={this.state.gender === 'male'}
            isSeperatorHidden={isSeperatorHidden}
            onPress={this.onGenderMalePress}
          />
          <GenderButton
            containerStyle={{ flex: 0.5 }}
            title={'Nữ'}
            isHighlight={this.state.gender === 'female'}
            isSeperatorHidden={isSeperatorHidden}
            onPress={this.onGenderFemalePress}
          />
        </View>
      </View>
    );
  }
}

const GenderButton = (props) => {
  const {
    containerStyle,
    title,
    isHighlight,
    isSeperatorHidden,
    onPress,
  } = props;
  const titleColor = isHighlight ? Colors.primary2 : '#7F7F7F';
  return (
    <View style={[styles.genderButton, containerStyle]}>
      <TouchableOpacity
        style={{ flex: 1, justifyContent: 'flex-end' }}
        activeOpacity={0.65}
        onPress={onPress}
      >
        <AppText 
          style={[
            styles.genderButtonTitle, 
            { color: titleColor },
          ]}
        >
          {title}
        </AppText>
      </TouchableOpacity>
      {
        isSeperatorHidden ? null : 
          <Separator isHighlight={isHighlight} />
      }
    </View>
  );
};

const Separator = (props) => {
  const {
    isHighlight,
  } = props;
  return (
    <View
      style={{
        height: 1,
        marginTop: 2,
        backgroundColor: isHighlight ? Colors.primary2 : '#E9E9E9',
      }}
    />
  );
};

// --------------------------------------------------

GenderInputRow.propTypes = {
  title: PropTypes.string,
  isSeperatorHidden: PropTypes.bool,
  onChangeGender: PropTypes.func,
};

GenderInputRow.defaultProps = {
  title: '',
  isSeperatorHidden: false,
  onChangeGender: () => {},
};

export default GenderInputRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingTop: 12,
    backgroundColor: '#0000',
  },
  title: {
    marginBottom: 4,
    fontSize: 12,
    color: 'rgba(36, 37, 61, 0.5)',
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0000',
  },
  genderButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    backgroundColor: '#0000',
  },
  genderButtonTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7F7F7F',
    textAlign: 'left',
    backgroundColor: '#0000',
  },
});
