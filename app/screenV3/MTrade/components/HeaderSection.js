import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';

const HeaderSection = memo((props) => {
  const { title, onPressAll } = props;
  return (
    <View style={styles.headerContainer}>
      <AppText semiBold style={styles.title}>
        {title}
      </AppText>
      {onPressAll ? (
        <TouchableWithoutFeedback onPress={onPressAll}>
          <AppText semiBold style={[styles.title, { color: Colors.primary2 }]}>
            Tất cả
          </AppText>
        </TouchableWithoutFeedback>
      ) : null}
    </View>
  );
});

export default HeaderSection;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
});
