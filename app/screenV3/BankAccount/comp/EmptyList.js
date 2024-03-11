import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import AppText from '../../../componentV3/AppText';
import SubmitButton from '../../../componentV3/Button/SubmitButton';

import Colors from '../../../theme/Color';

import {ICON_PATH} from '../../../assets/path';

const STEP_DATA = [
    {
        icon: ICON_PATH.bank_step1,
        id: 'STEP_1',
        content: 'Rút tiền miễn phí từ MFast'    
    },
    {
        icon: ICON_PATH.bank_step2,
        id: 'STEP_2',
        content: 'Nhận thẻ ATM miễn phí, tận nhà trong vòng 3 ngày làm việc'    
    },
    {
        icon: ICON_PATH.bank_step3,
        id: 'STEP_3',
        content: 'Miễn phí rút tiền tại các máy ATM trên toàn quốc'    
    },
    {
        icon: ICON_PATH.bank_step4,
        id: 'STEP_4',
        content: 'Định danh trực tuyến, hoàn tất trong 5 phút'    
    },
    {
        icon: ICON_PATH.bank_step5,
        id: 'STEP_5',
        content: 'Tặng ngay 40,000 vnđ vào ví MFast để trải nghiệm rút tiền ngay sau khi mở tài khoản CIMB thành công',
        hideDivider: true
    }
]

const StepItem = ({item}) => (
    <View style={styles.stepItemContainer}>
        <View style={styles.right}>
            <Image source={item?.icon} style={styles.ic}/>
            {!item?.hideDivider && (<View style={styles.stepDivider} />)}
        </View>
        <View style={styles.content}>
            <AppText>{item?.content}</AppText>
        </View>
    </View>
)

const EmptyList = ({ onPress }) => {

    const onStaticPress = useCallback(
        () => {
            if(onPress) {
                onPress();
            } 
        },
        [onPress],
    );

    return (
        <View style={styles.wrapper}>
            <AppText style={styles.title}>Tài khoản ngân hàng CIMB Bank</AppText>
            <AppText style={styles.indicator}>Lợi ích khi sử dụng TK NH CIMB Bank</AppText>
            {STEP_DATA.map(item => <StepItem key={item.id} item={item} />)}
            <View style={styles.bt}>
                <SubmitButton
                    label={"Mở và liên kết TK CIMB Bank"}
                    onPress={onStaticPress}
                />
            </View>
        </View>
    )
}

export default EmptyList

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: 6,
        backgroundColor: "#e0ffdd",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.primary2,
        marginVertical: 16,
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    indicator: {
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 16,
        letterSpacing: 0,
        color: "#008932",
        marginVertical: 16
    },
    right: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    ic: {
        width: 36,
        height: 36
    },
    stepItemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    stepDivider: {
        width: 1,
        height: 16,
        backgroundColor: Colors.primary5
    },
    content: {
        flex: 1,
        paddingTop: 14,
        paddingHorizontal: 14,
    },
    bt: {
        marginTop: 16
    }
})
