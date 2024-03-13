import React, {
    useCallback,
    useRef,
    forwardRef,
    useState,
    useEffect
} from 'react'
import {
    Text,
    View,
    ScrollView,
    Image
} from 'react-native'

// components
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import OTPBox from '../../../componentV3/OTP/OTPBox';
import AppText from '../../../componentV3/AppText';

import styles from './EmailVerify.style';

import {ICON_PATH} from '../../../assets/path';

const EmailVerify = ({
        email,
        onResendOTP,
        submitVerifyOTP,
        timer,
        onPressPreviewInputEmail,
        onHandlerCountdownDone,
        errorMessageOTP,
        isVerifiedEmail,
        onHandlerNextStep
    }, ref) => {

    /* <------------------- State -------------------> */ 
    const [disabledButton, setDisabledButton] = useState(true);
    // const 
    /* <------------------- Ref -------------------> */ 
    const otpBoxRef = useRef(null);


    useEffect(() => {
        setDisabledButton(false);
    }, [isVerifiedEmail]);

    /* <------------------- Submit -------------------> */ 
    const onSubmit = useCallback(
        () => {
            const otpNumber = otpBoxRef?.current?.getFullNumberOTP();
            if(isVerifiedEmail && onHandlerNextStep) {
                onHandlerNextStep();
            }
            if(submitVerifyOTP && otpNumber) {
                submitVerifyOTP(otpNumber);
            }
        },
        [otpBoxRef, submitVerifyOTP, isVerifiedEmail],
    )

    const onChangeText = useCallback(
        (otpCode) => {
            setDisabledButton(otpCode?.length !== 4);
        },
        [],
    );

    const _onResendOTP = useCallback(
        () => {
            if(onResendOTP) {
                onResendOTP(email);
            }
        },
        [onResendOTP, email],
    )

    const _onPressPreviewInputEmail = useCallback(
        () => {
            if (onPressPreviewInputEmail) {
                onPressPreviewInputEmail();
            }
        },
        [onPressPreviewInputEmail],
    )

    const _onHandlerCountdownDone = useCallback(
        () => {
            if(onHandlerCountdownDone) {
                onHandlerCountdownDone();
            }
        },
        [onHandlerCountdownDone],
    )

    return (
        <ScrollView  style={styles.wrapper}>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    {isVerifiedEmail ? (
                        <View style={styles.successWrapper}>
                            <Image source={ICON_PATH.success} style={styles.icoSuccess}/>
                            <AppText style={styles.label}>{`Đã xác thực thành công email: ${email}`}</AppText>
                            <AppText style={styles.subLabel}>Bấm tiếp tục để hoàn tất định danh</AppText>
                        </View> ) : (
                        <OTPBox
                            ref={otpBoxRef}
                            timer={timer}
                            errorMessage={errorMessageOTP}
                            onSubmitVerifyOTP={onSubmit}
                            onHandlerCountdownDone={_onHandlerCountdownDone}
                            onResendOTP={_onResendOTP}
                            onChangeText={onChangeText}
                            onPressInput={_onPressPreviewInputEmail}
                            verifyInfor={{
                                by: 'Email',
                                to: email,
                            }}
                        />
                        )
                    }
                </View>
                <View style={styles.buttonWrapper}>
                    <SubmitButton
                        disabled={disabledButton}
                        label={!isVerifiedEmail ? "Xác thực Email" : "Tiếp tục"}
                        onPress={onSubmit}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default forwardRef(EmailVerify);