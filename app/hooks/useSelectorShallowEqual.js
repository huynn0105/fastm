import { useSelector, shallowEqual } from 'react-redux';

export default function useSelectorShallow(selector, equalityFn) {
  return useSelector(selector, equalityFn || shallowEqual);
}

export function selectorWithProps(selector, props) {
  return (state) => selector(state, props);
}
