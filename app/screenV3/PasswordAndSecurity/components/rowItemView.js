import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Switch } from 'react-native';
// import {  } from 'react-native-switch';

import { SH, SW } from '../../../constants/styles';
import { icons } from '../../../img';
import AppText from '../../../componentV3/AppText';

import styles from '../PasswordAndSecurity.styles';
import Colors from '../../../theme/Color';

const RowItemView = ({
  icon,
  title,
  description,
  onPress,
  containerStyle,
  haveSwitch,
  childComponent,
  isOn,
  onChangeValueSwitch,
  isDisable,
  titleStyle,
  iconStyle,
}) => {
  return (
    <View>
      <View
        style={[
          styles.container,
          containerStyle,
          {},
          // { backgroundColor: isDisable ? 'red' : 'transparent' },
        ]}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: SH(14),
            width: SW(24),
            marginHorizontal: SW(16),
          }}
        >
          {icon ? <Image source={icon} style={[styles.iconStyle, iconStyle]} /> : null}
        </View>
        <TouchableOpacity
          disabled={!onPress || typeof onPress !== 'function' || isDisable}
          onPress={onPress && typeof onPress === 'function' ? onPress : () => {}}
          style={{
            flexDirection: 'row',
            flex: 1,

            borderBottomColor: childComponent ? '#dcdcdc' : 'transparent',
            borderBottomWidth: childComponent ? 1 : 0,
          }}
        >
          <View style={{ paddingVertical: SH(14), flex: 0.8 }}>
            <AppText
              // medium
              style={[styles.titleStyle, { opacity: isDisable ? 0.3 : 1 }, titleStyle]}
            >
              {title}
            </AppText>
            {description ? (
              <View style={{ marginTop: 4 }}>
                <AppText style={styles.descriptionStyle}>{description}</AppText>
              </View>
            ) : null}
          </View>
          <View style={{ flex: 0.2 }}>
            {!haveSwitch ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  source={icons.arrowRight}
                  style={{
                    tintColor: Colors.primary2,
                  }}
                />
              </View>
            ) : (
              <View style={{ flex: 1, marginTop: SH(16), marginRight: SH(16) }}>
                <Switch
                  disabled={isDisable}
                  style={{ height: SH(26), width: SW(26) }}
                  value={isOn}
                  onValueChange={onChangeValueSwitch}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {childComponent ? <View style={{}}>{childComponent}</View> : null}
    </View>
  );
};

export default RowItemView;
