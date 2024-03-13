import React, { useCallback } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'

import Colors from '../../theme/Color';
import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const CheckBox = ({ isChecked, label, onPress, id }) => {
    const source= isChecked ? ICON_PATH.checkbox_ac : ICON_PATH.checkbox_un;
    const labelStyle = isChecked ? styles.lableChecked : styles.lable;

    const onPressSelect = useCallback(
        () => {
            if(onPress) {
                onPress(id);
            }
        },
        [id, onPress],
    )

    return (
        <TouchableOpacity onPress={onPressSelect}>
            <View style={styles.container}>
                <Image source={source} style={styles.ic} />
                <AppText style={labelStyle}>{label}</AppText>
            </View>
        </TouchableOpacity>
    )
}

export default CheckBox;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 9,
    },
    ic: {
        width: 24,
        height: 24,
        marginRight: 7,
    },
    lable: {
        flex: 1,
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        opacity: 0.8,
        lineHeight: 20,
        color: Colors.primary4
    },
    lableChecked: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: Colors.primary4
    },

})
