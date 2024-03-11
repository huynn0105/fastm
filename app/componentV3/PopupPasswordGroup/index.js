import React, { useCallback, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import md5 from 'md5';
import Modal from 'react-native-modal';
import Colors from '../../theme/Color';
import FirebaseDatabase from '../../submodules/firebase/network/FirebaseDatabase';
import AppText from '../../componentV3/AppText';

import {ICON_PATH} from '../../assets/path';

const PopupPasswordGroup = ({
    onClose,
    isVisible,
    thread,
    isRequired = true
}) => {
    const [password, setPassword] = useState('');
    const [isShowError, setIsShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    //
    const [isSuccess, setIsSuccess] = useState(false);

    const onStaticClose = useCallback(
        () => {
            if(onClose) {
                onClose();
                setPassword('');
                setIsShowError(false);
                setErrorMessage('');
                setIsSuccess(false);
            }
        },
        [onClose],
    );

    const onStaticBackdropPress = useCallback(
        () => {
            if(isRequired) {return;}
            if(onClose) {
                onClose();
                setPassword('');
                setIsShowError(false);
                setErrorMessage('');
                setIsSuccess(false);
            }
        },
        [onClose, isRequired],
    )

    const onShowHidePws = useCallback(
        () => {
            setSecureTextEntry(!secureTextEntry);
        },
        [secureTextEntry],
    );

    
    const isValidSpace = useCallback(
        () => {
            const regEx = /\s/;
            return regEx.test(password);
        },
        [password],
    );
    
    const onPressSubmit = useCallback(
        async () => {
            if(isValidSpace()) {
                setIsShowError(true);
                setErrorMessage('Mật khẩu không được có khoảng trắng.');
                return;
            }
            if(!thread) {
                return;
            }
            const pass = md5(password);
            const result = await FirebaseDatabase.setPasswordToGroupThread(thread?.uid, pass);
            setIsSuccess(result);
            setIsShowError(false);
            setErrorMessage('');
        },
        [isValidSpace, password, thread],
    );

    const renderSuccessButton = useCallback(
        () => {
            return (
                <TouchableOpacity onPress={onStaticClose}>
                    <View style={[styles.footer]}>
                        <AppText style={styles.labelBtn}>Hoàn tất</AppText>
                    </View>
                </TouchableOpacity>
            )
        },
        [onStaticClose],
    );

    const renderBottomLock = useCallback(
        () => {
            if(isSuccess) return renderSuccessButton();
            const disabled = nickname?.length < 5;
            return (
                <TouchableOpacity disabled={disabled} onPress={onPressSubmit}>
                    <View style={[styles.footer, disabled && { opacity: 0.3}]}>
                        <AppText style={styles.labelBtn}>Cập nhật</AppText>
                    </View>
                </TouchableOpacity>
            )
        },
        [onPressSubmit, isSuccess, renderSuccessButton],
    )

    const renderBottomGroup = useCallback(
        () => {
            if(isSuccess) return renderSuccessButton();
            const disabled = password?.length < 5;
            return (
                <View style={styles.footerGroup}>
                    <View style={styles.bottomLeft}>
                        <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
                            <AppText style={styles.labelLeftBtn}>Đóng</AppText>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.bottomRight, disabled && { opacity: 0.3}]}>
                        <TouchableOpacity disabled={disabled} onPress={onPressSubmit} style={styles.bottomRight}>
                            <AppText style={styles.labelBtn}>Cập nhật</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        [onPressSubmit, onStaticClose, password, isSuccess, renderSuccessButton],
    )
    
    const renderSuccess = useCallback(
        () => {
            return (
                <View style={styles.body}>
                    <Image source={ICON_PATH.success} />
                    <AppText style={styles.indicatorSuccess}>Cập nhật mật khẩu thành công !!!</AppText>
                </View>
            )
        },
        [],
    );
    

    return (
        <View>
            <Modal
                style={styles.modal}
                isVisible={isVisible}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                onBackdropPress={onStaticBackdropPress}
            >
                <SafeAreaView style={styles.safe}>
                    <View style={styles.wrapper}>
                        <View style={styles.container}>
                           {isSuccess ? renderSuccess() : <View style={styles.body}>
                                <View style={styles.header}>
                                    <AppText style={styles.headerTitle}>Đặt mật khẩu</AppText>
                                </View>
                                <View style={{ width: '100%', justifyContent: 'center' }}>
                                    <TextInput
                                        autoFocus
                                        value={password}
                                        secureTextEntry={secureTextEntry}
                                        autoCapitalize="none"
                                        onChangeText={(value) => setPassword(value)}
                                        style={[styles.input, isShowError && { borderColor: Colors.accent3, backgroundColor: "#ffeaec" }]}
                                        autoCorrect={false}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    {!!password && (<View style={styles.clearIc}>
                                        <TouchableOpacity onPress={onShowHidePws}>
                                            <Image source={secureTextEntry ? ICON_PATH.pass_ac : ICON_PATH.pass_un} />
                                        </TouchableOpacity>
                                    </View>)}
                                </View>
                                {isShowError && (
                                    <View style={styles.errorWrapper}>
                                        <Image source={ICON_PATH.warning} />
                                        <AppText style={styles.errorTxt}>{errorMessage}</AppText>
                                    </View>
                                )}
                                <View>
                                    <View style={{ height: 8 }} />
                                    <AppText style={styles.indicator}>
                                        Lưu ý: Password <AppText style={styles.waring}>không được gồm khoảng trắng, độ dài từ 6 đến 20 ký tự.</AppText>
                                    </AppText>
                                </View>
                            </View>}
                            {isRequired ? renderBottomLock() : renderBottomGroup()}
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export default PopupPasswordGroup;

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
    },
    container: {
        width: '100%',
        backgroundColor: Colors.neutral5,
        borderRadius: 10,
    },
    body: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ic: {
        width: 29,
        height: 32
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary1,
        marginLeft: 10
    },
    input: {
        marginTop: 14,
        marginBottom: 10,
        width: '100%',
        height: 42,
        borderRadius: 5,
        backgroundColor: "rgb(241, 247, 255)",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.primary2,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 18,
        paddingHorizontal: 20,
    },
    footer: {
        height: 52,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelBtn: {
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary2
    },
    indicator: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: Colors.primary4 ,
        textAlign: 'left'
    },
    waring: {
        color: Colors.accent3
    },
    clearIc: {
        position: 'absolute',
        right: 20,
    },
    errorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    errorTxt: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.accent3,
        marginLeft: 6,
    },
    footerGroup: {
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
    },
    indicatorSuccess: {
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: "#2b7d0a",
        marginTop: 20,
        marginBottom: 10
    },
    indicatorDecsSuccess: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4,
        opacity: 0.8,
    },
    loadingContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        position: 'absolute',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
