import { Test, TestingModule } from "@nestjs/testing";
import { CommentsService } from "./comments.service";
import { getModelToken } from "@nestjs/mongoose";
import { Comment } from "./schemas/comments.schema";
import { create } from "domain";
import { Types } from "mongoose";
import { UpdateCommentDto } from "./dtos/update-comment.dto";

describe('CommentsService', () => {
    let service: CommentsService;

    const mockCommentModel = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        aggregate: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: getModelToken(Comment.name),
                    useValue: mockCommentModel,
                },
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a comment and return the result', async () => {
        const author = 'mock-author-id';
        const postId = 'mock-post-id';
        const commentData = {
            content: 'mock comment content',
        };

        mockCommentModel.create.mockResolvedValue({ author, post: postId, ...commentData });

        const result = await service.create(author, postId, commentData);
        expect(result).toEqual({ author, post: postId, ...commentData });
        expect(mockCommentModel.create).toHaveBeenCalledWith({ author, post: postId, ...commentData });
        expect(mockCommentModel.create).toHaveBeenCalledTimes(1);
    });

    it('should find all comments by author', async () => {
        const author = 'mock-author-id';
        const comments = [{ author, post: 'mock-post-id', content: 'mock comment content' }];

        mockCommentModel.find.mockReturnValue(comments);

        const result = await service.findAll(author);
        expect(result).toEqual(comments);
        expect(mockCommentModel.find).toHaveBeenCalledWith({ author });
        expect(mockCommentModel.find).toHaveBeenCalledTimes(1);
    });

    it('should find a comment by id and author', async () => {
        const author = 'mock-author-id';
        const commentId = 'mock-comment-id';
        const comment = { author, post: 'mock-post-id', content: 'mock comment content' };

        mockCommentModel.findOne.mockReturnValue(comment);

        const result = await service.findOne(author, commentId);
        expect(result).toEqual(comment);
        expect(mockCommentModel.findOne).toHaveBeenCalledWith({ _id: commentId, author });
        expect(mockCommentModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should find comments by postId with authors aggregated', async () => {
        const author = new Types.ObjectId();
        const postId = new Types.ObjectId();

        const comments = [
            {
                _id: 'mock-comment-id',
                post: postId,
                content: 'mock-comment-content',
                createdAt: new Date(),
                updatedAt: new Date(),
                authorDetails: {
                    _id: author,
                    name: 'mock-author-name',
                    email: 'mock-author-email'
                }
            }
        ];

        mockCommentModel.aggregate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(comments),
        });

        const result = await service.findByPostIdWithAuthorsAggregated(author, postId);
        expect(result).toEqual(comments);
        expect(mockCommentModel.aggregate).toHaveBeenCalledWith([
            { $match: { author, post: postId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                },
            },
            { $unwind: '$authorDetails' },
            {
                $project: {
                    _id: 1,
                    post: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    authorDetails: {
                        _id: '$authorDetails._id',
                        name: '$authorDetails.name',
                        email: '$authorDetails.email',
                    },
                },
            },
        ]);
        expect(mockCommentModel.aggregate).toHaveBeenCalledTimes(1);
    });

    it('should update a comment and return the updated comment', async () => {
        const author = new Types.ObjectId();
        const commentId = new Types.ObjectId();
        const commentData: UpdateCommentDto = {
            content: 'updated mock comment content',
        };

        mockCommentModel.findOneAndUpdate.mockResolvedValue({ author, post: 'mock-post-id', ...commentData });

        const result = await service.update(author, commentId, commentData);
        expect(result).toEqual({ author, post: 'mock-post-id', ...commentData });
        expect(mockCommentModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: commentId, author },
            commentData,
            { new: true },
        );
        expect(mockCommentModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should remove a comment and return the deleted comment', async () => {
        const author = new Types.ObjectId();
        const commentId = new Types.ObjectId();
        const comment = { author, post: 'mock-post-id', content: 'mock comment content' };

        mockCommentModel.findOneAndDelete.mockResolvedValue(comment);

        const result = await service.remove(author, commentId);
        expect(result).toEqual(comment);
        expect(mockCommentModel.findOneAndDelete).toHaveBeenCalledWith({ _id: commentId, author });
        expect(mockCommentModel.findOneAndDelete).toHaveBeenCalledTimes(1);
    });
});
