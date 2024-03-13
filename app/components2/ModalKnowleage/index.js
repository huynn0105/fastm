/* eslint-disable no-shadow */
import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../theme/Color';
import AppText from '../../componentV3/AppText';
import {ICON_PATH} from '../../assets/path';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    height: height / 1.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    paddingHorizontal: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: Colors.neutral5,
  },
  txtHeader: {
    flex: 1,
    opacity: 0.6,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: Colors.primary4,
    marginHorizontal: 8,
  },
  itemContainer: {
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
  },
  itemTxt: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    marginRight: 10,
    color: Colors.primary4,
  },
  touchArea: {
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    margin: 16,
    height: 38,
    padding: 16,
    borderRadius: 19,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    height: 38,
    textAlign: 'center',
    color: '#24253d',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.neutral4,
    opacity: 0.3,
  },
});

// const DUMMY_DATA = [
//   {
//     title: 'Tiền trên MFast dùng để làm gì?',
//     url: '',
//     id: 'parent_1',
//     more: [
//       {
//         title: 'Tiền trên MFast dùng để làm gì?',
//         url: '',
//         id: 'child_1',
//       },
//       {
//         title: 'Tiền trên MFast dùng để làm gì?',
//         url: '',
//         id: 'child_2',
//       },
//     ],
//   },
//   {
//     title: 'Cách liên hệ với MFast?',
//     url: '',
//     id: 'parent_2',
//   },
// ];

class ModalKnowleage extends PureComponent {
  state = {
    expends: [],
  };

  renderItem = ({ item, index, isChild }) => {
    const { expends } = this.state;
    const isIncludeChild =
      Array.isArray(item.more) && item.more.length > 0 && expends.includes(item.id);
    let imagesource = ICON_PATH.arrow_right;
    let styleIcon = { width: 18, height: 18 };
    if (isIncludeChild) {
      imagesource = ICON_PATH.arrow_down;
      styleIcon = { width: 18, height: 18 };
    }
    return (
      <View>
        <TouchableOpacity onPress={this.onPressSelectItem(item)}>
          <View style={styles.itemContainer}>
            <AppText style={styles.itemTxt} numberOfLines={3}>
              {isChild ? `${index + 1}. ${item.title}` : item.title}
            </AppText>
            <Image source={imagesource} style={styleIcon} resizeMode="contain" />
          </View>
          <View style={styles.divider} />
        </TouchableOpacity>
        {isIncludeChild ? (
          <View style={{ paddingLeft: 16 }}>
            {item.more.map((i, index) => this.renderItem({ item: i, index, isChild: true }))}
          </View>
        ) : null}
      </View>
    );
  };

  onPressSelectItem = (item) => () => {
    const isIncludeChild = Array.isArray(item.more) && item.more.length > 0;
    if (!isIncludeChild) {
      this.onCloseModal();
      setTimeout(() => {
        const { onPressSelectItem } = this.props;
        onPressSelectItem(item);
      }, 150);
    } else {
      const { expends } = this.state;
      const isExtends = expends.includes(item.id);
      if (isExtends) {
        this.setState({ expends: expends.filter((i) => i.id === item.id) });
      } else {
        const newExpends = expends.concat(item.id);
        this.setState({ expends: [...new Set(newExpends)] });
      }
    }
  };

  keyExtractor = (item, index) => index.toString();

  onCloseModal = () => {
    const { onCloseModal } = this.props;
    this.setState({ expends: [] });
    onCloseModal();
  };

  render() {
    const { isVisible, data, title } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        style={{ padding: 0, margin: 0 }}
        onBackdropPress={this.onCloseModal}
        onModalHide={this.onCloseModal}
        avoidKeyboard
      >
        <View style={styles.wrapper}>
          <TouchableWithoutFeedback onPress={this.onCloseModal}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={this.onCloseModal}>
                <Image source={ICON_PATH.close1} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
              <AppText style={styles.txtHeader} numberOfLines={1}>{title || ''}</AppText>
              <View style={{ width: 20, height: 20 }} />
            </View>
            <FlatList
              data={data}
              extraData={this.state.expends}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default ModalKnowleage;
