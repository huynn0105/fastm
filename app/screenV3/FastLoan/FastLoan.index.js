import { Platform, ScrollView, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { styles } from './FastLoan.styles';
import { useState } from 'react';
import {
  INDICATOR_STYLES,
  STEP_STATUS,
} from '../AccountIdentification/AccountIdentification.contants';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../theme/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppText from '../../componentV3/AppText';
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import { SCREEN_WIDTH } from '../../utils/Utils';
import { KEY_PAGE } from './FastLoan.contants';
import CustomerProfile from './CustomerProfile/CustomerProfile.index';

const FastLoan = memo((props) => {
  const navParams = props.navigation.state.params || {};

  const pageRef = useRef();

  const [currentStep, setCurrentStep] = useState(0);

  const renderStepIndicator = useCallback((params) => {
    let bGColor = ['rgb(40, 158, 255)', 'rgb(0, 91, 243)'];
    let colorLabel = { color: Colors.primary5 };
    if (params?.stepStatus === STEP_STATUS.unfinished) {
      bGColor = [Colors.neutral4, Colors.neutral4];
      colorLabel = { color: Colors.primary3 };
    }
    return (
      <LinearGradient
        colors={bGColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.linearGradient}
      >
        <View style={styles.stepIndicatorContainer}>
          {params?.stepStatus === STEP_STATUS.finished ? (
            <MaterialIcons name="check" size={16} color={'#fff'} />
          ) : (
            <AppText style={[styles.txtLabelIndicator, colorLabel]}>
              {(params?.position || 0) + 1}
            </AppText>
          )}
        </View>
      </LinearGradient>
    );
  }, []);

  const onNextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < 3) {
        const next = prev + 1;
        pageRef?.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });

        return next;
      }
      return prev;
    });
  }, []);

  const renderPage = useCallback(
    (key) => {
      switch (key) {
        case KEY_PAGE.CHECK_PROFILE:
          return (
            <CustomerProfile
              projectId={navParams.projectId}
              stepId={currentStep === 0 ? 1 : null}
              onSubmit={onNextStep}
            />
          );
        case KEY_PAGE.KYC:
          return (
            <CustomerProfile
              projectId={navParams.projectId}
              stepId={currentStep === 1 ? 2 : null}
              onSubmit={onNextStep}
            />
          );
        case KEY_PAGE.CUSTOMER_PROFILE:
          return (
            <CustomerProfile
              projectId={navParams.projectId}
              stepId={currentStep === 2 ? 3 : null}
              onSubmit={onNextStep}
            />
          );
        case KEY_PAGE.OTHER_PROFILE:
          return (
            <CustomerProfile
              projectId={navParams.projectId}
              stepId={currentStep === 3 ? 4 : null}
              onSubmit={onNextStep}
            />
          );
      }
    },
    [currentStep, navParams.projectId, onNextStep],
  );

  const renderPages = useCallback(() => {
    return (
      <ScrollView
        ref={pageRef}
        scrollEnabled={false}
        pagingEnabled
        style={styles.pageContainer}
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {Object.values(KEY_PAGE).map(renderPage)}
      </ScrollView>
    );
  }, [renderPage]);

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        <StepIndicator
          currentPosition={currentStep}
          customStyles={INDICATOR_STYLES}
          renderStepIndicator={renderStepIndicator}
          stepCount={4}
        />
      </View>
      {renderPages()}
    </View>
  );
});

export default FastLoan;
