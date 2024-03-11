import { Dimensions, Platform } from 'react-native';

const isIphone12 = () => {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        ((dimen.height === 812 || dimen.width === 812)
          || (dimen.height === 844 || dimen.width === 844)
          || (dimen.height === 926 || dimen.width === 926))
    );
}

export default isIphone12;