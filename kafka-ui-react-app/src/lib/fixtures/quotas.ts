import { ClientQuotas } from 'generated-sources';

export const quotaPayload: ClientQuotas[] = [
  {
    user: 'User:user1',
    clientId: '',
    quotas: {
      consumer_byte_rate: 300.0,
      producer_byte_rate: 2000.0,
    },
  },
  {
    user: 'User:user2',
    clientId: 'consumer',
    quotas: {
      consumer_byte_rate: 300.0,
    },
  },
  {
    clientId: 'producer',
    quotas: {
      producer_byte_rate: 2000.0,
    },
  },
  {
    ip: '192.168.0.0',
    quotas: {
      connection_creation_rate: 3,
    },
  },
];
