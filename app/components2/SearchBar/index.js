import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SearchBar } from 'react-native-elements';
import { ICON_PATH } from '../../assets/path';
import Colors from '../../theme/Color';
import AnimatedLine from '../AnimatedLine/index';

const BAR_HEIGHT = Platform.OS === 'android' ? 44 : 44;

const _ = require('lodash');

const ABSOLUTE_PADDING_RIGHT = 50;

class AniSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusingSearch: false,
      searchText: '',
    };
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.setState({
          focusingSearch: false,
        });
      });
    }
  }

  onFocusing = (focusing) => {
    this.setState({
      focusingSearch: focusing,
    });
    if (this.props.onFocusing) {
      this.props.onFocusing(focusing);
    }
  };
  onClearSearchPress = () => {
    this.setState({ searchText: '' });
    this.onSearchText('');
  };
  onFocusSearchBar = () => {
    this.onFocusing(true);
  };
  onBlurSearchBar = () => {
    this.onFocusing(false);
  };
  onSearchBarChangeText = (text) => {
    this.setState({ searchText: text });
    this.debounceSetSearchText(text);
  };
  onSearchBarClearText = () => {
    this.setState({ searchText: '' });
    this.debounceSetSearchText('');
  };
  onSearchText = (text) => {
    // if (this.state.searchText !== text) {
    if (this.props.onSearchTextChanged) {
      this.props.onSearchTextChanged(text);
    }
    // }
  };

  getRefSearchBar = (refSearchBar) => {
    this.searchBar = refSearchBar;
    this.props.refSearchBar(refSearchBar);
  };

  debounceSetSearchText = _.debounce(this.onSearchText, 700);

  renderLeftIcon = () => (
    <Image
      style={{
        width: 18,
        height: '100%',
        flex: 0,
        marginLeft: 16,
        marginRight: 2,
      }}
      resizeMode={'contain'}
      source={ICON_PATH.search1}
    />
  );

  renderSearchBarInput = (placeholder, keyboardType) => {
    const placeholderColor = this.state.focusingSearch ? Colors.neutral4 : Colors.primary4;
    const { isSearchBarChat } = this.props;
    return (
      <SearchBar
        ref={this.getRefSearchBar}
        lightTheme
        searchIcon={null}
        clearIcon={null}
        containerStyle={{
          backgroundColor: isSearchBarChat ? Colors.neutral5 : Colors.primary5,
          flex: 1,
          justifyContent: 'center',
        }}
        inputContainerStyle={{
          backgroundColor: isSearchBarChat ? Colors.neutral5 : Colors.primary5,
        }}
        inputStyle={{
          backgroundColor: isSearchBarChat ? Colors.neutral5 : Colors.primary5,
          padding: 0,
          fontSize: 14,
          textAlign: 'left',
          fontWeight: this.state.focusingSearch ? '400' : '400',
          color: this.state.focusingSearch ? '#000d' : '#0008',
        }}
        onChangeText={this.onSearchBarChangeText}
        onClearText={this.onSearchBarClearText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={this.state.searchText}
        autoCorrect={false}
        onFocus={this.onFocusSearchBar}
        onBlur={this.onBlurSearchBar}
        keyboardType={keyboardType || 'default'}
      />
    );
  };

  renderBottomLine = () => (
    <AnimatedLine
      style={{
        position: 'absolute',
        left: 16,
        right: ABSOLUTE_PADDING_RIGHT + 24,
        height: 1,
        bottom: 2,
      }}
      focusing={this.state.focusingSearch}
    />
  );

  renderLoading = () => (
    <View style={{ marginRight: 4 }}>
      {this.props.loading && <ActivityIndicator animating color="#404040" size="small" />}
    </View>
  );
  renderClearTextIcon = (searchText) => {
    return (
      <Animatable.View duration={450} animation={searchText ? 'fadeIn' : 'fadeOut'} useNativeDriver>
        <TouchableOpacity
          style={{
            width: 30,
            height: '100%',
            flex: 0,
            paddingTop: 8,
          }}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          }}
          onPress={this.onClearSearchPress}
        >
          <Image style={{ width: 24, height: 24 }} source={ICON_PATH.delete1} />
        </TouchableOpacity>
      </Animatable.View>
    );
  };
  renderRightIcons = () => {
    const { searchText } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          right: ABSOLUTE_PADDING_RIGHT,
          top: 0,
          bottom: 0,
          paddingRight: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {this.renderLoading()}
        {searchText ? this.renderClearTextIcon(searchText) : null}
      </View>
    );
  };

  render() {
    const { style, placeholder, showBottomLine, keyboardType, isSearchBarChat } = this.props;
    return (
      <View style={[styles.container, style]}>
        {this.renderLeftIcon()}
        <Animatable.View
          style={{ flex: 1 }}
          duration={450}
          animation={this.state.focusingSearch ? 'slideInRight24' : 'slideOutRight24'}
          useNativeDriver
        >
          {this.renderSearchBarInput(placeholder, keyboardType)}
          {isSearchBarChat ? null : <View style={styles.topLine} />}
          {isSearchBarChat ? null : <View style={styles.bottomLine} />}
        </Animatable.View>
        {showBottomLine && this.renderBottomLine()}
        {isSearchBarChat ? null : (
          <View
            style={{
              position: 'absolute',
              right: 0,
              height: 1,
              width: '100%',
              bottom: 0,
              backgroundColor: '#fff',
            }}
          />
        )}
        {isSearchBarChat ? null : (
          <View
            style={{
              position: 'absolute',
              left: 0,
              height: 1,
              width: '100%',
              top: 0,
              backgroundColor: '#fff',
            }}
          />
        )}
        {this.renderRightIcons()}
      </View>
    );
  }
}

export default AniSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E6EBFF',
  },
});
