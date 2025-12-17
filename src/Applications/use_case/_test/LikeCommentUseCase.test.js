const LikeCommentUseCase = require('../LikeCommentUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('LikeCommentUseCase', () => {
  it('should orchestrate the add like action correctly when not liked yet', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikeStatus = jest.fn(() => Promise.resolve(false)); // Belum dilike
    mockLikeRepository.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.checkLikeStatus).toHaveBeenCalledWith(
      useCasePayload.userId, useCasePayload.commentId,
    );
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(
      useCasePayload.userId, useCasePayload.commentId,
    );
  });

  it('should orchestrate the delete like action correctly when already liked', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLikeStatus = jest.fn(() => Promise.resolve(true)); // Sudah dilike
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(
      useCasePayload.commentId,
    );
    expect(mockLikeRepository.checkLikeStatus).toHaveBeenCalledWith(
      useCasePayload.userId, useCasePayload.commentId,
    );
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
      useCasePayload.userId, useCasePayload.commentId,
    );
  });
});
