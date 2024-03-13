import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';
const TELEPHONE_CARD_ITEM_WIDTH = SCREEN_WIDTH / 4.37;
export class CarrierCheckBoxItem extends PureComponent {
  render() {
    const {
      containerStyle,
      carrierBoxStyle,
      index,
      isSelected,
      imageSource,
      label,
      onPress,
      description,
    } = this.props;
    const selectedContainerStyle = isSelected
      ? styles.selectedContainerStyle
      : styles.unselectedContainerStyle;
    const selectedLabelStyle = isSelected ? styles.selectedLabelStyle : styles.unselectedLabelStyle;
    const tickIcon = isSelected
      ? require('./img/ic_check.png')
      : require('./img/ic_white_circle.png');
    return (
      <TouchableOpacity
        style={{ paddingTop: 8, paddingRight: 8, ...containerStyle }}
        onPress={() => {
          onPress(index);
        }}
      >
        <View style={{ maxWidth: TELEPHONE_CARD_ITEM_WIDTH + 16 }}>
          <View style={[styles.carrierBoxStyle, selectedContainerStyle, carrierBoxStyle]}>
            <FastImage
              style={{
                // aspectRatio: 57 / 40,
                // width: '100%',
                // height: undefined,
                width: '100%',
                height: '100%',
                opacity: isSelected ? 1 : 0.6,
              }}
              source={imageSource}
              resizeMode="contain"
            />
             <Image
              style={{ width: 24, height: 24, position: 'absolute', top: -5, right: -5 }}
              source={tickIcon}
            />
          </View>
          {(isSelected && description)  ? 
              (
                <HTML
                  html={description}
                  tagsStyles={{
                    a: { textDecorationLine: 'none' },
                    b: { margin: 0 },
                    p: { margin: 6 },
                    h1: { margin: 0 },
                    h2: { margin: 0 },
                    h3: { margin: 0 },
                    h4: { margin: 0 },
                    h6: { margin: 0 },
                    span: { margin: 0 },
                  }}
                />
              ) :
              (
                <AppText style={[{ marginTop: 6 }, selectedLabelStyle]}>
                  {label}
                </AppText>
            )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  carrierBoxStyle: {
    width: SCREEN_WIDTH / 3.9,
    height: SCREEN_WIDTH / 6.69,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 8,
    paddingLeft: 8,
  },
  selectedContainerStyle: {
    backgroundColor: 'white',
    // shadowColor: 'rgba(0, 0, 0, 0.1)',
    // shadowOffset: {
    //   width: 0,
    //   height: 7,
    // },
    // shadowRadius: 64,
    // shadowOpacity: 1,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.neutral4,
  },
  unselectedContainerStyle: {
    backgroundColor: Colors.neutral5,
    borderColor: Colors.neutral6,
  },
  selectedLabelStyle: {
    ...TextStyles.normalTitle,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary2,
  },
  unselectedLabelStyle: {
    ...TextStyles.normalTitle,
    color: `${Colors.primary4}44`,
    textAlign: 'center',
  },
});

export default CarrierCheckBoxItem;
