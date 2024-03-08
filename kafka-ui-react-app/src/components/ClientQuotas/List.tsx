import React from 'react';
import PageHeading from 'components/common/PageHeading/PageHeading';
import Search from 'components/common/Search/Search';
import { ControlPanelWrapper } from 'components/common/ControlPanel/ControlPanel.styled';
import useAppParams from 'lib/hooks/useAppParams';
import { ClusterNameRoute } from 'lib/paths';
import { ColumnDef } from '@tanstack/react-table';
import Table from 'components/common/NewTable';
import { useSearchParams } from 'react-router-dom';
import { PER_PAGE } from 'lib/constants';
import { useClientQuotas } from 'lib/hooks/api/clientQuotas';
import { ClientQuotas } from 'generated-sources';
import { formatBytes } from 'lib/dataRateHelpers';

import * as S from './List.styled';

const List = () => {
  const { clusterName } = useAppParams<ClusterNameRoute>();
  const [searchParams] = useSearchParams();

  const {
    data: clientQuotas,
    isSuccess,
    isFetching,
  } = useClientQuotas({
    clusterName,
  });

  const filteredQuotas = React.useMemo((): ClientQuotas[] => {
    if (!isSuccess) return [];
    const q = searchParams.get('q')?.toLocaleLowerCase() || '';
    return clientQuotas
      ?.map((c) => {
        return { ...c, user: c.user?.replace('User:', '') };
      })
      .filter(
        (c) =>
          c.user?.toLocaleLowerCase().includes(q) ||
          c.clientId?.toLocaleLowerCase().includes(q) ||
          c.ip?.toLocaleLowerCase().includes(q)
      );
  }, [searchParams, isSuccess, clientQuotas]);

  const formatQuotaKey = (input: string) => {
    return input
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatQuotaValue = (key: string, val: number | undefined) => {
    if (!val) return '';
    if (key === 'consumer_byte_rate' || key === 'producer_byte_rate')
      return `${formatBytes(val, 0)}/s`;
    if (key === 'request_percentage') return `${val}%`;
    if (
      key === 'connection_creation_rate' ||
      key === 'controller_mutation_rate'
    )
      return `${val}/s`;
    return val;
  };

  const columns = React.useMemo<ColumnDef<ClientQuotas>[]>(
    () => [
      {
        header: 'User',
        accessorKey: 'user',
      },
      {
        header: 'Client Id',
        accessorKey: 'clientId',
      },
      {
        header: 'IP',
        accessorKey: 'ip',
      },
      {
        header: 'Quotas',
        accessorKey: 'quotas',
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: ({ getValue }) => {
          const quotas = getValue<{ [key: string]: number | undefined }>();
          if (!quotas) return null;
          return (
            <>
              {Object.keys(quotas).map((k) => {
                return (
                  <S.QuotaCell key={k}>
                    <S.Chip>
                      <span>{formatQuotaKey(k)}:</span>
                      {formatQuotaValue(k, quotas[k])}
                    </S.Chip>
                  </S.QuotaCell>
                );
              })}
            </>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <PageHeading text="Quotas" />
      <ControlPanelWrapper hasInput>
        <Search placeholder="Search by User, Client or IP" />
      </ControlPanelWrapper>
      <Table
        columns={columns}
        pageCount={(filteredQuotas.length || 0) / PER_PAGE}
        data={filteredQuotas}
        emptyMessage={isSuccess ? 'No quotas found' : 'Loading...'}
        enableSorting
        disabled={isFetching}
      />
    </>
  );
};

export default List;
