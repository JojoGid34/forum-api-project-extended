class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;

    // 1. Pastikan Thread dan Comment ada (Validasi)
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.verifyCommentAvailability(commentId);

    // 2. Cek apakah user sudah like komen ini?
    const isLiked = await this._likeRepository.checkLikeStatus(userId, commentId);

    // 3. Logika Toggle (Like/Unlike)
    if (isLiked) {
      await this._likeRepository.deleteLike(userId, commentId);
    } else {
      await this._likeRepository.addLike(userId, commentId);
    }
  }
}

module.exports = LikeCommentUseCase;
