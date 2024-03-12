import { Image, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import AppText from '../../../componentV3/AppText';
import Colors from '../../../theme/Color';
import { ICON_PATH } from '../../../assets/path';
import { fonts } from '../../../constants/configs';
import { Tooltip } from 'react-native-elements';
import HTMLView from '../../../componentV3/HTMLView/HTMLView';

const SectionHeader = memo((props) => {
  const { title, note, renderNote, titleStyle } = props;
  if (!title) return null;
  return (
    <View style={styles.container}>
      <AppText style={[styles.title, titleStyle]} semiBold>
        {title}
      </AppText>
      {renderNote || note ? (
        <Tooltip
          skipAndroidStatusBar={true}
          pointerColor="#fff"
          overlayColor="rgba(0, 0, 0, 0.4)"
          backgroundColor="#fff"
          containerStyle={{ flex: 1, height: 'auto' }}
          width={268}
          popover={
            renderNote ? (
              renderNote?.()
            ) : (
              <HTMLView
                html={note}
                tagsStyles={{
                  a: { textDecorationLine: 'none' },
                  b: { margin: 0 },
                  p: { margin: 0, fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
                  h1: { margin: 0 },
                  h2: { margin: 0 },
                  h3: { margin: 0 },
                  h4: { margin: 0 },
                  h6: { margin: 0 },
                  span: { margin: 0 },
                }}
              />
            )
          }
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppText style={styles.note}>Ghi chú</AppText>
            <Image
              source={ICON_PATH.note2}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          </View>
        </Tooltip>
      ) : null}
    </View>
  );
});

export default SectionHeader;

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  title: { fontSize: 14, lineHeight: 20, color: Colors.gray5, flex: 1 },
  note: { fontSize: 13, lineHeight: 18, color: Colors.gray5, marginRight: 4 },
});
