import React from 'react';

import { NoWrap } from './ElapsedTime.styled';

interface Props {
  value: number | undefined;
  shorthand?: boolean;
}

export const fullNames = ['millisecond', 'second', 'minute', 'hour', 'day'];
export const shorthands = ['ms', 's', 'min', 'h', 'd'];

const ElapsedTime: React.FC<Props> = ({ value, shorthand = true }) => {
  const getTimeParts = (elapsedTime: number) => {
    const timeMs = elapsedTime;
    const types = shorthand ? shorthands : fullNames;
    // Convert milliseconds to days, hours, minutes, and seconds
    const days = Math.floor(timeMs / (3600000 * 24));
    if (days > 0) {
      return {
        value: days,
        type: types[4],
      };
    }
    const hours = Math.floor(timeMs / 3600000);
    if (hours > 0) {
      return {
        value: hours,
        type: types[3],
      };
    }
    const minutes = Math.floor(timeMs / 60000);
    if (minutes > 0) {
      return {
        value: minutes,
        type: types[2],
      };
    }
    const seconds = Math.floor(timeMs / 1000);
    if (seconds > 0 || minutes > 0 || hours > 0) {
      return {
        value: seconds,
        type: types[1],
      };
    }
    return {
      value: timeMs,
      type: types[0],
    };
  };

  const formattedValue = React.useMemo((): string => {
    if (!value) return '';
    if (value === -1) return 'Infinite';
    const timePart = getTimeParts(value);
    return (
      timePart.value +
      (shorthand ? '' : ' ') +
      timePart.type +
      (!shorthand && timePart.value > 1 ? 's' : '')
    );
  }, [shorthand, value]);

  return <NoWrap>{formattedValue}</NoWrap>;
};

export default ElapsedTime;
