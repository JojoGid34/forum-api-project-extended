class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    // 1. Cek ketersediaan thread dulu
    await this._threadRepository.verifyThreadAvailability(threadId);

    // 2. Ambil semua data
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    // 3. Gabungkan Comment dan Reply + Logic Soft Delete
    thread.comments = comments.map((comment) => {
      // Ambil reply yang parent-nya adalah comment ini
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }));

      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        replies: commentReplies,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
        likeCount: comment.likeCount,
      };
    });

    return thread;
  }
}

module.exports = GetThreadUseCase;
