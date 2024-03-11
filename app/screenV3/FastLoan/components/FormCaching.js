import { View } from 'react-native';
import React, { cloneElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { memo } from 'react';
import { isValidElement } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormCaching = memo((props) => {
  const { children, projectId, stepId, ...rest } = props;

  const refs = useRef({});

  const [lastKey, setLastKey] = useState('');
  const [values, setValues] = useState({});

  const getValuesCaching = useCallback(() => {
    if (projectId && stepId) {
      AsyncStorage.getItem(projectId, (error, value) => {
        if (!error) {
          value = JSON.parse(value);
          value?.[stepId]?.data && setValues(value[stepId].data || {});
          value?.[stepId]?.lastKey && setLastKey(value[stepId].lastKey);
        }
      });
    }
  }, [projectId, stepId]);

  const handleChangeText = useCallback(
    (key) => (text) => {
      setValues((prev) => {
        return {
          ...prev,
          [key]: text,
        };
      });
    },
    [],
  );

  const handleChangeTextAndCaching = useCallback(
    (key) => (text) => {
      setValues((prev) => {
        return {
          ...prev,
          [key]: text,
        };
      });
      AsyncStorage.getItem(projectId, (error, value) => {
        if (!error) {
          const valueForm = value ? JSON.parse(value) : {};
          if (!valueForm[stepId]) {
            valueForm[stepId] = {
              data: {},
              lastKey: '',
            };
          }
          valueForm[stepId].data[key] = text;
          valueForm[stepId].lastKey = key;
          AsyncStorage.setItem(projectId, JSON.stringify(valueForm));
        }
      });
    },
    [projectId, stepId],
  );

  const handleBlur = useCallback(
    (key) => async () => {
      if (projectId && stepId) {
        const text = values[key];
        AsyncStorage.getItem(projectId, (error, value) => {
          if (!error) {
            const valueForm = value ? JSON.parse(value) : {};
            if (!valueForm[stepId]) {
              valueForm[stepId] = {
                data: {},
                lastKey: '',
              };
            }
            valueForm[stepId].data[key] = text;
            valueForm[stepId].lastKey = key;
            AsyncStorage.setItem(projectId, JSON.stringify(valueForm));
          }
        });
      }
    },
    [projectId, stepId, values],
  );

  const handleRef = useCallback(
    (key) => (ref) => {
      refs.current[key] = ref;
    },
    [],
  );

  useEffect(() => {
    getValuesCaching();
  }, [getValuesCaching]);

  useEffect(() => {
    if (lastKey) {
      const ref = refs.current[lastKey];
      if (ref) {
        ref.focus();
      }
    }
  }, [lastKey, projectId, stepId]);

  const childrenWithProps = useMemo(() => {
    const childrenProps = {
      handleChangeText,
      handleChangeTextAndCaching,
      handleBlur,
      handleRef,
      values,
      lastKey,
    };
    if (isValidElement(children)) {
      return cloneElement(children, childrenProps);
    } else if (typeof children === 'function') {
      return children(childrenProps);
    } else {
      return children;
    }
  }, [
    handleChangeText,
    handleChangeTextAndCaching,
    handleBlur,
    handleRef,
    values,
    lastKey,
    children,
  ]);

  return <View {...rest}>{childrenWithProps}</View>;
});

export default FormCaching;
