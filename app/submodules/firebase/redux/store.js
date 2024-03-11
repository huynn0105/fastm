import { CHAT_CENTER_STATES } from './actions/app';

const initialState = {

  chatCenterState: CHAT_CENTER_STATES.UN_INITED,

  isFetchThreadsProcessing: false,
  isThreadsCanLoadMore: true,
  allThreads: [],
  openingThread: false,

  blockedUsers: [],
  isGetBlockedUsersProcessing: false,
  blockedThreads: [],

  chatThread: null,
  chatMembers: {},
  isFetchChatMessagesProcessing: false,
  isFetchChatNewMessagesProcessing: false,
  isChatMessagesCanLoadMore: true,
  chatMessages: [],
  isChatMessagesAdded: {},
  isChatImagesCanLoadMore: true,
  chatImages: [],

  isFetchingChatImageMessages: false,
  chatVideos: [],
  isFetchingChatVideoMessages: false,
  typingThreads: {},

};

export default initialState;
