import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTheme } from 'styled-components';
import PageHeading from 'components/common/PageHeading/PageHeading';
import Table from 'components/common/NewTable';
import DeleteIcon from 'components/common/Icons/DeleteIcon';
import { useConfirm } from 'lib/hooks/useConfirm';
import useAppParams from 'lib/hooks/useAppParams';
import { useAcls, useDeleteAcl } from 'lib/hooks/api/acl';
import { ClusterName } from 'redux/interfaces';
import {
  KafkaAcl,
  KafkaAclNamePatternType,
  KafkaAclPermissionEnum,
} from 'generated-sources';
import { ControlPanelWrapper } from 'components/common/ControlPanel/ControlPanel.styled';
import Search from 'components/common/Search/Search';
import MultiSelect from 'components/common/MultiSelect/MultiSelect.styled';
import { Option } from 'react-multi-select-component';
import { useSearchParams } from 'react-router-dom';
import CsvDownloader from 'react-csv-downloader';
import { Button } from 'components/common/Button/Button';
import ArrowDownIcon from 'components/common/Icons/ArrowDownIcon';

import * as S from './List.styled';

const ACList: React.FC = () => {
  const { clusterName } = useAppParams<{ clusterName: ClusterName }>();
  const theme = useTheme();
  const { data: aclList, isSuccess } = useAcls(clusterName);
  const { deleteResource } = useDeleteAcl(clusterName);
  const modal = useConfirm(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [rowId, setRowId] = React.useState('');

  const onDeleteClick = (acl: KafkaAcl | null) => {
    if (acl) {
      modal('Are you sure want to delete this ACL record?', () =>
        deleteResource(acl)
      );
    }
  };

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
        header: 'Resource Name',
        accessorKey: 'resourceName',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue, row }) => {
          let chipType;
          if (
            row.original.namePatternType === KafkaAclNamePatternType.PREFIXED
          ) {
            chipType = 'default';
          }

          if (
            row.original.namePatternType === KafkaAclNamePatternType.LITERAL
          ) {
            chipType = 'secondary';
          }
          return (
            <S.PatternCell>
              {getValue<string>()}
              {chipType ? (
                <S.Chip chipType={chipType}>
                  {row.original.namePatternType.toLowerCase()}
                </S.Chip>
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
      {
        id: 'delete',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ row }) => {
          return (
            <S.DeleteCell onClick={() => onDeleteClick(row.original)}>
              <DeleteIcon
                fill={
                  rowId === row.id ? theme.acl.table.deleteIcon : 'transparent'
                }
              />
            </S.DeleteCell>
          );
        },
        size: 76,
      },
    ],
    [rowId]
  );

  const onRowHover = (value: unknown) => {
    if (value && typeof value === 'object' && 'id' in value) {
      setRowId(value.id as string);
    }
  };

  const distinctPrincipals = React.useMemo(() => {
    if (!isSuccess) return [];
    return [...new Set(aclList?.map((a) => a.principal))].map((p) => ({
      label: p,
      value: p,
    }));
  }, [isSuccess, aclList]);

  const handleSelectPrincipals = (options: Option[] | undefined) => {
    const selected = options?.filter((o) => o.value);
    if (selected && selected.length !== distinctPrincipals?.length)
      searchParams.set('principals', selected?.map((s) => s.value).join(','));
    else searchParams.delete('principals');
    setSearchParams(searchParams);
  };

  const selectedPrincipals = React.useMemo(() => {
    const principals = searchParams.get('principals');
    if (!principals && principals !== '') {
      return distinctPrincipals;
    }
    return principals?.split(',')?.map((r) => ({
      label: r,
      value: r,
    }));
  }, [searchParams, distinctPrincipals]);

  const distinctResourceTypes = React.useMemo(() => {
    if (!isSuccess) return [];
    return [...new Set(aclList?.map((a) => a.resourceType))].map((p) => ({
      label: p,
      value: p,
    }));
  }, [isSuccess, aclList]);

  const handleSelectResourceTypes = (options: Option[] | undefined) => {
    const selected = options?.filter((o) => o.value);
    if (selected && selected.length !== distinctResourceTypes?.length)
      searchParams.set(
        'resourceTypes',
        selected?.map((s) => s.value).join(',')
      );
    else searchParams.delete('resourceTypes');
    setSearchParams(searchParams);
  };

  const selectedResourceTypes = React.useMemo(() => {
    const resourceTypes = searchParams.get('resourceTypes');
    if (!resourceTypes && resourceTypes !== '') {
      return distinctResourceTypes;
    }

    return resourceTypes.split(',')?.map((r) => ({
      label: r,
      value: r,
    }));
  }, [searchParams, distinctResourceTypes]);

  const filteredAcls = React.useMemo(() => {
    if (!isSuccess) return [];
    const principals = searchParams.get('principals')?.split(',');
    const resourceTypes = searchParams.get('resourceTypes')?.split(',');
    const resourceName = searchParams.get('q')?.toLocaleLowerCase() || '';

    return aclList?.filter(
      (a) =>
        (!principals || principals.includes(a.principal)) &&
        (!resourceTypes || resourceTypes.includes(a.resourceType)) &&
        (resourceName === '' ||
          a.resourceName.toLocaleLowerCase().includes(resourceName))
    );
  }, [isSuccess, aclList, searchParams]);

  const downloadAcls = (): { [key: string]: string | null | undefined }[] => {
    const acls =
      filteredAcls?.map((a) => {
        const acl: { [key: string]: string | null | undefined } = {};
        columns.forEach((c) => {
          const { accessorKey } = c as { accessorKey?: string };
          if (accessorKey) acl[accessorKey] = a[accessorKey as keyof KafkaAcl];
        });
        return acl;
      }) || [];
    return acls;
  };

  const downloadColumnsDef = () => {
    return (
      columns
        .filter((c) => {
          const col = c as { accessorKey?: string; header?: string };
          return col.accessorKey && col.header;
        })
        .map((c) => {
          const col = c as { accessorKey: string; header: string };
          return {
            displayName: col.header,
            id: col.accessorKey,
          };
        }) || []
    );
  };

  return (
    <>
      <PageHeading text="Access Control List" />
      <ControlPanelWrapper hasInput style={{ margin: '16px 0 20px' }}>
        <Search placeholder="Search by Resource Name" />
        <MultiSelect
          options={distinctPrincipals || []}
          // filterOptions={filterOptions}
          value={selectedPrincipals || []}
          onChange={handleSelectPrincipals}
          labelledBy="Select Principals"
          overrideStrings={{ allItemsAreSelected: 'All Principals' }}
        />
        <MultiSelect
          options={distinctResourceTypes || []}
          // filterOptions={filterOptions}
          value={selectedResourceTypes || []}
          onChange={handleSelectResourceTypes}
          labelledBy="Select Resource Types"
          overrideStrings={{ allItemsAreSelected: 'All Resource Types' }}
        />
        <CsvDownloader
          filename="ACL List"
          datas={downloadAcls}
          columns={downloadColumnsDef()}
        >
          <Button buttonType="secondary" buttonSize="M">
            <ArrowDownIcon />
            Download
          </Button>
        </CsvDownloader>
      </ControlPanelWrapper>
      <Table
        columns={columns}
        data={filteredAcls ?? []}
        emptyMessage="No ACL items found"
        onRowHover={onRowHover}
        onMouseLeave={() => setRowId('')}
      />
    </>
  );
};

export default ACList;
