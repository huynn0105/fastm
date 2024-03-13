// export { combineReducers } from 'redux';

export {
  chatCenterState,
  // myUser,
} from './app';

export {
  isFetchThreadsProcessing,
  isThreadsCanLoadMore,
  allThreads,
  openingThread,
  typingThreads,
} from './thread';

export {
  chatThread,
  chatMembers,
  isFetchChatMessagesProcessing,
  isFetchChatNewMessagesProcessing,
  isChatMessagesCanLoadMore,
  chatMessages,
  isChatMessagesAdded,
  isChatImagesCanLoadMore,
  chatImages,
  isFetchingChatImageMessages,
  chatVideos,
  isFetchingChatVideoMessages,
} from './chat';

export {
  isGetBlockedUsersProcessing,
  blockedUsers,
  blockedThreads,
} from './blockedUsers';

// const appReducer = combineReducers({

//   chatCenterState,
//   myUser,

//   isFetchThreadsProcessing,
//   isThreadsCanLoadMore,
//   allThreads,
//   openingThread,

//   isGetBlockedUsersProcessing,
//   blockedUsers,
//   blockedThreads,

//   chatThread,
//   chatMembers,
//   isFetchChatMessagesProcessing,
//   isFetchChatNewMessagesProcessing,
//   isChatMessagesCanLoadMore,
//   chatMessages,
//   isChatMessagesAdded,
//   isChatImagesCanLoadMore,
//   chatImages,
// });

// const rootReducer = (state, action) => {
//   return appReducer(state, action);
// };

// export default rootReducer;
