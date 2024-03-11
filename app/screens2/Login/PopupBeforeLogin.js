import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Image, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview';
import AppText from '../../componentV3/AppText';
const { width, height } = Dimensions.get('window');

import Colors from '../../theme/Color';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'rgb(235, 255, 230)',
        zIndex: 1000,
        overflow: 'hidden'
    },
    webView: {
        flex: 1,
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'rgb(235, 255, 230)',
    },
    indicatorContainer: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    img: {
        width: 32,
        height: 32,
        marginRight: 6,
    },  
    txtIndicator: {
        flex: 1,
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 0,
        color: Colors.primary4
    },
    button: {
        width: '100%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c4c7d8',
        borderRadius: 27,
        marginTop: 16,
    },
    checkButton: {
        backgroundColor: Colors.primary2
    },
    txtButton: {
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: Colors.primary5
    }
});

export class PopupBeforeLogin extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false
        }
    }

    onPressCheck = () => {
        const { isChecked } = this.state;
        this.setState({
            isChecked: !isChecked
        })
    }

    render() {
        const {
            onPressClose,
            onHandlerSubmit, 
            urlContent,
            onReadMoreTermPress,
            onReadMorePolicyPress
        } = this.props;
        const { isChecked } = this.state;
        const sourceCheck = isChecked ? require('./img/ic_check.png') : require('./img/ic_uncheck.png');
        return (
            <View style={styles.overlay}>
                <View style={{
                    flex: 1,
                    width: width - 32,
                    height: height - 100,
                    position: 'absolute',
                    zIndex: 10000,
                    borderRadius: 10,
                }}>
                    <View style={styles.wrapper}>
                        <WebView
                            style={styles.webView}
                            source={{ uri: urlContent }}
                        />
                        <TouchableWithoutFeedback onPress={this.onPressCheck}>
                            <View style={styles.indicatorContainer}>
                                <Image source={sourceCheck} style={styles.img}/>
                                <AppText style={styles.txtIndicator}>
                                {'Tôi đã đọc và đồng ý với các điều khoản trên, cùng với '}
                                <AppText
                                    style={{ color: Colors.primary2 }}
                                    onPress={onReadMoreTermPress}
                                >
                                    {' Điều khoản sử dụng '}
                                </AppText>
                                và 
                                <AppText
                                    style={{ color: Colors.primary2 }}
                                    onPress={onReadMorePolicyPress}
                                >
                                    {' Chính sách bảo mật.'}
                                </AppText>
                                </AppText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback disabled={!isChecked} onPress={onHandlerSubmit}>
                            <View style={[styles.button, isChecked && styles.checkButton]}>
                                <AppText style={[styles.txtButton, isChecked && styles.txtCheckButton]}>Tiếp tục</AppText>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onPressClose}>
                 <View style={{ flex: 1, width, height }} />
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

export default PopupBeforeLogin
