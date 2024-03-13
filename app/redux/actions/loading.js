import { IS_LOADING } from '../actions/types';

export function triggerLoading(isLoading) {
  return {
    type: IS_LOADING,
    isLoading,
  };
}
