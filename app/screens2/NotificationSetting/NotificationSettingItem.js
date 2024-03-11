import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import AppText from '../../componentV3/AppText';

import styles from './styles';
import Colors from '../../theme/Color';

function CustomComponent() {
  return (
    <View>
      <LinearGradient
        colors={['rgb(40, 158, 255)', 'rgb(0, 91, 243)']}
        style={styles.customerCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.customerCircle} />
      </LinearGradient>
    </View>
  );
}

class NotificationSettingItem extends PureComponent {
  renderInsideCircle = () => {
    const { isActive } = this.props;
    return isActive ? <CustomComponent /> : <View />;
  };
  render() {
    const { title, description, isActive = true, onToggleSettingNotification } = this.props;
    return (
      <View style={styles.notiSettingItemContainer}>
        <View style={styles.headContainer}>
          <View style={styles.titleContainer}>
            <AppText style={styles.title}>{title}</AppText>
          </View>
          <View style={styles.toggleWrapper}>
            {/* <AppText style={styles.indicatorTxt}>{isActive ? 'Bật' : 'Tắt'}</AppText> */}
            <View style={styles.switchContainer}>
              <Switch
                value={isActive}
                onValueChange={onToggleSettingNotification}
                renderActiveText={false}
                renderInActiveText={false}
                circleBorderWidth={0}
                circleSize={24}
                backgroundActive={Colors.primary2}
                backgroundInactive={Colors.gray5}
                circleActiveColor={'transparent'}
                circleInActiveColor={'transparent'}
                switchLeftPx={3}
                switchRightPx={3}
                switchWidthMultiplier={1.7}
                renderInsideCircle={() => (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 18,
                      backgroundColor: Colors.primary5,
                    }}
                  />
                )}
              />
            </View>
          </View>
        </View>
        <AppText style={styles.description}>{description}</AppText>
      </View>
    );
  }
}

export default NotificationSettingItem;
