import KJButton from 'app/components/common/KJButton';
import React, { Component } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SearchBar } from 'react-native-elements';

const BAR_HEIGHT = Platform.OS === 'android' ? 44 : 44;

const _ = require('lodash');

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
    this.searchBar.blur();
    this.setState({
      searchText: '',
    });
    this.onSearchText('');
  };
  onFocusSearchBar = () => {
    this.onFocusing(true);
  };
  onBlurSearchBar = () => {
    this.onFocusing(false);
  };
  onSearchBarChangeText = (text) => {
    this.setState({
      searchText: text,
    });
    this.debounceSetSearchText(text);
  };
  onSearchBarClearText = () => {
    this.setState({
      searchText: '',
    });
    this.debounceSetSearchText('');
  };
  onSearchText = (text) => {
    // if (this.state.searchText !== text) {
    if (this.props.onSearchTextChanged) {
      this.props.onSearchTextChanged(text);
    }
    // }
  };
  debounceSetSearchText = _.debounce(this.onSearchText, 500);

  render() {
    const {
      style,
      containerStyle,
      inputStyle,
      placeholder,
      showBottomLine,
      keyboardType,
      iconLeft,
      iconRight,
    } = this.props;
    return (
      <View
        style={[
          {
            backgroundColor: '#fff',
            flexDirection: 'row',
            height: BAR_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <Image
          style={{
            width: 20,
            height: '100%',
            flex: 0,
            marginLeft: 16,
            marginRight: 2,
          }}
          resizeMode={'contain'}
          source={iconLeft || require('./img/search.png')}
        />
        <Animatable.View
          style={{ flex: 1, backgroundColor: '#fff' }}
          duration={450}
          animation={this.state.focusingSearch ? 'slideInRight24' : 'slideOutRight24'}
          useNativeDriver
        >
          <SearchBar
            ref={(search) => {
              this.searchBar = search;
            }}
            lightTheme
            searchIcon={null}
            clearIcon={null}
            containerStyle={[
              {
                backgroundColor: '#fff',
                flex: 1,
                justifyContent: 'center',
                borderWidth: 0,
                padding: 0,
                margin: 0,
                borderRadius: 0,
              },
              containerStyle,
            ]}
            inputContainerStyle={{
              height: BAR_HEIGHT,
              backgroundColor: '#fff',
              borderWidth: 0,
              borderRadius: 0,
              // padding: 0,
              // margin: 0
            }}
            inputStyle={[
              {
                flex: 0,
                backgroundColor: '#fff',
                padding: 0,
                borderRadius: 0,
                borderWidth: 0,
                fontSize: 14,
                textAlign: 'left',
                fontWeight: this.state.focusingSearch ? '400' : '400',
                color: this.state.focusingSearch ? '#000d' : '#0008',
              },
              inputStyle,
            ]}
            onChangeText={this.onSearchBarChangeText}
            onClearText={this.onSearchBarClearText}
            placeholder={placeholder}
            value={this.state.searchText}
            autoCorrect={false}
            onFocus={this.onFocusSearchBar}
            onBlur={this.onBlurSearchBar}
            keyboardType={keyboardType || 'default'}
          />
        </Animatable.View>
        <View
          style={{
            position: 'absolute',
            right: 48,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.loading && (
            <ActivityIndicator
              style={{ alignSelf: 'center' }}
              animating
              color="#404040"
              size="small"
            />
          )}
        </View>
        {showBottomLine && (
          <Animatable.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 1,
              bottom: 4,
              backgroundColor: '#0080DC',
            }}
            duration={450}
            animation={this.state.focusingSearch ? 'fadeInLeftBig' : 'fadeOutLeftBig'}
            useNativeDriver
          />
        )}
        <View
          style={{
            position: 'absolute',
            right: 0,
            height: 1,
            width: 16,
            bottom: 4,
            backgroundColor: '#E6EBFF',
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
            height: 1,
            width: 16,
            bottom: 4,
            backgroundColor: '#E6EBFF',
          }}
        />
        <Animatable.View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          duration={450}
          animation={this.state.focusingSearch ? 'fadeIn' : 'fadeOut'}
          useNativeDriver
        >
          <KJButton
            containerStyle={{
              width: 22,
              height: '100%',
              flex: 0,
              marginRight: 16,
            }}
            leftIconSource={iconRight || require('./img/clear.png')}
            leftIconStyle={{ marginLeft: 0 }}
            onPress={this.onClearSearchPress}
          />
        </Animatable.View>
      </View>
    );
  }
}

export default AniSearchBar;

const styles = StyleSheet.create({
  topLine: {
    // position: 'absolute',
    // left: 0,
    // top: 0,
    // right: 0,
    // height: 1,
    // backgroundColor: '#E6EBFF',
  },
  bottomLine: {
    // position: 'absolute',
    // left: 0,
    // bottom: 0,
    // right: 0,
    // height: 1,
    // backgroundColor: '#E6EBFF',
  },
});
