import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'

// import Colors from '../../../theme/Color';

const { width } = Dimensions.get('window');

import {ICON_PATH} from '../../../assets/path';

const MenuItemSeparator = ({ showIcon, disabled }) => {

    const getSouceIc = useCallback(
        () => {
            return disabled ? ICON_PATH.arrow_down_un : ICON_PATH.arrow_down_ac
        },
        [disabled],
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.leftSpace}>
               {showIcon && (<Image source={getSouceIc()} style={styles.ic}/>)}
            </View>
            <View style={styles.divider} />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 16,
        backgroundColor: '#fff',
    },
    leftSpace: {
        width: 58,
        alignItems: 'center',
        overflow: 'visible'
    },
    ic: {
        width: 10,
        height: 16,
    },
    divider: {
        height: 1,
        width: width - 74,
        opacity: 0.4,
        borderRadius: 100,
        backgroundColor: "#dcdcdc"
    }
})

export default MenuItemSeparator;
