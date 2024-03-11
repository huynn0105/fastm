import React, { memo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AppText from '../../../componentV3/AppText';
import commonStyle, { SH, SW } from '../../../constants/styles';
import { hardFixUrlAvatar } from '../../../redux/actions/user';
import Colors from '../../../theme/Color';
import { styles } from '../RSMPushMessage.style';

const ViewModalDelete = memo(({ userDelete, onDelete, onCancel }) => {
  return (
    <View style={{ backgroundColor: Colors.primary5, borderRadius: 16 }}>
      <View style={{ paddingHorizontal: SW(16), alignItems: 'center', paddingVertical: SH(22) }}>
        {userDelete?.avatarImage?.length > 0 ? (
          <FastImage
            source={{ uri: hardFixUrlAvatar(userDelete?.avatarImage).uri }}
            style={styles.bigAvatarImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={[
              styles.bigAvatarImage,
              {
                borderRadius: SW(40),
                backgroundColor: Colors.primary2,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <AppText style={[styles.headerPopupTextStyle, { color: Colors.primary5 }]}>
              {userDelete?.fullName?.slice(0, 1)}
            </AppText>
          </View>
        )}
        <View style={{ marginTop: SH(15) }}>
          <AppText
            style={[styles.headerPopupTextStyle, { color: Colors.gray5, textAlign: 'center' }]}
          >
            Xác nhận xóa
            <AppText semiBold style={styles.headerPopupTextStyle}>
              {` ${userDelete?.fullName} (mã MFast: ${userDelete?.referralCode || ''}) `}
            </AppText>
            ra khỏi danh sách tin nhắn
          </AppText>
        </View>
      </View>
      <View
        style={[
          styles.rowView,

          {
            backgroundColor: '#d6e5ff',
            height: SH(50),
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            onTouchStart={() => onDelete(userDelete?.ID)}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppText medium style={[commonStyle.mediumText, { color: Colors.thirdRed }]}>
              Xóa khỏi danh sách
            </AppText>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            onTouchStart={onCancel}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppText medium style={[commonStyle.mediumText, { color: Colors.primary2 }]}>
              Quay lại
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
});

export default ViewModalDelete;
