import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';

import Colors from '../../../theme/Color';
import AppText from '../../../componentV3/AppText';

const PrivateVisibleItem = ({ initIsActive = true, title, description, onToggle }) => {
  const [isActive, setIsActived] = useState(true);

  useEffect(() => {
    setIsActived(initIsActive);
  }, []);

  const renderInsideCircle = useCallback(() => {
    if (isActive) {
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
    return <View />;
  }, [isActive]);

  const onStaticToggle = useCallback(() => {
    if (onToggle) {
      setIsActived(!isActive);
      onToggle(isActive);
    }
  }, [onToggle, isActive]);

  return (
    <View style={styles.notiSettingItemContainer}>
      <View style={styles.headContainer}>
        <View style={styles.titleContainer}>
          <AppText style={styles.title}>{title}</AppText>
          <AppText style={styles.description}>{description}</AppText>
        </View>
        <View style={styles.switchContainer}>
          <Switch
            value={isActive}
            onValueChange={onStaticToggle}
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
  );
};

export default PrivateVisibleItem;

const styles = StyleSheet.create({
  notiSettingItemContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 23,
    letterSpacing: 0,
    color: Colors.primary4,
  },
  description: {
    opacity: 0.8,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    color: Colors.primary4,
    marginTop: 4,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorTxt: {
    opacity: 0.6,
    fontSize: 10,
    letterSpacing: 0,
    color: '#24253d',
    paddingRight: 6,
  },
  switchContainer: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 2,
  },
  customerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
