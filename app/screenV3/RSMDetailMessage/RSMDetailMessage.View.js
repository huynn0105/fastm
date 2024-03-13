import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import ItemHistoryPush from '../RSMPushMessage/common/ItemHistoryPush';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';

const RSMDetailMessage = memo((props) => {
  const data = props.navigation.state.params?.data || {};

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ItemHistoryPush item={data} isShowFullMessage />
      </ScrollView>
    </View>
  );
});

export default RSMDetailMessage;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SW(16),
    paddingVertical: SH(16),
    backgroundColor: Colors.actionBackground,
    flex: 1,
  },
});
