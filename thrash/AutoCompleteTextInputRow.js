import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

import Autocomplete from 'react-native-autocomplete-input';

import Utils from '../../utils/Utils';

// --------------------------------------------------

const TEXT_INPUT_HEIGHT = Platform.OS === 'ios' ? 28 : 40;
const TEXT_INPUT_MARGIN_TOP = Platform.OS === 'ios' ? 2 : 0;
const TEXT_INPUT_MARGIN_BOTTOM = Platform.OS === 'ios' ? 0 : -8;

class TextInputRow extends PureComponent {
  // --------------------------------------------------
  renderItem = (data) => {
    const title = data;
    return (
      <TouchableOpacity onPress={() => this.props.onItemPress(data)}>
        <Text style={{ padding: 8 }}>{title}</Text>
      </TouchableOpacity>
    );
  };
  renderTextInput = () => {
    const {
      defaultValue,
      inputTextStyle,
      keyboardType,
    } = this.props;
    return (
      <TextInput
        style={[styles.inputText, inputTextStyle]}
        value={defaultValue}
        autoCorrect={false}
        underlineColorAndroid="#0000"
        keyboardType={keyboardType}
        onChangeText={this.props.onInputChangeText}
        onSubmitEditing={this.props.onInputSubmitEditing}
        onEndEditing={this.props.onInputSubmitEditing}
      />
    );
  }
  // --------------------------------------------------
  render() {
    const {
      containerStyle, titleTextStyle, inputTextStyle,
      title, data, inputDefaultValue, 
      isSeperatorHidden,
    } = this.props;
    return (
      <View 
        style={[styles.container, containerStyle]} 
      >
        <Text style={[styles.titleText, titleTextStyle]}>
          {title}
        </Text>
        <Autocomplete
          containerStyle={{
            borderColor: '#0000',
          }}
          inputContainerStyle={[{
            borderColor: '#0000',
          }, inputTextStyle]}
          data={data}
          defaultValue={inputDefaultValue}
          renderItem={this.renderItem}
          renderTextInput={this.renderTextInput}
        />
        {
          isSeperatorHidden ? null :
          <View style={styles.separator} />
        }
      </View>
    );
  }
}

// --------------------------------------------------

TextInputRow.propTypes = {
  title: PropTypes.string.isRequired,
  inputDefaultValue: PropTypes.string,
  titleTextStyle: Text.propTypes.style,
  inputTextStyle: Text.propTypes.style,
  isSeperatorHidden: PropTypes.bool,
  keyboardType: PropTypes.string,
  onInputChangeText: PropTypes.func,
  onInputSubmitEditing: PropTypes.func,
  onItemPress: PropTypes.func,
};

TextInputRow.defaultProps = {
  inputDefaultValue: '',
  isSeperatorHidden: false,
  keyboardType: 'default',
  onInputChangeText: () => {},
  onInputSubmitEditing: () => {},
  onItemPress: () => {},
};

export default TextInputRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingTop: 12,
  },
  titleText: {
    fontSize: 13,
    color: '#7f7f7f',
  },
  inputText: {
    marginTop: TEXT_INPUT_MARGIN_TOP,
    marginBottom: TEXT_INPUT_MARGIN_BOTTOM,
    height: TEXT_INPUT_HEIGHT,
    fontSize: 15,
    color: '#202020',
    backgroundColor: '#f000',
  },
  separator: {
    height: 1,
    marginTop: 0,
    backgroundColor: '#E9E9E9',
  },
});

