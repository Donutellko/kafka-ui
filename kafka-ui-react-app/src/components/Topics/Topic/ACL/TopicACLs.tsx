import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  KafkaAcl,
  KafkaAclNamePatternType,
  KafkaAclPermissionEnum,
} from 'generated-sources';
import { useTopicACLs } from 'lib/hooks/api/topics';
import useAppParams from 'lib/hooks/useAppParams';
import { RouteParamsClusterTopic } from 'lib/paths';
import Table from 'components/common/NewTable';

import * as S from './TopicACLs.styled';

const TopicACLs: React.FC = () => {
  const { clusterName, topicName } = useAppParams<RouteParamsClusterTopic>();

  const { data: aclList } = useTopicACLs({
    clusterName,
    resourceName: topicName,
    namePatternType: KafkaAclNamePatternType.MATCH,
  });

  // const [rowId, setRowId] = React.useState('');

  const columns = React.useMemo<ColumnDef<KafkaAcl>[]>(
    () => [
      {
        header: 'Principal',
        accessorKey: 'principal',
        size: 257,
      },
      {
        header: 'Resource',
        accessorKey: 'resourceType',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue }) => (
          <S.EnumCell>{getValue<string>().toLowerCase()}</S.EnumCell>
        ),
        size: 145,
      },
      {
        header: 'Pattern Type',
        accessorKey: 'namePatternType',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue }) => {
          let chipType;
          const patternType = getValue<KafkaAclNamePatternType>();
          if (patternType === KafkaAclNamePatternType.PREFIXED) {
            chipType = 'default';
          }

          if (patternType === KafkaAclNamePatternType.LITERAL) {
            chipType = 'secondary';
          }
          return (
            <S.PatternCell>
              {getValue<string>()}
              {chipType ? (
                <S.Chip chipType={chipType}>{patternType.toLowerCase()}</S.Chip>
              ) : null}
            </S.PatternCell>
          );
        },
        size: 257,
      },
      {
        header: 'Host',
        accessorKey: 'host',
        size: 257,
      },
      {
        header: 'Operation',
        accessorKey: 'operation',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue }) => (
          <S.EnumCell>{getValue<string>().toLowerCase()}</S.EnumCell>
        ),
        size: 121,
      },
      {
        header: 'Permission',
        accessorKey: 'permission',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue }) => (
          <S.Chip
            chipType={
              getValue<string>() === KafkaAclPermissionEnum.ALLOW
                ? 'success'
                : 'danger'
            }
          >
            {getValue<string>().toLowerCase()}
          </S.Chip>
        ),
        size: 111,
      },
      //   {
      //     id: 'delete',
      //     // eslint-disable-next-line react/no-unstable-nested-components
      //     cell: ({ row }) => {
      //       return (
      //         <S.DeleteCell onClick={() => onDeleteClick(row.original)}>
      //           <DeleteIcon
      //             fill={
      //               rowId === row.id ? theme.acl.table.deleteIcon : 'transparent'
      //             }
      //           />
      //         </S.DeleteCell>
      //       );
      //     },
      //     size: 76,
      //   },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      data={aclList ?? []}
      emptyMessage="No ACL items found"
      // onRowHover={onRowHover}
      // onMouseLeave={() => setRowId('')}
    />
  );
};

export default TopicACLs;
