const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    // Mock Data dari Repository
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-01-01',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2023-01-01',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: '2023-01-02',
        content: 'sebuah comment kasar',
        is_delete: true, // Komen dihapus
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        comment_id: 'comment-1',
        username: 'johndoe',
        date: '2023-01-01',
        content: 'sebuah balasan',
        is_delete: false,
      },
      {
        id: 'reply-2',
        comment_id: 'comment-1',
        username: 'dicoding',
        date: '2023-01-02',
        content: 'balasan kasar',
        is_delete: true, // Reply dihapus
      },
    ];

    // Dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking Implementation
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockResolvedValue();
    mockThreadRepository.getThreadById = jest.fn()
      .mockResolvedValue(mockThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockResolvedValue(mockComments);
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockResolvedValue(mockReplies);

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const result = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload);

    // Assert Structure & Content Replacement
    expect(result).toEqual({
      ...mockThread,
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2023-01-01',
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-1',
              username: 'johndoe',
              date: '2023-01-01',
              content: 'sebuah balasan',
            },
            {
              id: 'reply-2',
              username: 'dicoding',
              date: '2023-01-02',
              content: '**balasan telah dihapus**', // Harus berubah
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2023-01-02',
          content: '**komentar telah dihapus**', // Harus berubah
          replies: [],
        },
      ],
    });
  });
});
