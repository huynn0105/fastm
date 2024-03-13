import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import SelectableItem from '../../../components2/SelectableItem/index';
import Colors from '../../../theme/Color';
import TextStyles from '../../../theme/TextStyle';
import AppText from '../../../componentV3/AppText';

class ListCarrierBottomActionSheet extends PureComponent {
  renderHeaderTitle = () => {
    const { onCloseButtonPress } = this.props;
    return (
      <View style={styles.headerTitleContainer}>
        <View style={styles.titleContainer}>
          <AppText style={{ ...TextStyles.heading4 }}>{'Chọn nhà mạng'}</AppText>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onCloseButtonPress}>
          <Image source={require('../img/ic_close.png')} />
        </TouchableOpacity>
      </View>
    );
  };
  renderCarrierItems = () => {
    const { dataSource, onCarrierItemPress } = this.props;
    return dataSource.map((itemCarrier, index) => {
      const selectedDescriptionStyle = itemCarrier.isSelected
        ? { color: Colors.primary4 }
        : { color: `${Colors.primary4}44` };
      return (
        <SelectableItem
          label={itemCarrier.label}
          description={`Chiết khấu ${itemCarrier.discount}% khi mua thẻ`}
          descriptionTextView={
            <AppText
              style={{
                marginTop: 4,
                ...TextStyles.normalTitle,
                ...selectedDescriptionStyle,
              }}
            >
              {'Chiết khấu '}
              <AppText style={{ fontWeight: itemCarrier.isSelected ? 'bold' : 'normal' }}>
                {itemCarrier.discount}
              </AppText>
              {'% khi mua thẻ'}
            </AppText>
          }
          isSelected={itemCarrier.isSelected}
          thumbnailSource={{ uri: itemCarrier.imageUrl }}
          thumbnailStyle={{ width: 46, height: 46 }}
          onSelectableItemPress={() => {
            onCarrierItemPress(index);
          }}
        />
      );
    });
  };
  render() {
    return (
      <View>
        {this.renderHeaderTitle()}
        <View style={styles.container}>{this.renderCarrierItems()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerTitleContainer: {
    padding: 14,
    backgroundColor: Colors.neutral5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '56.66%',
    left: 16,
    width: 24,
    height: 24,
    padding: 3,
  },
});

export default ListCarrierBottomActionSheet;
