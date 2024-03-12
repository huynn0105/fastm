import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';
import { SH } from '../../../constants/styles';

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    borderRadius: 28.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary1,
  },
  disabledContainer: {
    backgroundColor: '#c4c7d8',
  },
  label: {
    fontSize: 16,
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary5,
  },
  disabledLabel: {
    color: '#fff',
    opacity: 0.6,
  },
  loading: {
    marginLeft: 10,
  },
});

const SubmitButton = ({
  label,
  disabled,
  onPress,
  needDelay = true,
  isLoading = false,
  bgColor = Colors.primary2,
  customStyle,
  labelStyle,
  disableLabelStyle,
}) => {
  const [isDelay, setIsDelay] = useState(false);

  const staticPress = useCallback(() => {
    if (needDelay) {
      if (onPress && !isDelay) {
        setIsDelay(true);
        onPress();
        setTimeout(() => {
          setIsDelay(false);
        }, 2000);
      }
    } else {
      if (onPress) {
        onPress();
      }
    }
  }, [onPress, isDelay, needDelay]);

  return (
    <TouchableOpacity delayPressIn={1000} disabled={isLoading || disabled} onPress={staticPress}>
      <View
        style={[
          styles.container,
          bgColor && { backgroundColor: bgColor },
          disabled && styles.disabledContainer,
          customStyle,
        ]}
      >
        <AppText
          style={[
            styles.label,
            labelStyle,
            disabled && (disableLabelStyle ? disableLabelStyle : styles.disabledLabel),
          ]}
        >
          {label}
        </AppText>
        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SubmitButton;
