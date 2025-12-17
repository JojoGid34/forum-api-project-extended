const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeCommentUseCase.execute({
      threadId,
      commentId,
      userId: credentialId,
    });

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = LikesHandler;
