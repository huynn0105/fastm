import { Animated, StyleSheet, View } from 'react-native';
import React, { forwardRef, memo, useCallback, useImperativeHandle, useState } from 'react';
import FilterCollaborator from '../common/FilterCollaborator';
import ListCollaborator from '../common/ListCollaborator';
import { useRef } from 'react';
import ManageCollaboratorsContent from '../common/ManageCollaboratorsContent';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';

const CollaboratorTab = memo(
  forwardRef((props, ref) => {
    const { index, navigation, userId } = props;
    const myUser = useSelectorShallow(getMyuserSelector);

    const [isShow, setIsShow] = useState(false);
    const [filters, setFilters] = useState({});
    const [level, setLevel] = useState();
    const [collaboratorLeave, setDataCollaboratorLeave] = useState({});

    const animated = useRef(new Animated.Value(0)).current;

    const onChangeFilters = useCallback((newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

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
      setLevel(_userInfo?.rank?.level);
    }, []);
    const updateDataCollaboratorLeave = useCallback((data) => {
      setDataCollaboratorLeave(data);
    }, []);

    useImperativeHandle(ref, () => ({
      onTabIndexChange,
      onUserInfoChange,
      updateDataCollaboratorLeave,
    }));

    return (
      <Animated.View style={[{ opacity: animated }, !isShow && { height: 0, overflow: 'hidden' }]}>
        {userId?.length ? null : (
          <ManageCollaboratorsContent collaboratorLeave={collaboratorLeave} />
        )}
        <FilterCollaborator
          myUser={myUser}
          level={level}
          navigation={navigation}
          onChangeFilters={onChangeFilters}
        />
        <ListCollaborator
          userId={myUser?.uid}
          myUser={myUser}
          filters={filters}
          navigation={navigation}
        />
      </Animated.View>
    );
  }),
);

export default CollaboratorTab;

const styles = StyleSheet.create({
  container: {},
});
