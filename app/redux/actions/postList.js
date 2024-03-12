import { POST_LIST } from './types';
import DigitelClient from '../../network/DigitelClient';

export function postList(data) {
  return {
    type: POST_LIST,
    payload: data,
  };
}

export function fetchPostList() {
  return async (dispatch) => {
    try {
      const posts = await DigitelClient.fetchPostList();
      dispatch(postList(posts));
    } catch (error) {
      dispatch(postList([]));
    }
  };
}
