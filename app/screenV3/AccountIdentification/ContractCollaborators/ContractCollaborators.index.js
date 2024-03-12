import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import PopupLocation from '../../../componentV3/PopupLocation';
import SubmitButton from '../../../componentV3/Button/SubmitButton';
import AppText from '../../../componentV3/AppText';

import {
  checkAndRequestPermission,
  checkPermission,
  PERMISSION_CHECK,
} from '../../../utils/permissionV3';

import Colors from '../../../theme/Color';

import styles from './ContractCollaborators.style';
import { ICON_PATH } from '../../../assets/path';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkTrackingAgentPermissions } from '../../../utils/dataTrackingAgennt';
import { logEventAgent } from '../../../tracking/Firebase';
import { checkAndRequestPermissionLocation } from '../../../utils/LocationUtil';
import strings from '../../../constants/strings';

function ContractCollaborators({
  onFocus,
  countryIdNumber,
  ctvUserMFastUrl,
  accessToken,
  isCTVConfirmed,
  onHandlerNextStep,
  onRequestLocation,
  myUser,
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

  const onSubmit = useCallback(async () => {
    // const isTrackingPermission = await checkTrackingAgentPermissions();
    // if (!isTrackingPermission) {
    //   return;
    // }
    // logEventAgent({ mobilephone: myUser?.mPhoneNumber });
    setIsVisibleRequestLocation(true);
  }, [myUser?.mPhoneNumber]);

  const onPressConfirmed = useCallback(async () => {
    setIsConfirmed(!isConfirmed);
  }, [isConfirmed]);

  const onClosePopup = useCallback(() => {
    setIsVisibleRequestLocation(false);
  }, []);

  const onStaticRequestLocation = useCallback(async () => {
    setIsVisibleRequestLocation(false);
    const granted = await checkAndRequestPermission(
      PERMISSION_CHECK.LOCATION,
      strings.location_access_error,
    );
    if (!granted) return;
    checkAndRequestPermissionLocation((location) => {
      if (location === null) {
        return;
      }
      if (onHandlerNextStep && onRequestLocation) {
        onRequestLocation(location);
        onHandlerNextStep();
      }
    });
  }, [onRequestLocation, onHandlerNextStep]);

  return (
    <SafeAreaView style={styles.wrapper} edges={['left', 'right', 'bottom']} key={'4'}>
      <View style={styles.container}>
        {getUrl() ? (
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
    </SafeAreaView>
  );
}

export default ContractCollaborators;
