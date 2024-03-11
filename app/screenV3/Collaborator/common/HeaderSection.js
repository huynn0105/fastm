import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import AppText from '../../../componentV3/AppText';
import Tooltip from 'react-native-walkthrough-tooltip';
import { ICON_PATH } from '../../../assets/path';
import Colors from '../../../theme/Color';
import { Pressable } from 'react-native';

const HeaderSection = memo((props) => {
  const { title, note, rightView, style, onLayout, keyLayout, elementNote } = props;
  const [toolTipVisible, setToolTipVisible] = useState(false);

  const onCloseTooltip = useCallback(() => {
    setToolTipVisible(false);
  }, []);
  const onOpenTooltip = useCallback(() => {
    if (!note && !elementNote) return;
    setToolTipVisible(true);
  }, [elementNote, note]);

  const handleOnLayOut = useCallback(
    (e) => {
      onLayout?.(e, keyLayout);
    },
    [keyLayout, onLayout],
  );

  return (
    <Pressable onLayout={handleOnLayOut} onPress={onOpenTooltip} style={[styles.container, style]}>
      <AppText semiBold style={styles.title} numberOfLines={1}>
        {title}
      </AppText>
      {note || elementNote ? (
        <Tooltip
          isVisible={toolTipVisible}
          disableShadow
          contentStyle={styles.contentContainer}
          content={elementNote || <AppText style={styles.note}>{note}</AppText>}
          placement="bottom"
          backgroundColor={'rgba(10, 10, 40, 0.85)'}
          onClose={onCloseTooltip}
        >
          <Image
            source={ICON_PATH.note2}
            style={[styles.icon, { tintColor: toolTipVisible ? Colors.primary5 : Colors.gray5 }]}
          />
        </Tooltip>
      ) : rightView ? (
        rightView
      ) : null}
    </Pressable>
  );
});

export default HeaderSection;

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  title: {
    fontSize: 18,
    lineHeight: 24,
    flexShrink: 1,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray5,
  },
  icon: {
    marginLeft: 6,
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  contentContainer: {
    width: 'auto',
    height: 'auto',
    padding: 12,
  },
});
