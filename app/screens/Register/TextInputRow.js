import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PropTypes from 'prop-types';

// --------------------------------------------------

const TEXT_INPUT_HEIGHT = Platform.OS === 'ios' ? 28 : 40;
const TEXT_INPUT_MARGIN_TOP = Platform.OS === 'ios' ? 2 : 0;
const TEXT_INPUT_MARGIN_BOTTOM = Platform.OS === 'ios' ? 0 : -8;

class TextInputRow extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputText: props.inputText || '',
    };
  }
  // --------------------------------------------------
  componentWillReceiveProps(nextProps) {
    if (nextProps.inputText !== undefined) {
      this.setState({
        inputText: nextProps.inputText,
      });
    }
  }
  // --------------------------------------------------
  onFocus = () => {
    this.props.onInputFocus();
  }
  onInputTextChange = (text) => {
    this.setState({
      inputText: text,
    }, () => {
      this.props.onInputChangeText(text);
    });
  }
  onInputSubmitEditing = () => {
    this.props.onInputSubmitEditing();
  }
  // --------------------------------------------------
  render() {
    const {
      title, inputTextEditable,
      style, titleTextStyle, inputTextStyle,
      isSeperatorHidden,
    } = this.props;
    const pointerEvents = inputTextEditable ? 'auto' : 'none';
    return (
      <View 
        style={[styles.container, style]} 
        pointerEvents={pointerEvents}
      >
        <Text style={[styles.titleText, titleTextStyle]}>
          {title}
        </Text>
        <TextInput
          style={[styles.inputText, inputTextStyle]}
          autoCorrect={false}
          editable={inputTextEditable}
          underlineColorAndroid="#0000"
          value={this.state.inputText}
          keyboardType={this.props.keyboardType}
          onFocus={this.onFocus}
          onChangeText={this.onInputTextChange}
          onSubmitEditing={this.onInputSubmitEditing}
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
  inputText: PropTypes.string,
  titleTextStyle: Text.propTypes.style,
  inputTextStyle: Text.propTypes.style,
  inputTextEditable: PropTypes.bool,
  isSeperatorHidden: PropTypes.bool,
  keyboardType: PropTypes.string,
  onInputFocus: PropTypes.func,
  onInputChangeText: PropTypes.func,
  onInputSubmitEditing: PropTypes.func,
};

TextInputRow.defaultProps = {
  isSeperatorHidden: false,
  inputTextEditable: true,
  keyboardType: 'default',
  onInputFocus: () => {},
  onInputChangeText: () => {},
  onInputSubmitEditing: () => {},
};

export default TextInputRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingTop: 12,
  },
  titleText: {
    fontSize: 12,
    color: '#7f7f7f',
  },
  inputText: {
    marginTop: TEXT_INPUT_MARGIN_TOP,
    marginBottom: TEXT_INPUT_MARGIN_BOTTOM,
    height: TEXT_INPUT_HEIGHT,
    fontSize: 14,
    color: '#202020',
    backgroundColor: '#f000',
  },
  separator: {
    height: 1,
    marginTop: 0,
    backgroundColor: '#E9E9E9',
  },
});

