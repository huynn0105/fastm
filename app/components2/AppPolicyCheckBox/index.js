import React, { PureComponent } from 'react';
import { Text, View, Image } from 'react-native';
import TextStyles from '../../theme/TextStyle';
import Colors from '../../theme/Color';
import ImageButton from '../ImageButton';
import {ICON_PATH} from '../../assets/path';
import AppText from '../../componentV3/AppText';
class AppPolicyCheckBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  onCheckBoxPress = () => {
    this.setState(
      (prevState) => ({
        isChecked: !prevState.isChecked
      }),
      () => {
        this.props.onCheckBoxPress(this.state.isChecked);
      }
    );
  };

  render() {
    const { containerStyle, onPolicyPress, onPrivacyPress } = this.props;
    const tickIcon = this.state.isChecked ? ICON_PATH.check_on : ICON_PATH.check_off;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', ...containerStyle }}>
        <ImageButton imageSource={tickIcon} onPress={this.onCheckBoxPress} />
        <AppText style={[TextStyles.normalTitle, { marginLeft: 16, marginRight: 4 }]}>
          {'Tôi đã đọc và đồng ý với '}
          <AppText style={{ color: Colors.primary2, fontSize: 14 }} onPress={onPolicyPress}>
            {'điều khoản sử dụng '}
          </AppText>
          <AppText>{'và '}</AppText>
          <AppText style={{ color: Colors.primary2, fontSize: 14 }} onPress={onPrivacyPress}>
            {'chính sách bảo mật '}
          </AppText>
          <AppText>{'của MFast'}</AppText>
        </AppText>
      </View>
    );
  }
}

export default AppPolicyCheckBox;
