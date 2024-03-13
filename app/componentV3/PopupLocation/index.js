import React, { useCallback, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal';

import Colors from '../../theme/Color';
import {IMAGE_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const PopupLocation = ({
    isVisible,
    onClose,
    onRequestLocation
}) => {

    const onStaticClose = useCallback(
        () => {
            if(onClose) {
                onClose();
            }
        },
        [onClose],
    );

    const onStaticRequestLocation = useCallback(
        () => {
            if(onRequestLocation) {
                onRequestLocation();
            }
        },
        [onRequestLocation],
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
                                <Image
                                    source={IMAGE_PATH.indicator_location}
                                />
                                <AppText style={styles.title}>Cho phép sử dụng vị trí hiện tại của bạn.</AppText>
                                <AppText style={styles.indicator}>
                                MFast cần sử dụng vị trí của bạn làm căn cứ xác thực cho hợp đồng dịch vụ. Vui lòng xác nhận?
                                </AppText>
                            </View>
                            <View style={styles.footer}>
                                <View style={styles.bottomLeft}>
                                    <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
                                        <AppText style={styles.labelLeftBtn}>Đóng</AppText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomRight}>
                                    <TouchableOpacity onPress={onStaticRequestLocation} style={styles.bottomRight}>
                                        <AppText style={styles.labelBtn}>Đồng ý</AppText>
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

export default PopupLocation;

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
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 24,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4,
        marginTop: 12,
    },
    indicator: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
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
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary3
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
