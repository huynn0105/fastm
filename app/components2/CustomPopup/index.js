import React, { PureComponent } from 'react';
import { Keyboard, View } from 'react-native';
import Modal from 'react-native-modal';

export const POPUP_POSITION = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};

class CustomPopup extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  open = () => {
    this.setState({ visible: true });
  };

  close = () => {
    Keyboard.dismiss();
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const {
      render,
      position = POPUP_POSITION.BOTTOM,
      canClose,
      backdropColor,
      avoidKeyboard,
    } = this.props;
    const PopupConfig = POPUP_CONFIG[position];

    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={visible}
        onBackdropPress={canClose ? this.close : () => {}}
        hideModalContentWhileAnimating
        useNativeDriver
        animationIn={PopupConfig.animationIn}
        animationOut={PopupConfig.animationOut}
        backdropColor={backdropColor}
        avoidKeyboard={avoidKeyboard}
      >
        <PopupConfig.Component child={render} />
      </Modal>
    );
  }
}

export default CustomPopup;

const BottomContent = ({ child }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 4,
      }}
    >
      {child()}
    </View>
  );
};

const TopContent = ({ child }) => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginTop: 4,
      }}
    >
      {child()}
    </View>
  );
};

const POPUP_CONFIG = {
  [POPUP_POSITION.TOP]: {
    Component: TopContent,
    animationIn: 'slideInDown',
    animationOut: 'slideOutUp',
  },
  [POPUP_POSITION.BOTTOM]: {
    Component: BottomContent,
    animationIn: 'slideInUp',
    animationOut: 'slideOutDown',
  },
};
