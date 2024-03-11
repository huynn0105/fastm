import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import HTML from 'react-native-render-html';
import Colors from '../../theme/Color';
import TextStyles from '../../theme/TextStyle';
import { SCREEN_WIDTH } from '../../utils/Utils';
import AppText from '../../componentV3/AppText';
const TELEPHONE_CARD_ITEM_WIDTH = SCREEN_WIDTH;
class CarrierCheckBoxItem extends PureComponent {
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
        <View>
          <View style={[styles.carrierBoxStyle, selectedContainerStyle, carrierBoxStyle]}>
            <FastImage
              style={{
                width: '100%',
                height: '80%',
                marginTop: 6,
                opacity: isSelected ? 1 : 0.6,
              }}
              source={imageSource}
              resizeMode="contain"
            />
            <View style={{ width: SCREEN_WIDTH / 4 }}>
              {description  ? 
                (
                  <HTML
                    html={description}
                    tagsStyles={{
                      a: { textDecorationLine: 'none' },
                      b: { margin: 0 },
                      p: { margin: 6, textAlign: 'center' },
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
                <AppText style={[{ marginVertical: 6 }, selectedLabelStyle]}>
                  {label}
                </AppText>
              )}
            </View>
             <Image
              style={{ width: 24, height: 24, position: 'absolute', top: -5, right: -5 }}
              source={tickIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  carrierBoxStyle: {
    width: SCREEN_WIDTH / 4.1,
    maxHeight: SCREEN_WIDTH / 5.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  selectedContainerStyle: {
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: Colors.neutral4,
  },
  unselectedContainerStyle: {
    backgroundColor: '#E6EBFF',
    borderColor: Colors.neutral6,
    borderWidth: 0.5,
    borderColor: Colors.neutral4,
  },
  selectedLabelStyle: {
    ...TextStyles.normalTitle,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.primary2,
  },
  unselectedLabelStyle: {
    ...TextStyles.normalTitle,
    color: Colors.primary4,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default CarrierCheckBoxItem;
