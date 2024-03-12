import React, { PureComponent } from 'react';
import { Image, Keyboard, ScrollView, TouchableOpacity, View } from 'react-native';
import { ICON_PATH } from '../../assets/path';
import AppText from '../../componentV3/AppText';
import { SH, SW } from '../../constants/styles';
import Colors from '../../theme/Color';
import CustomPopup from '../CustomPopup';

class BottomActionSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      headerText: '',
    };
  }
  open = (headerText) => {
    try {
      headerText && this.setState({ headerText });
      this.userListSheetRef.open();
    } catch (error) {
      this.userListSheetRef.open();
    }
  };

  close = () => {
    Keyboard.dismiss();
    this.userListSheetRef.close();
  };

  render() {
    const {
      canClose = true,
      render,
      headerText,
      headerTextStyle,
      haveCloseButton,
      backdropColor,
      onPressDone,
      avoidKeyboard,
    } = this.props;
    return (
      <CustomPopup
        ref={(ref) => {
          this.userListSheetRef = ref;
        }}
        avoidKeyboard={avoidKeyboard}
        render={() => (
          <ActionSheetContent
            child={render}
            headerText={this.state.headerText || headerText}
            headerTextStyle={headerTextStyle}
            haveCloseButton={haveCloseButton}
            onClosePopup={this.close}
            onPressDone={onPressDone}
          />
        )}
        position={'BOTTOM'}
        canClose={canClose}
        backdropColor={backdropColor}
      />
    );
  }
}

export default BottomActionSheet;

const ActionSheetContent = ({
  child,
  headerText,
  haveCloseButton,
  onClosePopup,
  description,
  onPressDone,
  headerTextStyle,
}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 5,
        zIndex: 999,
      }}
    >
      {headerText ? (
        <View
          style={{
            justifyContent: !haveCloseButton ? 'center' : 'space-between',
            alignItems: 'center',
            height: SH(46),
            overflow: 'hidden',
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            flexDirection: 'row',
          }}
        >
          {haveCloseButton ? (
            <TouchableOpacity
              disabled={haveCloseButton && !onPressDone}
              style={{ opacity: onPressDone ? 1 : 0, paddingHorizontal: SW(16) }}
              onPress={onClosePopup}
            >
              <Image
                source={ICON_PATH.close1}
                style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          ) : null}
          <AppText
            medium
            style={[
              {
                color: Colors.gray2,
                fontSize: SH(14),
                lineHeight: SH(20),
                flex: 1,
                textAlign: 'center',
              },
              headerTextStyle,
            ]}
          >
            {headerText}
          </AppText>
          {onPressDone ? (
            <TouchableOpacity
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: SW(16),
              }}
              onPress={onPressDone}
            >
              <AppText
                bold
                style={{ fontSize: SH(14), lineHeight: SH(20), color: Colors.primary2 }}
              >
                Xong
              </AppText>
            </TouchableOpacity>
          ) : haveCloseButton ? (
            <TouchableOpacity
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: SW(16),
              }}
              onPress={onClosePopup}
            >
              <Image
                source={ICON_PATH.close1}
                style={{ width: SW(16), height: SH(16), resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      {child()}
    </View>
  );
};
