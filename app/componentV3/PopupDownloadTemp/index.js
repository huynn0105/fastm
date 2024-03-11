import React, { useCallback, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal';

import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';

const PopupDownloadTemp = ({ initValue, isVisible, onClose, onSend }) => {
    const [email, setEmail] = useState(initValue || '');

    const onStaticClose = useCallback(
        () => {
            if(onClose) {
                onClose();
            }
        },
        [],
    );

    const onStaticSend = useCallback(
        () => {
            if(onSend && email) {
                onSend(email);
            }
        },
        [onSend, email],
    );

    return (
        <View>
            <Modal
                style={styles.modal}
                isVisible={isVisible}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                onBackdropPress={onStaticClose}
            >
                <SafeAreaView style={styles.safe}>
                    <View style={styles.wrapper}>
                        <View style={styles.container}>
                            <View style={styles.body}>
                                <AppText style={styles.title}>Tải xuống bản cam kết thuế</AppText>
                                <View style={styles.form}>
                                    <AppText style={styles.label}>Email:</AppText>
                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        value={email}
                                        onChangeText={value => setEmail(value)}
                                        keyboardType={'email-address'}
                                    />
                                </View>
                                <AppText style={styles.indicator}>
                                MFast sẽ giữ bản cam kết thuế qua Email trên. 
Điền đầy đủ thông tin, chữ kí vào form và gửi hình chụp để hoàn tất bản cam kết thuế
                                </AppText>
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.bottomLeft}>
                                    <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
                                        <AppText style={styles.labelLeftBtn}>Để sau</AppText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomRight}>
                                    <TouchableOpacity onPress={onStaticSend} style={styles.bottomRight}>
                                        <AppText style={styles.labelBtn}>Gửi về Email trên</AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export default PopupDownloadTemp;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        padding: 0
    },
    safe: {
        flex: 1
    },
    wrapper: {
        flex: 1,
        padding: 16,
        top: 120,
        alignItems: 'center',
        // justifyContent: 'center'
    },
    container: {
        width: '100%',
        backgroundColor: Colors.neutral5,
        borderRadius: 10,
    },
    body: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginVertical: 16,
        justifyContent: 'space-between',
        borderBottomColor: "#dcdcdc"
    },
    label: {
        opacity: 0.5,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 4,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4,
    },
    title: {
        opacity: 0.6,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4
    },
    indicator: {
        opacity: 0.6,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    bottomLeft: {
        flex: 1,
        height: 56,
        width: '100%',
        backgroundColor: "#f2f2f2",
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 10,
    },
    bottomRight: {
        flex: 1,
        width: '100%',
        height: 56,
        backgroundColor: "#f2f2f2",
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomRightRadius: 10,
    },
    labelLeftBtn: {
        opacity: 0.6,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4
    },
    labelBtn: {
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary2
    }
})
