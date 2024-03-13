import { Linking, ScrollView, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import HeaderSection from './HeaderSection';
import InfoView from './InfoView';
import Colors from '../../../theme/Color';
import { DEEP_LINK_BASE_URL } from '../../../constants/configs';

const ManageCollaboratorsContent = memo(({ collaboratorLeave, isLogin }) => {
  if (Object?.keys(collaboratorLeave)?.length === 0) {
    return null;
  }
  return (
    <>
      <HeaderSection title={`Cộng tác viên cần chú ý `} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoContainer}>
        <InfoView
          titleColor={Colors.gray5}
          arrowColor={Colors.gray5}
          contentColor={Colors.purple}
          title={'Có hoạt động'}
          content={collaboratorLeave?.working || 0}
          style={{ marginRight: 8 }}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
          onPress={() => {
            Linking.openURL(
              `${DEEP_LINK_BASE_URL}://open?view=CollaboratorLeaveScreen&initIndex=0`,
            );
          }}
        />
        <InfoView
          titleColor={Colors.gray5}
          arrowColor={Colors.gray5}
          contentColor={Colors.sixRed}
          title={'Cần theo dõi'}
          content={collaboratorLeave?.follow || 0}
          style={{ marginRight: 8 }}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
          onPress={() => {
            Linking.openURL(
              `${DEEP_LINK_BASE_URL}://open?view=CollaboratorLeaveScreen&initIndex=1`,
            );
          }}
        />
        <InfoView
          titleColor={Colors.gray5}
          arrowColor={Colors.gray5}
          contentColor={Colors.sixOrange}
          title={'Có thể rời đi'}
          content={collaboratorLeave?.can_leave || 0}
          style={{ marginRight: 8 }}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
          onPress={() => {
            Linking.openURL(
              `${DEEP_LINK_BASE_URL}://open?view=CollaboratorLeaveScreen&initIndex=2`,
            );
          }}
        />
        <InfoView
          titleColor={Colors.gray5}
          arrowColor={Colors.gray5}
          contentColor={Colors.blue3}
          title={'Có thể xóa'}
          content={collaboratorLeave?.can_remove || 0}
          style={{ marginRight: 8 }}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
          onPress={() => {
            Linking.openURL(
              `${DEEP_LINK_BASE_URL}://open?view=CollaboratorLeaveScreen&initIndex=3`,
            );
          }}
        />
        <InfoView
          titleColor={Colors.gray5}
          arrowColor={Colors.gray5}
          contentColor={Colors.gray1}
          title={'Vừa rời đi'}
          content={collaboratorLeave?.departed || 0}
          style={{ marginRight: 8 }}
          backgroundColor={Colors.primary5}
          isBetweenContent={false}
          onPress={() => {
            Linking.openURL(
              `${DEEP_LINK_BASE_URL}://open?view=CollaboratorLeaveScreen&initIndex=4`,
            );
          }}
        />
      </ScrollView>
    </>
  );
});

export default ManageCollaboratorsContent;

const styles = StyleSheet.create({
  infoContainer: {
    marginBottom: 32,
    marginTop: 8,
  },
});
