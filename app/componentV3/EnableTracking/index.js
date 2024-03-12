import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Platform } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import AppText from '../AppText';
import { useActions } from '../../hooks/useActions';
import { setEnableNote } from '../../redux/actions/actionsV3/userConfigs';
import { useSelector } from 'react-redux';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';

const EnableTracking = ({ onOpenBottomSheet }) => {
  const showNote = useSelector((state) => state.userConfigs.enableNote);
  const [isShowNote, setIsShowNote] = useState(showNote);
  const actions = useActions({
    setEnableNote,
  });
  useEffect(() => {
    checkShowNote();
  }, []);
  const checkShowNote = async () => {
    const trackingStatus = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (trackingStatus === RESULTS.GRANTED || trackingStatus === RESULTS.UNAVAILABLE) {
      setIsShowNote(false);
    }
  };
  const setDisableNote = () => {
    setIsShowNote(false);
    actions.setEnableNote(false);
  };

  return (
    <View>
      {showNote && isShowNote && Platform.OS === 'ios' ? (
        <View style={styles.container}>
          <View style={styles.rowView}>
            <View style={styles.paddingView}>
              <AppText style={styles.textStyle}>
                Cho phép theo dõi ứng dụng đang tắt, bạn sẽ bỏ lỡ cơ hội kiếm thêm thu nhập từ MFast
                <AppText
                  style={[
                    styles.textStyle,
                    {
                      color: Colors.primary2,
                    },
                  ]}
                  onPress={onOpenBottomSheet}
                >
                  {` Mở ngay`}
                </AppText>
              </AppText>
            </View>
            <View style={styles.paddingRightView}>
              <TouchableOpacity onPress={setDisableNote}>
                <Image source={ICON_PATH.close1} style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: SH(13),
    lineHeight: SH(20),
    color: Colors.gray1,
  },
  container: {
    backgroundColor: '#ffe5d0',
  },
  paddingView: {
    paddingVertical: SH(8),
    paddingLeft: SW(16),
    flex: 0.85,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingRightView: {
    flex: 0.15,
    alignItems: 'center',
  },
  iconStyle: {
    width: SW(20),
    height: SH(20),
    resizeMode: 'contain',
  },
});

export default EnableTracking;
