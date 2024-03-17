import { createSlice } from '@reduxjs/toolkit';
import { TopicMessagesState, TopicParsedMessage } from 'redux/interfaces';
import { TopicMessage } from 'generated-sources';

const PER_PAGE = 100;

const parseToJson = (jsonString: string | undefined) => {
  if (!jsonString) return {};
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return {};
  }
};

const parseMessageToJson = (message: TopicMessage) => {
  return {
    ...message,
    keyJson: parseToJson(message.key),
    contentJson: parseToJson(message.content),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFieldsOfJsonObject = (obj: any): string[] => {
  if (!obj) return [];
  const keys: string[] = [];

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nestedKeys = getFieldsOfJsonObject(obj[key]);
      keys.push(key);
      keys.push(...nestedKeys.map((nestedKey) => `${key}.${nestedKey}`));
    } else {
      keys.push(key);
    }
  });

  return keys;
};

export const initialState: TopicMessagesState = {
  allMessages: [],
  messages: [],
  meta: {
    bytesConsumed: 0,
    elapsedMs: 0,
    messagesConsumed: 0,
    isCancelled: false,
  },
  messageEventType: '',
  isFetching: false,
  currentPage: 0,
  lastLoadedPage: 0,
  messageKeyFields: [],
  messageContentFields: [],
};

const topicMessagesSlice = createSlice({
  name: 'topicMessages',
  initialState,
  reducers: {
    addTopicMessage: (state, action) => {
      const parsedMessage = parseMessageToJson(action.payload.message);
      const allmessages: TopicParsedMessage[] = action.payload.prepend
        ? [parsedMessage, ...state.allMessages]
        : [...state.allMessages, parsedMessage];

      const messages: TopicParsedMessage[] = action.payload.prepend
        ? [action.payload.message, ...state.messages]
        : [...state.messages, action.payload.message];

      const messageKeyFields = [
        ...new Set([
          ...state.messageKeyFields,
          ...getFieldsOfJsonObject(parsedMessage.keyJson),
        ]),
      ] as string[];

      const messageContentFields = [
        ...new Set([
          ...state.messageContentFields,
          ...getFieldsOfJsonObject(parsedMessage.contentJson),
        ]),
      ] as string[];

      return {
        ...state,
        allMessages: allmessages,
        messages,
        messageKeyFields,
        messageContentFields,
      };
    },
    resetTopicMessages: (state) => {
      return {
        ...initialState,
        currentPage: state.currentPage,
        allMessages: state.allMessages,
      };
    },
    resetAllTopicMessages: () => initialState,
    updateTopicMessagesPhase: (state, action) => {
      state.phase = action.payload;
    },
    updateTopicMessagesMeta: (state, action) => {
      state.meta = action.payload;
    },
    setTopicMessagesFetchingStatus: (state, action) => {
      state.isFetching = action.payload;
    },

    setMessageEventType: (state, action) => {
      state.messageEventType = action.payload;
    },
    updateTopicMessagesCursor: (state, action) => {
      state.cursor = action.payload;
    },
    setTopicMessagesCurrentPage: (state, action) => {
      if (state.currentPage !== action.payload) {
        const messages: TopicMessage[] = state.allMessages.slice(
          (action.payload - 1) * PER_PAGE,
          (action.payload - 1) * PER_PAGE + PER_PAGE
        );
        return {
          ...state,
          currentPage: action.payload,
          messages,
        };
      }
      return {
        ...state,
      };
    },
    setTopicMessagesLastLoadedPage: (state, action) => {
      state.lastLoadedPage = action.payload;
    },
  },
});

export const {
  addTopicMessage,
  resetTopicMessages,
  updateTopicMessagesPhase,
  updateTopicMessagesMeta,
  setTopicMessagesFetchingStatus,
  setMessageEventType,
  updateTopicMessagesCursor,
  setTopicMessagesCurrentPage,
  setTopicMessagesLastLoadedPage,
  resetAllTopicMessages,
} = topicMessagesSlice.actions;

export default topicMessagesSlice.reducer;
