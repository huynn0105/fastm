import { Animated, View } from 'react-native';
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
import MySupporter from '../common/MySupporter';
import ListCollaboratorReview from '../common/ListCollaboratorReview';
import { useDispatch, useSelector } from 'react-redux';
import { getFilterRating } from '../../../redux/actions/actionsV3/collaboratorAction';
import useSelectorShallow from '../../../hooks/useSelectorShallowEqual';
import { getMyuserSelector } from '../../../redux/selectors/userSelector';

const CommunityTab = memo(
  forwardRef((props, ref) => {
    const { index, navigation, userId } = props;
    const myUser = useSelectorShallow(getMyuserSelector);

    const dispatch = useDispatch();

    const animated = useRef(new Animated.Value(0)).current;

    const [isShow, setIsShow] = useState(false);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [level, setLevel] = useState();

    const onGetData = useCallback(() => {
      setIsLoading(true);
      dispatch(
        getFilterRating(myUser?.uid, (isSuccess, result) => {
          setIsLoading(false);
          if (isSuccess) {
            setData(result);
          }
        }),
      );
    }, [dispatch, myUser?.uid]);

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

    useImperativeHandle(ref, () => ({
      onTabIndexChange,
      onUserInfoChange,
    }));

    useEffect(() => {
      onGetData();
    }, []);

    const filterRating = useSelector((state) => state?.collaboratorReducer?.filterRating);

    const mySupporter = useMemo(() => filterRating?.infoUserSp, [filterRating?.infoUserSp]);

    const isHideSupportView = useMemo(
      () => !Object.keys(mySupporter || {})?.length || mySupporter?.hideFindUserSP,
      [mySupporter],
    );

    return (
      <Animated.View style={[{ opacity: animated }, !isShow && { height: 0, overflow: 'hidden' }]}>
        {userId ? null : (
          <MySupporter
            infoUser={data?.infoUserSp}
            isLoading={isLoading}
            myUser={myUser}
            navigation={navigation}
            isCTVConfirmed
          />
        )}
        <ListCollaboratorReview
          skill={data?.skill}
          tab={data?.tab}
          userId={userId || myUser?.uid}
          notes={data?.infoUserSp?.noteRatingUserHtml}
          headerStyle={
            isHideSupportView
              ? {
                  marginTop: 0,
                }
              : {}
          }
        />
      </Animated.View>
    );
  }),
);

export default CommunityTab;
