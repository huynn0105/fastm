import { useRef, useCallback, useEffect } from 'react';

function useDebounce(callback, delay, callCallbackImmediately = false) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      if (callCallbackImmediately) {
        callback(...args);
      }

      timeoutRef.current = setTimeout(() => {
        if (!callCallbackImmediately) {
          callback(...args);
        }
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay, callCallbackImmediately],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

export default useDebounce;
