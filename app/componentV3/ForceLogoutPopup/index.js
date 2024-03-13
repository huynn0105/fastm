import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import { useActions } from '../../hooks/useActions';
import { logout } from '../../redux/actions/user';
import Colors from '../../theme/Color';
import AppText from '../AppText';

const ForceLogoutPopup = ({ params, onLogoutSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const actions = useActions({
    logout,
  });
  const logoutFunction = () => {
    setIsLoading(true);
    const onSuccess = () => {
      setIsLoading(false);
      onLogoutSuccess();
    };
    const onError = () => {
      setIsLoading(false);
      onLogoutSuccess();
    };
    actions.logout(false, onSuccess, onError);
  };
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
      }}
    >
      <View style={{ marginTop: SH(16) }}>
        <Image
          source={ICON_PATH.iconBell}
          style={{ width: SW(56), height: SH(56), resizeMode: 'contain' }}
        />
      </View>
      <View style={{ marginTop: SH(20), paddingHorizontal: SW(16) }}>
        <AppText style={styles.bigTextStyle}>Tài khoản vừa được đăng nhập bởi 1 người khác</AppText>
      </View>
      <View style={{ marginTop: SH(12), marginBottom: SH(24), paddingHorizontal: SW(16) }}>
        <AppText style={styles.textStyle}>
          Vui lòng đăng nhập lại để tiếp tục sử dụng. Cần hỗ trợ vui lòng gọi tới hotline:
          <AppText semiBold style={{ color: Colors.primary2 }}>
            {` 0899.909.789 `}
          </AppText>
          để được giải đáp
        </AppText>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: '#e6ebff',
          height: SH(50),
          width: '100%',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={isLoading}
        onPress={logoutFunction}
      >
        {!isLoading ? (
          <AppText semiBold style={[styles.textStyle, { color: Colors.primary2 }]}>
            Về trang đăng nhập
          </AppText>
        ) : (
          <ActivityIndicator size={'small'} color={Colors.primary2} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bigTextStyle: {
    fontSize: SH(16),
    lineHeight: SH(22),
    color: Colors.secondOrange,
  },
  textStyle: {
    fontSize: SH(14),
    lineHeight: SH(20),
    color: Colors.gray2,
  },
});

export default ForceLogoutPopup;
