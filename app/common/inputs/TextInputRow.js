/**
 * Extend input text with title
 */
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import AppText from '../../componentV3/AppText';
const _ = require('lodash');

// --------------------------------------------------

const TEXT_INPUT_HEIGHT = Platform.OS === 'ios' ? 28 : 40;
const TEXT_INPUT_MARGIN_TOP = Platform.OS === 'ios' ? 2 : 0;
const TEXT_INPUT_MARGIN_BOTTOM = Platform.OS === 'ios' ? 0 : -8;

// --------------------------------------------------
// TextInputRow
// --------------------------------------------------

class TextInputRow extends Component {
  constructor(props) {
    super(props);

    let isSecureTextEntry = false;
    if (this.props.textInputProps && this.props.textInputProps.secureTextEntry) {
      isSecureTextEntry = this.props.textInputProps.secureTextEntry;
    }

    this.state = {
      isSecureTextEntry,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState));
  }

  // --------------------------------------------------
  onTitlePress = () => {
    if (this.textInput) {
      this.textInput.focus();
    }
  }
  onRevealPress = () => {
    this.setState({
      isSecureTextEntry: !this.state.isSecureTextEntry,
    });
  }
  // --------------------------------------------------
  render() {
    const {
      title,
      containerStyle,
      titleStyle, 
      textInputStyle,
      textInputProps,
      isSeparatorHidden,
      isRevealButtonHidden,
    } = this.props;
    const {
      isSecureTextEntry,
    } = this.state;

    const revealButtonTitle = isSecureTextEntry ? 'Hiện' : 'Ẩn';

    const pointerEvents = (textInputProps && textInputProps.editable === false) ? 
      'none' : 'auto';

    return (
      <View 
        style={[styles.container, containerStyle]}
        pointerEvents={pointerEvents}
      >

        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onTitlePress}
        >
          <AppText style={[styles.titleText, titleStyle]}>
            {title}
          </AppText>
        </TouchableOpacity>

        <View style={styles.row}>
          
          <TextInput
            ref={o => { this.textInput = o; }}
            style={[styles.textInput, textInputStyle]}
            autoCorrect={false}
            autoCapitalize={'none'}
            underlineColorAndroid="#0000"
            {...textInputProps}
            secureTextEntry={isSecureTextEntry}
          />

          {
            isRevealButtonHidden ? null :
              <TouchableOpacity
                style={styles.revealButton}
                activeOpacity={0.65}
                onPress={this.onRevealPress}
              >
                <AppText style={styles.revealButtonTitle}>
                  {revealButtonTitle}
                </AppText>
              </TouchableOpacity>
          }

        </View>

        {
          isSeparatorHidden ? null :
            <View style={styles.separator} />
        }

      </View>
    );
  }
}

// --------------------------------------------------

TextInputRow.propTypes = {
  title: PropTypes.string,
  textInputValue: PropTypes.string,
  isSeparatorHidden: PropTypes.bool,
  isRevealButtonHidden: PropTypes.bool,
};

TextInputRow.defaultProps = {
  title: 'title',
  textInputValue: '',
  isSeparatorHidden: false,
  isRevealButtonHidden: true,
};

export default TextInputRow;

// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingTop: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
    color: '#7f7f7f',
    backgroundColor: '#ff00',
  },
  textInput: {
    flex: 1,
    marginTop: TEXT_INPUT_MARGIN_TOP,
    marginBottom: TEXT_INPUT_MARGIN_BOTTOM,
    height: TEXT_INPUT_HEIGHT,
    fontSize: 15,
    color: '#202020',
    backgroundColor: '#f000',
  },
  revealButton: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingLeft: 16,
    paddingRight: 12,
    height: null,
  },
  revealButtonTitle: {
    backgroundColor: '#0000',
    color: '#0080DC',
    fontSize: 14,
    fontWeight: '300',
  },
  separator: {
    height: 1,
    marginTop: 0,
    backgroundColor: '#E9E9E9',
  },
});

