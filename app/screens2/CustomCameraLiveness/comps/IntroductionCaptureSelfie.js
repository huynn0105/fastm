import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import AppText from '../../../componentV3/AppText';
import { SH, SW } from '../../../constants/styles';
import Colors from '../../../theme/Color';
import LottieView from 'lottie-react-native';
import { ICON_PATH } from '../../../assets/path';

const IntroductionCaptureSelfie = ({ time, isRecording = false }) => {
  const [textIntroduce, setTextIntroduce] = useState('Giữ gương mặt nhìn thẳng');
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isRecording) {
        time = time - 1;
      }
      if (time === 4) {
        setTextIntroduce('Nghiêng mặt sang phải');
      }
      if (time === 2) {
        setTextIntroduce('Nghiêng mặt sang trái');
      }
      if (time === 0) {
        clearInterval(intervalId);
      }
    }, 1000);
    // setText();
    return () =>
      //   setText();
      clearInterval(intervalId);
  }, [time, isRecording]);
  return (
    <View style={styles.paddingTop}>
      {isRecording ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <LottieView
            source={ICON_PATH.introduceFace}
            autoPlay
            loop
            style={{ width: SW(32), height: SH(32) }}
          />
          <View style={{ marginLeft: SW(8) }}>
            <AppText style={styles.textStyle}>{textIntroduce}</AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.secondGreen,
  },
  paddingTop: {
    marginTop: SH(18),
    justifyContent: 'center',
  },
});

export default IntroductionCaptureSelfie;
