import { StyleSheet } from 'react-native';

import Colors from '.././../../theme/Color';
import { SCREEN_WIDTH } from '../../../utils/Utils';
import TextStyles from '../../../theme/TextStyle';

export default StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.neutral5,
    },
    container: {
        flex: 1,
    },
    formWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#fff'
    },  
    genderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    labelGender: {
        opacity: 0.6,
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4,
        marginRight: 20,
    },
    textFieldContainerStyle: {
        flex: 0,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
    buttonWrapper: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: Colors.neutral5,
    },
    listContainer: {
        width: '100%',
        marginTop: -18,
        borderColor: Colors.primary2,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listDistrict: {
        maxHeight: SCREEN_WIDTH / 1.5,
        width: '100%'
    },
    itemContainer: {
        flex: 1,
        padding: 8
    },
    labelItem: {
        ...TextStyles.heading4,
        textAlign: 'center',
    },
    emptyContainer: {
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
    },
    emptyTxt: {
        ...TextStyles.normalTitle,
        opacity: 0.6
    },
    indicatorDistrictContainer: {
        position: 'absolute',
        right: 0,
        bottom: 14,
        width: 130,
    },
    indicatorDistrictTxt: {
        opacity: 0.4,
        fontSize: 13,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: Colors.primary4
    }
})
