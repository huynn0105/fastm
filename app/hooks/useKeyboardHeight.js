import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isShow, setIsShow] = useState(false);

  function onKeyboardDidShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
    setIsShow(true);
  }

  function onKeyboardDidHide() {
    setIsShow(false);
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  return { keyboardHeight, isShowKeyboard: isShow };
};
