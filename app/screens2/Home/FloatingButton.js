import { Image } from 'react-native';
import React, { PureComponent } from 'react';

import ActionButton from '../../components/ActionButton/ActionButton';
import ActionButtonItem from '../../components/ActionButton/ActionButtonItem';

class FloatingButton extends PureComponent {
  onRootPress = (active) => {
    this.props.onRootPress(active);
  };
  onItemPress = (item) => {
    this.props.onItemPress(item);
  };

  renderFloatingButton = ({ position, title, items, zIndexButton, activeTabbar }) => {
    return items && items.length > 0 ? (
      <ActionButton
        zIndex={zIndexButton}
        textStyle={{
          color: position === 'left' ? '#5bad0c' : '#f24654'
        }}
        buttonStyle={{
          shadowColor: position === 'left' ? '#5bad0c' : '#f24654'
        }}
        title={title}
        renderIcon={this.renderIconAction}
        onPress={this.onRootPress}
        activeTabbar={activeTabbar}
        position={position}
      >
        {items.map((item) => this.renderItemAction(item))}
      </ActionButton>
    ) : null;
  };

  renderIconAction = (isActive) => {
    return isActive ? (
      <Image
        style={{
          width: 30,
          height: 30,
          borderRadius: 2.0
        }}
        source={require('./img/close.png')}
        resizeMode="contain"
      />
    ) : (
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 30
        }}
        source={{ uri: this.props.imageURL }}
        resizeMode="contain"
      />
    );
  };

  renderItemAction = (event) => {
    return (
      <ActionButtonItem
        key={event.imageURL}
        buttonColor="#fff"
        title={event.title}
        onPress={() => this.onItemPress(event)}
      >
        <Image
          style={{
            width: 60,
            height: 60,
            borderRadius: 30
          }}
          source={{ uri: event.imageURL }}
          resizeMode="contain"
        />
      </ActionButtonItem>
    );
  };

  render() {
    const { position, title, items, zIndexButton, activeTabbar } = this.props;
    return this.renderFloatingButton({ position, title, items, zIndexButton, activeTabbar });
  }
}

export default FloatingButton;
