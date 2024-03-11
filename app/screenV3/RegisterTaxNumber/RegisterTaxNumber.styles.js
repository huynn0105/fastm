import { StyleSheet } from 'react-native';

import Colors from '../../theme/Color';
// import { SCREEN_WIDTH } from '../../utils/Utils';

export default StyleSheet.create({
    safaView: {
        flex: 1,
        backgroundColor: '#fff'
    },
    wrapper: {
        flex: 1,
        backgroundColor: Colors.neutral5,
    },
    formWrapper: {
        paddingHorizontal: 16,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 6,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.20,
        padding: 16,
    },
    btContainer: {
        marginHorizontal: 70,
        marginTop: 24,
        marginBottom: 250,
    }
});