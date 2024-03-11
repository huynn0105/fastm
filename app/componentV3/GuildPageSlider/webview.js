import React, {useCallback} from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import { MFConfigs } from '../../constants/configs';
import AppText from '../../componentV3/AppText';
import {ICON_PATH} from '../../assets/path';

const { height } = Dimensions.get('window');

const Webview = ({isVisibleWebview, onCloseModal}) => {

    const onStaticCloseModal = useCallback(
        () => {
          if(onCloseModal) {
            onCloseModal();
          }
        },
        [onCloseModal],
    );

    return (
      <Modal
        isVisible={isVisibleWebview}
        style={{ padding: 0, margin: 0 }}
        onBackdropPress={onStaticCloseModal}
        onModalHide={onStaticCloseModal}
      >
        <View style={styles.wrapper}>
          <TouchableWithoutFeedback onPress={onStaticCloseModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={onStaticCloseModal}>
                <Image source={ICON_PATH.close1} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
              <AppText style={styles.txtHeader}>Chính sách thu nhập</AppText>
              <View style={{ width: 20, height: 20 }} />
            </View>
            <WebView source={{ uri: MFConfigs.policy }} style={{ flex: 1 }} />
          </View>
        </View>
      </Modal>
    );
}

export default Webview;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
      },
    container: {
        backgroundColor: '#c5c9ce',
        height: height - 100,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 46,
        paddingHorizontal: 14,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
    },
    txtHeader: {
        opacity: 0.6,
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#24253d',
    },
})
