import { clientQuotasClient as api } from 'lib/api';
import { useQuery } from '@tanstack/react-query';
import { ClusterName } from 'redux/interfaces';

type UseClientQuotasProps = {
  clusterName: ClusterName;
};

export function useClientQuotas(props: UseClientQuotasProps) {
  const { clusterName } = props;
  return useQuery(
    ['clusters', clusterName, 'clientQuotas'],
    () => api.listQuotas(props),
    { suspense: false, keepPreviousData: true }
  );
}
