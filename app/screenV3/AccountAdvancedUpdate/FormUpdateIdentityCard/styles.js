import { StyleSheet } from 'react-native';

import Colors from '../../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';

const sizeImageCer = ((SCREEN_WIDTH - 64) - (24 * 3)) / 3;

export default StyleSheet.create({
    formWrapper: {
        margin: 16,
        padding: 16,
        borderRadius: 6,
        backgroundColor: Colors.neutral5
    },
    identifyCardWrapper: {
        marginTop: 12,
        marginBottom: 8,
    },
    identifyCardContainer: {
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label1: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    bold: {
        fontWeight: 'bold',
    },
    label: {
        opacity: 0.8,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    touch: {
        marginTop: 12,
        marginBottom: 20,
        width: sizeImageCer,
        height: sizeImageCer,
        borderRadius: 8,
        marginRight: 24,
    },
    wapperCerImg: {
        width: sizeImageCer,
        height: sizeImageCer,
        borderRadius: 8,
    },
    addImage: {
        width: sizeImageCer,
        height: sizeImageCer,
        borderRadius: 8,
    },
    desc: {
        flex: 1,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "italic",
        lineHeight: 16,
        letterSpacing: 0,
        color: Colors.accent2
    },
    selfieImg: {
        width: SCREEN_WIDTH - 64,
        height: ((SCREEN_WIDTH - 64) * 212) / 313,
        borderRadius: 8,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    indicatorError: {
        flex: 1,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        lineHeight: 18,
        marginLeft: 6,
        color: Colors.accent3
    },
    indicatorBottomContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    wraningIndicator: {
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: Colors.accent3,
        marginRight: 10
    },
    descWraningIndicator: {
        flex: 1,
        opacity: 0.8,
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 18,
        letterSpacing: 0,
        color: Colors.primary4
    },
    buttonWrapper: {
        paddingHorizontal: 16,
        marginTop: 14,
        marginBottom: 60,
    },
    iconContainer: {
        position: 'absolute',
        right: -12,
        top: -12,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchSelfie: {
        marginTop: 12,
    },
    imgCerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imgUrlSelfie: {
        width: SCREEN_WIDTH - 64,
        height: ((SCREEN_WIDTH - 64) * 4) / 3.2,
        borderRadius: 10,
    }
})