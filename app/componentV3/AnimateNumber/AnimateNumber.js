import React, { memo, useEffect, useState } from 'react';
import AppText from '../AppText';
let interval;

const AnimateNumber = memo((props) => {
  const { value, formatter = (number) => number, time, timeInterval = 15, ...rest } = props;
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (!value) return;
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    setNumber(0);
    const step = (timeInterval * value) / time;
    interval = setInterval(() => {
      setNumber((prevState) => {
        const newState = prevState + step;
        if (newState < value) {
          return newState;
        } else {
          clearInterval(interval);
          interval = null;
          return value;
        }
      });
      return () => {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      };
    }, timeInterval);
  }, [time, timeInterval, value]);

  return <AppText {...rest}>{value ? formatter(number) : 0}</AppText>;
});

export default AnimateNumber;
