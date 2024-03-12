import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import PopupLocation from '../../../componentV3/PopupLocation';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import AppText from '../../../componentV3/AppText';

// permissions
import {
  checkPermission,
  checkAndRequestPermission,
  PERMISSION_CHECK,
  PERMISSION_REQUEST_MESSAGE,
} from '../../../utils/permissionV3';

import Colors from '../../../theme/Color';

import styles from './ContractCollaborators.style';
import { ICON_PATH } from '../../../assets/path';

function ContractCollaborators({
  onFocus,
  countryIdNumber,
  ctvUserMFastUrl,
  accessToken,
  isCTVConfirmed,
  onHandlerNextStep,
  onRequestLocation,
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isVisibleRequestLocation, setIsVisibleRequestLocation] = useState(false);

  useEffect(() => {
    setIsConfirmed(!!isCTVConfirmed);
  }, [isCTVConfirmed]);

  const getUrl = useCallback(() => {
    if (!countryIdNumber || !ctvUserMFastUrl || !accessToken || !onFocus) return null;
    return `${ctvUserMFastUrl}?accessToken=${accessToken}`;
  }, [ctvUserMFastUrl, accessToken, countryIdNumber, onFocus]);

  const onPermissionLoaction = async () => {
    const isGranted = await checkPermission(PERMISSION_CHECK.LOCATION);
    return isGranted;
  };

  const onSubmit = useCallback(async () => {
    setIsVisibleRequestLocation(true);
    const graned = await onPermissionLoaction();
    if (!graned) {
      return;
    }
  }, [onPermissionLoaction]);

  const onPressConfirmed = useCallback(async () => {
    setIsConfirmed(!isConfirmed);
  }, [isConfirmed]);

  const onClosePopup = useCallback(() => {
    setIsVisibleRequestLocation(false);
  }, []);

  const onStaticRequestLocation = useCallback(async () => {
    setIsVisibleRequestLocation(false);
    const graned = await checkAndRequestPermission(
      PERMISSION_CHECK.LOCATION,
      PERMISSION_REQUEST_MESSAGE.LOCATION,
    );
    if (!graned) {
      return;
    }
    setTimeout(() => {
      if (onHandlerNextStep && onRequestLocation) {
        onRequestLocation();
        onHandlerNextStep();
      }
    }, 500);
  }, [onRequestLocation, onHandlerNextStep]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {!!getUrl() ? (
          <WebView source={{ uri: getUrl() }} style={styles.webview} />
        ) : (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Colors.primary2} />
          </View>
        )}
      </View>
      <TouchableOpacity disabled={isCTVConfirmed} onPress={onPressConfirmed}>
        <View style={styles.checkContainer}>
          <Image
            source={isConfirmed ? ICON_PATH.checkbox_ac : ICON_PATH.checkbox_round}
            style={styles.imgCheck}
          />
          <AppText style={!isConfirmed ? styles.txtCheck : styles.txtChecked}>
            Tôi đồng ý với các điều khoản trên
          </AppText>
        </View>
      </TouchableOpacity>
      <SubmitButton disabled={!isConfirmed} onPress={onSubmit} label={'Tiếp tục'} />
      <PopupLocation
        isVisible={isVisibleRequestLocation}
        onClose={onClosePopup}
        onRequestLocation={onStaticRequestLocation}
      />
    </View>
  );
}

export default ContractCollaborators;
