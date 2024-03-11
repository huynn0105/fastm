import React, {useCallback} from 'react'
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
import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const PopupPreviewAddBank = ({
    isVisible,
    onClose,
    data,
    onPressSubmit,
}) => {

    const onStaticClose = useCallback(
        () => {
            if(onClose) {
                onClose();
            }
        },
        [onClose],
    );
    
    const onStaticPressSubmit = useCallback(
        () => {
            if(onPressSubmit) {
                onStaticClose();
                setTimeout(() => {
                    onPressSubmit();
                }, 300);
            }
        },
        [onPressSubmit, onStaticClose],
    )

    const renderBottomGroup = useCallback(
        () => {
            return (
                <View style={styles.footerGroup}>
                    <View style={styles.bottomLeft}>
                        <TouchableOpacity onPress={onStaticClose} style={styles.bottomLeft}>
                            <AppText style={styles.labelLeftBtn}>Quay lại</AppText>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.bottomRight]}>
                        <TouchableOpacity onPress={onStaticPressSubmit} style={styles.bottomRight}>
                            <AppText style={styles.labelBtn}>Xác nhận thông tin</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        },
        [onStaticPressSubmit, onStaticClose],
    )

    return (
      <View>
        <Modal
          style={styles.modal}
          isVisible={isVisible}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
        >
          <SafeAreaView style={styles.safe}>
            <View style={styles.wrapper}>
              <View style={styles.container}>
                <View style={styles.body}>
                  <Image source={ICON_PATH.warning2} style={styles.ic} />
                  <AppText style={styles.title}>
                    Kiểm tra lại thông tin dưới đây trước khi thêm tài khoản ngân hàng
                  </AppText>
                </View>
                <View style={styles.formInforContainer}>
                  <View style={styles.rowItem}>
                    <AppText style={styles.label}>Số tài khoản</AppText>
                    <AppText style={styles.txtContentNumber}>{data?.bankNumber || '---'}</AppText>
                  </View>
                  <View style={styles.rowItem}>
                    <AppText style={styles.label}>Ngân hàng</AppText>
                    <AppText style={styles.txtContent}>{data?.bankName || '---'}</AppText>
                  </View>
                  <View style={styles.rowItem}>
                    <AppText style={styles.label}>Chi nhánh</AppText>
                    <AppText style={styles.txtContent}>{data?.bankBranchName || '---'}</AppText>
                  </View>
                </View>
                <View style={styles.indicatorContainer}>
                  <AppText style={styles.indicatorBottom}>
                    MFast sẽ dựa vào thông tin trên để tiến hành chuyển tiền khi bạn muốn rút tiền
                    thu nhập từ MFast. Vui lòng kiểm tra kỹ.
                  </AppText>
                </View>
                {renderBottomGroup()}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
}

export default PopupPreviewAddBank;

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
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        width: '100%',
        backgroundColor: Colors.primary5,
        borderRadius: 10,
    },
    body: {
        padding: 16,
        paddingBottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ic: {
        width: 64,
        height: 64,
        marginTop: 4,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4
    },
    desc: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary4,
        marginTop: 12,
    },
    bottom: {
        width: '100%',
        height: 56,
        borderRadius: 10,
        backgroundColor: "#f2f2f2",
        alignItems: 'center',
        justifyContent: 'center'
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
        fontWeight: "500",
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
    formInforContainer: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        margin: 16,
        borderRadius: 6,
        backgroundColor: Colors.neutral5
    },
    rowItem: {
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtContentNumber: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.6,
        textAlign: "right",
        color: Colors.primary4
    },
    txtContent: {
        flex: 1,
        fontSize: 14,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.6,
        textAlign: "right",
        color: Colors.primary4
    },
    indicatorContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    label: {
        opacity: 0.6,
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    indicatorBottom: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: Colors.primary4
    }
})
