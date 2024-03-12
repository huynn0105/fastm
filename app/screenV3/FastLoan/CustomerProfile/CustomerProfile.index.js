import { View, Text, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native';
import React, { createRef, memo } from 'react';
import { styles } from '../FastLoan.styles';
import AppText from '../../../componentV3/AppText';
import FormCaching from '../components/FormCaching';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SH, SW } from '../../../constants/styles';
import InputForm from '../common/InputForm';
import CheckBoxForm from '../common/CheckBoxForm';
import Colors from '../../../theme/Color';

const INPUT_KEYS = Array.from({ length: 20 }, (_, i) => `input${i}`);

const CustomerProfile = memo(({ projectId, stepId, onSubmit }) => {
  return (
    <View style={styles.page}>
      <AppText style={styles.stepTitle}>Bước 3: Thông tin khách hàng</AppText>
      <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }}>
        <View style={styles.boxContainer}>
          <AppText style={styles.formTitle}>Thông tin định danh</AppText>
          <FormCaching projectId={projectId} stepId={stepId} style={styles.formContainer}>
            {({
              handleChangeText,
              handleChangeTextAndCaching,
              handleBlur,
              values,
              lastKey,
              handleRef,
            }) => {
              return (
                <View>
                  <View style={styles.row}>
                    <InputForm
                      style={{ flex: 0.25 }}
                      ref={handleRef('firstName')}
                      onChangeText={handleChangeText('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values?.firstName}
                      placeholder={'Tên'}
                      title={'Tên'}
                      isRequire
                    />
                    <InputForm
                      style={{ flex: 0.25, marginHorizontal: SW(20) }}
                      ref={handleRef('lastName')}
                      onChangeText={handleChangeText('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values?.lastName}
                      placeholder={'Họ'}
                      title={'Họ'}
                      isRequire
                    />
                    <InputForm
                      style={{ flex: 0.5 }}
                      ref={handleRef('middleName')}
                      onChangeText={handleChangeText('middleName')}
                      onBlur={handleBlur('middleName')}
                      value={values?.middleName}
                      placeholder={'Tên lót'}
                      title={'Tên lót'}
                    />
                  </View>
                  <View style={[styles.row, { marginTop: SH(20) }]}>
                    <InputForm
                      style={{ flex: 0.5, marginRight: SW(20) }}
                      ref={handleRef('birthday')}
                      onChangeText={handleChangeTextAndCaching('birthday')}
                      value={values?.birthday}
                      title={'Ngày sinh'}
                      placeholder={'DD / MM / YYYY'}
                      type={'date'}
                      isRequire
                    />
                    <CheckBoxForm
                      style={{ flex: 0.5 }}
                      onValueChange={handleChangeTextAndCaching('gender')}
                      value={values.gender}
                      data={[
                        { label: 'Nam', value: '0' },
                        { label: 'Nữ', value: '1' },
                      ]}
                      title={'Giới tính'}
                      isRequire
                    />
                  </View>
                  <View style={[styles.row, { marginTop: SH(20) }]}>
                    <InputForm
                      style={{ flex: 0.5, marginRight: SW(20) }}
                      ref={handleRef('cccd')}
                      onChangeText={handleChangeText('cccd')}
                      onBlur={handleBlur('cccd')}
                      value={values?.cccd}
                      placeholder={'Số CMND/CCCD'}
                      title={'Số CMND/CCCD'}
                      isRequire
                      keyboardType={'numeric'}
                      maxLength={12}
                    />
                    <InputForm
                      style={{ flex: 0.5 }}
                      ref={handleRef('dateCCCD')}
                      onChangeText={handleChangeTextAndCaching('dateCCCD')}
                      onBlur={handleBlur('dateCCCD')}
                      value={values?.dateCCCD}
                      placeholder={'DD / MM / YYYY'}
                      title={'Ngày cấp'}
                      isRequire
                      type={'date'}
                    />
                  </View>
                  <InputForm
                    style={{ marginTop: SH(20) }}
                    ref={handleRef('issueCCCD')}
                    onChangeText={handleChangeText('issueCCCD')}
                    onBlur={handleBlur('issueCCCD')}
                    value={values?.issueCCCD}
                    title={'Nơi cấp'}
                    placeholder={'Nơi cấp'}
                    isRequire
                  />
                </View>
              );
            }}
          </FormCaching>
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          backgroundColor: Colors.primary2,
          width: '100%',
          paddingVertical: SH(20),
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
});

export default CustomerProfile;
