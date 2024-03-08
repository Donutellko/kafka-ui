import React from 'react';
import { Route, Routes } from 'react-router-dom';

import List from './List';

const ClientQuotas: React.FC = () => {
  return (
    <Routes>
      <Route index element={<List />} />
      {/* <Route
        path={clusterConsumerGroupResetOffsetsRelativePath}
        element={<ResetOffsets />}
      /> */}
    </Routes>
  );
};

export default ClientQuotas;
