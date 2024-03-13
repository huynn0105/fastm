import React, { useCallback, useState, useEffect } from 'react'
import { Text, View, SectionList, Alert } from 'react-native'

import isEmpty from 'lodash/isEmpty';
// components
import BoxCitizenIdentify from '../../componentV3/BoxCitizenIdentify';
import SectionHeader from './comps/SectionHeader';
import SubmitButton from '../../componentV3/Button/SubmitButton';
import FormInput from './comps/FormInput';
import PickerSelector from '../../componentV3/PickerSelector';
import LoadingModal from '../../componentV3/LoadingModal';

// actions
import {useActions} from '../../hooks/useActions';
import { getUserMetaData } from '../../redux/actions/actionsV3/userMetaData';

// selectors
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getUserMetaDataSelector } from '../../redux/selectors/userMetaDataSelectors';

import { SECTION_LIST, key, initPayload } from './RegisterTaxNumber.constants';

// styles
import styles from './RegisterTaxNumber.styles';
import Colors from '../../theme/Color';

// network
import DigitelClient from '../../network/DigitelClient';

const RegisterTaxNumber = ({ navigation }) => {

    useEffect(() => {
        getListProvince();
    }, [getListProvince]);

    const userMetaData = useSelectorShallow(getUserMetaDataSelector);

    // actions
    const actions = useActions({ getUserMetaData });

    const [pload, setPload] = useState({...initPayload, email: userMetaData?.email, mobilePhone: userMetaData?.mobilePhone});
    // 
    const [isVisiblePicker, setIsVisiblePicker] = useState(false);
    const [titlePopup, setTitlePopup] = useState(false);
    const [dataPicker, setDataPicker] = useState([]);
    const [disabledBtn, setDisabledBtn] = useState(true);

    const [provinces, setProvinces] = useState([]);
    const [loading, setIsLoading] = useState([]);

    const [currentSelectedInput, setCurrentSelectedInput] = useState(null);


    useEffect(() => {
        pload[key.email] = userMetaData?.email;
        pload[key.mobilePhone] = userMetaData?.mobilePhone;
        setPload({...pload});
    }, [userMetaData])

    useEffect(() => {
        const arr = Object.values(pload);
        const isValid = arr.every(value => !isEmpty(value));
        setDisabledBtn(!isValid);
    }, [pload]);

    const keyExtractor = useCallback(
        (item, index) => item?.id || index,
        [],
    );


    const onSubmitTaxRegister = useCallback(
        async () => {
            setIsLoading(true);
            const prePLoad = {...pload};
            prePLoad.homeProvince = pload.homeProvince.value;
            prePLoad.homeDistrict = pload.homeDistrict.value;
            prePLoad.homeWard = pload.homeWard.value;
            prePLoad.currentProvince = pload.currentProvince.value;
            prePLoad.currentDistrict = pload.currentDistrict.value;
            prePLoad.currentWard = pload.currentWard.value;
            const res = await DigitelClient.postTaxRegister(prePLoad);
            setIsLoading(false);
            if(res.status) {
                actions.getUserMetaData();
            }
            setTimeout(() => {
                if(res.status) {
                    Alert.alert(
                        "Yêu cầu đăng ký MST",
                        "Yêu cầu của bạn đã được ghi nhận thành công.",
                        [
                          {
                            text: "Trở về",
                            onPress: () => { navigation.goBack() },
                            style: "cancel"
                          },
                        ]
                      );
                  
                } else {
                    Alert.alert(
                        "Yêu cầu đăng ký MST",
                        res.message || "Hệ thống đang bận, vui lòng thử lại.",
                        [
                          {
                            text: "Đóng",
                            onPress: () => {},
                            style: "cancel"
                          },
                        ]
                      );
                } 
            }, 400);
            
        },
        [pload, navigation, actions],
    )

    const getListProvince = useCallback(
        async (code) => {
            const res = await DigitelClient.getListArea({ type: 'province' });
            const data = res?.data || [];
            setProvinces(data);
            return data;
        },
        [],
    )

    const getListDistrict = useCallback(
        async (code) => {
            const res = await DigitelClient.getListArea({ type: 'district', code });
            const data = res?.data || [];
            return data;  
        },
        [],
    )

    const getListWarn = useCallback(
        async (code) => {
            const res = await DigitelClient.getListArea({ type: 'ward', code });
            const data = res?.data || [];
            return data;
        },
        [],
    )

    const renderSectionHeader =  useCallback(
        ({ section }) => {
            switch (section?.id) {
                case 'COUNTRYID_INFOR':
                    return (
                       <BoxCitizenIdentify
                            key="BoxCitizenIdentify"
                            gender={userMetaData?.gender === 'male' ? 'Nam' : 'Nữ'}
                            countryIdDateOfBirth={userMetaData?.countryIdDateOfBirth}
                            countryIdNumber={userMetaData?.countryIdNumber}
                            countryIdName={userMetaData?.countryIdName}
                            countryIdIssuedDate={userMetaData?.countryIdIssuedDate}
                            countryIdIssuedBy={userMetaData?.countryIdIssuedBy}
                        />
                    )
                case 'BUTTON_SUBMIT': 
                    return  (
                        <View style={styles.btContainer}>
                            <SubmitButton
                                disabled={disabledBtn}
                                bgColor={Colors.primary2}
                                label={"Yêu cầu đăng ký MST"}
                                onPress={onSubmitTaxRegister}
                            />
                        </View> 
                    )           
                default:
                    return (
                        <SectionHeader
                            preTitle={section?.preTitle}
                            boldTitle={section?.boldTitle}
                        />
                    )
            }  
        },
        [userMetaData, disabledBtn, onSubmitTaxRegister],
    );

    const renderItem = useCallback(
        ({ item, index, section }) =>{
            return <View style={styles.formWrapper}>
                    <View style={styles.formContainer}>
                        <FormInput
                            inputs={item}
                            data={pload}
                            onChangeText={onChangeText}
                            onPressPickerSelect={onPressPickerSelect}
                        />
                    </View>
                </View>
        },
        [pload, onPressPickerSelect],
    );

    const onChangeText = useCallback(
        (value, item) => {
            pload[item?.key] = value;
            setPload({...pload});
        },
        [pload],
    );

    const onPressPickerSelect = useCallback(
        async (item) => {
            let code = null;
            if(item?.key === key.homeDistrict) {
                if(!pload.homeProvince) {
                    return;
                }
                code = pload.homeProvince.id;
            }
            if(item?.key === key.homeWard) {
                if(!pload.homeDistrict) {
                    return;
                }
                code = pload.homeDistrict.id;
            }
            if(item?.key === key.currentDistrict) {
                if(!pload.currentProvince) {
                    return;
                }
                code = pload.currentProvince.id;
            }
            if(item?.key === key.currentWard) {
                if(!pload.currentDistrict) {
                    return;
                }
                code = pload.currentDistrict.id;
            }
            setCurrentSelectedInput(item);
            setTitlePopup(item?.label);
            setIsVisiblePicker(true);
            let data = [];
            switch (item?.id) {
                case 'province':
                    if(provinces?.length > 0) {
                       data = provinces;
                    } else {
                        data = await getListProvince();
                    }
                    break;
                case 'district':
                    data = await getListDistrict(code);
                    break;
                case 'ward':
                    data = await getListWarn(code);
                    break;
                default:
                    break;
            }
            setDataPicker(data);
        },
        [getListProvince, getListDistrict, getListWarn, pload, provinces],
    );

    const onPressItemPicker = useCallback(
        (item) => {
            if(item) {
                handlerLogicSaveValue(item);
            }
            setIsVisiblePicker(false);
        },
        [handlerLogicSaveValue, currentSelectedInput],
    );

    const handlerLogicSaveValue = useCallback(
        (item) => {
            if(item && currentSelectedInput) {
                if(currentSelectedInput.key === key.homeProvince && pload[key.homeProvince] && item.id !== pload[key.homeProvince]?.id) {
                    pload[key.homeWard] = null;
                    pload[key.homeDistrict] = null;
                }
                if(currentSelectedInput.key === key.homeDistrict && pload[key.homeDistrict] && item.id !== pload[key.homeDistrict]?.id) {
                    pload[key.homeWard] = null;
                }
                if(currentSelectedInput.key === key.currentProvince && pload[key.currentProvince] && item.id !== pload[key.currentProvince]?.id) {
                    pload[key.currentDistrict] = null;
                    pload[key.currentWard] = null;
                }
                if(currentSelectedInput.key === key.currentDistrict && pload[key.currentDistrict] && item.id !== pload[key.currentDistrict]?.id) {
                    pload[key.currentWard] = null;
                }
                pload[currentSelectedInput?.key] = item;
                setPload({...pload});
            }
        },
        [currentSelectedInput, pload],
    );


    const onClosePicker = useCallback(
        () => {
            setIsVisiblePicker(false);
        },
        [],
    );

    return (
        <View style={styles.wrapper}>
            <SectionList
                scrollIndicatorInsets={{ right: 0.5 }}
                sections={SECTION_LIST}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={renderSectionHeader}
            />
            <PickerSelector
                title={titlePopup || ' '}
                data={dataPicker}
                onPressItem={onPressItemPicker}
                onCloseModal={onClosePicker}
                isVisible={isVisiblePicker}
            />
            <LoadingModal visible={loading} />
        </View>
    )
}

export default RegisterTaxNumber;