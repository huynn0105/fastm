import React, { useCallback } from 'react';
import { Text, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import styles from './ContractCollaborators.styles';

import SubmitButton from '../../componentV3/Button/SubmitButton';
import AppText from '../../componentV3/AppText';
// selector
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../redux/selectors/userSelector';
import { getAppInforSelector } from '../../redux/selectors/appInforSelector';

import { ICON_PATH } from '../../assets/path';

const ContractCollaborators = ({ navigation }) => {
  const appInfor = useSelectorShallow(getAppInforSelector);
  const myUser = useSelectorShallow(getMyuserSelector);

  const getUrl = useCallback(() => {
    if (!appInfor?.ctvUserMFastUrl || !myUser?.accessToken) return null;
    return `${appInfor?.ctvUserMFastUrl}?accessToken=${myUser?.accessToken}`;
  }, [appInfor, myUser]);

  const onSubmit = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Image source={ICON_PATH.shield2} style={styles.ic} />
        <AppText style={styles.indicatorTop}>Ký hợp đồng dịch vụ với MFast thành công</AppText>
      </View>
      <View style={styles.body}>
        {!!getUrl() && <WebView source={{ uri: getUrl() }} style={styles.webview} />}
      </View>
      <View style={styles.footer}>
        <SubmitButton label="Quay lại" onPress={onSubmit} />
      </View>
    </View>
  );
};

export default ContractCollaborators;
