const routes = (threadsHandler, commentsHandler, repliesHandler, likesHandler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: threadsHandler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: commentsHandler.postCommentHandler, // Pakai commentsHandler
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: commentsHandler.deleteCommentHandler, // Pakai commentsHandler
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: threadsHandler.getThreadHandler,
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: repliesHandler.postReplyHandler, // Pakai repliesHandler
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: repliesHandler.deleteReplyHandler, // Pakai repliesHandler
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: likesHandler.putLikeHandler,
    options: {
      auth: 'forumapi_jwt', // Wajib login
    },
  },
];

module.exports = routes;
