import {
  Topic,
  TopicConfig,
  TopicCreation,
  TopicMessage,
  TopicMessageConsuming,
  TopicMessageNextPageCursor,
} from 'generated-sources';

export type TopicName = Topic['name'];

export interface TopicConfigParams {
  [paramName: string]: TopicConfig;
}

export interface TopicConfigByName {
  byName: TopicConfigParams;
}

interface TopicFormCustomParams {
  byIndex: TopicConfigParams;
  allIndexes: TopicName[];
}

export type TopicFormFormattedParams = TopicCreation['configs'];

interface TopicFormDataModified {
  name: string;
  partitions: number;
  replicationFactor: number;
  minInSyncReplicas: number;
  cleanupPolicy: string;
  retentionMs: number;
  retentionBytes: number;
  maxMessageBytes: number;
  customParams: TopicFormCustomParams;
}

export type TopicFormDataRaw = Partial<TopicFormDataModified>;

export interface TopicFormData {
  name: string;
  partitions: number;
  replicationFactor: number;
  minInSyncReplicas: number;
  cleanupPolicy: string;
  retentionMs: number;
  maxMessageBytes: number;
  customParams: {
    name: string;
    value: string;
  }[];
}

export interface TopicParsedMessage extends TopicMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyJson?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentJson?: any;
}

export interface TopicMessagesState {
  allMessages: TopicParsedMessage[];
  messages: TopicParsedMessage[];
  phase?: string;
  meta: TopicMessageConsuming;
  messageEventType?: string;
  isFetching: boolean;
  cursor?: TopicMessageNextPageCursor;
  currentPage: number;
  lastLoadedPage: number;
  messageKeyFields: string[];
  messageContentFields: string[];
}
