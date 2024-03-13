import { stubObject } from 'lodash';
import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'

import Colors from '../../theme/Color';
import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';

const IndicatorBoxStatus = ({ status = 'INIT', message }) => {
    if(status === 'INIT') {
        return (<View />)
    }

    const getIcon = useCallback(
        () => {
            if(status === 'PENDING') {
                return ICON_PATH.pending
            }
            return ICON_PATH.failure
        },
        [status],
    );

    const getStyleContainer = useCallback(
        () => {
            if(status === 'PENDING') {
                return styles.pendding;
            }
            return styles.failure
        },
        [status],
    );


    const getStyleLabel = useCallback(
        () => {
            if(status === 'PENDING') {
                return [styles.desc, styles.colorPeding]
            }
            return [styles.desc, styles.colorFailure]
        },
        [status],
    );

    const getStyleStatusLabel = useCallback(
        () => {
            if(status === 'PENDING') {
                return [styles.status, styles.colorPeding]
            }
            return [styles.status, styles.colorFailure]
        },
        [status],
    );


    const getStatusLabel = useCallback(
        () => {
            if(status === 'PENDING') {
                return 'Chờ duyệt';
            }
            return 'Thất bại';
        },
        [status],
    );

    return (
        <View style={getStyleContainer()}>
            <View style={styles.row}>
                <AppText style={styles.label}>Kết quả duyệt</AppText>
                <View style={styles.row}>
                    <Image style={styles.ic} source={getIcon()} />
                    <AppText style={getStyleStatusLabel()}>{getStatusLabel()}</AppText>
                </View>
            </View>
            {!!message && <AppText style={getStyleLabel()}>{message || ''}</AppText>}
        </View>
    )
}

export default IndicatorBoxStatus;

const styles = StyleSheet.create({
    success: {
        borderRadius: 6,
        backgroundColor: "#d3ffe4",
        padding: 12,
    },
    failure: {
        borderRadius: 6,
        backgroundColor: "#ffe1e5",
        padding: 12,
    },
    pendding: {
        borderRadius: 6,
        backgroundColor: "#ffeee0",
        padding: 12,
    },
    colorFailure: {
        color: Colors.accent3
    },
    colorSuccess: {
        color: Colors.accent1
    },
    colorPeding: {
        color: Colors.accent2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        opacity: 0.6,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    status: {
        fontSize: 13,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: Colors.accent1
    },
    desc: {
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.accent1,
        marginTop: 11
    },
    ic: {
        width: 20,
        height: 20,
        marginRight: 4,
    },
})
