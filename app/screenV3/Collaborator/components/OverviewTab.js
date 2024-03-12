import { Animated, StyleSheet } from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import ExperienceContent from '../common/ExperienceContent';
import IncomeContent from '../common/IncomeContent';
import CollaboratorContent from '../common/CollaboratorContent';
import LegendaryContent from '../common/LegendaryContent';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';
import WorkingContent from '../common/WorkingContent';

const OverviewTab = memo(
  forwardRef((props, ref) => {
    const { index, userId, onLayoutContent, navigation } = props;
    const myUser = useSelectorShallow(getMyuserSelector);
    const [userInfo, setUserInfo] = useState({});
    // const userInfo = useSelector((state) => state?.collaboratorReducer?.hierInfoUser);

    const level = useMemo(() => userInfo?.rank?.level, [userInfo?.rank?.level]);

    const [isShow, setIsShow] = useState(true);

    const animated = useRef(new Animated.Value(1)).current;
    const isFocused = useRef(true);

    const onTabIndexChange = useCallback(
      (tabIndex) => {
        setIsShow((prevState) => {
          const nextState = tabIndex === index;
          Animated.timing(animated, {
            toValue: nextState ? 1 : 0,
            duration: 800,
          }).start();
          if (nextState === prevState) return prevState;
          return nextState;
        });
      },
      [animated, index],
    );
    const onUserInfoChange = useCallback((_userInfo) => {
      setUserInfo(_userInfo);
    }, []);

    useImperativeHandle(ref, () => ({
      onTabIndexChange,
      onUserInfoChange,
    }));

    useEffect(() => {
      const focusListener = navigation.addListener('willFocus', () => {
        isFocused.current = true;
      });
      const blurListener = navigation.addListener('willBlur', () => {
        isFocused.current = false;
      });

      return () => {
        focusListener?.remove();
        blurListener?.remove();
      };
    }, [navigation]);

    return (
      <Animated.View style={[{ opacity: animated }, !isShow && { height: 0, overflow: 'hidden' }]}>
        <LegendaryContent
          myUser={myUser}
          userId={userId}
          userInfo={userInfo}
          onLayout={onLayoutContent}
          gender={userInfo?.user?.sex}
        />
        <ExperienceContent
          myUser={myUser}
          userId={userId}
          userInfo={userInfo}
          onLayout={onLayoutContent}
        />
        <IncomeContent
          myUser={myUser}
          userId={userId}
          userInfo={userInfo}
          onLayout={onLayoutContent}
        />
        <WorkingContent
          myUser={myUser}
          userId={userId}
          userInfo={userInfo}
          onLayout={onLayoutContent}
        />
        <CollaboratorContent
          myUser={myUser}
          userId={userId}
          level={level}
          userInfo={userInfo}
          onLayout={onLayoutContent}
        />
      </Animated.View>
    );
  }),
);

export default OverviewTab;

const styles = StyleSheet.create({
  container: {},
});
