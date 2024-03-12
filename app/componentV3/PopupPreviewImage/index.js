import React, { useEffect, useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    ScrollView,
} from 'react-native'

import { SCREEN_WIDTH } from '../../utils/Utils';
import Colors from '../../theme/Color';

import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const PopupPreviewImage = ({ isVisible, arrayImg = [],  onClose, typeSample = "CMND"}) => {

    const onPressClose = useCallback(
        () => {
            if(onClose) {
                onClose();
            }
        },
        [onClose],
    )

    const renderDesc = useCallback(
        () => {
            if(typeSample === 'CMND') {
                return (
                    <AppText style={styles.indicatorDesc}>(Hình bắt buộc phải <AppText style={styles.txtWraning}> hiển thị đầy đủ 4 góc</AppText> , rõ nét và không bị nhoè)</AppText>
                )
            }
            if(typeSample === 'TAX') {
                return (
                    <AppText style={styles.indicatorDesc}>(Tải mẫu và điền thông tin như hình dưới đây)</AppText>
                )
            }
            return (
                <AppText style={styles.indicatorDesc}>(Hình phải <AppText style={styles.txtBlod}>rõ gương mặt và mặt trước của CMND</AppText>, <AppText style={styles.txtWraning}>KHÔNG ĐƯỢC đeo kính, đội mũ</AppText> khi chụp. Hình phải rõ nét và không bị nhoè)</AppText>
            )
        },
        [typeSample],
    )


    const renderTitle = useCallback(
        () => {
            if(typeSample === 'CMND') {
                return (
                    <AppText style={styles.indicatorLabel}>
                    Mẫu chụp 2 mặt CMND
                </AppText>
                )
            }
            if(typeSample === 'TAX') {
                return (
                    <AppText style={styles.indicatorLabel}>Mẫu chụp bản cam kết</AppText>
                )
            }
            return (
                <AppText style={styles.indicatorLabel}>Mẫu chụp chân dung cầm CMND</AppText>
            )
        },
        [typeSample],
    )

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
        >
            <View style={styles.modalWrapper}>
                <View style={styles.modalContainer} >
                   {(arrayImg && arrayImg?.length > 0) ? (
                        <ScrollView
                            scrollEnabled
                            pagingEnabled
                            horizontal
                            bounces
                            bouncesZoom
                            minimumZoomScale={1}
                            maximumZoomScale={5}
                        >
                            {arrayImg.map(sourceImg => (
                                <Image
                                    source={{ uri: sourceImg }}
                                    style={styles.photoCmnd}
                                    resizeMode="contain"
                                />
                            ))}
                        </ScrollView>
                    ) : (<View />
                    )}
                    <TouchableOpacity onPress={onPressClose}>
                        <Image
                            style={styles.ic}
                            source={ICON_PATH.close2}
                        />
                    </TouchableOpacity>
                </View>
            </View>
         </Modal>
    )
}

export default PopupPreviewImage

const styles = StyleSheet.create({
    indicatorLabel: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary5,
        marginBottom: 10,  
    },
    modalWrapper: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    photo: {
        flex: 1,
        width: SCREEN_WIDTH - 32,
        aspectRatio: 3 / 4,
        borderRadius: 10,
    },
    photoTax: {
        width: SCREEN_WIDTH - 32,
        aspectRatio: 343 / 389,
    },
    photoCmnd: {
        flex: 1,
        width: SCREEN_WIDTH - 32,
        // aspectRatio: 343 / 494,
    },
    ic: {
        width: 36,
        height: 36,
        marginTop: 42,
        marginBottom: 16
    },
    indicatorDesc: {
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary5,
        marginBottom: 40, 
        marginHorizontal: 10, 
    },
    txtBlod: {
        fontWeight: 'bold'
    },
    txtWraning: {
        fontWeight: 'bold',
        color: 'rgb(255, 82, 82)'
    }
})
