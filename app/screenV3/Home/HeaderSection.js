import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Tooltip } from 'react-native-elements';
import HTML from 'react-native-render-html';
import colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import { ICON_PATH } from '../../assets/path';
import { fonts } from '../../constants/configs';
import { SH, SW } from '../../constants/styles';

const HeaderSection = ({ title, onAllPress, style, note, labelRight, isGuild = false }) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ].concat(style)}
    >
      {note ? (
        <Tooltip
          skipAndroidStatusBar={true}
          pointerColor="#fff"
          overlayColor="rgba(0, 0, 0, 0.4)"
          backgroundColor="#fff"
          containerStyle={{ flex: 1, height: 'auto' }}
          width={200}
          popover={
            <HTML
              html={note}
              tagsStyles={{
                a: { textDecorationLine: 'none' },
                b: { margin: 0 },
                p: { margin: 0, fontFamily: fonts.regular, fontSize: SH(13), lineHeight: SH(18) },
                h1: { margin: 0 },
                h2: { margin: 0 },
                h3: { margin: 0 },
                h4: { margin: 0 },
                h6: { margin: 0 },
                span: { margin: 0 },
              }}
            />
          }
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <AppText
              semiBold
              style={{
                fontSize: 18,
                lineHeight: 24,
                color: isGuild ? '#fff' : '#090934',
                marginRight: SW(6),
              }}
            >
              {title}
            </AppText>
            <Image
              source={ICON_PATH.note2}
              style={{ width: SW(17), height: SH(17), resizeMode: 'contain' }}
            />
          </View>
        </Tooltip>
      ) : (
        <AppText
          semiBold
          style={{
            fontSize: 18,
            lineHeight: 24,
            color: '#090934',
          }}
        >
          {title}
        </AppText>
      )}
      {onAllPress ? (
        <TouchableOpacity
          style={{ position: 'absolute', right: 0 }}
          activeOpacity={0.2}
          disabled={!labelRight?.length}
          onPress={onAllPress}
        >
          <AppText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: colors.primary2,
              marginVertical: SH(8),
              marginLeft: SW(16),
              marginRight: 0,
            }}
          >
            {labelRight || ''}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default HeaderSection;
