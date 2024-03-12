import { StyleSheet } from 'react-native';

import Colors from '../../theme/Color';
// import { SCREEN_WIDTH } from  '../../utils/Utils';

export default StyleSheet.create({
    safaView: {
        flex: 1,
        backgroundColor: Colors.neutral5
    },
    wrapper: {
        flex: 1,
        backgroundColor: Colors.neutral5,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ic: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    indicatorTop: {
        flex: 1,
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary1   
    },
    body: {
        flex: 1,
        height: '100%',
        margin: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.neutral4
    },
    footer: {
        paddingHorizontal: 16,
        marginBottom: 40,
    },
    webview: {
        flex: 1,
        borderRadius: 10
    }
});
