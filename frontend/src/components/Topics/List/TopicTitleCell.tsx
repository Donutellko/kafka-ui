import React from 'react';
import { CellContext } from '@tanstack/react-table';
import { Tag } from 'components/common/Tag/Tag.styled';
import { Topic } from 'generated-sources';
import { NavLink } from 'react-router-dom';
import {
  clusterTopicMessagesRelativePath,
} from 'lib/paths';

export const TopicTitleCell: React.FC<CellContext<Topic, unknown>> = ({
  row: { original },
}) => {
  const { internal, name } = original;
  return (
    <NavLink to={name + '/' + clusterTopicMessagesRelativePath} title={name}>
      {internal && (
        <>
          <Tag color="gray">IN</Tag>
          &nbsp;
        </>
      )}
      {name}
    </NavLink>
  );
};
