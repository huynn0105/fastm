import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Colors from '../../../theme/Color';

import CustomTextField from '../../../componentV3/CustomTextField';
import WrapperCustomTextField from '../../../componentV3/WrapperCustomTextField';

const FormInput = ({ inputs, data, onPressPickerSelect, onChangeText }) => {
    const onStaticPressPickerSelect = useCallback(
        (item) => {
            if(onPressPickerSelect) {
                onPressPickerSelect(item);
            }
        },
        [onPressPickerSelect],
    );


    const onStaticChangeText = useCallback(
        (value, item) => {
            if(onChangeText) {
                onChangeText(value, item);
            }
        },
        [onChangeText],
    );

    const renderInput = useCallback(
        (item) => {
            if(item.typeInput === 'PICKER') {
                return (
                        <WrapperCustomTextField
                            key={item?.id}
                            autoCapitalize={'words'}
                            textFieldLabel={item?.label || '---'}
                            showError={false}
                            textFieldValue={data?.[item?.key]?.value || ''}
                            returnKeyType="next"
                            errorMessage={item?.errorMessage || 'Không được để trống.'}
                            textFieldContainerStyle={styles.textFieldContainerStyle}
                            containerStyle={{ marginBottom: 10 }}
                            onPress={() => onStaticPressPickerSelect(item)}
                        />
                )
            }
            return (
                <CustomTextField
                    key={item?.id}
                    autoCapitalize={'words'}
                    textFieldLabel={item?.label || '---'}
                    showError={false}
                    textFieldValue={data?.[item?.key] || ''}
                    keyboardType={item?.keyboardType}
                    returnKeyType="next"
                    errorMessage={item?.errorMessage || 'Không được để trống.'}
                    textFieldContainerStyle={styles.textFieldContainerStyle}
                    containerStyle={{ marginBottom: 10 }}
                    onChangeTextFieldText={(value) => onStaticChangeText(value, item)}
                />
            )
        },
        [data, onStaticPressPickerSelect],
    );

    return (
        <View>
           {inputs.map(renderInput)}
        </View>
    )
}

export default FormInput

const styles = StyleSheet.create({
    textFieldContainerStyle: {
        flex: 0,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.primary4
    },
})
