import React from 'react';
import { formatBytes } from 'lib/dataRateHelpers';

import { NoWrap } from './BytesFormatted.styled';

interface Props {
  value: string | number | undefined;
  precision?: number;
}

const BytesFormatted: React.FC<Props> = ({ value, precision = 0 }) => {
  const formattedValue = React.useMemo((): string => {
    return formatBytes(value, precision);
  }, [precision, value]);

  return <NoWrap>{formattedValue}</NoWrap>;
};

export default BytesFormatted;
