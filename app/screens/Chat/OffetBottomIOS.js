import React, { PureComponent } from 'react'
import { View, Dimensions, Platform } from 'react-native'
 
function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 780 || dimen.width === 780)
          || (dimen.height === 812 || dimen.width === 812)
          || (dimen.height === 844 || dimen.width === 844)
          || (dimen.height === 896 || dimen.width === 896)
          || (dimen.height === 926 || dimen.width === 926))
    );
}

const HEIGHT = isIphoneX() ? 20 : 0;

export class OffetBottomIOS extends PureComponent {
    render() {
        return (
            <View style={{ height: HEIGHT  }} />
        )
    }
}

export default OffetBottomIOS