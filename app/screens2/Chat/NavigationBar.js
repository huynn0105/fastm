import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ICON_PATH } from '../../assets/path';
import ImageButton from '../../common/buttons/ImageButton';
import KJButton from '../../components/common/KJButton';
import AppText from '../../componentV3/AppText';
import { SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import SearchBar from './SearchBar';

class NavigationBar extends Component {
  onAlarmPress = () => {
    this.props.onAlarmPress();
  };
  onAddPress = () => {
    this.props.onAddPress();
  };
  onSearchTextChanged = (text) => {
    if (this.props.onSearchTextChanged) {
      this.props.onSearchTextChanged(text);
    }
  };
  onFocusingSearchBar = (focused) => {
    this.props.onFocusingSearchBar(focused);
  };
  onClosePress = () => {
    if (this.refSearchBar) {
      this.refSearchBar.blur();
      this.refSearchBar.clear();
    }
    this.props.onCloseSearchPress();
  };
  // --------------------------------------------------
  // RENDER METHODS
  // --------------------------------------------------
  renderSearchBar = () => (
    <SearchBar
      ref={(ref) => (this.refSearchBar = ref)}
      loading={this.props.loading}
      onSearchTextChanged={this.onSearchTextChanged}
      onFocusing={this.onFocusingSearchBar}
      // showBottomLine
      placeholder={'Tìm kiếm'}
      style={{ backgroundColor: Colors.neutral5 }}
    />
  );
  renderRightIcons = (isShownRightCloseButton) => {
    return (
      <Animatable.View
        style={[styles.iconContainer, { position: 'absolute', right: 0 }]}
        duration={450}
        animation={!isShownRightCloseButton ? 'slideInRight' : 'slideOutRight'}
      >
        <View style={{}}>
          {/* <ImageButton
            imageStyle={{ marginRight: 26, width: 24, height: 24 }}
            imageSource={require('./img/ic_alarm_bell.png')}
            onAlarmPress={this.onAlarmPress}
          /> */}
          <ImageButton
            imageStyle={{ width: 24, height: 24 }}
            imageSource={require('./img/ic_add_friend.png')}
            onPress={this.onAddPress}
          />
        </View>
      </Animatable.View>
    );
  };

  renderRightCloseButton = (isShownRightCloseButton) => {
    return (
      <Animatable.View
        style={styles.iconContainer}
        duration={450}
        animation={isShownRightCloseButton ? 'slideInRight' : 'slideOutRight'}
      >
        <TouchableOpacity style={{}} onPress={this.onClosePress}>
          <AppText style={{ ...TextStyles.heading4 }}>{'Đóng'}</AppText>
        </TouchableOpacity>
      </Animatable.View>
    );
  };
  render() {
    const { isShownRightCloseButton } = this.props;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <KJButton
          testID="header-back"
          containerStyle={{ marginLeft: SW(16) }}
          leftIconSource={ICON_PATH.back}
          leftIconStyle={{ width: 22, height: 22, resizeMode: 'contain' }}
          onPress={this.props.onBackPress}
        />
        {this.renderSearchBar()}
        {this.renderRightIcons(isShownRightCloseButton)}
        {this.renderRightCloseButton(isShownRightCloseButton)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    minWidth: SW(33),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SW(10),
  },
});

// --------------------------------------------------

NavigationBar.propTypes = {
  onAddPress: PropTypes.func,
};

NavigationBar.defaultProps = {
  onAddPress: () => {},
};

export default NavigationBar;
