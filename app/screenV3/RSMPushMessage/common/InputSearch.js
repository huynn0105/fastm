import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { forwardRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { ICON_PATH } from '../../../assets/path';
import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import { styles } from '../RSMPushMessage.style';

const InputSearch = ({ onStartSearch, keyword, setKeyword }, ref) => {
  useImperativeHandle(ref, () => ({
    getInput() {
      return keyword;
    },
  }));
  const onChangeText = (text) => {
    setKeyword(text);
  };
  const clearInput = () => {
    setKeyword('');
  };

  return (
    <View style={styles.containerInput}>
      <View style={styles.searchIconPosition}>
        <Image source={ICON_PATH.search1} style={styles.searchIcon} />
      </View>
      <TouchableOpacity onPress={onStartSearch}>
        <View
          style={[
            styles.textInput,
            {
              justifyContent: 'center',
            },
          ]}
        >
          <AppText style={{ fontSize: SH(14), lineHeight: SH(18), color: Colors.gray5 }}>
            {keyword?.length > 0 ? keyword : 'Tìm theo nickname, mã MFast CTV'}
          </AppText>
        </View>
      </TouchableOpacity>

      {keyword?.length > 0 ? (
        <TouchableWithoutFeedback onPress={clearInput}>
          <View style={styles.deleteIconPosition}>
            <Image source={ICON_PATH.delete3} style={styles.searchIcon} />
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
};

export default forwardRef(InputSearch);
