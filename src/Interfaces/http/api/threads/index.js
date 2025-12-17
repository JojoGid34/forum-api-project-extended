const ThreadsHandler = require('./handler');
const CommentsHandler = require('./CommentsHandler');
const RepliesHandler = require('./RepliesHandler');
const LikesHandler = require('./LikesHandler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  version: '1.0.0',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);
    const commentsHandler = new CommentsHandler(container);
    const repliesHandler = new RepliesHandler(container);
    const likesHandler = new LikesHandler(container);

    // Masukkan ketiga handler ke fungsi routes
    server.route(routes(threadsHandler, commentsHandler, repliesHandler, likesHandler));
  },
};
