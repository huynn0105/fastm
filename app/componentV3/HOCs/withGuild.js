import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GuildPageSlider from '../GuildPageSlider/GuildPageSlider.index';
import ModalStepGuild from '..//ModalStepGuild';

import { AsyncStorageKeys } from '../../constants/keys';

// // redux
import useSelectorShallow from '../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../redux/selectors/userSelector';

const withGuild = (WrapperComponent) => {
  return React.memo((props) => {
    const { navigation } = props;
    const myUser = useSelectorShallow(getMyuserSelector);

    const [isShowGuildSlider, setIsShowGuildSlider] = useState(false);
    const [isShowNewGuild, setIsShowNewGuild] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    // test
    // useLayoutEffect(() => {
    //     (async () => {
    //         await AsyncStorage.removeItem(AsyncStorageKeys.GUILD_SLIDER);
    //         await AsyncStorage.removeItem(AsyncStorageKeys.GUILD_SHOW);
    //     })();
    // }, []);

    useLayoutEffect(() => {
      (async () => {
        if (!myUser?.isLoggedIn) {
          setIsLoading(true);
          const isShow = await AsyncStorage.getItem(AsyncStorageKeys.GUILD_SLIDER);
          setIsLoading(false);
          getCacheNewUserGuild();
          if (isShow && JSON.parse(isShow) === 1) {
            return;
          }
          setIsShowGuildSlider(true);
        }
      })();
    }, [myUser]);

    const getCacheNewUserGuild = async () => {
      const isShow = await AsyncStorage.getItem(AsyncStorageKeys.NEW_USER_GUILD);
      if (isShow && JSON.parse(isShow) === 1) {
        setIsShowNewGuild(false);
        return;
      } else {
        setIsShowNewGuild(true);
      }
    };

    const onDone = useCallback(
      async (isLogin) => {
        if (isLogin) {
          navigation.navigate('LoginModal', { isShowSkipLogin: true });
        }
        await AsyncStorage.setItem(AsyncStorageKeys.GUILD_SLIDER, '1');
        await AsyncStorage.setItem(AsyncStorageKeys.NEW_USER_GUILD, '0');
        setIsShowGuildSlider(false);
      },
      [navigation],
    );

    const showGuild = useCallback(async () => {
      if (isShowGuildSlider || isLoading) return;
      const isShow = await AsyncStorage.getItem(AsyncStorageKeys.GUILD_SHOW);
      if (isShow && JSON.parse(isShow) === 1) {
        return;
      }
    }, [isLoading, isShowGuildSlider]);

    return (
      <View style={styles.wrapper}>
        <WrapperComponent
          {...props}
          onShowGuild={showGuild}
          isShowGuildSlider={isShowGuildSlider}
          isShowNewGuild={isShowNewGuild}
          onReload={() => {
            getCacheNewUserGuild();
          }}
        />
        <GuildPageSlider isVisible={isShowGuildSlider} onDone={onDone} />
      </View>
    );
  });
};

export default withGuild;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
