import React, {
    useEffect,
    useState,
    useCallback,
} from 'react'
import {
    View,
    Image,
    TouchableOpacity,
} from 'react-native'

import FastImage from 'react-native-fast-image';


import IdentifyCardImport from '../../../componentV3/IdentifyCardImport';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import AppText from '../../../componentV3/AppText';
import withCameraPicker from '../../../componentV3/HOCs/withCameraPicker';
import CameraOptions from '../../../constants/cameraObjKeys';


import styles from './styles';
import cameraObjKeys from '../../../constants/cameraObjKeys';

import {ICON_PATH, IMAGE_PATH} from '../../../assets/path';

const FormUpdateIdentityCard = ({
    cameraActionsProps,
    isProcessingORC,
    errorVerifyORC,
    idTypeProcess,
    previewImageProps,
    userMetaData,
    errorVerifyMessage,
    onSubmitUpdateCMND,
    tempCMND
}) => {

    // state
    const [frontCMNDUrl, setFrontCMNDUrl] = useState(null);
    const [backCMNDUrl, setBackCMNDUrl] = useState(null);

    const [imgSelfieUrl, setImgSelfieUrl] = useState(null);
    const [imgCerUrls, setImgCerUrls] = useState([]);

    const [errorFrontImg, setErrorFrontImg] = useState(false);
    const [errorBackImg, setErrorBackImg] = useState(false);

    const [errorMessFrontImg, setErrorMessFrontImg] = useState('');
    const [errorMessBackImg, setErrorMessBackImg] = useState('');

    const [errorNameCMND, setErrorNameCMND] = useState(false);


    const [citizenCardInfor, setCitizenCardInfor] = useState({});
    const [stateProcessing, setStateProcessing] = useState('INIT');


    useEffect(() => {
        setFrontCMNDUrl(tempCMND?.countryIdPhotoFront);
        setBackCMNDUrl(tempCMND?.countryIdPhotoBack);
        setImgSelfieUrl(tempCMND?.selfiePhotoWithIdNumber);
        setImgCerUrls(tempCMND?.countryIdCertificateOfChange || []);
        setStateProcessing(tempCMND?.countryIdStatus || 'INIT');
    }, [tempCMND])

    useEffect(() => {
        if(idTypeProcess === 'FRONT') {
            setErrorFrontImg(errorVerifyORC);
            setErrorMessFrontImg(errorVerifyMessage)
        }
        if(idTypeProcess === 'BACK') {
            setErrorBackImg(errorVerifyORC);
            setErrorMessBackImg(errorVerifyMessage)
        }
    }, [isProcessingORC, idTypeProcess, errorVerifyORC, errorVerifyMessage]);

    useEffect(() => {
       if(frontCMNDUrl && backCMNDUrl && !errorFrontImg && !errorBackImg && stateProcessing !== 'PENDING') {
         const newCountryIdName = citizenCardInfor?.countryIdName;
         const countryIdName = userMetaData?.countryIdName;
        if(newCountryIdName && countryIdName) {
            setErrorNameCMND(!(newCountryIdName === countryIdName));
        } else {
            setErrorNameCMND(true);
        }
       }
       if(!frontCMNDUrl || !backCMNDUrl) {
            setErrorNameCMND(false);
       }
    }, [frontCMNDUrl, backCMNDUrl, errorFrontImg, errorBackImg, citizenCardInfor, userMetaData]);

    const callbackCameraPicker = useCallback(
        (inforVerify, payload) => {
            if(payload) {
                const newPay = {...citizenCardInfor || {}, ...payload};
                setCitizenCardInfor(newPay);
            }
        },
        [citizenCardInfor],
    );

    
    const onPressImportImage = useCallback(
        (type) => {
            if(isProcessingORC) return;
            switch (type) {
                case 'FRONT': 
                    if(frontCMNDUrl) {
                        previewImageProps.setArrImagePreview(getArrImagePreview(type));
                        previewImageProps.onOpenPreviewImage();
                        return;
                    }
                    cameraActionsProps.onOpenCamera(
                        CameraOptions.frontCitizenCard,
                        (frontImgURL) => {
                            setFrontCMNDUrl(frontImgURL);
                            if(!backCMNDUrl) {
                                cameraActionsProps.onOpenCamera(
                                    CameraOptions.backCitizenCard,
                                    (backImgUrl) => {
                                        setBackCMNDUrl(backImgUrl);
                                        cameraActionsProps.processORCIdentify(
                                            {imgURL: frontImgURL, ...CameraOptions.frontCitizenCard},
                                            (inforVerifyFront, payloadFront) => {
                                                callbackCameraPicker(inforVerifyFront, payloadFront);
                                                cameraActionsProps.processORCIdentify(
                                                    {imgURL: backImgUrl, ...CameraOptions.backCitizenCard},
                                                    (inforVerifyBack, payloadBack) => {
                                                        callbackCameraPicker(inforVerifyBack, {...payloadFront, ...payloadBack});
                                                    }
                                                )
                                            },
                                        )
                                        
                                    }
                                )
                            } else {
                                cameraActionsProps.processORCIdentify(
                                    {imgURL: frontImgURL, ...CameraOptions.frontCitizenCard},
                                    (inforVerifyFront, payloadFront) => {
                                        callbackCameraPicker(inforVerifyFront, payloadFront);
                                    }
                                )
                            }
                        }
                    );
                    break;
                case 'BACK': 
                    if(backCMNDUrl) {
                        previewImageProps.setArrImagePreview(getArrImagePreview(type));
                        previewImageProps.onOpenPreviewImage();
                        return;
                    }
                    cameraActionsProps.onOpenCamera(
                        CameraOptions.backCitizenCard,
                        (backImgUrl) => {
                            setBackCMNDUrl(backImgUrl);
                            cameraActionsProps.processORCIdentify(
                                {imgURL: backImgUrl, ...CameraOptions.backCitizenCard},
                                (inforVerifyBack, payloadBack) => {
                                    callbackCameraPicker(inforVerifyBack, payloadBack);
                                },
                            )
                        }
                    );
                    break;
                default: 
                    break;
            }
        },
        [
            cameraActionsProps,
            isProcessingORC,
            frontCMNDUrl,
            backCMNDUrl,
            callbackCameraPicker,
            citizenCardInfor,
            getArrImagePreview
        ]
    );

    const getArrImagePreview = useCallback(
        (previewType) => {
            const arr = [];
            if(frontCMNDUrl) {
                arr.push(frontCMNDUrl)
            }
            if(backCMNDUrl) {
                arr.push(backCMNDUrl)
            }
            if(previewType === 'BACK') {
                arr.reverse();   
            }
            return arr;
        },
        [frontCMNDUrl, backCMNDUrl],
    )

    const onPressRemove = useCallback(
        (type) => {
            switch (type) {
                case 'FRONT':
                    setFrontCMNDUrl(null);
                    break;
                case 'BACK':
                    setBackCMNDUrl(null);
                    break;
                default:
                    break;
            }
        },
        [],
    )

    const onPressImageCer = useCallback(
        (imgItemCerUrl) => {
            if(imgCerUrls?.length > 0 && imgItemCerUrl) {
                previewImageProps.setArrImagePreview([imgItemCerUrl]);
                previewImageProps.onOpenPreviewImage();
                return;
            }
            cameraActionsProps.onOpenCamera({},
                (imgUrl) => {
                    if(imgUrl) {
                        const imgs = imgCerUrls.concat(imgUrl);
                        setImgCerUrls(imgs)
                    }
                }
            )
        },
        [imgCerUrls, previewImageProps],
    );

    const onPressRemoveImageCer = useCallback(
        (imgItemCerUrl) => {
            setImgCerUrls(imgCerUrls.filter(img => img !== imgItemCerUrl));
        },
        [imgCerUrls],
    );

    const onPressImageSelfie = useCallback(
        () => {
            if(imgSelfieUrl) {
                previewImageProps.setArrImagePreview([imgSelfieUrl]);
                previewImageProps.onOpenPreviewImage();
                return;
            }
            cameraActionsProps.onOpenCamera(cameraObjKeys.selfie,
                (imgsefUrl) => { setImgSelfieUrl(imgsefUrl)}
            )
        },
        [imgSelfieUrl],
    );

    const onPressRemoveImageSelfie = useCallback(
        () => {
            setImgSelfieUrl(null);
        },
        [],
    );

    
    const renderImageCer = useCallback(
        (imgItemCerUrl) => {
            return (
                <TouchableOpacity key={imgItemCerUrl} style={styles.touch} onPress={() => onPressImageCer(imgItemCerUrl)}>
                    {imgItemCerUrl ? (
                        <View style={styles.wapperCerImg}>
                            <FastImage
                                source={{ uri: imgItemCerUrl }}
                                style={styles.addImage}
                            />
                           {stateProcessing !== 'PENDING' && (
                           <TouchableOpacity style={styles.iconContainer} onPress={() => onPressRemoveImageCer(imgItemCerUrl)}>
                                <View>
                                    <Image
                                        source={ICON_PATH.delete2}
                                        style={styles.icon}
                                    />
                                </View>
                            </TouchableOpacity>)}
                        </View>
                    ) : (<Image
                        source={IMAGE_PATH.add_selfie}
                        style={styles.addImage}
                    />)}
                </TouchableOpacity> 
            )
        },
        [onPressImageCer, onPressRemoveImageCer, stateProcessing],
    );
    
    const onDisabled = useCallback(
        () => {
            return !frontCMNDUrl || !backCMNDUrl || imgCerUrls?.length <= 0 || !imgSelfieUrl || stateProcessing === 'PENDING' || errorNameCMND || errorBackImg || errorFrontImg;
        },
        [frontCMNDUrl, backCMNDUrl, imgCerUrls, imgSelfieUrl, stateProcessing, errorNameCMND, errorBackImg, errorFrontImg],
    )


    const onStaticSubmitUpdateCMND = useCallback(
        () => {
            if(onDisabled()) {
                return;
            }
            if(onSubmitUpdateCMND) {
                const payload = {
                    ...citizenCardInfor,
                    countryIdPhotoFront: frontCMNDUrl,
                    countryIdPhotoBack: backCMNDUrl,
                    selfiePhotoWithIdNumber: imgSelfieUrl,
                    countryIdCertificateOfChange: imgCerUrls,
                }
                onSubmitUpdateCMND(payload);
            }
        },
        [frontCMNDUrl, backCMNDUrl, imgCerUrls, imgSelfieUrl, onSubmitUpdateCMND, onDisabled, citizenCardInfor],
    );

    return (
        <View >
            <View style={styles.formWrapper}>
                <AppText style={styles.label1}>Hình chụp <AppText style={styles.bold}>giấy xác nhận thay đổi CMND</AppText></AppText>
                <AppText style={styles.desc}>(Được cấp bởi công an phường/ quận hoặc cơ quan có thẩm quyền)</AppText>
                <View style={styles.imgCerWrap}>
                    {imgCerUrls?.length > 0 && imgCerUrls.map(renderImageCer)}
                    {(imgCerUrls?.length < 3 && stateProcessing !== 'PENDING') && renderImageCer()}
                </View>
                <AppText style={styles.label1}>Hình chụp CMND/CCCD <AppText style={styles.bold}>muốn thay đổi</AppText></AppText>
                <View style={styles.identifyCardWrapper}>
                    <View style={styles.identifyCardContainer}>
                        <IdentifyCardImport
                            type="FRONT"
                            disabledRemove={stateProcessing === 'PENDING'}
                            isProcessing={isProcessingORC && idTypeProcess === 'FRONT'}
                            onPress={onPressImportImage}
                            sourceUrl={frontCMNDUrl}
                            onPressRemove={onPressRemove}
                            offset={12}
                        />
                        <IdentifyCardImport
                            type="BACK"
                            disabledRemove={stateProcessing === 'PENDING'}
                            isProcessing={isProcessingORC && idTypeProcess === 'BACK'}
                            onPress={onPressImportImage}
                            sourceUrl={backCMNDUrl}
                            onPressRemove={onPressRemove}
                            offset={12}
                        />
                    </View>
                    {errorFrontImg && (
                        <View style={styles.errorContainer}>
                            <Image source={ICON_PATH.warning} />
                            <AppText style={styles.indicatorError}>
                                {errorMessFrontImg || 'Hình chụp mặt trước CMND/ CCCD không đúng'}
                            </AppText>
                        </View>
                        )
                    }
                    {errorBackImg && (
                        <View style={styles.errorContainer}>
                            <Image source={ICON_PATH.warning} />
                            <AppText style={styles.indicatorError}>
                                {errorMessBackImg || 'Hình chụp mặt sau CMND/ CCCD không đúng'}
                            </AppText>
                        </View>
                        )
                    }
                    {errorNameCMND && (
                        <View style={styles.errorContainer}>
                            <Image source={ICON_PATH.warning} />
                            <AppText style={styles.indicatorError}>
                                Hình chụp CMND/ CCCD mới không khớp tên CMND/ CCCD hiện tại.
                            </AppText>
                        </View>
                        )
                    }
                </View>
                <AppText style={styles.label1}>Hình <AppText style={styles.bold}>chân dung cầm CMND/ CCCD</AppText></AppText>
                <AppText style={styles.desc}>(Hình chụp phải rõ gương mặt, không đội mũ và đeo kính)</AppText>
                <TouchableOpacity style={styles.touchSelfie} onPress={onPressImageSelfie}>
                    {imgSelfieUrl ? (
                    <View>
                        <FastImage
                            source={{ uri: imgSelfieUrl }}
                            style={styles.imgUrlSelfie}
                        />
                       {stateProcessing !== 'PENDING' && (
                        <TouchableOpacity style={styles.iconContainer} onPress={onPressRemoveImageSelfie}>
                                <View>
                                    <Image
                                        source={ICON_PATH.delete2}
                                        style={styles.icon}
                                    />
                                    </View>
                            </TouchableOpacity>)}
                    </View>
                    ) : (<Image
                        source={IMAGE_PATH.add_selfie}
                        style={styles.selfieImg}
                    />)}
                </TouchableOpacity>
            </View>
            <View style={styles.indicatorBottomContainer}>
                <AppText style={styles.wraningIndicator}>Lưu ý:</AppText>
                <AppText style={styles.descWraningIndicator}>
                    Nếu thông tin tự điền từ hình chụp trên không đúng, vui lòng thử chụp lại (chụp cận cảnh, rõ nét, hiển thị đủ 4 góc CMND)
                </AppText>
            </View>
            <View key="BOTTOM-BUTTON" style={styles.buttonWrapper}>
                <SubmitButton
                    disabled={onDisabled()}
                    onPress={onStaticSubmitUpdateCMND}
                    label={'Cập nhật'}
                />
            </View>
        </View>
    )
}


export default withCameraPicker(FormUpdateIdentityCard);